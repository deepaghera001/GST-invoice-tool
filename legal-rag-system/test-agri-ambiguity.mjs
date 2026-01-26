import { LegalSearchEngine } from './lib/search.mjs';
import { extractCandidatesGroq } from './lib/extract-candidates-groq.mjs';

console.log('Testing Agricultural Income Ambiguity\n');

const engine = new LegalSearchEngine('./vector-db/income_tax/FINANCE_ACT_2024/embeddings.json');
await engine.initialize();

// Query for the specific ambiguous text
const query = 'agricultural income Paragraph A section 115BAC rate schedule';
const results = await engine.search(query, 5);

console.log('Retrieved chunks:\n');
results.forEach((r, i) => {
  console.log(`${i+1}. Page ${r.page_number}, Score: ${r.similarity.toFixed(3)}`);
  console.log(`   ${r.text.substring(0, 200)}...\n`);
});

const chunks = results.map(r => ({ text: r.text, page: r.page_number }));

console.log('\n' + '='.repeat(60));
console.log('Extracting computation method:\n');

try {
  const result = await extractCandidatesGroq(chunks, 'definition');
  console.log('Candidates:');
  console.log(JSON.stringify(result.candidates, null, 2));
  
  const unclear = result.candidates.filter(c => c.status === 'unclear');
  if (unclear.length > 0) {
    console.log(`\n✅ AMBIGUITY DETECTED: ${unclear.length} unclear candidates`);
    unclear.forEach(c => {
      console.log(`\n  Reason: ${c.ambiguity_reason}`);
      console.log(`  Conflicts: ${c.conflicting_candidates?.length || 0}`);
    });
  } else {
    console.log(`\n⚠️  No ambiguity detected (all candidates marked 'candidate')`);
    console.log(`   The text says "Paragraph A or sub-section (1A) of section 115BAC"`);
    console.log(`   This is a choice-dependent condition, not a deterministic rule.`);
  }
} catch (err) {
  console.error('Error:', err.message);
}
