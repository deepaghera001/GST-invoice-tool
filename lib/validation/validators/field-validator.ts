import { z } from "zod"
import type { InvoiceValidationErrors } from "../schemas/invoice.schema"
import { invoiceSchema, invoiceFieldSchema } from "../schemas/invoice.schema"
import {
  validateSellerName,
  validateSellerAddress,
  validateSellerGSTIN
} from "./seller-validator"
import {
  validateBuyerName,
  validateBuyerAddress,
  validateBuyerGSTIN
} from "./buyer-validator"
import {
  validateInvoiceNumber,
  validateInvoiceDate
} from "./invoice-validator"
import {
  validateItemDescription,
  validateHSNCode,
  validateQuantity,
  validateRate
} from "./item-validator"
import {
  validateCGST,
  validateSGST,
  validateIGST
} from "./tax-validator"

export class FieldValidator {
  /**
   * Validate a single field
   */
  static validateField(fieldName: string, value: any): string | null {
    // Route to appropriate validator based on field name
    switch (fieldName) {
      // Seller fields
      case "sellerName":
        return validateSellerName(value)
      case "sellerAddress":
        return validateSellerAddress(value)
      case "sellerGSTIN":
        return validateSellerGSTIN(value)
        
      // Buyer fields
      case "buyerName":
        return validateBuyerName(value)
      case "buyerAddress":
        return validateBuyerAddress(value)
      case "buyerGSTIN":
        return validateBuyerGSTIN(value)
        
      // Invoice fields
      case "invoiceNumber":
        return validateInvoiceNumber(value)
      case "invoiceDate":
        return validateInvoiceDate(value)
        
      // Item fields
      case "itemDescription":
        return validateItemDescription(value)
      case "hsnCode":
        return validateHSNCode(value)
      case "quantity":
        return validateQuantity(value)
      case "rate":
        return validateRate(value)
        
      // Tax fields
      case "cgst":
        return validateCGST(value)
      case "sgst":
        return validateSGST(value)
      case "igst":
        return validateIGST(value)
        
      default:
        // Fallback to original validation for unknown fields
        try {
          const partialData = { [fieldName]: value }
          const result = invoiceFieldSchema.safeParse(partialData)
          
          if (!result.success) {
            const fieldError = result.error.errors.find((err: z.ZodIssue) => err.path[0] === fieldName)
            return fieldError?.message || "Invalid value"
          }
          return null
        } catch (error) {
          console.error("[v0] Field validation error:", error)
          return "Validation error"
        }
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