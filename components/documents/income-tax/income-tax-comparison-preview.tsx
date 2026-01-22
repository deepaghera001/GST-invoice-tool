/**
 * Income Tax Comparison Preview Component
 * Renders exactly what will appear in the PDF
 * Used for both preview and PDF generation
 * With built-in field highlighting and auto-scroll
 * 
 * FY 2024-25 (AY 2025-26)
 */

"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { PreviewWrapper } from "../shared/preview-wrapper"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, ExternalLink, Calculator } from "lucide-react"
import { formatCurrency, formatIndianNumber, type ComparisonResult } from "@/lib/income-tax/calculator"

// Highlight duration in milliseconds
const HIGHLIGHT_DURATION = 2500

interface IncomeTaxComparisonPreviewProps {
  data: ComparisonResult
  maxHeight?: string
}

export function IncomeTaxComparisonPreview({ data, maxHeight }: IncomeTaxComparisonPreviewProps) {
  const { oldRegime, newRegime, recommendation, savings, savingsPercentage } = data

  // ===== SIMPLE HIGHLIGHTING LOGIC =====
  const prevDataRef = useRef(data)
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set())
  const fieldRefs = useRef<Map<string, HTMLElement | null>>(new Map())
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  useEffect(() => {
    const prev = prevDataRef.current
    const changed: string[] = []

    // Check each field for changes
    if (prev.oldRegime.grossIncome !== data.oldRegime.grossIncome) changed.push('grossIncome')
    if (prev.oldRegime.deductions !== data.oldRegime.deductions) changed.push('deductions')
    if (prev.oldRegime.totalTax !== data.oldRegime.totalTax) changed.push('totalTax')
    if (prev.recommendation !== data.recommendation) changed.push('recommendation')

    if (changed.length > 0) {
      setHighlighted(prev => {
        const next = new Set(prev)
        changed.forEach(f => next.add(f))
        return next
      })

      // Auto-scroll within preview container
      setTimeout(() => {
        const firstRef = fieldRefs.current.get(changed[0])
        const scrollContainer = document.getElementById('income-tax-comparison-preview')
        if (firstRef && scrollContainer) {
          const containerRect = scrollContainer.getBoundingClientRect()
          const elementRect = firstRef.getBoundingClientRect()
          const scrollTop = scrollContainer.scrollTop + (elementRect.top - containerRect.top) - (containerRect.height / 2)
          scrollContainer.scrollTo({ top: scrollTop, behavior: 'smooth' })
        }
      }, 50)

      // Clear highlights after duration
      changed.forEach(field => {
        const existing = timeoutsRef.current.get(field)
        if (existing) clearTimeout(existing)
        const timeout = setTimeout(() => {
          setHighlighted(prev => {
            const next = new Set(prev)
            next.delete(field)
            return next
          })
        }, HIGHLIGHT_DURATION)
        timeoutsRef.current.set(field, timeout)
      })
    }

    prevDataRef.current = { ...data }
  }, [data])

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(t => clearTimeout(t))
    }
  }, [])

  const hl = useCallback((field: string) => {
    return highlighted.has(field) 
      ? 'pdf-field-highlight' 
      : ''
  }, [highlighted])

  const setRef = useCallback((field: string) => (el: HTMLElement | null) => {
    fieldRefs.current.set(field, el)
  }, [])
  // ===== END HIGHLIGHTING LOGIC =====

  const getBetterRegime = () => {
    if (recommendation === 'old') return 'Old Regime'
    if (recommendation === 'new') return 'New Regime'
    return 'Both Equal'
  }

  const getRecommendationColor = () => {
    if (recommendation === 'old') return 'bg-blue-500'
    if (recommendation === 'new') return 'bg-green-500'
    return 'bg-gray-500'
  }

  // PDF-ready card styling (no rounded corners for document feel)
  const outerCardClass = "border border-slate-200 bg-white overflow-hidden rounded-none"

  return (
    <PreviewWrapper 
      className={outerCardClass}
      title="Income Tax Comparison"
      icon={<Calculator className="h-5 w-5" />}
      previewId="income-tax-comparison-preview" 
      dataTestId="income-tax-comparison-preview" 
      pdfContentId="income-tax-pdf-content" 
      maxHeight={maxHeight}
    >
      {/* Header */}
      <div className="bg-slate-800 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Income Tax Comparison</h2>
            <p className="text-slate-300 text-sm">FY 2024-25 (AY 2025-26)</p>
          </div>
          <div className="text-right">
            <p className="text-slate-300 text-xs">Generated on</p>
            <p className="text-sm font-medium">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5 pdf-document-content">{/* Recommendation Banner */}
        <div className={`${getRecommendationColor()} text-white border-none rounded-lg p-4`} ref={setRef('recommendation')}>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <div className={`text-sm ${hl('recommendation')}`}>
              {recommendation === 'equal' ? (
                <span className="font-semibold">Both regimes result in the same tax liability</span>
              ) : (
                <span>
                  <span className="font-semibold">{getBetterRegime()} is better</span>
                  {' — '}
                  You save <span className="font-bold">{formatCurrency(savings)}</span> ({savingsPercentage.toFixed(2)}% of gross income)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Old Regime Card */}
          <Card className={recommendation === 'old' ? 'ring-2 ring-blue-500' : 'border-slate-200'}>
            <div className="p-4 border-b bg-slate-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Old Tax Regime</h3>
                {recommendation === 'old' && (
                  <Badge className="bg-blue-500">Recommended</Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">Traditional regime with deductions</p>
            </div>
            <div className="p-4 space-y-3">
              <ComparisonRow label="Gross Income" value={formatCurrency(oldRegime.grossIncome)} className={hl('grossIncome')} />
              <ComparisonRow 
                label="Deductions Claimed" 
                value={formatCurrency(oldRegime.deductions)} 
                highlighted
                className={hl('deductions')}
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
              <div className="border-t pt-2 mt-2" ref={setRef('totalTax')}>
                <ComparisonRow 
                  label="Total Tax Payable" 
                  value={formatCurrency(oldRegime.totalTax)} 
                  bold
                  className={`text-lg ${hl('totalTax')}`}
                />
                <ComparisonRow 
                  label="Effective Tax Rate" 
                  value={`${oldRegime.effectiveRate.toFixed(2)}%`} 
                  className="text-sm text-slate-500"
                />
              </div>
            </div>
          </Card>

          {/* New Regime Card */}
          <Card className={recommendation === 'new' ? 'ring-2 ring-green-500' : 'border-slate-200'}>
            <div className="p-4 border-b bg-slate-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">New Tax Regime</h3>
                {recommendation === 'new' && (
                  <Badge className="bg-green-500">Recommended</Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">Simplified regime (default)</p>
            </div>
            <div className="p-4 space-y-3">
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
                  className="text-sm text-slate-500"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Tax Breakdown Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-slate-200">
            <div className="p-4 border-b bg-slate-50">
              <h4 className="text-sm font-semibold text-slate-900">Old Regime - Slab Wise Tax</h4>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {oldRegime.breakdown.length > 0 ? (
                  oldRegime.breakdown.map((slab, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        {formatIndianNumber(slab.slabStart)} - {slab.slabEnd === Infinity ? '∞' : formatIndianNumber(slab.slabEnd)} @ {(slab.rate * 100).toFixed(0)}%
                      </span>
                      <span className="font-medium text-slate-900">{formatCurrency(slab.taxInSlab)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No tax applicable</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="border-slate-200">
            <div className="p-4 border-b bg-slate-50">
              <h4 className="text-sm font-semibold text-slate-900">New Regime - Slab Wise Tax</h4>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {newRegime.breakdown.length > 0 ? (
                  newRegime.breakdown.map((slab, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        {formatIndianNumber(slab.slabStart)} - {slab.slabEnd === Infinity ? '∞' : formatIndianNumber(slab.slabEnd)} @ {(slab.rate * 100).toFixed(0)}%
                      </span>
                      <span className="font-medium text-slate-900">{formatCurrency(slab.taxInSlab)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No tax applicable</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Disclaimer */}
        <Alert className="border-slate-200 bg-slate-50">
          <AlertCircle className="h-4 w-4 text-slate-600" />
          <AlertDescription className="text-xs text-slate-600">
            <strong>Disclaimer:</strong> Workngin is not affiliated with the Income Tax Department. 
            This calculator provides indicative results only for FY 2024-25 (AY 2025-26). 
            Tax calculations may vary based on individual circumstances. Please verify against the latest Finance Act 
            or CBDT Circular and consult a qualified tax expert for official computation.{' '}
            <a 
              href="https://www.incometax.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:underline"
            >
              Visit Income Tax India <ExternalLink className="h-3 w-3" />
            </a>
          </AlertDescription>
        </Alert>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-400">Workngin • For estimation purposes only</p>
          <p className="text-xs text-slate-400">workngin.com</p>
        </div>
      </div> {/* End pdf-document-content */}
    </PreviewWrapper>
  )
}

interface ComparisonRowProps {
  label: string
  value: string
  bold?: boolean
  highlighted?: boolean
  className?: string
}

function ComparisonRow({ label, value, bold, highlighted, className = '' }: ComparisonRowProps) {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      <span className={`${bold ? 'font-semibold' : ''} ${highlighted ? 'text-blue-600' : 'text-slate-600'}`}>
        {label}
      </span>
      <span className={`${bold ? 'font-bold text-slate-900' : 'font-medium text-slate-900'}`}>{value}</span>
    </div>
  )
}
