/**
 * TDS Fee Preview Component
 * Renders exactly what will appear in the PDF
 * Used for both preview and PDF generation
 * 
 * Design convention:
 * - Outer card: NO rounded corners (document feel)
 * - Inner elements: rounded corners allowed
 */

"use client"

import { PreviewWrapper } from "../shared/preview-wrapper"

interface TDSFeePreviewProps {
  data: {
    tdsSection: string
    tdsAmount: number
    dueDate: string
    filingDate: string
    daysLate: number
    lateFee: number
    interestOnLateDeduction?: number
    interestOnLatePayment?: number
    totalPenalty: number
  }
}

export function TDSFeePreview({ data }: TDSFeePreviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getSectionName = (section: string) => {
    const sections: Record<string, string> = {
      '194C': '194C - Contractor Payments',
      '194H': '194H - Commission/Brokerage',
      '194I': '194I - Rent',
      '194J': '194J - Professional/Technical Fees',
      '194O': '194O - E-commerce Seller',
      '195': '195 - Non-resident Payments',
      'other': 'Other TDS Sections',
    }
    return sections[section] || section
  }

  const getRiskLevel = () => {
    if (data.daysLate === 0) return { level: 'safe', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
    if (data.daysLate <= 7) return { level: 'warning', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
    return { level: 'critical', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
  }

  const risk = getRiskLevel()

  return (
    <PreviewWrapper className="border border-slate-200 bg-white overflow-hidden rounded-none" previewId="tds-fee-preview" dataTestId="tds-fee-preview" pdfContentId="tds-fee-pdf-content">
      {/* Header */}
      <div className="bg-blue-800 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">TDS Late Filing Fee Summary</h2>
            <p className="text-blue-200 text-sm">Section 234E Calculation Report</p>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-xs">Generated on</p>
            <p className="text-sm font-medium">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* TDS Details */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">TDS Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg col-span-2">
              <p className="text-xs text-slate-500 mb-1">TDS Section</p>
              <p className="font-semibold text-slate-900">{getSectionName(data.tdsSection)}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">TDS Amount</p>
              <p className="font-semibold text-slate-900">{formatCurrency(data.tdsAmount)}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Due Date</p>
              <p className="font-semibold text-slate-900">{formatDate(data.dueDate)}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg col-span-2">
              <p className="text-xs text-slate-500 mb-1">Actual Filing Date</p>
              <p className="font-semibold text-slate-900">{formatDate(data.filingDate)}</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className={`p-4 rounded-lg ${risk.bg} border ${risk.border}`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${risk.level === 'safe' ? 'bg-green-500' : risk.level === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} />
            <p className={`text-sm font-medium ${risk.color}`}>
              {data.daysLate === 0 
                ? 'Filed on time - No penalty applicable'
                : `Filed ${data.daysLate} days late`}
            </p>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Fee Breakdown</h3>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 bg-slate-50 border-b border-slate-200">
              <span className="text-sm text-slate-600">Days Late</span>
              <span className="font-semibold text-slate-900">{data.daysLate} days</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200">
              <div>
                <span className="text-sm text-slate-600">Late Fee (Section 234E)</span>
                <p className="text-xs text-slate-400">₹200/day, max = TDS amount</p>
              </div>
              <span className="font-semibold text-slate-900">{formatCurrency(data.lateFee)}</span>
            </div>
            {(data.interestOnLateDeduction ?? 0) > 0 && (
              <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200">
                <div>
                  <span className="text-sm text-slate-600">Interest - Late Deduction</span>
                  <p className="text-xs text-slate-400">Section 201(1A) @ 1% per month</p>
                </div>
                <span className="font-semibold text-slate-900">{formatCurrency(data.interestOnLateDeduction ?? 0)}</span>
              </div>
            )}
            {(data.interestOnLatePayment ?? 0) > 0 && (
              <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200">
                <div>
                  <span className="text-sm text-slate-600">Interest - Late Payment</span>
                  <p className="text-xs text-slate-400">Section 201(1A) @ 1.5% per month</p>
                </div>
                <span className="font-semibold text-slate-900">{formatCurrency(data.interestOnLatePayment ?? 0)}</span>
              </div>
            )}
            <div className="flex justify-between items-center px-4 py-3 bg-blue-800 text-white">
              <span className="font-medium">Total Penalty</span>
              <span className="text-xl font-bold">{formatCurrency(data.totalPenalty)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-200">
          <p>• <strong>Late Fee (Section 234E):</strong> ₹200/day, max = TDS amount deducted</p>
          <p>• <strong>Interest on late deduction (Section 201(1A)):</strong> 1% per month or part thereof</p>
          <p>• <strong>Interest on late payment (Section 201(1A)):</strong> 1.5% per month or part thereof</p>
          <p>• This is an estimate. Actual fee may vary based on IT department calculations.</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-400">ComplianceKit • For estimation purposes only</p>
          <p className="text-xs text-slate-400">www.compliancekit.in</p>
        </div>
      </div>
    </PreviewWrapper>
  )
}

/**
 * Captures the TDS Fee Preview HTML for PDF generation
 * Uses the same approach as invoice for consistent PDF output
 */
export function captureTDSFeePreviewHTML(): string {
  const previewElement = document.getElementById('tds-fee-pdf-content')
  if (!previewElement) {
    throw new Error('TDS Fee PDF content element not found')
  }

  // Clone the element to avoid modifying the original
  const clonedElement = previewElement.cloneNode(true) as HTMLElement

  // Get computed styles
  const styles = Array.from(document.styleSheets)
    .map(styleSheet => {
      try {
        return Array.from(styleSheet.cssRules || [])
          .map(rule => rule.cssText)
          .join('\n')
      } catch {
        return ''
      }
    })
    .join('\n')

  // Build full HTML document with PDF-optimized styles (matching invoice)
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TDS Late Fee Summary</title>
      <style>
        ${styles}
        @page {
          size: A4;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background-color: white;
        }
        /* PDF Reset: Ensures content fills page and removes UI-only styling */
        body > * {
          border: none !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          position: static !important;
        }
        .sticky {
          position: static !important;
        }
      </style>
    </head>
    <body>
      ${clonedElement.outerHTML}
    </body>
    </html>
  `
}
