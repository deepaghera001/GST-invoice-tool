/**
 * Shareholders Agreement Preview Component
 * Displays the generated agreement in real-time using PreviewWrapper
 * Pure rendering focused component - receives only calculated data
 * With built-in field highlighting and auto-scroll
 */

"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Separator } from "@/components/ui/separator"
import { FileText } from "lucide-react"
import { PreviewWrapper } from "../shared/preview-wrapper"
import type { ShareholdersAgreementCalculatedData } from "@/lib/shareholders-agreement"

// Highlight duration in milliseconds
const HIGHLIGHT_DURATION = 2500

interface ShareholdersAgreementPreviewProps {
  calculatedData: ShareholdersAgreementCalculatedData
  maxHeight?: string
}

// Helper functions for enum rendering
function formatCompanyType(value?: string): string {
  // Only Private Limited Companies can have Shareholders Agreements
  // LLPs require separate LLP Partnership Agreement
  const effectiveValue = value || "private-limited"
  switch (effectiveValue) {
    case "private-limited":
      return "Private Limited Company"
    default:
      return "Private Limited Company"
  }
}

function formatShareholderRole(value?: string): string {
  // Default to founder (has default in constants)
  const effectiveValue = value || "founder"
  switch (effectiveValue) {
    case "founder":
      return "Founder"
    case "investor":
      return "Investor"
    case "employee-shareholder":
      return "Employee-Shareholder"
    default:
      return effectiveValue
  }
}

function formatVotingBasis(value?: string): string {
  // Default to one-share-one-vote (has default in constants)
  const effectiveValue = value || "one-share-one-vote"
  switch (effectiveValue) {
    case "one-share-one-vote":
      return "One share = one vote"
    case "special-voting-rights":
      return "Special voting rights"
    default:
      return effectiveValue
  }
}

function formatDecisionsRequire(value?: string): string {
  // Default to simple-majority (has default in constants)
  const effectiveValue = value || "simple-majority"
  switch (effectiveValue) {
    case "simple-majority":
      return "Simple majority"
    case "special-majority-75":
      return "Special majority (75%)"
    case "unanimous":
      return "Unanimous"
    default:
      return effectiveValue
  }
}

function formatDirectorAppointmentBy(value?: string): string {
  // Default to majority-shareholders (has default in constants)
  const effectiveValue = value || "majority-shareholders"
  switch (effectiveValue) {
    case "majority-shareholders":
      return "Majority shareholders"
    case "each-founder":
      return "Each founder"
    default:
      return effectiveValue
  }
}

function formatDeadlockResolution(value?: string): string {
  // Default to arbitration (has default in constants)
  const effectiveValue = value || "arbitration"
  switch (effectiveValue) {
    case "arbitration":
      return "Arbitration"
    case "mediation":
      return "Mediation"
    case "buy-sell-mechanism":
      return "Buy-sell mechanism"
    default:
      return effectiveValue
  }
}

function formatValuationMethod(value?: string): string {
  // Default to fair-market-value if empty (required field with default)
  const effectiveValue = value || "fair-market-value"
  switch (effectiveValue) {
    case "fair-market-value":
      return "Fair market value"
    case "mutual-agreement":
      return "Mutual agreement"
    case "independent-valuer":
      return "Independent valuer"
    default:
      return effectiveValue
  }
}

function formatBoardVotingRule(value?: string): string {
  // Default to simple-majority (has default in constants)
  const effectiveValue = value || "simple-majority"
  switch (effectiveValue) {
    case "simple-majority":
      return "Simple majority of directors present"
    case "two-thirds":
      return "Two-thirds majority of directors present"
    case "unanimous":
      return "Unanimous consent of all directors"
    default:
      return effectiveValue
  }
}

function formatDragAlongPriceCondition(value?: string): string {
  // Default to fair-market-value if empty (has default in constants)
  const effectiveValue = value || "fair-market-value"
  switch (effectiveValue) {
    case "fair-market-value":
      return "Fair Market Value"
    case "board-approved-value":
      return "Board Approved Value"
    case "mutually-agreed":
      return "Mutually Agreed Value"
    default:
      return effectiveValue
  }
}

function formatBuyoutFundingSource(value?: string): string {
  // Default to company if empty (has default in constants)
  const effectiveValue = value || "company"
  switch (effectiveValue) {
    case "company":
      return "Company funds"
    case "remaining-shareholders":
      return "Remaining shareholders"
    case "buyer":
      return "Buyer"
    default:
      return effectiveValue
  }
}

// Map special majority matter IDs to labels
const SPECIAL_MAJORITY_MATTER_LABELS: Record<string, string> = {
  "amendAoA": "Amendment of Articles of Association",
  "changeShareCapital": "Change in authorized share capital",
  "issueNewShares": "Issue of new shares or securities",
  "mergerAcquisition": "Merger, acquisition, or sale of substantial assets",
  "windingUp": "Winding up or dissolution of the Company",
  "relatedPartyTransactions": "Related party transactions above threshold",
}

export function ShareholdersAgreementPreview({
  calculatedData,
  maxHeight,
}: ShareholdersAgreementPreviewProps) {
  const { formData: data } = calculatedData

  // ===== SIMPLE HIGHLIGHTING LOGIC =====
  const prevDataRef = useRef(data)
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set())
  const fieldRefs = useRef<Map<string, HTMLElement | null>>(new Map())
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  useEffect(() => {
    if (!data) return
    const prev = prevDataRef.current
    const changed: string[] = []

    // Check company fields
    if (prev?.company?.companyName !== data?.company?.companyName && data?.company?.companyName) changed.push('companyName')
    if (prev?.company?.cin !== data?.company?.cin && data?.company?.cin) changed.push('companyCin')
    if (prev?.company?.registeredAddress !== data?.company?.registeredAddress && data?.company?.registeredAddress) changed.push('registeredAddress')
    if (prev?.company?.dateOfAgreement !== data?.company?.dateOfAgreement && data?.company?.dateOfAgreement) changed.push('dateOfAgreement')
    if (prev?.company?.companyType !== data?.company?.companyType) changed.push('companyType')

    // Check shareholders (detect any change in shareholder array)
    if (JSON.stringify(prev?.shareholders) !== JSON.stringify(data?.shareholders)) changed.push('shareholders')

    // Check share capital
    if (prev?.shareCapital?.authorizedShareCapital !== data?.shareCapital?.authorizedShareCapital && data?.shareCapital?.authorizedShareCapital) changed.push('authorizedShareCapital')
    if (prev?.shareCapital?.paidUpShareCapital !== data?.shareCapital?.paidUpShareCapital && data?.shareCapital?.paidUpShareCapital) changed.push('paidUpShareCapital')
    if (prev?.shareCapital?.faceValuePerShare !== data?.shareCapital?.faceValuePerShare && data?.shareCapital?.faceValuePerShare) changed.push('faceValuePerShare')

    // Check board management
    if (prev?.boardManagement?.totalDirectors !== data?.boardManagement?.totalDirectors) changed.push('totalDirectors')
    if (prev?.boardManagement?.directorAppointmentBy !== data?.boardManagement?.directorAppointmentBy) changed.push('directorAppointmentBy')
    if (prev?.boardManagement?.boardQuorum !== data?.boardManagement?.boardQuorum) changed.push('boardQuorum')
    if (prev?.boardManagement?.boardVotingRule !== data?.boardManagement?.boardVotingRule) changed.push('boardVotingRule')
    if (JSON.stringify(prev?.boardManagement?.reservedMatters) !== JSON.stringify(data?.boardManagement?.reservedMatters)) changed.push('reservedMatters')

    // Check voting rights
    if (prev?.votingRights?.votingBasis !== data?.votingRights?.votingBasis) changed.push('votingBasis')
    if (prev?.votingRights?.decisionsRequire !== data?.votingRights?.decisionsRequire) changed.push('decisionsRequire')
    if (JSON.stringify(prev?.votingRights?.specialMajorityMatters) !== JSON.stringify(data?.votingRights?.specialMajorityMatters)) changed.push('specialMajorityMatters')

    // Check share transfer
    if (prev?.shareTransfer?.transferAllowed !== data?.shareTransfer?.transferAllowed) changed.push('transferAllowed')
    if (prev?.shareTransfer?.rightOfFirstRefusal !== data?.shareTransfer?.rightOfFirstRefusal) changed.push('rightOfFirstRefusal')
    if (prev?.shareTransfer?.lockInPeriod !== data?.shareTransfer?.lockInPeriod) changed.push('lockInPeriod')

    // Check tag-along/drag-along
    if (prev?.tagAlongDragAlong?.enableTagAlong !== data?.tagAlongDragAlong?.enableTagAlong) changed.push('enableTagAlong')
    if (prev?.tagAlongDragAlong?.tagAlongTriggerPercent !== data?.tagAlongDragAlong?.tagAlongTriggerPercent) changed.push('tagAlongTriggerPercent')
    if (prev?.tagAlongDragAlong?.enableDragAlong !== data?.tagAlongDragAlong?.enableDragAlong) changed.push('enableDragAlong')
    if (prev?.tagAlongDragAlong?.dragAlongTriggerPercent !== data?.tagAlongDragAlong?.dragAlongTriggerPercent) changed.push('dragAlongTriggerPercent')
    if (prev?.tagAlongDragAlong?.dragAlongPriceCondition !== data?.tagAlongDragAlong?.dragAlongPriceCondition) changed.push('dragAlongPriceCondition')

    // Check exit buyout
    if (JSON.stringify(prev?.exitBuyout?.exitOptions) !== JSON.stringify(data?.exitBuyout?.exitOptions)) changed.push('exitOptions')
    if (prev?.exitBuyout?.valuationMethod !== data?.exitBuyout?.valuationMethod) changed.push('valuationMethod')
    if (prev?.exitBuyout?.buyoutPaymentDays !== data?.exitBuyout?.buyoutPaymentDays) changed.push('buyoutPaymentDays')
    if (prev?.exitBuyout?.buyoutFundingSource !== data?.exitBuyout?.buyoutFundingSource) changed.push('buyoutFundingSource')

    // Check confidentiality
    if (prev?.confidentialityNonCompete?.confidentialityClause !== data?.confidentialityNonCompete?.confidentialityClause) changed.push('confidentialityClause')
    if (prev?.confidentialityNonCompete?.nonCompeteDuration !== data?.confidentialityNonCompete?.nonCompeteDuration) changed.push('nonCompeteDuration')
    if (prev?.confidentialityNonCompete?.nonSolicitation !== data?.confidentialityNonCompete?.nonSolicitation) changed.push('nonSolicitation')

    // Check deadlock resolution
    if (prev?.deadlockResolution?.deadlockResolution !== data?.deadlockResolution?.deadlockResolution) changed.push('deadlockResolutionMethod')
    if (prev?.deadlockResolution?.arbitrationLocation !== data?.deadlockResolution?.arbitrationLocation && data?.deadlockResolution?.arbitrationLocation) changed.push('arbitrationLocation')

    // Check termination
    if (JSON.stringify(prev?.termination?.terminationConditions) !== JSON.stringify(data?.termination?.terminationConditions)) changed.push('terminationConditions')
    if (prev?.termination?.noticePeriod !== data?.termination?.noticePeriod) changed.push('terminationNoticePeriod')

    // Check signature details
    if (prev?.signatureDetails?.placeOfSigning !== data?.signatureDetails?.placeOfSigning && data?.signatureDetails?.placeOfSigning) changed.push('placeOfSigning')
    if (prev?.signatureDetails?.noOfWitnesses !== data?.signatureDetails?.noOfWitnesses) changed.push('noOfWitnesses')
    if (prev?.signatureDetails?.witnessNames !== data?.signatureDetails?.witnessNames) changed.push('witnessNames')

    if (changed.length > 0) {
      setHighlighted(prev => {
        const next = new Set(prev)
        changed.forEach(f => next.add(f))
        return next
      })

      // Auto-scroll within preview container
      setTimeout(() => {
        const firstRef = fieldRefs.current.get(changed[0])
        const scrollContainer = document.getElementById('shareholders-agreement-preview')
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

    prevDataRef.current = data ? JSON.parse(JSON.stringify(data)) : null
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

  if (!data) {
    return (
      <PreviewWrapper
        title="Agreement Preview"
        icon={<FileText className="h-5 w-5" />}
        previewId="shareholders-agreement-preview"
        dataTestId="shareholders-agreement-preview"
        pdfContentId="shareholders-agreement-pdf-content"
        maxHeight={maxHeight}
      >
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading agreement...</p>
        </div>
      </PreviewWrapper>
    )
  }

  return (
    <PreviewWrapper
      title="Agreement Preview"
      icon={<FileText className="h-5 w-5" />}
      previewId="shareholders-agreement-preview"
      dataTestId="shareholders-agreement-preview"
      pdfContentId="shareholders-agreement-pdf-content"
      maxHeight={maxHeight}
    >
      <style>{`
        @page {
          size: A4;
          margin: 25mm 25mm 30mm 25mm;
        }

        h3 {
          break-after: avoid;
          page-break-after: avoid;
        }

        .sha-section {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .sha-signature-section {
          break-before: page;
          page-break-before: always;
          margin-top: 40px;
        }

        .sha-witness-block {
          break-inside: avoid;
          page-break-inside: avoid;
        }
      `}</style>

      {/* PDF Content - this div gets captured for PDF */}
      <div data-testid="shareholders-agreement-preview" className="space-y-5 text-sm bg-white">
        {/* Document Header */}
        <div className="text-center space-y-1 border-b-2 border-foreground pb-4">
          <h2 className="text-xl font-bold text-foreground tracking-wide">SHAREHOLDERS AGREEMENT</h2>
          <p className="text-xs text-muted-foreground">
            {data.company?.companyName || "Company Name"}
          </p>
        </div>

        <Separator />

      {/* Table of Contents */}
      <div className="sha-section space-y-3">
        <h3 className="font-bold text-center text-foreground">TABLE OF CONTENTS</h3>
        <ol className="text-xs space-y-1 text-muted-foreground list-decimal list-inside ml-4">
          <li>Definitions and Interpretation</li>
          <li>Company Details</li>
          <li>Shareholders Details</li>
          <li>Share Capital & Ownership</li>
          <li>Board & Management Control</li>
          <li>Voting Rights</li>
          <li>Share Transfer Restrictions</li>
          <li>Tag-Along & Drag-Along</li>
          <li>Exit & Buyout Clauses</li>
          <li>Confidentiality & Non-Compete</li>
          <li>Deadlock & Dispute Resolution</li>
          <li>Termination</li>
          <li>Execution & Signatures</li>
        </ol>
      </div>

      <Separator />

      {/* Section 1: Definitions and Interpretation */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">1. DEFINITIONS AND INTERPRETATION</h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>In this Agreement, unless the context otherwise requires, the following terms shall have the meanings set forth below:</p>
          <div className="space-y-1 ml-4">
            <p><strong>"Agreement"</strong> means this Shareholders Agreement, including all schedules and attachments thereto.</p>
            <p><strong>"Board"</strong> means the Board of Directors of the Company.</p>
            <p><strong>"Company"</strong> means <span ref={setRef('companyName')} className={hl('companyName')}>{data.company?.companyName || "the company as stated in Schedule A"}</span>, a Private Limited Company registered under the Companies Act, 2013.</p>
            <p><strong>"Shares"</strong> means equity shares of the Company, having such rights and obligations as are conferred and imposed by the Articles of Association and this Agreement.</p>
            <p><strong>"Shareholders"</strong> means the parties to this Agreement who are shareholders of the Company.</p>
            <p><strong>"Fair Market Value"</strong> means the price at which a share of the Company would change hands between a willing buyer and a willing seller, neither under any compulsion to buy or sell, and having reasonable knowledge of relevant facts.</p>
            <p><strong>"Reserved Matters"</strong> means those decisions requiring unanimous or special majority approval as specified in Section 5 of this Agreement.</p>
            <p><strong>"Deadlock"</strong> means a situation where the Board is unable to reach a decision on any matter due to equal division of voting power or inability to obtain the required majority.</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Section 2: Company Details */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">2. COMPANY DETAILS</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong>Company Name:</strong> <span ref={setRef('companyName')} className={hl('companyName')}>{data.company?.companyName || "N/A"}</span></p>
          <p><strong>CIN/Registration No.:</strong> <span ref={setRef('companyCin')} className={hl('companyCin')}>{data.company?.cin || "N/A"}</span></p>
          <p><strong>Registered Address:</strong> <span ref={setRef('registeredAddress')} className={hl('registeredAddress')}>{data.company?.registeredAddress || "N/A"}</span></p>
          <p><strong>Date of Agreement:</strong> <span ref={setRef('dateOfAgreement')} className={hl('dateOfAgreement')}>{data.company?.dateOfAgreement || "N/A"}</span></p>
          <p><strong>Company Type:</strong> <span ref={setRef('companyType')} className={hl('companyType')}>{formatCompanyType(data.company?.companyType)}</span></p>
        </div>
      </div>

      <Separator />

      {/* Section 3: Shareholders Details */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">3. SHAREHOLDERS DETAILS</h3>
        <div ref={setRef('shareholders')} className={`space-y-3 text-xs ${hl('shareholders')}`}>
          {data.shareholders?.map((shareholder, index) => (
            <div key={index} className="bg-muted/40 border border-border rounded p-2 space-y-1">
              <p><strong>Shareholder {index + 1}:</strong> {shareholder.name || "N/A"}</p>
              <p className="text-muted-foreground">Email: {shareholder.email || "N/A"}</p>
              <p className="text-muted-foreground">Address: {shareholder.address || "N/A"}</p>
              <p className="text-muted-foreground">Shareholding: {shareholder.shareholding ?? 0}%</p>
              <p className="text-muted-foreground">No. of Shares: {shareholder.noOfShares ?? 0}</p>
              <p className="text-muted-foreground">Role: {formatShareholderRole(shareholder.role)}</p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Section 4: Share Capital & Ownership */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">4. SHARE CAPITAL & OWNERSHIP</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong>Authorized Share Capital:</strong> <span ref={setRef('authorizedShareCapital')} className={hl('authorizedShareCapital')}>₹{data.shareCapital?.authorizedShareCapital?.toLocaleString() || "N/A"}</span></p>
          <p><strong>Paid-up Share Capital:</strong> <span ref={setRef('paidUpShareCapital')} className={hl('paidUpShareCapital')}>₹{data.shareCapital?.paidUpShareCapital?.toLocaleString() || "N/A"}</span></p>
          <p><strong>Face Value per Share:</strong> <span ref={setRef('faceValuePerShare')} className={hl('faceValuePerShare')}>₹{data.shareCapital?.faceValuePerShare?.toLocaleString() || "N/A"}</span></p>
          {data.shareCapital?.issuedShares && data.shareCapital?.faceValuePerShare && (
            <p><strong>Total Issued Shares:</strong> <span ref={setRef('issuedShares')} className={hl('issuedShares')}>{data.shareCapital.issuedShares.toLocaleString()}</span> equity shares of ₹{data.shareCapital.faceValuePerShare} each</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Section 5: Board & Management Control */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">5. BOARD & MANAGEMENT CONTROL</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong>Total Directors:</strong> <span ref={setRef('totalDirectors')} className={hl('totalDirectors')}>{data.boardManagement?.totalDirectors || 1}</span></p>
          <p><strong>Director Appointment By:</strong> <span ref={setRef('directorAppointmentBy')} className={hl('directorAppointmentBy')}>{formatDirectorAppointmentBy(data.boardManagement?.directorAppointmentBy)}</span></p>
          <p><strong>Board Quorum:</strong> <span ref={setRef('boardQuorum')} className={hl('boardQuorum')}>{data.boardManagement?.boardQuorum || 2}</span> directors</p>
          <p><strong>Board Voting:</strong> <span ref={setRef('boardVotingRule')} className={hl('boardVotingRule')}>{formatBoardVotingRule(data.boardManagement?.boardVotingRule || "simple-majority")}</span></p>
          {data.boardManagement?.reservedMatters && data.boardManagement.reservedMatters.length > 0 && (
            <div ref={setRef('reservedMatters')} className={hl('reservedMatters')}>
              <p><strong>Reserved Matters:</strong></p>
              <ul className="list-disc list-inside text-muted-foreground ml-2">
                {data.boardManagement.reservedMatters.includes("dividends") && <li>Declaration of dividends</li>}
                {data.boardManagement.reservedMatters.includes("capitalExpenditure") && <li>Capital expenditure &gt;₹50 Lakhs</li>}
                {data.boardManagement.reservedMatters.includes("borrowings") && <li>Borrowings &gt;₹1 Crore</li>}
                {data.boardManagement.reservedMatters.includes("newDirectors") && <li>Appointment of new directors</li>}
                {data.boardManagement.reservedMatters.includes("mortgageAssets") && <li>Mortgage/pledge of assets</li>}
                {data.boardManagement.reservedMatters.includes("dissolutionWinding") && <li>Dissolution/winding up</li>}
              </ul>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Section 6: Voting Rights */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">6. VOTING RIGHTS</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong>Voting Basis:</strong> <span ref={setRef('votingBasis')} className={hl('votingBasis')}>{formatVotingBasis(data.votingRights?.votingBasis)}</span></p>
          <p><strong>Decisions Require:</strong> <span ref={setRef('decisionsRequire')} className={hl('decisionsRequire')}>{formatDecisionsRequire(data.votingRights?.decisionsRequire)}</span></p>
          {data.votingRights?.specialMajorityMatters && data.votingRights.specialMajorityMatters.length > 0 && (
            <div ref={setRef('specialMajorityMatters')} className={`mt-2 ${hl('specialMajorityMatters')}`}>
              <p><strong>Special Majority (75%) Required For:</strong></p>
              <ul className="list-disc list-inside text-muted-foreground ml-2">
                {data.votingRights.specialMajorityMatters.map((matterId) => (
                  <li key={matterId}>{SPECIAL_MAJORITY_MATTER_LABELS[matterId] || matterId}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Section 7: Share Transfer Restrictions */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">7. SHARE TRANSFER RESTRICTIONS</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong>Transfer Allowed:</strong> <span ref={setRef('transferAllowed')} className={hl('transferAllowed')}>{data.shareTransfer?.transferAllowed ? "Yes" : "No"}</span></p>
          <p><strong>Right of First Refusal:</strong> <span ref={setRef('rightOfFirstRefusal')} className={hl('rightOfFirstRefusal')}>{data.shareTransfer?.rightOfFirstRefusal ? "Yes" : "No"}</span></p>
          <p><strong>Lock-in Period:</strong> <span ref={setRef('lockInPeriod')} className={hl('lockInPeriod')}>{data.shareTransfer?.lockInPeriod || 0}</span> months</p>
        </div>
      </div>

      <Separator />

      {/* Section 7: Tag-Along & Drag-Along */}
      {(data.tagAlongDragAlong?.enableTagAlong || data.tagAlongDragAlong?.enableDragAlong) && (
        <>
          <div className="space-y-2">
            <h3 className="font-bold text-foreground">8. TAG-ALONG & DRAG-ALONG</h3>
            <div className="space-y-1 text-xs text-muted-foreground">
              {data.tagAlongDragAlong?.enableTagAlong && (
                <>
                  <p><strong>Tag-Along Rights:</strong> <span ref={setRef('enableTagAlong')} className={hl('enableTagAlong')}>Enabled</span></p>
                  <p><strong>Tag-Along Trigger:</strong> <span ref={setRef('tagAlongTriggerPercent')} className={hl('tagAlongTriggerPercent')}>{data.tagAlongDragAlong.tagAlongTriggerPercent}%</span></p>
                </>
              )}
              {data.tagAlongDragAlong?.enableDragAlong && (
                <>
                  <p><strong>Drag-Along Rights:</strong> <span ref={setRef('enableDragAlong')} className={hl('enableDragAlong')}>Enabled</span></p>
                  <p><strong>Drag-Along Trigger:</strong> <span ref={setRef('dragAlongTriggerPercent')} className={hl('dragAlongTriggerPercent')}>{data.tagAlongDragAlong.dragAlongTriggerPercent}%</span></p>
                  {data.tagAlongDragAlong.dragAlongPriceCondition && (
                    <p><strong>Minimum Sale Price:</strong> <span ref={setRef('dragAlongPriceCondition')} className={hl('dragAlongPriceCondition')}>{formatDragAlongPriceCondition(data.tagAlongDragAlong.dragAlongPriceCondition)}</span></p>
                  )}
                </>
              )}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Section 9: Exit & Buyout */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">9. EXIT & BUYOUT CLAUSES</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          {data.exitBuyout?.exitOptions && data.exitBuyout.exitOptions.length > 0 && (
            <div ref={setRef('exitOptions')} className={hl('exitOptions')}>
              <p><strong>Exit Options:</strong></p>
              <ul className="list-disc list-inside text-muted-foreground ml-2">
                {data.exitBuyout.exitOptions.includes("buy-back-company") && <li>Buy-back by company</li>}
                {data.exitBuyout.exitOptions.includes("sale-third-party") && <li>Sale to third party</li>}
                {data.exitBuyout.exitOptions.includes("ipo") && <li>IPO</li>}
              </ul>
            </div>
          )}
          <p><strong>Valuation Method:</strong> <span ref={setRef('valuationMethod')} className={hl('valuationMethod')}>{formatValuationMethod(data.exitBuyout?.valuationMethod)}</span></p>
          <p><strong>Payment Timeline:</strong> <span ref={setRef('buyoutPaymentDays')} className={hl('buyoutPaymentDays')}>{data.exitBuyout?.buyoutPaymentDays || 90}</span> days from agreement on valuation</p>
          <p><strong>Funding Source:</strong> <span ref={setRef('buyoutFundingSource')} className={hl('buyoutFundingSource')}>{formatBuyoutFundingSource(data.exitBuyout?.buyoutFundingSource)}</span></p>
        </div>
      </div>

      <Separator />

      {/* Section 10: Confidentiality & Non-Compete */}
      {(data.confidentialityNonCompete?.confidentialityClause || data.confidentialityNonCompete?.nonSolicitation) && (
        <>
          <div className="space-y-2">
            <h3 className="font-bold text-foreground">10. CONFIDENTIALITY & NON-COMPETE</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p><strong>Confidentiality Clause:</strong> <span ref={setRef('confidentialityClause')} className={hl('confidentialityClause')}>{data.confidentialityNonCompete?.confidentialityClause ? "Yes" : "No"}</span></p>
              {data.confidentialityNonCompete?.nonCompeteDuration && data.confidentialityNonCompete.nonCompeteDuration > 0 && (
                <div>
                  <p><strong>Non-Compete Duration:</strong> <span ref={setRef('nonCompeteDuration')} className={hl('nonCompeteDuration')}>{data.confidentialityNonCompete.nonCompeteDuration} months</span> <strong>to the extent permitted by law</strong></p>
                  <p className="text-[10px] italic text-slate-600 mt-1 bg-amber-50 p-2 rounded border-l-2 border-amber-300">
                    <strong>India Legal Notice:</strong> Non-compete covenants post-termination of employment/directorship are enforceable under Indian law (Contract Act, 1872, Section 27) only to the extent they: (a) protect legitimate business interests; (b) are reasonable in time, area, and line of business; and (c) are not deemed restraint of trade. This clause is expressly subject to "to the extent permitted under applicable law."
                  </p>
                </div>
              )}
              <p><strong>Non-Solicitation:</strong> <span ref={setRef('nonSolicitation')} className={hl('nonSolicitation')}>{data.confidentialityNonCompete?.nonSolicitation ? "Yes" : "No"}</span></p>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Section 11: Deadlock & Dispute Resolution */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">11. DEADLOCK & DISPUTE RESOLUTION</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong>Deadlock Resolution:</strong> <span ref={setRef('deadlockResolutionMethod')} className={hl('deadlockResolutionMethod')}>{formatDeadlockResolution(data.deadlockResolution?.deadlockResolution)}</span></p>
          <p><strong>Arbitration Location:</strong> <span ref={setRef('arbitrationLocation')} className={hl('arbitrationLocation')}>{data.deadlockResolution?.arbitrationLocation || "N/A"}</span></p>
          <p><strong>Governing Law:</strong> India</p>
        </div>
      </div>

      <Separator />

      {/* Section 12: Termination */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">12. TERMINATION</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          {data.termination?.terminationConditions && data.termination.terminationConditions.length > 0 && (
            <div ref={setRef('terminationConditions')} className={hl('terminationConditions')}>
              <p><strong>Termination Conditions:</strong></p>
              <ul className="list-disc list-inside text-muted-foreground ml-2">
                {data.termination.terminationConditions.includes("mutual-consent") && <li>Mutual consent</li>}
                {data.termination.terminationConditions.includes("insolvency") && <li>Insolvency</li>}
                {data.termination.terminationConditions.includes("breach-terms") && <li>Breach of terms</li>}
              </ul>
            </div>
          )}
          <p><strong>Notice Period:</strong> <span ref={setRef('terminationNoticePeriod')} className={hl('terminationNoticePeriod')}>{data.termination?.noticePeriod || 0}</span> days</p>
        </div>
      </div>

      <Separator />

      {/* LEGAL DISCLAIMER - Before Signatures */}
      <div className="bg-red-50 border-2 border-red-300 rounded p-3 my-4">
        <p className="text-[10px] text-red-900 leading-relaxed font-semibold">
          ⚠️ <strong>IMPORTANT DISCLAIMER & LEGAL NOTICE:</strong>
        </p>
        <p className="text-[10px] text-red-800 leading-relaxed mt-2">
          This Shareholders Agreement is generated based on user-provided inputs for general informational purposes. <strong>It is NOT a substitute for legal advice from a qualified lawyer.</strong> Before execution, all parties MUST:
        </p>
        <ul className="text-[10px] text-red-800 list-disc list-inside ml-2 mt-1 space-y-1">
          <li>Review this agreement with an independent legal professional licensed in India</li>
          <li>Verify compliance with Companies Act, 2013, and applicable state laws</li>
          <li>Ensure all capital structure details are mathematically correct</li>
          <li>Understand all rights, obligations, and restrictions contained herein</li>
        </ul>
        <p className="text-[10px] text-red-900 leading-relaxed mt-2">
          <strong>The parties execute this agreement at their own risk and are solely responsible for legal compliance.</strong>
        </p>
      </div>

      <Separator />

      {/* Section 13: Execution & Signatures */}
      <div className="sha-signature-section space-y-4">
        <h3 className="font-bold text-foreground">13. EXECUTION & SIGNATURES</h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>
            In witness whereof, the parties hereto have set their hands to this Agreement on the date(s) and place(s) mentioned below. 
            Each signatory confirms they have read and understood all terms of this Agreement and consent to be legally bound by them.
          </p>
          <p><strong>Place of Signing:</strong> <span ref={setRef('placeOfSigning')} className={hl('placeOfSigning')}>{data.signatureDetails?.placeOfSigning || "N/A"}</span></p>
          <p><strong>Date of Signing:</strong> <span className={hl('dateOfAgreement')}>{data.company?.dateOfAgreement || "N/A"}</span></p>
        </div>

        {/* Shareholder Signatures */}
        <div className="space-y-4 mt-4">
          <p className="text-xs font-bold text-foreground border-b pb-2">FOR AND ON BEHALF OF THE SHAREHOLDERS:</p>
          {data.shareholders?.map((shareholder, index) => (
            <div key={index} className="sha-witness-block border-l-4 border-gray-300 pl-3">
              <p className="text-xs font-semibold text-foreground">Shareholder {index + 1}</p>
              <p className="text-xs text-muted-foreground">{shareholder.name || "N/A"}</p>
              <p className="text-[10px] text-muted-foreground">Role: {formatShareholderRole(shareholder.role)}</p>
              <div className="mt-3 pt-3 border-t-2 border-foreground w-32">
                <p className="text-[10px] text-muted-foreground">Signature</p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Date: ______________</p>
            </div>
          ))}
        </div>

        {/* Witnesses */}
        {(data.signatureDetails?.noOfWitnesses || 0) > 0 && (
          <div ref={setRef('noOfWitnesses')} className={`space-y-4 mt-4 border-t-2 pt-4 ${hl('noOfWitnesses')}`}>
            <p className="text-xs font-bold text-foreground">WITNESSED BY:</p>
            {Array.from({ length: data.signatureDetails?.noOfWitnesses || 0 }).map((_, index) => {
              // Handle witnessNames as either string (comma-separated) or array
              const witnessNamesValue = data.signatureDetails?.witnessNames
              let witnessName = `Witness ${index + 1}`
              if (Array.isArray(witnessNamesValue)) {
                witnessName = witnessNamesValue[index]?.trim() || `Witness ${index + 1}`
              } else if (typeof witnessNamesValue === "string" && witnessNamesValue.length > 0) {
                const names = witnessNamesValue.split(",").map(n => n.trim()).filter(n => n.length > 0)
                witnessName = names[index] || `Witness ${index + 1}`
              }
              return (
                <div key={index} ref={index === 0 ? setRef('witnessNames') : undefined} className={`sha-witness-block border-l-4 border-gray-300 pl-3 ${index === 0 ? hl('witnessNames') : ''}`}>
                  <p className="text-xs font-semibold text-foreground">{witnessName}</p>
                  <div className="mt-3 pt-3 border-t-2 border-foreground w-32">
                    <p className="text-[10px] text-muted-foreground">Signature</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Date: ______________</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
    </PreviewWrapper>
  )
}
