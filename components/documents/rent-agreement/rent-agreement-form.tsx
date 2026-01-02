/**
 * Rent Agreement Form Component
 * Main form container using the useRentAgreementForm hook
 */

"use client"

import type React from "react"
import { useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRentAgreementForm } from "@/lib/hooks/use-rent-agreement-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, FlaskConical } from "lucide-react"
import {
  LandlordDetails,
  TenantDetails,
  PropertyDetails,
  RentTerms,
  Clauses,
} from "./form-sections"
import { RentAgreementPreview } from "./rent-agreement-preview"
import { TestScenarioSelector, rentAgreementScenarios, isTestMode } from "@/lib/testing"
import { PaymentCTA } from "@/components/shared/payment-cta"

const PDF_PRICE = 149 // ₹149

export function RentAgreementForm() {
  const { toast } = useToast()

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
    isFormComplete,
    completedSectionsCount,
    totalSections,
  } = useRentAgreementForm()

  // Generate and download PDF
  const generateAndDownloadPDF = useCallback(async () => {
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

    // Capture HTML from preview
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
  }, [validateForm, errors, markFieldTouched, toast, formData.tenant.name])

  // Handle payment error
  const handlePaymentError = useCallback((error: string) => {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    })
  }, [toast])

  return (
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
      </div>

      {/* Preview + PaymentCTA */}
      <div className="sticky top-24 self-start space-y-3">
        <RentAgreementPreview calculatedData={calculatedData} maxHeight="55vh" />
        
        <PaymentCTA
          isFormComplete={isFormComplete}
          completedSections={completedSectionsCount}
          totalSections={totalSections}
          onPaymentSuccess={generateAndDownloadPDF}
          onPaymentError={handlePaymentError}
          price={PDF_PRICE}
          documentType="rent-agreement"
          buttonText="Download Agreement"
        />
      </div>
    </div>
  )
}
