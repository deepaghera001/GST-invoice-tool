/**
 * Rent Agreement Constants
 * Default values, options, and configuration
 */

import type { RentAgreementFormData } from "./types"

// Regex patterns
export const PHONE_REGEX = /^[6-9]\d{9}$/
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
export const AADHAR_REGEX = /^\d{12}$/
export const PINCODE_REGEX = /^\d{6}$/

// Property types
export const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment / Flat" },
  { value: "house", label: "Independent House" },
  { value: "room", label: "Single Room" },
  { value: "commercial", label: "Commercial Space" },
  { value: "other", label: "Other" },
] as const

// Furnishing status
export const FURNISHING_OPTIONS = [
  { value: "furnished", label: "Fully Furnished" },
  { value: "semi-furnished", label: "Semi Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
] as const

// Agreement duration options
export const DURATION_OPTIONS = [
  { value: 11, label: "11 Months" },
  { value: 12, label: "12 Months (1 Year)" },
  { value: 24, label: "24 Months (2 Years)" },
  { value: 36, label: "36 Months (3 Years)" },
] as const

// Notice period options
export const NOTICE_PERIOD_OPTIONS = [
  { value: 1, label: "1 Month" },
  { value: 2, label: "2 Months" },
  { value: 3, label: "3 Months" },
] as const

// Payment modes
export const PAYMENT_MODES = [
  { value: "bank-transfer", label: "Bank Transfer / NEFT / IMPS" },
  { value: "upi", label: "UPI" },
  { value: "cheque", label: "Cheque" },
  { value: "cash", label: "Cash" },
] as const

// Rent due day options
export const RENT_DUE_DAYS = Array.from({ length: 28 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}${getOrdinalSuffix(i + 1)} of every month`,
}))

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}

// Indian states with stamp duty rates (approximate)
export const INDIAN_STATES = [
  { code: "AN", name: "Andaman and Nicobar Islands", stampDutyPercent: 3 },
  { code: "AP", name: "Andhra Pradesh", stampDutyPercent: 5 },
  { code: "AR", name: "Arunachal Pradesh", stampDutyPercent: 6 },
  { code: "AS", name: "Assam", stampDutyPercent: 8.25 },
  { code: "BR", name: "Bihar", stampDutyPercent: 6 },
  { code: "CG", name: "Chhattisgarh", stampDutyPercent: 5 },
  { code: "CH", name: "Chandigarh", stampDutyPercent: 3 },
  { code: "DD", name: "Dadra and Nagar Haveli and Daman and Diu", stampDutyPercent: 3 },
  { code: "DL", name: "Delhi", stampDutyPercent: 2 },
  { code: "GA", name: "Goa", stampDutyPercent: 3.5 },
  { code: "GJ", name: "Gujarat", stampDutyPercent: 4.9 },
  { code: "HP", name: "Himachal Pradesh", stampDutyPercent: 5 },
  { code: "HR", name: "Haryana", stampDutyPercent: 2 },
  { code: "JH", name: "Jharkhand", stampDutyPercent: 4 },
  { code: "JK", name: "Jammu and Kashmir", stampDutyPercent: 5 },
  { code: "KA", name: "Karnataka", stampDutyPercent: 1 },
  { code: "KL", name: "Kerala", stampDutyPercent: 8 },
  { code: "LA", name: "Ladakh", stampDutyPercent: 5 },
  { code: "LD", name: "Lakshadweep", stampDutyPercent: 3 },
  { code: "MH", name: "Maharashtra", stampDutyPercent: 0.25 },
  { code: "ML", name: "Meghalaya", stampDutyPercent: 5 },
  { code: "MN", name: "Manipur", stampDutyPercent: 7 },
  { code: "MP", name: "Madhya Pradesh", stampDutyPercent: 2 },
  { code: "MZ", name: "Mizoram", stampDutyPercent: 5 },
  { code: "NL", name: "Nagaland", stampDutyPercent: 8.25 },
  { code: "OD", name: "Odisha", stampDutyPercent: 5 },
  { code: "PB", name: "Punjab", stampDutyPercent: 3 },
  { code: "PY", name: "Puducherry", stampDutyPercent: 6 },
  { code: "RJ", name: "Rajasthan", stampDutyPercent: 1 },
  { code: "SK", name: "Sikkim", stampDutyPercent: 5 },
  { code: "TN", name: "Tamil Nadu", stampDutyPercent: 1 },
  { code: "TS", name: "Telangana", stampDutyPercent: 0.4 },
  { code: "TR", name: "Tripura", stampDutyPercent: 5 },
  { code: "UK", name: "Uttarakhand", stampDutyPercent: 5 },
  { code: "UP", name: "Uttar Pradesh", stampDutyPercent: 2 },
  { code: "WB", name: "West Bengal", stampDutyPercent: 0.25 },
] as const

// Default form values
export const DEFAULT_RENT_AGREEMENT_DATA: RentAgreementFormData = {
  landlord: {
    name: "",
    address: "",
    phone: "",
    email: "",
    panNumber: "",
    aadharNumber: "",
  },
  tenant: {
    name: "",
    address: "",
    phone: "",
    email: "",
    panNumber: "",
    aadharNumber: "",
  },
  property: {
    address: "",
    city: "",
    state: "MH",
    pincode: "",
    propertyType: "apartment",
    furnishingStatus: "unfurnished",
    area: "",
    floor: "",
    parking: false,
  },
  rentTerms: {
    monthlyRent: 0,
    securityDeposit: 0,
    maintenanceCharges: 0,
    maintenanceIncluded: true,
    rentDueDay: 1,
    agreementStartDate: "",
    agreementDuration: 11,
    noticePeriod: 1,
    rentIncrementPercent: 5,
    paymentMode: "bank-transfer",
  },
  clauses: {
    noSubLetting: true,
    propertyInspection: true,
    repairsResponsibility: true,
    utilityPayment: true,
    peacefulUse: true,
    noIllegalActivity: true,
    lockInPeriod: false,
    lockInMonths: 0,
    additionalClauses: "",
  },
}

// Standard clauses text
export const STANDARD_CLAUSES = {
  noSubLetting: "The Tenant shall not sublet, assign, or transfer the premises or any part thereof to any other person without the prior written consent of the Landlord.",
  propertyInspection: "The Landlord or their authorized representative shall have the right to inspect the premises with prior notice of at least 24 hours, at reasonable hours.",
  repairsResponsibility: "Minor repairs and day-to-day maintenance shall be the responsibility of the Tenant. Major structural repairs shall be the responsibility of the Landlord.",
  utilityPayment: "The Tenant shall be responsible for payment of electricity, water, gas, internet, and other utility bills during the tenancy period.",
  peacefulUse: "The Tenant shall use the premises for residential purposes only and shall not cause any nuisance or disturbance to neighbors.",
  noIllegalActivity: "The Tenant shall not use the premises for any illegal, immoral, or objectionable purposes.",
  lockInPeriod: "Both parties agree to a lock-in period during which neither party can terminate the agreement except for breach of terms.",
} as const
