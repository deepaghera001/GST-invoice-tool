/**
 * Shareholders Agreement Validation Schema
 * Zod schema for form validation
 */

import { z } from "zod"

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Helper for optional boolean fields from select dropdowns (accepts "true", "false", "", or boolean)
const optionalBooleanFromSelect = z.preprocess(
  (val) => {
    if (val === "true") return true
    if (val === "false") return false
    if (val === "" || val === undefined || val === null) return undefined
    return val // pass through actual booleans
  },
  z.boolean().optional()
)

// Company details schema
const companyDetailsSchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(200, "Company name is too long")
    .trim(),
  cin: z
    .string()
    .max(21, "CIN is too long")
    .optional()
    .or(z.literal("")),
  registeredAddress: z
    .string()
    .min(10, "Registered address must be at least 10 characters")
    .max(500, "Address is too long")
    .trim(),
  dateOfAgreement: z
    .string()
    .min(1, "Date of agreement is required"),
  companyType: z
    .enum(["private-limited"], {
      errorMap: () => ({ message: "Company type must be Private Limited" }),
    }),
})

// Shareholder schema
const shareholderSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .trim(),
  email: z
    .string()
    .regex(EMAIL_REGEX, "Invalid email address"),
  address: z
    .string()
    .max(300, "Address is too long")
    .optional()
    .or(z.literal("")),
  shareholding: z
    .number()
    .min(0, "Shareholding cannot be negative")
    .max(100, "Shareholding cannot exceed 100"),
  noOfShares: z
    .number()
    .int("Number of shares must be an integer")
    .min(0, "Number of shares cannot be negative"),
  role: z
    .enum(["founder", "investor", "employee-shareholder"], {
      errorMap: () => ({ message: "Role is required" }),
    }),
})

// Share capital schema
const shareCapitalSchema = z.object({
  authorizedShareCapital: z
    .number()
    .min(1, "Authorized share capital must be at least ₹1"),
  paidUpShareCapital: z
    .number()
    .min(1, "Paid-up capital must be at least ₹1"),
  faceValuePerShare: z
    .number()
    .min(1, "Face value per share must be at least ₹1"),
  issuedShares: z
    .number()
    .int("Issued shares must be a whole number")
    .min(1, "At least 1 share must be issued"),
})

// Board management schema
const boardManagementSchema = z.object({
  totalDirectors: z
    .number()
    .min(1, "Total directors must be at least 1"),
  directorAppointmentBy: z
    .enum(["majority-shareholders", "each-founder"], {
      errorMap: () => ({ message: "Director appointment method is required" }),
    }),
  reservedMatters: z.array(z.string()).optional(),
  boardQuorum: z
    .number()
    .min(1, "Board quorum must be at least 1")
    .optional(),
  boardVotingRule: z
    .enum(["simple-majority", "two-thirds", "unanimous"])
    .optional()
    .or(z.literal("")),
})

// Voting rights schema
const votingRightsSchema = z.object({
  votingBasis: z
    .enum(["one-share-one-vote", "special-voting-rights"], {
      errorMap: () => ({ message: "Voting basis is required" }),
    }),
  decisionsRequire: z
    .enum(["simple-majority", "special-majority-75", "unanimous"], {
      errorMap: () => ({ message: "Decision requirement is required" }),
    }),
  specialMajorityMatters: z.array(z.string()).optional(),
})

// Share transfer schema
const shareTransferSchema = z.object({
  transferAllowed: optionalBooleanFromSelect,
  rightOfFirstRefusal: optionalBooleanFromSelect,
  lockInPeriod: z
    .number()
    .min(0, "Lock-in period cannot be negative")
    .optional(),
})

// Tag along drag along schema
const tagAlongDragAlongSchema = z.object({
  enableTagAlong: optionalBooleanFromSelect,
  tagAlongTriggerPercent: z
    .number()
    .min(0)
    .max(100)
    .optional(),
  enableDragAlong: optionalBooleanFromSelect,
  dragAlongTriggerPercent: z
    .number()
    .min(0)
    .max(100)
    .optional(),
  dragAlongPriceCondition: z
    .enum(["fair-market-value", "board-approved-value", "mutually-agreed"])
    .optional()
    .or(z.literal("")),
})

// Exit buyout schema
const exitBuyoutSchema = z.object({
  exitOptions: z.array(z.string()).optional(),
  valuationMethod: z
    .enum(["fair-market-value", "mutual-agreement", "independent-valuer"], {
      errorMap: () => ({ message: "Valuation method is required" }),
    }),
  buyoutPaymentDays: z
    .number()
    .min(1, "Payment period must be at least 1 day")
    .optional(),
  buyoutFundingSource: z
    .enum(["company", "remaining-shareholders", "buyer"])
    .optional()
    .or(z.literal("")),
})

// Confidentiality schema
const confidentialitySchema = z.object({
  confidentialityClause: optionalBooleanFromSelect,
  nonCompeteDuration: z
    .number()
    .min(0, "Duration cannot be negative")
    .optional(),
  nonSolicitation: optionalBooleanFromSelect,
})

// Deadlock resolution schema
const deadlockResolutionSchema = z.object({
  deadlockResolution: z
    .enum(["arbitration", "mediation", "buy-sell-mechanism"], {
      errorMap: () => ({ message: "Deadlock resolution method is required" }),
    }),
  arbitrationLocation: z
    .string()
    .min(2, "Arbitration location must be at least 2 characters")
    .max(100, "Location is too long")
    .trim(),
  governingLaw: z
    .string()
    .optional()
    .or(z.literal("India")),
})

// Termination schema
const terminationSchema = z.object({
  terminationConditions: z.array(z.string()).optional(),
  noticePeriod: z
    .number()
    .min(0, "Notice period cannot be negative")
    .optional(),
})

// Helper to convert comma-separated string to array
const witnessNamesFromInput = z.preprocess(
  (val) => {
    if (Array.isArray(val)) return val
    if (typeof val === "string") {
      // Split by comma and filter out empty strings
      return val.split(",").map(s => s.trim()).filter(s => s.length > 0)
    }
    return []
  },
  z.array(z.string()).optional()
)

// Signature details schema
const signatureDetailsSchema = z.object({
  placeOfSigning: z
    .string()
    .min(2, "Place of signing must be at least 2 characters")
    .max(100, "Place is too long")
    .trim(),
  noOfWitnesses: z
    .number()
    .min(0, "Number of witnesses cannot be negative")
    .max(10, "Number of witnesses cannot exceed 10"),
  witnessNames: witnessNamesFromInput,
})

/**
 * Base schema without cross-field refinements
 */
const baseShareholdersAgreementSchema = z.object({
  company: companyDetailsSchema,
  shareholders: z
    .array(shareholderSchema)
    .min(2, "At least 2 shareholders are required"),
  shareCapital: shareCapitalSchema,
  boardManagement: boardManagementSchema,
  votingRights: votingRightsSchema,
  shareTransfer: shareTransferSchema,
  tagAlongDragAlong: tagAlongDragAlongSchema,
  exitBuyout: exitBuyoutSchema,
  confidentialityNonCompete: confidentialitySchema,
  deadlockResolution: deadlockResolutionSchema,
  termination: terminationSchema,
  signatureDetails: signatureDetailsSchema,
})

/**
 * Partial schema for individual field validation
 */
export const shareholdersAgreementFieldSchema = baseShareholdersAgreementSchema.partial()

/**
 * Full schema with cross-field validations
 * CRITICAL: Validates capital structure math to prevent legal errors
 */
export const shareholdersAgreementSchema = baseShareholdersAgreementSchema.refine(
  (data) => {
    // Validate total shareholding equals 100%
    const totalShareholding = data.shareholders.reduce((sum, sh) => sum + (sh.shareholding || 0), 0)
    return Math.abs(totalShareholding - 100) < 0.01 // Allow for floating point precision
  },
  {
    message: "Total shareholding must equal 100%",
    path: ["shareholders"],
  }
).refine(
  (data) => {
    // Validate paid-up capital doesn't exceed authorized capital
    return data.shareCapital.paidUpShareCapital <= data.shareCapital.authorizedShareCapital
  },
  {
    message: "Paid-up capital cannot exceed authorized capital",
    path: ["shareCapital"],
  }
).refine(
  (data) => {
    // CRITICAL VALIDATION: Issued Shares × Face Value = Paid-up Capital
    // This is a BLOCKING validation - fatal if broken
    const calculated = data.shareCapital.issuedShares * data.shareCapital.faceValuePerShare
    return Math.abs(calculated - data.shareCapital.paidUpShareCapital) < 1
  },
  {
    message: "FATAL: Paid-up capital must equal issued shares × face value per share. Fix: Ensure issued shares × ₹(face value) = ₹(paid-up capital)",
    path: ["shareCapital"],
  }
).refine(
  (data) => {
    // Validate that total shares issued matches shareholder share count
    // Sum of individual shareholder shares should equal or match issued shares
    if (!data.shareholders || data.shareholders.length === 0) return true
    
    const totalSharesHeld = data.shareholders.reduce((sum, sh) => sum + (sh.noOfShares || 0), 0)
    
    // If total shares held is 0, skip this validation (shareholders haven't been assigned shares yet)
    if (totalSharesHeld === 0) return true
    
    // Total shares held should not exceed issued shares
    return totalSharesHeld <= data.shareCapital.issuedShares
  },
  (data) => {
    const totalSharesHeld = data.shareholders.reduce((sum, sh) => sum + (sh.noOfShares || 0), 0)
    const issuedShares = data.shareCapital.issuedShares
    return {
      message: `Capital Structure Mismatch: Total shareholder shares (${totalSharesHeld}) exceed issued shares (${issuedShares}). Fix: Increase 'Issued Shares' in Share Capital section or reduce individual shareholder share allocations.`,
      path: ["shareholders"],
    }
  }
)

export type ShareholdersAgreementFormData = z.infer<typeof shareholdersAgreementSchema>
