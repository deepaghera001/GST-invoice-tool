import { z } from "zod"

const gstinRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

const sacRegex = /^\d{6}$/

// Base schema without refinements - used for creating partial schemas
const baseInvoiceSchema = z.object({
  // Seller Details
  sellerName: z
    .string()
    .min(2, "Seller name must be at least 2 characters")
    .max(200, "Seller name is too long")
    .trim(),

  sellerAddress: z.string().min(10, "Address must be at least 10 characters").max(500, "Address is too long").trim(),

  sellerGSTIN: z.string().regex(gstinRegex, "Invalid GSTIN format (e.g., 29ABCDE1234F1Z5)").toUpperCase(),

  // Buyer Details
  buyerName: z.string().min(2, "Buyer name must be at least 2 characters").max(200, "Buyer name is too long").trim(),

  buyerAddress: z.string().min(10, "Address must be at least 10 characters").max(500, "Address is too long").trim(),

  buyerGSTIN: z.string().regex(gstinRegex, "Invalid GSTIN format").toUpperCase().optional().or(z.literal("")),

  // Invoice Details
  invoiceNumber: z
    .string()
    .min(1, "Invoice number is required")
    .max(20, "Invoice number is too long")
    .regex(/^[A-Z0-9\-/]+$/i, "Invoice number can only contain letters, numbers, hyphens, and slashes")
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

  hsnCode: z.string().regex(sacRegex, "SAC must be exactly 6 digits").optional().or(z.literal("")),

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

  cgst: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "CGST must be a valid number")
    .refine((val) => {
      const num = Number.parseFloat(val)
      return num >= 0 && num <= 14
    }, "CGST must be between 0% and 14%"),

  sgst: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "SGST must be a valid number")
    .refine((val) => {
      const num = Number.parseFloat(val)
      return num >= 0 && num <= 14
    }, "SGST must be between 0% and 14%"),

  igst: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "IGST must be a valid number")
    .refine((val) => {
      const num = Number.parseFloat(val)
      return num >= 0 && num <= 28
    }, "IGST must be between 0% and 28%")
    .optional()
    .or(z.literal("")),
})
// Export the partial schema for field validation
export const invoiceFieldSchema = baseInvoiceSchema.partial()

// Export the full schema with cross-field validations for form validation
export const invoiceSchema = baseInvoiceSchema.refine(
  (data) => {
    const cgst = Number.parseFloat(data.cgst) || 0
    const sgst = Number.parseFloat(data.sgst) || 0
    const igst = Number.parseFloat(data.igst || "0") || 0

    if (igst > 0 && (cgst > 0 || sgst > 0)) {
      return false
    }

    const validRates = [0, 5, 12, 18, 28]
    const validDecimalRates = [0, 2.5, 5, 6, 9, 12, 14, 18, 28];

    if (igst > 0) {
      return validDecimalRates.includes(igst);
    }

    const total = parseFloat((cgst + sgst).toFixed(2));
    return validDecimalRates.includes(total) && parseFloat(cgst.toFixed(2)) === parseFloat(sgst.toFixed(2));
  },
  {
    message: "GST must be from supported slabs: 0%, 5%, 12%, 18%, or 28% (automatically split into CGST/SGST where applicable). For intra-state: CGST = SGST. For inter-state: use IGST only.",
    path: ["cgst"],
  },
)

export type InvoiceFormData = z.infer<typeof invoiceSchema>
export type InvoiceValidationErrors = Partial<Record<keyof InvoiceFormData, string>>
