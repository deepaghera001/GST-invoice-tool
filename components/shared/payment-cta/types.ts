/**
 * Payment CTA Types
 * Shared types for payment call-to-action components
 */

export interface PaymentCTAProps {
  /** Whether the form is complete and ready to submit */
  isFormComplete: boolean
  /** Price in rupees */
  price: number
  /** Document type for display text */
  documentType: "salary-slip" | "invoice" | "rent-agreement" | "gst-summary" | "tds-certificate" | "shareholders-agreement" | "influencer-contract"
  /** Optional custom CTA text when complete */
  ctaText?: string
  /** Optional custom disabled text */
  incompleteText?: string
  /** Whether in test mode (free download) */
  isTestMode?: boolean
  /** 
   * Called when payment is successful (or test mode download clicked)
   * Should return a Promise that resolves when PDF is generated/downloaded
   */
  onPaymentSuccess: () => Promise<void>
  /** Optional callback when payment fails */
  onPaymentError?: (error: string) => void
  /** Number of completed sections (optional, for progress display) */
  completedSections?: number
  /** Total sections (optional, for progress display) */
  totalSections?: number
  /** Payment description (for Razorpay checkout) */
  paymentDescription?: string
}

export interface FormProgressProps {
  /** Number of completed sections */
  completedSections: number
  /** Total number of sections */
  totalSections: number
  /** Whether form is complete */
  isComplete: boolean
  /** Optional section labels for detailed progress */
  sectionLabels?: string[]
  /** Optional completion status per section */
  sectionStatus?: Record<string, boolean>
}

/** Document type display names */
export const DOCUMENT_DISPLAY_NAMES: Record<PaymentCTAProps["documentType"], string> = {
  "salary-slip": "Salary Slip",
  "invoice": "GST Invoice",
  "rent-agreement": "Rent Agreement",
  "gst-summary": "GST Summary",
  "tds-certificate": "TDS Certificate",
  "shareholders-agreement": "Shareholders Agreement",
  "influencer-contract": "Influencer-Brand Contract",
}

/** Default prices per document type */
export const DEFAULT_PRICES: Record<PaymentCTAProps["documentType"], number> = {
  "salary-slip": 49,
  "invoice": 49,
  "rent-agreement": 99,
  "gst-summary": 49,
  "tds-certificate": 49,
  "shareholders-agreement": 199,
  "influencer-contract": 499,
}
