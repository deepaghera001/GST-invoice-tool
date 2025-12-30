/**
 * TDS Calculator Validation Schema (Zod)
 * Runtime validation for TDS late fee calculator fields
 */

import { z } from "zod"

// Deduction Type Schema
export const DeductionTypeSchema = z.enum(["salary", "contractor", "rent", "professional", "commission", "other"], {
  errorMap: () => ({ message: "Please select a valid TDS deduction type" }),
})

// TDS Amount Schema (must be > 0)
export const TDSAmountSchema = z
  .string()
  .min(1, "TDS amount is required")
  .refine((val) => !isNaN(Number(val)), "TDS amount must be a valid number")
  .refine((val) => Number(val) > 0, "TDS amount must be greater than zero")

// Date Schema
export const DateSchema = z
  .string()
  .min(1, "Date is required")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .refine((date) => {
    const d = new Date(date)
    return !isNaN(d.getTime())
  }, "Invalid date")

// Optional Date Schema (for deposit date)
export const OptionalDateSchema = z
  .string()
  .optional()
  .refine(
    (date) => {
      if (!date || date === "") return true
      const d = new Date(date)
      return !isNaN(d.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(date)
    },
    "Invalid date format"
  )

// Main TDS Calculator Form Schema
export const tdsCalculatorSchema = z
  .object({
    deductionType: DeductionTypeSchema,
    tdsAmount: TDSAmountSchema,
    dueDate: DateSchema,
    filingDate: DateSchema,
    depositDate: OptionalDateSchema,
    depositedLate: z.boolean().default(false),
  })
  .refine(
    (data) => {
      const dueDate = new Date(data.dueDate)
      const filingDate = new Date(data.filingDate)
      return filingDate >= dueDate
    },
    {
      message: "Filing date must be on or after the due date",
      path: ["filingDate"],
    }
  )

// Partial schema for field-level validation
export const tdsCalculatorFieldSchema = z.object({
  deductionType: DeductionTypeSchema.optional(),
  tdsAmount: TDSAmountSchema.optional(),
  dueDate: DateSchema.optional(),
  filingDate: DateSchema.optional(),
  depositDate: OptionalDateSchema,
  depositedLate: z.boolean().optional(),
})

// Type inference
export type TDSCalculatorFormData = z.infer<typeof tdsCalculatorSchema>
export type TDSCalculatorValidationErrors = Partial<Record<keyof TDSCalculatorFormData, string>>

// Default form values
export const DEFAULT_TDS_CALCULATOR_DATA = {
  deductionType: "salary" as const,
  tdsAmount: "",
  dueDate: "",
  filingDate: "",
  depositDate: "",
  depositedLate: false,
}

// Validation functions
export function validateField(field: string, value: any): string | null {
  try {
    const fieldSchema = tdsCalculatorFieldSchema.shape[field as keyof typeof tdsCalculatorFieldSchema.shape]
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

export function validateForm(data: any): { isValid: boolean; errors: TDSCalculatorValidationErrors } {
  try {
    tdsCalculatorSchema.parse(data)
    return { isValid: true, errors: {} }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: TDSCalculatorValidationErrors = {}
      for (const issue of error.issues) {
        const path = issue.path[0] as keyof TDSCalculatorFormData
        if (path && !errors[path]) {
          errors[path] = issue.message
        }
      }
      return { isValid: false, errors }
    }
    return { isValid: false, errors: {} }
  }
}
