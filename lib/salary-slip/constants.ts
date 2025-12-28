/**
 * Salary Slip Constants
 * Patterns, defaults, and configuration values
 */

import type { SalarySlipFormData } from "./types"

// Regex Patterns
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/
export const EMPLOYEE_ID_REGEX = /^[A-Z0-9]{3,10}$/
export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/
export const ACCOUNT_NUMBER_REGEX = /^[0-9]{9,18}$/
export const CIN_REGEX = /^[A-Z0-9]{21}$/

// Month Options
export const MONTHS = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
]

// Payment Mode Options
export const PAYMENT_MODES = [
  { label: "Bank Transfer", value: "bank-transfer" },
  { label: "Cheque", value: "cheque" },
  { label: "Cash", value: "cash" },
]

// Tax and Deduction Percentages
export const PF_PERCENTAGE = 12 // 12% of basic + DA
export const ESI_PERCENTAGE = 0.75 // 0.75% for employee
export const ESI_THRESHOLD = 21000 // Monthly salary threshold for ESI

// Default Form Data
export const DEFAULT_SALARY_SLIP: SalarySlipFormData = {
  period: {
    month: "1",
    year: new Date().getFullYear(),
  },
  employee: {
    employeeId: "",
    employeeName: "",
    designation: "",
    department: "",
    dateOfJoining: "",
    panNumber: "",
  },
  company: {
    companyName: "",
    companyAddress: "",
    panNumber: "",
    cin: "",
  },
  earnings: {
    basicSalary: 0,
    dearness: 0,
    houseRent: 0,
    conveyance: 0,
    otherEarnings: 0,
  },
  deductions: {
    providentFund: 0,
    esi: 0,
    incomeTax: 0,
    otherDeductions: 0,
  },
  bankingDetails: {
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolder: "",
  },
  paymentMode: "bank-transfer",
}

// Sample Data for Testing
export const SAMPLE_SALARY_SLIP: SalarySlipFormData = {
  period: {
    month: "1",
    year: 2024,
  },
  employee: {
    employeeId: "EMP001",
    employeeName: "John Doe",
    designation: "Software Engineer",
    department: "Engineering",
    dateOfJoining: "2022-01-15",
    panNumber: "ABCDE1234F",
  },
  company: {
    companyName: "Tech Solutions Pvt Ltd",
    companyAddress: "123 Business Park, Mumbai, Maharashtra 400001",
    panNumber: "AAACT1234D",
    cin: "U62030MH2015PTC260923",
  },
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
  bankingDetails: {
    bankName: "HDFC Bank",
    accountNumber: "123456789012345",
    ifscCode: "HDFC0000001",
    accountHolder: "John Doe",
  },
  paymentMode: "bank-transfer",
}
