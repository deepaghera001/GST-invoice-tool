'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowLeft, Download, CheckCircle, FlaskConical } from 'lucide-react';
import { usePayment } from '@/lib/hooks/use-payment';
import { useGSTForm } from '@/lib/hooks/use-gst-form';
import { GSTPenaltyPreview, captureGSTPenaltyPreviewHTML } from '@/components/documents/gst-penalty/gst-penalty-preview';
import { TestScenarioSelector, gstScenarios, isTestMode } from '@/lib/testing';
import { useState } from 'react';
import Head from "next/head";

const PDF_PRICE = 199; // ₹199

export default function GSTCalculatorPage() {
  // Use the GST form hook (Zod-based validation)
  const {
    formData,
    errors,
    calculations,
    handleChange,
    handleBlur,
    validateFormFull,
    shouldShowError,
    getError,
    fillTestData,
    resetForm,
  } = useGSTForm();

  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { initiatePayment, loading: paymentLoading, error: paymentError } = usePayment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setPaymentSuccess(false);

    // Validate form using Zod schema
    const { isValid, errors: validationErrors } = validateFormFull();

    if (!isValid) {
      // Get first error message to show
      const firstError = Object.values(validationErrors)[0];
      if (firstError) {
        setApiError(firstError);
      }
      return;
    }

    // Form is valid - calculations are already available from the hook
    // No API call needed since calculations are memoized in the hook
  };

  const downloadPDF = async () => {
    if (!calculations) return;

    setDownloadingPDF(true);
    try {
      // Capture HTML from the preview component (same as what user sees)
      const htmlContent = captureGSTPenaltyPreviewHTML();

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          htmlContent,
          filename: `GST-Penalty-Summary-${formData.returnType}-${Date.now()}.pdf`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GST-Penalty-Summary-${formData.returnType}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to download PDF');
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handlePayAndDownload = () => {
    // In test mode, download directly without payment
    if (isTestMode) {
      downloadPDF();
      return;
    }

    initiatePayment({
      amount: PDF_PRICE,
      name: 'GST Penalty Summary',
      description: `GST Penalty Summary - ${formData.returnType}`,
      onSuccess: (paymentId) => {
        console.log('Payment successful:', paymentId);
        setPaymentSuccess(true);
        // Automatically download PDF after successful payment
        downloadPDF();
      },
      onError: (error) => {
        console.error('Payment failed:', error);
      },
    });
  };

  const handleReset = () => {
    resetForm();
    setPaymentSuccess(false);
    setApiError(null);
  };

  // Preview data for the component (derived from form data and calculations)
  const previewData = calculations ? {
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
  } : null;

  return (
    <>
      <Head>
        <title>GST Penalty Calculator - ComplianceKit</title>
        <meta
          name="description"
          content="Calculate GST late fees and interest with ComplianceKit's GST Penalty Calculator. Accurate, fast, and easy to use."
        />
        <meta name="keywords" content="GST penalty calculator, GST late fee calculator, GST interest calculator, compliance tools" />
      </Head>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-slate-800 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-slate-900">ComplianceKit</span>
                <p className="text-xs text-slate-500">Documents & Compliance Tools</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              {isTestMode && (
                <Badge variant="outline" className="border-amber-500 text-amber-600 gap-1">
                  <FlaskConical className="h-3 w-3" />
                  Test Mode
                </Badge>
              )}
              <Link href="/" className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-10">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                GST Late Fee & Interest Calculator
              </h1>
              <p className="text-slate-600">
                Based on CGST Act Section 47 & 50, Notification 19/2021 & 20/2021. For estimation purposes.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Form Card */}
              <Card className="border-slate-200 bg-white h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-medium">Return Details</CardTitle>
                  <CardDescription className="flex items-center gap-2 flex-wrap">
                    Enter your GST return information
                    {/* Test Scenario Selector - only renders in test mode */}
                    <TestScenarioSelector
                      scenarios={gstScenarios}
                      onApply={(data) => {
                        Object.entries(data).forEach(([key, value]) => {
                          handleChange(key, value);
                        });
                      }}
                      label="Test Scenarios"
                    />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Return Type */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Return Type</Label>
                      <RadioGroup
                        value={formData.returnType}
                        onValueChange={(val) => handleChange('returnType', val)}
                      >
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
                      {shouldShowError('returnType') && (
                        <p className="text-xs text-red-500">{getError('returnType')}</p>
                      )}
                    </div>

                    {/* Tax Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="taxAmount" className="text-sm font-medium text-slate-700">
                        Tax Amount (₹)
                      </Label>
                      <Input
                        id="taxAmount"
                        type="number"
                        placeholder="50000 (enter 0 for NIL return)"
                        min="0"
                        step="0.01"
                        value={formData.taxAmount}
                        onChange={(e) => handleChange('taxAmount', e.target.value)}
                        onBlur={() => handleBlur('taxAmount')}
                        className={`border-slate-300 ${shouldShowError('taxAmount') ? 'border-red-500' : ''}`}
                      />
                      {shouldShowError('taxAmount') && (
                        <p className="text-xs text-red-500">{getError('taxAmount')}</p>
                      )}
                    </div>

                    {/* Due Date */}
                    <div className="space-y-2">
                      <Label htmlFor="dueDate" className="text-sm font-medium text-slate-700">
                        Due Date
                      </Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleChange('dueDate', e.target.value)}
                        onBlur={() => handleBlur('dueDate')}
                        className={`border-slate-300 ${shouldShowError('dueDate') ? 'border-red-500' : ''}`}
                      />
                      {shouldShowError('dueDate') && (
                        <p className="text-xs text-red-500">{getError('dueDate')}</p>
                      )}
                    </div>

                    {/* Filing Date */}
                    <div className="space-y-2">
                      <Label htmlFor="filingDate" className="text-sm font-medium text-slate-700">
                        Filing Date
                      </Label>
                      <Input
                        id="filingDate"
                        type="date"
                        value={formData.filingDate}
                        onChange={(e) => handleChange('filingDate', e.target.value)}
                        onBlur={() => handleBlur('filingDate')}
                        className={`border-slate-300 ${shouldShowError('filingDate') ? 'border-red-500' : ''}`}
                      />
                      {shouldShowError('filingDate') && (
                        <p className="text-xs text-red-500">{getError('filingDate')}</p>
                      )}
                    </div>

                    {/* Tax Paid Late */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="taxPaidLate"
                        checked={formData.taxPaidLate}
                        onCheckedChange={(checked) => handleChange('taxPaidLate', checked === true)}
                      />
                      <Label htmlFor="taxPaidLate" className="font-normal text-sm cursor-pointer text-slate-600">
                        Tax was also paid late (interest applies)
                      </Label>
                    </div>

                    {/* API/Form Error */}
                    {(apiError || Object.keys(errors).length > 0) && (
                      <Alert variant="destructive" className="py-2">
                        <AlertDescription className="text-sm">
                          {apiError || 'Please fix the errors above'}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Submit */}
                    <Button
                      type="submit"
                      className="w-full bg-slate-800 hover:bg-slate-900"
                    >
                      Calculate Penalty
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Preview Card */}
              <div className="space-y-4">
                {previewData ? (
                  <>
                    {/* The Preview Component - This is what gets captured for PDF */}
                    <GSTPenaltyPreview data={previewData} />

                    {/* Download Actions */}
                    <Card className="border-slate-200 bg-white">
                      <CardContent className="pt-4 space-y-3">
                        {/* Payment Success */}
                        {paymentSuccess && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <p className="text-sm text-green-800">Payment successful! Downloading PDF...</p>
                          </div>
                        )}

                        {/* Payment Error */}
                        {paymentError && (
                          <Alert variant="destructive" className="py-2">
                            <AlertDescription className="text-sm">{paymentError}</AlertDescription>
                          </Alert>
                        )}

                        {/* Download Button */}
                        <Button
                          className="w-full bg-slate-800 hover:bg-slate-900"
                          onClick={handlePayAndDownload}
                          disabled={paymentLoading || downloadingPDF}
                        >
                          {paymentLoading || downloadingPDF ? (
                            <>
                              <Spinner className="mr-2 h-4 w-4" />
                              {paymentLoading ? 'Processing...' : 'Generating PDF...'}
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-4 w-4" />
                              {isTestMode
                                ? 'Download PDF (Test Mode - Free)'
                                : `Download Penalty Summary (₹${PDF_PRICE})`
                              }
                            </>
                          )}
                        </Button>
                        <p className="text-xs text-slate-500 text-center">
                          {isTestMode
                            ? '⚠️ Test mode enabled - PDF downloads are free'
                            : 'Suitable for audit & record keeping'
                          }
                        </p>

                        {/* Reset */}
                        <Button
                          variant="outline"
                          className="w-full border-slate-300"
                          onClick={handleReset}
                        >
                          Calculate Another
                        </Button>
                      </CardContent>
                    </Card>
                  </>
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

            {/* Info Section */}
            <Card className="mt-8 border-slate-200 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-900">GST Late Fee & Interest Rules (Section 47 & 50)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-medium text-slate-800">Late Fee (Section 47 + Notification 19/2021):</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li><strong>Regular Return:</strong> ₹50/day CGST + ₹50/day SGST = ₹100/day total</li>
                      <li><strong>NIL Return:</strong> ₹10/day CGST + ₹10/day SGST = ₹20/day total</li>
                      <li><strong>Regular Cap:</strong> ₹2,500 CGST + ₹2,500 SGST = ₹5,000 total</li>
                      <li><strong>NIL Return Cap:</strong> ₹250 CGST + ₹250 SGST = ₹500 total</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-slate-800">Interest (Section 50):</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li><strong>Rate:</strong> 18% per annum on outstanding tax</li>
                      <li><strong>Applies when:</strong> Tax payment is also delayed</li>
                      <li><strong>Calculation:</strong> (Tax × 18% × Days Late) / 365</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-slate-500 pt-2 border-t">
                  ⚠️ This is for estimation purposes only. Consult a CA/Tax Professional for official advice. Rules may change.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white mt-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500 text-center md:text-left">
                © 2025 ComplianceKit. Free GST penalty calculator for Indian businesses.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Free Tool</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-400">
                Calculations are for estimation purposes only. Consult a CA for official advice.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
