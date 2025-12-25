/**
 * Invoice calculation logic
 * Pure functions for computing invoice totals and tax breakdowns
 */

import type { InvoiceData, InvoiceTotals } from "./types"

/**
 * Extract state code from GSTIN (first 2 characters)
 * @param gstin - GST Identification Number
 * @returns State code or null if invalid
 */
function getStateCodeFromGSTIN(gstin: string): string | null {
  if (!gstin || gstin.length < 2) return null
  return gstin.substring(0, 2)
}

/**
 * Determine if transaction is inter-state based on seller and buyer GSTIN
 * @param sellerGSTIN - Seller's GSTIN
 * @param buyerGSTIN - Buyer's GSTIN (optional)
 * @param placeOfSupplyState - Place of supply state code (fallback)
 * @returns boolean indicating if it's an inter-state transaction
 */
function isInterStateTransaction(
  sellerGSTIN: string,
  buyerGSTIN: string,
  placeOfSupplyState?: string
): boolean {
  const sellerState = getStateCodeFromGSTIN(sellerGSTIN)
  const buyerState = getStateCodeFromGSTIN(buyerGSTIN)

  if (buyerState) {
    return sellerState !== buyerState
  }

  if (placeOfSupplyState) {
    return sellerState !== placeOfSupplyState
  }

  return false
}

/**
 * Calculate invoice totals and tax breakdown
 * Uses paise (1/100th of rupee) for precision to avoid floating point errors
 *
 * @param formData - Invoice form data
 * @returns InvoiceTotals with calculated amounts
 */
export function calculateInvoiceTotals(formData: InvoiceData): InvoiceTotals {
  const quantity = Number.parseFloat(formData.quantity) || 0
  const rate = Number.parseFloat(formData.rate) || 0

  const isInterState = isInterStateTransaction(
    formData.sellerGSTIN,
    formData.buyerGSTIN,
    formData.placeOfSupplyState
  )

  // Calculate in paise (1/100th) to avoid floating point issues
  const subtotalPaise = Math.round(quantity * rate * 100)
  const subtotal = subtotalPaise / 100

  let cgstAmount = 0
  let sgstAmount = 0
  let igstAmount = 0

  if (isInterState && formData.igst) {
    // Inter-state: use IGST only
    const igst = Number.parseFloat(formData.igst) || 0
    const igstPaise = Math.round((subtotalPaise * igst) / 100)
    igstAmount = igstPaise / 100
  } else {
    // Intra-state: split into CGST and SGST
    const cgst = Number.parseFloat(formData.cgst) || 0
    const sgst = Number.parseFloat(formData.sgst) || 0
    const cgstPaise = Math.round((subtotalPaise * cgst) / 100)
    const sgstPaise = Math.round((subtotalPaise * sgst) / 100)
    cgstAmount = cgstPaise / 100
    sgstAmount = sgstPaise / 100
  }

  // Final total
  const totalPaise =
    subtotalPaise +
    Math.round(cgstAmount * 100) +
    Math.round(sgstAmount * 100) +
    Math.round(igstAmount * 100)
  const total = totalPaise / 100

  return {
    subtotal: Number(subtotal.toFixed(2)),
    cgstAmount: Number(cgstAmount.toFixed(2)),
    sgstAmount: Number(sgstAmount.toFixed(2)),
    igstAmount: Number(igstAmount.toFixed(2)),
    total: Number(total.toFixed(2)),
    isInterState,
  }
}
