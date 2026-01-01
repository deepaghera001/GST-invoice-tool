/**
 * GST & TDS Calculator Test Suite - LEGALLY CORRECT VERSION
 * 
 * GST Official References (CBIC):
 * - Section 47: Late Fee (₹100/day for regular, ₹20/day for NIL)
 * - Section 50: Interest (18% p.a.)
 * - Notification No. 19/2021, 20/2021: Reduced CAPS (not daily rate)
 * 
 * CORRECTED RATES (per CGST Act + CBIC Notifications):
 * - GSTR-3B/GSTR-1 Regular: ₹100/day (₹50 CGST + ₹50 SGST), max ₹5,000
 * - GSTR-3B/GSTR-1 NIL: ₹20/day (₹10 CGST + ₹10 SGST), max ₹500
 * - GSTR-9: ₹200/day, max ₹5,000
 * 
 * IMPORTANT: Notification 19/2021 reduced the MAX CAP, NOT the daily rate.
 * Daily rate remains ₹100/day as per Section 47.
 * 
 * TDS Official References:
 * - Section 234E: Late filing fee (₹200/day, cap = TDS amount)
 * - Section 201(1A): Interest (1% deduction, 1.5% payment per month)
 * 
 * Sources:
 * - https://taxinformation.cbic.gov.in
 * - https://cbic-gst.gov.in
 * - https://incometaxindia.gov.in
 * - https://www.tdscpc.gov.in
 */

import { calculateGSTPenalty } from '../lib/gst/calculator';
import { calculateTDSPenalty } from '../lib/tds/calculator';

// =============================================================================
// GST TEST CASES - LEGALLY CORRECT PER CBIC NOTIFICATIONS
// =============================================================================

interface GSTTestCase {
  name: string;
  input: Parameters<typeof calculateGSTPenalty>[0];
  expected: {
    daysLate: number;
    lateFee: number;
    interest: number;
    totalPenalty: number;
    isNilReturn: boolean;
    cgstLateFee: number;
    sgstLateFee: number;
  };
  description: string;
}

const gstTestCases: GSTTestCase[] = [
  // =============================================================================
  // ON-TIME FILING (No Penalty)
  // =============================================================================
  {
    name: 'TC-GST-001: On-time filing',
    input: {
      returnType: 'GSTR3B',
      taxAmount: 100000,
      dueDate: new Date('2024-12-20'),
      filingDate: new Date('2024-12-15'),
      taxPaidLate: false,
    },
    expected: { daysLate: 0, lateFee: 0, interest: 0, totalPenalty: 0, isNilReturn: false, cgstLateFee: 0, sgstLateFee: 0 },
    description: 'Filing before due date = zero penalty',
  },
  {
    name: 'TC-GST-002: Filing on due date',
    input: {
      returnType: 'GSTR3B',
      taxAmount: 100000,
      dueDate: new Date('2024-12-20'),
      filingDate: new Date('2024-12-20'),
      taxPaidLate: false,
    },
    expected: { daysLate: 0, lateFee: 0, interest: 0, totalPenalty: 0, isNilReturn: false, cgstLateFee: 0, sgstLateFee: 0 },
    description: 'Filing on due date = zero penalty (boundary)',
  },

  // =============================================================================
  // REGULAR RETURN - ₹100/day (₹50 CGST + ₹50 SGST), max ₹5,000
  // Section 47 (rate) + Notification 19/2021 (cap only)
  // =============================================================================
  {
    name: 'TC-GST-003: Regular - 1 day late',
    input: {
      returnType: 'GSTR3B',
      taxAmount: 100000,
      dueDate: new Date('2024-12-20'),
      filingDate: new Date('2024-12-21'),
      taxPaidLate: false,
    },
    expected: { daysLate: 1, lateFee: 100, interest: 0, totalPenalty: 100, isNilReturn: false, cgstLateFee: 50, sgstLateFee: 50 },
    description: 'Section 47: ₹50 CGST + ₹50 SGST = ₹100/day',
  },
  {
    name: 'TC-GST-004: Regular - 10 days late',
    input: {
      returnType: 'GSTR3B',
      taxAmount: 100000,
      dueDate: new Date('2024-12-20'),
      filingDate: new Date('2024-12-30'),
      taxPaidLate: false,
    },
    expected: { daysLate: 10, lateFee: 1000, interest: 0, totalPenalty: 1000, isNilReturn: false, cgstLateFee: 500, sgstLateFee: 500 },
    description: 'Section 47: 10 × ₹100 = ₹1,000',
  },
  {
    name: 'TC-GST-005: Regular - 100 days late (cap test)',
    input: {
      returnType: 'GSTR3B',
      taxAmount: 100000,
      dueDate: new Date('2024-09-20'),
      filingDate: new Date('2024-12-29'),
      taxPaidLate: false,
    },
    expected: { daysLate: 100, lateFee: 5000, interest: 0, totalPenalty: 5000, isNilReturn: false, cgstLateFee: 2500, sgstLateFee: 2500 },
    description: 'Notification 19/2021 cap: Max ₹2,500 CGST + ₹2,500 SGST = ₹5,000 (100 × ₹100 = ₹10,000 capped to ₹5,000)',
  },
  {
    name: 'TC-GST-006: Regular - 200 days late (cap verification)',
    input: {
      returnType: 'GSTR3B',
      taxAmount: 100000,
      dueDate: new Date('2024-06-20'),
      filingDate: new Date('2025-01-06'),
      taxPaidLate: false,
    },
    expected: { daysLate: 200, lateFee: 5000, interest: 0, totalPenalty: 5000, isNilReturn: false, cgstLateFee: 2500, sgstLateFee: 2500 },
    description: 'Cap stays at ₹5,000 even for 200 days',
  },

  // =============================================================================
  // NIL RETURN - ₹20/day (₹10 CGST + ₹10 SGST), max ₹500
  // Per Notification No. 19/2021 (reduced rates for NIL)
  // =============================================================================
  {
    name: 'TC-GST-007: NIL return - 1 day late',
    input: {
      returnType: 'GSTR3B',
      taxAmount: 0,
      dueDate: new Date('2024-12-20'),
      filingDate: new Date('2024-12-21'),
      taxPaidLate: false,
    },
    expected: { daysLate: 1, lateFee: 20, interest: 0, totalPenalty: 20, isNilReturn: true, cgstLateFee: 10, sgstLateFee: 10 },
    description: 'NIL Return: ₹10 CGST + ₹10 SGST = ₹20/day',
  },
  {
    name: 'TC-GST-008: NIL return - 10 days late',
    input: {
      returnType: 'GSTR3B',
      taxAmount: 0,
      dueDate: new Date('2024-12-20'),
      filingDate: new Date('2024-12-30'),
      taxPaidLate: false,
    },
    expected: { daysLate: 10, lateFee: 200, interest: 0, totalPenalty: 200, isNilReturn: true, cgstLateFee: 100, sgstLateFee: 100 },
    description: 'NIL Return: 10 × ₹20 = ₹200',
  },
  {
    name: 'TC-GST-009: NIL return - 25 days late (cap test)',
    input: {
      returnType: 'GSTR3B',
      taxAmount: 0,
      dueDate: new Date('2024-12-20'),
      filingDate: new Date('2025-01-14'),
      taxPaidLate: false,
    },
    expected: { daysLate: 25, lateFee: 500, interest: 0, totalPenalty: 500, isNilReturn: true, cgstLateFee: 250, sgstLateFee: 250 },
    description: 'NIL Return: Max ₹250 CGST + ₹250 SGST = ₹500',
  },
  {
    name: 'TC-GST-010: NIL return - 100 days late (cap verification)',
    input: {
      returnType: 'GSTR3B',
      taxAmount: 0,
      dueDate: new Date('2024-09-20'),
      filingDate: new Date('2024-12-29'),
      taxPaidLate: false,
    },
    expected: { daysLate: 100, lateFee: 500, interest: 0, totalPenalty: 500, isNilReturn: true, cgstLateFee: 250, sgstLateFee: 250 },
    description: 'NIL Return cap stays at ₹500 even for 100 days',
  },

  // =============================================================================
  // INTEREST ON LATE TAX PAYMENT - 18% p.a. (Section 50)
  // =============================================================================
  {
    name: 'TC-GST-011: Interest - 10 days late',
    input: {
      returnType: 'GSTR3B',
      taxAmount: 100000,
      dueDate: new Date('2024-12-20'),
      filingDate: new Date('2024-12-30'),
      taxPaidLate: true,
    },
    expected: { daysLate: 10, lateFee: 1000, interest: 493, totalPenalty: 1493, isNilReturn: false, cgstLateFee: 500, sgstLateFee: 500 },
    description: 'Section 50: ₹100,000 × 18% × 10/365 = ₹493 + ₹1,000 late fee',
  },
  {
    name: 'TC-GST-012: Interest - 30 days late',
    input: {
      returnType: 'GSTR3B',
      taxAmount: 100000,
      dueDate: new Date('2024-12-20'),
      filingDate: new Date('2025-01-19'),
      taxPaidLate: true,
    },
    expected: { daysLate: 30, lateFee: 3000, interest: 1479, totalPenalty: 4479, isNilReturn: false, cgstLateFee: 1500, sgstLateFee: 1500 },
    description: 'Section 50: ₹100,000 × 18% × 30/365 = ₹1,479 + ₹3,000 late fee',
  },
  {
    name: 'TC-GST-013: No interest if taxPaidLate is false',
    input: {
      returnType: 'GSTR3B',
      taxAmount: 100000,
      dueDate: new Date('2024-12-20'),
      filingDate: new Date('2024-12-30'),
      taxPaidLate: false,
    },
    expected: { daysLate: 10, lateFee: 1000, interest: 0, totalPenalty: 1000, isNilReturn: false, cgstLateFee: 500, sgstLateFee: 500 },
    description: 'Interest only applies when tax is paid late',
  },

  // =============================================================================
  // GSTR-1 - Same rates as GSTR-3B (Section 47 + Notification 20/2021)
  // =============================================================================
  {
    name: 'TC-GST-014: GSTR-1 - 10 days late',
    input: {
      returnType: 'GSTR1',
      taxAmount: 100000,
      dueDate: new Date('2024-12-11'),
      filingDate: new Date('2024-12-21'),
      taxPaidLate: false,
    },
    expected: { daysLate: 10, lateFee: 1000, interest: 0, totalPenalty: 1000, isNilReturn: false, cgstLateFee: 500, sgstLateFee: 500 },
    description: 'GSTR-1: Same rates per Section 47 + Notification 20/2021 (cap)',
  },
];

// =============================================================================
// TDS TEST CASES - VERIFIED CORRECT (Section 234E & 201(1A))
// =============================================================================

interface TDSTestCase {
  name: string;
  input: Parameters<typeof calculateTDSPenalty>[0];
  expected: {
    daysLate: number;
    lateFee: number;
    interestOnLateDeduction: number;
    interestOnLatePayment: number;
    totalPenalty: number;
  };
  description: string;
}

const tdsTestCases: TDSTestCase[] = [
  // On-time filing
  {
    name: 'TC-TDS-001: On-time filing',
    input: {
      tdsSection: '194J',
      tdsAmount: 100000,
      dueDate: new Date('2024-10-31'),
      filingDate: new Date('2024-10-25'),
      tdsDeductedLate: false,
      tdsDepositedLate: false,
    },
    expected: { daysLate: 0, lateFee: 0, interestOnLateDeduction: 0, interestOnLatePayment: 0, totalPenalty: 0 },
    description: 'Filing before due date = zero penalty',
  },
  // Late fee tests
  {
    name: 'TC-TDS-002: 1 day late',
    input: {
      tdsSection: '194J',
      tdsAmount: 100000,
      dueDate: new Date('2024-10-31'),
      filingDate: new Date('2024-11-01'),
      tdsDeductedLate: false,
      tdsDepositedLate: false,
    },
    expected: { daysLate: 1, lateFee: 200, interestOnLateDeduction: 0, interestOnLatePayment: 0, totalPenalty: 200 },
    description: 'Section 234E: ₹200/day from day 1',
  },
  {
    name: 'TC-TDS-003: 10 days late',
    input: {
      tdsSection: '194J',
      tdsAmount: 100000,
      dueDate: new Date('2024-10-31'),
      filingDate: new Date('2024-11-10'),
      tdsDeductedLate: false,
      tdsDepositedLate: false,
    },
    expected: { daysLate: 10, lateFee: 2000, interestOnLateDeduction: 0, interestOnLatePayment: 0, totalPenalty: 2000 },
    description: 'Section 234E: 10 × ₹200 = ₹2,000',
  },
  {
    name: 'TC-TDS-004: Cap at TDS amount (small TDS)',
    input: {
      tdsSection: '194J',
      tdsAmount: 3000,
      dueDate: new Date('2024-10-31'),
      filingDate: new Date('2024-12-20'),
      tdsDeductedLate: false,
      tdsDepositedLate: false,
    },
    expected: { daysLate: 50, lateFee: 3000, interestOnLateDeduction: 0, interestOnLatePayment: 0, totalPenalty: 3000 },
    description: 'Section 234E: Cap = TDS amount (NOT fixed ₹5,000)',
  },
  {
    name: 'TC-TDS-005: Large TDS - no arbitrary cap',
    input: {
      tdsSection: '194J',
      tdsAmount: 100000,
      dueDate: new Date('2024-07-31'),
      filingDate: new Date('2024-11-08'),
      tdsDeductedLate: false,
      tdsDepositedLate: false,
    },
    expected: { daysLate: 100, lateFee: 20000, interestOnLateDeduction: 0, interestOnLatePayment: 0, totalPenalty: 20000 },
    description: 'Section 234E: 100 × ₹200 = ₹20,000 (within TDS cap)',
  },
  // Interest tests
  {
    name: 'TC-TDS-006: Late deduction interest (1%/month)',
    input: {
      tdsSection: '194J',
      tdsAmount: 100000,
      dueDate: new Date('2024-10-31'),
      filingDate: new Date('2024-11-15'),
      tdsDeductedLate: true,
      tdsDepositedLate: false,
    },
    expected: { daysLate: 15, lateFee: 3000, interestOnLateDeduction: 1000, interestOnLatePayment: 0, totalPenalty: 4000 },
    description: 'Section 201(1A): 1% per month = ₹1,000',
  },
  {
    name: 'TC-TDS-007: Late payment interest (1.5%/month)',
    input: {
      tdsSection: '194J',
      tdsAmount: 100000,
      dueDate: new Date('2024-10-31'),
      filingDate: new Date('2024-11-15'),
      tdsDeductedLate: false,
      tdsDepositedLate: true,
      depositDate: new Date('2024-11-15'),
    },
    expected: { daysLate: 15, lateFee: 3000, interestOnLateDeduction: 0, interestOnLatePayment: 1500, totalPenalty: 4500 },
    description: 'Section 201(1A): 1.5% per month = ₹1,500',
  },
  {
    name: 'TC-TDS-008: Both late deduction and payment',
    input: {
      tdsSection: '194J',
      tdsAmount: 100000,
      dueDate: new Date('2024-10-31'),
      filingDate: new Date('2024-11-15'),
      tdsDeductedLate: true,
      tdsDepositedLate: true,
      depositDate: new Date('2024-11-15'),
    },
    expected: { daysLate: 15, lateFee: 3000, interestOnLateDeduction: 1000, interestOnLatePayment: 1500, totalPenalty: 5500 },
    description: 'Combined: Late fee + both interest types',
  },
  {
    name: 'TC-TDS-009: Zero TDS amount',
    input: {
      tdsSection: '194J',
      tdsAmount: 0,
      dueDate: new Date('2024-10-31'),
      filingDate: new Date('2024-11-15'),
      tdsDeductedLate: false,
      tdsDepositedLate: false,
    },
    expected: { daysLate: 15, lateFee: 0, interestOnLateDeduction: 0, interestOnLatePayment: 0, totalPenalty: 0 },
    description: 'Zero TDS = Zero late fee',
  },
];

// =============================================================================
// TEST RUNNER
// =============================================================================

interface TestResult {
  name: string;
  passed: boolean;
  description: string;
  errors: string[];
}

function runGSTTests(): TestResult[] {
  const results: TestResult[] = [];

  for (const testCase of gstTestCases) {
    const errors: string[] = [];
    let passed = true;

    try {
      const result = calculateGSTPenalty(testCase.input);

      if (result.daysLate !== testCase.expected.daysLate) {
        errors.push(`daysLate: expected ${testCase.expected.daysLate}, got ${result.daysLate}`);
        passed = false;
      }
      if (result.lateFee !== testCase.expected.lateFee) {
        errors.push(`lateFee: expected ₹${testCase.expected.lateFee}, got ₹${result.lateFee}`);
        passed = false;
      }
      if (result.interest !== testCase.expected.interest) {
        errors.push(`interest: expected ₹${testCase.expected.interest}, got ₹${result.interest}`);
        passed = false;
      }
      if (result.totalPenalty !== testCase.expected.totalPenalty) {
        errors.push(`totalPenalty: expected ₹${testCase.expected.totalPenalty}, got ₹${result.totalPenalty}`);
        passed = false;
      }
      if (result.isNilReturn !== testCase.expected.isNilReturn) {
        errors.push(`isNilReturn: expected ${testCase.expected.isNilReturn}, got ${result.isNilReturn}`);
        passed = false;
      }
      if (result.breakdown.cgstLateFee !== testCase.expected.cgstLateFee) {
        errors.push(`cgstLateFee: expected ₹${testCase.expected.cgstLateFee}, got ₹${result.breakdown.cgstLateFee}`);
        passed = false;
      }
      if (result.breakdown.sgstLateFee !== testCase.expected.sgstLateFee) {
        errors.push(`sgstLateFee: expected ₹${testCase.expected.sgstLateFee}, got ₹${result.breakdown.sgstLateFee}`);
        passed = false;
      }
    } catch (error) {
      errors.push(`Exception: ${error instanceof Error ? error.message : String(error)}`);
      passed = false;
    }

    results.push({ name: testCase.name, passed, description: testCase.description, errors });
  }

  return results;
}

function runTDSTests(): TestResult[] {
  const results: TestResult[] = [];

  for (const testCase of tdsTestCases) {
    const errors: string[] = [];
    let passed = true;

    try {
      const result = calculateTDSPenalty(testCase.input);

      if (result.daysLate !== testCase.expected.daysLate) {
        errors.push(`daysLate: expected ${testCase.expected.daysLate}, got ${result.daysLate}`);
        passed = false;
      }
      if (result.lateFee !== testCase.expected.lateFee) {
        errors.push(`lateFee: expected ₹${testCase.expected.lateFee}, got ₹${result.lateFee}`);
        passed = false;
      }
      if (result.interestOnLateDeduction !== testCase.expected.interestOnLateDeduction) {
        errors.push(`interestOnLateDeduction: expected ₹${testCase.expected.interestOnLateDeduction}, got ₹${result.interestOnLateDeduction}`);
        passed = false;
      }
      if (result.interestOnLatePayment !== testCase.expected.interestOnLatePayment) {
        errors.push(`interestOnLatePayment: expected ₹${testCase.expected.interestOnLatePayment}, got ₹${result.interestOnLatePayment}`);
        passed = false;
      }
      if (result.totalPenalty !== testCase.expected.totalPenalty) {
        errors.push(`totalPenalty: expected ₹${testCase.expected.totalPenalty}, got ₹${result.totalPenalty}`);
        passed = false;
      }
    } catch (error) {
      errors.push(`Exception: ${error instanceof Error ? error.message : String(error)}`);
      passed = false;
    }

    results.push({ name: testCase.name, passed, description: testCase.description, errors });
  }

  return results;
}

function printResults(title: string, results: TestResult[]): { passed: number; failed: number } {
  console.log('\n' + '='.repeat(80));
  console.log(title);
  console.log('='.repeat(80) + '\n');

  let passed = 0;
  let failed = 0;

  for (const result of results) {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} | ${result.name}`);
    console.log(`        ${result.description}`);
    
    if (!result.passed && result.errors.length > 0) {
      for (const error of result.errors) {
        console.log(`        ⚠️  ${error}`);
      }
    }
    console.log('');

    if (result.passed) passed++;
    else failed++;
  }

  return { passed, failed };
}

// =============================================================================
// MAIN
// =============================================================================

console.log('\n');
console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║          GST & TDS CALCULATOR TEST SUITE - LEGALLY CORRECT                 ║');
console.log('║                                                                            ║');
console.log('║  GST References (CBIC):                                                    ║');
console.log('║  • Section 47 (Daily Rate) + Notification 19/2021 (Cap Only)               ║');
console.log('║  • Section 50 (Interest) - 18% p.a.                                        ║');
console.log('║  • Regular: ₹100/day, max ₹5,000 | NIL: ₹20/day, max ₹500                  ║');
console.log('║                                                                            ║');
console.log('║  TDS References (Income Tax Act):                                          ║');
console.log('║  • Section 234E (Late Fee) - ₹200/day, cap = TDS amount                    ║');
console.log('║  • Section 201(1A) (Interest) - 1%/1.5% per month                          ║');
console.log('║                                                                            ║');
console.log('║  Sources: cbic.gov.in, gst.gov.in, incometaxindia.gov.in, tdscpc.gov.in    ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝');

// Run GST tests
const gstResults = runGSTTests();
const gstStats = printResults('GST PENALTY CALCULATOR TESTS (Notification 19/2021 & 20/2021)', gstResults);

// Run TDS tests
const tdsResults = runTDSTests();
const tdsStats = printResults('TDS LATE FEE CALCULATOR TESTS (Section 234E & 201(1A))', tdsResults);

// Final summary
console.log('='.repeat(80));
console.log('FINAL SUMMARY');
console.log('='.repeat(80));
console.log(`\nGST Tests: ${gstStats.passed} passed, ${gstStats.failed} failed`);
console.log(`TDS Tests: ${tdsStats.passed} passed, ${tdsStats.failed} failed`);
console.log(`\nTOTAL: ${gstStats.passed + tdsStats.passed} passed, ${gstStats.failed + tdsStats.failed} failed`);
console.log('='.repeat(80));

// Legal disclaimer
console.log('\n📋 LEGAL DISCLAIMER:');
console.log('Late fee and interest rates are subject to change via government notifications.');
console.log('This calculator follows current CBIC/IT notifications and may not apply to past periods.');
console.log('Please verify with official GST/Income Tax portals for your specific filing period.');
console.log('='.repeat(80) + '\n');

// Exit with error if any test failed
if (gstStats.failed > 0 || tdsStats.failed > 0) {
  console.log('❌ Some tests failed. Please review the errors above.\n');
  process.exit(1);
} else {
  console.log('✅ All tests passed! Calculators are legally compliant.\n');
  process.exit(0);
}
