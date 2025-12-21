import type { BaseDocumentData } from "./document.types"

export interface InvoiceData extends BaseDocumentData {
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
