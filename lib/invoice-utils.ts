import type { InvoiceData, InvoiceTotals } from "./types"
import { calculateInvoiceTotals } from "./utils/invoice-calculator"
import { formatCurrency, formatDate } from "./utils/formatters"

export { calculateInvoiceTotals, formatCurrency, formatDate }

// Original function implementations remain unchanged
function _calculateInvoiceTotals(formData: InvoiceData): InvoiceTotals {
  const quantity = Number.parseFloat(formData.quantity) || 0
  const rate = Number.parseFloat(formData.rate) || 0
  const cgst = Number.parseFloat(formData.cgst) || 0
  const sgst = Number.parseFloat(formData.sgst) || 0

  const subtotal = quantity * rate
  const cgstAmount = (subtotal * cgst) / 100
  const sgstAmount = (subtotal * sgst) / 100
  const total = subtotal + cgstAmount + sgstAmount

  return { subtotal, cgstAmount, sgstAmount, total }
}

function _formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount)
}

function _formatDate(dateString: string): string {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}
