import { z } from "zod"
import type { InvoiceValidationErrors } from "../schemas/invoice.schema"
import { invoiceSchema } from "../schemas/invoice.schema"

export class FieldValidator {
  /**
   * Validate a single field
   */
  static validateField(fieldName: string, value: any): string | null {
    try {
      // Since invoiceSchema has .refine(), it's a ZodEffects type without .shape property
      const partialData = { [fieldName]: value }
      const result = invoiceSchema.partial().safeParse(partialData)

      if (!result.success) {
        const fieldError = result.error.errors.find((err) => err.path[0] === fieldName)
        return fieldError?.message || "Invalid value"
      }
      return null
    } catch (error) {
      console.error("[v0] Field validation error:", error)
      return "Validation error"
    }
  }

  /**
   * Validate entire form
   */
  static validateForm(data: any): { isValid: boolean; errors: InvoiceValidationErrors } {
    try {
      invoiceSchema.parse(data)
      return { isValid: true, errors: {} }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: InvoiceValidationErrors = {}
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof InvoiceValidationErrors
          if (field && !errors[field]) {
            errors[field] = err.message
          }
        })
        return { isValid: false, errors }
      }
      return { isValid: false, errors: {} }
    }
  }

  /**
   * Validate multiple fields at once
   */
  static validateFields(fields: Record<string, any>): InvoiceValidationErrors {
    const errors: InvoiceValidationErrors = {}

    for (const [fieldName, value] of Object.entries(fields)) {
      const error = this.validateField(fieldName, value)
      if (error) {
        errors[fieldName as keyof InvoiceValidationErrors] = error
      }
    }

    return errors
  }
}
