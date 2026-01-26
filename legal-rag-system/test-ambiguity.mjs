/**
 * Test Stage 2.3: Ambiguity handling
 * 
 * Tests that extractor returns status="unclear" when multiple conflicting values exist
 */

import { LegalSearchEngine } from './lib/search.mjs';
import { extractCandidates, extractCandidatesOllama } from './lib/extract-candidates.mjs';

async function main() {
  console.log('Stage 2.3 Test: Ambiguity Handling\n');
  console.log('='.repeat(60));

  // Query that should return multiple surcharge rates
  const query = 'surcharge rate percentage';
  console.log(`\nQuery: "${query}"\n`);

  // Stage 1: Retrieve relevant chunks
  console.log('Stage 1: Retrieving chunks...');
  const searchEngine = new LegalSearchEngine('./vector-db/income_tax/FINANCE_ACT_2024/embeddings.json');
  await searchEngine.initialize();
  const results = await searchEngine.search(query, 10);  // Get more chunks to find conflicts
  
  console.log(`Found ${results.length} chunks:`);
  results.forEach((r, i) => {
    console.log(`  ${i + 1}. Page ${r.page_number}, Score: ${r.similarity.toFixed(3)}`);
    console.log(`     "${r.text.substring(0, 80)}..."`);
  });

  // Prepare chunks for extraction
  const chunks = results.map(r => ({
    text: r.text,
    page: r.page_number,
  }));

  const provider = process.env.EXTRACTION_PROVIDER;
  if (!provider) {
    throw new Error('EXTRACTION_PROVIDER must be explicitly set (claude | ollama)');
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Stage 2.3: Extracting rates with ${provider}...\n`);

  try {
    let result;
    
    if (provider === 'ollama') {
      result = await extractCandidatesOllama(chunks, 'rate');
    } else {
      result = await extractCandidates(chunks, 'rate');
    }

    console.log('✅ Extraction complete!\n');
    console.log(`Found ${result.candidates.length} valid candidates:`);
    console.log(JSON.stringify(result.candidates, null, 2));

    if (result.errors) {
      console.log(`\n⚠️  ${result.errors.length} candidates failed validation:`);
      console.log(JSON.stringify(result.errors, null, 2));
    }

    // Check ambiguity handling
    const unclearCandidates = result.candidates.filter(c => c.status === 'unclear');
    const clearCandidates = result.candidates.filter(c => c.status === 'candidate');
    
    console.log('\n' + '='.repeat(60));
    console.log('AMBIGUITY TEST RESULTS:');
    console.log(`  Total candidates: ${result.candidates.length}`);
    console.log(`  Clear: ${clearCandidates.length}`);
    console.log(`  Unclear: ${unclearCandidates.length}`);
    console.log(`  Failed validation: ${result.errors ? result.errors.length : 0}`);
    
    if (unclearCandidates.length > 0) {
      console.log('\n✅ PASS: System detected ambiguity');
      console.log('Unclear candidates:');
      unclearCandidates.forEach(c => {
        console.log(`  - Reason: ${c.ambiguity_reason}`);
        console.log(`    Conflicts: ${JSON.stringify(c.conflicting_candidates)}`);
      });
    } else {
      console.log('\n⚠️  NOTE: No unclear candidates found');
      console.log('This might mean:');
      console.log('  1. No conflicting rates in retrieved chunks');
      console.log('  2. LLM picked one value instead of marking unclear');
      console.log('  3. Query needs refinement to find conflicts');
    }

    console.log('\n✅ Stage 2.3 test completed');

  } catch (err) {
    console.error('\n❌ Extraction failed:');
    console.error(err.message);
    if (err.stack) {
      console.error('\nStack trace:');
      console.error(err.stack);
    }
    process.exit(1);
  }
}

main();
