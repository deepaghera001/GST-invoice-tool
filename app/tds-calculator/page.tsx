'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowLeft, FlaskConical } from 'lucide-react';
import { useTDSForm } from '@/lib/hooks/use-tds-form';
import { TDSFeePreview, captureTDSFeePreviewHTML } from '@/components/documents/tds-fee/tds-fee-preview';
import { TestScenarioSelector, tdsScenarios, isTestMode } from '@/lib/testing';
import { useState, useCallback } from 'react';
import Head from "next/head";
import { PaymentCTA } from '@/components/shared/payment-cta';

const PDF_PRICE = 199; // ₹199

export default function TDSCalculatorPage() {
  // Use the TDS form hook (Zod-based validation)
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
    isFormComplete,
    completedSectionsCount,
    totalSections,
  } = useTDSForm();

  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

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

  /**
   * Generate and download PDF - called by PaymentCTA after successful payment
   */
  const generateAndDownloadPDF = useCallback(async () => {
    if (!calculations) {
      throw new Error('No calculations available');
    }

    // Capture HTML from the preview component (same as what user sees)
    const htmlContent = captureTDSFeePreviewHTML();

    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        htmlContent,
        filename: `TDS-Fee-Summary-${formData.deductionType}-${Date.now()}.pdf`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TDS-Fee-Summary-${formData.deductionType}-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, [calculations, formData.deductionType]);

  /**
   * Handle payment error - called by PaymentCTA on payment failure
   */
  const handlePaymentError = useCallback((error: string) => {
    setApiError(error);
  }, []);

  const handleReset = () => {
    resetForm();
    setApiError(null);
  };

  // Preview data for the component (derived from form data and calculations)
  const previewData = calculations ? {
    tdsSection: formData.deductionType,
    tdsAmount: parseFloat(formData.tdsAmount),
    dueDate: formData.dueDate,
    filingDate: formData.filingDate,
    daysLate: calculations.daysLate,
    lateFee: calculations.lateFee,
    interestOnLateDeduction: calculations.interestOnLateDeduction || 0,
    interestOnLatePayment: calculations.interestOnLatePayment || 0,
    totalPenalty: calculations.totalPenalty,
  } : null;

  // Map deduction type to display name
  const getDeductionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      salary: '192 - Salary',
      contractor: '194C - Contractor Payments',
      rent: '194I - Rent',
      professional: '194J - Professional Fees',
      commission: '194H - Commission',
      other: 'Other Sections',
    };
    return labels[type] || type;
  };

  return (
    <>
      <Head>
        <title>TDS Late Fee Calculator - ComplianceKit</title>
        <meta
          name="description"
          content="Calculate TDS late fees and interest with ComplianceKit's TDS Calculator. Accurate, fast, and easy to use."
        />
        <meta name="keywords" content="TDS late fee calculator, TDS penalty calculator, TDS interest calculator, compliance tools" />
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
                TDS Late Filing Fee Calculator
              </h1>
              <p className="text-slate-600">
                Based on Income Tax Act. For estimation purposes.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Form Card */}
              <Card className="border-slate-200 bg-white h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-medium">TDS Details</CardTitle>
                  <CardDescription className="flex items-center gap-2 flex-wrap">
                    Enter your TDS return information
                    {/* Test Scenario Selector - only renders in test mode */}
                    <TestScenarioSelector
                      scenarios={tdsScenarios}
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
                    {/* Deduction Type */}
                    <div className="space-y-2">
                      <Label htmlFor="deductionType" className="text-sm font-medium text-slate-700">
                        TDS Section
                      </Label>
                      <Select
                        value={formData.deductionType}
                        onValueChange={(val) => handleChange('deductionType', val)}
                      >
                        <SelectTrigger
                          id="deductionType"
                          className={`border-slate-300 ${shouldShowError('deductionType') ? 'border-red-500' : ''}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="salary">192 - Salary</SelectItem>
                          <SelectItem value="contractor">194C - Contractor Payments</SelectItem>
                          <SelectItem value="commission">194H - Commission/Brokerage</SelectItem>
                          <SelectItem value="rent">194I - Rent</SelectItem>
                          <SelectItem value="professional">194J - Professional/Technical Fees</SelectItem>
                          <SelectItem value="other">Other Sections</SelectItem>
                        </SelectContent>
                      </Select>
                      {shouldShowError('deductionType') && (
                        <p className="text-xs text-red-500">{getError('deductionType')}</p>
                      )}
                    </div>

                    {/* TDS Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="tdsAmount" className="text-sm font-medium text-slate-700">
                        TDS Amount (₹)
                      </Label>
                      <Input
                        id="tdsAmount"
                        type="number"
                        placeholder="50000"
                        min="1"
                        step="0.01"
                        value={formData.tdsAmount}
                        onChange={(e) => handleChange('tdsAmount', e.target.value)}
                        onBlur={() => handleBlur('tdsAmount')}
                        className={`border-slate-300 ${shouldShowError('tdsAmount') ? 'border-red-500' : ''}`}
                      />
                      {shouldShowError('tdsAmount') && (
                        <p className="text-xs text-red-500">{getError('tdsAmount')}</p>
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
                        Actual Filing Date
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

                    {/* Deposit Date (optional) */}
                    <div className="space-y-2">
                      <Label htmlFor="depositDate" className="text-sm font-medium text-slate-700">
                        Deposit Date (optional)
                      </Label>
                      <Input
                        id="depositDate"
                        type="date"
                        value={formData.depositDate}
                        onChange={(e) => handleChange('depositDate', e.target.value)}
                        onBlur={() => handleBlur('depositDate')}
                        className={`border-slate-300 ${shouldShowError('depositDate') ? 'border-red-500' : ''}`}
                      />
                      {shouldShowError('depositDate') && (
                        <p className="text-xs text-red-500">{getError('depositDate')}</p>
                      )}
                    </div>

                    {/* Interest Options */}
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <p className="text-xs text-slate-500">Additional interest applies if:</p>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="depositedLate"
                          checked={formData.depositedLate}
                          onCheckedChange={(checked) => handleChange('depositedLate', checked === true)}
                        />
                        <Label htmlFor="depositedLate" className="font-normal text-sm cursor-pointer text-slate-600">
                          TDS was deposited late (1.5% per month interest)
                        </Label>
                      </div>
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
                      Calculate Fee
                    </Button>

                    {/* Reset Button */}
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full border-slate-300"
                      onClick={handleReset}
                    >
                      Calculate Another
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Preview Column - Contains preview + PaymentCTA */}
              <div className="space-y-3 sticky top-24 self-start">
                {previewData ? (
                  <>
                    {/* Preview - Uses maxHeight prop to leave room for PaymentCTA */}
                    <TDSFeePreview data={previewData} maxHeight="55vh" />
                    
                    {/* Payment CTA - Always visible below preview */}
                    <PaymentCTA
                      isFormComplete={isFormComplete && !!calculations}
                      price={PDF_PRICE}
                      documentType="tds-certificate"
                      isTestMode={isTestMode}
                      onPaymentSuccess={generateAndDownloadPDF}
                      onPaymentError={handlePaymentError}
                      completedSections={completedSectionsCount}
                      totalSections={totalSections}
                      paymentDescription={`TDS Late Filing Fee Summary - ${formData.deductionType}`}
                    />
                  </>
                ) : (
                  <Card className="border-slate-200 border-dashed bg-slate-50/50">
                    <CardContent className="flex flex-col items-center justify-center h-full py-20">
                      <Shield className="h-10 w-10 text-slate-300 mb-3" />
                      <p className="text-sm text-slate-500">Enter details to see fee breakdown</p>
                      <p className="text-xs text-slate-400 mt-1">Preview will appear here</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Info Section */}
            <Card className="mt-8 border-slate-200 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-900">TDS Late Fee & Interest Rules</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-medium text-slate-800">Late Fee (Section 234E):</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li><strong>Rate:</strong> ₹200 per day from due date</li>
                      <li><strong>Maximum Cap:</strong> Cannot exceed TDS amount</li>
                      <li><strong>Applies to:</strong> Late filing of TDS returns</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-slate-800">Interest (Section 201(1A)):</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li><strong>Late Payment:</strong> 1.5% per month or part thereof</li>
                      <li><strong>Calculation:</strong> From date due to date of payment</li>
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
                © 2025 ComplianceKit. Free TDS fee calculator for Indian businesses.
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
