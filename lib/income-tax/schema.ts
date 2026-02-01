/**
 * Income Tax Calculator Validation Schema (Zod)
 * FY 2024-25 (AY 2025-26)
 * 
 * Runtime validation for Old vs New Regime comparison
 */

import { z } from "zod"

// Age Group Schema
export const AgeGroupSchema = z.enum(["below-60", "senior", "super-senior"], {
  errorMap: () => ({ message: "Please select a valid age group" }),
})

// Income Amount Schema (required, must be > 0)
export const IncomeAmountSchema = z
  .string()
  .min(1, "Gross income is required")
  .refine((val) => !isNaN(Number(val)), "Income must be a valid number")
  .refine((val) => Number(val) > 0, "Income must be greater than zero")
  .refine((val) => Number(val) <= 100000000, "Please enter a realistic income")

// Deduction Amount Schema (optional, must be >= 0 if provided)
export const DeductionAmountSchema = z
  .string()
  .refine((val) => {
    if (val === "" || val === undefined) return true
    return !isNaN(Number(val))
  }, "Amount must be a valid number")
  .refine((val) => {
    if (val === "" || val === undefined) return true
    return Number(val) >= 0
  }, "Amount cannot be negative")

// Section 80C Schema (max ₹1.5L)
export const Section80CSchema = DeductionAmountSchema.refine(
  (val) => {
    if (val === "" || val === undefined) return true
    return Number(val) <= 150000
  },
  "Maximum ₹1,50,000 allowed under Section 80C"
)

// Section 80D Schema (up to ₹25k + ₹25k/₹50k for parents = max ₹75k)
export const Section80DSchema = DeductionAmountSchema.refine(
  (val) => {
    if (val === "" || val === undefined) return true
    return Number(val) <= 75000
  },
  "Maximum ₹75,000 allowed (₹25k self + ₹50k parents if senior)"
)

// Home Loan Interest Schema (max ₹2L)
export const HomeLoanInterestSchema = DeductionAmountSchema.refine(
  (val) => {
    if (val === "" || val === undefined) return true
    return Number(val) <= 200000
  },
  "Maximum ₹2,00,000 allowed for home loan interest"
)

// NPS 80CCD(1B) Schema (max ₹50k)
export const NPS80CCD1BSchema = DeductionAmountSchema.refine(
  (val) => {
    if (val === "" || val === undefined) return true
    return Number(val) <= 50000
  },
  "Maximum ₹50,000 allowed under Section 80CCD(1B)"
)

// Main Income Tax Calculator Form Schema
export const incomeTaxCalculatorSchema = z.object({
  grossIncome: IncomeAmountSchema,
  ageGroup: AgeGroupSchema,
  section80C: Section80CSchema,
  section80D: Section80DSchema,
  hra: DeductionAmountSchema,
  homeLoanInterest: HomeLoanInterestSchema,
  nps80CCD1B: NPS80CCD1BSchema,
  otherDeductions: DeductionAmountSchema,
})

// Partial schema for field-level validation
export const incomeTaxCalculatorFieldSchema = z.object({
  grossIncome: IncomeAmountSchema.optional(),
  ageGroup: AgeGroupSchema.optional(),
  section80C: Section80CSchema.optional(),
  section80D: Section80DSchema.optional(),
  hra: DeductionAmountSchema.optional(),
  homeLoanInterest: HomeLoanInterestSchema.optional(),
  nps80CCD1B: NPS80CCD1BSchema.optional(),
  otherDeductions: DeductionAmountSchema.optional(),
})

// Type inference
export type IncomeTaxCalculatorFormData = z.infer<typeof incomeTaxCalculatorSchema>
export type IncomeTaxCalculatorValidationErrors = Partial<Record<keyof IncomeTaxCalculatorFormData, string>>

// Default form values
export const DEFAULT_INCOME_TAX_CALCULATOR_DATA = {
  grossIncome: "",
  ageGroup: "below-60" as const,
  section80C: "",
  section80D: "",
  hra: "",
  homeLoanInterest: "",
  nps80CCD1B: "",
  otherDeductions: "",
}

// Validation functions
export function validateField(field: string, value: any): string | null {
  try {
    const fieldSchema = incomeTaxCalculatorFieldSchema.shape[field as keyof typeof incomeTaxCalculatorFieldSchema.shape]
    if (fieldSchema) {
      fieldSchema.parse(value)
    }
    return null
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || "Invalid value"
    }
    return "Validation error"
  }
}

export function validateForm(data: any): { isValid: boolean; errors: IncomeTaxCalculatorValidationErrors } {
  try {
    incomeTaxCalculatorSchema.parse(data)
    return { isValid: true, errors: {} }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: IncomeTaxCalculatorValidationErrors = {}
      for (const issue of error.issues) {
        const path = issue.path[0] as keyof IncomeTaxCalculatorFormData
        if (path && !errors[path]) {
          errors[path] = issue.message
        }
      }
      return { isValid: false, errors }
    }
    return { isValid: false, errors: {} }
  }
}
