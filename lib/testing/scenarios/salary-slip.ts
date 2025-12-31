/**
 * Salary Slip Test Scenarios
 * Add new test case = Add new object to array
 */

import type { TestScenario } from '../types';
import type { SalarySlipFormData } from '@/lib/salary-slip';

// Base valid data matching actual types
const VALID_BASE: SalarySlipFormData = {
  period: {
    month: "1", // "1" to "12"
    year: 2025,
  },
  employee: {
    employeeName: "Rahul Verma",
    employeeId: "EMP-2024-001",
    designation: "Senior Software Engineer",
    department: "Engineering",
    panNumber: "ABCDE1234F",
    dateOfJoining: "2023-01-15",
  },
  company: {
    companyName: "TechCorp India Pvt Ltd",
    companyAddress: "Cyber Tower, HITEC City, Hyderabad - 500081",
    panNumber: "AABCT1234D",
  },
  earnings: {
    basicSalary: 50000,
    dearness: 5000,
    houseRent: 20000,
    conveyance: 3200,
    otherEarnings: 15000,
  },
  deductions: {
    providentFund: 6000,
    esi: 0,
    incomeTax: 8500,
    otherDeductions: 0,
  },
  bankingDetails: {
    bankName: "HDFC Bank",
    accountNumber: "50100123456789",
    ifscCode: "HDFC0001234",
    accountHolder: "Rahul Verma",
  },
  paymentMode: "bank-transfer",
};

/**
 * Salary Slip Test Scenarios
 */
export const salarySlipScenarios: TestScenario<SalarySlipFormData>[] = [
  // ✅ VALID SCENARIOS
  {
    id: 'valid-complete',
    name: '✅ Complete Valid Salary Slip',
    category: 'valid',
    description: 'All fields filled correctly',
    data: VALID_BASE,
  },
  {
    id: 'valid-minimum-salary',
    name: '✅ Minimum Wage Salary',
    category: 'valid',
    description: 'Entry-level salary with basic deductions',
    data: {
      ...VALID_BASE,
      employee: {
        ...VALID_BASE.employee,
        employeeName: "Amit Kumar",
        designation: "Junior Developer",
      },
      earnings: {
        basicSalary: 18000,
        dearness: 1800,
        houseRent: 7200,
        conveyance: 1600,
        otherEarnings: 0,
      },
      deductions: {
        providentFund: 2160,
        esi: 1350, // ESI applicable for < ₹21,000
        incomeTax: 0,
        otherDeductions: 0,
      },
      bankingDetails: {
        ...VALID_BASE.bankingDetails,
        accountHolder: "Amit Kumar",
      },
    },
  },
  {
    id: 'valid-cheque-payment',
    name: '✅ Cheque Payment',
    category: 'valid',
    description: 'Salary via cheque',
    data: {
      ...VALID_BASE,
      paymentMode: "cheque",
    },
  },

  // ❌ INVALID SCENARIOS
  {
    id: 'invalid-pan',
    name: '❌ Invalid Employee PAN',
    category: 'invalid',
    description: 'Tests PAN format validation',
    data: {
      ...VALID_BASE,
      employee: {
        ...VALID_BASE.employee,
        panNumber: "INVALID",
      },
    },
    expectedErrors: ['employee.panNumber'],
  },
  {
    id: 'invalid-company-pan',
    name: '❌ Invalid Company PAN',
    category: 'invalid',
    description: 'Tests company PAN format',
    data: {
      ...VALID_BASE,
      company: {
        ...VALID_BASE.company,
        panNumber: "123ABC",
      },
    },
    expectedErrors: ['company.panNumber'],
  },
  {
    id: 'invalid-ifsc',
    name: '❌ Invalid IFSC Code',
    category: 'invalid',
    description: 'Tests IFSC format validation',
    data: {
      ...VALID_BASE,
      bankingDetails: {
        ...VALID_BASE.bankingDetails,
        ifscCode: "WRONG",
      },
    },
    expectedErrors: ['bankingDetails.ifscCode'],
  },
  {
    id: 'invalid-zero-basic',
    name: '❌ Zero Basic Salary',
    category: 'invalid',
    description: 'Basic salary cannot be zero',
    data: {
      ...VALID_BASE,
      earnings: {
        ...VALID_BASE.earnings,
        basicSalary: 0,
      },
    },
    expectedErrors: ['earnings.basicSalary'],
  },

  // ⚠️ EDGE CASES
  {
    id: 'edge-high-salary',
    name: '⚠️ High Salary (CXO Level)',
    category: 'edge-case',
    description: 'Tests high value formatting (₹50L)',
    data: {
      ...VALID_BASE,
      employee: {
        ...VALID_BASE.employee,
        designation: "Chief Technology Officer",
      },
      earnings: {
        basicSalary: 500000,
        dearness: 50000,
        houseRent: 200000,
        conveyance: 50000,
        otherEarnings: 300000,
      },
      deductions: {
        providentFund: 60000,
        esi: 0,
        incomeTax: 250000,
        otherDeductions: 0,
      },
    },
  },
  {
    id: 'edge-cash-payment',
    name: '⚠️ Cash Payment',
    category: 'edge-case',
    description: 'Tests cash payment mode',
    data: {
      ...VALID_BASE,
      paymentMode: "cash",
    },
  },
  {
    id: 'edge-all-deductions',
    name: '⚠️ All Deductions Active',
    category: 'edge-case',
    description: 'Tests high deductions scenario',
    data: {
      ...VALID_BASE,
      deductions: {
        providentFund: 6000,
        esi: 750,
        incomeTax: 12000,
        otherDeductions: 2500,
      },
    },
  },

  // 📝 PARTIAL DATA
  {
    id: 'partial-employee-only',
    name: '📝 Employee Details Only',
    category: 'partial',
    description: 'Only employee section filled',
    data: {
      period: { month: "", year: 2025 },
      employee: VALID_BASE.employee,
      company: { companyName: "", companyAddress: "", panNumber: "" },
      earnings: { basicSalary: 0, dearness: 0, houseRent: 0, conveyance: 0, otherEarnings: 0 },
      deductions: { providentFund: 0, esi: 0, incomeTax: 0, otherDeductions: 0 },
      bankingDetails: { bankName: "", accountNumber: "", ifscCode: "", accountHolder: "" },
      paymentMode: "",
    },
  },
];
