"use client"

import React, { useCallback } from "react"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calculator, HelpCircle, Download, RotateCcw } from 'lucide-react'
import { useIncomeTaxForm } from '@/lib/hooks/use-income-tax-form'
import { IncomeTaxComparisonPreview } from './income-tax-comparison-preview'
import { PaymentCTA } from '@/components/shared/payment-cta'
import { useToast } from '@/components/ui/use-toast'
import { formatCurrency } from '@/lib/income-tax/calculator'
import { generateAndDownloadPDF } from '@/lib/utils/pdf-download-utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const PDF_PRICE = 99 // ₹99

export function IncomeTaxComparisonForm() {
  const { toast } = useToast()
  
  const {
    formData,
    errors,
    touched,
    comparisonResult,
    handleChange,
    handleBlur,
    validateFormFull,
    fillTestData,
    shouldShowError,
    getError,
    resetForm,
    isFormComplete,
    totalDeductions,
  } = useIncomeTaxForm()

  // Format input with commas
  const formatInputValue = useCallback((value: string): string => {
    if (!value) return ''
    const num = parseFloat(value.replace(/,/g, ''))
    if (isNaN(num)) return ''
    return new Intl.NumberFormat('en-IN').format(num)
  }, [])

  // Handle numeric input change
  const handleNumericChange = useCallback((field: string, value: string) => {
    // Remove all non-digit characters
    const cleanValue = value.replace(/[^0-9]/g, '')
    handleChange(field, cleanValue)
  }, [handleChange])

  // Generate and download PDF
  const handleGenerateAndDownloadPDF = useCallback(async () => {
    const { isValid, errors: validationErrors } = validateFormFull()
    
    if (!isValid || !comparisonResult) {
      const firstError = Object.values(validationErrors)[0]
      toast({
        title: "Validation Error",
        description: firstError || "Please fix the errors in the form",
        variant: "destructive",
      })
      throw new Error("Form validation failed")
    }

    try {
      const { captureIncomeTaxComparisonHTML } = await import('@/lib/utils/dom-capture-utils')
      const htmlContent = captureIncomeTaxComparisonHTML()

      await generateAndDownloadPDF(
        htmlContent,
        `Income-Tax-Comparison-${Date.now()}.pdf`
      )

      toast({
        title: "Success! 🎉",
        description: "Your tax comparison report has been downloaded",
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
  }, [validateFormFull, comparisonResult, toast])

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
      {/* Left Column: Form */}
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-3xl font-bold text-foreground text-balance">Income Tax Calculator</h2>
            <Button
              onClick={fillTestData}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              Fill Test Data
            </Button>
          </div>
          <p className="text-muted-foreground text-pretty">
            Compare Old vs New Tax Regime for FY 2024-25 (AY 2025-26). Preview updates in real-time.
          </p>
        </div>

        {/* Basic Income Card */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">Basic Information</CardTitle>
            <CardDescription>Your income and age details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {/* Gross Income */}
              <div className="space-y-2">
                <Label htmlFor="grossIncome" className="text-sm font-medium">
                  Gross Annual Income <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="grossIncome"
                  type="text"
                  placeholder="e.g., 12,00,000"
                  value={formData.grossIncome ? formatInputValue(formData.grossIncome) : ''}
                  onChange={(e) => handleNumericChange('grossIncome', e.target.value)}
                  onBlur={() => handleBlur('grossIncome')}
                  className={getError('grossIncome') ? 'border-destructive' : ''}
                />
                {getError('grossIncome') && (
                  <p className="text-xs text-destructive">{getError('grossIncome')}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Total salary/business income before any deductions
                </p>
              </div>

              {/* Age Group */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Age Group</Label>
                <RadioGroup 
                  value={formData.ageGroup} 
                  onValueChange={(val) => handleChange('ageGroup', val)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="below-60" id="below-60" />
                    <Label htmlFor="below-60" className="font-normal text-sm cursor-pointer">
                      Below 60 years
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="senior" id="senior" />
                    <Label htmlFor="senior" className="font-normal text-sm cursor-pointer">
                      Senior Citizen (60-80 years)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="super-senior" id="super-senior" />
                    <Label htmlFor="super-senior" className="font-normal text-sm cursor-pointer">
                      Super Senior (Above 80 years)
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  Age affects basic exemption in the old regime
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deductions Card (Old Regime) */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">
              Deductions (Old Regime Only)
            </CardTitle>
            <CardDescription>
              Standard deduction of ₹50,000 is available under both regimes (per Budget 2023). Additional deductions below are available only in old regime.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <DeductionInput
                id="section80C"
                label="Section 80C Investments"
                value={formData.section80C}
                onChange={(val) => handleNumericChange('section80C', val)}
                onBlur={() => handleBlur('section80C')}
                error={getError('section80C')}
                helpText="PPF, ELSS, Life Insurance, Tuition Fees, etc."
                maxAmount="₹1,50,000"
                formatValue={formatInputValue}
              />

              <DeductionInput
                id="section80D"
                label="Section 80D (Health Insurance)"
                value={formData.section80D}
                onChange={(val) => handleNumericChange('section80D', val)}
                onBlur={() => handleBlur('section80D')}
                error={getError('section80D')}
                helpText="₹25k self/family + ₹25k/₹50k parents (max ₹75k)"
                maxAmount="Max ₹75,000 total"
                formatValue={formatInputValue}
              />

              <DeductionInput
                id="hra"
                label="HRA Exemption"
                value={formData.hra}
                onChange={(val) => handleNumericChange('hra', val)}
                onBlur={() => handleBlur('hra')}
                error={getError('hra')}
                helpText="House Rent Allowance exemption claimed"
                formatValue={formatInputValue}
              />

              <DeductionInput
                id="homeLoanInterest"
                label="Home Loan Interest (Sec 24b)"
                value={formData.homeLoanInterest}
                onChange={(val) => handleNumericChange('homeLoanInterest', val)}
                onBlur={() => handleBlur('homeLoanInterest')}
                error={getError('homeLoanInterest')}
                helpText="Interest paid on home loan for self-occupied property"
                maxAmount="₹2,00,000"
                formatValue={formatInputValue}
              />

              <DeductionInput
                id="nps80CCD1B"
                label="NPS - Section 80CCD(1B)"
                value={formData.nps80CCD1B}
                onChange={(val) => handleNumericChange('nps80CCD1B', val)}
                onBlur={() => handleBlur('nps80CCD1B')}
                error={getError('nps80CCD1B')}
                helpText="Additional NPS contribution beyond 80C"
                maxAmount="₹50,000"
                formatValue={formatInputValue}
              />

              <DeductionInput
                id="otherDeductions"
                label="Other Deductions"
                value={formData.otherDeductions}
                onChange={(val) => handleNumericChange('otherDeductions', val)}
                onBlur={() => handleBlur('otherDeductions')}
                error={getError('otherDeductions')}
                helpText="LTA, Education Loan Interest (80E), Donations (80G), etc."
                formatValue={formatInputValue}
              />

              {/* Total Deductions Summary */}
              {totalDeductions > 0 && (
                <Alert>
                  <AlertDescription>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Deductions (Old Regime):</span>
                      <span className="font-bold text-primary">{formatCurrency(totalDeductions)}</span>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={resetForm}
            variant="outline"
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Right Column: Preview + PaymentCTA */}
      <div className="sticky top-24 self-start space-y-3">
        {comparisonResult ? (
          <IncomeTaxComparisonPreview data={comparisonResult} maxHeight="55vh" />
        ) : (
          <Card className="border-dashed bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center h-full py-20">
              <Calculator className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">Enter your income details</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Comparison will appear here</p>
            </CardContent>
          </Card>
        )}
        
        <PaymentCTA
          isFormComplete={isFormComplete && !!comparisonResult}
          onPaymentSuccess={handleGenerateAndDownloadPDF}
          onPaymentError={handlePaymentError}
          price={PDF_PRICE}
          documentType="income-tax-comparison"
        />
      </div>
    </div>
  )
}

// Helper Component for Deduction Inputs
interface DeductionInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  error?: string
  helpText?: string
  maxAmount?: string
  formatValue: (value: string) => string
}

function DeductionInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  helpText,
  maxAmount,
  formatValue,
}: DeductionInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {maxAmount && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Maximum: {maxAmount}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Input
        id={id}
        type="text"
        placeholder="0"
        value={value ? formatValue(value) : ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={error ? 'border-destructive' : ''}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      {helpText && !error && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
    </div>
  )
}
