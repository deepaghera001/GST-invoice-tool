/**
 * TDS Late Filing Fee & Interest Calculator
 * 
 * Based on Income Tax Act:
 * - Section 234E: Late filing fee for TDS returns
 * - Section 201(1A): Interest on late payment/deduction of TDS
 * 
 * Current Rules (as of 2024):
 * - Late Fee (Section 234E): ₹200/day, max = TDS amount deducted
 * - Interest for late deduction (Section 201(1A)): 1% per month
 * - Interest for late payment (Section 201(1A)): 1.5% per month
 */

export interface TDSPenaltyInput {
  tdsSection: '194J' | '194O' | '195' | '194C' | '194H' | '194I' | 'other'; // Common TDS sections
  tdsAmount: number; // TDS deducted in rupees
  dueDate: Date; // Due date for filing TDS return
  filingDate: Date; // Actual filing date
  tdsDeductedLate?: boolean; // Was TDS deducted late?
  tdsDepositedLate?: boolean; // Was TDS deposited late?
}

export interface TDSPenaltyOutput {
  daysLate: number;
  lateFee: number; // Section 234E
  interestOnLateDeduction: number; // Section 201(1A) - 1% per month
  interestOnLatePayment: number; // Section 201(1A) - 1.5% per month
  totalPenalty: number;
  riskLevel: 'safe' | 'warning' | 'critical';
  summary: string;
  breakdown: {
    dailyLateFee: number;
    lateFeePerDay: string;
    interestRateDeduction: string;
    interestRatePayment: string;
  };
}

export function calculateTDSPenalty(input: TDSPenaltyInput): TDSPenaltyOutput {
  // Input validation
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid input: must be an object');
  }

  const validSections = ['194J', '194O', '195', '194C', '194H', '194I', 'other'];
  if (!validSections.includes(input.tdsSection)) {
    throw new Error('Invalid TDS section');
  }

  if (typeof input.tdsAmount !== 'number' || input.tdsAmount < 0) {
    throw new Error('TDS amount must be a non-negative number');
  }

  if (!(input.dueDate instanceof Date) || isNaN(input.dueDate.getTime())) {
    throw new Error('Invalid due date');
  }

  if (!(input.filingDate instanceof Date) || isNaN(input.filingDate.getTime())) {
    throw new Error('Invalid filing date');
  }

  // Check if filing date is before or on due date
  if (input.filingDate <= input.dueDate) {
    return {
      daysLate: 0,
      lateFee: 0,
      interestOnLateDeduction: 0,
      interestOnLatePayment: 0,
      totalPenalty: 0,
      riskLevel: 'safe',
      summary: 'Your TDS return is filed on time. No penalty applicable.',
      breakdown: {
        dailyLateFee: 0,
        lateFeePerDay: '₹200/day',
        interestRateDeduction: '1% per month',
        interestRatePayment: '1.5% per month',
      },
    };
  }

  // Calculate days late
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLate = Math.max(0, Math.ceil(
    (input.filingDate.getTime() - input.dueDate.getTime()) / msPerDay
  ));

  // Calculate late fee (Section 234E)
  // ₹200 per day, but cannot exceed TDS amount
  let lateFee = 0;
  if (daysLate > 0) {
    lateFee = Math.min(200 * daysLate, input.tdsAmount);
  }

  // Calculate interest on late deduction (Section 201(1A))
  // 1% per month (or part thereof) from date TDS was deductible to date of deduction
  let interestOnLateDeduction = 0;
  if (input.tdsDeductedLate && input.tdsAmount > 0) {
    const monthsLate = Math.ceil(daysLate / 30);
    interestOnLateDeduction = Math.round((input.tdsAmount * 0.01 * monthsLate));
  }

  // Calculate interest on late payment (Section 201(1A))
  // 1.5% per month (or part thereof) from date of deduction to date of payment
  let interestOnLatePayment = 0;
  if (input.tdsDepositedLate && input.tdsAmount > 0) {
    const monthsLate = Math.ceil(daysLate / 30);
    interestOnLatePayment = Math.round((input.tdsAmount * 0.015 * monthsLate));
  }

  // Total penalty
  const totalPenalty = lateFee + interestOnLateDeduction + interestOnLatePayment;

  // Determine risk level
  let riskLevel: 'safe' | 'warning' | 'critical';
  if (daysLate <= 0) {
    riskLevel = 'safe';
  } else if (daysLate <= 7) {
    riskLevel = 'warning';
  } else {
    riskLevel = 'critical';
  }

  // Generate summary
  const summary = generateTDSSummary({
    daysLate,
    lateFee,
    interestOnLateDeduction,
    interestOnLatePayment,
    totalPenalty,
    riskLevel,
    tdsAmount: input.tdsAmount,
  });

  return {
    daysLate,
    lateFee,
    interestOnLateDeduction,
    interestOnLatePayment,
    totalPenalty,
    riskLevel,
    summary,
    breakdown: {
      dailyLateFee: daysLate > 0 ? Math.min(200, lateFee / daysLate) : 0,
      lateFeePerDay: '₹200/day',
      interestRateDeduction: '1% per month',
      interestRatePayment: '1.5% per month',
    },
  };
}

function generateTDSSummary(output: {
  daysLate: number;
  lateFee: number;
  interestOnLateDeduction: number;
  interestOnLatePayment: number;
  totalPenalty: number;
  riskLevel: string;
  tdsAmount: number;
}): string {
  if (output.daysLate <= 0) {
    return 'Your TDS return is filed on time. No penalty applicable.';
  }

  let summary = `Your TDS return is ${output.daysLate} day${output.daysLate > 1 ? 's' : ''} late. `;
  
  summary += `Late fee (Section 234E): ₹${output.lateFee.toLocaleString('en-IN')} (₹200/day, max ₹${output.tdsAmount.toLocaleString('en-IN')}).`;

  if (output.interestOnLateDeduction > 0) {
    summary += ` Interest on late deduction: ₹${output.interestOnLateDeduction.toLocaleString('en-IN')} (1%/month).`;
  }

  if (output.interestOnLatePayment > 0) {
    summary += ` Interest on late payment: ₹${output.interestOnLatePayment.toLocaleString('en-IN')} (1.5%/month).`;
  }

  summary += ` Total: ₹${output.totalPenalty.toLocaleString('en-IN')}.`;

  if (output.daysLate <= 7) {
    summary += ' File immediately to minimize penalty.';
  }
  
  return summary;
}
