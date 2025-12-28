/**
 * Test suite for TDS penalty calculator
 * Run: npx tsx lib/tds/calculator.test.ts
 */

import { calculateTDSPenalty, TDSPenaltyInput } from './calculator';

interface TestCase {
  name: string;
  input: TDSPenaltyInput;
  expected: {
    daysLate: number;
    lateFee: number;
  };
}

const testCases: TestCase[] = [
  {
    name: 'Test 1: On-time filing (no penalty)',
    input: {
      tdsSection: '194J',
      tdsAmount: 100000,
      dueDate: new Date('2025-01-31'),
      filingDate: new Date('2025-01-31'),
    },
    expected: {
      daysLate: 0,
      lateFee: 0,
    },
  },
  {
    name: 'Test 2: 5 days late (warning zone)',
    input: {
      tdsSection: '194O',
      tdsAmount: 50000,
      dueDate: new Date('2025-02-15'),
      filingDate: new Date('2025-02-20'),
    },
    expected: {
      daysLate: 5,
      lateFee: 1000, // ₹200 × 5 = ₹1,000
    },
  },
  {
    name: 'Test 3: 15 days late (critical)',
    input: {
      tdsSection: '195',
      tdsAmount: 75000,
      dueDate: new Date('2025-01-31'),
      filingDate: new Date('2025-02-15'),
    },
    expected: {
      daysLate: 15,
      lateFee: 3000, // ₹200 × 15 = ₹3,000
    },
  },
  {
    name: 'Test 4: 30 days late (hits cap)',
    input: {
      tdsSection: 'other',
      tdsAmount: 100000,
      dueDate: new Date('2025-01-15'),
      filingDate: new Date('2025-02-14'),
    },
    expected: {
      daysLate: 30,
      lateFee: 5000, // ₹200 × 30 = ₹6,000, but capped at ₹5,000
    },
  },
];

// Test runner
function runTests() {
  console.log('🧪 Running TDS Penalty Calculator Tests\n');
  console.log('═'.repeat(70));

  let passed = 0;
  let failed = 0;

  testCases.forEach((testCase) => {
    try {
      const result = calculateTDSPenalty(testCase.input);

      const isPass =
        result.daysLate === testCase.expected.daysLate &&
        result.lateFee === testCase.expected.lateFee;

      if (isPass) {
        console.log(`✅ ${testCase.name}`);
        passed++;
      } else {
        console.log(`❌ ${testCase.name}`);
        console.log(`   Expected: `, testCase.expected);
        console.log(`   Got:      `, {
          daysLate: result.daysLate,
          lateFee: result.lateFee,
        });
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${testCase.name} (Error)`);
      console.log(`   ${error}`);
      failed++;
    }
  });

  console.log('═'.repeat(70));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests\n`);

  return failed === 0;
}

// Run tests
const success = runTests();
process.exit(success ? 0 : 1);
