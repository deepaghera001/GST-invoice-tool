/**
 * Rent Agreement Preview Component
 * Full legal document preview matching the PDF output
 * With built-in field highlighting and auto-scroll
 */

"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Separator } from "@/components/ui/separator"
import { FileText, AlertTriangle } from "lucide-react"
import { PreviewWrapper } from "../shared/preview-wrapper"
import type { RentAgreementCalculatedData } from "@/lib/rent-agreement"
import { 
  formatAgreementDate, 
  getDurationText, 
  amountToWords,
  INDIAN_STATES,
  PROPERTY_TYPES,
  FURNISHING_OPTIONS,
  PAYMENT_MODES,
  STANDARD_CLAUSES,
} from "@/lib/rent-agreement"

// Highlight duration in milliseconds
const HIGHLIGHT_DURATION = 2500

interface RentAgreementPreviewProps {
  calculatedData: RentAgreementCalculatedData
  maxHeight?: string
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function getStateName(code: string): string {
  return INDIAN_STATES.find((s) => s.code === code)?.name || code
}

function getPropertyTypeName(value: string): string {
  return PROPERTY_TYPES.find((t) => t.value === value)?.label || value
}

function getFurnishingName(value: string): string {
  return FURNISHING_OPTIONS.find((f) => f.value === value)?.label || value
}

function getPaymentModeName(value: string): string {
  return PAYMENT_MODES.find((p) => p.value === value)?.label || value
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}

export function RentAgreementPreview({ calculatedData, maxHeight }: RentAgreementPreviewProps) {
  const { formData, calculations } = calculatedData
  const { landlord, tenant, property, rentTerms, clauses } = formData

  // Generate document ID
  const documentId = `RA-${Date.now().toString(36).toUpperCase().slice(-8)}`

  // ===== SIMPLE HIGHLIGHTING LOGIC =====
  const prevFormDataRef = useRef(formData)
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set())
  const fieldRefs = useRef<Map<string, HTMLElement | null>>(new Map())
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  useEffect(() => {
    const prev = prevFormDataRef.current
    const changed: string[] = []

    // Check landlord fields
    if (prev.landlord.name !== landlord.name && landlord.name) changed.push('landlordName')
    if (prev.landlord.address !== landlord.address && landlord.address) changed.push('landlordAddress')
    if (prev.landlord.phone !== landlord.phone && landlord.phone) changed.push('landlordPhone')
    if (prev.landlord.email !== landlord.email && landlord.email) changed.push('landlordEmail')
    if (prev.landlord.panNumber !== landlord.panNumber && landlord.panNumber) changed.push('landlordPan')
    if (prev.landlord.aadharNumber !== landlord.aadharNumber && landlord.aadharNumber) changed.push('landlordAadhar')

    // Check tenant fields
    if (prev.tenant.name !== tenant.name && tenant.name) changed.push('tenantName')
    if (prev.tenant.address !== tenant.address && tenant.address) changed.push('tenantAddress')
    if (prev.tenant.phone !== tenant.phone && tenant.phone) changed.push('tenantPhone')
    if (prev.tenant.email !== tenant.email && tenant.email) changed.push('tenantEmail')
    if (prev.tenant.panNumber !== tenant.panNumber && tenant.panNumber) changed.push('tenantPan')
    if (prev.tenant.aadharNumber !== tenant.aadharNumber && tenant.aadharNumber) changed.push('tenantAadhar')

    // Check property fields
    if (prev.property.address !== property.address && property.address) changed.push('propertyAddress')
    if (prev.property.city !== property.city && property.city) changed.push('propertyCity')
    if (prev.property.state !== property.state && property.state) changed.push('propertyState')
    if (prev.property.pincode !== property.pincode && property.pincode) changed.push('propertyPincode')
    if (prev.property.propertyType !== property.propertyType) changed.push('propertyType')
    if (prev.property.furnishingStatus !== property.furnishingStatus) changed.push('furnishingStatus')
    if (prev.property.area !== property.area && property.area) changed.push('propertyArea')
    if (prev.property.floor !== property.floor && property.floor) changed.push('propertyFloor')

    // Check rent terms
    if (prev.rentTerms.monthlyRent !== rentTerms.monthlyRent && rentTerms.monthlyRent) changed.push('monthlyRent')
    if (prev.rentTerms.securityDeposit !== rentTerms.securityDeposit && rentTerms.securityDeposit) changed.push('securityDeposit')
    if (prev.rentTerms.maintenanceCharges !== rentTerms.maintenanceCharges) changed.push('maintenanceCharges')
    if (prev.rentTerms.agreementDuration !== rentTerms.agreementDuration) changed.push('agreementDuration')
    if (prev.rentTerms.agreementStartDate !== rentTerms.agreementStartDate && rentTerms.agreementStartDate) changed.push('agreementStartDate')
    if (prev.rentTerms.rentDueDay !== rentTerms.rentDueDay) changed.push('rentDueDay')
    if (prev.rentTerms.noticePeriod !== rentTerms.noticePeriod) changed.push('noticePeriod')
    if (prev.rentTerms.paymentMode !== rentTerms.paymentMode) changed.push('paymentMode')
    if (prev.rentTerms.rentIncrementPercent !== rentTerms.rentIncrementPercent) changed.push('rentIncrement')

    if (changed.length > 0) {
      setHighlighted(prev => {
        const next = new Set(prev)
        changed.forEach(f => next.add(f))
        return next
      })

      // Auto-scroll within preview container
      setTimeout(() => {
        const firstRef = fieldRefs.current.get(changed[0])
        const scrollContainer = document.getElementById('rent-agreement-preview')
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

    prevFormDataRef.current = JSON.parse(JSON.stringify(formData))
  }, [formData, landlord, tenant, property, rentTerms])

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

  return (
    <PreviewWrapper className="overflow-hidden" title="Agreement Preview" icon={<FileText className="h-5 w-5" />} previewId="rent-agreement-preview" dataTestId="rent-agreement-preview" pdfContentId="rent-agreement-pdf-content" maxHeight={maxHeight}>
        <style>{`
          /* Rent Agreement PDF-Only CSS Rules */
          
          /* Global, consistent page margins (never override per-page) */
          @page {
            size: A4;
            margin: 25mm 25mm 30mm 25mm; /* Top Right Bottom Left */
          }
          
          /* Hide preview-only elements from PDF */
          @media print {
            .no-print {
              display: none !important;
            }
          }
          
          .ra-title {
            margin-top: 0;
            margin-bottom: 18px;
          }
          .ra-section-heading {
            margin-top: 24px;
            margin-bottom: 12px;
            break-after: avoid;
            page-break-after: avoid;
          }
          .ra-no-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .ra-page-break {
            break-before: page;
            page-break-before: always;
          }
          .ra-party-block {
            margin-bottom: 16px;
          }
          .ra-party-definition {
            margin-top: 8px;
            line-height: 1.5;
          }
          .ra-schedule-item {
            margin-bottom: 10px;
          }
          .ra-amount {
            font-weight: 600;
          }
          .ra-covenants {
            margin-top: 12px;
          }
          .ra-covenants li {
            margin-bottom: 10px;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .ra-signature-section {
            break-before: page;
            page-break-before: always;
            margin-top: 40px;
          }
          .ra-signature {
            margin-top: 60px;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .ra-signature-name {
            margin-top: 8px;
            font-weight: 600;
          }
          .ra-witness-section {
            break-before: page;
            page-break-before: always;
          }
          .ra-witness {
            margin-top: 20px;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .ra-meta {
            margin-top: 24px;
            font-size: 10px;
            color: #555;
          }
        `}</style>
        {/* LEGAL DOCUMENT - This is what gets captured for PDF */}
        <div data-testid="rent-agreement-preview" className="p-6 space-y-5 text-sm bg-white" style={{ fontFamily: 'var(--font-document)' }}>
          {/* Title */}
          <div className="text-center space-y-2 border-b-2 border-foreground pb-6 mb-4 ra-title">
            <h2 className="text-xl font-bold text-foreground tracking-wide">RENT AGREEMENT</h2>
            <p className="text-xs text-muted-foreground">
              Under Section 107 of the Transfer of Property Act, 1882
            </p>
          </div>

          {/* Preamble */}
          <div className="space-y-3 leading-relaxed text-xs text-muted-foreground">
            <p>
              This <strong className="text-foreground">RENT AGREEMENT</strong> is made and executed on this{" "}
              <strong ref={setRef('agreementStartDate')} className={`text-foreground ${hl('agreementStartDate')}`}>
                {formatAgreementDate(rentTerms.agreementStartDate) || "____________________"}
              </strong>
              {" "}at <strong ref={setRef('propertyCity')} className={`text-foreground ${hl('propertyCity')}`}>{property.city || "____________________"}</strong>,{" "}
              <strong ref={setRef('propertyState')} className={`text-foreground ${hl('propertyState')}`}>{getStateName(property.state)}</strong>.
            </p>
          </div>

          {/* Landlord Details */}
          <div className="space-y-2 ra-no-break ra-party-block" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <p className="font-bold text-center text-foreground">BETWEEN</p>
            <div className="bg-muted/40 border border-border rounded p-3 space-y-1 text-xs">
              <p><strong>Name:</strong> <span ref={setRef('landlordName')} className={hl('landlordName')}>{landlord.name || "____________________"}</span></p>
              <p><strong>Address:</strong> <span ref={setRef('landlordAddress')} className={hl('landlordAddress')}>{landlord.address || "____________________"}</span></p>
              <p><strong>Phone:</strong> <span ref={setRef('landlordPhone')} className={hl('landlordPhone')}>{landlord.phone || "____________________"}</span></p>
              {landlord.email && <p><strong>Email:</strong> <span ref={setRef('landlordEmail')} className={hl('landlordEmail')}>{landlord.email}</span></p>}
              {landlord.panNumber && <p><strong>PAN:</strong> <span ref={setRef('landlordPan')} className={hl('landlordPan')}>{landlord.panNumber}</span></p>}
              {landlord.aadharNumber && <p><strong>Aadhar:</strong> <span ref={setRef('landlordAadhar')} className={hl('landlordAadhar')}>{landlord.aadharNumber}</span></p>}
            </div>
            <p className="text-[10px] text-muted-foreground text-center leading-relaxed ra-party-definition">
              (Hereinafter referred to as the <strong>"LANDLORD/LESSOR"</strong>, which expression shall, unless repugnant to the context or meaning thereof, include their heirs, executors, administrators, legal representatives, and assigns of the First Part)
            </p>
          </div>

          {/* Tenant Details */}
          <div className="space-y-2 ra-no-break ra-party-block" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <p className="font-bold text-center text-foreground">AND</p>
            <div className="bg-muted/40 border border-border rounded p-3 space-y-1 text-xs">
              <p><strong>Name:</strong> <span ref={setRef('tenantName')} className={hl('tenantName')}>{tenant.name || "____________________"}</span></p>
              <p><strong>Address:</strong> <span ref={setRef('tenantAddress')} className={hl('tenantAddress')}>{tenant.address || "____________________"}</span></p>
              <p><strong>Phone:</strong> <span ref={setRef('tenantPhone')} className={hl('tenantPhone')}>{tenant.phone || "____________________"}</span></p>
              {tenant.email && <p><strong>Email:</strong> <span ref={setRef('tenantEmail')} className={hl('tenantEmail')}>{tenant.email}</span></p>}
              {tenant.panNumber && <p><strong>PAN:</strong> <span ref={setRef('tenantPan')} className={hl('tenantPan')}>{tenant.panNumber}</span></p>}
              {tenant.aadharNumber && <p><strong>Aadhar:</strong> <span ref={setRef('tenantAadhar')} className={hl('tenantAadhar')}>{tenant.aadharNumber}</span></p>}
            </div>
            <p className="text-[10px] text-muted-foreground text-center leading-relaxed ra-party-definition">
              (Hereinafter referred to as the <strong>"TENANT/LESSEE"</strong>, which expression shall, unless repugnant to the context or meaning thereof, include their heirs, executors, administrators, legal representatives, and assigns of the Second Part)
            </p>
          </div>

          <Separator />

          {/* Schedule of Property */}
          <div className="space-y-2 ra-no-break">
            <h3 className="font-bold text-foreground uppercase text-xs tracking-wide border-b border-muted pb-1 ra-section-heading">
              Schedule of Property
            </h3>
            <div className="bg-muted/30 rounded p-3 text-xs space-y-1">
              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground font-medium">Property Address:</span>
                <span ref={setRef('propertyAddress')} className={`col-span-2 ${hl('propertyAddress')}`}>{property.address || "____________________"}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground font-medium">City & State:</span>
                <span className="col-span-2"><span className={hl('propertyCity')}>{property.city || "____"}</span>, <span className={hl('propertyState')}>{getStateName(property.state)}</span> - <span ref={setRef('propertyPincode')} className={hl('propertyPincode')}>{property.pincode || "______"}</span></span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground font-medium">Property Type:</span>
                <span ref={setRef('propertyType')} className={`col-span-2 ${hl('propertyType')}`}>{getPropertyTypeName(property.propertyType)}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground font-medium">Furnishing Status:</span>
                <span ref={setRef('furnishingStatus')} className={`col-span-2 ${hl('furnishingStatus')}`}>{getFurnishingName(property.furnishingStatus)}</span>
              </div>
              {property.area && (
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground font-medium">Area:</span>
                  <span ref={setRef('propertyArea')} className={`col-span-2 ${hl('propertyArea')}`}>{property.area} sq. ft.</span>
                </div>
              )}
              {property.floor && (
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground font-medium">Floor:</span>
                  <span ref={setRef('propertyFloor')} className={`col-span-2 ${hl('propertyFloor')}`}>{property.floor}</span>
                </div>
              )}
              {property.parking && (
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground font-medium">Parking:</span>
                  <span className="col-span-2">Included</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Terms and Conditions Table */}
          <div className="space-y-3 break-inside-avoid ra-page-break">
            <h3 className="font-bold text-foreground uppercase text-xs tracking-wide border-b-2 border-foreground pb-2 ra-section-heading">
              SCHEDULE OF TERMS AND CONDITIONS
            </h3>
            <div className="border border-border rounded overflow-hidden text-xs">
              <div className="grid grid-cols-2 border-b border-border">
                <div className="bg-muted/50 p-2 font-medium border-r border-border">Monthly Rent</div>
                <div className="p-2">
                  <strong ref={setRef('monthlyRent')} className={hl('monthlyRent')}>{formatCurrency(rentTerms.monthlyRent || 0)}</strong>
                  <br />
                  <span className="text-[10px] text-muted-foreground italic">({amountToWords(rentTerms.monthlyRent || 0)})</span>
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <div className="bg-muted/50 p-2 font-medium border-r border-border">Security Deposit</div>
                <div className="p-2">
                  <strong ref={setRef('securityDeposit')} className={hl('securityDeposit')}>{formatCurrency(rentTerms.securityDeposit || 0)}</strong>
                  <br />
                  <span className="text-[10px] text-muted-foreground italic">({amountToWords(rentTerms.securityDeposit || 0)})</span>
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <div className="bg-muted/50 p-2 font-medium border-r border-border">Maintenance Charges</div>
                <div className="p-2">
                  <span ref={setRef('maintenanceCharges')} className={hl('maintenanceCharges')}>
                    {rentTerms.maintenanceIncluded 
                      ? "Included in rent" 
                      : `${formatCurrency(rentTerms.maintenanceCharges ?? 0)} per month (payable separately)`
                    }
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <div className="bg-muted/50 p-2 font-medium border-r border-border">Agreement Duration</div>
                <div className="p-2"><span ref={setRef('agreementDuration')} className={hl('agreementDuration')}>{getDurationText(rentTerms.agreementDuration)}</span></div>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <div className="bg-muted/50 p-2 font-medium border-r border-border">Commencement Date</div>
                <div className="p-2"><span className={hl('agreementStartDate')}>{formatAgreementDate(rentTerms.agreementStartDate)}</span></div>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <div className="bg-muted/50 p-2 font-medium border-r border-border">Expiry Date</div>
                <div className="p-2">{formatAgreementDate(calculations.agreementEndDate)}</div>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <div className="bg-muted/50 p-2 font-medium border-r border-border">Rent Due Day</div>
                <div className="p-2"><span ref={setRef('rentDueDay')} className={hl('rentDueDay')}>{rentTerms.rentDueDay}{getOrdinalSuffix(rentTerms.rentDueDay)}</span> of every month</div>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <div className="bg-muted/50 p-2 font-medium border-r border-border">Notice Period</div>
                <div className="p-2"><span ref={setRef('noticePeriod')} className={hl('noticePeriod')}>{rentTerms.noticePeriod}</span> {rentTerms.noticePeriod === 1 ? 'month' : 'months'}</div>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <div className="bg-muted/50 p-2 font-medium border-r border-border">Payment Mode</div>
                <div className="p-2"><span ref={setRef('paymentMode')} className={hl('paymentMode')}>{getPaymentModeName(rentTerms.paymentMode)}</span></div>
              </div>
              {(rentTerms.rentIncrementPercent ?? 0) > 0 && (
                <div className="grid grid-cols-2">
                  <div className="bg-muted/50 p-2 font-medium border-r border-border">Annual Rent Increment</div>
                  <div className="p-2"><span ref={setRef('rentIncrement')} className={hl('rentIncrement')}>{rentTerms.rentIncrementPercent}%</span> on renewal</div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Terms and Covenants */}
          {(clauses.noSubLetting || clauses.propertyInspection || clauses.repairsResponsibility || 
            clauses.utilityPayment || clauses.peacefulUse || clauses.noIllegalActivity || clauses.lockInPeriod) && (
            <div className="space-y-2 ra-covenants">
              <h3 className="font-bold text-foreground uppercase text-xs tracking-wide border-b border-muted pb-1 ra-section-heading">
                Terms and Covenants
              </h3>
              <p className="text-xs text-muted-foreground">The Tenant hereby agrees to the following terms and conditions:</p>
              <ol className="list-decimal list-outside ml-4 space-y-2 text-xs text-muted-foreground">
                {clauses.noSubLetting && (
                  <li className="ra-no-break"><strong className="text-foreground">No Sub-letting:</strong> {STANDARD_CLAUSES.noSubLetting}</li>
                )}
                {clauses.propertyInspection && (
                  <li className="ra-no-break"><strong className="text-foreground">Property Inspection:</strong> {STANDARD_CLAUSES.propertyInspection}</li>
                )}
                {clauses.repairsResponsibility && (
                  <li className="ra-no-break"><strong className="text-foreground">Repairs & Maintenance:</strong> {STANDARD_CLAUSES.repairsResponsibility}</li>
                )}
                {clauses.utilityPayment && (
                  <li className="ra-no-break"><strong className="text-foreground">Utility Payment:</strong> {STANDARD_CLAUSES.utilityPayment}</li>
                )}
                {clauses.peacefulUse && (
                  <li className="ra-no-break"><strong className="text-foreground">Peaceful Use:</strong> {STANDARD_CLAUSES.peacefulUse}</li>
                )}
                {clauses.noIllegalActivity && (
                  <li className="ra-no-break"><strong className="text-foreground">No Illegal Activity:</strong> {STANDARD_CLAUSES.noIllegalActivity}</li>
                )}
                {clauses.lockInPeriod && (clauses.lockInMonths ?? 0) > 0 && (
                  <li className="ra-no-break"><strong className="text-foreground">Lock-in Period:</strong> Both parties agree to a lock-in period of {clauses.lockInMonths} {clauses.lockInMonths === 1 ? 'month' : 'months'} during which neither party can terminate the agreement except for breach of terms.</li>
                )}
              </ol>
            </div>
          )}

          {/* Additional Clauses */}
          {clauses.additionalClauses && (
            <div className="space-y-2">
              <h3 className="font-bold text-foreground uppercase text-xs tracking-wide border-b border-muted pb-1">
                Additional Clauses
              </h3>
              <div className="bg-muted/30 border border-border rounded p-3 text-xs text-muted-foreground">
                {clauses.additionalClauses}
              </div>
            </div>
          )}

          <Separator />

          {/* Signature Section */}
          <div className="space-y-3 ra-signature-section" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">IN WITNESS WHEREOF</strong>, the parties have signed this Agreement on the date first mentioned above, in the presence of the following witnesses:
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center ra-signature" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <div className="border-t border-foreground pt-2 mt-10">
                  <p className="font-bold text-xs whitespace-nowrap">LANDLORD/LESSOR</p>
                  <p className="text-xs text-muted-foreground whitespace-nowrap ra-signature-name">{landlord.name || "____________________"}</p>
                </div>
              </div>
              <div className="text-center ra-signature" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <div className="border-t border-foreground pt-2 mt-10">
                  <p className="font-bold text-xs whitespace-nowrap">TENANT/LESSEE</p>
                  <p className="text-xs text-muted-foreground whitespace-nowrap ra-signature-name">{tenant.name || "____________________"}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Witnesses */}
          <div className="space-y-3 ra-witness-section" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <p className="font-bold text-xs">WITNESSES:</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 text-xs text-muted-foreground ra-witness" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <p>1. Name: ____________________</p>
                <p>Address: ____________________</p>
                <div className="border-t border-muted pt-2 mt-6 text-center">
                  <p className="text-[10px]">Signature</p>
                </div>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground ra-witness" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <p>2. Name: ____________________</p>
                <p>Address: ____________________</p>
                <div className="border-t border-muted pt-2 mt-6 text-center">
                  <p className="text-[10px]">Signature</p>
                </div>
              </div>
            </div>
          </div>

          {/* Document Footer - Just reference ID */}
          <div className="text-center pt-4 border-t border-muted ra-meta">
            <p className="text-[10px] text-muted-foreground">
              Document ID: {documentId}
            </p>
          </div>
        </div>

        {/* Platform Instructions - SEPARATE from document, preview-only */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3 no-print">
          <div className="flex items-start gap-2">
            <div className="space-y-2">
              <p className="font-semibold text-blue-900">Print Instructions (Not in PDF)</p>
              <ul className="text-blue-800 space-y-1 list-disc list-inside text-sm">
                <li>Print this agreement on appropriate <strong>stamp paper</strong> as per the applicable State Stamp Act</li>
                <li>Estimated stamp duty: <strong>{formatCurrency(calculations.stampDutyEstimate)}</strong></li>
                <li>Both parties must <strong>sign</strong> in presence of <strong>two witnesses</strong></li>
                <li>Registration is typically required for agreements of 12 months or more in most states</li>
              </ul>
            </div>
          </div>
        </div>
    </PreviewWrapper>
  )
}
