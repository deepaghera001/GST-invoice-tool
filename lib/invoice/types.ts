/**
 * Invoice-specific types and interfaces
 * Central place for all Invoice domain models
 */

export interface InvoiceData {
  // Seller Details
  sellerName: string
  sellerAddress: string
  sellerGSTIN: string

  // Buyer Details
  buyerName: string
  buyerAddress: string
  buyerGSTIN: string

  // Place of Supply (for cases where buyer GSTIN is missing)
  placeOfSupplyState?: string

  // Invoice Details
  invoiceNumber: string
  invoiceDate: string

  // Item Details
  itemDescription: string
  hsnCode: string
  quantity: string
  rate: string

  // Tax Details
  cgst: string
  sgst: string
  igst?: string // For inter-state transactions
}

export interface InvoiceTotals {
  subtotal: number
  cgstAmount: number
  sgstAmount: number
  igstAmount: number
  total: number
  isInterState: boolean
}

export type InvoiceValidationErrors = Partial<Record<keyof InvoiceData, string>>

export interface InvoiceCalculatedData {
  formData: InvoiceData
  totals: InvoiceTotals
}
