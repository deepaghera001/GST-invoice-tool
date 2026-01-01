"use client"

import React, { useState } from "react"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { Shield, Download, CheckCircle } from 'lucide-react'
import { usePayment } from '@/lib/hooks/use-payment'
import { useGSTForm } from '@/lib/hooks/use-gst-form'
import { GSTPenaltyPreview } from './gst-penalty-preview'
import { TestScenarioSelector, gstScenarios, isTestMode } from '@/lib/testing'

const PDF_PRICE = 199 // ₹199

export function GSTPenaltyForm() {
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
  } = useGSTForm()

  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const { initiatePayment, loading: paymentLoading, error: paymentError } = usePayment()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)
    setPaymentSuccess(false)

    const { isValid, errors: validationErrors } = validateFormFull()

    if (!isValid) {
      const firstError = Object.values(validationErrors)[0]
      if (firstError) setApiError(firstError)
      return
    }

    // calculations are derived in the hook; no API call here
  }

  const downloadPDF = async () => {
    if (!calculations) return

    setDownloadingPDF(true)
    try {
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
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to download PDF')
    } finally {
      setDownloadingPDF(false)
    }
  }

  const handlePayAndDownload = () => {
    if (isTestMode) {
      downloadPDF()
      return
    }

    initiatePayment({
      amount: PDF_PRICE,
      name: 'GST Penalty Summary',
      description: `GST Penalty Summary - ${formData.returnType}`,
      onSuccess: (paymentId) => {
        setPaymentSuccess(true)
        downloadPDF()
      },
      onError: (error) => {
        console.error('Payment failed:', error)
      },
    })
  }

  const handleReset = () => {
    resetForm()
    setPaymentSuccess(false)
    setApiError(null)
  }

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
          <form onSubmit={handleSubmit} className="space-y-5">
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

            {(apiError || Object.keys(errors).length > 0) && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-sm">{apiError || 'Please fix the errors above'}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-900">Calculate Penalty</Button>

            <div className="pt-3">
              <Card className="border-slate-200 bg-white">
                <CardContent className="pt-4 space-y-3">
                  {paymentSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <p className="text-sm text-green-800">Payment successful! Downloading PDF...</p>
                    </div>
                  )}

                  {paymentError && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription className="text-sm">{paymentError}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    className="w-full bg-slate-800 hover:bg-slate-900"
                    onClick={() => {
                      const { isValid, errors: validationErrors } = validateFormFull()
                      if (!isValid) {
                        const firstError = Object.values(validationErrors)[0]
                        if (firstError) setApiError(firstError)
                        return
                      }
                      handlePayAndDownload()
                    }}
                    disabled={paymentLoading || downloadingPDF || !calculations || Object.keys(errors).length > 0}
                  >
                    {paymentLoading || downloadingPDF ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        {paymentLoading ? 'Processing...' : 'Generating PDF...'}
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        {isTestMode ? 'Download PDF (Test Mode - Free)' : `Download Penalty Summary (₹${PDF_PRICE})`}
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-slate-500 text-center">{isTestMode ? '⚠️ Test mode enabled - PDF downloads are free' : 'Suitable for audit & record keeping'}</p>

                  <Button variant="outline" className="w-full border-slate-300" onClick={handleReset}>Calculate Another</Button>
                </CardContent>
              </Card>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {previewData ? (
          <GSTPenaltyPreview data={previewData} />
        ) : (
          <Card className="border-slate-200 border-dashed bg-slate-50/50">
            <CardContent className="flex flex-col items-center justify-center h-full py-20">
              <Shield className="h-10 w-10 text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">Enter details to see penalty breakdown</p>
              <p className="text-xs text-slate-400 mt-1">Preview will appear here</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
