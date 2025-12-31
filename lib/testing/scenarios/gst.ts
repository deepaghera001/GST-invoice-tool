/**
 * GST Calculator Test Scenarios
 * Add new test case = Add new object to array
 */

import type { TestScenario } from '../types';

interface GSTFormData {
  returnType: 'GSTR3B' | 'GSTR1' | 'GSTR9';
  taxAmount: string;
  dueDate: string;
  filingDate: string;
  taxPaidLate: boolean;
}

// Helper to get dates
const getDateStr = (daysFromToday: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().split('T')[0];
};

/**
 * GST Calculator Test Scenarios
 */
export const gstScenarios: TestScenario<GSTFormData>[] = [
  // ✅ VALID SCENARIOS
  {
    id: 'valid-gstr3b-late',
    name: '✅ GSTR-3B Late Filing (25 days)',
    category: 'valid',
    description: 'Standard late filing scenario',
    data: {
      returnType: 'GSTR3B',
      taxAmount: '50000',
      dueDate: '2024-12-20',
      filingDate: '2025-01-15',
      taxPaidLate: true,
    },
  },
  {
    id: 'valid-gstr1-late',
    name: '✅ GSTR-1 Late Filing',
    category: 'valid',
    description: 'GSTR-1 specific penalties',
    data: {
      returnType: 'GSTR1',
      taxAmount: '100000',
      dueDate: '2024-11-11',
      filingDate: '2024-12-15',
      taxPaidLate: false,
    },
  },
  {
    id: 'valid-gstr9-late',
    name: '✅ GSTR-9 Annual Late Filing',
    category: 'valid',
    description: 'Annual return late penalty',
    data: {
      returnType: 'GSTR9',
      taxAmount: '500000',
      dueDate: '2024-12-31',
      filingDate: '2025-02-28',
      taxPaidLate: true,
    },
  },
  {
    id: 'valid-nil-return',
    name: '✅ NIL Return (No Tax)',
    category: 'valid',
    description: 'Tests NIL return lower penalty rates',
    data: {
      returnType: 'GSTR3B',
      taxAmount: '0',
      dueDate: '2024-12-20',
      filingDate: '2025-01-10',
      taxPaidLate: false,
    },
  },

  // ❌ INVALID SCENARIOS
  {
    id: 'invalid-negative-tax',
    name: '❌ Negative Tax Amount',
    category: 'invalid',
    description: 'Tax amount cannot be negative',
    data: {
      returnType: 'GSTR3B',
      taxAmount: '-5000',
      dueDate: '2024-12-20',
      filingDate: '2025-01-15',
      taxPaidLate: false,
    },
    expectedErrors: ['taxAmount'],
  },
  {
    id: 'invalid-filing-before-due',
    name: '❌ Filing Date Before Due Date',
    category: 'invalid',
    description: 'Filing cannot be before due date (not late)',
    data: {
      returnType: 'GSTR3B',
      taxAmount: '50000',
      dueDate: '2024-12-20',
      filingDate: '2024-12-15', // Before due date
      taxPaidLate: false,
    },
    expectedErrors: ['filingDate'],
  },
  {
    id: 'invalid-empty-dates',
    name: '❌ Missing Dates',
    category: 'invalid',
    description: 'Both dates are required',
    data: {
      returnType: 'GSTR3B',
      taxAmount: '50000',
      dueDate: '',
      filingDate: '',
      taxPaidLate: false,
    },
    expectedErrors: ['dueDate', 'filingDate'],
  },

  // ⚠️ EDGE CASES
  {
    id: 'edge-one-day-late',
    name: '⚠️ Just 1 Day Late',
    category: 'edge-case',
    description: 'Minimum late penalty',
    data: {
      returnType: 'GSTR3B',
      taxAmount: '25000',
      dueDate: '2024-12-20',
      filingDate: '2024-12-21',
      taxPaidLate: false,
    },
  },
  {
    id: 'edge-max-penalty',
    name: '⚠️ Maximum Late Days (365)',
    category: 'edge-case',
    description: 'Tests penalty cap at ₹5,000',
    data: {
      returnType: 'GSTR3B',
      taxAmount: '100000',
      dueDate: '2024-01-20',
      filingDate: '2025-01-20',
      taxPaidLate: true,
    },
  },
  {
    id: 'edge-high-tax',
    name: '⚠️ High Tax Amount (₹10L)',
    category: 'edge-case',
    description: 'Tests large interest calculation',
    data: {
      returnType: 'GSTR3B',
      taxAmount: '1000000',
      dueDate: '2024-11-20',
      filingDate: '2025-01-15',
      taxPaidLate: true,
    },
  },

  // 📝 PARTIAL DATA
  {
    id: 'partial-return-type-only',
    name: '📝 Return Type Only',
    category: 'partial',
    description: 'Just return type selected',
    data: {
      returnType: 'GSTR3B',
      taxAmount: '',
      dueDate: '',
      filingDate: '',
      taxPaidLate: false,
    },
  },
];
