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
import { generateAndDownloadPDF } from "@/lib/utils/pdf-download-utils"
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
  const handleGenerateAndDownloadPDF = useCallback(async () => {
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

    try {
      const { captureRentAgreementPreviewHTML } = await import("@/lib/utils/dom-capture-utils")
      const htmlContent = captureRentAgreementPreviewHTML()

      await generateAndDownloadPDF(
        htmlContent,
        `rent-agreement-${formData.tenant.name.replace(/\s+/g, "-").toLowerCase()}.pdf`
      )

      toast({
        title: "Success! 🎉",
        description: "Your rent agreement has been generated and downloaded",
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate PDF"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw error
    }
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
      {/* Left Column: Form Sections */}
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
            <TestScenarioSelector
              scenarios={rentAgreementScenarios}
              onApply={(data) => setFormData({ ...formData, ...data })}
              label="Test Scenarios"
            />
          </div>
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
          errors={errors}
          shouldShowError={shouldShowError}
          isCompleted={isSectionComplete.property}
        />

        <RentTerms
          formData={formData}
          onChange={handleChange}
          onBlur={handleBlur}
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

        {/* Reset Form at bottom for consistency */}
        <Button type="button" variant="outline" className="w-full" onClick={resetForm}>Reset Form</Button>
      </div>

      {/* Right Column: Preview + PaymentCTA */}
      <div className="sticky top-24 self-start space-y-3">
        {calculatedData ? (
          <>
            <RentAgreementPreview calculatedData={calculatedData} maxHeight="55vh" />
            <PaymentCTA
              isFormComplete={isFormComplete}
              price={PDF_PRICE}
              documentType="rent-agreement"
              isTestMode={isTestMode}
              onPaymentSuccess={handleGenerateAndDownloadPDF}
              onPaymentError={handlePaymentError}
              completedSections={completedSectionsCount}
              totalSections={totalSections}
              paymentDescription={`Rent Agreement for ${formData.tenant.name || 'Tenant'}`}
            />
          </>
        ) : (
          <div className="border border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground bg-muted/50">
            Preview will appear here once you fill the form
          </div>
        )}
      </div>
    </div>
  )
}
