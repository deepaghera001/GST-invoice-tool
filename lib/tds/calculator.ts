/**
 * TDS Late Filing Fee & Interest Calculator
 * 
 * Based on Income Tax Act:
 * - Section 234E: Late filing fee for TDS returns
 * - Section 201(1A): Interest on late payment/deduction of TDS
 * 
 * Current Rules (as of 2024):
 * - Late Fee (Section 234E): ₹200/day, max = TDS amount deducted
 * - Interest on late payment (Section 201(1A)): 1.5% per month or part thereof
 */

export interface TDSPenaltyInput {
  tdsSection: '194J' | '194O' | '195' | '194C' | '194H' | '194I' | 'other'; // Common TDS sections
  tdsAmount: number; // TDS deducted in rupees
  dueDate: Date; // Due date for filing TDS return
  filingDate: Date; // Actual filing date
  depositDate?: Date; // Date TDS was deposited (required when interest calculation enabled)
  tdsDeductedLate?: boolean; // Was TDS deducted late?
  tdsDepositedLate?: boolean; // Was TDS deposited late?
}

export interface TDSPenaltyOutput {
  daysLate: number;
  lateFee: number; // Section 234E
  interestOnLateDeduction: number; // Section 201(1A) - 1.5% per month
  interestOnLatePayment: number; // Section 201(1A) - 1.5% per month
  totalPenalty: number;
  riskLevel: 'safe' | 'warning' | 'critical';
  summary: string;
  warnings?: string[];
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

  // Normalize depositDate: accept Date or ISO string. Avoid incorrect fallback when a string is provided.
  let usedDepositDateFallback = false
  let depositDateObj: Date | undefined
  if (input.depositDate instanceof Date && !isNaN(input.depositDate.getTime())) {
    depositDateObj = input.depositDate
  } else if (typeof (input as any).depositDate === 'string' && (input as any).depositDate.trim() !== '') {
    const raw = (input as any).depositDate.trim()
    // Accept ISO-like strings first
    let parsed = new Date(raw)
    // If parsing failed and format is DD/MM/YYYY or DD-MM-YYYY, parse manually
    if (isNaN(parsed.getTime())) {
      const dmSlash = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
      const dmDash = raw.match(/^(\d{2})-(\d{2})-(\d{4})$/)
      const m = dmSlash || dmDash
      if (m) {
        const day = Number(m[1])
        const month = Number(m[2])
        const year = Number(m[3])
        parsed = new Date(year, month - 1, day)
      }
    }
    if (!isNaN(parsed.getTime())) {
      depositDateObj = parsed
      input.depositDate = parsed
    }
  }

  // If payment interest requested but depositDate not parseable, fallback to filingDate (with warning)
  if (input.tdsDepositedLate && !depositDateObj) {
    throw new Error('Deposit date is required when payment interest (tdsDepositedLate) is enabled');
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
        interestRateDeduction: '1.5% per month or part thereof',
        interestRatePayment: '1.5% per month or part thereof',
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

  // Calculate interest on late payment (Section 201(1A))
  // 1.5% per month (or part thereof) from date TDS was deductible to date of payment
  let interestOnLateDeduction = 0;
  if (input.tdsDeductedLate && input.tdsAmount > 0) {
    // Count calendar months inclusively between due date and filing date
    const duePlusOne = addDays(input.dueDate, 1);
    const monthsLateDeduction = countInclusiveMonths(duePlusOne, input.filingDate);
    interestOnLateDeduction = Math.round((input.tdsAmount * 0.01 * monthsLateDeduction));
  }

  // Calculate interest on late payment (Section 201(1A))
  // 1.5% per month (or part thereof) from date of deduction to date of payment
  let interestOnLatePayment = 0;
  if (input.tdsDepositedLate && input.tdsAmount > 0) {
    // Use depositDateObj (normalized) to estimate months late for payment interest
    const duePlusOne = addDays(input.dueDate, 1);
    const monthsLatePayment = countInclusiveMonths(duePlusOne, depositDateObj!);
    interestOnLatePayment = Math.round((input.tdsAmount * 0.015 * monthsLatePayment));
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

  const warnings: string[] = []
  if (usedDepositDateFallback) {
    warnings.push('Deposit date was not provided; filing date used as fallback for payment interest estimation.')
  }

  return {
    daysLate,
    lateFee,
    interestOnLateDeduction,
    interestOnLatePayment,
    totalPenalty,
    riskLevel,
    summary,
    warnings: warnings.length ? warnings : undefined,
    breakdown: {
      dailyLateFee: daysLate > 0 ? Math.min(200, lateFee / daysLate) : 0,
      lateFeePerDay: '₹200/day',
      interestRateDeduction: '1.5% per month or part thereof',
      interestRatePayment: '1.5% per month or part thereof',
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
    summary += ` Interest on late payment: ₹${output.interestOnLateDeduction.toLocaleString('en-IN')} (1.5% per month or part thereof).`;
  }

  if (output.interestOnLatePayment > 0) {
    summary += ` Interest on late payment: ₹${output.interestOnLatePayment.toLocaleString('en-IN')} (1.5% per month or part thereof).`;
  }

  summary += ` Total: ₹${output.totalPenalty.toLocaleString('en-IN')}.`;

  if (output.daysLate <= 7) {
    summary += ' File immediately to minimize penalty.';
  }
  
  return summary;
}

function countInclusiveMonths(startDate: Date, endDate: Date): number {
  if (endDate <= startDate) return 0
  const yearDiff = endDate.getFullYear() - startDate.getFullYear()
  const monthDiff = endDate.getMonth() - startDate.getMonth()
  return yearDiff * 12 + monthDiff + 1
}

function addDays(d: Date, days: number): Date {
  const out = new Date(d.getTime())
  out.setDate(out.getDate() + days)
  return out
}
