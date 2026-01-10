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
        
        @font-face {
          font-family: 'Calibri';
          src: local('Calibri');
        }
        
        @font-face {
          font-family: 'Cambria';
          src: local('Cambria');
        }
        
        @font-face {
          font-family: 'Times New Roman';
          src: local('Times New Roman');
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
        
        /* Professional legal styling */
        .contract-title {
          font-family: 'Times New Roman', serif;
          font-size: 18pt;
          font-weight: bold;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 1pt;
          margin-bottom: 8pt;
        }
        
        .section-heading {
          font-family: 'Times New Roman', serif;
          font-size: 14pt;
          font-weight: bold;
          color: #1e293b;
          border-bottom: 1pt solid #cbd5e1;
          padding-bottom: 4pt;
          margin-bottom: 8pt;
          margin-top: 12pt;
        }
        
        .contract-body {
          font-family: 'Times New Roman', serif;
          font-size: 11pt;
          line-height: 1.15;
          color: #334155;
          text-align: justify;
        }
        
        .contract-body p {
          margin-bottom: 6pt;
        }
        
        .signature-table {
          width: 100%;
          margin-top: 20pt;
          border-collapse: collapse;
        }
        
        .signature-table td {
          padding: 20pt 10pt 10pt 10pt;
          vertical-align: top;
          width: 50%;
        }
        
        .signature-line {
          border-bottom: 1pt solid #64748b;
          margin-bottom: 4pt;
          padding-bottom: 2pt;
        }
        
        .signature-label {
          font-size: 9pt;
          color: #64748b;
          margin-bottom: 8pt;
        }
        
        .party-name {
          font-weight: bold;
          font-size: 11pt;
          margin-bottom: 12pt;
        }
        
        .highlight-box {
          border: 2pt solid #16a34a;
          border-radius: 6pt;
          padding: 12pt;
          background-color: #f0fdf4;
          margin: 12pt 0;
        }
        
        .highlight-box h3 {
          color: #166534;
          font-weight: bold;
          margin-bottom: 8pt;
          font-size: 13pt;
        }
        
        .highlight-box .amount {
          font-size: 14pt;
          font-weight: bold;
          color: #166534;
        }
        
        .sub-clause {
          margin-left: 18pt;
          margin-bottom: 4pt;
        }
        
        .sub-clause strong {
          font-size: 10pt;
        }
      `}</style>
      <div className="contract-body">
        {/* ===== PAGE 1: Title, Parties, Campaign, Timeline ===== */}
        
        {/* Document Title */}
        <div style={{ textAlign: 'center', borderBottom: '2pt solid #cbd5e1', paddingBottom: '12pt', marginBottom: '12pt' }}>
          <h1 className="contract-title">
            Influencer–Brand Collaboration Agreement
          </h1>
          <p style={{ fontSize: '9pt', color: '#64748b', marginTop: '4pt' }}>(Draft)</p>
        </div>

        {/* Agreement Date */}
        <div style={{ textAlign: 'center', fontSize: '11pt', color: '#475569', marginBottom: '16pt' }}>
          <p>Dated: <strong ref={setRef('agreementDate')} className={hl('agreementDate')}>{calculations.formattedAgreementDate || "_______________"}</strong></p>
        </div>

        {/* Parties Section */}
        <div>
          <h2 className="section-heading">1. PARTIES</h2>
          
          <div style={{ marginBottom: '8pt' }}>
            <p style={{ marginBottom: '4pt' }}>
              <strong>INFLUENCER:</strong>
            </p>
            <p className={`party-name ${hl('influencerName')}`} ref={setRef('influencerName')}>
              {formData.parties.influencerName || "[Influencer Name]"}
            </p>
            <p ref={setRef('influencerLocation')} className={hl('influencerLocation')}>
              {calculations.influencerLocation || "[City, State]"}
            </p>
          </div>
          
          <div style={{ textAlign: 'center', color: '#64748b', margin: '12pt 0', fontSize: '10pt' }}>
            AND
          </div>
          
          <div>
            <p style={{ marginBottom: '4pt' }}>
              <strong>BRAND / COMPANY:</strong>
            </p>
            <p className={`party-name ${hl('brandName')}`} ref={setRef('brandName')}>
              {formData.parties.brandName || "[Brand Name]"}
            </p>
            <p ref={setRef('brandLocation')} className={hl('brandLocation')}>
              {calculations.brandLocation || "[City, State]"}
            </p>
          </div>
        </div>

        {/* Campaign Details */}
        <div>
          <h2 className="section-heading">2. CAMPAIGN DETAILS</h2>
          
          <p style={{ marginBottom: '6pt' }}>
            <strong>Platform(s):</strong>{" "}
            <span ref={setRef('platforms')} className={hl('platforms')}>
              {calculations.platformNames.length > 0 
                ? calculations.platformNames.join(", ") 
                : "[Platform]"}
            </span>
          </p>
          <p style={{ marginBottom: '6pt' }}>
            <strong>Content Type(s):</strong>{" "}
            <span ref={setRef('contentTypes')} className={hl('contentTypes')}>
              {calculations.contentTypeNames.length > 0 
                ? calculations.contentTypeNames.join(", ") 
                : "[Content Type]"}
            </span>
          </p>
          <p style={{ marginBottom: '6pt' }}>
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

        {/* Timeline */}
        <div>
          <h2 className="section-heading">3. TIMELINE</h2>
          
          <p style={{ marginBottom: '6pt' }}>
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
            <p style={{ fontSize: '9pt', color: '#64748b', fontStyle: 'italic', marginTop: '4pt' }}>
              All content must be submitted to the Brand for review and approval before posting.
            </p>
          )}
        </div>

        {/* ===== PAGE 2: Payment Terms & Usage Rights (Highlighted) ===== */}
        
        {/* Payment Terms - Professional Highlighted Box */}
        <div className="ic-payment-section highlight-box">
          <h3>4. PAYMENT TERMS</h3>
          
          <p style={{ fontSize: '12pt', marginBottom: '8pt' }}>
            <strong>Total Payment:</strong>{" "}
            <span className={`amount ${hl('totalAmount')}`} ref={setRef('totalAmount')}>
              {calculations.formattedAmount || "₹_____"}
            </span>
          </p>
          
          <p style={{ marginBottom: '6pt' }}>
            <strong>Payment Structure:</strong>{" "}
            <span ref={setRef('paymentStructure')} className={hl('paymentStructure')}>
              {calculations.paymentStructureLabel}
            </span>
          </p>
          
          {formData.payment.paymentStructure === "half-advance" && (
            <div className="sub-clause">
              <p>• Advance: ₹{calculations.paymentBreakdown.advanceAmount.toLocaleString("en-IN")}</p>
              <p>• After Posting: ₹{calculations.paymentBreakdown.remainingAmount.toLocaleString("en-IN")}</p>
            </div>
          )}
          
          <p style={{ marginBottom: '6pt' }}>
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

        {/* Usage Rights - Professional Box */}
        <div className="highlight-box" style={{ borderColor: '#2563eb', backgroundColor: '#eff6ff' }}>
          <h3 style={{ color: '#1e40af' }}>5. CONTENT USAGE RIGHTS</h3>
          
          <p style={{ marginBottom: '6pt' }}>
            <strong>Usage Scope:</strong>{" "}
            <span ref={setRef('usageScope')} className={hl('usageScope')}>
              {calculations.usageScopeLabel}
            </span>
          </p>
          
          <p style={{ marginBottom: '6pt' }}>
            <strong>Usage Duration:</strong>{" "}
            <span ref={setRef('usageDuration')} className={hl('usageDuration')}>
              {calculations.usageDurationLabel}
            </span>
          </p>
          
          <p style={{ marginBottom: '6pt' }}>
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

        {/* ===== PAGE 3: Legal Clauses, Termination, Signatures ===== */}

        {/* Exclusivity & Revisions */}
        <div>
          <h2 className="section-heading">6. EXCLUSIVITY & REVISIONS</h2>
          
          <p style={{ marginBottom: '6pt' }}>
            <strong>Exclusivity Period:</strong>{" "}
            <span ref={setRef('exclusivity')} className={hl('exclusivity')}>
              {calculations.exclusivityLabel}
            </span>
          </p>
          
          {formData.exclusivity.exclusivityPeriod !== "none" && (
            <p style={{ fontSize: '9pt', color: '#64748b', fontStyle: 'italic', marginLeft: '18pt', marginBottom: '6pt' }}>
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

        {/* Legal Clauses */}
        <div>
          <h2 className="section-heading">7. TERMS & CONDITIONS</h2>
          
          <div style={{ fontSize: '10pt', color: '#475569', lineHeight: '1.2' }}>
            <p className="sub-clause"><strong>7.1 Deliverables:</strong> {CONTRACT_CLAUSES.deliverables}</p>
            <p className="sub-clause"><strong>7.2 Approval:</strong> {CONTRACT_CLAUSES.approval}</p>
            <p className="sub-clause"><strong>7.3 Compliance:</strong> {CONTRACT_CLAUSES.compliance}</p>
            <p className="sub-clause"><strong>7.4 Confidentiality:</strong> {CONTRACT_CLAUSES.confidentiality}</p>
            <p className="sub-clause"><strong>7.5 Indemnity:</strong> {CONTRACT_CLAUSES.indemnity}</p>
          </div>
        </div>

        {/* Termination & Jurisdiction */}
        <div className="ic-termination-section">
          <h2 className="section-heading">8. TERMINATION & JURISDICTION</h2>
          
          <p style={{ marginBottom: '6pt' }}>
            <strong>Cancellation Terms:</strong>{" "}
            <span ref={setRef('cancellation')} className={hl('cancellation')}>
              {calculations.cancellationLabel}
            </span>
          </p>
          
          <p style={{ marginBottom: '6pt' }}>
            <strong>Governing Jurisdiction:</strong>{" "}
            <span ref={setRef('jurisdiction')} className={hl('jurisdiction')}>
              Courts of {calculations.governingStateName || "[State]"}, India
            </span>
          </p>
          
          <p style={{ fontSize: '9pt', color: '#64748b', fontStyle: 'italic' }}>
            Any disputes arising from this agreement shall be subject to the exclusive 
            jurisdiction of courts in the above-mentioned state.
          </p>
        </div>

       

        {/* Signature Block */}
        <div className="ic-signature-section" style={{ paddingTop: '12pt', borderTop: '2pt solid #cbd5e1' }}>
          <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '14pt', fontWeight: 'bold', color: '#1e293b', textAlign: 'center', marginBottom: '12pt' }}>
            SIGNATURES
          </h2>
          
          <p style={{ fontSize: '10pt', color: '#64748b', textAlign: 'center', marginBottom: '20pt' }}>
            IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.
          </p>
          
          <table className="signature-table">
            <tbody>
              <tr>
                <td>
                  <div className="signature-label">For the Influencer</div>
                  <div className="signature-line">
                    <span className={hl('influencerName')} ref={setRef('influencerName')}>
                      {formData.parties.influencerName || "________________"}
                    </span>
                  </div>
                  <div style={{ marginTop: '8pt' }}>
                    <div className="signature-label">Signature</div>
                    <div className="signature-line"></div>
                  </div>
                  <div style={{ marginTop: '8pt' }}>
                    <div className="signature-label">Date</div>
                    <div className="signature-line"></div>
                  </div>
                </td>
                <td>
                  <div className="signature-label">For the Brand</div>
                  <div className="signature-line">
                    For {formData.parties.brandName || "________________"}
                  </div>
                  <div style={{ marginTop: '8pt' }}>
                    <div className="signature-label">Authorized Signatory</div>
                    <div className="signature-line"></div>
                  </div>
                  <div style={{ marginTop: '8pt' }}>
                    <div className="signature-label">Date</div>
                    <div className="signature-line"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PreviewWrapper>
  )
}
