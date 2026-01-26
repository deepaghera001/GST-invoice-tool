/**
 * Stage 1.10 Test: Deterministic Query Enhancement
 * 
 * Tests pattern-based query enhancement (no AI)
 * Goal: Boost casual queries from 40% → 80%+ accuracy
 */

import { LegalSearchEngine } from './lib/search.mjs';
import { enhanceQuery } from './lib/query-enhancer.mjs';

async function main() {
  console.log('Stage 1.10 Test: Deterministic Query Enhancement\n');
  console.log('='.repeat(60));

  const searchEngine = new LegalSearchEngine('./vector-db/income_tax/FINANCE_ACT_2024/embeddings.json');
  await searchEngine.initialize();

  // Test queries (casual → should be enhanced)
  const testQueries = [
    {
      name: 'Casual tax slab query',
      original: 'income tax slabs for individuals',
      expectPage: [9, 10]
    },
    {
      name: 'Surcharge query',
      original: 'surcharge rates',
      expectPage: [3, 4, 5]
    },
    {
      name: 'Legal query (should pass through)',
      original: 'section 115BAC',
      expectPage: [3]
    }
  ];

  for (const test of testQueries) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Test: ${test.name}`);
    console.log(`Original: "${test.original}"`);
    
    const enhanced = enhanceQuery(test.original);
    console.log(`Enhanced: "${enhanced}"`);
    console.log(`Changed: ${enhanced !== test.original ? 'YES ✅' : 'NO (passthrough)'}`);

    // Search with original
    console.log('\n📊 Without enhancement:');
    const originalResults = await searchEngine.search(test.original, 3, { skipEnhancement: true });
    originalResults.forEach((r, i) => {
      const match = test.expectPage.includes(r.page_number) ? '✅' : '❌';
      console.log(`  ${i + 1}. Page ${r.page_number}, Score: ${r.similarity.toFixed(3)} ${match}`);
    });

    // Search with enhancement
    console.log('\n📊 With enhancement:');
    const enhancedResults = await searchEngine.search(test.original, 3);
    enhancedResults.forEach((r, i) => {
      const match = test.expectPage.includes(r.page_number) ? '✅' : '❌';
      console.log(`  ${i + 1}. Page ${r.page_number}, Score: ${r.similarity.toFixed(3)} ${match}`);
    });

    // Analysis
    const originalHit = originalResults.some(r => test.expectPage.includes(r.page_number));
    const enhancedHit = enhancedResults.some(r => test.expectPage.includes(r.page_number));
    
    console.log('\n📈 Result:');
    console.log(`  Original: ${originalHit ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Enhanced: ${enhancedHit ? '✅ PASS' : '❌ FAIL'}`);
    
    if (!originalHit && enhancedHit) {
      console.log('  🎯 IMPROVEMENT: Enhancement fixed retrieval!');
    } else if (originalHit && enhancedHit) {
      console.log('  ✅ MAINTAINED: Both work (no regression)');
    } else if (!enhancedHit) {
      console.log('  ⚠️  NEEDS WORK: Enhancement didn\'t help');
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('SUMMARY:');
  console.log('Stage 1.10 implementation: Deterministic pattern matching');
  console.log('- NO AI (pure rules)');
  console.log('- Bidirectional (legal terms pass through)');
  console.log('- Testable (same input → same output)');
  console.log('- Modular (can disable with skipEnhancement option)');
  
  console.log('\n✅ Stage 1.10 test complete');
}

main();
