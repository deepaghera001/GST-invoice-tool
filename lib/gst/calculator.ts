/**
 * GST Penalty Calculator
 * 
 * Legal Basis:
 * - CGST Act, 2017: Section 47 (Late Fee) & Section 50 (Interest)
 * - CBIC Notifications for caps and rate changes
 * 
 * Official Sources:
 * - https://taxinformation.cbic.gov.in
 * - https://cbic-gst.gov.in
 * - https://www.gst.gov.in
 * 
 * DISCLAIMER:
 * Late fee and interest rates are subject to change via government notifications.
 * This calculator follows current CBIC notifications (as of December 2024).
 * Always verify with official GST portal for your specific filing period.
 * This tool is for estimation purposes only and should not be used as legal advice.
 */

// =============================================================================
// NOTIFICATION-DRIVEN CONFIGURATION
// Rates and caps as per latest CBIC notifications
// Easy to update when new notifications are issued
// =============================================================================

export interface GSTNotificationConfig {
  returnType: string;
  dailyFeeCGST: number;   // CGST late fee per day
  dailyFeeSGST: number;   // SGST late fee per day
  maxCapCGST: number;     // Maximum CGST late fee
  maxCapSGST: number;     // Maximum SGST late fee
  effectiveFrom: string;  // When this rate became effective
  notificationRef: string; // Reference notification number
}

/**
 * GST Late Fee Configuration as per CBIC Notifications
 * 
 * Current rates (CGST Act Section 47 + Notification 19/2021, 20/2021):
 * - GSTR-3B/GSTR-1 (Regular): ₹100/day total (₹50 CGST + ₹50 SGST), max ₹5,000
 * - GSTR-3B/GSTR-1 (NIL): ₹20/day total (₹10 CGST + ₹10 SGST), max ₹500
 * - GSTR-9 (Annual): ₹200/day total (₹100 CGST + ₹100 SGST), max ₹5,000
 * 
 * IMPORTANT: Notification 19/2021 reduced the MAXIMUM CAP (not the daily rate).
 * Daily rate remains ₹100/day as per Section 47. Cap reduced from ₹10,000 to ₹5,000.
 */
export const GST_LATE_FEE_CONFIG: Record<string, GSTNotificationConfig> = {
  // GSTR-3B - Regular Return (with tax liability)
  'GSTR3B': {
    returnType: 'GSTR-3B',
    dailyFeeCGST: 50,      // ₹50/day CGST (Section 47)
    dailyFeeSGST: 50,      // ₹50/day SGST (Section 47)
    maxCapCGST: 2500,      // Max ₹2,500 CGST (Notification 19/2021)
    maxCapSGST: 2500,      // Max ₹2,500 SGST (Notification 19/2021)
    effectiveFrom: '2021-06-01',
    notificationRef: 'Section 47 (rate) + Notification 19/2021 (cap)',
  },
  
  // GSTR-3B - NIL Return (zero tax liability)
  'GSTR3B_NIL': {
    returnType: 'GSTR-3B (NIL)',
    dailyFeeCGST: 10,      // ₹10/day CGST
    dailyFeeSGST: 10,      // ₹10/day SGST
    maxCapCGST: 250,       // Max ₹250 CGST
    maxCapSGST: 250,       // Max ₹250 SGST
    effectiveFrom: '2021-06-01',
    notificationRef: 'Notification No. 19/2021 & subsequent amendments',
  },
  
  // GSTR-1 - Regular Return
  'GSTR1': {
    returnType: 'GSTR-1',
    dailyFeeCGST: 50,      // ₹50/day CGST (Section 47)
    dailyFeeSGST: 50,      // ₹50/day SGST (Section 47)
    maxCapCGST: 2500,      // Max ₹2,500 CGST (Notification 20/2021)
    maxCapSGST: 2500,      // Max ₹2,500 SGST (Notification 20/2021)
    effectiveFrom: '2021-06-01',
    notificationRef: 'Section 47 (rate) + Notification 20/2021 (cap)',
  },
  
  // GSTR-1 - NIL Return
  'GSTR1_NIL': {
    returnType: 'GSTR-1 (NIL)',
    dailyFeeCGST: 10,      // ₹10/day CGST
    dailyFeeSGST: 10,      // ₹10/day SGST
    maxCapCGST: 250,       // Max ₹250 CGST
    maxCapSGST: 250,       // Max ₹250 SGST
    effectiveFrom: '2021-06-01',
    notificationRef: 'Notification No. 20/2021 & subsequent amendments',
  },
  
  // GSTR-9 - Annual Return
  'GSTR9': {
    returnType: 'GSTR-9',
    dailyFeeCGST: 100,     // ₹100/day CGST
    dailyFeeSGST: 100,     // ₹100/day SGST
    maxCapCGST: 2500,      // Max ₹2,500 CGST (0.25% of turnover cap also applies)
    maxCapSGST: 2500,      // Max ₹2,500 SGST
    effectiveFrom: '2022-07-05',
    notificationRef: 'Notification No. 07/2022 & subsequent amendments',
  },
};

/**
 * Interest rate on late payment of tax (Section 50)
 * Rate: 18% per annum
 * Source: Section 50 of CGST Act + Notification No. 13/2017
 */
export const GST_INTEREST_RATE = 0.18; // 18% per annum

// =============================================================================
// TYPES
// =============================================================================

export type GSTReturnType = 'GSTR1' | 'GSTR3B' | 'GSTR9';

export interface GSTPenaltyInput {
  returnType: GSTReturnType;
  taxAmount: number;       // Tax liability in rupees (0 for NIL return)
  dueDate: Date;
  filingDate: Date;
  taxPaidLate: boolean;    // Was tax payment also late?
}

export interface GSTPenaltyOutput {
  daysLate: number;
  lateFee: number;
  interest: number;
  totalPenalty: number;
  riskLevel: 'safe' | 'warning' | 'critical';
  summary: string;
  isNilReturn: boolean;
  breakdown: {
    cgstLateFee: number;
    sgstLateFee: number;
    dailyRate: number;
    maxCap: number;
    interestRate: string;
  };
  legalReference: {
    lateFeeSection: string;
    interestSection: string;
    notification: string;
  };
  disclaimer: string;
}

// =============================================================================
// CALCULATOR FUNCTION
// =============================================================================

export function calculateGSTPenalty(input: GSTPenaltyInput): GSTPenaltyOutput {
  // Input validation
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid input: must be an object');
  }

  const validReturnTypes: GSTReturnType[] = ['GSTR1', 'GSTR3B', 'GSTR9'];
  if (!validReturnTypes.includes(input.returnType)) {
    throw new Error('Invalid return type: must be GSTR1, GSTR3B, or GSTR9');
  }

  if (typeof input.taxAmount !== 'number' || input.taxAmount < 0) {
    throw new Error('Tax amount must be a non-negative number');
  }

  if (!(input.dueDate instanceof Date) || isNaN(input.dueDate.getTime())) {
    throw new Error('Invalid due date');
  }

  if (!(input.filingDate instanceof Date) || isNaN(input.filingDate.getTime())) {
    throw new Error('Invalid filing date');
  }

  // Determine if NIL return
  const isNilReturn = input.taxAmount === 0;

  // Get the correct configuration based on return type and NIL status
  const configKey = getConfigKey(input.returnType, isNilReturn);
  const config = GST_LATE_FEE_CONFIG[configKey];

  // Standard disclaimer
  const disclaimer = 'Late fee and interest are subject to change via government notifications. ' +
    'This calculator follows current CBIC notifications and may not apply to past periods. ' +
    'Please verify with official GST portal for your specific filing period.';

  // Check if filing date is before or on due date (on time)
  if (input.filingDate <= input.dueDate) {
    return {
      daysLate: 0,
      lateFee: 0,
      interest: 0,
      totalPenalty: 0,
      riskLevel: 'safe',
      summary: 'Your return is filed on time. No penalty applicable.',
      isNilReturn,
      breakdown: {
        cgstLateFee: 0,
        sgstLateFee: 0,
        dailyRate: config.dailyFeeCGST + config.dailyFeeSGST,
        maxCap: config.maxCapCGST + config.maxCapSGST,
        interestRate: '18% p.a.',
      },
      legalReference: {
        lateFeeSection: 'CGST Act Section 47',
        interestSection: 'CGST Act Section 50',
        notification: config.notificationRef,
      },
      disclaimer,
    };
  }

  // Calculate days late (from day after due date)
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLate = Math.ceil(
    (input.filingDate.getTime() - input.dueDate.getTime()) / msPerDay
  );

  // Calculate late fee using notification-based config
  const cgstLateFee = Math.min(config.dailyFeeCGST * daysLate, config.maxCapCGST);
  const sgstLateFee = Math.min(config.dailyFeeSGST * daysLate, config.maxCapSGST);
  const lateFee = cgstLateFee + sgstLateFee;

  // Calculate interest (Section 50)
  // 18% per annum on outstanding tax amount
  // Only applies if tax payment was also late AND there's a tax liability
  let interest = 0;
  if (input.taxPaidLate && input.taxAmount > 0 && daysLate > 0) {
    // Interest = Principal × Rate × Time / 365
    interest = Math.round((input.taxAmount * GST_INTEREST_RATE * daysLate) / 365);
  }

  // Total penalty
  const totalPenalty = lateFee + interest;

  // Determine risk level
  let riskLevel: 'safe' | 'warning' | 'critical';
  if (daysLate <= 0) {
    riskLevel = 'safe';
  } else if (daysLate <= 15) {
    riskLevel = 'warning';
  } else {
    riskLevel = 'critical';
  }

  // Generate summary
  const summary = generateSummary({
    returnType: config.returnType,
    daysLate,
    lateFee,
    interest,
    totalPenalty,
    riskLevel,
    isNilReturn,
    dailyRate: config.dailyFeeCGST + config.dailyFeeSGST,
  });

  return {
    daysLate,
    lateFee,
    interest,
    totalPenalty,
    riskLevel,
    summary,
    isNilReturn,
    breakdown: {
      cgstLateFee,
      sgstLateFee,
      dailyRate: config.dailyFeeCGST + config.dailyFeeSGST,
      maxCap: config.maxCapCGST + config.maxCapSGST,
      interestRate: '18% p.a.',
    },
    legalReference: {
      lateFeeSection: 'CGST Act Section 47',
      interestSection: 'CGST Act Section 50',
      notification: config.notificationRef,
    },
    disclaimer,
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getConfigKey(returnType: GSTReturnType, isNilReturn: boolean): string {
  if (returnType === 'GSTR9') {
    return 'GSTR9'; // Annual return doesn't have NIL variant
  }
  return isNilReturn ? `${returnType}_NIL` : returnType;
}

function generateSummary(params: {
  returnType: string;
  daysLate: number;
  lateFee: number;
  interest: number;
  totalPenalty: number;
  riskLevel: string;
  isNilReturn: boolean;
  dailyRate: number;
}): string {
  if (params.daysLate <= 0) {
    return 'Your return is filed on time. No penalty applicable.';
  }

  const feeRate = params.isNilReturn 
    ? `₹${params.dailyRate}/day (NIL return)` 
    : `₹${params.dailyRate}/day`;
  
  let summary = `Your ${params.returnType} return is ${params.daysLate} day${params.daysLate > 1 ? 's' : ''} late. `;
  summary += `Late fee: ₹${params.lateFee.toLocaleString('en-IN')} (${feeRate}).`;

  if (params.interest > 0) {
    summary += ` Interest: ₹${params.interest.toLocaleString('en-IN')} (18% p.a.).`;
  }

  summary += ` Total: ₹${params.totalPenalty.toLocaleString('en-IN')}.`;

  if (params.daysLate <= 15) {
    summary += ' File immediately to minimize penalty.';
  }

  return summary;
}

// =============================================================================
// UTILITY: Get current notification config (for UI display)
// =============================================================================

export function getGSTRateInfo(returnType: GSTReturnType, isNilReturn: boolean) {
  const configKey = getConfigKey(returnType, isNilReturn);
  const config = GST_LATE_FEE_CONFIG[configKey];
  
  return {
    dailyRate: config.dailyFeeCGST + config.dailyFeeSGST,
    maxCap: config.maxCapCGST + config.maxCapSGST,
    cgstDaily: config.dailyFeeCGST,
    sgstDaily: config.dailyFeeSGST,
    cgstMax: config.maxCapCGST,
    sgstMax: config.maxCapSGST,
    interestRate: '18% p.a.',
    notification: config.notificationRef,
    effectiveFrom: config.effectiveFrom,
  };
}
