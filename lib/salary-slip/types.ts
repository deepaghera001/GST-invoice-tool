/**
 * Salary Slip Domain Models
 * All type definitions for salary slip form and calculations
 */

export interface Period {
  month: string // "1" to "12"
  year: number
}

export interface Employee {
  employeeId: string
  employeeName: string
  designation: string
  department: string
  dateOfJoining: string // YYYY-MM-DD
  panNumber: string
  uan?: string
}

export interface Company {
  companyName: string
  companyAddress: string
  panNumber: string
  cin?: string // Corporate Identification Number (optional)
  /** Optional company logo as data URL or remote URL */
  logo?: string
}

export interface Earnings {
  basicSalary: number
  dearness: number
  houseRent: number
  conveyance: number
  otherEarnings: number
}

export interface Deductions {
  providentFund: number
  esi: number
  incomeTax: number
  otherDeductions: number
}

export interface BankingDetails {
  bankName: string
  accountNumber: string
  ifscCode: string
  accountHolder: string
}

export interface SalarySlipFormData {
  period: Period
  employee: Employee
  company: Company
  earnings: Earnings
  deductions: Deductions
  bankingDetails: BankingDetails
  paymentMode: string // "bank-transfer" | "cheque" | "cash"
}

export interface SalarySlipCalculationResult {
  totalEarnings: number
  totalDeductions: number
  grossSalary: number
  netSalary: number
  amountInWords: string
  esiBenefits?: string
  pfBenefits?: string
}

export type SalarySlipValidationErrors = Partial<Record<string, string>>

export interface FormFieldHandler {
  (field: string, value: any): void
}
