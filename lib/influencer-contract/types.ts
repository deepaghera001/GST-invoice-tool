/**
 * Influencer-Brand Contract Domain Models
 * Type definitions for influencer collaboration agreement form
 */

// Platform options
export type Platform = "instagram" | "youtube" | "facebook" | "snapchat" | "other"

// Content type options
export type ContentType = "reel" | "post" | "story" | "long-form-video" | "shorts" | "other"

// Payment structure options
export type PaymentStructure = "full-after" | "half-advance" | "full-advance"

// Payment timeline options
export type PaymentTimeline = "7-days" | "15-days" | "custom"

// Payment mode options
export type PaymentMode = "upi" | "bank-transfer" | "any"

// Usage scope options
export type UsageScope = "organic-only" | "paid-ads" | "full-commercial"

// Usage duration options
export type UsageDuration = "3-months" | "6-months" | "12-months" | "lifetime"

// Content ownership options
export type ContentOwnership = "influencer-owns" | "brand-owns-edited"

// Exclusivity period options
export type ExclusivityPeriod = "none" | "30-days" | "60-days" | "90-days"

// Revision rounds options
export type RevisionRounds = "0" | "1" | "2" | "3"

// Cancellation terms options
export type CancellationTerms = "no-payment-before" | "full-payment-after"

// Section 1: Parties
export interface PartiesData {
  influencerName: string
  influencerCity: string
  influencerState: string
  brandName: string
  brandCity: string
  brandState: string
}

// Section 2: Platform & Campaign
export interface CampaignData {
  platforms: Platform[]
  contentTypes: ContentType[]
  deliverables: string
  campaignDescription: string
}

// Section 3: Timeline
export interface TimelineData {
  contentDeadline: string
  brandApprovalRequired: boolean
}

// Section 4: Payment Terms
export interface PaymentData {
  totalAmount: number
  paymentStructure: PaymentStructure
  paymentTimeline: PaymentTimeline
  customPaymentDate: string
  paymentModes: PaymentMode[]
}

// Section 5: Content Usage Rights
export interface UsageRightsData {
  usageScope: UsageScope
  usageDuration: UsageDuration
  creditRequired: boolean
  contentOwnership: ContentOwnership
}

// Section 6: Exclusivity & Revisions
export interface ExclusivityData {
  exclusivityPeriod: ExclusivityPeriod
  revisionRounds: RevisionRounds
}

// Section 7: Termination & Legal
export interface LegalData {
  cancellationTerms: CancellationTerms
  governingState: string
  agreementDate: string
}

// Section 8: Confirmation
export interface ConfirmationData {
  acceptedDisclaimer: boolean
}

// Main form data interface
export interface InfluencerContractFormData {
  parties: PartiesData
  campaign: CampaignData
  timeline: TimelineData
  payment: PaymentData
  usageRights: UsageRightsData
  exclusivity: ExclusivityData
  legal: LegalData
  confirmation: ConfirmationData
}

// Validation errors type
export type InfluencerContractValidationErrors = Partial<Record<string, string>>

// Form field handler type
export interface FormFieldHandler {
  (field: string, value: any): void
}
