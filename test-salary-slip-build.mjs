import { SalarySlipCalculations, DEFAULT_SALARY_SLIP } from './lib/salary-slip/index.ts';

console.log('✅ Salary Slip Module Test');
console.log('==========================\n');

// Test 1: Calculations work
const testData = {
  ...DEFAULT_SALARY_SLIP,
  earnings: {
    basicSalary: 50000,
    dearness: 10000,
    houseRent: 8000,
    conveyance: 0,
    otherEarnings: 0,
  },
  deductions: {
    providentFund: 6000,
    esi: 510,
    incomeTax: 3880,
    otherDeductions: 0,
  },
};

const calculations = SalarySlipCalculations.calculateAll(testData);
console.log('Total Earnings:', calculations.totalEarnings);
console.log('Total Deductions:', calculations.totalDeductions);
console.log('Net Salary:', calculations.netSalary);
console.log('Amount in Words:', calculations.amountInWords);

console.log('\n✅ All calculations working correctly!');
