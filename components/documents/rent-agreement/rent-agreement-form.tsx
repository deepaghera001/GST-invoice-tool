/**
 * Rent Agreement Form Component
 * Main form container using the useRentAgreementForm hook
 */

"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRentAgreementForm } from "@/lib/hooks/use-rent-agreement-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, RotateCcw, FlaskConical } from "lucide-react"
import {
  LandlordDetails,
  TenantDetails,
  PropertyDetails,
  RentTerms,
  Clauses,
} from "./form-sections"
import { RentAgreementPreview } from "./rent-agreement-preview"
import { TestScenarioSelector, rentAgreementScenarios, isTestMode } from "@/lib/testing"

const PDF_PRICE = 149 // ₹149

export function RentAgreementForm() {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    formData,
    setFormData,
    errors,
    calculatedData,
    handleChange,
    handleBlur,
    handleCheckboxChange,
    validateForm,
    markFieldTouched,
    shouldShowError,
    resetForm,
    fillTestData,
    isSectionComplete,
  } = useRentAgreementForm()

  // Check if minimum required fields are filled
  const canSubmit =
    formData.landlord.name.trim().length >= 2 &&
    formData.landlord.phone.length === 10 &&
    formData.tenant.name.trim().length >= 2 &&
    formData.tenant.phone.length === 10 &&
    formData.property.address.trim().length >= 10 &&
    formData.property.city.trim().length >= 2 &&
    formData.property.pincode.length === 6 &&
    formData.rentTerms.monthlyRent >= 1000 &&
    formData.rentTerms.agreementStartDate.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { isValid } = validateForm()

    if (!isValid) {
      // Mark all fields as touched to show errors
      Object.keys(errors).forEach((field) => markFieldTouched(field))
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Capture HTML from preview (same as invoice/salary slip)
      const { captureRentAgreementPreviewHTML } = await import("@/lib/utils/dom-capture-utils")
      const htmlContent = captureRentAgreementPreviewHTML()

      // Generate PDF
      const pdfResponse = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          htmlContent,
          filename: `rent-agreement-${Date.now()}.pdf`,
        }),
      })

      if (!pdfResponse.ok) {
        throw new Error("Failed to generate PDF")
      }

      const blob = await pdfResponse.blob()
      
      // Download PDF
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `rent-agreement-${formData.tenant.name.replace(/\s+/g, "-").toLowerCase()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success!",
        description: "Your rent agreement has been generated and downloaded",
      })
    } catch (error) {
      console.error("PDF generation error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Sections */}
        <div className="space-y-6">
          {/* Header with Test Mode */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-foreground">Create Your Rent Agreement</h2>
              {isTestMode && (
                <Badge variant="outline" className="border-amber-500 text-amber-600 gap-1">
                  <FlaskConical className="h-3 w-3" />
                  Test Mode
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-muted-foreground text-pretty">
                Fill in the details below to generate a legally formatted rent agreement. Preview updates in real-time.
              </p>
              {/* Test Scenario Selector - only renders in test mode */}
              <TestScenarioSelector
                scenarios={rentAgreementScenarios}
                onApply={(data) => setFormData({ ...formData, ...data })}
                label="Test Scenarios"
              />
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-6 p-6 border border-border rounded-xl bg-card shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">Pricing</h3>
              <p className="text-sm text-muted-foreground">One agreement. One price.</p>
            </div>

            <div className="text-center p-8 bg-muted/50 rounded-lg border border-border">
              <div className="mb-2">
                <span className="text-4xl font-bold text-primary">₹{PDF_PRICE}</span>
                <span className="text-lg text-muted-foreground ml-2">per agreement</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">One-time payment. No subscription. Instant download.</p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 text-green-500 flex-shrink-0">✓</div>
                  <span>Legal Format</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 text-green-500 flex-shrink-0">✓</div>
                  <span>All Indian States</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 text-green-500 flex-shrink-0">✓</div>
                  <span>Standard Clauses</span>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <span className="h-4 w-4 flex items-center justify-center">🔒</span>
                {isTestMode ? 'Test mode - PDF downloads are free' : 'Secure payment via Razorpay • Instant PDF generation'}
              </p>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetForm}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Form
            </Button>
          </div>

          <LandlordDetails
            formData={formData}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
            shouldShowError={shouldShowError}
            isCompleted={isSectionComplete.landlord}
          />

          <TenantDetails
            formData={formData}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
            shouldShowError={shouldShowError}
            isCompleted={isSectionComplete.tenant}
          />

          <PropertyDetails
            formData={formData}
            onChange={handleChange}
            onBlur={handleBlur}
            onCheckboxChange={handleCheckboxChange}
            errors={errors}
            shouldShowError={shouldShowError}
            isCompleted={isSectionComplete.property}
          />

          <RentTerms
            formData={formData}
            onChange={handleChange}
            onBlur={handleBlur}
            onCheckboxChange={handleCheckboxChange}
            errors={errors}
            shouldShowError={shouldShowError}
            isCompleted={isSectionComplete.rentTerms}
          />

          <Clauses
            formData={formData}
            onChange={handleChange}
            onCheckboxChange={handleCheckboxChange}
            errors={errors}
            shouldShowError={shouldShowError}
            isCompleted={isSectionComplete.clauses}
          />

          {/* Submit Button */}
          <div className="flex flex-col gap-3 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="text-center py-2">
              <p className="text-sm font-medium text-primary">Create a legally formatted agreement in minutes</p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-base"
              disabled={!canSubmit || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isTestMode ? 'Generating PDF...' : 'Processing Payment...'}
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  {isTestMode 
                    ? "Download PDF (Test Mode - Free)" 
                    : `Pay ₹${PDF_PRICE} & Download Agreement`}
                </>
              )}
            </Button>
            {!canSubmit && !isProcessing && (
              <p className="text-xs text-center text-destructive">
                Please fill in all required fields with valid data to continue
              </p>
            )}
            <p className="text-xs text-center text-muted-foreground">
              {isTestMode 
                ? '⚠️ Test mode enabled - PDF downloads are free'
                : 'Secure payment via Razorpay. Agreement generated instantly after payment.'
              }
            </p>
            <p className="text-xs text-center text-muted-foreground italic">
              Ready for stamp paper registration as per your state requirements.
            </p>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:block">
          <RentAgreementPreview calculatedData={calculatedData} />
        </div>
      </div>
    </form>
  )
}
