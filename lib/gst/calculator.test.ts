/**
 * Test suite for GST penalty calculator
 * Run: node --loader ts-node/esm lib/gst/calculator.test.ts
 * Or: npx tsx lib/gst/calculator.test.ts
 */

import { calculateGSTPenalty, GSTPenaltyInput } from './calculator';

interface TestCase {
  name: string;
  input: GSTPenaltyInput;
  expected: {
    daysLate: number;
    lateFee: number;
    interest: number;
    totalPenalty: number;
  };
}

const testCases: TestCase[] = [
  {
    name: 'Test 1: On-time filing (no penalty)',
    input: {
      returnType: 'GSTR1',
      taxAmount: 25000,
      dueDate: new Date('2025-01-31'),
      filingDate: new Date('2025-01-31'),
      taxPaidLate: false,
    },
    expected: {
      daysLate: 0,
      lateFee: 0,
      interest: 0,
      totalPenalty: 0,
    },
  },
  {
    name: 'Test 2: 15 days late (grace period, no penalty)',
    input: {
      returnType: 'GSTR1',
      taxAmount: 25000,
      dueDate: new Date('2025-01-31'),
      filingDate: new Date('2025-02-15'),
      taxPaidLate: false,
    },
    expected: {
      daysLate: 15,
      lateFee: 0,
      interest: 0,
      totalPenalty: 0,
    },
  },
  {
    name: 'Test 3: 45 days late (late fee applies)',
    input: {
      returnType: 'GSTR1',
      taxAmount: 25000,
      dueDate: new Date('2025-01-31'),
      filingDate: new Date('2025-03-17'),
      taxPaidLate: false,
    },
    expected: {
      daysLate: 45,
      lateFee: 1500, // ₹100 × (45 - 30) = ₹1,500
      interest: 0,
      totalPenalty: 1500,
    },
  },
  {
    name: 'Test 4: 60 days late + tax also late (fee + interest)',
    input: {
      returnType: 'GSTR3B',
      taxAmount: 50000,
      dueDate: new Date('2025-01-31'),
      filingDate: new Date('2025-03-31'),
      taxPaidLate: true,
    },
    expected: {
      daysLate: 59,
      lateFee: 2900, // ₹100 × (59 - 30) = ₹2,900
      interest: 1455, // (50,000 × 0.18 × 59) / 365 = ₹1,455.47 ≈ ₹1,455
      totalPenalty: 4355,
    },
  },
  {
    name: 'Test 5: Very late (101 days, hits ₹5,000 cap)',
    input: {
      returnType: 'GSTR1',
      taxAmount: 100000,
      dueDate: new Date('2025-01-31'),
      filingDate: new Date('2025-05-11'),
      taxPaidLate: true,
    },
    expected: {
      daysLate: 100,
      lateFee: 5000, // Capped at ₹5,000 (₹100 × 70 = ₹7,000 → capped)
      interest: 4932, // (100,000 × 0.18 × 100) / 365 = ₹4,931.51 ≈ ₹4,932
      totalPenalty: 9932,
    },
  },
];

// Test runner
function runTests() {
  console.log('🧪 Running GST Penalty Calculator Tests\n');
  console.log('═'.repeat(70));

  let passed = 0;
  let failed = 0;

  testCases.forEach((testCase) => {
    try {
      const result = calculateGSTPenalty(testCase.input);

      const isPass =
        result.daysLate === testCase.expected.daysLate &&
        result.lateFee === testCase.expected.lateFee &&
        result.interest === testCase.expected.interest &&
        result.totalPenalty === testCase.expected.totalPenalty;

      if (isPass) {
        console.log(`✅ ${testCase.name}`);
        passed++;
      } else {
        console.log(`❌ ${testCase.name}`);
        console.log(`   Expected: `, testCase.expected);
        console.log(`   Got:      `, {
          daysLate: result.daysLate,
          lateFee: result.lateFee,
          interest: result.interest,
          totalPenalty: result.totalPenalty,
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
