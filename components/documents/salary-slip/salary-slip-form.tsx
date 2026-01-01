/**
 * Salary Slip Form Component
 * Main form with 2-column layout (form + preview)
 * Follows the same pattern as InvoiceForm
 */

"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useSalarySlipForm } from "@/lib/hooks/use-salary-slip-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, FlaskConical } from "lucide-react"
import { PeriodDetails } from "./form-sections/period-details"
import { EmployeeDetails } from "./form-sections/employee-details"
import { CompanyDetails } from "./form-sections/company-details"
import { Earnings } from "./form-sections/earnings"
import { Deductions } from "./form-sections/deductions"
import { BankingDetails } from "./form-sections/banking-details"
import { SalarySlipPreview } from "./salary-slip-preview"
import { PAN_REGEX, IFSC_REGEX } from "@/lib/salary-slip"
import { TestScenarioSelector, salarySlipScenarios, isTestMode } from "@/lib/testing"

const PDF_PRICE = 49 // ₹49

export function SalarySlipForm() {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    formData,
    errors,
    calculations,
    handleChange,
    handleBlur,
    validateFormFull,
    markFieldTouched,
    shouldShowError,
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

  // Simple wrapper for onChange that extracts field path from event
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e.target.name, e.target.value)
  }

  // Simple wrapper for number fields
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e.target.name, Number.parseFloat(e.target.value) || 0)
  }

  // Determine if form can be submitted
  const isValidGSTIN = PAN_REGEX.test(formData.employee.panNumber)
  const isValidCompanyPAN = PAN_REGEX.test(formData.company.panNumber)
  const isValidIFSC = IFSC_REGEX.test(formData.bankingDetails.ifscCode)

  const canSubmit =
    formData.employee.employeeName.trim().length >= 2 &&
    formData.employee.employeeId.trim().length > 0 &&
    isValidGSTIN &&
    formData.company.companyName.trim().length >= 2 &&
    isValidCompanyPAN &&
    formData.earnings.basicSalary > 0 &&
    formData.bankingDetails.bankName.trim().length > 0 &&
    isValidIFSC

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { isValid } = validateFormFull()

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

    // In test mode, generate PDF directly without payment
    if (isTestMode) {
      try {
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
          console.error("[TEST] PDF generation API error response:", errorText)
          throw new Error(`API Error: ${pdfResponse.status} - ${errorText}`)
        }

        const blob = await pdfResponse.blob()
        downloadPDF(blob, formData.employee.employeeId)

        toast({
          title: "Success!",
          description: "Your salary slip has been generated and downloaded (test mode)",
        })
      } catch (error) {
        console.error("[TEST] PDF generation error:", error)
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

    // Production mode would handle payment here
    toast({
      title: "Coming Soon",
      description: "Payment integration coming soon. Enable test mode to test.",
      variant: "default",
    })
    setIsProcessing(false)
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

          <form onSubmit={handleSubmit} className="space-y-6">
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
                onChange={handleNumberChange}
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
                onChange={handleNumberChange}
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

            {/* Submit Button */}
            <div className="flex flex-col gap-3 pt-4 animate-in fade-in slide-in-from-top-2 duration-200 delay-500">
              <div className="text-center py-2">
                <p className="text-sm font-medium text-primary">Professional salary slips in 2 minutes</p>
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
                    {isTestMode ? 'Generating PDF...' : 'Processing Payment...'}
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    {isTestMode 
                      ? 'Download PDF (Test Mode - Free)' 
                      : `Pay ₹${PDF_PRICE} & Download Salary Slip`
                    }
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
                  : 'Secure payment via Razorpay. Salary slip generated instantly after payment.'
                }
              </p>
            </div>
          </form>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:block hidden">
          <SalarySlipPreview formData={formData} calculations={calculations} />
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
