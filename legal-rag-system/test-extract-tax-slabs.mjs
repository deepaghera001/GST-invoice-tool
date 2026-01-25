/**
 * Test Stage 2.2: Extract tax slab candidates
 * 
 * Tests the extractor with actual retrieval from Stage 1
 */

import { LegalSearchEngine } from './lib/search.mjs';
import { extractCandidates, extractCandidatesOllama } from './lib/extract-candidates.mjs';

async function main() {
  console.log('Stage 2.2 Test: Tax Slab Extraction\n');
  console.log('=' .repeat(60));

  // Query for tax slabs
  const query = 'income tax slabs and rates for individuals';
  console.log(`\nQuery: "${query}"\n`);

  // Stage 1: Retrieve relevant chunks
  console.log('Stage 1: Retrieving chunks...');
  const searchEngine = new LegalSearchEngine('./vector-db/income_tax/FINANCE_ACT_2024/embeddings.json');
  await searchEngine.initialize();
  const results = await searchEngine.search(query, 5);
  
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

  // NOTE: This is an integration test (Stage 1 + Stage 2.2), not a unit test.
  // Choose provider
  const provider = process.env.EXTRACTION_PROVIDER;
  if (!provider) {
    throw new Error('EXTRACTION_PROVIDER must be explicitly set (claude | ollama)');
  }
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Stage 2.2: Extracting with ${provider}...\n`);

  try {
    let result;
    
    if (provider === 'ollama') {
      result = await extractCandidatesOllama(chunks, 'tax_slab');
    } else {
      result = await extractCandidates(chunks, 'tax_slab');
    }

    console.log('✅ Extraction complete!\n');
    console.log(`Found ${result.candidates.length} valid candidates:`);
    console.log(JSON.stringify(result.candidates, null, 2));

    if (result.errors) {
      console.log(`\n⚠️  ${result.errors.length} candidates failed validation:`);
      console.log(JSON.stringify(result.errors, null, 2));
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY:');
    console.log(`  Retrieved chunks: ${results.length}`);
    console.log(`  Valid candidates: ${result.candidates.length}`);
    console.log(`  Failed validation: ${result.errors ? result.errors.length : 0}`);
    
    const clearCandidates = result.candidates.filter(c => c.status === 'candidate');
    const unclearCandidates = result.candidates.filter(c => c.status === 'unclear');
    const blockedCandidates = result.candidates.filter(c => c.status === 'blocked');
    
    console.log(`  Status breakdown:`);
    console.log(`    - Clear: ${clearCandidates.length}`);
    console.log(`    - Unclear: ${unclearCandidates.length}`);
    console.log(`    - Blocked: ${blockedCandidates.length}`);

    console.log('\n✅ Stage 2.2 extraction completed with schema-valid candidates');

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
