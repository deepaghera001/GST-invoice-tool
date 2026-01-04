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
      ? 'bg-yellow-100 dark:bg-yellow-900/40 rounded px-1 -mx-1 transition-colors duration-300' 
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
      <div className="space-y-3">
        <h3 className="font-bold text-center text-foreground">TABLE OF CONTENTS</h3>
        <ol className="text-xs space-y-1 text-muted-foreground list-decimal list-inside ml-4">
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
          <li>Signature Details</li>
        </ol>
      </div>

      <Separator />

      {/* Section 1: Company Details */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">1. COMPANY DETAILS</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong>Company Name:</strong> <span ref={setRef('companyName')} className={hl('companyName')}>{data.company?.companyName || "N/A"}</span></p>
          <p><strong>CIN/Registration No.:</strong> <span ref={setRef('companyCin')} className={hl('companyCin')}>{data.company?.cin || "N/A"}</span></p>
          <p><strong>Registered Address:</strong> <span ref={setRef('registeredAddress')} className={hl('registeredAddress')}>{data.company?.registeredAddress || "N/A"}</span></p>
          <p><strong>Date of Agreement:</strong> <span ref={setRef('dateOfAgreement')} className={hl('dateOfAgreement')}>{data.company?.dateOfAgreement || "N/A"}</span></p>
          <p><strong>Company Type:</strong> <span ref={setRef('companyType')} className={hl('companyType')}>{formatCompanyType(data.company?.companyType)}</span></p>
        </div>
      </div>

      <Separator />

      {/* Section 2: Shareholders Details */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">2. SHAREHOLDERS DETAILS</h3>
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

      {/* Section 3: Share Capital & Ownership */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">3. SHARE CAPITAL & OWNERSHIP</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong>Authorized Share Capital:</strong> <span ref={setRef('authorizedShareCapital')} className={hl('authorizedShareCapital')}>₹{data.shareCapital?.authorizedShareCapital?.toLocaleString() || "N/A"}</span></p>
          <p><strong>Paid-up Share Capital:</strong> <span ref={setRef('paidUpShareCapital')} className={hl('paidUpShareCapital')}>₹{data.shareCapital?.paidUpShareCapital?.toLocaleString() || "N/A"}</span></p>
          <p><strong>Face Value per Share:</strong> <span ref={setRef('faceValuePerShare')} className={hl('faceValuePerShare')}>₹{data.shareCapital?.faceValuePerShare?.toLocaleString() || "N/A"}</span></p>
          {data.shareCapital?.paidUpShareCapital && data.shareCapital?.faceValuePerShare && (
            <p><strong>Total Issued Shares:</strong> {Math.floor(data.shareCapital.paidUpShareCapital / data.shareCapital.faceValuePerShare).toLocaleString()} equity shares of ₹{data.shareCapital.faceValuePerShare} each</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Section 4: Board & Management Control */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">4. BOARD & MANAGEMENT CONTROL</h3>
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

      {/* Section 5: Voting Rights */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">5. VOTING RIGHTS</h3>
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

      {/* Section 6: Share Transfer Restrictions */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">6. SHARE TRANSFER RESTRICTIONS</h3>
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
            <h3 className="font-bold text-foreground">7. TAG-ALONG & DRAG-ALONG</h3>
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

      {/* Section 8: Exit & Buyout */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">8. EXIT & BUYOUT CLAUSES</h3>
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

      {/* Section 9: Confidentiality & Non-Compete */}
      {(data.confidentialityNonCompete?.confidentialityClause || data.confidentialityNonCompete?.nonSolicitation) && (
        <>
          <div className="space-y-2">
            <h3 className="font-bold text-foreground">9. CONFIDENTIALITY & NON-COMPETE</h3>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>Confidentiality Clause:</strong> <span ref={setRef('confidentialityClause')} className={hl('confidentialityClause')}>{data.confidentialityNonCompete?.confidentialityClause ? "Yes" : "No"}</span></p>
              <p><strong>Non-Compete Duration:</strong> <span ref={setRef('nonCompeteDuration')} className={hl('nonCompeteDuration')}>{data.confidentialityNonCompete?.nonCompeteDuration || 0}</span> months</p>
              <p><strong>Non-Solicitation:</strong> <span ref={setRef('nonSolicitation')} className={hl('nonSolicitation')}>{data.confidentialityNonCompete?.nonSolicitation ? "Yes" : "No"}</span></p>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Section 10: Deadlock & Dispute Resolution */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">10. DEADLOCK & DISPUTE RESOLUTION</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong>Deadlock Resolution:</strong> <span ref={setRef('deadlockResolutionMethod')} className={hl('deadlockResolutionMethod')}>{formatDeadlockResolution(data.deadlockResolution?.deadlockResolution)}</span></p>
          <p><strong>Arbitration Location:</strong> <span ref={setRef('arbitrationLocation')} className={hl('arbitrationLocation')}>{data.deadlockResolution?.arbitrationLocation || "N/A"}</span></p>
          <p><strong>Governing Law:</strong> India</p>
        </div>
      </div>

      <Separator />

      {/* Section 11: Termination */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">11. TERMINATION</h3>
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

      {/* Section 12: Signatures */}
      <div className="space-y-3">
        <h3 className="font-bold text-foreground">12. SIGNATURES</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong>Place of Signing:</strong> <span ref={setRef('placeOfSigning')} className={hl('placeOfSigning')}>{data.signatureDetails?.placeOfSigning || "N/A"}</span></p>
          <p><strong>Date of Signing:</strong> <span className={hl('dateOfAgreement')}>{data.company?.dateOfAgreement || "N/A"}</span></p>
        </div>

        {/* Shareholder Signatures */}
        <div className="space-y-3 mt-4">
          {data.shareholders?.map((shareholder, index) => (
            <div key={index} className="border-t pt-3">
              <p className="text-xs font-semibold text-foreground">Shareholder {index + 1}</p>
              <p className="text-xs text-muted-foreground">{shareholder.name || "N/A"}</p>
              <div className="mt-2 pt-4 border-t border-foreground/30 w-24">
                <p className="text-[10px] text-muted-foreground">Signature</p>
              </div>
            </div>
          ))}
        </div>

        {/* Witnesses */}
        {(data.signatureDetails?.noOfWitnesses || 0) > 0 && (
          <div ref={setRef('noOfWitnesses')} className={`space-y-3 mt-4 border-t pt-3 ${hl('noOfWitnesses')}`}>
            <p className="text-xs font-semibold text-foreground">Witnesses</p>
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
                <div key={index} ref={index === 0 ? setRef('witnessNames') : undefined} className={index === 0 ? hl('witnessNames') : ''}>
                  <p className="text-xs font-semibold text-foreground">{witnessName}</p>
                  <div className="mt-2 pt-4 border-t border-foreground/30 w-24">
                    <p className="text-[10px] text-muted-foreground">Signature</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Separator />

      {/* Legal Disclaimer - Platform Protection */}
      <div className="bg-slate-50 border border-slate-200 rounded p-3 mt-4">
        <p className="text-[10px] text-slate-600 leading-relaxed">
          <strong>Disclaimer:</strong> This Shareholders Agreement is generated based on user-provided inputs and is intended for general use. It does not constitute legal advice and should be reviewed by a qualified legal professional before execution. The parties are responsible for ensuring compliance with all applicable laws and regulations.
        </p>
      </div>

    </div>
    </PreviewWrapper>
  )
}
