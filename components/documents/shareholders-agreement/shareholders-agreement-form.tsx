/**
 * Shareholders Agreement Form Component
 * Main form container using the useShareholdersAgreementForm hook
 */

"use client"

import type React from "react"
import { useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useShareholdersAgreementForm } from "@/lib/hooks/use-shareholders-agreement-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, FlaskConical, FileText } from "lucide-react"
import { TestScenarioSelector, shareholdersAgreementScenarios, isTestMode } from "@/lib/testing"
import { Card, CardContent } from "@/components/ui/card"
import { PaymentCTA } from "@/components/shared/payment-cta"
import { generateAndDownloadPDF } from "@/lib/utils/pdf-download-utils"
import {
  CompanyDetails,
  ShareholdersDetails,
  ShareCapitalOwnership,
  BoardManagementControl,
  VotingRights,
  ShareTransferRestrictions,
  TagAlongDragAlong,
  ExitBuyoutClauses,
  ConfidentialityNonCompete,
  DeadlockDisputeResolution,
  Termination,
  SignatureDetails,
} from "./form-sections"
import { ShareholdersAgreementPreview } from "./shareholders-agreement-preview"

const PDF_PRICE = 2499 // ₹2,499

export function ShareholdersAgreementForm() {
  const { toast } = useToast()

  const {
    formData,
    setFormData,
    errors,
    calculatedData,
    handleChange,
    handleBlur,
    handleCheckboxChange,
    handleAddShareholder,
    handleRemoveShareholder,
    handleShareholderChange,
    validateForm,
    markFieldTouched,
    shouldShowError,
    resetForm,
    isSectionComplete,
    isFormComplete,
    completedSectionsCount,
    totalSections,
  } = useShareholdersAgreementForm()

  /**
   * Generate and download PDF - called by PaymentCTA after successful payment
   */
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
      const { captureShareholdersAgreementPreviewHTML } = await import("@/lib/utils/dom-capture-utils")
      const htmlContent = captureShareholdersAgreementPreviewHTML()

      await generateAndDownloadPDF(
        htmlContent,
        `shareholders-agreement-${formData.company.companyName.replace(/\s+/g, "-").toLowerCase()}.pdf`
      )

      toast({
        title: "Success! 🎉",
        description: "Your Shareholders Agreement has been generated and downloaded",
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
  }, [validateForm, errors, markFieldTouched, toast, formData.company.companyName])

  /**
   * Handle payment error - called by PaymentCTA on payment failure
   */
  const handlePaymentError = useCallback((error: string) => {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    })
  }, [toast])

  // Count validation errors
  const errorCount = Object.keys(errors).filter((key) => shouldShowError(key)).length

  // Calculate completion percentage for progress bar
  const completionPercentage = Math.round((completedSectionsCount / totalSections) * 100)

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Column: Form Sections */}
      <div className="space-y-6">
        {/* Header with progress */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-foreground">Create Your Shareholders Agreement</h2>
            {isTestMode && (
              <Badge variant="outline" className="border-amber-500 text-amber-600 gap-1">
                <FlaskConical className="h-3 w-3" />
                Test Mode
              </Badge>
            )}
          </div>

          {/* Value Statement */}
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 font-medium">
            Avoid future founder disputes with a structured shareholders agreement.
          </p>

          {/* Who This Is For */}
          <div className="text-sm space-y-2">
            <p className="font-semibold text-foreground">Who this is for:</p>
            <ul className="space-y-1 text-muted-foreground ml-4">
              <li>• For <strong>Private Limited companies</strong></li>
              <li>• 2–4 founders</li>
              <li>• Early-stage / bootstrapped businesses</li>
            </ul>
          </div>

          {/* Why ₹2,499? - Price Justification */}
          <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Why ₹2,499?</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Typical lawyer drafting costs ₹10,000–₹25,000. This tool gives you a professionally structured agreement instantly.
            </p>
          </div>

          {/* Payment Reassurance Block */}
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="space-y-1 text-xs text-green-700 dark:text-green-400">
              <div className="flex gap-2">
                <span>✓</span>
                <span>Preview exactly what you'll download</span>
              </div>
              <div className="flex gap-2">
                <span>✓</span>
                <span>No login. No data saved.</span>
              </div>
              <div className="flex gap-2">
                <span>✓</span>
                <span>Instant PDF after payment</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-muted-foreground text-pretty">
              Fill in the details below to generate a professionally structured shareholders agreement. Preview updates in real-time.
            </p>
            {/* Test Scenario Selector - only renders in test mode */}
            <TestScenarioSelector
              scenarios={shareholdersAgreementScenarios}
              onApply={(data) => setFormData({ ...formData, ...data } as typeof formData)}
              label="Test Scenarios"
            />
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Progress</span>
              <span className="text-muted-foreground">{completionPercentage}% Complete ({completedSectionsCount}/{totalSections})</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Errors Summary - Shows specific errors with context */}
        {errorCount > 0 && (
          <div className="bg-red-50/80 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-900">Validation errors - please review sections below</p>
              <ul className="text-sm text-red-700 mt-2 space-y-1">
                {Object.entries(errors)
                  .filter(([key]) => shouldShowError(key))
                  .map(([key, message]) => {
                    // Only show field-level errors in summary, not cross-field errors
                    // Cross-field errors are shown in their respective sections
                    if (key === 'shareholders' || key === 'shareCapital') {
                      return null
                    }
                    return (
                      <li key={key} className="flex gap-2">
                        <span className="text-red-600">•</span>
                        <span>
                          {typeof message === 'string' ? message : `Error in ${key}`}
                        </span>
                      </li>
                    )
                  })}
              </ul>
              {Object.keys(errors).filter(k => (k === 'shareholders' || k === 'shareCapital') && shouldShowError(k)).length > 0 && (
                <p className="text-xs text-red-600 mt-2 italic">
                  See the highlighted sections below for detailed error information.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Form Sections */}
        <CompanyDetails
          formData={formData}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          shouldShowError={shouldShowError}
          isCompleted={isSectionComplete.company}
        />

        <ShareholdersDetails
          formData={formData}
          onChange={handleChange}
          onShareholderChange={handleShareholderChange}
          onAddShareholder={handleAddShareholder}
          onRemoveShareholder={handleRemoveShareholder}
          onBlur={handleBlur}
          errors={errors}
          shouldShowError={shouldShowError}
          isCompleted={isSectionComplete.shareholders}
        />

        <div id="share-capital-section">
          <ShareCapitalOwnership
            formData={formData}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
            shouldShowError={shouldShowError}
            isCompleted={isSectionComplete.shareCapital}
          />
        </div>

        <BoardManagementControl
          formData={formData}
          onChange={handleChange}
          onCheckboxChange={handleCheckboxChange}
          onBlur={handleBlur}
          errors={errors}
          shouldShowError={shouldShowError}
          isCompleted={isSectionComplete.boardManagement}
        />

        <VotingRights
          formData={formData}
          onChange={handleChange}
          onBlur={handleBlur}
          onCheckboxChange={handleCheckboxChange}
          errors={errors}
          shouldShowError={shouldShowError}
          isCompleted={isSectionComplete.votingRights}
        />

        <ShareTransferRestrictions
          formData={formData}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          shouldShowError={shouldShowError}
          isCompleted={isSectionComplete.shareTransfer}
        />

        <TagAlongDragAlong
          formData={formData}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          shouldShowError={shouldShowError}
          isCompleted={isSectionComplete.tagAlongDragAlong}
        />

        <ExitBuyoutClauses
          formData={formData}
          onChange={handleChange}
          onBlur={handleBlur}
          onCheckboxChange={handleCheckboxChange}
          errors={errors}
          shouldShowError={shouldShowError}
          isCompleted={isSectionComplete.exitBuyout}
        />

        <ConfidentialityNonCompete
          formData={formData}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          shouldShowError={shouldShowError}
          isCompleted={isSectionComplete.confidentiality}
        />

        <DeadlockDisputeResolution
          formData={formData}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          shouldShowError={shouldShowError}
          isCompleted={isSectionComplete.deadlockResolution}
        />

        <Termination
          formData={formData}
          onChange={handleChange}
          onBlur={handleBlur}
          onCheckboxChange={handleCheckboxChange}
          errors={errors}
          shouldShowError={shouldShowError}
          isCompleted={isSectionComplete.termination}
        />

        <SignatureDetails
          formData={formData}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          shouldShowError={shouldShowError}
          isCompleted={isSectionComplete.signatureDetails}
        />

        {/* Scope Limitation Notice */}
        <div className="border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 rounded-lg p-3">
          <p className="text-xs text-blue-800 dark:text-blue-400">
            <strong>Note:</strong> Not suitable for listed companies or complex VC-negotiated agreements. For specialized cases, consult a lawyer.
          </p>
        </div>

        {/* Reset Form at bottom for consistency */}
        <Button type="button" variant="outline" className="w-full" onClick={resetForm}>Reset Form</Button>
      </div>

      {/* Right Column: Preview + PaymentCTA */}
      <div className="sticky top-24 self-start space-y-3">
        {calculatedData ? (
          <>
            <ShareholdersAgreementPreview calculatedData={calculatedData} maxHeight="55vh" />
            <PaymentCTA
              isFormComplete={isFormComplete}
              price={PDF_PRICE}
              documentType="shareholders-agreement"
              isTestMode={isTestMode}
              onPaymentSuccess={handleGenerateAndDownloadPDF}
              onPaymentError={handlePaymentError}
              completedSections={completedSectionsCount}
              totalSections={totalSections}
              paymentDescription={`Shareholders Agreement for ${formData.company.companyName || 'Company'}`}
            />
          </>
        ) : (
          <Card className="border-dashed bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center h-full py-20">
              <FileText className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">Enter details to see agreement preview</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Preview will appear here</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
