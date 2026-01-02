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

const PDF_PRICE = 199 // ₹199

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
  const generateAndDownloadPDF = useCallback(async () => {
    const { isValid, errors: validationErrors } = validateFormFull()
    
    if (!isValid) {
      const firstError = Object.values(validationErrors)[0]
      toast({
        title: "Validation Error",
        description: firstError || "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    if (!calculations) {
      toast({
        title: "Error",
        description: "Please enter valid data to calculate penalty",
        variant: "destructive",
      })
      return
    }

    const { captureGSTPenaltyPreviewHTML } = await import('@/lib/utils/dom-capture-utils')
    const htmlContent = captureGSTPenaltyPreviewHTML()

    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        htmlContent,
        filename: `GST-Penalty-Summary-${formData.returnType}-${Date.now()}.pdf`,
      }),
    })

    if (!response.ok) throw new Error('Failed to generate PDF')

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `GST-Penalty-Summary-${formData.returnType}-${Date.now()}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    toast({
      title: "Success!",
      description: "Your GST penalty summary has been downloaded",
    })
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
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="border-slate-200 bg-white h-fit">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">Return Details</CardTitle>
          <CardDescription className="flex items-center gap-2 flex-wrap">
            Enter your GST return information
            <TestScenarioSelector
              scenarios={gstScenarios}
              onApply={(data) => Object.entries(data).forEach(([k, v]) => handleChange(k, v))}
              label="Test Scenarios"
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Return Type</Label>
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
              {shouldShowError('returnType') && <p className="text-xs text-red-500">{getError('returnType')}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxAmount" className="text-sm font-medium text-slate-700">Tax Amount (₹)</Label>
              <Input id="taxAmount" type="number" placeholder="50000 (enter 0 for NIL return)" min="0" step="0.01" value={formData.taxAmount} onChange={(e) => handleChange('taxAmount', e.target.value)} onBlur={() => handleBlur('taxAmount')} className={`border-slate-300 ${shouldShowError('taxAmount') ? 'border-red-500' : ''}`} />
              {shouldShowError('taxAmount') && <p className="text-xs text-red-500">{getError('taxAmount')}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium text-slate-700">Due Date</Label>
              <Input id="dueDate" type="date" value={formData.dueDate} onChange={(e) => handleChange('dueDate', e.target.value)} onBlur={() => handleBlur('dueDate')} className={`border-slate-300 ${shouldShowError('dueDate') ? 'border-red-500' : ''}`} />
              {shouldShowError('dueDate') && <p className="text-xs text-red-500">{getError('dueDate')}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="filingDate" className="text-sm font-medium text-slate-700">Filing Date</Label>
              <Input id="filingDate" type="date" value={formData.filingDate} onChange={(e) => handleChange('filingDate', e.target.value)} onBlur={() => handleBlur('filingDate')} className={`border-slate-300 ${shouldShowError('filingDate') ? 'border-red-500' : ''}`} />
              {shouldShowError('filingDate') && <p className="text-xs text-red-500">{getError('filingDate')}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="taxPaidLate" checked={formData.taxPaidLate} onCheckedChange={(checked) => handleChange('taxPaidLate', checked === true)} />
              <Label htmlFor="taxPaidLate" className="font-normal text-sm cursor-pointer text-slate-600">Tax was also paid late (interest applies)</Label>
            </div>

            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-sm">Please fix the errors above</AlertDescription>
              </Alert>
            )}

            <Button variant="outline" className="w-full border-slate-300" onClick={resetForm}>Calculate Another</Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview + PaymentCTA */}
      <div className="sticky top-24 self-start space-y-3">
        {previewData ? (
          <GSTPenaltyPreview data={previewData} maxHeight="55vh" />
        ) : (
          <Card className="border-slate-200 border-dashed bg-slate-50/50">
            <CardContent className="flex flex-col items-center justify-center h-full py-20">
              <Shield className="h-10 w-10 text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">Enter details to see penalty breakdown</p>
              <p className="text-xs text-slate-400 mt-1">Preview will appear here</p>
            </CardContent>
          </Card>
        )}
        
        <PaymentCTA
          isFormComplete={isFormComplete && !!calculations}
          completedSections={completedSectionsCount}
          totalSections={totalSections}
          onPaymentSuccess={generateAndDownloadPDF}
          onPaymentError={handlePaymentError}
          price={PDF_PRICE}
          documentType="gst-penalty"
          buttonText="Download Summary"
        />
      </div>
    </div>
  )
}
