/**
 * GST Calculator Validation Schema (Zod)
 * Runtime validation for GST penalty calculator fields
 * 
 * Legal Reference: CGST Act Section 47 (Late Fee) + CBIC Notifications
 */

import { z } from "zod"

// Return Type Schema - includes GSTR9 (Annual)
export const ReturnTypeSchema = z.enum(["GSTR1", "GSTR3B", "GSTR9"], {
  errorMap: () => ({ message: "Please select a valid return type" }),
})

// Tax Amount Schema (can be 0 for NIL returns)
export const TaxAmountSchema = z
  .string()
  .min(1, "Tax amount is required (enter 0 for NIL return)")
  .refine((val) => !isNaN(Number(val)), "Tax amount must be a valid number")
  .refine((val) => Number(val) >= 0, "Tax amount cannot be negative")

// Date Schema
export const DateSchema = z
  .string()
  .min(1, "Date is required")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .refine((date) => {
    const d = new Date(date)
    return !isNaN(d.getTime())
  }, "Invalid date")

// Main GST Calculator Form Schema
export const gstCalculatorSchema = z
  .object({
    returnType: ReturnTypeSchema,
    taxAmount: TaxAmountSchema,
    dueDate: DateSchema,
    filingDate: DateSchema,
    taxPaidLate: z.boolean().default(false),
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
export const gstCalculatorFieldSchema = z.object({
  returnType: ReturnTypeSchema.optional(),
  taxAmount: TaxAmountSchema.optional(),
  dueDate: DateSchema.optional(),
  filingDate: DateSchema.optional(),
  taxPaidLate: z.boolean().optional(),
})

// Type inference
export type GSTCalculatorFormData = z.infer<typeof gstCalculatorSchema>
export type GSTCalculatorValidationErrors = Partial<Record<keyof GSTCalculatorFormData, string>>

// Default form values
export const DEFAULT_GST_CALCULATOR_DATA: Omit<GSTCalculatorFormData, "dueDate" | "filingDate"> & {
  dueDate: string
  filingDate: string
  taxAmount: string
} = {
  returnType: "GSTR3B",
  taxAmount: "",
  dueDate: "",
  filingDate: "",
  taxPaidLate: false,
}

// Validation functions
export function validateField(field: string, value: any): string | null {
  try {
    const fieldSchema = gstCalculatorFieldSchema.shape[field as keyof typeof gstCalculatorFieldSchema.shape]
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

export function validateForm(data: any): { isValid: boolean; errors: GSTCalculatorValidationErrors } {
  try {
    gstCalculatorSchema.parse(data)
    return { isValid: true, errors: {} }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: GSTCalculatorValidationErrors = {}
      for (const issue of error.issues) {
        const path = issue.path[0] as keyof GSTCalculatorFormData
        if (path && !errors[path]) {
          errors[path] = issue.message
        }
      }
      return { isValid: false, errors }
    }
    return { isValid: false, errors: {} }
  }
}
