'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import { useTDSForm } from '@/lib/hooks/use-tds-form';
import { TDSFeePreview, captureTDSFeePreviewHTML } from '@/components/documents/tds-fee/tds-fee-preview';
import { TestScenarioSelector, tdsScenarios, isTestMode } from '@/lib/testing';
import { useState, useCallback } from 'react';
import Head from "next/head";
import { PaymentCTA } from '@/components/shared/payment-cta';
import { PageHeader, Footer } from '@/components/home';
import { generateAndDownloadPDF } from '@/lib/utils/pdf-download-utils';

const PDF_PRICE = 99; // ₹99

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
  const handleGenerateAndDownloadPDF = useCallback(async () => {
    if (!calculations) {
      throw new Error('No calculations available');
    }

    try {
      // Capture HTML from the preview component (same as what user sees)
      const htmlContent = captureTDSFeePreviewHTML();

      await generateAndDownloadPDF(
        htmlContent,
        `TDS-Fee-Summary-${formData.deductionType}-${Date.now()}.pdf`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate PDF';
      setApiError(message);
      throw error;
    }
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
        <title>TDS Late Fee Calculator - Workngin</title>
        <meta
          name="description"
          content="Calculate TDS late fees and interest with Workngin's TDS Calculator. Accurate, fast, and easy to use."
        />
        <meta name="keywords" content="TDS late fee calculator, TDS penalty calculator, TDS interest calculator, compliance tools" />
      </Head>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <PageHeader />

        {/* Main Content */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column: Form */}
              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-3xl font-bold text-foreground text-balance">TDS Late Fee Calculator</h2>
                    <TestScenarioSelector
                      scenarios={tdsScenarios}
                      onApply={(data) => {
                        Object.entries(data).forEach(([key, value]) => {
                          handleChange(key, value);
                        });
                      }}
                      label="Test Scenarios"
                    />
                  </div>
                  <p className="text-muted-foreground text-pretty">
                    Calculate TDS late fees and interest based on Income Tax Act. Preview updates in real-time.
                  </p>
                </div>

                {/* Form Card */}
                <Card className="border-border bg-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-medium">TDS Details</CardTitle>
                    <CardDescription>Enter your TDS return information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Deduction Type */}
                      <div className="space-y-2">
                        <Label htmlFor="deductionType" className="text-sm font-medium">
                          TDS Section
                        </Label>
                        <Select
                          value={formData.deductionType}
                          onValueChange={(val) => handleChange('deductionType', val)}
                        >
                          <SelectTrigger
                            id="deductionType"
                            className={shouldShowError('deductionType') ? 'border-destructive' : ''}
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
                          <p className="text-xs text-destructive">{getError('deductionType')}</p>
                        )}
                      </div>

                      {/* TDS Amount */}
                      <div className="space-y-2">
                        <Label htmlFor="tdsAmount" className="text-sm font-medium">
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
                          className={shouldShowError('tdsAmount') ? 'border-destructive' : ''}
                        />
                        {shouldShowError('tdsAmount') && (
                          <p className="text-xs text-destructive">{getError('tdsAmount')}</p>
                        )}
                      </div>

                      {/* Due Date */}
                      <div className="space-y-2">
                        <Label htmlFor="dueDate" className="text-sm font-medium">
                          Due Date
                        </Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => handleChange('dueDate', e.target.value)}
                          onBlur={() => handleBlur('dueDate')}
                          className={shouldShowError('dueDate') ? 'border-destructive' : ''}
                        />
                        {shouldShowError('dueDate') && (
                          <p className="text-xs text-destructive">{getError('dueDate')}</p>
                        )}
                      </div>

                      {/* Filing Date */}
                      <div className="space-y-2">
                        <Label htmlFor="filingDate" className="text-sm font-medium">
                          Actual Filing Date
                        </Label>
                        <Input
                          id="filingDate"
                          type="date"
                          value={formData.filingDate}
                          onChange={(e) => handleChange('filingDate', e.target.value)}
                          onBlur={() => handleBlur('filingDate')}
                          className={shouldShowError('filingDate') ? 'border-destructive' : ''}
                        />
                        {shouldShowError('filingDate') && (
                          <p className="text-xs text-destructive">{getError('filingDate')}</p>
                        )}
                      </div>

                      {/* Deposit Date (optional) */}
                      <div className="space-y-2">
                        <Label htmlFor="depositDate" className="text-sm font-medium">
                          Deposit Date (optional)
                        </Label>
                        <Input
                          id="depositDate"
                          type="date"
                          value={formData.depositDate}
                          onChange={(e) => handleChange('depositDate', e.target.value)}
                          onBlur={() => handleBlur('depositDate')}
                          className={shouldShowError('depositDate') ? 'border-destructive' : ''}
                        />
                        {shouldShowError('depositDate') && (
                          <p className="text-xs text-destructive">{getError('depositDate')}</p>
                        )}
                      </div>

                      {/* Interest Options */}
                      <div className="space-y-3 pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">Additional interest applies if:</p>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="depositedLate"
                            checked={formData.depositedLate}
                            onCheckedChange={(checked) => handleChange('depositedLate', checked === true)}
                          />
                          <Label htmlFor="depositedLate" className="font-normal text-sm cursor-pointer text-muted-foreground">
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

                      {/* Reset Button */}
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full"
                        onClick={handleReset}
                      >
                        Reset Form
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Preview + PaymentCTA */}
              <div className="sticky top-24 self-start space-y-3">
                {previewData ? (
                  <>
                    <TDSFeePreview data={previewData} maxHeight="55vh" />
                    <PaymentCTA
                      isFormComplete={isFormComplete && !!calculations}
                      price={PDF_PRICE}
                      documentType="tds-certificate"
                      isTestMode={isTestMode}
                      onPaymentSuccess={handleGenerateAndDownloadPDF}
                      onPaymentError={handlePaymentError}
                      completedSections={completedSectionsCount}
                      totalSections={totalSections}
                      paymentDescription={`TDS Late Filing Fee Summary - ${formData.deductionType}`}
                    />
                  </>
                ) : (
                  <Card className="border-dashed bg-muted/50">
                    <CardContent className="flex flex-col items-center justify-center h-full py-20">
                      <Shield className="h-10 w-10 text-muted-foreground/30 mb-3" />
                      <p className="text-sm text-muted-foreground">Enter details to see fee breakdown</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">Preview will appear here</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
