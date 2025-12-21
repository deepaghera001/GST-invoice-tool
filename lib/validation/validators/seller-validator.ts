import { z } from "zod"
import { invoiceFieldSchema } from "../schemas/invoice.schema"

/**
 * Validate seller name
 * @param value - The seller name to validate
 * @returns Error message or null if valid
 */
export function validateSellerName(value: string): string | null {
  try {
    const result = invoiceFieldSchema.safeParse({ sellerName: value })
    if (!result.success) {
      const error = result.error.errors.find((err) => err.path[0] === "sellerName")
      return error?.message || "Invalid seller name"
    }
    return null
  } catch (error) {
    console.error("[v0] Seller name validation error:", error)
    return "Validation error"
  }
}

/**
 * Validate seller address
 * @param value - The seller address to validate
 * @returns Error message or null if valid
 */
export function validateSellerAddress(value: string): string | null {
  try {
    const result = invoiceFieldSchema.safeParse({ sellerAddress: value })
    if (!result.success) {
      const error = result.error.errors.find((err) => err.path[0] === "sellerAddress")
      return error?.message || "Invalid address"
    }
    return null
  } catch (error) {
    console.error("[v0] Seller address validation error:", error)
    return "Validation error"
  }
}

/**
 * Validate seller GSTIN
 * @param value - The seller GSTIN to validate
 * @returns Error message or null if valid
 */
export function validateSellerGSTIN(value: string): string | null {
  try {
    const result = invoiceFieldSchema.safeParse({ sellerGSTIN: value })
    if (!result.success) {
      const error = result.error.errors.find((err) => err.path[0] === "sellerGSTIN")
      return error?.message || "Invalid GSTIN"
    }
    return null
  } catch (error) {
    console.error("[v0] Seller GSTIN validation error:", error)
    return "Validation error"
  }
}

/**
 * Validate all seller fields at once
 * @param data - Object containing seller fields
 * @returns Object with field names as keys and error messages as values
 */
export function validateSellerFields(data: { 
  sellerName?: string; 
  sellerAddress?: string; 
  sellerGSTIN?: string 
}): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (data.sellerName !== undefined) {
    const nameError = validateSellerName(data.sellerName)
    if (nameError) errors.sellerName = nameError
  }
  
  if (data.sellerAddress !== undefined) {
    const addressError = validateSellerAddress(data.sellerAddress)
    if (addressError) errors.sellerAddress = addressError
  }
  
  if (data.sellerGSTIN !== undefined) {
    const gstinError = validateSellerGSTIN(data.sellerGSTIN)
    if (gstinError) errors.sellerGSTIN = gstinError
  }
  
  return errors
}