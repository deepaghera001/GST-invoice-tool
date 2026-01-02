/**
 * Influencer-Brand Contract Calculations
 * Business logic for payment calculations and display helpers
 */

import type { InfluencerContractFormData, PaymentStructure } from "./types"
import {
  INDIAN_STATES,
  PLATFORM_OPTIONS,
  CONTENT_TYPE_OPTIONS,
  USAGE_SCOPE_LABELS,
  USAGE_DURATION_LABELS,
  EXCLUSIVITY_LABELS,
  PAYMENT_STRUCTURE_LABELS,
  PAYMENT_TIMELINE_LABELS,
  CONTENT_OWNERSHIP_LABELS,
  CANCELLATION_LABELS,
} from "./constants"

export interface PaymentBreakdown {
  totalAmount: number
  advanceAmount: number
  remainingAmount: number
  advancePercentage: number
}

export interface InfluencerContractCalculations {
  paymentBreakdown: PaymentBreakdown
  formattedAmount: string
  platformNames: string[]
  contentTypeNames: string[]
  influencerLocation: string
  brandLocation: string
  governingStateName: string
  usageScopeLabel: string
  usageDurationLabel: string
  exclusivityLabel: string
  paymentStructureLabel: string
  paymentTimelineLabel: string
  contentOwnershipLabel: string
  cancellationLabel: string
  formattedAgreementDate: string
  formattedDeadline: string
}

/**
 * Calculate payment breakdown based on payment structure
 */
export function calculatePaymentBreakdown(totalAmount: number, structure: PaymentStructure): PaymentBreakdown {
  switch (structure) {
    case "full-advance":
      return {
        totalAmount,
        advanceAmount: totalAmount,
        remainingAmount: 0,
        advancePercentage: 100,
      }
    case "half-advance":
      const half = Math.round(totalAmount / 2)
      return {
        totalAmount,
        advanceAmount: half,
        remainingAmount: totalAmount - half,
        advancePercentage: 50,
      }
    case "full-after":
    default:
      return {
        totalAmount,
        advanceAmount: 0,
        remainingAmount: totalAmount,
        advancePercentage: 0,
      }
  }
}

/**
 * Format currency in Indian format
 */
export function formatIndianCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`
}

/**
 * Get state name from code
 */
export function getStateName(code: string): string {
  const state = INDIAN_STATES.find((s) => s.code === code)
  return state?.name || code
}

/**
 * Format date for display (DD MMM YYYY)
 */
export function formatDate(dateString: string): string {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  } catch {
    return dateString
  }
}

/**
 * Get platform display names from codes
 */
export function getPlatformNames(platforms: string[]): string[] {
  return platforms.map((p) => {
    const platform = PLATFORM_OPTIONS.find((opt) => opt.value === p)
    return platform?.label || p
  })
}

/**
 * Get content type display names from codes
 */
export function getContentTypeNames(contentTypes: string[]): string[] {
  return contentTypes.map((ct) => {
    const type = CONTENT_TYPE_OPTIONS.find((opt) => opt.value === ct)
    return type?.label || ct
  })
}

/**
 * Main calculation function - generates all display values
 */
export class InfluencerContractCalculator {
  static calculateAll(data: InfluencerContractFormData): InfluencerContractCalculations {
    const paymentBreakdown = calculatePaymentBreakdown(
      data.payment.totalAmount,
      data.payment.paymentStructure
    )

    return {
      paymentBreakdown,
      formattedAmount: formatIndianCurrency(data.payment.totalAmount),
      platformNames: getPlatformNames(data.campaign.platforms),
      contentTypeNames: getContentTypeNames(data.campaign.contentTypes),
      influencerLocation: `${data.parties.influencerCity}, ${getStateName(data.parties.influencerState)}`,
      brandLocation: `${data.parties.brandCity}, ${getStateName(data.parties.brandState)}`,
      governingStateName: getStateName(data.legal.governingState),
      usageScopeLabel: USAGE_SCOPE_LABELS[data.usageRights.usageScope] || data.usageRights.usageScope,
      usageDurationLabel: USAGE_DURATION_LABELS[data.usageRights.usageDuration] || data.usageRights.usageDuration,
      exclusivityLabel: EXCLUSIVITY_LABELS[data.exclusivity.exclusivityPeriod] || data.exclusivity.exclusivityPeriod,
      paymentStructureLabel: PAYMENT_STRUCTURE_LABELS[data.payment.paymentStructure] || data.payment.paymentStructure,
      paymentTimelineLabel: PAYMENT_TIMELINE_LABELS[data.payment.paymentTimeline] || data.payment.paymentTimeline,
      contentOwnershipLabel: CONTENT_OWNERSHIP_LABELS[data.usageRights.contentOwnership] || data.usageRights.contentOwnership,
      cancellationLabel: CANCELLATION_LABELS[data.legal.cancellationTerms] || data.legal.cancellationTerms,
      formattedAgreementDate: formatDate(data.legal.agreementDate),
      formattedDeadline: formatDate(data.timeline.contentDeadline),
    }
  }
}
