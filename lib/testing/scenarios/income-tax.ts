/**
 * Income Tax Comparison Test Scenarios
 * Add new test case = Add new object to array
 */

import type { TestScenario } from '../types';

export interface IncomeTaxFormData {
  grossIncome: string;
  ageGroup: 'below-60' | 'senior' | 'super-senior';
  section80C: string;
  section80D: string;
  hra: string;
  homeLoanInterest: string;
  nps80CCD1B: string;
  otherDeductions: string;
}

const VALID_BASE: IncomeTaxFormData = {
  grossIncome: '1200000',
  ageGroup: 'below-60',
  section80C: '150000',
  section80D: '25000',
  hra: '100000',
  homeLoanInterest: '200000',
  nps80CCD1B: '50000',
  otherDeductions: '0',
};

export const incomeTaxScenarios: TestScenario<IncomeTaxFormData>[] = [
  {
    id: 'valid-default',
    name: '✅ Default Valid Data',
    category: 'valid',
    description: 'Standard test data for quick demo',
    data: VALID_BASE,
  },
  {
    id: 'senior-citizen',
    name: '✅ Senior Citizen',
    category: 'valid',
    description: 'Senior citizen with higher deductions',
    data: {
      ...VALID_BASE,
      ageGroup: 'senior',
      section80C: '120000',
      section80D: '50000',
      hra: '80000',
      homeLoanInterest: '0',
      nps80CCD1B: '0',
      otherDeductions: '10000',
    },
  },
  {
    id: 'super-senior',
    name: '✅ Super Senior',
    category: 'valid',
    description: 'Super senior with minimal deductions',
    data: {
      ...VALID_BASE,
      ageGroup: 'super-senior',
      section80C: '50000',
      section80D: '10000',
      hra: '0',
      homeLoanInterest: '0',
      nps80CCD1B: '0',
      otherDeductions: '0',
    },
  },
  // Add more scenarios as needed
];
