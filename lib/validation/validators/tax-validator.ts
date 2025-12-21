import { invoiceFieldSchema } from "../schemas/invoice.schema"

/**
 * Validate CGST rate
 * @param value - The CGST rate to validate
 * @returns Error message or null if valid
 */
export function validateCGST(value: string): string | null {
  try {
    const result = invoiceFieldSchema.safeParse({ cgst: value })
    if (!result.success) {
      const error = result.error.errors.find((err) => err.path[0] === "cgst")
      return error?.message || "Invalid CGST"
    }
    return null
  } catch (error) {
    console.error("[v0] CGST validation error:", error)
    return "Validation error"
  }
}

/**
 * Validate SGST rate
 * @param value - The SGST rate to validate
 * @returns Error message or null if valid
 */
export function validateSGST(value: string): string | null {
  try {
    const result = invoiceFieldSchema.safeParse({ sgst: value })
    if (!result.success) {
      const error = result.error.errors.find((err) => err.path[0] === "sgst")
      return error?.message || "Invalid SGST"
    }
    return null
  } catch (error) {
    console.error("[v0] SGST validation error:", error)
    return "Validation error"
  }
}

/**
 * Validate IGST rate
 * @param value - The IGST rate to validate
 * @returns Error message or null if valid
 */
export function validateIGST(value: string): string | null {
  try {
    const result = invoiceFieldSchema.safeParse({ igst: value })
    if (!result.success) {
      const error = result.error.errors.find((err) => err.path[0] === "igst")
      return error?.message || "Invalid IGST"
    }
    return null
  } catch (error) {
    console.error("[v0] IGST validation error:", error)
    return "Validation error"
  }
}

/**
 * Validate all tax fields at once
 * @param data - Object containing tax fields
 * @returns Object with field names as keys and error messages as values
 */
export function validateTaxFields(data: { 
  cgst?: string; 
  sgst?: string; 
  igst?: string 
}): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (data.cgst !== undefined) {
    const cgstError = validateCGST(data.cgst)
    if (cgstError) errors.cgst = cgstError
  }
  
  if (data.sgst !== undefined) {
    const sgstError = validateSGST(data.sgst)
    if (sgstError) errors.sgst = sgstError
  }
  
  if (data.igst !== undefined) {
    const igstError = validateIGST(data.igst)
    if (igstError) errors.igst = igstError
  }
  
  return errors
}