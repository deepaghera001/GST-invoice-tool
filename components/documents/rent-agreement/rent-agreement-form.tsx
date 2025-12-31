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
          {/* Test Mode Header */}
          {isTestMode && (
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="secondary" className="gap-1">
                <FlaskConical className="h-3 w-3" />
                Test Mode
              </Badge>
            </div>
          )}

          {/* Test Scenario Selector */}
          <TestScenarioSelector
            scenarios={rentAgreementScenarios}
            onApply={(data) => setFormData({ ...formData, ...data })}
          />

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
              Reset
            </Button>
          </div>

          <LandlordDetails
            formData={formData}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
            shouldShowError={shouldShowError}
          />

          <TenantDetails
            formData={formData}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
            shouldShowError={shouldShowError}
          />

          <PropertyDetails
            formData={formData}
            onChange={handleChange}
            onBlur={handleBlur}
            onCheckboxChange={handleCheckboxChange}
            errors={errors}
            shouldShowError={shouldShowError}
          />

          <RentTerms
            formData={formData}
            onChange={handleChange}
            onBlur={handleBlur}
            onCheckboxChange={handleCheckboxChange}
            errors={errors}
            shouldShowError={shouldShowError}
          />

          <Clauses
            formData={formData}
            onChange={handleChange}
            onCheckboxChange={handleCheckboxChange}
            errors={errors}
            shouldShowError={shouldShowError}
          />

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full gap-2"
              disabled={!canSubmit || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Agreement...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  {isTestMode 
                    ? "Download Rent Agreement (Test Mode - Free)" 
                    : `Download Rent Agreement (₹${PDF_PRICE})`}
                </>
              )}
            </Button>
            {!canSubmit && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Please fill all required fields to generate the agreement
              </p>
            )}
            {canSubmit && isTestMode && (
              <p className="text-xs text-amber-600 text-center mt-2">
                Test mode - PDF generation is free for testing
              </p>
            )}
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
