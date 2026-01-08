/**
 * Invoice Preview Component
 * With built-in field highlighting and auto-scroll
 * 
 * Simple approach: All highlighting logic is self-contained in this component.
 * No external hooks needed - just pass formData and it handles everything.
 */

"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import type { InvoiceCalculatedData, InvoiceValidationErrors } from "@/lib/invoice"
import { Separator } from "@/components/ui/separator"
import { FileText } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils/formatters"
import { PreviewWrapper } from "../shared/preview-wrapper"
import { numberToWords } from "@/lib/utils/number-to-words"
import { getStateFromGSTIN, gstinStates } from "@/lib/invoice/data/gstin-states"
import { GSTIN_REGEX, SAC_REGEX } from "@/lib/invoice"

interface InvoicePreviewProps {
  calculatedData: InvoiceCalculatedData
  errors?: InvoiceValidationErrors
  /** Optional max height for preview (e.g. '55vh') */
  maxHeight?: string
}

// Highlight duration in milliseconds
const HIGHLIGHT_DURATION = 2500

/**
 * Get place of supply from GSTIN or state selection
 */
function getPlaceOfSupply(
  sellerGSTIN: string,
  buyerGSTIN: string,
  placeOfSupplyState?: string,
  isInterState?: boolean
): string {
  if (buyerGSTIN) {
    return getStateFromGSTIN(buyerGSTIN) || "Not specified yet"
  }
  if (placeOfSupplyState) {
    const state = gstinStates.find((s) => s.code === placeOfSupplyState)
    return state ? state.name : "Not specified yet"
  }
  if (isInterState) {
    return "Other Territory"
  }
  if (sellerGSTIN) {
    return getStateFromGSTIN(sellerGSTIN) || "Not specified yet"
  }
  return "Not specified yet"
}

export function InvoicePreview({ calculatedData, errors, maxHeight }: InvoicePreviewProps) {
  const { formData, totals } = calculatedData
  
  // ===== SIMPLE HIGHLIGHTING LOGIC =====
  // Track previous values to detect changes
  const prevFormDataRef = useRef(formData)
  const prevTotalsRef = useRef(totals)
  
  // Set of currently highlighted field names
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set())
  
  // Refs for scrolling to fields
  const fieldRefs = useRef<Map<string, HTMLElement | null>>(new Map())
  
  // Timeout refs for clearing highlights
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Detect changes and highlight
  useEffect(() => {
    const prev = prevFormDataRef.current
    const changed: string[] = []

    // Check each form field
    const fieldsToCheck = [
      'sellerName', 'sellerAddress', 'sellerGSTIN',
      'buyerName', 'buyerAddress', 'buyerGSTIN',
      'invoiceNumber', 'invoiceDate',
      'itemDescription', 'hsnCode', 'quantity', 'rate',
      'cgst', 'sgst', 'igst'
    ]

    for (const field of fieldsToCheck) {
      const prevVal = prev[field as keyof typeof prev]
      const currVal = formData[field as keyof typeof formData]
      
      if (prevVal !== currVal && currVal !== '' && currVal !== undefined) {
        changed.push(field)
      }
    }

    // Check totals (for GST calculations)
    const prevTotals = prevTotalsRef.current
    if (prevTotals.cgstAmount !== totals.cgstAmount && totals.cgstAmount > 0) {
      changed.push('cgstAmount')
    }
    if (prevTotals.sgstAmount !== totals.sgstAmount && totals.sgstAmount > 0) {
      changed.push('sgstAmount')
    }
    if (prevTotals.igstAmount !== totals.igstAmount && totals.igstAmount > 0) {
      changed.push('igstAmount')
    }
    if (prevTotals.total !== totals.total && totals.total > 0) {
      changed.push('total')
    }

    if (changed.length > 0) {
      // Add to highlighted set
      setHighlighted(prev => {
        const next = new Set(prev)
        changed.forEach(f => next.add(f))
        return next
      })

      // Auto-scroll to first changed field (within preview container only)
      setTimeout(() => {
        const firstRef = fieldRefs.current.get(changed[0])
        const scrollContainer = document.getElementById('invoice-preview')
        if (firstRef && scrollContainer) {
          // Calculate position relative to scroll container
          const containerRect = scrollContainer.getBoundingClientRect()
          const elementRect = firstRef.getBoundingClientRect()
          const scrollTop = scrollContainer.scrollTop + (elementRect.top - containerRect.top) - (containerRect.height / 2)
          scrollContainer.scrollTo({ top: scrollTop, behavior: 'smooth' })
        }
      }, 50)

      // Clear highlights after duration
      changed.forEach(field => {
        // Clear existing timeout
        const existing = timeoutsRef.current.get(field)
        if (existing) clearTimeout(existing)

        const timeout = setTimeout(() => {
          setHighlighted(prev => {
            const next = new Set(prev)
            next.delete(field)
            return next
          })
        }, HIGHLIGHT_DURATION)
        
        timeoutsRef.current.set(field, timeout)
      })
    }

    // Update refs
    prevFormDataRef.current = { ...formData }
    prevTotalsRef.current = { ...totals }
  }, [formData, totals])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(t => clearTimeout(t))
    }
  }, [])

  // Helper: Get highlight class for a field
  const hl = useCallback((field: string) => {
    return highlighted.has(field) 
      ? 'pdf-field-highlight' 
      : ''
  }, [highlighted])

  // Helper: Create ref for a field
  const setRef = useCallback((field: string) => (el: HTMLElement | null) => {
    fieldRefs.current.set(field, el)
  }, [])

  // ===== END HIGHLIGHTING LOGIC =====

  // Validate GSTIN and SAC formats
  const isSellerGSTINValid = GSTIN_REGEX.test(formData.sellerGSTIN)
  const isBuyerGSTINValid = !formData.buyerGSTIN || GSTIN_REGEX.test(formData.buyerGSTIN)
  const isSACValid = !formData.hsnCode || SAC_REGEX.test(formData.hsnCode)

  // Get place of supply
  const placeOfSupply = getPlaceOfSupply(
    formData.sellerGSTIN,
    formData.buyerGSTIN,
    formData.placeOfSupplyState,
    totals.isInterState
  )

  return (
    <PreviewWrapper 
      title="Invoice Preview" 
      icon={<FileText className="h-5 w-5" />} 
      previewId="invoice-preview" 
      dataTestId="invoice-preview" 
      pdfContentId="invoice-pdf-content" 
      maxHeight={maxHeight}
    >
      <div className="p-6 space-y-6">
        {/* Invoice Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">TAX INVOICE</h2>
          {formData.invoiceNumber && (
            <p ref={setRef('invoiceNumber')} className={`text-sm text-muted-foreground ${hl('invoiceNumber')}`}>
              Invoice #: {formData.invoiceNumber}
            </p>
          )}
          {formData.invoiceDate && (
            <p ref={setRef('invoiceDate')} className={`text-sm text-muted-foreground ${hl('invoiceDate')}`}>
              Date: {formatDate(formData.invoiceDate)}
            </p>
          )}
        </div>

        <Separator />

        {/* Seller Details */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">From</h3>
          <div className="space-y-1">
            <p ref={setRef('sellerName')} className={`font-semibold text-foreground ${hl('sellerName')}`}>
              {formData.sellerName || "Your Business Name"}
            </p>
            {formData.sellerAddress && (
              <p ref={setRef('sellerAddress')} className={`text-sm text-muted-foreground whitespace-pre-line ${hl('sellerAddress')}`}>
                {formData.sellerAddress}
              </p>
            )}
            {isSellerGSTINValid && formData.sellerGSTIN ? (
              <p ref={setRef('sellerGSTIN')} className={`text-sm text-muted-foreground ${hl('sellerGSTIN')}`}>
                GSTIN: {formData.sellerGSTIN}
              </p>
            ) : formData.sellerGSTIN && !isSellerGSTINValid ? (
              <p className="text-sm text-destructive">GSTIN: — Invalid —</p>
            ) : null}
          </div>
        </div>

        <Separator />

        {/* Buyer Details */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">Bill To</h3>
          <div className="space-y-1">
            <p ref={setRef('buyerName')} className={`font-semibold text-foreground ${hl('buyerName')}`}>
              {formData.buyerName || "Customer Name"}
            </p>
            {formData.buyerAddress && (
              <p ref={setRef('buyerAddress')} className={`text-sm text-muted-foreground whitespace-pre-line ${hl('buyerAddress')}`}>
                {formData.buyerAddress}
              </p>
            )}
            {isBuyerGSTINValid && formData.buyerGSTIN ? (
              <p ref={setRef('buyerGSTIN')} className={`text-sm text-muted-foreground ${hl('buyerGSTIN')}`}>
                GSTIN: {formData.buyerGSTIN}
              </p>
            ) : formData.buyerGSTIN && !isBuyerGSTINValid ? (
              <p className="text-sm text-destructive">GSTIN: — Invalid —</p>
            ) : null}
            {placeOfSupply !== "Not specified yet" && (
              <p className="text-sm text-muted-foreground">
                Place of Supply: {placeOfSupply}
              </p>
            )}
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
                  <th className="text-right p-2 text-muted-foreground font-medium">HSN/SAC</th>
                  <th className="text-right p-2 text-muted-foreground font-medium">Qty</th>
                  <th className="text-right p-2 text-muted-foreground font-medium">Rate</th>
                  <th className="text-right p-2 text-muted-foreground font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-2">
                    <p ref={setRef('itemDescription')} className={`font-medium text-foreground ${hl('itemDescription')}`}>
                      {formData.itemDescription || "Service/Product Description"}
                    </p>
                  </td>
                  <td className="text-right p-2">
                    <span ref={setRef('hsnCode')} className={`text-foreground ${hl('hsnCode')}`}>
                      {isSACValid && formData.hsnCode ? formData.hsnCode : formData.hsnCode && !isSACValid ? (
                        <span className="text-destructive">— Invalid —</span>
                      ) : "-"}
                    </span>
                  </td>
                  <td className="text-right p-2">
                    <span ref={setRef('quantity')} className={`text-foreground ${hl('quantity')}`}>
                      {formData.quantity || "-"}
                    </span>
                  </td>
                  <td className="text-right p-2">
                    <span ref={setRef('rate')} className={`text-foreground ${hl('rate')}`}>
                      {formatCurrency(Number(formData.rate) || 0)}
                    </span>
                  </td>
                  <td className="text-right p-2 text-foreground">
                    {formatCurrency(totals.subtotal)}
                  </td>
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
          {totals.isInterState && formData.igst ? (
            <div className="flex justify-between text-sm">
              <span ref={setRef('igst')} className={`text-muted-foreground ${hl('igst')}`}>
                IGST ({formData.igst || 0}%)
              </span>
              <span ref={setRef('igstAmount')} className={`font-medium text-foreground ${hl('igstAmount')}`}>
                {formatCurrency(totals.igstAmount)}
              </span>
            </div>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span ref={setRef('cgst')} className={`text-muted-foreground ${hl('cgst')}`}>
                  CGST ({formData.cgst || 0}%)
                </span>
                <span ref={setRef('cgstAmount')} className={`font-medium text-foreground ${hl('cgstAmount')}`}>
                  {formatCurrency(totals.cgstAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span ref={setRef('sgst')} className={`text-muted-foreground ${hl('sgst')}`}>
                  SGST ({formData.sgst || 0}%)
                </span>
                <span ref={setRef('sgstAmount')} className={`font-medium text-foreground ${hl('sgstAmount')}`}>
                  {formatCurrency(totals.sgstAmount)}
                </span>
              </div>
            </>
          )}
          <Separator />
          <div className="flex justify-between text-base font-bold">
            <span className="text-foreground">Total</span>
            <span ref={setRef('total')} className={`text-primary ${hl('total')}`}>
              {formatCurrency(totals.total)}
            </span>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="text-sm text-muted-foreground">
          Amount in words: {numberToWords(totals.total)} Rupees Only
        </div>
      </div>
    </PreviewWrapper>
  )
}
