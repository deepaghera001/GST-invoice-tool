import { invoiceFieldSchema } from "../schemas/invoice.schema"

/**
 * Validate invoice number
 * @param value - The invoice number to validate
 * @returns Error message or null if valid
 */
export function validateInvoiceNumber(value: string): string | null {
  try {
    const result = invoiceFieldSchema.safeParse({ invoiceNumber: value })
    if (!result.success) {
      const error = result.error.errors.find((err) => err.path[0] === "invoiceNumber")
      return error?.message || "Invalid invoice number"
    }
    return null
  } catch (error) {
    console.error("[v0] Invoice number validation error:", error)
    return "Validation error"
  }
}

/**
 * Validate invoice date
 * @param value - The invoice date to validate (YYYY-MM-DD format)
 * @returns Error message or null if valid
 */
export function validateInvoiceDate(value: string): string | null {
  try {
    const result = invoiceFieldSchema.safeParse({ invoiceDate: value })
    if (!result.success) {
      const error = result.error.errors.find((err) => err.path[0] === "invoiceDate")
      return error?.message || "Invalid date"
    }
    return null
  } catch (error) {
    console.error("[v0] Invoice date validation error:", error)
    return "Validation error"
  }
}

/**
 * Validate all invoice fields at once
 * @param data - Object containing invoice fields
 * @returns Object with field names as keys and error messages as values
 */
export function validateInvoiceFields(data: { 
  invoiceNumber?: string; 
  invoiceDate?: string 
}): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (data.invoiceNumber !== undefined) {
    const numberError = validateInvoiceNumber(data.invoiceNumber)
    if (numberError) errors.invoiceNumber = numberError
  }
  
  if (data.invoiceDate !== undefined) {
    const dateError = validateInvoiceDate(data.invoiceDate)
    if (dateError) errors.invoiceDate = dateError
  }
  
  return errors
}