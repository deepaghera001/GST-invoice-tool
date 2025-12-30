/**
 * Rent Agreement Validation Schema
 * Zod schema for form validation
 */

import { z } from "zod"
import {
  PHONE_REGEX,
  EMAIL_REGEX,
  PAN_REGEX,
  AADHAR_REGEX,
  PINCODE_REGEX,
} from "./constants"

// Landlord schema
const landlordSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .trim(),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(300, "Address is too long")
    .trim(),
  phone: z
    .string()
    .regex(PHONE_REGEX, "Invalid phone number (10 digits starting with 6-9)"),
  email: z
    .string()
    .regex(EMAIL_REGEX, "Invalid email address")
    .optional()
    .or(z.literal("")),
  panNumber: z
    .string()
    .regex(PAN_REGEX, "Invalid PAN format (e.g., ABCDE1234F)")
    .optional()
    .or(z.literal("")),
  aadharNumber: z
    .string()
    .regex(AADHAR_REGEX, "Invalid Aadhar number (12 digits)")
    .optional()
    .or(z.literal("")),
})

// Tenant schema (same as landlord)
const tenantSchema = landlordSchema

// Property schema
const propertySchema = z.object({
  address: z
    .string()
    .min(10, "Property address must be at least 10 characters")
    .max(500, "Address is too long")
    .trim(),
  city: z
    .string()
    .min(2, "City name must be at least 2 characters")
    .max(100, "City name is too long")
    .trim(),
  state: z.string().min(2, "Please select a state"),
  pincode: z
    .string()
    .regex(PINCODE_REGEX, "Invalid pincode (6 digits)"),
  propertyType: z.enum(["apartment", "house", "room", "commercial", "other"]),
  furnishingStatus: z.enum(["furnished", "semi-furnished", "unfurnished"]),
  area: z.string().optional(),
  floor: z.string().optional(),
  parking: z.boolean().optional(),
})

// Rent terms schema
const rentTermsSchema = z.object({
  monthlyRent: z
    .number()
    .min(1000, "Monthly rent must be at least ₹1,000")
    .max(10000000, "Monthly rent seems too high"),
  securityDeposit: z
    .number()
    .min(0, "Security deposit cannot be negative")
    .max(50000000, "Security deposit seems too high"),
  maintenanceCharges: z.number().min(0).optional(),
  maintenanceIncluded: z.boolean(),
  rentDueDay: z
    .number()
    .min(1, "Due day must be between 1-28")
    .max(28, "Due day must be between 1-28"),
  agreementStartDate: z
    .string()
    .min(1, "Please select agreement start date"),
  agreementDuration: z
    .number()
    .min(1, "Duration must be at least 1 month")
    .max(60, "Duration cannot exceed 60 months"),
  noticePeriod: z
    .number()
    .min(1, "Notice period must be at least 1 month")
    .max(6, "Notice period cannot exceed 6 months"),
  rentIncrementPercent: z.number().min(0).max(20).optional(),
  paymentMode: z.enum(["bank-transfer", "cheque", "cash", "upi"]),
})

// Clauses schema
const clausesSchema = z.object({
  noSubLetting: z.boolean(),
  propertyInspection: z.boolean(),
  repairsResponsibility: z.boolean(),
  utilityPayment: z.boolean(),
  peacefulUse: z.boolean(),
  noIllegalActivity: z.boolean(),
  lockInPeriod: z.boolean(),
  lockInMonths: z.number().min(0).max(12).optional(),
  additionalClauses: z.string().max(2000, "Additional clauses text is too long").optional(),
})

// Full rent agreement schema
export const rentAgreementSchema = z.object({
  landlord: landlordSchema,
  tenant: tenantSchema,
  property: propertySchema,
  rentTerms: rentTermsSchema,
  clauses: clausesSchema,
})

// Field-level schema for individual validation
export const rentAgreementFieldSchema = z.object({
  // Landlord fields
  "landlord.name": landlordSchema.shape.name.optional(),
  "landlord.address": landlordSchema.shape.address.optional(),
  "landlord.phone": landlordSchema.shape.phone.optional(),
  "landlord.email": landlordSchema.shape.email,
  "landlord.panNumber": landlordSchema.shape.panNumber,
  "landlord.aadharNumber": landlordSchema.shape.aadharNumber,
  
  // Tenant fields
  "tenant.name": tenantSchema.shape.name.optional(),
  "tenant.address": tenantSchema.shape.address.optional(),
  "tenant.phone": tenantSchema.shape.phone.optional(),
  "tenant.email": tenantSchema.shape.email,
  "tenant.panNumber": tenantSchema.shape.panNumber,
  "tenant.aadharNumber": tenantSchema.shape.aadharNumber,
  
  // Property fields
  "property.address": propertySchema.shape.address.optional(),
  "property.city": propertySchema.shape.city.optional(),
  "property.state": propertySchema.shape.state.optional(),
  "property.pincode": propertySchema.shape.pincode.optional(),
  "property.propertyType": propertySchema.shape.propertyType.optional(),
  "property.furnishingStatus": propertySchema.shape.furnishingStatus.optional(),
  "property.area": propertySchema.shape.area,
  "property.floor": propertySchema.shape.floor,
  "property.parking": propertySchema.shape.parking,
  
  // Rent terms fields
  "rentTerms.monthlyRent": rentTermsSchema.shape.monthlyRent.optional(),
  "rentTerms.securityDeposit": rentTermsSchema.shape.securityDeposit.optional(),
  "rentTerms.maintenanceCharges": rentTermsSchema.shape.maintenanceCharges,
  "rentTerms.maintenanceIncluded": rentTermsSchema.shape.maintenanceIncluded.optional(),
  "rentTerms.rentDueDay": rentTermsSchema.shape.rentDueDay.optional(),
  "rentTerms.agreementStartDate": rentTermsSchema.shape.agreementStartDate.optional(),
  "rentTerms.agreementDuration": rentTermsSchema.shape.agreementDuration.optional(),
  "rentTerms.noticePeriod": rentTermsSchema.shape.noticePeriod.optional(),
  "rentTerms.rentIncrementPercent": rentTermsSchema.shape.rentIncrementPercent,
  "rentTerms.paymentMode": rentTermsSchema.shape.paymentMode.optional(),
  
  // Clauses fields
  "clauses.lockInMonths": clausesSchema.shape.lockInMonths,
  "clauses.additionalClauses": clausesSchema.shape.additionalClauses,
}).partial()

export type RentAgreementFormDataSchema = z.infer<typeof rentAgreementSchema>
