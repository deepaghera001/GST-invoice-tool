export interface InvoiceData {
  // Seller Details
  sellerName: string
  sellerAddress: string
  sellerGSTIN: string

  // Buyer Details
  buyerName: string
  buyerAddress: string
  buyerGSTIN: string

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
  igst?: string // Added IGST for inter-state transactions
}

export interface InvoiceTotals {
  subtotal: number
  cgstAmount: number
  sgstAmount: number
  igstAmount: number // Added IGST amount
  total: number
  isInterState: boolean // Added flag to indicate inter-state transaction
}

export type { InvoiceValidationErrors } from "./validation"

export type { InvoiceData as InvoiceDataCore, InvoiceTotals as InvoiceTotalsCore } from "./core/types"
