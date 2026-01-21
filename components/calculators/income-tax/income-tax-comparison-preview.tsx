"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, TrendingDown, TrendingUp, AlertCircle, ExternalLink } from 'lucide-react';
import { formatCurrency, formatIndianNumber, type ComparisonResult } from '@/lib/utils/tax-calculations';

interface IncomeTaxComparisonPreviewProps {
  comparisonResult: ComparisonResult;
}

export function IncomeTaxComparisonPreview({ comparisonResult }: IncomeTaxComparisonPreviewProps) {
  const { oldRegime, newRegime, recommendation, savings, savingsPercentage } = comparisonResult;

  const getBetterRegime = () => {
    if (recommendation === 'old') return 'Old Regime';
    if (recommendation === 'new') return 'New Regime';
    return 'Both Equal';
  };

  const getRecommendationIcon = () => {
    if (recommendation === 'equal') return <AlertCircle className="h-5 w-5" />;
    return <CheckCircle2 className="h-5 w-5" />;
  };

  const getRecommendationColor = () => {
    if (recommendation === 'old') return 'bg-blue-500';
    if (recommendation === 'new') return 'bg-green-500';
    return 'bg-gray-500';
  };

  return (
    <div id="income-tax-comparison-preview" className="space-y-6">
      {/* Recommendation Banner */}
      <Alert className={`${getRecommendationColor()} text-white border-none`}>
        <div className="flex items-center gap-2">
          {getRecommendationIcon()}
          <AlertDescription className="text-white">
            {recommendation === 'equal' ? (
              <span className="font-semibold">Both regimes result in the same tax liability</span>
            ) : (
              <>
                <span className="font-semibold">{getBetterRegime()} is better</span> — You save{' '}
                <span className="font-bold">{formatCurrency(savings)}</span> ({savingsPercentage.toFixed(2)}% of gross income)
              </>
            )}
          </AlertDescription>
        </div>
      </Alert>

      {/* Side-by-Side Comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Old Regime Card */}
        <Card className={recommendation === 'old' ? 'ring-2 ring-blue-500' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Old Tax Regime</CardTitle>
              {recommendation === 'old' && (
                <Badge className="bg-blue-500">Recommended</Badge>
              )}
            </div>
            <CardDescription>Traditional regime with deductions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ComparisonRow label="Gross Income" value={formatCurrency(oldRegime.grossIncome)} />
            <ComparisonRow 
              label="Deductions Claimed" 
              value={formatCurrency(oldRegime.deductions)} 
              highlighted
            />
            <ComparisonRow label="Taxable Income" value={formatCurrency(oldRegime.taxableIncome)} />
            <div className="border-t pt-2 mt-2">
              <ComparisonRow label="Tax Before Rebate" value={formatCurrency(oldRegime.taxBeforeRebate)} />
              {oldRegime.rebate > 0 && (
                <ComparisonRow 
                  label="Rebate (Sec 87A)" 
                  value={`-${formatCurrency(oldRegime.rebate)}`} 
                  className="text-green-600"
                />
              )}
              <ComparisonRow label="Tax After Rebate" value={formatCurrency(oldRegime.taxAfterRebate)} />
              <ComparisonRow label="Cess (4%)" value={formatCurrency(oldRegime.cess)} />
            </div>
            <div className="border-t pt-2 mt-2">
              <ComparisonRow 
                label="Total Tax Payable" 
                value={formatCurrency(oldRegime.totalTax)} 
                bold
                className="text-lg"
              />
              <ComparisonRow 
                label="Effective Tax Rate" 
                value={`${oldRegime.effectiveRate.toFixed(2)}%`} 
                className="text-sm text-muted-foreground"
              />
            </div>
          </CardContent>
        </Card>

        {/* New Regime Card */}
        <Card className={recommendation === 'new' ? 'ring-2 ring-green-500' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">New Tax Regime</CardTitle>
              {recommendation === 'new' && (
                <Badge className="bg-green-500">Recommended</Badge>
              )}
            </div>
            <CardDescription>Simplified regime (default)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ComparisonRow label="Gross Income" value={formatCurrency(newRegime.grossIncome)} />
            <ComparisonRow 
              label="Deductions Allowed" 
              value={formatCurrency(newRegime.deductions)} 
              highlighted
            />
            <ComparisonRow label="Taxable Income" value={formatCurrency(newRegime.taxableIncome)} />
            <div className="border-t pt-2 mt-2">
              <ComparisonRow label="Tax Before Rebate" value={formatCurrency(newRegime.taxBeforeRebate)} />
              {newRegime.rebate > 0 && (
                <ComparisonRow 
                  label="Rebate (Sec 87A)" 
                  value={`-${formatCurrency(newRegime.rebate)}`} 
                  className="text-green-600"
                />
              )}
              <ComparisonRow label="Tax After Rebate" value={formatCurrency(newRegime.taxAfterRebate)} />
              <ComparisonRow label="Cess (4%)" value={formatCurrency(newRegime.cess)} />
            </div>
            <div className="border-t pt-2 mt-2">
              <ComparisonRow 
                label="Total Tax Payable" 
                value={formatCurrency(newRegime.totalTax)} 
                bold
                className="text-lg"
              />
              <ComparisonRow 
                label="Effective Tax Rate" 
                value={`${newRegime.effectiveRate.toFixed(2)}%`} 
                className="text-sm text-muted-foreground"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tax Breakdown Details */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Old Regime - Slab Wise Tax</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {oldRegime.breakdown.length > 0 ? (
                oldRegime.breakdown.map((slab, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatIndianNumber(slab.slabStart)} - {slab.slabEnd === Infinity ? '∞' : formatIndianNumber(slab.slabEnd)} @ {(slab.rate * 100).toFixed(0)}%
                    </span>
                    <span className="font-medium">{formatCurrency(slab.taxInSlab)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No tax applicable</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Regime - Slab Wise Tax</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {newRegime.breakdown.length > 0 ? (
                newRegime.breakdown.map((slab, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatIndianNumber(slab.slabStart)} - {slab.slabEnd === Infinity ? '∞' : formatIndianNumber(slab.slabEnd)} @ {(slab.rate * 100).toFixed(0)}%
                    </span>
                    <span className="font-medium">{formatCurrency(slab.taxInSlab)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No tax applicable</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>Disclaimer:</strong> This calculator provides indicative results only for FY 2024-25 (AY 2025-26). 
          Tax calculations may vary based on individual circumstances. Please verify against the latest Finance Act 
          or CBDT Circular and consult a qualified tax expert for official computation.{' '}
          <a 
            href="https://www.incometax.gov.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Visit Income Tax India <ExternalLink className="h-3 w-3" />
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
}

interface ComparisonRowProps {
  label: string;
  value: string;
  bold?: boolean;
  highlighted?: boolean;
  className?: string;
}

function ComparisonRow({ label, value, bold, highlighted, className = '' }: ComparisonRowProps) {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      <span className={`${bold ? 'font-semibold' : ''} ${highlighted ? 'text-primary' : 'text-muted-foreground'}`}>
        {label}
      </span>
      <span className={bold ? 'font-bold' : 'font-medium'}>{value}</span>
    </div>
  );
}
