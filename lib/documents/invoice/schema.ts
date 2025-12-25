/**
 * Invoice validation schema
 * Zod schema for form validation and field-level validation
 */

import { z } from "zod"
import {
  GSTIN_REGEX,
  SAC_REGEX,
  INVOICE_NUMBER_REGEX,
  TAX_RANGES,
  VALID_GST_SLABS,
} from "./constants"
import type { InvoiceData } from "./types"

/**
 * Base schema without cross-field refinements
 * Used for creating partial schemas for individual field validation
 */
const baseInvoiceSchema = z.object({
  // Seller Details
  sellerName: z
    .string()
    .min(2, "Seller name must be at least 2 characters")
    .max(200, "Seller name is too long")
    .trim(),

  sellerAddress: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address is too long")
    .trim(),

  sellerGSTIN: z
    .string()
    .regex(GSTIN_REGEX, "Invalid GSTIN format (e.g., 29ABCDE1234F1Z5)")
    .toUpperCase(),

  // Buyer Details
  buyerName: z
    .string()
    .min(2, "Buyer name must be at least 2 characters")
    .max(200, "Buyer name is too long")
    .trim(),

  buyerAddress: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address is too long")
    .trim(),

  buyerGSTIN: z
    .string()
    .regex(GSTIN_REGEX, "Invalid GSTIN format")
    .toUpperCase()
    .optional()
    .or(z.literal("")),

  // Place of Supply
  placeOfSupplyState: z.string().optional(),

  // Invoice Details
  invoiceNumber: z
    .string()
    .min(1, "Invoice number is required")
    .max(20, "Invoice number is too long")
    .regex(INVOICE_NUMBER_REGEX, "Invoice number can only contain letters, numbers, hyphens, and slashes")
    .trim(),

  invoiceDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .refine((date) => {
      const invoiceDate = new Date(date)
      const today = new Date()
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(today.getMonth() - 3)
      const oneMonthAhead = new Date()
      oneMonthAhead.setMonth(today.getMonth() + 1)

      return invoiceDate >= threeMonthsAgo && invoiceDate <= oneMonthAhead
    }, "Invoice date must be within the last 3 months or next month"),

  // Item Details
  itemDescription: z
    .string()
    .min(3, "Item description must be at least 3 characters")
    .max(500, "Item description is too long")
    .trim(),

  hsnCode: z
    .string()
    .regex(SAC_REGEX, "SAC must be exactly 6 digits")
    .optional()
    .or(z.literal("")),

  quantity: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Quantity must be a valid number")
    .refine((val) => Number.parseFloat(val) > 0, "Quantity must be greater than 0")
    .refine((val) => Number.parseFloat(val) <= 1000000, "Quantity is too large"),

  rate: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Rate must be a valid number")
    .refine((val) => Number.parseFloat(val) > 0, "Rate must be greater than 0")
    .refine((val) => Number.parseFloat(val) <= 10000000, "Rate is too large"),

  // Tax Details
  cgst: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "CGST must be a valid number")
    .refine(
      (val) => {
        const num = Number.parseFloat(val)
        return num >= TAX_RANGES.cgst.min && num <= TAX_RANGES.cgst.max
      },
      `CGST must be between ${TAX_RANGES.cgst.min}% and ${TAX_RANGES.cgst.max}%`
    ),

  sgst: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "SGST must be a valid number")
    .refine(
      (val) => {
        const num = Number.parseFloat(val)
        return num >= TAX_RANGES.sgst.min && num <= TAX_RANGES.sgst.max
      },
      `SGST must be between ${TAX_RANGES.sgst.min}% and ${TAX_RANGES.sgst.max}%`
    ),

  igst: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "IGST must be a valid number")
    .refine(
      (val) => {
        const num = Number.parseFloat(val)
        return num >= TAX_RANGES.igst.min && num <= TAX_RANGES.igst.max
      },
      `IGST must be between ${TAX_RANGES.igst.min}% and ${TAX_RANGES.igst.max}%`
    )
    .optional()
    .or(z.literal("")),
})

/**
 * Partial schema for individual field validation
 * Used when validating a single field at a time
 */
export const invoiceFieldSchema = baseInvoiceSchema.partial()

/**
 * Full schema with cross-field validations
 * Used for complete form validation before submission
 */
export const invoiceSchema = baseInvoiceSchema.refine(
  (data) => {
    const cgst = Number.parseFloat(data.cgst) || 0
    const sgst = Number.parseFloat(data.sgst) || 0
    const igst = Number.parseFloat(data.igst || "0") || 0

    // IGST and CGST/SGST are mutually exclusive
    if (igst > 0 && (cgst > 0 || sgst > 0)) {
      return false
    }

    // Validate against allowed GST slabs
    if (igst > 0) {
      return VALID_GST_SLABS.includes(igst)
    }

    const total = parseFloat((cgst + sgst).toFixed(2))
    return (
      VALID_GST_SLABS.includes(total) &&
      parseFloat(cgst.toFixed(2)) === parseFloat(sgst.toFixed(2))
    )
  },
  {
    message:
      "GST must be from supported slabs: 0%, 5%, 12%, 18%, or 28% (automatically split into CGST/SGST where applicable). For intra-state: CGST = SGST. For inter-state: use IGST only.",
    path: ["cgst"],
  }
)

export type InvoiceFormData = z.infer<typeof invoiceSchema>
