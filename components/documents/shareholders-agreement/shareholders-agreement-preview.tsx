/**
 * Shareholders Agreement Preview Component
 * Displays the generated agreement in real-time using PreviewWrapper
 * Pure rendering focused component - receives only calculated data
 */

"use client"

import { Separator } from "@/components/ui/separator"
import { FileText } from "lucide-react"
import { PreviewWrapper } from "../shared/preview-wrapper"
import type { ShareholdersAgreementCalculatedData } from "@/lib/shareholders-agreement"

interface ShareholdersAgreementPreviewProps {
  calculatedData: ShareholdersAgreementCalculatedData
}

// Helper functions for enum rendering
function formatCompanyType(value?: string): string {
  if (!value) return "N/A"
  switch (value) {
    case "private-limited":
      return "Private Limited"
    case "llp":
      return "LLP"
    default:
      return value
  }
}

function formatShareholderRole(value?: string): string {
  if (!value) return "N/A"
  switch (value) {
    case "founder":
      return "Founder"
    case "investor":
      return "Investor"
    case "employee-shareholder":
      return "Employee-Shareholder"
    default:
      return value
  }
}

function formatVotingBasis(value?: string): string {
  if (!value) return "N/A"
  switch (value) {
    case "one-share-one-vote":
      return "One share = one vote"
    case "special-voting-rights":
      return "Special voting rights"
    default:
      return value
  }
}

function formatDecisionsRequire(value?: string): string {
  if (!value) return "N/A"
  switch (value) {
    case "simple-majority":
      return "Simple majority"
    case "special-majority-75":
      return "Special majority (75%)"
    case "unanimous":
      return "Unanimous"
    default:
      return value
  }
}

function formatDirectorAppointmentBy(value?: string): string {
  if (!value) return "N/A"
  switch (value) {
    case "majority-shareholders":
      return "Majority shareholders"
    case "each-founder":
      return "Each founder"
    default:
      return value
  }
}

function formatDeadlockResolution(value?: string): string {
  if (!value) return "N/A"
  switch (value) {
    case "arbitration":
      return "Arbitration"
    case "mediation":
      return "Mediation"
    case "buy-sell-mechanism":
      return "Buy-sell mechanism"
    default:
      return value
  }
}

function formatValuationMethod(value?: string): string {
  if (!value) return "N/A"
  switch (value) {
    case "fair-market-value":
      return "Fair market value"
    case "mutual-agreement":
      return "Mutual agreement"
    case "independent-valuer":
      return "Independent valuer"
    default:
      return value
  }
}

export function ShareholdersAgreementPreview({
  calculatedData,
}: ShareholdersAgreementPreviewProps) {
  const { formData: data } = calculatedData

  if (!data) {
    return (
      <PreviewWrapper
        title="Agreement Preview"
        icon={<FileText className="h-5 w-5" />}
        previewId="shareholders-agreement-preview"
        dataTestId="shareholders-agreement-preview"
        pdfContentId="shareholders-agreement-pdf-content"
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
          <p><strong>Company Name:</strong> {data.company?.companyName || "N/A"}</p>
          <p><strong>CIN/Registration No.:</strong> {data.company?.cin || "N/A"}</p>
          <p><strong>Registered Address:</strong> {data.company?.registeredAddress || "N/A"}</p>
          <p><strong>Date of Agreement:</strong> {data.company?.dateOfAgreement || "N/A"}</p>
          <p><strong>Company Type:</strong> {formatCompanyType(data.company?.companyType)}</p>
        </div>
      </div>

      <Separator />

      {/* Section 2: Shareholders Details */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">2. SHAREHOLDERS DETAILS</h3>
        <div className="space-y-3 text-xs">
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
          <p><strong>Authorized Share Capital:</strong> ₹{data.shareCapital?.authorizedShareCapital?.toLocaleString() || "N/A"}</p>
          <p><strong>Paid-up Share Capital:</strong> ₹{data.shareCapital?.paidUpShareCapital?.toLocaleString() || "N/A"}</p>
          <p><strong>Face Value per Share:</strong> ₹{data.shareCapital?.faceValuePerShare?.toLocaleString() || "N/A"}</p>
        </div>
      </div>

      <Separator />

      {/* Section 4: Board & Management Control */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">4. BOARD & MANAGEMENT CONTROL</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong>Total Directors:</strong> {data.boardManagement?.totalDirectors || "N/A"}</p>
          <p><strong>Director Appointment By:</strong> {formatDirectorAppointmentBy(data.boardManagement?.directorAppointmentBy)}</p>
          {data.boardManagement?.reservedMatters && data.boardManagement.reservedMatters.length > 0 && (
            <div>
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
          <p><strong>Voting Basis:</strong> {formatVotingBasis(data.votingRights?.votingBasis)}</p>
          <p><strong>Decisions Require:</strong> {formatDecisionsRequire(data.votingRights?.decisionsRequire)}</p>
        </div>
      </div>

      <Separator />

      {/* Section 6: Share Transfer Restrictions */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">6. SHARE TRANSFER RESTRICTIONS</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong>Transfer Allowed:</strong> {data.shareTransfer?.transferAllowed ? "Yes" : "No"}</p>
          <p><strong>Right of First Refusal:</strong> {data.shareTransfer?.rightOfFirstRefusal ? "Yes" : "No"}</p>
          <p><strong>Lock-in Period:</strong> {data.shareTransfer?.lockInPeriod || 0} months</p>
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
                <p><strong>Tag-Along Trigger:</strong> {data.tagAlongDragAlong.tagAlongTriggerPercent}%</p>
              )}
              {data.tagAlongDragAlong?.enableDragAlong && (
                <p><strong>Drag-Along Trigger:</strong> {data.tagAlongDragAlong.dragAlongTriggerPercent}%</p>
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
            <div>
              <p><strong>Exit Options:</strong></p>
              <ul className="list-disc list-inside text-muted-foreground ml-2">
                {data.exitBuyout.exitOptions.includes("buy-back-company") && <li>Buy-back by company</li>}
                {data.exitBuyout.exitOptions.includes("sale-third-party") && <li>Sale to third party</li>}
                {data.exitBuyout.exitOptions.includes("ipo") && <li>IPO</li>}
              </ul>
            </div>
          )}
          <p><strong>Valuation Method:</strong> {formatValuationMethod(data.exitBuyout?.valuationMethod)}</p>
        </div>
      </div>

      <Separator />

      {/* Section 9: Confidentiality & Non-Compete */}
      {(data.confidentialityNonCompete?.confidentialityClause || data.confidentialityNonCompete?.nonSolicitation) && (
        <>
          <div className="space-y-2">
            <h3 className="font-bold text-foreground">9. CONFIDENTIALITY & NON-COMPETE</h3>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>Confidentiality Clause:</strong> {data.confidentialityNonCompete?.confidentialityClause ? "Yes" : "No"}</p>
              <p><strong>Non-Compete Duration:</strong> {data.confidentialityNonCompete?.nonCompeteDuration || 0} months</p>
              <p><strong>Non-Solicitation:</strong> {data.confidentialityNonCompete?.nonSolicitation ? "Yes" : "No"}</p>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Section 10: Deadlock & Dispute Resolution */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">10. DEADLOCK & DISPUTE RESOLUTION</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong>Deadlock Resolution:</strong> {formatDeadlockResolution(data.deadlockResolution?.deadlockResolution)}</p>
          <p><strong>Arbitration Location:</strong> {data.deadlockResolution?.arbitrationLocation || "N/A"}</p>
          <p><strong>Governing Law:</strong> India</p>
        </div>
      </div>

      <Separator />

      {/* Section 11: Termination */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground">11. TERMINATION</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          {data.termination?.terminationConditions && data.termination.terminationConditions.length > 0 && (
            <div>
              <p><strong>Termination Conditions:</strong></p>
              <ul className="list-disc list-inside text-muted-foreground ml-2">
                {data.termination.terminationConditions.includes("mutual-consent") && <li>Mutual consent</li>}
                {data.termination.terminationConditions.includes("insolvency") && <li>Insolvency</li>}
                {data.termination.terminationConditions.includes("breach-terms") && <li>Breach of terms</li>}
              </ul>
            </div>
          )}
          <p><strong>Notice Period:</strong> {data.termination?.noticePeriod || 0} days</p>
        </div>
      </div>

      <Separator />

      {/* Section 12: Signatures */}
      <div className="space-y-3">
        <h3 className="font-bold text-foreground">12. SIGNATURES</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong>Place of Signing:</strong> {data.signatureDetails?.placeOfSigning || "N/A"}</p>
          <p><strong>Date of Signing:</strong> {data.company?.dateOfAgreement || "N/A"}</p>
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
          <div className="space-y-3 mt-4 border-t pt-3">
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
                <div key={index}>
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

      {/* Legal Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded p-3">
        <p className="text-[10px] text-amber-900 leading-relaxed">
          <strong>Legal Disclaimer:</strong> This document is a standard Shareholders Agreement generated based on user inputs. It does not replace professional legal advice and must be reviewed by a qualified legal professional before execution. The user is solely responsible for ensuring compliance with all applicable laws and regulations.
        </p>
      </div>
    </div>
    </PreviewWrapper>
  )
}
