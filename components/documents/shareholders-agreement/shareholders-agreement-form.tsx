/**
 * Shareholders Agreement Form Component
 * Main form container using the useShareholdersAgreementForm hook
 */

"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useShareholdersAgreementForm } from "@/lib/hooks/use-shareholders-agreement-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react"
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

const PDF_PRICE = 499 // ₹499 for basic, can vary

const SECTION_TITLES = [
  "Company Details",
  "Shareholders Details",
  "Share Capital Ownership",
  "Board Management Control",
  "Voting Rights",
  "Share Transfer Restrictions",
  "Tag Along Drag Along",
  "Exit Buyout Clauses",
  "Confidentiality Non-Compete",
  "Deadlock Dispute Resolution",
  "Termination",
  "Signature Details",
]

export function ShareholdersAgreementForm() {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

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
  } = useShareholdersAgreementForm()

  // Check if minimum required fields are filled
  const canSubmit =
    formData.company.companyName.trim().length >= 2 &&
    formData.company.registeredAddress.trim().length >= 10 &&
    formData.company.dateOfAgreement.trim().length > 0 &&
    !!formData.company.companyType &&
    formData.shareholders.length >= 2 &&
    formData.shareholders.reduce((sum: number, sh: any) => sum + (sh.shareholding || 0), 0) === 100 &&
    formData.shareholders.every((sh: any) => sh.name.trim().length >= 2 && sh.email.trim().length >= 5) &&
    formData.shareCapital.faceValuePerShare > 0 &&
    !!formData.votingRights.votingBasis &&
    !!formData.votingRights.decisionsRequire &&
    !!formData.deadlockResolution.deadlockResolution &&
    formData.signatureDetails.placeOfSigning.trim().length >= 2

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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

    try {
      // Capture HTML from preview
      const { captureShareholdersAgreementPreviewHTML } = await import("@/lib/utils/dom-capture-utils")
      const htmlContent = captureShareholdersAgreementPreviewHTML()

      // Generate PDF
      const pdfResponse = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          htmlContent,
          filename: `shareholders-agreement-${Date.now()}.pdf`,
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
      a.download = `shareholders-agreement-${formData.company.companyName.replace(/\s+/g, "-").toLowerCase()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success!",
        description: "Your shareholders agreement has been generated and downloaded",
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

  // Calculate completion percentage
  const completedSections = Object.values(isSectionComplete).filter(Boolean).length
  const completionPercentage = Math.round((completedSections / SECTION_TITLES.length) * 100)

  // Count validation errors
  const errorCount = Object.keys(errors).filter((key) => shouldShowError(key)).length

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Sections */}
        <div className="space-y-6">
          {/* Header with progress */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-foreground">Create Your Shareholders Agreement</h2>
            </div>
            <p className="text-muted-foreground text-pretty">
              Fill in the details below to generate a legally formatted shareholders agreement. Preview updates in real-time.
            </p>

            {/* Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Progress</span>
                <span className="text-muted-foreground">{completionPercentage}% Complete ({completedSections}/{SECTION_TITLES.length})</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-2 mt-4 pb-2 overflow-x-auto">
              {SECTION_TITLES.map((title, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    isSectionComplete[Object.keys(isSectionComplete)[idx] as keyof typeof isSectionComplete]
                      ? "bg-green-100/80 text-green-700 border border-green-200"
                      : currentStep === idx
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                  onClick={() => setCurrentStep(idx)}
                  role="button"
                  tabIndex={0}
                >
                  {isSectionComplete[Object.keys(isSectionComplete)[idx] as keyof typeof isSectionComplete] ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-current flex items-center justify-center text-[10px] font-bold">{idx + 1}</span>
                  )}
                  <span className="hidden sm:inline">{title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Errors Summary */}
          {errorCount > 0 && (
            <div className="bg-red-50/80 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Please fix the errors</p>
                <p className="text-sm text-red-700 mt-0.5">{errorCount} field{errorCount !== 1 ? 's' : ''} need attention</p>
              </div>
            </div>
          )}

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

          <ShareCapitalOwnership
            formData={formData}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
            shouldShowError={shouldShowError}
            isCompleted={isSectionComplete.shareCapital}
          />

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
                  Processing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Pay ₹{PDF_PRICE} & Download Agreement
                </>
              )}
            </Button>
            {!canSubmit && !isProcessing && (
              <p className="text-xs text-center text-destructive">
                Please fill in all required fields with valid data to continue
              </p>
            )}
            <p className="text-xs text-center text-muted-foreground">
              Secure payment via Razorpay. Agreement generated instantly after payment.
            </p>
            <p className="text-sm text-center font-medium text-foreground">
              Used by startups & companies across India
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
              <p className="text-xs text-amber-900">
                ⚠️ <strong>Legal Disclaimer:</strong> This document is a standard Shareholders Agreement generated based on user inputs. It does not replace professional legal advice and must be reviewed by a qualified legal professional before execution.
              </p>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:block">
          <ShareholdersAgreementPreview calculatedData={calculatedData} />
        </div>
      </div>
    </form>
  )
}
