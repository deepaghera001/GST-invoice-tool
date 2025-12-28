/**
 * Invoice Form Component
 * Refactored to use the useInvoiceForm hook
 * Focuses on UI rendering only
 */

"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useInvoiceForm } from "@/lib/hooks/use-invoice-form"
import { Button } from "@/components/ui/button"
import { Loader2, Download } from "lucide-react"
import { SellerDetails } from "./form-sections/seller-details"
import { BuyerDetails } from "./form-sections/buyer-details"
import { InvoiceDetails } from "./form-sections/invoice-details"
import { ItemDetails } from "./form-sections/item-details"
import { TaxDetails } from "./form-sections/tax-details"
import { InvoicePreview } from "./invoice-preview"
import { useSuggestions } from "@/lib/hooks/use-suggestions"
import { createPaymentOrder } from "@/lib/actions/payment-actions"
import { GSTIN_REGEX } from "@/lib/invoice"

export function InvoiceForm() {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const suggestions = useSuggestions()

  // Use the custom hook for form state management
  const {
    formData,
    errors,
    calculatedData,
    handleChange,
    handleBlur,
    validateForm,
    markFieldTouched,
    fillTestData,
    shouldShowError,
  } = useInvoiceForm()

  // Check if seller GSTIN is valid
  const isSellerGSTINValid = GSTIN_REGEX.test(formData.sellerGSTIN)

  // Determine if form can be submitted
  const canSubmit =
    formData.sellerName.trim().length >= 2 &&
    formData.sellerAddress.trim().length >= 10 &&
    isSellerGSTINValid &&
    formData.invoiceNumber.trim().length >= 1 &&
    formData.invoiceDate.length > 0 &&
    formData.itemDescription.trim().length >= 3 &&
    Number.parseFloat(formData.quantity) > 0 &&
    Number.parseFloat(formData.rate) > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isSellerGSTINValid) {
      toast({
        title: "Invalid Seller GSTIN",
        description: "Please enter a valid seller GSTIN before proceeding with payment.",
        variant: "destructive",
      })
      return
    }

    const { isValid } = validateForm()

    if (!isValid) {
      Object.keys(errors).forEach((field) => markFieldTouched(field))
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV === "development"

    if (isDevelopment) {
      // In development mode, generate PDF directly without payment
      try {
        // Capture HTML from preview
        const { captureInvoicePreviewHTML } = await import("@/lib/utils/dom-capture-utils")
        const htmlContent = captureInvoicePreviewHTML(formData.invoiceNumber)
        
        const pdfResponse = await fetch("/api/generate-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            htmlContent,
            filename: `invoice-${formData.invoiceNumber}.pdf`,
          }),
        })

        if (!pdfResponse.ok) {
          const errorText = await pdfResponse.text()
          console.error("[DEV] PDF generation API error response:", errorText)
          throw new Error(`API Error: ${pdfResponse.status} - ${errorText}`)
        }

        const blob = await pdfResponse.blob()
        downloadPDF(blob, formData.invoiceNumber, "html")

        toast({
          title: "Success!",
          description: "Your invoice has been generated and downloaded (development mode)",
        })
      } catch (error) {
        console.error("[DEV] PDF generation error:", error)
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to generate PDF. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsProcessing(false)
      }
      return
    }

    // Production mode - proceed with payment
    try {
      const amount = 99
      const orderResult = await createPaymentOrder(amount, "razorpay")

      if (!orderResult.success || !orderResult.data) {
        throw new Error(orderResult.error || "Failed to create order")
      }

      const { orderId, amount: orderAmount, currency, keyId } = orderResult.data

      const options = {
        key: keyId,
        amount: orderAmount,
        currency,
        name: "InvoiceGen",
        description: "Detailed GST Invoice PDF",
        order_id: orderId,
        handler: async (response: any) => {
          try {
            // Capture HTML from preview
            const { captureInvoicePreviewHTML } = await import("@/lib/utils/dom-capture-utils")
            const htmlContent = captureInvoicePreviewHTML(formData.invoiceNumber)
            
            const pdfResponse = await fetch("/api/generate-pdf", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                htmlContent,
                filename: `invoice-${formData.invoiceNumber}.pdf`,
              }),
            })

            if (!pdfResponse.ok) {
              throw new Error("Payment verification failed")
            }

            const blob = await pdfResponse.blob()
            downloadPDF(blob, formData.invoiceNumber, "html")

            toast({
              title: "Success!",
              description: "Your invoice has been generated and downloaded",
            })
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to generate PDF. Please contact support.",
              variant: "destructive",
            })
          } finally {
            setIsProcessing(false)
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false)
          },
        },
        prefill: {
          name: formData.sellerName,
        },
        theme: {
          color: "#3b82f6",
        },
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  // Test HTML PDF generation
  const handleTestHTMLPDF = async () => {
    if (process.env.NODE_ENV !== "development") return

    setIsProcessing(true)
    try {
      console.log("[DEV] Testing HTML-to-PDF generation with actual DOM capture")

      const { captureInvoicePreviewHTML } = await import("@/lib/utils/dom-capture-utils")
      const htmlContent = captureInvoicePreviewHTML(formData.invoiceNumber)

      const pdfResponse = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          htmlContent,
          filename: `invoice-${formData.invoiceNumber}.pdf`,
        }),
      })

      if (!pdfResponse.ok) {
        const errorText = await pdfResponse.text()
        console.error("[DEV] HTML PDF generation API error response:", errorText)
        throw new Error(`API Error: ${pdfResponse.status} - ${errorText}`)
      }

      const blob = await pdfResponse.blob()
      downloadPDF(blob, formData.invoiceNumber, "dom")

      toast({
        title: "Success!",
        description: "HTML-to-PDF invoice has been generated and downloaded (development mode)",
      })
    } catch (error) {
      console.error("[DEV] HTML PDF generation error:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to generate HTML PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground text-balance">Create Your Invoice</h2>
            <p className="text-muted-foreground text-pretty">
              Fill in the details below to generate a professional GST-compliant invoice (standard
              domestic). Preview updates in real-time.
            </p>
          </div>

          {/* Test Button for Development */}
          {process.env.NODE_ENV === "development" && (
            <div className="p-4 border border-border rounded-lg bg-muted/50">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Development Mode</h3>
                  <p className="text-sm text-muted-foreground">Quick test with sample data</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={fillTestData}
                    variant="secondary"
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    Fill Test Data
                  </Button>
                  <Button
                    type="button"
                    onClick={handleTestHTMLPDF}
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating HTML PDF...
                      </>
                    ) : (
                      "Test HTML PDF"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pricing Section */}
            <div className="space-y-6 p-6 border border-border rounded-xl bg-card shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">Pricing</h3>
                <p className="text-sm text-muted-foreground">One invoice. One price.</p>
              </div>

              <div className="text-center p-8 bg-muted/50 rounded-lg border border-border">
                <div className="mb-2">
                  <span className="text-4xl font-bold text-primary">₹99</span>
                  <span className="text-lg text-muted-foreground ml-2">per invoice</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  One-time payment. No subscription. Instant download.
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 text-green-500 flex-shrink-0">✓</div>
                    <span>GST-compliant format (standard domestic invoices)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 text-green-500 flex-shrink-0">✓</div>
                    <span>Professional PDF</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 text-green-500 flex-shrink-0">✓</div>
                    <span>Secure payment</span>
                  </div>
                </div>
              </div>
              <input type="hidden" name="plan" value="detailed" />

              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <span className="h-4 w-4 flex items-center justify-center">🔒</span>
                  Secure payment via Razorpay • Instant PDF generation
                </p>
              </div>
            </div>

            {/* Form Sections */}
            <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-75">
              <SellerDetails
                formData={formData}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                shouldShowError={shouldShowError}
                suggestions={suggestions}
                isCompleted={
                  formData.sellerName.trim().length >= 2 &&
                  formData.sellerAddress.trim().length >= 10 &&
                  GSTIN_REGEX.test(formData.sellerGSTIN)
                }
              />
            </div>

            <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-100">
              <BuyerDetails
                formData={formData}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                shouldShowError={shouldShowError}
                suggestions={suggestions}
                isCompleted={
                  formData.buyerName.trim().length >= 2 &&
                  formData.buyerAddress.trim().length >= 10
                }
              />
            </div>

            <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-150">
              <InvoiceDetails
                formData={formData}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                shouldShowError={shouldShowError}
                suggestions={suggestions}
                isCompleted={
                  formData.invoiceNumber.trim().length >= 1 && formData.invoiceDate.length > 0
                }
              />
            </div>

            <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-200">
              <ItemDetails
                formData={formData}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                shouldShowError={shouldShowError}
                suggestions={suggestions}
                isCompleted={
                  formData.itemDescription.trim().length >= 3 &&
                  Number.parseFloat(formData.quantity) > 0 &&
                  Number.parseFloat(formData.rate) > 0
                }
              />
            </div>

            <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-300">
              <TaxDetails
                formData={formData}
                onChange={handleChange}
                isCompleted={true}
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col gap-3 pt-4 animate-in fade-in slide-in-from-top-2 duration-200 delay-400">
              <div className="text-center py-2">
                <p className="text-sm font-medium text-primary">Avoid GST mistakes in 2 minutes</p>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isProcessing || !canSubmit}
                className="w-full text-base"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Pay ₹99 & Download GST Invoice
                  </>
                )}
              </Button>
              {!canSubmit && !isProcessing && (
                <p className="text-xs text-center text-destructive">
                  Please fill in all required fields with valid data to continue
                </p>
              )}
              <p className="text-xs text-center text-muted-foreground">
                Secure payment via Razorpay. Invoice generated instantly after payment.
              </p>
              <p className="text-xs text-center text-muted-foreground italic">
                Based on GST Rule 46 invoice requirements for services.
              </p>
            </div>
          </form>
        </div>

        <div className="lg:block hidden">
          <InvoicePreview calculatedData={calculatedData} errors={errors} />
        </div>
      </div>
    </>
  )
}

/**
 * Helper function to download PDF
 */
function downloadPDF(blob: Blob, invoiceNumber: string, type: string) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `invoice-${invoiceNumber}-${type}.pdf`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
