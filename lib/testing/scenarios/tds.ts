/**
 * TDS Calculator Test Scenarios
 * Add new test case = Add new object to array
 */

import type { TestScenario } from '../types';

interface TDSFormData {
  deductionType: 'salary' | 'contractor' | 'rent' | 'professional' | 'commission' | 'other';
  tdsAmount: string;
  dueDate: string;
  filingDate: string;
  depositDate: string;
  depositedLate: boolean;
}

/**
 * TDS Calculator Test Scenarios
 */
export const tdsScenarios: TestScenario<TDSFormData>[] = [
  // ✅ VALID SCENARIOS
  {
    id: 'valid-salary-tds',
    name: '✅ Section 192 - Salary TDS',
    category: 'valid',
    description: 'Salary TDS late filing',
    data: {
      deductionType: 'salary',
      tdsAmount: '25000',
      dueDate: '2024-12-07',
      filingDate: '2025-01-15',
      depositDate: '2024-12-10',
      depositedLate: true,
    },
  },
  {
    id: 'valid-contractor-tds',
    name: '✅ Section 194C - Contractor',
    category: 'valid',
    description: 'Contractor payment TDS',
    data: {
      deductionType: 'contractor',
      tdsAmount: '15000',
      dueDate: '2024-11-07',
      filingDate: '2024-12-20',
      depositDate: '2024-11-15',
      depositedLate: true,
    },
  },
  {
    id: 'valid-rent-tds',
    name: '✅ Section 194I - Rent TDS',
    category: 'valid',
    description: 'Rent payment TDS',
    data: {
      deductionType: 'rent',
      tdsAmount: '50000',
      dueDate: '2024-10-07',
      filingDate: '2025-01-10',
      depositDate: '2024-10-20',
      depositedLate: true,
    },
  },
  {
    id: 'valid-professional-tds',
    name: '✅ Section 194J - Professional',
    category: 'valid',
    description: 'Professional fees TDS',
    data: {
      deductionType: 'professional',
      tdsAmount: '100000',
      dueDate: '2024-12-07',
      filingDate: '2025-02-15',
      depositDate: '2025-01-05',
      depositedLate: true,
    },
  },
  {
    id: 'valid-on-time-deposit',
    name: '✅ Late Filing, On-Time Deposit',
    category: 'valid',
    description: 'Only late fee, no interest on late deduction',
    data: {
      deductionType: 'salary',
      tdsAmount: '30000',
      dueDate: '2024-12-07',
      filingDate: '2025-01-15',
      depositDate: '2024-12-05',
      depositedLate: false,
    },
  },

  // ❌ INVALID SCENARIOS
  {
    id: 'invalid-negative-tds',
    name: '❌ Negative TDS Amount',
    category: 'invalid',
    description: 'TDS cannot be negative',
    data: {
      deductionType: 'salary',
      tdsAmount: '-1000',
      dueDate: '2024-12-07',
      filingDate: '2025-01-15',
      depositDate: '2024-12-10',
      depositedLate: false,
    },
    expectedErrors: ['tdsAmount'],
  },
  {
    id: 'invalid-zero-tds',
    name: '❌ Zero TDS Amount',
    category: 'invalid',
    description: 'TDS must be positive',
    data: {
      deductionType: 'salary',
      tdsAmount: '0',
      dueDate: '2024-12-07',
      filingDate: '2025-01-15',
      depositDate: '2024-12-10',
      depositedLate: false,
    },
    expectedErrors: ['tdsAmount'],
  },
  {
    id: 'invalid-missing-dates',
    name: '❌ Missing Required Dates',
    category: 'invalid',
    description: 'All dates are required',
    data: {
      deductionType: 'salary',
      tdsAmount: '25000',
      dueDate: '',
      filingDate: '',
      depositDate: '',
      depositedLate: false,
    },
    expectedErrors: ['dueDate', 'filingDate', 'depositDate'],
  },

  // ⚠️ EDGE CASES
  {
    id: 'edge-one-day-late',
    name: '⚠️ Just 1 Day Late Filing',
    category: 'edge-case',
    description: 'Minimum late fee of ₹200',
    data: {
      deductionType: 'salary',
      tdsAmount: '10000',
      dueDate: '2024-12-07',
      filingDate: '2024-12-08',
      depositDate: '2024-12-05',
      depositedLate: false,
    },
  },
  {
    id: 'edge-max-late-fee',
    name: '⚠️ Maximum Late Fee (Capped)',
    category: 'edge-case',
    description: 'Tests late fee cap at TDS amount',
    data: {
      deductionType: 'salary',
      tdsAmount: '5000',
      dueDate: '2024-01-07',
      filingDate: '2025-01-07', // 365 days late
      depositDate: '2024-01-10',
      depositedLate: true,
    },
  },
  {
    id: 'edge-high-tds',
    name: '⚠️ High TDS Amount (₹5L)',
    category: 'edge-case',
    description: 'Tests large penalty calculation',
    data: {
      deductionType: 'professional',
      tdsAmount: '500000',
      dueDate: '2024-12-07',
      filingDate: '2025-03-15',
      depositDate: '2025-01-15',
      depositedLate: true,
    },
  },
  {
    id: 'edge-commission-tds',
    name: '⚠️ Section 194H - Commission',
    category: 'edge-case',
    description: 'Commission/Brokerage TDS',
    data: {
      deductionType: 'commission',
      tdsAmount: '75000',
      dueDate: '2024-11-07',
      filingDate: '2025-01-20',
      depositDate: '2024-11-25',
      depositedLate: true,
    },
  },

  // 📝 PARTIAL DATA
  {
    id: 'partial-type-only',
    name: '📝 Deduction Type Only',
    category: 'partial',
    description: 'Just deduction type selected',
    data: {
      deductionType: 'salary',
      tdsAmount: '',
      dueDate: '',
      filingDate: '',
      depositDate: '',
      depositedLate: false,
    },
  },
];
