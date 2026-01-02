/**
 * Invoice Form Component
 * Refactored to use the useInvoiceForm hook
 * Payment handled by PaymentCTA component (modular)
 */

"use client"

import type React from "react"
import { useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useInvoiceForm } from "@/lib/hooks/use-invoice-form"
import { Badge } from "@/components/ui/badge"
import { FlaskConical } from "lucide-react"
import { SellerDetails } from "./form-sections/seller-details"
import { BuyerDetails } from "./form-sections/buyer-details"
import { InvoiceDetails } from "./form-sections/invoice-details"
import { ItemDetails } from "./form-sections/item-details"
import { TaxDetails } from "./form-sections/tax-details"
import { InvoicePreview } from "./invoice-preview"
import { useSuggestions } from "@/lib/hooks/use-suggestions"
import { GSTIN_REGEX } from "@/lib/invoice"
import { TestScenarioSelector, invoiceScenarios, isTestMode } from "@/lib/testing"
import { PaymentCTA } from "@/components/shared/payment-cta"

const PDF_PRICE = 99 // ₹99

export function InvoiceForm() {
  const { toast } = useToast()
  const suggestions = useSuggestions()

  // Use the custom hook for form state management
  const {
    formData,
    setFormData,
    errors,
    calculatedData,
    handleChange,
    handleBlur,
    validateForm,
    markFieldTouched,
    fillTestData,
    shouldShowError,
    isFormComplete,
    completedSectionsCount,
    totalSections,
  } = useInvoiceForm()

  // Check if seller GSTIN is valid
  const isSellerGSTINValid = GSTIN_REGEX.test(formData.sellerGSTIN)

  /**
   * Generate and download PDF - called by PaymentCTA after successful payment
   */
  const generateAndDownloadPDF = useCallback(async () => {
    if (!isSellerGSTINValid) {
      toast({
        title: "Invalid Seller GSTIN",
        description: "Please enter a valid seller GSTIN before proceeding.",
        variant: "destructive",
      })
      throw new Error("Invalid seller GSTIN")
    }

    const { isValid } = validateForm()

    if (!isValid) {
      Object.keys(errors).forEach((field) => markFieldTouched(field))
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting",
        variant: "destructive",
      })
      throw new Error("Form validation failed")
    }

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
      console.error("PDF generation API error:", errorText)
      throw new Error(`API Error: ${pdfResponse.status} - ${errorText}`)
    }

    const blob = await pdfResponse.blob()
    downloadPDF(blob, formData.invoiceNumber)

    toast({
      title: "Success! 🎉",
      description: "Your invoice has been generated and downloaded",
    })
  }, [formData, isSellerGSTINValid, validateForm, errors, markFieldTouched, toast])

  /**
   * Handle payment error
   */
  const handlePaymentError = useCallback((error: string) => {
    toast({
      title: "Payment Error",
      description: error,
      variant: "destructive",
    })
  }, [toast])

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl font-bold text-foreground text-balance">Create Your Invoice</h2>
              {isTestMode && (
                <Badge variant="outline" className="border-amber-500 text-amber-600 gap-1">
                  <FlaskConical className="h-3 w-3" />
                  Test Mode
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              For small businesses, freelancers & service providers in India
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-muted-foreground text-pretty">
                Fill in the details below to generate a professional GST-compliant invoice. Preview updates in real-time.
              </p>
              {/* Test Scenario Selector - only renders in test mode */}
              <TestScenarioSelector
                scenarios={invoiceScenarios}
                onApply={(data) => setFormData({ ...formData, ...data })}
                label="Test Scenarios"
              />
            </div>
          </div>

          <form className="space-y-6">
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
                setFormData={setFormData}
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
                setFormData={setFormData}
                isCompleted={true}
              />
            </div>

            {/* GST compliance note */}
            <div className="text-xs text-center text-muted-foreground italic pt-2">
              Based on GST Rule 46 invoice requirements for services.
            </div>
          </form>
        </div>

        {/* Right Column: Preview + PaymentCTA */}
        <div className="lg:block hidden sticky top-24 self-start space-y-3">
          {/* Preview - Uses maxHeight prop to leave room for PaymentCTA */}
          <InvoicePreview calculatedData={calculatedData} errors={errors} maxHeight="55vh" />
          
          {/* Psychology-optimized Payment CTA */}
          <PaymentCTA
            isFormComplete={isFormComplete}
            price={PDF_PRICE}
            documentType="invoice"
            isTestMode={isTestMode}
            onPaymentSuccess={generateAndDownloadPDF}
            onPaymentError={handlePaymentError}
            completedSections={completedSectionsCount}
            totalSections={totalSections}
            paymentDescription={`GST Invoice - ${formData.invoiceNumber || 'New Invoice'}`}
          />
        </div>
      </div>
    </>
  )
}

/**
 * Helper function to download PDF
 */
function downloadPDF(blob: Blob, invoiceNumber: string) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `invoice-${invoiceNumber}.pdf`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
