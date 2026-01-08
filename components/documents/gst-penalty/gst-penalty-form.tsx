"use client"

import React, { useCallback } from "react"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield } from 'lucide-react'
import { useGSTForm } from '@/lib/hooks/use-gst-form'
import { GSTPenaltyPreview } from './gst-penalty-preview'
import { TestScenarioSelector, gstScenarios } from '@/lib/testing'
import { PaymentCTA } from '@/components/shared/payment-cta'
import { useToast } from '@/components/ui/use-toast'
import { generateAndDownloadPDF } from '@/lib/utils/pdf-download-utils'

const PDF_PRICE = 99 // ₹99

export function GSTPenaltyForm() {
  const { toast } = useToast()
  
  const {
    formData,
    errors,
    calculations,
    handleChange,
    handleBlur,
    validateFormFull,
    shouldShowError,
    getError,
    resetForm,
    isFormComplete,
    completedSectionsCount,
    totalSections,
  } = useGSTForm()

  // Generate and download PDF
  const handleGenerateAndDownloadPDF = useCallback(async () => {
    const { isValid, errors: validationErrors } = validateFormFull()
    
    if (!isValid) {
      const firstError = Object.values(validationErrors)[0]
      toast({
        title: "Validation Error",
        description: firstError || "Please fix the errors in the form",
        variant: "destructive",
      })
      throw new Error("Form validation failed")
    }

    if (!calculations) {
      toast({
        title: "Error",
        description: "Please enter valid data to calculate penalty",
        variant: "destructive",
      })
      throw new Error("Calculations not available")
    }

    try {
      const { captureGSTPenaltyPreviewHTML } = await import('@/lib/utils/dom-capture-utils')
      const htmlContent = captureGSTPenaltyPreviewHTML()

      await generateAndDownloadPDF(
        htmlContent,
        `GST-Penalty-Summary-${formData.returnType}-${Date.now()}.pdf`
      )

      toast({
        title: "Success! 🎉",
        description: "Your GST penalty summary has been downloaded",
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
  }, [validateFormFull, calculations, formData.returnType, toast])

  // Handle payment error
  const handlePaymentError = useCallback((error: string) => {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    })
  }, [toast])

  const previewData = calculations
    ? {
        returnType: formData.returnType,
        taxAmount: parseFloat(formData.taxAmount) || 0,
        dueDate: formData.dueDate,
        filingDate: formData.filingDate,
        daysLate: calculations.daysLate,
        lateFee: calculations.lateFee,
        interest: calculations.interest,
        totalPenalty: calculations.totalPenalty,
        taxPaidLate: formData.taxPaidLate,
        isNilReturn: calculations.isNilReturn,
        breakdown: calculations.breakdown,
      }
    : null

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Column: Form */}
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-3xl font-bold text-foreground text-balance">GST Late Fee Calculator</h2>
            <TestScenarioSelector
              scenarios={gstScenarios}
              onApply={(data) => Object.entries(data).forEach(([k, v]) => handleChange(k, v))}
              label="Test Scenarios"
            />
          </div>
          <p className="text-muted-foreground text-pretty">
            Calculate GST late fees and interest based on CGST Act Section 47 & 50. Preview updates in real-time.
          </p>
        </div>

        {/* Form Fields */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">Return Details</CardTitle>
            <CardDescription>Enter your GST return information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Return Type</Label>
                <RadioGroup value={formData.returnType} onValueChange={(val) => handleChange('returnType', val)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="GSTR3B" id="gstr3b" />
                    <Label htmlFor="gstr3b" className="font-normal text-sm cursor-pointer">GSTR-3B (Monthly/Quarterly)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="GSTR1" id="gstr1" />
                    <Label htmlFor="gstr1" className="font-normal text-sm cursor-pointer">GSTR-1 (Monthly/Quarterly)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="GSTR9" id="gstr9" />
                    <Label htmlFor="gstr9" className="font-normal text-sm cursor-pointer">GSTR-9 (Annual Return)</Label>
                  </div>
                </RadioGroup>
                {shouldShowError('returnType') && <p className="text-xs text-destructive">{getError('returnType')}</p>}
              </div>

            <div className="space-y-2">
              <Label htmlFor="taxAmount" className="text-sm font-medium">Tax Amount (₹)</Label>
              <Input id="taxAmount" type="number" placeholder="50000 (enter 0 for NIL return)" min="0" step="0.01" value={formData.taxAmount} onChange={(e) => handleChange('taxAmount', e.target.value)} onBlur={() => handleBlur('taxAmount')} className={shouldShowError('taxAmount') ? 'border-destructive' : ''} />
              {shouldShowError('taxAmount') && <p className="text-xs text-destructive">{getError('taxAmount')}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium">Due Date</Label>
              <Input id="dueDate" type="date" value={formData.dueDate} onChange={(e) => handleChange('dueDate', e.target.value)} onBlur={() => handleBlur('dueDate')} className={shouldShowError('dueDate') ? 'border-destructive' : ''} />
              {shouldShowError('dueDate') && <p className="text-xs text-destructive">{getError('dueDate')}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="filingDate" className="text-sm font-medium">Filing Date</Label>
              <Input id="filingDate" type="date" value={formData.filingDate} onChange={(e) => handleChange('filingDate', e.target.value)} onBlur={() => handleBlur('filingDate')} className={shouldShowError('filingDate') ? 'border-destructive' : ''} />
              {shouldShowError('filingDate') && <p className="text-xs text-destructive">{getError('filingDate')}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="taxPaidLate" checked={formData.taxPaidLate} onCheckedChange={(checked) => handleChange('taxPaidLate', checked === true)} />
              <Label htmlFor="taxPaidLate" className="font-normal text-sm cursor-pointer text-muted-foreground">Tax was also paid late (interest applies)</Label>
            </div>

            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-sm">Please fix the errors above</AlertDescription>
              </Alert>
            )}

            <Button variant="outline" className="w-full" onClick={resetForm}>Reset Form</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Preview + PaymentCTA */}
      <div className="sticky top-24 self-start space-y-3">
        {previewData ? (
          <GSTPenaltyPreview data={previewData} maxHeight="55vh" />
        ) : (
          <Card className="border-dashed bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center h-full py-20">
              <Shield className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">Enter details to see penalty breakdown</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Preview will appear here</p>
            </CardContent>
          </Card>
        )}
        
        <PaymentCTA
          isFormComplete={isFormComplete && !!calculations}
          completedSections={completedSectionsCount}
          totalSections={totalSections}
          onPaymentSuccess={handleGenerateAndDownloadPDF}
          onPaymentError={handlePaymentError}
          price={PDF_PRICE}
          documentType="gst-penalty"
        />
      </div>
    </div>
  )
}
