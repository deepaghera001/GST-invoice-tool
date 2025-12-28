'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface CalculationResult {
  daysLate: number;
  lateFee: number;
  interest: number;
  totalPenalty: number;
  riskLevel: 'safe' | 'warning' | 'critical';
  summary: string;
}

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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    // Validate
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            GST Penalty Calculator
          </h1>
          <p className="text-lg text-slate-600">
            Know your penalty instantly. Avoid surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Calculate Your Penalty</CardTitle>
              <CardDescription>
                Fill in your return details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Return Type */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Return Type</Label>
                  <RadioGroup value={formData.returnType} onValueChange={(val) => handleInputChange('returnType', val)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="GSTR1" id="gstr1" />
                      <Label htmlFor="gstr1" className="font-normal cursor-pointer">GSTR-1 (Monthly)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="GSTR3B" id="gstr3b" />
                      <Label htmlFor="gstr3b" className="font-normal cursor-pointer">GSTR-3B (Quarterly)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Tax Amount */}
                <div className="space-y-2">
                  <Label htmlFor="taxAmount" className="text-base font-semibold">
                    Tax Amount (₹) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="taxAmount"
                    type="number"
                    placeholder="e.g., 50000"
                    min="0"
                    step="0.01"
                    value={formData.taxAmount}
                    onChange={(e) => handleInputChange('taxAmount', e.target.value)}
                    className="text-base"
                  />
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="text-base font-semibold">
                    Due Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="text-base"
                  />
                </div>

                {/* Filing Date */}
                <div className="space-y-2">
                  <Label htmlFor="filingDate" className="text-base font-semibold">
                    Filing Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="filingDate"
                    type="date"
                    value={formData.filingDate}
                    onChange={(e) => handleInputChange('filingDate', e.target.value)}
                    className="text-base"
                  />
                </div>

                {/* Tax Paid Late */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="taxPaidLate"
                    checked={formData.taxPaidLate}
                    onCheckedChange={(checked) => handleInputChange('taxPaidLate', checked === true)}
                  />
                  <Label htmlFor="taxPaidLate" className="font-normal cursor-pointer">
                    Tax was also paid late
                  </Label>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full text-base py-2 h-auto"
                >
                  {loading ? (
                    <>
                      <Spinner className="mr-2" />
                      Calculating...
                    </>
                  ) : (
                    'Calculate Penalty'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Card */}
          <div>
            {result ? (
              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {result.riskLevel === 'safe' ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : result.riskLevel === 'warning' ? (
                      <AlertCircle className="h-6 w-6 text-yellow-600" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    )}
                    <CardTitle>Your Penalty Breakdown</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status Alert */}
                  {result.riskLevel === 'safe' && (
                    <Alert className="bg-green-50 border-green-200">
                      <AlertDescription className="text-green-800">
                        ✓ {result.summary}
                      </AlertDescription>
                    </Alert>
                  )}
                  {result.riskLevel === 'warning' && (
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertDescription className="text-yellow-800">
                        ⚠ {result.summary}
                      </AlertDescription>
                    </Alert>
                  )}
                  {result.riskLevel === 'critical' && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertDescription className="text-red-800">
                        🔴 {result.summary}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Details */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Days Late:</span>
                      <span className="font-semibold">{result.daysLate} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Late Fee:</span>
                      <span className="font-semibold">₹{result.lateFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Interest Penalty:</span>
                      <span className="font-semibold">₹{result.interest.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
                    <div className="text-sm text-slate-600 mb-1">Total Penalty</div>
                    <div className="text-3xl font-bold text-red-600">
                      ₹{result.totalPenalty.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white">
                    📄 Download Penalty PDF (₹199)
                  </Button>

                  {/* Calculate Again */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setResult(null);
                      setFormData({
                        returnType: 'GSTR1',
                        taxAmount: '',
                        dueDate: '',
                        filingDate: '',
                        taxPaidLate: false,
                      });
                    }}
                  >
                    Calculate Another Return
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-dashed border-slate-300 bg-slate-50">
                <CardContent className="flex items-center justify-center h-full py-16">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-slate-600">Fill the form to see your penalty breakdown</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">How is penalty calculated?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2">
            <p>
              <strong>Late Fee:</strong> ₹100 per day for filings after 30 days of due date (max ₹5,000)
            </p>
            <p>
              <strong>Interest:</strong> 18% per annum on tax amount if both return and tax payment are late
            </p>
            <p className="text-xs text-slate-500 pt-2">
              Based on GST Act Section 47 & 48
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
