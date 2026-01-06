/**
 * Influencer Contract Preview Component
 * With built-in field highlighting and auto-scroll
 * 
 * Simple approach: All highlighting logic is self-contained in this component.
 * No external hooks needed - just pass formData and it handles everything.
 * 
 * PDF Structure:
 * - Page 1: Title, Parties, Campaign, Timeline
 * - Page 2: Payment Terms (highlighted), Usage Rights (highlighted)
 * - Page 3: Legal clauses, Termination, Jurisdiction, Disclaimer, Signature Block
 */

"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import type { InfluencerContractFormData } from "@/lib/influencer-contract"
import type { InfluencerContractCalculations } from "@/lib/influencer-contract"
import { CONTRACT_CLAUSES, PAYMENT_MODE_OPTIONS } from "@/lib/influencer-contract"
import { PreviewWrapper } from "../shared/preview-wrapper"
import { FileText } from "lucide-react"

interface InfluencerContractPreviewProps {
  formData: InfluencerContractFormData
  calculations: InfluencerContractCalculations
  /** Optional max height for preview (e.g. '55vh') */
  maxHeight?: string
}

// Highlight duration in milliseconds
const HIGHLIGHT_DURATION = 2500

/**
 * Deep compare two values (handles nested objects and arrays)
 */
function hasChanged(prev: any, curr: any): boolean {
  if (prev === curr) return false
  if (typeof prev !== typeof curr) return true
  if (Array.isArray(prev) && Array.isArray(curr)) {
    if (prev.length !== curr.length) return true
    return prev.some((v, i) => hasChanged(v, curr[i]))
  }
  if (typeof prev === 'object' && prev !== null && curr !== null) {
    const keys = new Set([...Object.keys(prev), ...Object.keys(curr)])
    for (const key of keys) {
      if (hasChanged(prev[key], curr[key])) return true
    }
    return false
  }
  return prev !== curr
}

export function InfluencerContractPreview({
  formData,
  calculations,
  maxHeight,
}: InfluencerContractPreviewProps) {
  
  // ===== SIMPLE HIGHLIGHTING LOGIC =====
  const prevFormDataRef = useRef(formData)
  const prevCalculationsRef = useRef(calculations)
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set())
  const fieldRefs = useRef<Map<string, HTMLElement | null>>(new Map())
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Fields to track for changes
  useEffect(() => {
    const prev = prevFormDataRef.current
    const prevCalc = prevCalculationsRef.current
    const changed: string[] = []

    // Parties
    if (prev.parties.influencerName !== formData.parties.influencerName) changed.push('influencerName')
    if (prev.parties.influencerCity !== formData.parties.influencerCity || 
        prev.parties.influencerState !== formData.parties.influencerState) changed.push('influencerLocation')
    if (prev.parties.brandName !== formData.parties.brandName) changed.push('brandName')
    if (prev.parties.brandCity !== formData.parties.brandCity || 
        prev.parties.brandState !== formData.parties.brandState) changed.push('brandLocation')

    // Campaign
    if (hasChanged(prev.campaign.platforms, formData.campaign.platforms)) changed.push('platforms')
    if (hasChanged(prev.campaign.contentTypes, formData.campaign.contentTypes)) changed.push('contentTypes')
    if (prev.campaign.deliverables !== formData.campaign.deliverables) changed.push('deliverables')
    if (prev.campaign.campaignDescription !== formData.campaign.campaignDescription) changed.push('campaignDescription')

    // Timeline
    if (prev.timeline.contentDeadline !== formData.timeline.contentDeadline) changed.push('contentDeadline')
    if (prev.timeline.brandApprovalRequired !== formData.timeline.brandApprovalRequired) changed.push('brandApproval')

    // Payment
    if (prev.payment.totalAmount !== formData.payment.totalAmount) changed.push('totalAmount')
    if (prev.payment.paymentStructure !== formData.payment.paymentStructure) changed.push('paymentStructure')
    if (prev.payment.paymentTimeline !== formData.payment.paymentTimeline) changed.push('paymentTimeline')
    if (prev.payment.customPaymentDate !== formData.payment.customPaymentDate) changed.push('customPaymentDate')
    if (hasChanged(prev.payment.paymentModes, formData.payment.paymentModes)) changed.push('paymentModes')

    // Usage Rights
    if (prev.usageRights.usageScope !== formData.usageRights.usageScope) changed.push('usageScope')
    if (prev.usageRights.usageDuration !== formData.usageRights.usageDuration) changed.push('usageDuration')
    if (prev.usageRights.creditRequired !== formData.usageRights.creditRequired) changed.push('creditRequired')
    if (prev.usageRights.contentOwnership !== formData.usageRights.contentOwnership) changed.push('contentOwnership')

    // Exclusivity
    if (prev.exclusivity.exclusivityPeriod !== formData.exclusivity.exclusivityPeriod) changed.push('exclusivity')
    if (prev.exclusivity.revisionRounds !== formData.exclusivity.revisionRounds) changed.push('revisionRounds')

    // Legal
    if (prev.legal.agreementDate !== formData.legal.agreementDate) changed.push('agreementDate')
    if (prev.legal.cancellationTerms !== formData.legal.cancellationTerms) changed.push('cancellation')
    if (prev.legal.governingState !== formData.legal.governingState) changed.push('jurisdiction')

    if (changed.length > 0) {
      setHighlighted(prev => {
        const next = new Set(prev)
        changed.forEach(f => next.add(f))
        return next
      })

      // Auto-scroll to first changed field (within preview container only)
      setTimeout(() => {
        const firstRef = fieldRefs.current.get(changed[0])
        const scrollContainer = document.getElementById('influencer-contract-preview')
        if (firstRef && scrollContainer) {
          // Calculate position relative to scroll container
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

    prevFormDataRef.current = JSON.parse(JSON.stringify(formData))
    prevCalculationsRef.current = { ...calculations }
  }, [formData, calculations])

  // Cleanup
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(t => clearTimeout(t))
    }
  }, [])

  // Helper: Get highlight class
  const hl = useCallback((field: string) => {
    return highlighted.has(field) 
      ? 'bg-yellow-200 dark:bg-yellow-800/50 rounded px-1 -mx-1 transition-colors duration-300' 
      : ''
  }, [highlighted])

  // Helper: Create ref
  const setRef = useCallback((field: string) => (el: HTMLElement | null) => {
    fieldRefs.current.set(field, el)
  }, [])
  // ===== END HIGHLIGHTING LOGIC =====

  const getPaymentModeLabels = (modes: string[]) => {
    return modes.map((m) => {
      const option = PAYMENT_MODE_OPTIONS.find((o) => o.value === m)
      return option?.label || m
    }).join(", ")
  }

  return (
    <PreviewWrapper
      title="Contract Preview"
      icon={<FileText className="h-5 w-5" />}
      previewId="influencer-contract-preview"
      dataTestId="influencer-contract-preview"
      /* NOTE: className styles (rounded-lg, shadow-lg) apply ONLY to preview UI wrapper.
         They do not leak into PDF capture. PDF styling is controlled exclusively by <style> block. */
      className="bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg"
      pdfContentId="influencer-contract-pdf-content"
      maxHeight={maxHeight}
    >
      <style>{`
        @page {
          size: A4;
          margin: 25mm 25mm 30mm 25mm;
        }
        
        .ic-payment-section {
          break-before: page;
          page-break-before: always;
          margin-top: 40px;
        }
        
        .ic-termination-section {
          margin-top: 20px;
        }
        
        .ic-signature-section {
          break-before: page;
          page-break-before: always;
          margin-top: 40px;
        }
        
        .ic-clause {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        
        .ic-payment-block {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        
        .ic-signature-block {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        
        h2 {
          break-after: avoid;
          page-break-after: avoid;
        }
      `}</style>
      <div className="space-y-6 text-sm" style={{ fontFamily: "Georgia, serif" }}>
        {/* ===== PAGE 1: Title, Parties, Campaign, Timeline ===== */}
        
        {/* Document Title */}
        <div className="text-center border-b-2 border-slate-300 pb-4">
          <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
            Influencer–Brand Collaboration Agreement
          </h1>
          <p className="text-xs text-slate-500 mt-1">(Draft)</p>
        </div>

        {/* Agreement Date */}
        <div className="text-center text-sm text-slate-600">
          <p>Dated: <strong ref={setRef('agreementDate')} className={hl('agreementDate')}>{calculations.formattedAgreementDate || "_______________"}</strong></p>
        </div>

        {/* Parties Section */}
        <div className="space-y-3">
          <h2 className="font-bold text-slate-800 border-b border-slate-200 pb-1">1. PARTIES</h2>
          
          <div className="space-y-2 text-slate-700">
            <p>
              <strong>INFLUENCER:</strong><br />
              <span ref={setRef('influencerName')} className={hl('influencerName')}>{formData.parties.influencerName || "[Influencer Name]"}</span><br />
              <span ref={setRef('influencerLocation')} className={hl('influencerLocation')}>{calculations.influencerLocation || "[City, State]"}</span>
            </p>
            
            <p className="text-center text-slate-500">AND</p>
            
            <p>
              <strong>BRAND / COMPANY:</strong><br />
              <span ref={setRef('brandName')} className={hl('brandName')}>{formData.parties.brandName || "[Brand Name]"}</span><br />
              <span ref={setRef('brandLocation')} className={hl('brandLocation')}>{calculations.brandLocation || "[City, State]"}</span>
            </p>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="space-y-3">
          <h2 className="font-bold text-slate-800 border-b border-slate-200 pb-1">2. CAMPAIGN DETAILS</h2>
          
          <div className="space-y-2 text-slate-700">
            <p>
              <strong>Platform(s):</strong>{" "}
              <span ref={setRef('platforms')} className={hl('platforms')}>
                {calculations.platformNames.length > 0 
                  ? calculations.platformNames.join(", ") 
                  : "[Platform]"}
              </span>
            </p>
            <p>
              <strong>Content Type(s):</strong>{" "}
              <span ref={setRef('contentTypes')} className={hl('contentTypes')}>
                {calculations.contentTypeNames.length > 0 
                  ? calculations.contentTypeNames.join(", ") 
                  : "[Content Type]"}
              </span>
            </p>
            <p>
              <strong>Deliverables:</strong>{" "}
              <span ref={setRef('deliverables')} className={hl('deliverables')}>
                {formData.campaign.deliverables || "[Number and type of deliverables]"}
              </span>
            </p>
            {formData.campaign.campaignDescription && (
              <p>
                <strong>Campaign Description:</strong>{" "}
                <span ref={setRef('campaignDescription')} className={hl('campaignDescription')}>
                  {formData.campaign.campaignDescription}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <h2 className="font-bold text-slate-800 border-b border-slate-200 pb-1">3. TIMELINE</h2>
          
          <div className="space-y-2 text-slate-700">
            <p>
              <strong>Content Posting Deadline:</strong>{" "}
              <span ref={setRef('contentDeadline')} className={hl('contentDeadline')}>
                {calculations.formattedDeadline || "[Date]"}
              </span>
            </p>
            <p>
              <strong>Brand Approval Required:</strong>{" "}
              <span ref={setRef('brandApproval')} className={hl('brandApproval')}>
                {formData.timeline.brandApprovalRequired ? "Yes" : "No"}
              </span>
            </p>
            {formData.timeline.brandApprovalRequired && (
              <p className="text-xs text-slate-600 italic">
                All content must be submitted to the Brand for review and approval before posting.
              </p>
            )}
          </div>
        </div>

        {/* ===== PAGE 2: Payment Terms & Usage Rights (Highlighted) ===== */}
        
        {/* Payment Terms - Highlighted Box */}
        <div className="ic-payment-section border-2 border-green-500 rounded-lg p-4 bg-green-50">
          <h2 className="font-bold text-green-800 border-b border-green-300 pb-1 mb-3">
            4. PAYMENT TERMS
          </h2>
          
          <div className="space-y-2 text-slate-700">
            <p className="text-lg">
              <strong>Total Payment:</strong>{" "}
              <span ref={setRef('totalAmount')} className={`text-green-700 font-bold ${hl('totalAmount')}`}>
                {calculations.formattedAmount || "₹_____"}
              </span>
            </p>
            <p>
              <strong>Payment Structure:</strong>{" "}
              <span ref={setRef('paymentStructure')} className={hl('paymentStructure')}>
                {calculations.paymentStructureLabel}
              </span>
            </p>
            {formData.payment.paymentStructure === "half-advance" && (
              <div className="pl-4 text-sm border-l-2 border-green-300">
                <p>• Advance: ₹{calculations.paymentBreakdown.advanceAmount.toLocaleString("en-IN")}</p>
                <p>• After Posting: ₹{calculations.paymentBreakdown.remainingAmount.toLocaleString("en-IN")}</p>
              </div>
            )}
            <p>
              <strong>Payment Timeline:</strong>{" "}
              <span ref={setRef('paymentTimeline')} className={hl('paymentTimeline')}>
                {formData.payment.paymentTimeline === "custom" 
                  ? <span>Custom Date: <span ref={setRef('customPaymentDate')} className={hl('customPaymentDate')}>{formData.payment.customPaymentDate}</span></span>
                  : calculations.paymentTimelineLabel}
              </span>
            </p>
            <p>
              <strong>Payment Mode:</strong>{" "}
              <span ref={setRef('paymentModes')} className={hl('paymentModes')}>
                {getPaymentModeLabels(formData.payment.paymentModes) || "[Payment Mode]"}
              </span>
            </p>
          </div>
        </div>

        {/* Usage Rights - Highlighted Box */}
        <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
          <h2 className="font-bold text-blue-800 border-b border-blue-300 pb-1 mb-3">
            5. CONTENT USAGE RIGHTS
          </h2>
          
          <div className="space-y-2 text-slate-700">
            <p>
              <strong>Usage Scope:</strong>{" "}
              <span ref={setRef('usageScope')} className={hl('usageScope')}>
                {calculations.usageScopeLabel}
              </span>
            </p>
            <p>
              <strong>Usage Duration:</strong>{" "}
              <span ref={setRef('usageDuration')} className={hl('usageDuration')}>
                {calculations.usageDurationLabel}
              </span>
            </p>
            <p>
              <strong>Credit to Influencer:</strong>{" "}
              <span ref={setRef('creditRequired')} className={hl('creditRequired')}>
                {formData.usageRights.creditRequired 
                  ? "Required (Brand must credit/tag Influencer)" 
                  : "Not Required"}
              </span>
            </p>
            <p>
              <strong>Content Ownership:</strong>{" "}
              <span ref={setRef('contentOwnership')} className={hl('contentOwnership')}>
                {calculations.contentOwnershipLabel}
              </span>
            </p>
          </div>
        </div>

        {/* ===== PAGE 3: Legal Clauses, Termination, Signatures ===== */}

        {/* Exclusivity & Revisions */}
        <div className="space-y-3">
          <h2 className="font-bold text-slate-800 border-b border-slate-200 pb-1">
            6. EXCLUSIVITY & REVISIONS
          </h2>
          
          <div className="space-y-2 text-slate-700">
            <p>
              <strong>Exclusivity Period:</strong>{" "}
              <span ref={setRef('exclusivity')} className={hl('exclusivity')}>
                {calculations.exclusivityLabel}
              </span>
            </p>
            {formData.exclusivity.exclusivityPeriod !== "none" && (
              <p className="text-xs text-slate-600 italic pl-4">
                During this period, the Influencer shall not promote competing brands in the same product category.
              </p>
            )}
            <p>
              <strong>Revision Rounds:</strong>{" "}
              <span ref={setRef('revisionRounds')} className={hl('revisionRounds')}>
                {formData.exclusivity.revisionRounds} revision(s) allowed
              </span>
            </p>
          </div>
        </div>

        {/* Legal Clauses */}
        <div className="space-y-3">
          <h2 className="font-bold text-slate-800 border-b border-slate-200 pb-1">
            7. TERMS & CONDITIONS
          </h2>
          
          <div className="space-y-3 text-xs text-slate-600">
            <p><strong>7.1 Deliverables:</strong> {CONTRACT_CLAUSES.deliverables}</p>
            <p><strong>7.2 Approval:</strong> {CONTRACT_CLAUSES.approval}</p>
            <p><strong>7.3 Compliance:</strong> {CONTRACT_CLAUSES.compliance}</p>
            <p><strong>7.4 Confidentiality:</strong> {CONTRACT_CLAUSES.confidentiality}</p>
            <p><strong>7.5 Indemnity:</strong> {CONTRACT_CLAUSES.indemnity}</p>
          </div>
        </div>

        {/* Termination & Jurisdiction */}
        <div className="ic-termination-section space-y-3">
          <h2 className="font-bold text-slate-800 border-b border-slate-200 pb-1">
            8. TERMINATION & JURISDICTION
          </h2>
          
          <div className="space-y-2 text-slate-700">
            <p>
              <strong>Cancellation Terms:</strong>{" "}
              <span ref={setRef('cancellation')} className={hl('cancellation')}>
                {calculations.cancellationLabel}
              </span>
            </p>
            <p>
              <strong>Governing Jurisdiction:</strong>{" "}
              <span ref={setRef('jurisdiction')} className={hl('jurisdiction')}>
                Courts of {calculations.governingStateName || "[State]"}, India
              </span>
            </p>
            <p className="text-xs text-slate-600 italic">
              Any disputes arising from this agreement shall be subject to the exclusive 
              jurisdiction of courts in the above-mentioned state.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border border-amber-300 rounded-lg p-3 bg-amber-50">
          <p className="text-xs text-amber-800">
            <strong>DISCLAIMER:</strong> {CONTRACT_CLAUSES.disclaimer}
          </p>
        </div>

        {/* Signature Block */}
        <div className="ic-signature-section space-y-6 pt-4 border-t-2 border-slate-300">
          <h2 className="font-bold text-slate-800 text-center">SIGNATURES</h2>
          
          <p className="text-xs text-slate-600 text-center">
            IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.
          </p>
          
          <div className="grid grid-cols-2 gap-8 pt-4">
            {/* Influencer Signature */}
            <div className="space-y-6">
              <div className="border-b border-slate-400 pb-1">
                <p className="text-slate-400 text-xs">Influencer Signature</p>
              </div>
              <p className="text-sm font-medium">
                {formData.parties.influencerName || "________________"}
              </p>
              <div className="border-b border-slate-400 pb-1">
                <p className="text-slate-400 text-xs">Date</p>
              </div>
            </div>
            
            {/* Brand Signature */}
            <div className="space-y-6">
              <div className="border-b border-slate-400 pb-1">
                <p className="text-slate-400 text-xs">Brand Representative Signature</p>
              </div>
              <p className="text-sm font-medium">
                For {formData.parties.brandName || "________________"}
              </p>
              <div className="border-b border-slate-400 pb-1">
                <p className="text-slate-400 text-xs">Date</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-slate-200">
          <p className="text-[10px] text-slate-400">
            This document is a standard draft format generated for convenience. 
            It does not replace professional legal advice.
          </p>
        </div>
      </div>
    </PreviewWrapper>
  )
}
