/**
 * Rent Agreement Preview Component
 * Full legal document preview matching the PDF output
 */

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, AlertTriangle } from "lucide-react"
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

interface RentAgreementPreviewProps {
  calculatedData: RentAgreementCalculatedData
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

export function RentAgreementPreview({ calculatedData }: RentAgreementPreviewProps) {
  const { formData, calculations } = calculatedData
  const { landlord, tenant, property, rentTerms, clauses } = formData

  // Generate document ID
  const documentId = `RA-${Date.now().toString(36).toUpperCase().slice(-8)}`

  return (
    <Card className="sticky top-4 overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground py-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <CardTitle className="text-lg">Agreement Preview</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* LEGAL DOCUMENT - This is what gets captured for PDF */}
        <div data-testid="rent-agreement-preview" className="p-6 space-y-5 text-sm bg-white">
          {/* Title */}
          <div className="text-center space-y-1 border-b-2 border-foreground pb-4">
            <h2 className="text-xl font-bold text-foreground tracking-wide">RENT AGREEMENT</h2>
            <p className="text-xs text-muted-foreground">
              Under Section 107 of the Transfer of Property Act, 1882
            </p>
          </div>

          {/* Preamble */}
          <div className="space-y-3 leading-relaxed text-xs text-muted-foreground">
            <p>
              This <strong className="text-foreground">RENT AGREEMENT</strong> is made and executed on this{" "}
              <strong className="text-foreground">
                {formatAgreementDate(rentTerms.agreementStartDate) || "____________________"}
              </strong>
              {" "}at <strong className="text-foreground">{property.city || "____________________"}</strong>,{" "}
              <strong className="text-foreground">{getStateName(property.state)}</strong>.
            </p>
          </div>

          {/* Landlord Details */}
          <div className="space-y-2">
            <p className="font-bold text-center text-foreground">BETWEEN</p>
            <div className="bg-muted/40 border border-border rounded p-3 space-y-1 text-xs">
              <p><strong>Name:</strong> {landlord.name || "____________________"}</p>
              <p><strong>Address:</strong> {landlord.address || "____________________"}</p>
              <p><strong>Phone:</strong> {landlord.phone || "____________________"}</p>
              {landlord.email && <p><strong>Email:</strong> {landlord.email}</p>}
              {landlord.panNumber && <p><strong>PAN:</strong> {landlord.panNumber}</p>}
              {landlord.aadharNumber && <p><strong>Aadhar:</strong> {landlord.aadharNumber}</p>}
            </div>
            <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
              (Hereinafter referred to as the <strong>"LANDLORD/LESSOR"</strong>, which expression shall, unless repugnant to the context or meaning thereof, include their heirs, executors, administrators, legal representatives, and assigns of the First Part)
            </p>
          </div>

          {/* Tenant Details */}
          <div className="space-y-2">
            <p className="font-bold text-center text-foreground">AND</p>
            <div className="bg-muted/40 border border-border rounded p-3 space-y-1 text-xs">
              <p><strong>Name:</strong> {tenant.name || "____________________"}</p>
              <p><strong>Address:</strong> {tenant.address || "____________________"}</p>
              <p><strong>Phone:</strong> {tenant.phone || "____________________"}</p>
              {tenant.email && <p><strong>Email:</strong> {tenant.email}</p>}
              {tenant.panNumber && <p><strong>PAN:</strong> {tenant.panNumber}</p>}
              {tenant.aadharNumber && <p><strong>Aadhar:</strong> {tenant.aadharNumber}</p>}
            </div>
            <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
              (Hereinafter referred to as the <strong>"TENANT/LESSEE"</strong>, which expression shall, unless repugnant to the context or meaning thereof, include their heirs, executors, administrators, legal representatives, and assigns of the Second Part)
            </p>
          </div>

          <Separator />

          {/* Schedule of Property */}
          <div className="space-y-2">
            <h3 className="font-bold text-foreground uppercase text-xs tracking-wide border-b border-muted pb-1">
              Schedule of Property
            </h3>
            <div className="bg-muted/30 rounded p-3 text-xs space-y-1">
              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground font-medium">Property Address:</span>
                <span className="col-span-2">{property.address || "____________________"}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground font-medium">City & State:</span>
                <span className="col-span-2">{property.city || "____"}, {getStateName(property.state)} - {property.pincode || "______"}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground font-medium">Property Type:</span>
                <span className="col-span-2">{getPropertyTypeName(property.propertyType)}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground font-medium">Furnishing Status:</span>
                <span className="col-span-2">{getFurnishingName(property.furnishingStatus)}</span>
              </div>
              {property.area && (
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground font-medium">Area:</span>
                  <span className="col-span-2">{property.area} sq. ft.</span>
                </div>
              )}
              {property.floor && (
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground font-medium">Floor:</span>
                  <span className="col-span-2">{property.floor}</span>
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
          <div className="space-y-2">
            <h3 className="font-bold text-foreground uppercase text-xs tracking-wide border-b border-muted pb-1">
              Terms and Conditions
            </h3>
            <div className="border border-border rounded overflow-hidden text-xs">
              <div className="grid grid-cols-2 border-b border-border">
                <div className="bg-muted/50 p-2 font-medium border-r border-border">Monthly Rent</div>
                <div className="p-2">
                  <strong>{formatCurrency(rentTerms.monthlyRent || 0)}</strong>
                  <br />
                  <span className="text-[10px] text-muted-foreground italic">({amountToWords(rentTerms.monthlyRent || 0)})</span>
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <div className="bg-muted/50 p-2 font-medium border-r border-border">Security Deposit</div>
                <div className="p-2">
                  <strong>{formatCurrency(rentTerms.securityDeposit || 0)}</strong>
                  <br />
                  <span className="text-[10px] text-muted-foreground italic">({amountToWords(rentTerms.securityDeposit || 0)})</span>
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <div className="bg-muted/50 p-2 font-medium border-r border-border">Maintenance Charges</div>
                <div className="p-2">
                  {rentTerms.maintenanceIncluded 
                    ? "Included in rent" 
                    : `${formatCurrency(rentTerms.maintenanceCharges ?? 0)} per month (payable separately)`
                  }
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <div className="bg-muted/50 p-2 font-medium border-r border-border">Agreement Duration</div>
                <div className="p-2">{getDurationText(rentTerms.agreementDuration)}</div>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <div className="bg-muted/50 p-2 font-medium border-r border-border">Commencement Date</div>
                <div className="p-2">{formatAgreementDate(rentTerms.agreementStartDate)}</div>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <div className="bg-muted/50 p-2 font-medium border-r border-border">Expiry Date</div>
                <div className="p-2">{formatAgreementDate(calculations.agreementEndDate)}</div>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <div className="bg-muted/50 p-2 font-medium border-r border-border">Rent Due Day</div>
                <div className="p-2">{rentTerms.rentDueDay}{getOrdinalSuffix(rentTerms.rentDueDay)} of every month</div>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <div className="bg-muted/50 p-2 font-medium border-r border-border">Notice Period</div>
                <div className="p-2">{rentTerms.noticePeriod} month(s)</div>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <div className="bg-muted/50 p-2 font-medium border-r border-border">Payment Mode</div>
                <div className="p-2">{getPaymentModeName(rentTerms.paymentMode)}</div>
              </div>
              {(rentTerms.rentIncrementPercent ?? 0) > 0 && (
                <div className="grid grid-cols-2">
                  <div className="bg-muted/50 p-2 font-medium border-r border-border">Annual Rent Increment</div>
                  <div className="p-2">{rentTerms.rentIncrementPercent}% on renewal</div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Terms and Covenants */}
          {(clauses.noSubLetting || clauses.propertyInspection || clauses.repairsResponsibility || 
            clauses.utilityPayment || clauses.peacefulUse || clauses.noIllegalActivity || clauses.lockInPeriod) && (
            <div className="space-y-2">
              <h3 className="font-bold text-foreground uppercase text-xs tracking-wide border-b border-muted pb-1">
                Terms and Covenants
              </h3>
              <p className="text-xs text-muted-foreground">The Tenant hereby agrees to the following terms and conditions:</p>
              <ol className="list-decimal list-outside ml-4 space-y-2 text-xs text-muted-foreground">
                {clauses.noSubLetting && (
                  <li><strong className="text-foreground">No Sub-letting:</strong> {STANDARD_CLAUSES.noSubLetting}</li>
                )}
                {clauses.propertyInspection && (
                  <li><strong className="text-foreground">Property Inspection:</strong> {STANDARD_CLAUSES.propertyInspection}</li>
                )}
                {clauses.repairsResponsibility && (
                  <li><strong className="text-foreground">Repairs & Maintenance:</strong> {STANDARD_CLAUSES.repairsResponsibility}</li>
                )}
                {clauses.utilityPayment && (
                  <li><strong className="text-foreground">Utility Payment:</strong> {STANDARD_CLAUSES.utilityPayment}</li>
                )}
                {clauses.peacefulUse && (
                  <li><strong className="text-foreground">Peaceful Use:</strong> {STANDARD_CLAUSES.peacefulUse}</li>
                )}
                {clauses.noIllegalActivity && (
                  <li><strong className="text-foreground">No Illegal Activity:</strong> {STANDARD_CLAUSES.noIllegalActivity}</li>
                )}
                {clauses.lockInPeriod && (clauses.lockInMonths ?? 0) > 0 && (
                  <li><strong className="text-foreground">Lock-in Period:</strong> Both parties agree to a lock-in period of {clauses.lockInMonths} month(s) during which neither party can terminate the agreement except for breach of terms.</li>
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
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">IN WITNESS WHEREOF</strong>, the parties have signed this Agreement on the date first mentioned above, in the presence of the following witnesses:
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <div className="border-t border-foreground pt-2 mt-10">
                  <p className="font-bold text-xs">LANDLORD/LESSOR</p>
                  <p className="text-xs text-muted-foreground">{landlord.name || "____________________"}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-foreground pt-2 mt-10">
                  <p className="font-bold text-xs">TENANT/LESSEE</p>
                  <p className="text-xs text-muted-foreground">{tenant.name || "____________________"}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Witnesses */}
          <div className="space-y-3">
            <p className="font-bold text-xs">WITNESSES:</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>1. Name: ____________________</p>
                <p>Address: ____________________</p>
                <div className="border-t border-muted pt-2 mt-6 text-center">
                  <p className="text-[10px]">Signature</p>
                </div>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>2. Name: ____________________</p>
                <p>Address: ____________________</p>
                <div className="border-t border-muted pt-2 mt-6 text-center">
                  <p className="text-[10px]">Signature</p>
                </div>
              </div>
            </div>
          </div>

          {/* Document Footer - Just reference ID */}
          <div className="text-center pt-4 border-t border-muted">
            <p className="text-[10px] text-muted-foreground">
              Document ID: {documentId}
            </p>
          </div>
        </div>

        {/* Platform Guidance - OUTSIDE the document */}
        <div className="bg-amber-50 border-t border-amber-200 p-4 space-y-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-xs">
              <p className="font-medium text-amber-800">Before You Print:</p>
              <ul className="text-amber-700 space-y-1 list-disc list-inside">
                <li>Print this agreement on appropriate <strong>stamp paper</strong> as per {getStateName(property.state)} Stamp Act</li>
                <li>Estimated stamp duty: <strong>{formatCurrency(calculations.stampDutyEstimate)}</strong></li>
                <li>Both parties must <strong>sign</strong> in presence of <strong>two witnesses</strong></li>
                <li>Registration may be required for agreements exceeding 11 months</li>
              </ul>
              <p className="text-amber-600 text-[10px] pt-1">
                This note will not appear in your downloaded PDF. The PDF contains only the legal agreement.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
