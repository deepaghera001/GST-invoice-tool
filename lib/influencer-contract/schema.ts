/**
 * Influencer-Brand Contract Validation Schema (Zod)
 * Runtime validation for all contract fields
 */

import { z } from "zod"

// Section 1: Parties Schema
export const PartiesSchema = z.object({
  influencerName: z.string().min(3, "Influencer name must be at least 3 characters"),
  influencerCity: z.string().min(2, "City is required"),
  influencerState: z.string().min(2, "State is required"),
  brandName: z.string().min(2, "Brand/Company name is required"),
  brandCity: z.string().min(2, "City is required"),
  brandState: z.string().min(2, "State is required"),
})

// Section 2: Campaign Schema
export const CampaignSchema = z.object({
  platforms: z.array(z.string()).min(1, "At least one platform is required"),
  contentTypes: z.array(z.string()).min(1, "At least one content type is required"),
  deliverables: z.string().min(3, "Deliverables description is required"),
  campaignDescription: z.string().max(300, "Campaign description must be 300 characters or less").optional().or(z.literal("")),
})

// Section 3: Timeline Schema
export const TimelineSchema = z.object({
  contentDeadline: z.string().min(1, "Content posting deadline is required").refine(
    (date) => /^\d{4}-\d{2}-\d{2}$/.test(date),
    "Date must be in YYYY-MM-DD format"
  ),
  brandApprovalRequired: z.boolean(),
})

// Section 4: Payment Schema
export const PaymentSchema = z.object({
  totalAmount: z.number().min(500, "Minimum payment amount is ₹500"),
  paymentStructure: z.enum(["full-after", "half-advance", "full-advance"]),
  paymentTimeline: z.enum(["7-days", "15-days", "custom"]),
  customPaymentDate: z.string().optional(),
  paymentModes: z.array(z.enum(["upi", "bank-transfer", "any"])).min(1, "At least one payment mode is required"),
})

// Section 5: Usage Rights Schema
export const UsageRightsSchema = z.object({
  usageScope: z.enum(["organic-only", "paid-ads", "full-commercial"]),
  usageDuration: z.enum(["3-months", "6-months", "12-months", "lifetime"]),
  creditRequired: z.boolean(),
  contentOwnership: z.enum(["influencer-owns", "brand-owns-edited"]),
})

// Section 6: Exclusivity Schema
export const ExclusivitySchema = z.object({
  exclusivityPeriod: z.enum(["none", "30-days", "60-days", "90-days"]),
  revisionRounds: z.enum(["0", "1", "2", "3"]),
})

// Section 7: Legal Schema
export const LegalSchema = z.object({
  cancellationTerms: z.enum(["no-payment-before", "full-payment-after"]),
  governingState: z.string().min(2, "Governing state is required"),
  agreementDate: z.string().min(1, "Agreement date is required").refine(
    (date) => /^\d{4}-\d{2}-\d{2}$/.test(date),
    "Date must be in YYYY-MM-DD format"
  ),
})

// Section 8: Confirmation Schema
export const ConfirmationSchema = z.object({
  acceptedDisclaimer: z.boolean().refine((val) => val === true, "You must accept the disclaimer to proceed"),
})

// Main form schema combining all sections
export const influencerContractFormSchema = z.object({
  parties: PartiesSchema,
  campaign: CampaignSchema,
  timeline: TimelineSchema,
  payment: PaymentSchema,
  usageRights: UsageRightsSchema,
  exclusivity: ExclusivitySchema,
  legal: LegalSchema,
  confirmation: ConfirmationSchema,
})

// Type inference
export type InfluencerContractFormDataSchema = z.infer<typeof influencerContractFormSchema>

/**
 * Validate a single field
 */
export function validateField(field: string, value: any): string | null {
  try {
    const fieldParts = field.split(".")
    let schema: any = influencerContractFormSchema

    // Navigate through nested objects
    for (const part of fieldParts.slice(0, -1)) {
      schema = schema.shape[part]
    }

    // Validate the final field
    const fieldName = fieldParts[fieldParts.length - 1]
    if (schema?.shape?.[fieldName]) {
      schema.shape[fieldName].parse(value)
    }
    return null
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || "Invalid value"
    }
    return "Validation error"
  }
}

/**
 * Validate entire form
 */
export function validateForm(data: any): Record<string, string> {
  try {
    influencerContractFormSchema.parse(data)
    return {}
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      for (const issue of error.issues) {
        const path = issue.path.join(".")
        if (path) {
          errors[path] = issue.message
        }
      }
      return errors
    }
    return {}
  }
}

/**
 * Validate that content deadline is on or after agreement date
 */
export function validateDeadlineAfterAgreement(agreementDate: string, contentDeadline: string): string | null {
  if (!agreementDate || !contentDeadline) return null
  
  const agreement = new Date(agreementDate)
  const deadline = new Date(contentDeadline)
  
  if (deadline < agreement) {
    return "Content deadline must be on or after the agreement date"
  }
  return null
}
