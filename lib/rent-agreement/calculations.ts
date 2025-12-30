/**
 * Rent Agreement Calculations
 * Business logic for calculating agreement values
 */

import type { RentAgreementFormData, RentAgreementCalculations } from "./types"
import { INDIAN_STATES } from "./constants"

/**
 * Calculate rent agreement derived values
 */
export function calculateRentAgreement(data: RentAgreementFormData): RentAgreementCalculations {
  const { rentTerms, property } = data

  // Calculate total security deposit
  const totalSecurityDeposit = rentTerms.securityDeposit || 0

  // Calculate first month total
  const maintenance = rentTerms.maintenanceIncluded ? 0 : (rentTerms.maintenanceCharges || 0)
  const firstMonthTotal = (rentTerms.monthlyRent || 0) + maintenance + totalSecurityDeposit

  // Calculate agreement end date
  const agreementEndDate = calculateEndDate(
    rentTerms.agreementStartDate,
    rentTerms.agreementDuration || 11
  )

  // Calculate stamp duty estimate (varies by state)
  const stampDutyEstimate = calculateStampDuty(
    rentTerms.monthlyRent || 0,
    rentTerms.agreementDuration || 11,
    property.state
  )

  // Registration fee (typically ₹500-1000 in most states)
  const registrationFee = 500

  return {
    totalSecurityDeposit,
    firstMonthTotal,
    agreementEndDate,
    stampDutyEstimate,
    registrationFee,
  }
}

/**
 * Calculate agreement end date from start date and duration
 */
function calculateEndDate(startDate: string, durationMonths: number): string {
  if (!startDate) return ""
  
  try {
    const date = new Date(startDate)
    date.setMonth(date.getMonth() + durationMonths)
    date.setDate(date.getDate() - 1) // End date is day before
    return date.toISOString().split("T")[0]
  } catch {
    return ""
  }
}

/**
 * Calculate stamp duty based on state and rent value
 * Note: This is an estimate. Actual rates vary by state and property type.
 */
function calculateStampDuty(
  monthlyRent: number,
  durationMonths: number,
  stateCode: string
): number {
  const state = INDIAN_STATES.find((s) => s.code === stateCode)
  const stampDutyPercent = state?.stampDutyPercent || 2

  // Total rent for the agreement period
  const totalRent = monthlyRent * durationMonths

  // Stamp duty calculation (percentage of total rent)
  // Most states calculate on total rent value
  let stampDuty = (totalRent * stampDutyPercent) / 100

  // Minimum stamp duty in most states
  const minimumStampDuty = 100
  stampDuty = Math.max(stampDuty, minimumStampDuty)

  // Round to nearest 10
  return Math.ceil(stampDuty / 10) * 10
}

/**
 * Format date for display
 */
export function formatAgreementDate(dateStr: string): string {
  if (!dateStr) return "Not specified"
  
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

/**
 * Get duration text
 */
export function getDurationText(months: number): string {
  if (months === 11) return "Eleven Months"
  if (months === 12) return "One Year"
  if (months === 24) return "Two Years"
  if (months === 36) return "Three Years"
  return `${months} Months`
}

/**
 * Convert number to words for agreement
 */
export function amountToWords(amount: number): string {
  if (amount === 0) return "Zero"
  
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ]
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ]

  function convertLessThanThousand(n: number): string {
    if (n === 0) return ""
    if (n < 20) return ones[n]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "")
    return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convertLessThanThousand(n % 100) : "")
  }

  function convert(n: number): string {
    if (n === 0) return "Zero"
    
    let result = ""
    
    // Crores (10,000,000)
    if (n >= 10000000) {
      result += convertLessThanThousand(Math.floor(n / 10000000)) + " Crore "
      n %= 10000000
    }
    
    // Lakhs (100,000)
    if (n >= 100000) {
      result += convertLessThanThousand(Math.floor(n / 100000)) + " Lakh "
      n %= 100000
    }
    
    // Thousands
    if (n >= 1000) {
      result += convertLessThanThousand(Math.floor(n / 1000)) + " Thousand "
      n %= 1000
    }
    
    // Hundreds
    if (n > 0) {
      result += convertLessThanThousand(n)
    }
    
    return result.trim()
  }

  return convert(Math.floor(amount)) + " Rupees Only"
}
