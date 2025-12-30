/**
 * GST Penalty Calculator
 * 
 * Based on GST Act Section 47 (Late Fee) & Section 50 (Interest)
 * Calculates late fees and interest for GSTR-1 and GSTR-3B returns
 * 
 * Current Rules (as of 2024):
 * - Late Fee: ₹50/day CGST + ₹50/day SGST = ₹100/day total (from day 1)
 * - NIL Returns: ₹25/day CGST + ₹25/day SGST = ₹50/day total
 * - Maximum Cap: ₹5,000 CGST + ₹5,000 SGST = ₹10,000 total
 * - Interest: 18% per annum on outstanding tax (if tax paid late)
 */

export interface GSTPenaltyInput {
  returnType: 'GSTR1' | 'GSTR3B';
  taxAmount: number; // Tax liability in rupees (0 for NIL return)
  dueDate: Date;
  filingDate: Date;
  taxPaidLate: boolean; // Was tax payment also late?
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
    interestRate: string;
  };
}

export function calculateGSTPenalty(
  input: GSTPenaltyInput
): GSTPenaltyOutput {
  // Input validation
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid input: must be an object');
  }

  if (!['GSTR1', 'GSTR3B'].includes(input.returnType)) {
    throw new Error('Invalid return type: must be GSTR1 or GSTR3B');
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

  // Check if filing date is before due date
  if (input.filingDate < input.dueDate) {
    return {
      daysLate: 0,
      lateFee: 0,
      interest: 0,
      totalPenalty: 0,
      riskLevel: 'safe',
      summary: 'Your return is filed on time. No penalty applicable.',
      isNilReturn: input.taxAmount === 0,
      breakdown: {
        cgstLateFee: 0,
        sgstLateFee: 0,
        interestRate: '18% p.a.',
      },
    };
  }

  // Calculate days late (from day after due date)
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLate = Math.max(0, Math.ceil(
    (input.filingDate.getTime() - input.dueDate.getTime()) / msPerDay
  ));

  // Determine if NIL return (tax amount = 0)
  const isNilReturn = input.taxAmount === 0;

  // Calculate late fee (Section 47)
  // GST Late Fee is charged from day 1 of delay (no grace period)
  // Regular return: ₹50 CGST + ₹50 SGST = ₹100/day, max ₹10,000
  // NIL return: ₹25 CGST + ₹25 SGST = ₹50/day, max ₹1,000 (reduced cap for NIL)
  let lateFee = 0;
  let cgstLateFee = 0;
  let sgstLateFee = 0;

  if (daysLate > 0) {
    if (isNilReturn) {
      // NIL return: ₹25/day each for CGST & SGST, max ₹500 each = ₹1,000 total
      cgstLateFee = Math.min(25 * daysLate, 500);
      sgstLateFee = Math.min(25 * daysLate, 500);
    } else {
      // Regular return: ₹50/day each for CGST & SGST, max ₹5,000 each = ₹10,000 total
      cgstLateFee = Math.min(50 * daysLate, 5000);
      sgstLateFee = Math.min(50 * daysLate, 5000);
    }
    lateFee = cgstLateFee + sgstLateFee;
  }

  // Calculate interest (Section 50)
  // 18% per annum on outstanding tax amount
  // Only applies if tax payment was also late
  let interest = 0;
  if (input.taxPaidLate && daysLate > 0 && input.taxAmount > 0) {
    // Interest = Principal × Rate × Time / 365
    // Rate = 18% = 0.18
    interest = Math.round((input.taxAmount * 0.18 * daysLate) / 365);
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
    returnType: input.returnType,
    daysLate,
    lateFee,
    interest,
    totalPenalty,
    riskLevel,
    isNilReturn,
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
      interestRate: '18% p.a.',
    },
  };
}

function generateSummary(output: {
  returnType: string;
  daysLate: number;
  lateFee: number;
  interest: number;
  totalPenalty: number;
  riskLevel: string;
  isNilReturn: boolean;
}): string {
  if (output.daysLate <= 0) {
    return 'Your return is filed on time. No penalty applicable.';
  }

  const feeRate = output.isNilReturn ? '₹50/day (NIL return)' : '₹100/day';
  
  if (output.daysLate <= 15) {
    return `Your ${output.returnType} return is ${output.daysLate} day${output.daysLate > 1 ? 's' : ''} late. Late fee: ₹${output.lateFee.toLocaleString('en-IN')} (${feeRate}). File immediately to minimize penalty.`;
  }

  let summary = `Your ${output.returnType} return is ${output.daysLate} days late. Late fee: ₹${output.lateFee.toLocaleString('en-IN')} (CGST + SGST).`;
  
  if (output.interest > 0) {
    summary += ` Interest: ₹${output.interest.toLocaleString('en-IN')} (18% p.a.).`;
  }
  
  summary += ` Total penalty: ₹${output.totalPenalty.toLocaleString('en-IN')}.`;
  
  return summary;
}
