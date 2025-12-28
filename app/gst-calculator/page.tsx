'use client';

import { useState } from 'react';
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
import { GSTPenaltyPreview, captureGSTPenaltyPreviewHTML } from '@/components/documents/gst-penalty/gst-penalty-preview';

interface CalculationResult {
  daysLate: number;
  lateFee: number;
  interest: number;
  totalPenalty: number;
  riskLevel: 'safe' | 'warning' | 'critical';
  summary: string;
}

const PDF_PRICE = 199; // ₹199

// Check if test mode is enabled
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

export default function GSTCalculatorPage() {
  const [formData, setFormData] = useState({
    returnType: 'GSTR1',
    taxAmount: '',
    dueDate: '',
    filingDate: '',
    taxPaidLate: false,
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { initiatePayment, loading: paymentLoading, error: paymentError } = usePayment();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setPaymentSuccess(false);
    setLoading(true);

    if (!formData.taxAmount || !formData.dueDate || !formData.filingDate) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/gst/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          returnType: formData.returnType,
          taxAmount: parseFloat(formData.taxAmount),
          dueDate: formData.dueDate,
          filingDate: formData.filingDate,
          taxPaidLate: formData.taxPaidLate,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Calculation failed');
      }

      const data: CalculationResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!result) return;

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
      setError(err instanceof Error ? err.message : 'Failed to download PDF');
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

  // Preview data for the component
  const previewData = result ? {
    returnType: formData.returnType,
    taxAmount: parseFloat(formData.taxAmount),
    dueDate: formData.dueDate,
    filingDate: formData.filingDate,
    daysLate: result.daysLate,
    lateFee: result.lateFee,
    interest: result.interest,
    totalPenalty: result.totalPenalty,
    taxPaidLate: formData.taxPaidLate,
  } : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-slate-800 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-900">ComplianceKit</span>
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
              Based on current GST rules. For estimation purposes.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Form Card */}
            <Card className="border-slate-200 bg-white h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium">Return Details</CardTitle>
                <CardDescription>Enter your GST return information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Return Type */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Return Type</Label>
                    <RadioGroup value={formData.returnType} onValueChange={(val) => handleInputChange('returnType', val)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="GSTR1" id="gstr1" />
                        <Label htmlFor="gstr1" className="font-normal text-sm cursor-pointer">GSTR-1 (Monthly)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="GSTR3B" id="gstr3b" />
                        <Label htmlFor="gstr3b" className="font-normal text-sm cursor-pointer">GSTR-3B (Quarterly)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Tax Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="taxAmount" className="text-sm font-medium text-slate-700">
                      Tax Amount (₹)
                    </Label>
                    <Input
                      id="taxAmount"
                      type="number"
                      placeholder="50000"
                      min="0"
                      step="0.01"
                      value={formData.taxAmount}
                      onChange={(e) => handleInputChange('taxAmount', e.target.value)}
                      className="border-slate-300"
                    />
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
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="border-slate-300"
                    />
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
                      onChange={(e) => handleInputChange('filingDate', e.target.value)}
                      className="border-slate-300"
                    />
                  </div>

                  {/* Tax Paid Late */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="taxPaidLate"
                      checked={formData.taxPaidLate}
                      onCheckedChange={(checked) => handleInputChange('taxPaidLate', checked === true)}
                    />
                    <Label htmlFor="taxPaidLate" className="font-normal text-sm cursor-pointer text-slate-600">
                      Tax was also paid late (interest applies)
                    </Label>
                  </div>

                  {/* Error */}
                  {error && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription className="text-sm">{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-800 hover:bg-slate-900"
                  >
                    {loading ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Calculating...
                      </>
                    ) : (
                      'Calculate Penalty'
                    )}
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
                        onClick={() => {
                          setResult(null);
                          setPaymentSuccess(false);
                          setFormData({
                            returnType: 'GSTR1',
                            taxAmount: '',
                            dueDate: '',
                            filingDate: '',
                            taxPaidLate: false,
                          });
                        }}
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
              <CardTitle className="text-sm font-medium text-slate-900">How is penalty calculated?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 space-y-2">
              <p>
                <strong>Late Fee:</strong> ₹100 per day for filings after 30 days of due date (max ₹5,000)
              </p>
              <p>
                <strong>Interest:</strong> 18% per annum on tax amount if both return and tax payment are late
              </p>
              <p className="text-xs text-slate-500 pt-2">
                Based on GST Act Section 47 & 48. Consult a CA for official advice.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
