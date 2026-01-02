/**
 * Influencer-Brand Contract Constants
 * Default values, options, and configuration
 */

import type { InfluencerContractFormData } from "./types"

// Platform options
export const PLATFORM_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "snapchat", label: "Snapchat" },
  { value: "other", label: "Other" },
] as const

// Content type options
export const CONTENT_TYPE_OPTIONS = [
  { value: "reel", label: "Reel" },
  { value: "post", label: "Post" },
  { value: "story", label: "Story" },
  { value: "long-form-video", label: "Long-form Video" },
  { value: "shorts", label: "Shorts" },
  { value: "other", label: "Other" },
] as const

// Payment structure options
export const PAYMENT_STRUCTURE_OPTIONS = [
  { value: "full-after", label: "Full payment after posting" },
  { value: "half-advance", label: "50% advance + 50% after posting" },
  { value: "full-advance", label: "Full advance payment" },
] as const

// Payment timeline options
export const PAYMENT_TIMELINE_OPTIONS = [
  { value: "7-days", label: "Within 7 days of posting" },
  { value: "15-days", label: "Within 15 days of posting" },
  { value: "custom", label: "Custom date" },
] as const

// Payment mode options
export const PAYMENT_MODE_OPTIONS = [
  { value: "upi", label: "UPI" },
  { value: "bank-transfer", label: "Bank Transfer" },
  { value: "any", label: "Any" },
] as const

// Usage scope options
export const USAGE_SCOPE_OPTIONS = [
  { value: "organic-only", label: "Organic social media only" },
  { value: "paid-ads", label: "Paid ads allowed" },
  { value: "full-commercial", label: "Full commercial usage" },
] as const

// Usage duration options
export const USAGE_DURATION_OPTIONS = [
  { value: "3-months", label: "3 months" },
  { value: "6-months", label: "6 months" },
  { value: "12-months", label: "12 months" },
  { value: "lifetime", label: "Lifetime" },
] as const

// Content ownership options
export const CONTENT_OWNERSHIP_OPTIONS = [
  { value: "influencer-owns", label: "Influencer retains ownership" },
  { value: "brand-owns-edited", label: "Brand owns final edited content only" },
] as const

// Exclusivity period options
export const EXCLUSIVITY_PERIOD_OPTIONS = [
  { value: "none", label: "None" },
  { value: "30-days", label: "30 days" },
  { value: "60-days", label: "60 days" },
  { value: "90-days", label: "90 days" },
] as const

// Revision rounds options
export const REVISION_ROUNDS_OPTIONS = [
  { value: "0", label: "0 (No revisions)" },
  { value: "1", label: "1 revision" },
  { value: "2", label: "2 revisions" },
  { value: "3", label: "3 revisions" },
] as const

// Cancellation terms options
export const CANCELLATION_TERMS_OPTIONS = [
  { value: "no-payment-before", label: "No payment if cancelled before posting" },
  { value: "full-payment-after", label: "Full payment if cancelled after posting" },
] as const

// Indian states for jurisdiction dropdown
export const INDIAN_STATES = [
  { code: "AN", name: "Andaman and Nicobar Islands" },
  { code: "AP", name: "Andhra Pradesh" },
  { code: "AR", name: "Arunachal Pradesh" },
  { code: "AS", name: "Assam" },
  { code: "BR", name: "Bihar" },
  { code: "CG", name: "Chhattisgarh" },
  { code: "CH", name: "Chandigarh" },
  { code: "DD", name: "Dadra and Nagar Haveli and Daman and Diu" },
  { code: "DL", name: "Delhi" },
  { code: "GA", name: "Goa" },
  { code: "GJ", name: "Gujarat" },
  { code: "HP", name: "Himachal Pradesh" },
  { code: "HR", name: "Haryana" },
  { code: "JH", name: "Jharkhand" },
  { code: "JK", name: "Jammu and Kashmir" },
  { code: "KA", name: "Karnataka" },
  { code: "KL", name: "Kerala" },
  { code: "LA", name: "Ladakh" },
  { code: "LD", name: "Lakshadweep" },
  { code: "MH", name: "Maharashtra" },
  { code: "ML", name: "Meghalaya" },
  { code: "MN", name: "Manipur" },
  { code: "MP", name: "Madhya Pradesh" },
  { code: "MZ", name: "Mizoram" },
  { code: "NL", name: "Nagaland" },
  { code: "OD", name: "Odisha" },
  { code: "PB", name: "Punjab" },
  { code: "PY", name: "Puducherry" },
  { code: "RJ", name: "Rajasthan" },
  { code: "SK", name: "Sikkim" },
  { code: "TN", name: "Tamil Nadu" },
  { code: "TS", name: "Telangana" },
  { code: "TR", name: "Tripura" },
  { code: "UK", name: "Uttarakhand" },
  { code: "UP", name: "Uttar Pradesh" },
  { code: "WB", name: "West Bengal" },
] as const

// Get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  return new Date().toISOString().split("T")[0]
}

// Default form data
export const DEFAULT_INFLUENCER_CONTRACT_DATA: InfluencerContractFormData = {
  parties: {
    influencerName: "",
    influencerCity: "",
    influencerState: "MH",
    brandName: "",
    brandCity: "",
    brandState: "MH",
  },
  campaign: {
    platforms: [],
    contentTypes: [],
    deliverables: "",
    campaignDescription: "",
  },
  timeline: {
    contentDeadline: "",
    brandApprovalRequired: true,
  },
  payment: {
    totalAmount: 0,
    paymentStructure: "half-advance",
    paymentTimeline: "7-days",
    customPaymentDate: "",
    paymentModes: [],
  },
  usageRights: {
    usageScope: "organic-only",
    usageDuration: "3-months",
    creditRequired: true,
    contentOwnership: "influencer-owns",
  },
  exclusivity: {
    exclusivityPeriod: "none",
    revisionRounds: "1",
  },
  legal: {
    cancellationTerms: "no-payment-before",
    governingState: "MH",
    agreementDate: getTodayDate(),
  },
  confirmation: {
    acceptedDisclaimer: false,
  },
}

// Sample data for testing
export const SAMPLE_INFLUENCER_CONTRACT_DATA: InfluencerContractFormData = {
  parties: {
    influencerName: "Priya Sharma",
    influencerCity: "Mumbai",
    influencerState: "MH",
    brandName: "XYZ Cosmetics Pvt Ltd",
    brandCity: "Bangalore",
    brandState: "KA",
  },
  campaign: {
    platforms: ["instagram", "youtube"],
    contentTypes: ["reel", "story"],
    deliverables: "2 Reels + 3 Stories",
    campaignDescription: "Promotion of new skincare product launch for summer collection",
  },
  timeline: {
    contentDeadline: "2026-02-15",
    brandApprovalRequired: true,
  },
  payment: {
    totalAmount: 50000,
    paymentStructure: "half-advance",
    paymentTimeline: "7-days",
    customPaymentDate: "",
    paymentModes: ["upi", "bank-transfer"],
  },
  usageRights: {
    usageScope: "paid-ads",
    usageDuration: "6-months",
    creditRequired: true,
    contentOwnership: "influencer-owns",
  },
  exclusivity: {
    exclusivityPeriod: "30-days",
    revisionRounds: "2",
  },
  legal: {
    cancellationTerms: "no-payment-before",
    governingState: "MH",
    agreementDate: getTodayDate(),
  },
  confirmation: {
    acceptedDisclaimer: true,
  },
}

// Legal clauses text (plain English)
export const CONTRACT_CLAUSES = {
  deliverables: "The Influencer agrees to create and deliver the content as specified in this agreement within the agreed timeline.",
  approval: "All content must be submitted to the Brand for review and approval before public posting, unless otherwise specified.",
  payment: "Payment shall be made as per the agreed structure and timeline through the specified payment modes.",
  usageRights: "The Brand is granted usage rights for the content as specified in the Usage Rights section of this agreement.",
  exclusivity: "During the exclusivity period, the Influencer shall not promote competing brands or products in the same category.",
  revisions: "The Influencer agrees to make revisions to the content as requested by the Brand, up to the specified number of revision rounds.",
  termination: "Either party may terminate this agreement with written notice. Payment terms upon cancellation shall be as specified in this agreement.",
  confidentiality: "Both parties agree to keep confidential any non-public information shared during this collaboration.",
  compliance: "The Influencer agrees to comply with all applicable advertising standards and disclosure requirements, including proper #ad or #sponsored tags.",
  indemnity: "Each party shall indemnify the other against any claims arising from their breach of this agreement or violation of any applicable laws.",
  disclaimer: "This document is a standard draft format generated for convenience. It does not replace professional legal advice.",
} as const

// Display labels for options
export const USAGE_SCOPE_LABELS: Record<string, string> = {
  "organic-only": "Organic Social Media Only",
  "paid-ads": "Paid Advertisements Allowed",
  "full-commercial": "Full Commercial Usage Rights",
}

export const USAGE_DURATION_LABELS: Record<string, string> = {
  "3-months": "3 Months",
  "6-months": "6 Months",
  "12-months": "12 Months",
  "lifetime": "Lifetime / Perpetual",
}

export const EXCLUSIVITY_LABELS: Record<string, string> = {
  "none": "No Exclusivity",
  "30-days": "30 Days",
  "60-days": "60 Days",
  "90-days": "90 Days",
}

export const PAYMENT_STRUCTURE_LABELS: Record<string, string> = {
  "full-after": "Full Payment After Content Posting",
  "half-advance": "50% Advance + 50% After Posting",
  "full-advance": "Full Advance Payment",
}

export const PAYMENT_TIMELINE_LABELS: Record<string, string> = {
  "7-days": "Within 7 Days of Posting",
  "15-days": "Within 15 Days of Posting",
  "custom": "Custom Date",
}

export const CONTENT_OWNERSHIP_LABELS: Record<string, string> = {
  "influencer-owns": "Influencer Retains Full Ownership",
  "brand-owns-edited": "Brand Owns Final Edited Content",
}

export const CANCELLATION_LABELS: Record<string, string> = {
  "no-payment-before": "No payment if cancelled before content posting",
  "full-payment-after": "Full payment required if cancelled after content is posted",
}
