/**
 * GST Penalty Calculator
 * 
 * Based on GST Act Section 47 & 48
 * Calculates late fees and interest for GSTR-1 and GSTR-3B returns
 */

export interface GSTPenaltyInput {
  returnType: 'GSTR1' | 'GSTR3B';
  taxAmount: number; // In rupees
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

  // Calculate days late (including the due date itself)
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLate = Math.ceil(
    (input.filingDate.getTime() - input.dueDate.getTime()) / msPerDay
  );

  // Calculate late fee (Section 47)
  let lateFee = 0;
  if (daysLate > 30) {
    // ₹100 per day for days beyond 30, capped at ₹5,000
    lateFee = Math.min(100 * (daysLate - 30), 5000);
  }

  // Calculate interest (Section 48)
  // Only applies if both return AND tax payment were late
  let interest = 0;
  if (input.taxPaidLate && daysLate > 0) {
    // 18% per annum on tax amount for days late
    // Formula: (Principal × Rate × Time) / 100
    // Here: (Tax × 18 × Days) / 365 / 100
    interest = Math.round((input.taxAmount * 0.18 * daysLate) / 365);
  }

  // Total penalty
  const totalPenalty = lateFee + interest;

  // Determine risk level
  let riskLevel: 'safe' | 'warning' | 'critical';
  if (daysLate <= 0) {
    riskLevel = 'safe';
  } else if (daysLate <= 30) {
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
  });

  return {
    daysLate: Math.max(0, daysLate), // Never negative
    lateFee,
    interest,
    totalPenalty,
    riskLevel,
    summary,
  };
}

function generateSummary(output: {
  returnType: string;
  daysLate: number;
  lateFee: number;
  interest: number;
  totalPenalty: number;
  riskLevel: string;
}): string {
  if (output.daysLate <= 0) {
    return 'Your return is filed on time. No penalty.';
  }

  if (output.daysLate <= 30) {
    return `Your return is ${output.daysLate} days late. Grace period still active—file immediately to avoid ₹100/day penalty.`;
  }

  return `Your return is ${output.daysLate} days late. Late fee: ₹${output.lateFee.toLocaleString('en-IN')}. Interest: ₹${output.interest.toLocaleString('en-IN')}. Total penalty: ₹${output.totalPenalty.toLocaleString('en-IN')}.`;
}
