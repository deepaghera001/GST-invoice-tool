/**
 * Salary Slip Form Component
 * Main form with 2-column layout (form + preview)
 * Follows the same pattern as InvoiceForm
 * 
 * Payment is handled by PaymentCTA component (modular)
 */

"use client"

import type React from "react"
import { useToast } from "@/components/ui/use-toast"
import { useSalarySlipForm } from "@/lib/hooks/use-salary-slip-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FlaskConical } from "lucide-react"
import { PeriodDetails } from "./form-sections/period-details"
import { EmployeeDetails } from "./form-sections/employee-details"
import { CompanyDetails } from "./form-sections/company-details"
import { Earnings } from "./form-sections/earnings"
import { Deductions } from "./form-sections/deductions"
import { BankingDetails } from "./form-sections/banking-details"
import { SalarySlipPreview } from "./salary-slip-preview"
import { PaymentCTA } from "@/components/shared/payment-cta"
import { TestScenarioSelector, salarySlipScenarios, isTestMode } from "@/lib/testing"

const PDF_PRICE = 49 // ₹49

export function SalarySlipForm() {
  const { toast } = useToast()

  const {
    formData,
    errors,
    calculations,
    handleChange,
    handleBlur,
    validateFormFull,
    markFieldTouched,
    shouldShowError,
    resetForm,
    isFormComplete,
    completedSectionsCount,
    totalSections,
  } = useSalarySlipForm()

  // Helper to set entire form data
  const setFormData = (data: typeof formData) => {
    Object.entries(data).forEach(([section, values]) => {
      if (typeof values === 'object') {
        Object.entries(values).forEach(([field, value]) => {
          handleChange(`${section}.${field}`, value)
        })
      }
    })
  }

  // Simple wrapper for onChange that extracts field path and type from event
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e.target.name, e.target.value, e.target.type)
  }

  /**
   * Generate and download PDF - called by PaymentCTA after successful payment
   */
  const generateAndDownloadPDF = async () => {
    // Validate form before generating
    const { isValid } = validateFormFull()
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
    const { captureSalarySlipPreviewHTML } = await import("@/lib/utils/dom-capture-utils")
    const htmlContent = captureSalarySlipPreviewHTML()

    const pdfResponse = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        htmlContent,
        filename: `salary-slip-${formData.employee.employeeId}.pdf`,
      }),
    })

    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text()
      console.error("PDF generation API error:", errorText)
      throw new Error(`API Error: ${pdfResponse.status} - ${errorText}`)
    }

    const blob = await pdfResponse.blob()
    downloadPDF(blob, formData.employee.employeeId)

    toast({
      title: "Success! 🎉",
      description: "Your salary slip has been generated and downloaded.",
    })
  }

  /**
   * Handle payment errors from PaymentCTA
   */
  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error || "Payment was not completed. Please try again.",
      variant: "destructive",
    })
  }

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl font-bold text-foreground text-balance">Create Your Salary Slip</h2>
              {isTestMode && (
                <Badge variant="outline" className="border-amber-500 text-amber-600 gap-1">
                  <FlaskConical className="h-3 w-3" />
                  Test Mode
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-muted-foreground text-pretty">
                Fill in the details below to generate a professional salary slip. Preview updates in real-time.
              </p>
              {/* Test Scenario Selector - only renders in test mode */}
              <TestScenarioSelector
                scenarios={salarySlipScenarios}
                onApply={(data) => setFormData({ ...formData, ...data } as typeof formData)}
                label="Test Scenarios"
              />
            </div>
          </div>

          <form className="space-y-6">
            {/* Form Sections */}
            <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-75">
              <PeriodDetails
                month={formData.period.month}
                year={formData.period.year}
                fieldPrefix="period"
                onChange={handleFieldChange}
                onBlur={handleBlur}
                errors={errors as Record<string, string>}
                shouldShowError={shouldShowError}
              />
            </div>

            <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-100">
              <EmployeeDetails
                employeeId={formData.employee.employeeId}
                uan={formData.employee.uan}
                employeeName={formData.employee.employeeName}
                designation={formData.employee.designation}
                department={formData.employee.department}
                dateOfJoining={formData.employee.dateOfJoining}
                panNumber={formData.employee.panNumber}
                fieldPrefix="employee"
                onChange={handleFieldChange}
                onBlur={handleBlur}
                errors={errors as Record<string, string>}
                shouldShowError={shouldShowError}
              />
            </div>

            <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-150">
              <CompanyDetails
                companyName={formData.company.companyName}
                logo={formData.company.logo}
                companyAddress={formData.company.companyAddress}
                panNumber={formData.company.panNumber}
                cin={formData.company.cin}
                fieldPrefix="company"
                onChange={handleFieldChange}
                onBlur={handleBlur}
                errors={errors as Record<string, string>}
                shouldShowError={shouldShowError}
              />
            </div>

            <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-200">
              <Earnings
                basicSalary={formData.earnings.basicSalary}
                dearness={formData.earnings.dearness}
                houseRent={formData.earnings.houseRent}
                conveyance={formData.earnings.conveyance}
                otherEarnings={formData.earnings.otherEarnings}
                totalEarnings={calculations.totalEarnings}
                fieldPrefix="earnings"
                onChange={handleFieldChange}
                onBlur={handleBlur}
                errors={errors as Record<string, string>}
                shouldShowError={shouldShowError}
              />
            </div>

            <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-300">
              <Deductions
                providentFund={formData.deductions.providentFund}
                esi={formData.deductions.esi}
                incomeTax={formData.deductions.incomeTax}
                otherDeductions={formData.deductions.otherDeductions}
                totalDeductions={calculations.totalDeductions}
                fieldPrefix="deductions"
                onChange={handleFieldChange}
                onBlur={handleBlur}
                errors={errors as Record<string, string>}
                shouldShowError={shouldShowError}
              />
            </div>

            <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-400">
              <BankingDetails
                bankName={formData.bankingDetails.bankName}
                accountHolder={formData.bankingDetails.accountHolder}
                accountNumber={formData.bankingDetails.accountNumber}
                ifscCode={formData.bankingDetails.ifscCode}
                fieldPrefix="bankingDetails"
                onChange={handleFieldChange}
                onBlur={handleBlur}
                errors={errors as Record<string, string>}
                shouldShowError={shouldShowError}
              />
            </div>

            {/* Reset Form */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => resetForm()}
            >
              Reset Form
            </Button>
          </form>
        </div>

        {/* Right Column: Preview + PaymentCTA */}
        <div className="lg:block hidden sticky top-24 self-start space-y-3">
          {/* Preview - Uses maxHeight prop to leave room for PaymentCTA */}
          <SalarySlipPreview formData={formData} calculations={calculations} maxHeight="55vh" />
          
          {/* Psychology-optimized Payment CTA - Always visible below preview */}
          <PaymentCTA
            isFormComplete={isFormComplete}
            price={PDF_PRICE}
            documentType="salary-slip"
            isTestMode={isTestMode}
            onPaymentSuccess={generateAndDownloadPDF}
            onPaymentError={handlePaymentError}
            completedSections={completedSectionsCount}
            totalSections={totalSections}
            paymentDescription={`Salary Slip - ${formData.employee.employeeName} (${formData.period.month}/${formData.period.year})`}
          />
        </div>
      </div>
    </>
  )
}

/**
 * Helper function to download PDF
 */
function downloadPDF(blob: Blob, employeeId: string) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `salary-slip-${employeeId}.pdf`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
