'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowLeft, Download, CheckCircle, FlaskConical } from 'lucide-react';
import { usePayment } from '@/lib/hooks/use-payment';
import { TDSFeePreview, captureTDSFeePreviewHTML } from '@/components/documents/tds-fee/tds-fee-preview';

interface CalculationResult {
  daysLate: number;
  lateFee: number;
  riskLevel: 'safe' | 'warning' | 'critical';
  summary: string;
}

const PDF_PRICE = 199; // ₹199

// Check if test mode is enabled
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

export default function TDSCalculatorPage() {
  const [formData, setFormData] = useState({
    tdsSection: '194J',
    tdsAmount: '',
    dueDate: '',
    filingDate: '',
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { initiatePayment, loading: paymentLoading, error: paymentError } = usePayment();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setPaymentSuccess(false);
    setLoading(true);

    if (!formData.tdsAmount || !formData.dueDate || !formData.filingDate) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/tds/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tdsSection: formData.tdsSection,
          tdsAmount: parseFloat(formData.tdsAmount),
          dueDate: formData.dueDate,
          filingDate: formData.filingDate,
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
      const htmlContent = captureTDSFeePreviewHTML();

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          htmlContent,
          filename: `TDS-Fee-Summary-${formData.tdsSection}-${Date.now()}.pdf`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TDS-Fee-Summary-${formData.tdsSection}-${Date.now()}.pdf`;
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
      name: 'TDS Fee Summary',
      description: `TDS Late Filing Fee Summary - ${formData.tdsSection}`,
      onSuccess: (paymentId) => {
        console.log('Payment successful:', paymentId);
        setPaymentSuccess(true);
        downloadPDF();
      },
      onError: (error) => {
        console.error('Payment failed:', error);
      },
    });
  };

  // Preview data for the component
  const previewData = result ? {
    tdsSection: formData.tdsSection,
    tdsAmount: parseFloat(formData.tdsAmount),
    dueDate: formData.dueDate,
    filingDate: formData.filingDate,
    daysLate: result.daysLate,
    lateFee: result.lateFee,
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
                <CardDescription>Enter your TDS return information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* TDS Section */}
                  <div className="space-y-2">
                    <Label htmlFor="tdsSection" className="text-sm font-medium text-slate-700">
                      TDS Section
                    </Label>
                    <Select value={formData.tdsSection} onValueChange={(val) => handleInputChange('tdsSection', val)}>
                      <SelectTrigger id="tdsSection" className="border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="194J">194J - Commission/Brokerage</SelectItem>
                        <SelectItem value="194O">194O - E-commerce Seller</SelectItem>
                        <SelectItem value="195">195 - Non-resident Income</SelectItem>
                        <SelectItem value="other">Other Sections</SelectItem>
                      </SelectContent>
                    </Select>
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
                      min="0"
                      step="0.01"
                      value={formData.tdsAmount}
                      onChange={(e) => handleInputChange('tdsAmount', e.target.value)}
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
                      Actual Filing Date
                    </Label>
                    <Input
                      id="filingDate"
                      type="date"
                      value={formData.filingDate}
                      onChange={(e) => handleInputChange('filingDate', e.target.value)}
                      className="border-slate-300"
                    />
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
                      'Calculate Fee'
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
                  <TDSFeePreview data={previewData} />

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
                              : `Download Fee Summary (₹${PDF_PRICE})`
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
                            tdsSection: '194J',
                            tdsAmount: '',
                            dueDate: '',
                            filingDate: '',
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
              <CardTitle className="text-sm font-medium text-slate-900">How is the fee calculated?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 space-y-2">
              <p>
                <strong>Late Fee u/s 234E:</strong> ₹200 per day from the due date (maximum ₹5,000)
              </p>
              <p className="text-xs text-slate-500 pt-2">
                Based on Income Tax Act Section 234E. Consult a CA for official advice.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
