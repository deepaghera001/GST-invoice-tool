/**
 * Stage 2.3: Ambiguity Detection Test
 * 
 * Tests that the system correctly identifies and reports conflicting rules
 * instead of silently picking one.
 * 
 * CRITICAL: If this fails, the system is legally unsafe.
 */

import { LegalSearchEngine } from './lib/search.mjs';
import { extractCandidatesGroq } from './lib/extract-candidates-groq.mjs';

console.log('Stage 2.3: Ambiguity Detection Test\n');
console.log('='.repeat(60));

// Test query: Agricultural income aggregation has GENUINE AMBIGUITY
// Same individual, same total income, but TWO different rate schedules apply:
// - Paragraph A (standard regime)
// - Section 115BAC (new regime)
// The text explicitly states "Paragraph A or sub-section (1A) of section 115BAC"
// WITHOUT specifying which to use - this is a choice-dependent ambiguity.
const query = 'agricultural income total income aggregated rate paragraph 115BAC computation';

console.log(`\nQuery: "${query}"`);
console.log(`\nExpected ambiguity: Two rate schedules (Paragraph A vs 115BAC) for agricultural income aggregation\n`);

console.log('Stage 1: Retrieving chunks...');
const engine = new LegalSearchEngine('./vector-db/income_tax/FINANCE_ACT_2024/embeddings.json');
await engine.initialize();

const results = await engine.search(query, 5);
console.log(`Found ${results.length} chunks:\n`);

results.forEach((r, i) => {
  console.log(`  ${i + 1}. Page ${r.page_number}, Score: ${r.similarity.toFixed(3)}`);
  console.log(`     "${r.text.substring(0, 80)}..."\n`);
});

console.log('='.repeat(60));
console.log('Stage 2.3: Extracting with ambiguity detection...\n');

const chunks = results.map(r => ({ text: r.text, page: r.page_number }));

try {
  const result = await extractCandidatesGroq(chunks, 'rate');
  const candidates = result.candidates || [];
  const errors = result.errors || [];
  
  console.log(`✅ Extraction complete!\n`);
  console.log(`Found ${candidates.length} valid candidates${errors.length > 0 ? ` (${errors.length} failed validation)` : ''}:\n`);
  console.log(JSON.stringify(candidates, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('AMBIGUITY ANALYSIS:\n');
  
  // Count statuses
  const statusCounts = {
    candidate: candidates.filter(c => c.status === 'candidate').length,
    unclear: candidates.filter(c => c.status === 'unclear').length,
    blocked: candidates.filter(c => c.status === 'blocked').length
  };
  
  console.log(`Status breakdown:`);
  console.log(`  - Clear (candidate): ${statusCounts.candidate}`);
  console.log(`  - Unclear (ambiguous): ${statusCounts.unclear}`);
  console.log(`  - Blocked (missing data): ${statusCounts.blocked}`);
  
  // Check for proper ambiguity handling
  const unclearCandidates = candidates.filter(c => c.status === 'unclear');
  
  if (unclearCandidates.length > 0) {
    console.log(`\n✅ AMBIGUITY DETECTED (${unclearCandidates.length} unclear candidates)`);
    
    unclearCandidates.forEach((c, i) => {
      console.log(`\nUnclear candidate ${i + 1}:`);
      console.log(`  Reason: ${c.ambiguity_reason}`);
      if (c.conflicting_candidates) {
        console.log(`  Conflicts: ${c.conflicting_candidates.length} alternative interpretations`);
      }
    });
  } else {
    console.log(`\n⚠️  NO AMBIGUITY DETECTED`);
    console.log(`   Expected: At least 1 "unclear" status (multiple surcharge rates exist)`);
    console.log(`   Actual: All candidates marked as "candidate" (clear)`);
  }
  
  // Expected behavior validation
  console.log(`\n` + '='.repeat(60));
  console.log('EXPECTED BEHAVIOR:\n');
  
  const hasMultipleRates = candidates.length > 1;
  const hasUnclear = statusCounts.unclear > 0;
  const hasAmbiguityReason = unclearCandidates.some(c => c.ambiguity_reason);
  
  console.log(`✅ Multiple rate values found: ${hasMultipleRates ? 'YES' : 'NO'}`);
  console.log(`${hasUnclear ? '✅' : '❌'} System marked as "unclear": ${hasUnclear ? 'YES' : 'NO'}`);
  console.log(`${hasAmbiguityReason ? '✅' : '❌'} Ambiguity reason provided: ${hasAmbiguityReason ? 'YES' : 'NO'}`);
  
  console.log(`\n` + '='.repeat(60));
  
  if (hasMultipleRates && hasUnclear && hasAmbiguityReason) {
    console.log('✅ Stage 2.3 PASSED: System correctly handles ambiguity');
    console.log('   - Detected conflict');
    console.log('   - Refused to pick');
    console.log('   - Provided structured explanation');
  } else if (hasMultipleRates && !hasUnclear) {
    console.log('⚠️  Stage 2.3 PARTIAL: System extracted multiple rates but did NOT mark as unclear');
    console.log('   - This may be acceptable if rates apply to different categories');
    console.log('   - Verify manually: Are these truly distinct or conflicting?');
  } else {
    console.log('❌ Stage 2.3 NEEDS REVIEW: Unexpected behavior');
    console.log('   - Check if LLM is silently choosing "best" candidate');
    console.log('   - Review prompt instructions for ambiguity handling');
  }
  
} catch (err) {
  console.error('❌ Extraction failed:', err.message);
  console.error(err);
  process.exit(1);
}
