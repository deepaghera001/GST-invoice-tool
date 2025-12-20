"use client"

import type { InvoiceData, InvoiceTotals, InvoiceValidationErrors } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/invoice-utils"

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
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">TAX INVOICE</h2>
          {formData.invoiceNumber && (
            <p className="text-sm text-muted-foreground">Invoice #: {formData.invoiceNumber}</p>
          )}
          {formData.invoiceDate && (
            <p className="text-sm text-muted-foreground">Date: {formatDate(formData.invoiceDate)}</p>
          )}
        </div>

        <Separator />

        {/* Seller Details */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">From</h3>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">{formData.sellerName || "Your Business Name"}</p>
            {formData.sellerAddress && (
              <p className="text-sm text-muted-foreground whitespace-pre-line">{formData.sellerAddress}</p>
            )}
            {isSellerGSTINValid ? (
              <p className="text-sm text-muted-foreground">GSTIN: {formData.sellerGSTIN}</p>
            ) : formData.sellerGSTIN ? (
              <p className="text-sm text-destructive">GSTIN: — Invalid —</p>
            ) : null}
          </div>
        </div>

        <Separator />

        {/* Buyer Details */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">Bill To</h3>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">{formData.buyerName || "Customer Name"}</p>
            {formData.buyerAddress && (
              <p className="text-sm text-muted-foreground whitespace-pre-line">{formData.buyerAddress}</p>
            )}
            {isBuyerGSTINValid && formData.buyerGSTIN ? (
              <p className="text-sm text-muted-foreground">GSTIN: {formData.buyerGSTIN}</p>
            ) : formData.buyerGSTIN && !isBuyerGSTINValid ? (
              <p className="text-sm text-destructive">GSTIN: — Invalid —</p>
            ) : null}
          </div>
        </div>

        <Separator />

        {/* Items Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">Items</h3>
          <div className="border border-border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2 text-muted-foreground font-medium">Description</th>
                  <th className="text-right p-2 text-muted-foreground font-medium">Qty</th>
                  <th className="text-right p-2 text-muted-foreground font-medium">Rate</th>
                  <th className="text-right p-2 text-muted-foreground font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-2">
                    <p className="font-medium text-foreground">
                      {formData.itemDescription || "Service/Product Description"}
                    </p>
                    {isSACValid && formData.hsnCode ? (
                      <p className="text-xs text-muted-foreground">SAC: {formData.hsnCode}</p>
                    ) : formData.hsnCode && !isSACValid ? (
                      <p className="text-xs text-destructive">SAC: — Invalid —</p>
                    ) : null}
                  </td>
                  <td className="text-right p-2 text-foreground">{formData.quantity || "-"}</td>
                  <td className="text-right p-2 text-foreground">{formatCurrency(Number(formData.rate) || 0)}</td>
                  <td className="text-right p-2 text-foreground">{formatCurrency(totals.subtotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">{formatCurrency(totals.subtotal)}</span>
          </div>
          {totals.isInterState ? (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">IGST ({formData.igst || 0}%)</span>
              <span className="font-medium text-foreground">{formatCurrency(totals.igstAmount)}</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">CGST ({formData.cgst || 0}%)</span>
                <span className="font-medium text-foreground">{formatCurrency(totals.cgstAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SGST ({formData.sgst || 0}%)</span>
                <span className="font-medium text-foreground">{formatCurrency(totals.sgstAmount)}</span>
              </div>
            </>
          )}
          <Separator />
          <div className="flex justify-between text-base font-bold">
            <span className="text-foreground">Total</span>
            <span className="text-primary">{formatCurrency(totals.total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
