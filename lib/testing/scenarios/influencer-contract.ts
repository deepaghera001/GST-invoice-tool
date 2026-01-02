/**
 * Influencer Contract Test Scenarios
 * Test data for the influencer-brand collaboration contract form
 */

import type { InfluencerContractFormData } from "@/lib/influencer-contract"
import type { TestScenario } from "../types"

// Helper to get today's date
const getTodayDate = () => new Date().toISOString().split("T")[0]

// Helper to get future date
const getFutureDate = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split("T")[0]
}

export const influencerContractScenarios: TestScenario<Partial<InfluencerContractFormData>>[] = [
  {
    id: "complete-valid",
    name: "Complete Valid Contract",
    category: "valid",
    description: "All fields filled correctly - ready to generate",
    data: {
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
        contentDeadline: getFutureDate(30),
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
    },
  },
  {
    id: "high-value-campaign",
    name: "High-Value Campaign",
    category: "valid",
    description: "Premium influencer deal with full commercial rights",
    data: {
      parties: {
        influencerName: "Aditya Kumar",
        influencerCity: "Delhi",
        influencerState: "DL",
        brandName: "Premium Fashion House Ltd",
        brandCity: "Mumbai",
        brandState: "MH",
      },
      campaign: {
        platforms: ["instagram", "youtube", "facebook"],
        contentTypes: ["reel", "post", "long-form-video"],
        deliverables: "1 YouTube Video (10 min) + 4 Reels + 6 Posts",
        campaignDescription: "Annual brand ambassador campaign for luxury fashion line",
      },
      timeline: {
        contentDeadline: getFutureDate(60),
        brandApprovalRequired: true,
      },
      payment: {
        totalAmount: 500000,
        paymentStructure: "half-advance",
        paymentTimeline: "15-days",
        customPaymentDate: "",
        paymentModes: ["bank-transfer"],
      },
      usageRights: {
        usageScope: "full-commercial",
        usageDuration: "12-months",
        creditRequired: true,
        contentOwnership: "brand-owns-edited",
      },
      exclusivity: {
        exclusivityPeriod: "90-days",
        revisionRounds: "3",
      },
      legal: {
        cancellationTerms: "full-payment-after",
        governingState: "MH",
        agreementDate: getTodayDate(),
      },
      confirmation: {
        acceptedDisclaimer: true,
      },
    },
  },
  {
    id: "micro-influencer",
    name: "Micro-Influencer Deal",
    category: "valid",
    description: "Small budget campaign with basic terms",
    data: {
      parties: {
        influencerName: "Sneha Patel",
        influencerCity: "Ahmedabad",
        influencerState: "GJ",
        brandName: "Local Cafe & Bakery",
        brandCity: "Ahmedabad",
        brandState: "GJ",
      },
      campaign: {
        platforms: ["instagram"],
        contentTypes: ["story", "post"],
        deliverables: "2 Posts + 5 Stories",
        campaignDescription: "Food review and cafe promotion",
      },
      timeline: {
        contentDeadline: getFutureDate(14),
        brandApprovalRequired: false,
      },
      payment: {
        totalAmount: 5000,
        paymentStructure: "full-after",
        paymentTimeline: "7-days",
        customPaymentDate: "",
        paymentModes: ["upi"],
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
        governingState: "GJ",
        agreementDate: getTodayDate(),
      },
      confirmation: {
        acceptedDisclaimer: true,
      },
    },
  },
  {
    id: "youtube-only",
    name: "YouTube Creator Deal",
    category: "valid",
    description: "Long-form video content creation",
    data: {
      parties: {
        influencerName: "Rahul Tech Reviews",
        influencerCity: "Hyderabad",
        influencerState: "TS",
        brandName: "TechGadgets India Pvt Ltd",
        brandCity: "Bangalore",
        brandState: "KA",
      },
      campaign: {
        platforms: ["youtube"],
        contentTypes: ["long-form-video", "shorts"],
        deliverables: "1 Detailed Review Video (15 min) + 3 Shorts",
        campaignDescription: "Product review and unboxing of new smartphone",
      },
      timeline: {
        contentDeadline: getFutureDate(21),
        brandApprovalRequired: true,
      },
      payment: {
        totalAmount: 75000,
        paymentStructure: "full-advance",
        paymentTimeline: "7-days",
        customPaymentDate: "",
        paymentModes: ["bank-transfer"],
      },
      usageRights: {
        usageScope: "paid-ads",
        usageDuration: "lifetime",
        creditRequired: false,
        contentOwnership: "brand-owns-edited",
      },
      exclusivity: {
        exclusivityPeriod: "60-days",
        revisionRounds: "2",
      },
      legal: {
        cancellationTerms: "full-payment-after",
        governingState: "KA",
        agreementDate: getTodayDate(),
      },
      confirmation: {
        acceptedDisclaimer: true,
      },
    },
  },
  {
    id: "partial-parties-only",
    name: "Parties Only",
    category: "partial",
    description: "Only party information filled",
    data: {
      parties: {
        influencerName: "Test Influencer",
        influencerCity: "Test City",
        influencerState: "MH",
        brandName: "Test Brand Pvt Ltd",
        brandCity: "Brand City",
        brandState: "DL",
      },
    },
  },
  {
    id: "edge-minimum-payment",
    name: "Minimum Payment",
    category: "edge-case",
    description: "Tests minimum payment amount (₹500)",
    data: {
      parties: {
        influencerName: "Min Pay Test",
        influencerCity: "Mumbai",
        influencerState: "MH",
        brandName: "Budget Brand",
        brandCity: "Delhi",
        brandState: "DL",
      },
      campaign: {
        platforms: ["instagram"],
        contentTypes: ["story"],
        deliverables: "3 Stories",
        campaignDescription: "",
      },
      timeline: {
        contentDeadline: getFutureDate(7),
        brandApprovalRequired: false,
      },
      payment: {
        totalAmount: 500,
        paymentStructure: "full-after",
        paymentTimeline: "7-days",
        customPaymentDate: "",
        paymentModes: ["upi"],
      },
      usageRights: {
        usageScope: "organic-only",
        usageDuration: "3-months",
        creditRequired: true,
        contentOwnership: "influencer-owns",
      },
      exclusivity: {
        exclusivityPeriod: "none",
        revisionRounds: "0",
      },
      legal: {
        cancellationTerms: "no-payment-before",
        governingState: "MH",
        agreementDate: getTodayDate(),
      },
      confirmation: {
        acceptedDisclaimer: true,
      },
    },
  },
  {
    id: "invalid-below-minimum",
    name: "Below Minimum Payment",
    category: "invalid",
    description: "Payment below ₹500 minimum - should show error",
    data: {
      payment: {
        totalAmount: 100,
        paymentStructure: "full-after",
        paymentTimeline: "7-days",
        customPaymentDate: "",
        paymentModes: [],
      },
    },
    expectedErrors: ["payment.totalAmount", "payment.paymentModes"],
  },
]
