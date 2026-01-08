/**
 * Influencer-Brand Contract Domain Layer
 * Barrel exports for all contract-related functionality
 */

// Types
export * from "./types"

// Constants
export * from "./constants"

// Schema and validation
export {
  PartiesSchema,
  CampaignSchema,
  TimelineSchema,
  PaymentSchema,
  UsageRightsSchema,
  ExclusivitySchema,
  LegalSchema,
  ConfirmationSchema,
  influencerContractFormSchema,
  validateField,
  validateForm,
  validateDeadlineAfterAgreement,
} from "./schema"
export type { InfluencerContractFormDataSchema } from "./schema"

// Calculations
export {
  InfluencerContractCalculator,
  calculatePaymentBreakdown,
  formatIndianCurrency,
  getStateName,
  formatDate,
  getPlatformNames,
  getContentTypeNames,
} from "./calculations"
export type { PaymentBreakdown, InfluencerContractCalculations } from "./calculations"
