'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface CalculationResult {
  daysLate: number;
  lateFee: number;
  riskLevel: 'safe' | 'warning' | 'critical';
  summary: string;
}

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    // Validate
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            TDS Late Filing Fee Calculator
          </h1>
          <p className="text-lg text-slate-600">
            Check your TDS penalty instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Calculate TDS Fee</CardTitle>
              <CardDescription>
                Enter your TDS filing details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* TDS Section */}
                <div className="space-y-2">
                  <Label htmlFor="tdsSection" className="text-base font-semibold">
                    TDS Section <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.tdsSection} onValueChange={(val) => handleInputChange('tdsSection', val)}>
                    <SelectTrigger id="tdsSection">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="194J">194J (Commission/Brokerage)</SelectItem>
                      <SelectItem value="194O">194O (E-commerce Seller)</SelectItem>
                      <SelectItem value="195">195 (Non-resident Income)</SelectItem>
                      <SelectItem value="other">Other Sections</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* TDS Amount */}
                <div className="space-y-2">
                  <Label htmlFor="tdsAmount" className="text-base font-semibold">
                    TDS Amount (₹) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="tdsAmount"
                    type="number"
                    placeholder="e.g., 50000"
                    min="0"
                    step="0.01"
                    value={formData.tdsAmount}
                    onChange={(e) => handleInputChange('tdsAmount', e.target.value)}
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
                    'Calculate Fee'
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
                    <CardTitle>Your TDS Fee</CardTitle>
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
                  </div>

                  {/* Total Fee */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                    <div className="text-sm text-slate-600 mb-1">Late Filing Fee</div>
                    <div className="text-3xl font-bold text-orange-600">
                      ₹{result.lateFee.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white">
                    📄 Download TDS Fee Summary (₹199)
                  </Button>

                  {/* Calculate Again */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setResult(null);
                      setFormData({
                        tdsSection: '194J',
                        tdsAmount: '',
                        dueDate: '',
                        filingDate: '',
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
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-slate-600">Fill the form to see your TDS fee</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">How is TDS fee calculated?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2">
            <p>
              <strong>Late Fee:</strong> ₹200 per day for late filings (max ₹5,000)
            </p>
            <p className="text-xs text-slate-500 pt-2">
              Based on Income Tax Act Section 206(3)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
