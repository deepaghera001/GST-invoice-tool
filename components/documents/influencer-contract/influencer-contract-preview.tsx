/**
 * Influencer Contract Preview Component
 * Real-time preview of the contract that will be generated as PDF
 * 
 * PDF Structure:
 * - Page 1: Title, Parties, Campaign, Timeline
 * - Page 2: Payment Terms (highlighted), Usage Rights (highlighted)
 * - Page 3: Legal clauses, Termination, Jurisdiction, Disclaimer, Signature Block
 */

"use client"

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

export function InfluencerContractPreview({
  formData,
  calculations,
  maxHeight,
}: InfluencerContractPreviewProps) {
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
      className="bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg"
      pdfContentId="influencer-contract-pdf-content"
      maxHeight={maxHeight}
    >
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
          <p>Dated: <strong>{calculations.formattedAgreementDate || "_______________"}</strong></p>
        </div>

        {/* Parties Section */}
        <div className="space-y-3">
          <h2 className="font-bold text-slate-800 border-b border-slate-200 pb-1">1. PARTIES</h2>
          
          <div className="space-y-2 text-slate-700">
            <p>
              <strong>INFLUENCER:</strong><br />
              {formData.parties.influencerName || "[Influencer Name]"}<br />
              {calculations.influencerLocation || "[City, State]"}
            </p>
            
            <p className="text-center text-slate-500">AND</p>
            
            <p>
              <strong>BRAND / COMPANY:</strong><br />
              {formData.parties.brandName || "[Brand Name]"}<br />
              {calculations.brandLocation || "[City, State]"}
            </p>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="space-y-3">
          <h2 className="font-bold text-slate-800 border-b border-slate-200 pb-1">2. CAMPAIGN DETAILS</h2>
          
          <div className="space-y-2 text-slate-700">
            <p>
              <strong>Platform(s):</strong>{" "}
              {calculations.platformNames.length > 0 
                ? calculations.platformNames.join(", ") 
                : "[Platform]"}
            </p>
            <p>
              <strong>Content Type(s):</strong>{" "}
              {calculations.contentTypeNames.length > 0 
                ? calculations.contentTypeNames.join(", ") 
                : "[Content Type]"}
            </p>
            <p>
              <strong>Deliverables:</strong>{" "}
              {formData.campaign.deliverables || "[Number and type of deliverables]"}
            </p>
            {formData.campaign.campaignDescription && (
              <p>
                <strong>Campaign Description:</strong>{" "}
                {formData.campaign.campaignDescription}
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
              {calculations.formattedDeadline || "[Date]"}
            </p>
            <p>
              <strong>Brand Approval Required:</strong>{" "}
              {formData.timeline.brandApprovalRequired ? "Yes" : "No"}
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
        <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50">
          <h2 className="font-bold text-green-800 border-b border-green-300 pb-1 mb-3">
            4. PAYMENT TERMS
          </h2>
          
          <div className="space-y-2 text-slate-700">
            <p className="text-lg">
              <strong>Total Payment:</strong>{" "}
              <span className="text-green-700 font-bold">{calculations.formattedAmount || "₹_____"}</span>
            </p>
            <p>
              <strong>Payment Structure:</strong>{" "}
              {calculations.paymentStructureLabel}
            </p>
            {formData.payment.paymentStructure === "half-advance" && (
              <div className="pl-4 text-sm border-l-2 border-green-300">
                <p>• Advance: ₹{calculations.paymentBreakdown.advanceAmount.toLocaleString("en-IN")}</p>
                <p>• After Posting: ₹{calculations.paymentBreakdown.remainingAmount.toLocaleString("en-IN")}</p>
              </div>
            )}
            <p>
              <strong>Payment Timeline:</strong>{" "}
              {formData.payment.paymentTimeline === "custom" 
                ? `Custom Date: ${formData.payment.customPaymentDate}` 
                : calculations.paymentTimelineLabel}
            </p>
            <p>
              <strong>Payment Mode:</strong>{" "}
              {getPaymentModeLabels(formData.payment.paymentModes) || "[Payment Mode]"}
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
              {calculations.usageScopeLabel}
            </p>
            <p>
              <strong>Usage Duration:</strong>{" "}
              {calculations.usageDurationLabel}
            </p>
            <p>
              <strong>Credit to Influencer:</strong>{" "}
              {formData.usageRights.creditRequired 
                ? "Required (Brand must credit/tag Influencer)" 
                : "Not Required"}
            </p>
            <p>
              <strong>Content Ownership:</strong>{" "}
              {calculations.contentOwnershipLabel}
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
              {calculations.exclusivityLabel}
            </p>
            {formData.exclusivity.exclusivityPeriod !== "none" && (
              <p className="text-xs text-slate-600 italic pl-4">
                During this period, the Influencer shall not promote competing brands in the same product category.
              </p>
            )}
            <p>
              <strong>Revision Rounds:</strong>{" "}
              {formData.exclusivity.revisionRounds} revision(s) allowed
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
        <div className="space-y-3">
          <h2 className="font-bold text-slate-800 border-b border-slate-200 pb-1">
            8. TERMINATION & JURISDICTION
          </h2>
          
          <div className="space-y-2 text-slate-700">
            <p>
              <strong>Cancellation Terms:</strong>{" "}
              {calculations.cancellationLabel}
            </p>
            <p>
              <strong>Governing Jurisdiction:</strong>{" "}
              Courts of {calculations.governingStateName || "[State]"}, India
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
        <div className="space-y-6 pt-4 border-t-2 border-slate-300">
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
