import { invoiceFieldSchema } from "../schemas/invoice.schema"

/**
 * Validate buyer name
 * @param value - The buyer name to validate
 * @returns Error message or null if valid
 */
export function validateBuyerName(value: string): string | null {
  try {
    const result = invoiceFieldSchema.safeParse({ buyerName: value })
    if (!result.success) {
      const error = result.error.errors.find((err) => err.path[0] === "buyerName")
      return error?.message || "Invalid buyer name"
    }
    return null
  } catch (error) {
    console.error("[v0] Buyer name validation error:", error)
    return "Validation error"
  }
}

/**
 * Validate buyer address
 * @param value - The buyer address to validate
 * @returns Error message or null if valid
 */
export function validateBuyerAddress(value: string): string | null {
  try {
    const result = invoiceFieldSchema.safeParse({ buyerAddress: value })
    if (!result.success) {
      const error = result.error.errors.find((err) => err.path[0] === "buyerAddress")
      return error?.message || "Invalid address"
    }
    return null
  } catch (error) {
    console.error("[v0] Buyer address validation error:", error)
    return "Validation error"
  }
}

/**
 * Validate buyer GSTIN
 * @param value - The buyer GSTIN to validate
 * @returns Error message or null if valid
 */
export function validateBuyerGSTIN(value: string): string | null {
  try {
    const result = invoiceFieldSchema.safeParse({ buyerGSTIN: value })
    if (!result.success) {
      const error = result.error.errors.find((err) => err.path[0] === "buyerGSTIN")
      return error?.message || "Invalid GSTIN"
    }
    return null
  } catch (error) {
    console.error("[v0] Buyer GSTIN validation error:", error)
    return "Validation error"
  }
}

/**
 * Validate all buyer fields at once
 * @param data - Object containing buyer fields
 * @returns Object with field names as keys and error messages as values
 */
export function validateBuyerFields(data: { 
  buyerName?: string; 
  buyerAddress?: string; 
  buyerGSTIN?: string 
}): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (data.buyerName !== undefined) {
    const nameError = validateBuyerName(data.buyerName)
    if (nameError) errors.buyerName = nameError
  }
  
  if (data.buyerAddress !== undefined) {
    const addressError = validateBuyerAddress(data.buyerAddress)
    if (addressError) errors.buyerAddress = addressError
  }
  
  if (data.buyerGSTIN !== undefined) {
    const gstinError = validateBuyerGSTIN(data.buyerGSTIN)
    if (gstinError) errors.buyerGSTIN = gstinError
  }
  
  return errors
}