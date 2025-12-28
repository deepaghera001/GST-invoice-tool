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
import { Loader2, Download } from "lucide-react"
import { PeriodDetails } from "./form-sections/period-details"
import { EmployeeDetails } from "./form-sections/employee-details"
import { CompanyDetails } from "./form-sections/company-details"
import { Earnings } from "./form-sections/earnings"
import { Deductions } from "./form-sections/deductions"
import { BankingDetails } from "./form-sections/banking-details"
import { SalarySlipPreview } from "./salary-slip-preview"
import { PAN_REGEX, IFSC_REGEX } from "@/lib/salary-slip"

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
    fillTestData,
    shouldShowError,
  } = useSalarySlipForm()

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

    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV === "development"

    if (isDevelopment) {
      // In development mode, generate PDF directly without payment
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
          console.error("[DEV] PDF generation API error response:", errorText)
          throw new Error(`API Error: ${pdfResponse.status} - ${errorText}`)
        }

        const blob = await pdfResponse.blob()
        downloadPDF(blob, formData.employee.employeeId, "html")

        toast({
          title: "Success!",
          description: "Your salary slip has been generated and downloaded (development mode)",
        })
      } catch (error) {
        console.error("[DEV] PDF generation error:", error)
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
      description: "Payment integration coming soon. Use development mode to test.",
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
            <h2 className="text-3xl font-bold text-foreground text-balance">Create Your Salary Slip</h2>
            <p className="text-muted-foreground text-pretty">
              Fill in the details below to generate a professional salary slip. Preview updates in real-time.
            </p>
          </div>

          {/* Test Button for Development */}
          {process.env.NODE_ENV === "development" && (
            <div className="p-4 border border-border rounded-lg bg-muted/50">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Development Mode</h3>
                  <p className="text-sm text-muted-foreground">Quick test with sample data</p>
                </div>
                <Button
                  type="button"
                  onClick={fillTestData}
                  variant="secondary"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Fill Test Data
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pricing Section */}
            <div className="space-y-6 p-6 border border-border rounded-xl bg-card shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">Pricing</h3>
                <p className="text-sm text-muted-foreground">One salary slip. One price.</p>
              </div>

              <div className="text-center p-8 bg-muted/50 rounded-lg border border-border">
                <div className="mb-2">
                  <span className="text-4xl font-bold text-primary">₹49</span>
                  <span className="text-lg text-muted-foreground ml-2">per salary slip</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">One-time payment. No subscription. Instant download.</p>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 text-green-500 flex-shrink-0">✓</div>
                    <span>Professional Format</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 text-green-500 flex-shrink-0">✓</div>
                    <span>Auto Calculations</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 text-green-500 flex-shrink-0">✓</div>
                    <span>Secure Payment</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <span className="h-4 w-4 flex items-center justify-center">🔒</span>
                  Secure payment via Razorpay • Instant PDF generation
                </p>
              </div>
            </div>

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
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Pay ₹49 & Download Salary Slip
                  </>
                )}
              </Button>
              {!canSubmit && !isProcessing && (
                <p className="text-xs text-center text-destructive">
                  Please fill in all required fields with valid data to continue
                </p>
              )}
              <p className="text-xs text-center text-muted-foreground">
                Secure payment via Razorpay. Salary slip generated instantly after payment.
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
function downloadPDF(blob: Blob, employeeId: string, type: string) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `salary-slip-${employeeId}-${type}.pdf`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
