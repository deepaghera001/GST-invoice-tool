/**
 * Invoice-specific constants
 * Regex patterns, defaults, and configuration values
 */

/** GSTIN validation regex pattern */
export const GSTIN_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

/** SAC (Service Accounting Code) validation regex pattern */
export const SAC_REGEX = /^\d{6}$/

/** Invoice number validation regex pattern */
export const INVOICE_NUMBER_REGEX = /^[A-Z0-9\-/]+$/i

/** Date validation regex pattern (YYYY-MM-DD) */
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

/** Default invoice data */
export const DEFAULT_INVOICE_DATA = {
  sellerName: "",
  sellerAddress: "",
  sellerGSTIN: "",
  buyerName: "",
  buyerAddress: "",
  buyerGSTIN: "",
  placeOfSupplyState: "",
  invoiceNumber: "",
  invoiceDate: new Date().toISOString().split("T")[0],
  itemDescription: "",
  hsnCode: "",
  quantity: "1",
  rate: "",
  cgst: "9",
  sgst: "9",
  igst: "0",
}

/** Valid GST tax slabs (percentages) */
export const VALID_GST_SLABS = [0, 2.5, 5, 6, 9, 12, 14, 18, 28]

/** Maximum allowed values for numeric fields */
export const MAX_VALUES = {
  sellerName: 200,
  sellerAddress: 500,
  buyerName: 200,
  buyerAddress: 500,
  invoiceNumber: 20,
  itemDescription: 500,
  quantity: 1000000,
  rate: 10000000,
}

/** Minimum allowed values for numeric fields */
export const MIN_VALUES = {
  sellerName: 2,
  sellerAddress: 10,
  buyerName: 2,
  buyerAddress: 10,
  invoiceNumber: 1,
  itemDescription: 3,
  quantity: 0.01,
  rate: 0.01,
}

/** Tax percentage ranges */
export const TAX_RANGES = {
  cgst: { min: 0, max: 14 },
  sgst: { min: 0, max: 14 },
  igst: { min: 0, max: 28 },
}
