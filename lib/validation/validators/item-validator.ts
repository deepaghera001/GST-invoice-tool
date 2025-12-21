import { invoiceFieldSchema } from "../schemas/invoice.schema"

/**
 * Validate item description
 * @param value - The item description to validate
 * @returns Error message or null if valid
 */
export function validateItemDescription(value: string): string | null {
  try {
    const result = invoiceFieldSchema.safeParse({ itemDescription: value })
    if (!result.success) {
      const error = result.error.errors.find((err) => err.path[0] === "itemDescription")
      return error?.message || "Invalid description"
    }
    return null
  } catch (error) {
    console.error("[v0] Item description validation error:", error)
    return "Validation error"
  }
}

/**
 * Validate HSN code
 * @param value - The HSN code to validate
 * @returns Error message or null if valid
 */
export function validateHSNCode(value: string): string | null {
  try {
    const result = invoiceFieldSchema.safeParse({ hsnCode: value })
    if (!result.success) {
      const error = result.error.errors.find((err) => err.path[0] === "hsnCode")
      return error?.message || "Invalid HSN code"
    }
    return null
  } catch (error) {
    console.error("[v0] HSN code validation error:", error)
    return "Validation error"
  }
}

/**
 * Validate quantity
 * @param value - The quantity to validate
 * @returns Error message or null if valid
 */
export function validateQuantity(value: string): string | null {
  try {
    const result = invoiceFieldSchema.safeParse({ quantity: value })
    if (!result.success) {
      const error = result.error.errors.find((err) => err.path[0] === "quantity")
      return error?.message || "Invalid quantity"
    }
    return null
  } catch (error) {
    console.error("[v0] Quantity validation error:", error)
    return "Validation error"
  }
}

/**
 * Validate rate
 * @param value - The rate to validate
 * @returns Error message or null if valid
 */
export function validateRate(value: string): string | null {
  try {
    const result = invoiceFieldSchema.safeParse({ rate: value })
    if (!result.success) {
      const error = result.error.errors.find((err) => err.path[0] === "rate")
      return error?.message || "Invalid rate"
    }
    return null
  } catch (error) {
    console.error("[v0] Rate validation error:", error)
    return "Validation error"
  }
}

/**
 * Validate all item fields at once
 * @param data - Object containing item fields
 * @returns Object with field names as keys and error messages as values
 */
export function validateItemFields(data: { 
  itemDescription?: string; 
  hsnCode?: string; 
  quantity?: string; 
  rate?: string 
}): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (data.itemDescription !== undefined) {
    const descriptionError = validateItemDescription(data.itemDescription)
    if (descriptionError) errors.itemDescription = descriptionError
  }
  
  if (data.hsnCode !== undefined) {
    const hsnError = validateHSNCode(data.hsnCode)
    if (hsnError) errors.hsnCode = hsnError
  }
  
  if (data.quantity !== undefined) {
    const quantityError = validateQuantity(data.quantity)
    if (quantityError) errors.quantity = quantityError
  }
  
  if (data.rate !== undefined) {
    const rateError = validateRate(data.rate)
    if (rateError) errors.rate = rateError
  }
  
  return errors
}