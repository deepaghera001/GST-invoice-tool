/**
 * Influencer Contract Form Component
 * Main form with 2-column layout (form + preview)
 * 
 * Price: ₹499
 * Sections: 8 total
 */

"use client"

import type React from "react"
import { useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useInfluencerContractForm } from "@/lib/hooks/use-influencer-contract-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FlaskConical, FileText } from "lucide-react"
import {
  PartiesSection,
  CampaignSection,
  TimelineSection,
  PaymentSection,
  UsageRightsSection,
  ExclusivitySection,
  LegalSection,
  ConfirmationSection,
} from "./form-sections"
import { InfluencerContractPreview } from "./influencer-contract-preview"
import { PaymentCTA } from "@/components/shared/payment-cta"
import { TestScenarioSelector, influencerContractScenarios, isTestMode } from "@/lib/testing"

const PDF_PRICE = 499 // ₹499

/**
 * Download blob as file
 */
function downloadPDF(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export function InfluencerContractForm() {
  const { toast } = useToast()

  const {
    formData,
    setFormData,
    errors,
    calculations,
    handleChange,
    handleBlur,
    handleArrayChange,
    validateFormFull,
    markFieldTouched,
    shouldShowError,
    resetForm,
    isSectionComplete,
    isFormComplete,
    completedSectionsCount,
    totalSections,
  } = useInfluencerContractForm()

  // Simple wrapper for onChange that extracts field path and type from event
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e.target.name, e.target.value, (e.target as HTMLInputElement).type)
  }

  /**
   * Generate and download PDF - called by PaymentCTA after successful payment
   */
  const generateAndDownloadPDF = useCallback(async () => {
    // Validate form before generating
    const { isValid } = validateFormFull()
    if (!isValid) {
      Object.keys(errors).forEach((field) => markFieldTouched(field))
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before generating the contract",
        variant: "destructive",
      })
      throw new Error("Form validation failed")
    }

    // Capture HTML from preview
    const { captureInfluencerContractPreviewHTML } = await import("@/lib/utils/dom-capture-utils")
    const htmlContent = captureInfluencerContractPreviewHTML()

    const pdfResponse = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        htmlContent,
        filename: `influencer-contract-${formData.parties.influencerName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.pdf`,
      }),
    })

    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text()
      console.error("PDF generation API error:", errorText)
      throw new Error(`API Error: ${pdfResponse.status} - ${errorText}`)
    }

    const blob = await pdfResponse.blob()
    downloadPDF(
      blob,
      `influencer-contract-${formData.parties.influencerName.replace(/\s+/g, "-").toLowerCase()}.pdf`
    )

    toast({
      title: "Success! 🎉",
      description: "Your Influencer-Brand Contract has been generated and downloaded.",
    })
  }, [validateFormFull, errors, markFieldTouched, toast, formData.parties.influencerName])

  /**
   * Handle payment errors from PaymentCTA
   */
  const handlePaymentError = useCallback(
    (error: string) => {
      toast({
        title: "Payment Failed",
        description: error || "Payment was not completed. Please try again.",
        variant: "destructive",
      })
    },
    [toast]
  )

  // Check if we have enough data to show preview
  const hasPreviewData = formData.parties.influencerName || formData.parties.brandName

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Form */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl font-bold text-foreground text-balance">
                Create Your Influencer Contract
              </h2>
              {isTestMode && (
                <Badge variant="outline" className="border-amber-500 text-amber-600 gap-1">
                  <FlaskConical className="h-3 w-3" />
                  Test Mode
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-muted-foreground text-pretty">
                Fill in the details below to generate a professional influencer-brand collaboration agreement. 
                Preview updates in real-time.
              </p>
              {/* Test Scenario Selector - only renders in test mode */}
              <TestScenarioSelector
                scenarios={influencerContractScenarios}
                onApply={(data) => setFormData({ ...formData, ...data } as typeof formData)}
                label="Test Scenarios"
              />
            </div>
          </div>

          <form className="space-y-6">
            {/* Section 1: Parties */}
            <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-75">
              <PartiesSection
                formData={formData.parties}
                onChange={handleFieldChange}
                onBlur={handleBlur}
                errors={errors}
                shouldShowError={shouldShowError}
                isCompleted={isSectionComplete.parties}
              />
            </div>

            {/* Section 2: Campaign */}
            <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-100">
              <CampaignSection
                formData={formData.campaign}
                onChange={handleFieldChange}
                onArrayChange={handleArrayChange}
                onBlur={handleBlur}
                errors={errors}
                shouldShowError={shouldShowError}
                isCompleted={isSectionComplete.campaign}
              />
            </div>

            {/* Section 3: Timeline */}
            <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-125">
              <TimelineSection
                formData={formData.timeline}
                agreementDate={formData.legal.agreementDate}
                onChange={handleFieldChange}
                onBlur={handleBlur}
                errors={errors}
                shouldShowError={shouldShowError}
                isCompleted={isSectionComplete.timeline}
              />
            </div>

            {/* Section 4: Payment */}
            <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-150">
              <PaymentSection
                formData={formData.payment}
                paymentBreakdown={calculations.paymentBreakdown}
                onChange={handleFieldChange}
                onArrayChange={handleArrayChange}
                onBlur={handleBlur}
                errors={errors}
                shouldShowError={shouldShowError}
                isCompleted={isSectionComplete.payment}
              />
            </div>

            {/* Section 5: Usage Rights */}
            <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-175">
              <UsageRightsSection
                formData={formData.usageRights}
                onChange={handleFieldChange}
                onBlur={handleBlur}
                errors={errors}
                shouldShowError={shouldShowError}
                isCompleted={isSectionComplete.usageRights}
              />
            </div>

            {/* Section 6: Exclusivity & Revisions */}
            <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-200">
              <ExclusivitySection
                formData={formData.exclusivity}
                onChange={handleFieldChange}
                onBlur={handleBlur}
                errors={errors}
                shouldShowError={shouldShowError}
                isCompleted={isSectionComplete.exclusivity}
              />
            </div>

            {/* Section 7: Legal */}
            <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-225">
              <LegalSection
                formData={formData.legal}
                influencerState={formData.parties.influencerState}
                onChange={handleFieldChange}
                onBlur={handleBlur}
                errors={errors}
                shouldShowError={shouldShowError}
                isCompleted={isSectionComplete.legal}
              />
            </div>

            {/* Section 8: Confirmation */}
            <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-250">
              <ConfirmationSection
                formData={formData.confirmation}
                onChange={handleFieldChange}
                errors={errors}
                shouldShowError={shouldShowError}
                isCompleted={isSectionComplete.confirmation}
              />
            </div>

            {/* Reset Form Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={resetForm}
            >
              Reset Form
            </Button>
          </form>
        </div>

        {/* Right Column: Preview + CTA (Sticky) */}
        <div className="lg:sticky lg:top-24 lg:self-start space-y-3">
          {hasPreviewData ? (
            <>
              <InfluencerContractPreview
                formData={formData}
                calculations={calculations}
                maxHeight="55vh"
              />
              <PaymentCTA
                isFormComplete={isFormComplete}
                price={PDF_PRICE}
                documentType="influencer-contract"
                isTestMode={isTestMode}
                onPaymentSuccess={generateAndDownloadPDF}
                onPaymentError={handlePaymentError}
                completedSections={completedSectionsCount}
                totalSections={totalSections}
                paymentDescription="Influencer-Brand Collaboration Contract"
              />
            </>
          ) : (
            <Card className="border-dashed bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center h-full py-20">
                <FileText className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground text-center">
                  Enter party details to see contract preview
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
