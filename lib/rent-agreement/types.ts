/**
 * Rent Agreement Domain Models
 * All type definitions for rent agreement form and generation
 */

export interface LandlordDetails {
  name: string
  address: string
  phone: string
  email?: string
  panNumber?: string
  aadharNumber?: string
}

export interface TenantDetails {
  name: string
  address: string
  phone: string
  email?: string
  panNumber?: string
  aadharNumber?: string
}

export interface PropertyDetails {
  address: string
  city: string
  state: string
  pincode: string
  propertyType: "apartment" | "house" | "room" | "commercial" | "other"
  furnishingStatus: "furnished" | "semi-furnished" | "unfurnished"
  area?: string // in sq ft
  floor?: string
  parking?: boolean
}

export interface RentTerms {
  monthlyRent: number
  securityDeposit: number
  maintenanceCharges?: number
  maintenanceIncluded: boolean
  rentDueDay: number // Day of month (1-28)
  agreementStartDate: string // YYYY-MM-DD
  agreementDuration: number // in months (11, 12, 24, 36, etc.)
  noticePeriod: number // in months (1, 2, 3)
  rentIncrementPercent?: number // annual increment %
  paymentMode: "bank-transfer" | "cheque" | "cash" | "upi"
}

export interface AgreementClauses {
  // Standard clauses (all default to true)
  noSubLetting: boolean
  propertyInspection: boolean
  repairsResponsibility: boolean
  utilityPayment: boolean
  peacefulUse: boolean
  noIllegalActivity: boolean
  lockInPeriod: boolean
  lockInMonths?: number
  // Custom clause
  additionalClauses?: string
}

export interface RentAgreementFormData {
  landlord: LandlordDetails
  tenant: TenantDetails
  property: PropertyDetails
  rentTerms: RentTerms
  clauses: AgreementClauses
}

export interface RentAgreementCalculations {
  totalSecurityDeposit: number
  firstMonthTotal: number // Rent + maintenance + any advance
  agreementEndDate: string
  stampDutyEstimate: number // Varies by state
  registrationFee: number
}

export type RentAgreementValidationErrors = Partial<Record<string, string>>

export interface RentAgreementCalculatedData {
  formData: RentAgreementFormData
  calculations: RentAgreementCalculations
}
