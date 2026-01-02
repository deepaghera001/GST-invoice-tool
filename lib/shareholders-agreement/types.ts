/**
 * Shareholders Agreement Domain Models
 * All type definitions for shareholders agreement form and generation
 */

export interface CompanyDetails {
  companyName: string
  cin?: string
  registeredAddress: string
  dateOfAgreement: string // YYYY-MM-DD
  companyType: "private-limited" | "llp" // | "other"
}

export interface Shareholder {
  name: string
  email: string
  address: string
  shareholding: number // %
  noOfShares: number
  role: "founder" | "investor" | "employee-shareholder"
}

export interface ShareCapitalOwnership {
  authorizedShareCapital: number // ₹
  paidUpShareCapital: number // ₹
  faceValuePerShare: number // ₹
}

export interface BoardManagementControl {
  totalDirectors: number
  directorAppointmentBy: "majority-shareholders" | "each-founder"
  reservedMatters?: string[] // ["issue-new-shares", "change-business", "borrowing-money", "sale-assets"]
  boardQuorum?: number // minimum directors for quorum
  boardVotingRule?: "simple-majority" | "two-thirds" | "unanimous"
}

export interface VotingRights {
  votingBasis: "one-share-one-vote" | "special-voting-rights"
  decisionsRequire: "simple-majority" | "special-majority-75" | "unanimous"
  specialMajorityMatters?: string[] // matters requiring 75% approval
}

export interface ShareTransferRestrictions {
  transferAllowed?: boolean
  rightOfFirstRefusal?: boolean
  lockInPeriod?: number // in months
}

export interface TagAlongDragAlong {
  enableTagAlong?: boolean
  tagAlongTriggerPercent?: number // 1-100
  enableDragAlong?: boolean
  dragAlongTriggerPercent?: number // 1-100
  dragAlongPriceCondition?: "fair-market-value" | "board-approved-value" | "mutually-agreed"
}

export interface ExitBuyoutClauses {
  exitOptions?: string[] // ["buy-back-company", "sale-third-party", "ipo"]
  valuationMethod: "fair-market-value" | "mutual-agreement" | "independent-valuer"
  buyoutPaymentDays?: number // payment timeline in days
  buyoutFundingSource?: "company" | "remaining-shareholders" | "buyer"
}

export interface ConfidentialityNonCompete {
  confidentialityClause?: boolean
  nonCompeteDuration?: number // in months
  nonSolicitation?: boolean
}

export interface DeadlockDisputeResolution {
  deadlockResolution: "arbitration" | "mediation" | "buy-sell-mechanism"
  arbitrationLocation: string
  governingLaw: string // Always "India"
}

export interface Termination {
  terminationConditions?: string[] // ["mutual-consent", "insolvency", "breach-terms"]
  noticePeriod?: number // in days
}

export interface SignatureDetails {
  placeOfSigning: string
  noOfWitnesses: number // default 2
  witnessNames?: string | string[] // comma-separated string from form input, converted to array for storage
}

export interface ShareholdersAgreementFormData {
  company: CompanyDetails
  shareholders: Shareholder[]
  shareCapital: ShareCapitalOwnership
  boardManagement: BoardManagementControl
  votingRights: VotingRights
  shareTransfer: ShareTransferRestrictions
  tagAlongDragAlong: TagAlongDragAlong
  exitBuyout: ExitBuyoutClauses
  confidentialityNonCompete: ConfidentialityNonCompete
  deadlockResolution: DeadlockDisputeResolution
  termination: Termination
  signatureDetails: SignatureDetails
}

export interface ShareholdersAgreementCalculations {
  totalSharesIssued?: number
  totalShareholdingVerified: boolean
  averageShareValue?: number
}

export type ShareholdersAgreementValidationErrors = Partial<Record<string, string>>

export interface ShareholdersAgreementCalculatedData {
  formData: ShareholdersAgreementFormData
  calculations: ShareholdersAgreementCalculations
}
