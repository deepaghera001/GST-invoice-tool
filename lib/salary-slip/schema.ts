/**
 * Salary Slip Validation Schema (Zod)
 * Runtime validation for all salary slip fields
 */

import { z } from "zod"
import {
  PAN_REGEX,
  UAN_REGEX,
  EMPLOYEE_ID_REGEX,
  IFSC_REGEX,
  ACCOUNT_NUMBER_REGEX,
  CIN_REGEX,
} from "./constants"

// Period Schema
export const PeriodSchema = z.object({
  month: z.string().min(1, "Month is required").refine((m) => /^(1|2|3|4|5|6|7|8|9|10|11|12)$/.test(m), {
    message: "Invalid month",
  }),
  year: z.number({ required_error: "Year is required", invalid_type_error: "Year must be a number" })
    .min(2000, "Year must be 2000 or later")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
})

// Employee Schema
export const EmployeeSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required").regex(EMPLOYEE_ID_REGEX, "Invalid Employee ID format"),
  employeeName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  designation: z.string().min(2, "Designation is required"),
  department: z.string().min(2, "Department is required"),
  dateOfJoining: z.string().refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
    message: "Date of joining must be in YYYY-MM-DD format",
  }),
  panNumber: z.string().regex(PAN_REGEX, "Invalid PAN format (e.g., ABCDE1234F)"),
  uan: z.string().optional().refine((uan) => !uan || UAN_REGEX.test(uan), {
    message: "Invalid UAN format (12 digits)",
  }),
})

// Company Schema
export const CompanySchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  companyAddress: z.string().min(10, "Company address must be at least 10 characters"),
  panNumber: z.string().regex(PAN_REGEX, "Invalid PAN format"),
  cin: z.string().optional().refine((cin) => !cin || CIN_REGEX.test(cin), {
    message: "Invalid CIN format",
  }),
  logo: z.string().optional(),
})

// Earnings Schema
export const EarningsSchema = z.object({
  basicSalary: z.number().min(0, "Basic salary cannot be negative"),
  dearness: z.number().min(0, "Dearness allowance cannot be negative"),
  houseRent: z.number().min(0, "House rent cannot be negative"),
  conveyance: z.number().min(0, "Conveyance cannot be negative"),
  otherEarnings: z.number().min(0, "Other earnings cannot be negative"),
})

// Deductions Schema
export const DeductionsSchema = z.object({
  providentFund: z.number().min(0, "PF cannot be negative"),
  esi: z.number().min(0, "ESI cannot be negative"),
  incomeTax: z.number().min(0, "Income tax cannot be negative"),
  otherDeductions: z.number().min(0, "Other deductions cannot be negative"),
})

// Banking Details Schema
export const BankingDetailsSchema = z.object({
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z.string().regex(ACCOUNT_NUMBER_REGEX, "Invalid account number format"),
  ifscCode: z.string().regex(IFSC_REGEX, "Invalid IFSC code format (e.g., HDFC0000001)"),
  accountHolder: z.string().min(2, "Account holder name is required"),
})

// Main Salary Slip Form Schema
export const salarySlipFormSchema = z.object({
  period: PeriodSchema,
  employee: EmployeeSchema,
  company: CompanySchema,
  earnings: EarningsSchema,
  deductions: DeductionsSchema,
  bankingDetails: BankingDetailsSchema,
  paymentMode: z.enum(["bank-transfer", "cheque", "cash"]),
})

// Type inference
export type SalarySlipFormDataSchema = z.infer<typeof salarySlipFormSchema>

// Validation functions
export function validateField(field: string, value: any): string | null {
  try {
    const fieldParts = field.split(".")
    let schema: any = salarySlipFormSchema

    // Navigate through nested objects
    for (const part of fieldParts.slice(0, -1)) {
      schema = schema.shape[part]
    }

    // Validate the final field
    const fieldName = fieldParts[fieldParts.length - 1]
    schema.shape[fieldName].parse(value)
    return null
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || "Invalid value"
    }
    return "Validation error"
  }
}

export function validateForm(data: any): Record<string, string> {
  try {
    salarySlipFormSchema.parse(data)
    return {}
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      for (const issue of error.issues) {
        const path = issue.path.join(".")
        if (path) {
          errors[path] = issue.message
        }
      }
      return errors
    }
    return {}
  }
}
