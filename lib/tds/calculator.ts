/**
 * TDS Late Filing Fee Calculator
 * 
 * Based on Income Tax Act Section 206(3)
 * Calculates late fees for TDS returns filed after the due date
 */

export interface TDSPenaltyInput {
  tdsSection: '194J' | '194O' | '195' | 'other'; // Common TDS sections
  tdsAmount: number; // TDS deducted in rupees
  dueDate: Date;
  filingDate: Date;
}

export interface TDSPenaltyOutput {
  daysLate: number;
  lateFee: number;
  riskLevel: 'safe' | 'warning' | 'critical';
  summary: string;
}

export function calculateTDSPenalty(input: TDSPenaltyInput): TDSPenaltyOutput {
  // Input validation
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid input: must be an object');
  }

  const validSections = ['194J', '194O', '195', 'other'];
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

  // Calculate days late
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLate = Math.ceil(
    (input.filingDate.getTime() - input.dueDate.getTime()) / msPerDay
  );

  // Calculate late fee
  // Income Tax Act Section 206(3): ₹200 per day, max ₹5,000
  let lateFee = 0;
  if (daysLate > 0) {
    lateFee = Math.min(200 * daysLate, 5000);
  }

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
    riskLevel,
  });

  return {
    daysLate: Math.max(0, daysLate),
    lateFee,
    riskLevel,
    summary,
  };
}

function generateTDSSummary(output: {
  daysLate: number;
  lateFee: number;
  riskLevel: string;
}): string {
  if (output.daysLate <= 0) {
    return 'Your TDS return is filed on time. No penalty.';
  }

  if (output.daysLate <= 7) {
    return `Your TDS return is ${output.daysLate} day${output.daysLate > 1 ? 's' : ''} late. File immediately to minimize penalty.`;
  }

  return `Your TDS return is ${output.daysLate} days late. Late fee: ₹${output.lateFee.toLocaleString('en-IN')} (₹200/day, capped at ₹5,000).`;
}
