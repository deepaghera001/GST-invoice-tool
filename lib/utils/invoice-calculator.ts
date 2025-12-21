import type { InvoiceData, InvoiceTotals } from "@/lib/core/types"

function getStateCodeFromGSTIN(gstin: string): string | null {
  if (!gstin || gstin.length < 2) return null
  return gstin.substring(0, 2)
}

export function calculateInvoiceTotals(formData: InvoiceData): InvoiceTotals {
  const quantity = Number.parseFloat(formData.quantity) || 0
  const rate = Number.parseFloat(formData.rate) || 0

  const sellerState = getStateCodeFromGSTIN(formData.sellerGSTIN)
  const buyerState = getStateCodeFromGSTIN(formData.buyerGSTIN)
  // If buyer GSTIN is missing, use place of supply state if available
  const isInterState = buyerState 
    ? sellerState !== buyerState 
    : formData.placeOfSupplyState 
      ? sellerState !== formData.placeOfSupplyState
      : false // Default to intra-state when both buyer GSTIN and place of supply are missing

  // Calculate in paise to avoid floating point issues
  const subtotalPaise = Math.round(quantity * rate * 100)
  const subtotal = subtotalPaise / 100

  let cgstAmount = 0
  let sgstAmount = 0
  let igstAmount = 0

  if (isInterState && formData.igst) {
    const igst = Number.parseFloat(formData.igst) || 0
    const igstPaise = Math.round((subtotalPaise * igst) / 100)
    igstAmount = igstPaise / 100
  } else {
    const cgst = Number.parseFloat(formData.cgst) || 0
    const sgst = Number.parseFloat(formData.sgst) || 0
    const cgstPaise = Math.round((subtotalPaise * cgst) / 100)
    const sgstPaise = Math.round((subtotalPaise * sgst) / 100)
    cgstAmount = cgstPaise / 100
    sgstAmount = sgstPaise / 100
  }

  const totalPaise =
    subtotalPaise + Math.round(cgstAmount * 100) + Math.round(sgstAmount * 100) + Math.round(igstAmount * 100)
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
