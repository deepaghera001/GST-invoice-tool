"use client"

import type { InvoiceData, InvoiceTotals, InvoiceValidationErrors } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils/formatters"
import { getStateFromGSTIN, gstinStates } from "@/lib/suggestions/data/gstin-states"

interface InvoicePreviewProps {
  formData: InvoiceData
  totals: InvoiceTotals
  errors?: InvoiceValidationErrors
}

const gstinRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
const sacRegex = /^\d{6}$/

export function InvoicePreview({ formData, totals, errors }: InvoicePreviewProps) {
  const isSellerGSTINValid = gstinRegex.test(formData.sellerGSTIN)
  const isBuyerGSTINValid = !formData.buyerGSTIN || gstinRegex.test(formData.buyerGSTIN)
  const isSACValid = !formData.hsnCode || sacRegex.test(formData.hsnCode)
  
  // Determine place of supply
  const sellerStateCode = formData.sellerGSTIN.substring(0, 2)
  const buyerStateCode = formData.buyerGSTIN ? formData.buyerGSTIN.substring(0, 2) : formData.placeOfSupplyState || sellerStateCode
  const isInterState = buyerStateCode !== sellerStateCode && (formData.buyerGSTIN || formData.placeOfSupplyState)
  
  // Get place of supply name
  let placeOfSupply = "Not specified yet"
  if (formData.buyerGSTIN) {
    placeOfSupply = getStateFromGSTIN(formData.buyerGSTIN) || "Not specified yet"
  } else if (formData.placeOfSupplyState) {
    const state = gstinStates.find((s) => s.code === formData.placeOfSupplyState)
    placeOfSupply = state ? state.name : "Not specified yet"
  } else if (isInterState) {
    placeOfSupply = "Other Territory"
  } else if (formData.sellerGSTIN) {
    placeOfSupply = getStateFromGSTIN(formData.sellerGSTIN) || "Not specified yet"
  }

  return (
    <Card className="sticky top-4">
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <CardTitle className="text-lg">Invoice Preview</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Invoice Header */}
        <div className="space-y-1 animate-in fade-in duration-200">
          <h2 className="text-2xl font-bold text-foreground">TAX INVOICE</h2>
          {formData.invoiceNumber && (
            <p className="text-sm text-muted-foreground animate-in fade-in duration-200">
              Invoice #: {formData.invoiceNumber}
            </p>
          )}
          {formData.invoiceDate && (
            <p className="text-sm text-muted-foreground animate-in fade-in duration-200">
              Date: {formatDate(formData.invoiceDate)}
            </p>
          )}
        </div>

        <Separator />

        {/* Seller Details */}
        <div className="space-y-2 animate-in fade-in duration-200 delay-75">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">From</h3>
          <div className="space-y-1">
            <p className="font-semibold text-foreground animate-in fade-in duration-200">
              {formData.sellerName || "Your Business Name"}
            </p>
            {formData.sellerAddress && (
              <p className="text-sm text-muted-foreground whitespace-pre-line animate-in fade-in duration-200">
                {formData.sellerAddress}
              </p>
            )}
            {isSellerGSTINValid && formData.sellerGSTIN ? (
              <p className="text-sm text-muted-foreground animate-in fade-in duration-200">
                GSTIN: {formData.sellerGSTIN}
              </p>
            ) : formData.sellerGSTIN && !isSellerGSTINValid ? (
              <p className="text-sm text-destructive animate-in fade-in duration-200">
                GSTIN: — Invalid —
              </p>
            ) : null}
          </div>
        </div>

        <Separator />

        {/* Buyer Details */}
        <div className="space-y-2 animate-in fade-in duration-200 delay-100">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">Bill To</h3>
          <div className="space-y-1">
            <p className="font-semibold text-foreground animate-in fade-in duration-200">
              {formData.buyerName || "Customer Name"}
            </p>
            {formData.buyerAddress && (
              <p className="text-sm text-muted-foreground whitespace-pre-line animate-in fade-in duration-200">
                {formData.buyerAddress}
              </p>
            )}
            {isBuyerGSTINValid && formData.buyerGSTIN ? (
              <p className="text-sm text-muted-foreground animate-in fade-in duration-200">
                GSTIN: {formData.buyerGSTIN}
              </p>
            ) : formData.buyerGSTIN && !isBuyerGSTINValid ? (
              <p className="text-sm text-destructive animate-in fade-in duration-200">
                GSTIN: — Invalid —
              </p>
            ) : null}
            {placeOfSupply !== "Not specified yet" && (
              <p className="text-sm text-muted-foreground animate-in fade-in duration-200">
                Place of Supply: {placeOfSupply}
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Items Table */}
        <div className="space-y-3 animate-in fade-in duration-200 delay-150">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">Items</h3>
          <div className="border border-border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2 text-muted-foreground font-medium">Description</th>
                  <th className="text-right p-2 text-muted-foreground font-medium">HSN/SAC</th>
                  <th className="text-right p-2 text-muted-foreground font-medium">Qty</th>
                  <th className="text-right p-2 text-muted-foreground font-medium">Rate</th>
                  <th className="text-right p-2 text-muted-foreground font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-2">
                    <p className="font-medium text-foreground animate-in fade-in duration-200">
                      {formData.itemDescription || "Service/Product Description"}
                    </p>
                  </td>
                  <td className="text-right p-2 text-foreground animate-in fade-in duration-200">
                    {isSACValid && formData.hsnCode ? (
                      <span>{formData.hsnCode}</span>
                    ) : formData.hsnCode && !isSACValid ? (
                      <span className="text-destructive">— Invalid —</span>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td className="text-right p-2 text-foreground animate-in fade-in duration-200">
                    {formData.quantity || "-"}
                  </td>
                  <td className="text-right p-2 text-foreground animate-in fade-in duration-200">
                    {formatCurrency(Number(formData.rate) || 0)}
                  </td>
                  <td className="text-right p-2 text-foreground animate-in fade-in duration-200">
                    {formatCurrency(totals.subtotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-2 animate-in fade-in duration-200 delay-200">
          <div className="flex justify-between text-sm animate-in fade-in duration-200">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">
              {formatCurrency(totals.subtotal)}
            </span>
          </div>
          {totals.isInterState && formData.igst ? (
            <div className="flex justify-between text-sm animate-in fade-in duration-200">
              <span className="text-muted-foreground">IGST ({formData.igst || 0}%)</span>
              <span className="font-medium text-foreground">
                {formatCurrency(totals.igstAmount)}
              </span>
            </div>
          ) : (
            <>
              <div className="flex justify-between text-sm animate-in fade-in duration-200">
                <span className="text-muted-foreground">CGST ({formData.cgst || 0}%)</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(totals.cgstAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm animate-in fade-in duration-200">
                <span className="text-muted-foreground">SGST ({formData.sgst || 0}%)</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(totals.sgstAmount)}
                </span>
              </div>
            </>
          )}
          <Separator />
          <div className="flex justify-between text-base font-bold animate-in fade-in duration-200">
            <span className="text-foreground">Total</span>
            <span className="text-primary">
              {formatCurrency(totals.total)}
            </span>
          </div>
        </div>
        
        {/* Amount in Words */}
        <div className="text-sm text-muted-foreground animate-in fade-in duration-200 delay-250">
          Amount in words: {numberToWords(totals.total)} Rupees Only
        </div>
      </CardContent>
    </Card>
  )
}

// Simple number to words conversion for Indian numbering system
function numberToWords(num: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ]

  if (num === 0) return "Zero"

  const crores = Math.floor(num / 10000000)
  const lakhs = Math.floor((num % 10000000) / 100000)
  const thousands = Math.floor((num % 100000) / 1000)
  const hundreds = Math.floor((num % 1000) / 100)
  const remainder = Math.floor(num % 100)

  let words = ""

  if (crores > 0) words += convertTwoDigit(crores) + " Crore "
  if (lakhs > 0) words += convertTwoDigit(lakhs) + " Lakh "
  if (thousands > 0) words += convertTwoDigit(thousands) + " Thousand "
  if (hundreds > 0) words += ones[hundreds] + " Hundred "
  if (remainder > 0) words += convertTwoDigit(remainder)

  return words.trim()

  function convertTwoDigit(n: number): string {
    if (n < 10) return ones[n]
    if (n >= 10 && n < 20) return teens[n - 10]
    return tens[Math.floor(n / 10)] + (n % 10 > 0 ? " " + ones[n % 10] : "")
  }
}