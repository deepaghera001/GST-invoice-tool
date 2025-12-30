/**
 * Rent Agreement Module - Public API
 * Export only what's needed by other parts of the application
 */

// Types
export type {
  LandlordDetails,
  TenantDetails,
  PropertyDetails,
  RentTerms,
  AgreementClauses,
  RentAgreementFormData,
  RentAgreementCalculations,
  RentAgreementValidationErrors,
  RentAgreementCalculatedData,
} from "./types"

// Schemas
export { rentAgreementSchema, rentAgreementFieldSchema, type RentAgreementFormDataSchema } from "./schema"

// Calculations
export { 
  calculateRentAgreement, 
  formatAgreementDate, 
  getDurationText,
  amountToWords,
} from "./calculations"

// Constants
export {
  PHONE_REGEX,
  EMAIL_REGEX,
  PAN_REGEX,
  AADHAR_REGEX,
  PINCODE_REGEX,
  PROPERTY_TYPES,
  FURNISHING_OPTIONS,
  DURATION_OPTIONS,
  NOTICE_PERIOD_OPTIONS,
  PAYMENT_MODES,
  RENT_DUE_DAYS,
  INDIAN_STATES,
  DEFAULT_RENT_AGREEMENT_DATA,
  STANDARD_CLAUSES,
} from "./constants"
