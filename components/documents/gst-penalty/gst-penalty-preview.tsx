/**
 * GST Penalty Preview Component
 * Renders exactly what will appear in the PDF
 * Used for both preview and PDF generation
 * 
 * Design convention:
 * - Outer card: NO rounded corners (document feel)
 * - Inner elements: rounded corners allowed
 */

"use client"

import { PreviewWrapper } from "../shared/preview-wrapper"

interface GSTPenaltyPreviewProps {
  data: {
    returnType: string
    taxAmount: number
    dueDate: string
    filingDate: string
    daysLate: number
    lateFee: number
    interest: number
    totalPenalty: number
    taxPaidLate: boolean
    isNilReturn?: boolean
    breakdown?: {
      cgstLateFee: number
      sgstLateFee: number
      dailyRate?: number
      maxCap?: number
    }
    legalReference?: {
      lateFeeSection: string
      interestSection: string
      notification: string
    }
  }
}

export function GSTPenaltyPreview({ data }: GSTPenaltyPreviewProps) {
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

  const getRiskLevel = () => {
    if (data.daysLate === 0) return { level: 'safe', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
    if (data.daysLate <= 15) return { level: 'warning', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
    return { level: 'critical', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
  }

  const risk = getRiskLevel()

  // Outer card: NO rounded corners (document feel)
  // Inner elements: rounded corners allowed
  const cardClass = "border border-slate-200 bg-white overflow-hidden rounded-none"

  return (
    <PreviewWrapper className={cardClass} previewId="gst-penalty-preview" dataTestId="gst-penalty-preview" pdfContentId="gst-penalty-pdf-content">
      {/* Header */}
      <div className="bg-slate-800 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">GST Penalty Summary</h2>
            <p className="text-slate-300 text-sm">Late Filing Calculation Report</p>
          </div>
          <div className="text-right">
            <p className="text-slate-300 text-xs">Generated on</p>
            <p className="text-sm font-medium">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        {/* Return Details */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Return Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-0.5">Return Type</p>
              <p className="font-semibold text-slate-900">{data.returnType}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-0.5">Tax Amount</p>
              <p className="font-semibold text-slate-900">{formatCurrency(data.taxAmount)}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-0.5">Due Date</p>
              <p className="font-semibold text-slate-900">{formatDate(data.dueDate)}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-0.5">Filing Date</p>
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

        {/* Penalty Breakdown */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Penalty Breakdown</h3>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <span className="text-sm text-slate-600">Days Late</span>
              <span className="font-semibold text-slate-900">{data.daysLate} days</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5 border-b border-slate-200">
              <div>
                <span className="text-sm text-slate-600">Late Filing Fee</span>
                {data.breakdown && data.daysLate > 0 && (
                  <p className="text-xs text-slate-400">
                    CGST: ₹{data.breakdown.cgstLateFee.toLocaleString('en-IN')} + SGST: ₹{data.breakdown.sgstLateFee.toLocaleString('en-IN')}
                  </p>
                )}
              </div>
              <span className="font-semibold text-slate-900">{formatCurrency(data.lateFee)}</span>
            </div>
            {data.taxPaidLate && (
              <div className="flex justify-between items-center px-4 py-2.5 border-b border-slate-200">
                <div>
                  <span className="text-sm text-slate-600">Interest (Section 50)</span>
                  <p className="text-xs text-slate-400">18% p.a. on ₹{data.taxAmount.toLocaleString('en-IN')}</p>
                </div>
                <span className="font-semibold text-slate-900">{formatCurrency(data.interest)}</span>
              </div>
            )}
            {!data.taxPaidLate && (
              <div className="flex justify-between items-center px-4 py-2.5 border-b border-slate-200">
                <span className="text-sm text-slate-600">Interest (18% p.a.)</span>
                <span className="font-semibold text-slate-500">N/A (Tax paid on time)</span>
              </div>
            )}
            <div className="flex justify-between items-center px-4 py-2.5 bg-slate-800 text-white">
              <span className="font-medium">Total Penalty</span>
              <span className="text-xl font-bold">{formatCurrency(data.totalPenalty)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-200">
          <p>• <strong>Late fee (Section 47):</strong> {data.isNilReturn || data.taxAmount === 0 ? '₹10/day CGST + ₹10/day SGST = ₹20/day (NIL return)' : '₹50/day CGST + ₹50/day SGST = ₹100/day'}</p>
          <p>• <strong>Maximum cap (Notification 19/2021):</strong> {data.isNilReturn || data.taxAmount === 0 ? '₹250 CGST + ₹250 SGST = ₹500' : '₹2,500 CGST + ₹2,500 SGST = ₹5,000'}</p>
          <p>• <strong>Interest (Section 50):</strong> 18% per annum on outstanding tax (if tax paid late)</p>
          <p>• <strong>Reference:</strong> CGST Act Section 47 (rate) + Notification 19/2021 (cap)</p>
          <p className="text-slate-400 italic">This is an estimate. Actual penalty may vary based on GST portal calculations.</p>
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

