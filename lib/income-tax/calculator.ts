/**
 * Income Tax Calculation Utilities for India
 * FY 2024-25 (AY 2025-26)
 * 
 * IMPORTANT: These calculations are indicative only. Users should verify
 * against the latest Finance Act or CBDT Circular and consult a tax expert.
 */

const CESS_RATE = 0.04; // 4% Health & Education Cess

export type AgeGroup = 'below-60' | 'senior' | 'super-senior';

export interface TaxSlabConfig {
  upto: number;
  rate: number;
}

export interface Deductions {
  section80C: number;        // Max ₹1.5L
  section80D: number;        // ₹25k self + ₹25k/₹50k parents = max ₹75k
  hra: number;               // House Rent Allowance
  homeLoanInterest: number;  // Max ₹2L (Section 24b, self-occupied)
  nps80CCD1B: number;        // Max ₹50k (additional to 80C)
  otherDeductions: number;   // LTA, 80E, 80G, etc.
}

export interface TaxResult {
  grossIncome: number;
  deductions: number;
  taxableIncome: number;
  taxBeforeRebate: number;
  rebate: number;
  taxAfterRebate: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  breakdown: {
    slabStart: number;
    slabEnd: number;
    rate: number;
    taxInSlab: number;
  }[];
}

export interface ComparisonResult {
  oldRegime: TaxResult;
  newRegime: TaxResult;
  recommendation: 'old' | 'new' | 'equal';
  savings: number;
  savingsPercentage: number;
}

/**
 * Compute tax based on progressive slabs
 */
function computeTaxWithBreakdown(
  taxableIncome: number, 
  slabs: TaxSlabConfig[]
): { tax: number; breakdown: TaxResult['breakdown'] } {
  let tax = 0;
  let remainingIncome = taxableIncome;
  const breakdown: TaxResult['breakdown'] = [];
  let previousLimit = 0;

  for (const slab of slabs) {
    if (remainingIncome <= 0) break;

    const slabSize = slab.upto === Infinity ? remainingIncome : Math.min(slab.upto, remainingIncome);
    const taxInSlab = Math.round(slabSize * slab.rate);
    
    if (taxInSlab > 0 || slab.rate > 0) {
      breakdown.push({
        slabStart: previousLimit,
        slabEnd: previousLimit + slabSize,
        rate: slab.rate,
        taxInSlab,
      });
    }

    tax += taxInSlab;
    remainingIncome -= slabSize;
    previousLimit += slabSize;
  }

  return { tax: Math.round(tax), breakdown };
}

/**
 * Apply Section 87A rebate
 */
function applyRebate(
  tax: number, 
  taxableIncome: number, 
  rebateLimit: number, 
  rebateThreshold: number
): { rebate: number; taxAfterRebate: number } {
  const rebate = taxableIncome <= rebateThreshold ? Math.min(tax, rebateLimit) : 0;
  const taxAfterRebate = Math.max(0, tax - rebate);
  return { rebate: Math.round(rebate), taxAfterRebate: Math.round(taxAfterRebate) };
}

/**
 * Calculate total deductions for old regime
 */
export function calculateTotalDeductions(deductions: Deductions, standardDeduction: number = 50000): number {
  const section80C = Math.min(deductions.section80C || 0, 150000);
  const section80D = Math.min(deductions.section80D || 0, 75000); // Updated to ₹75k max
  const hra = Math.max(deductions.hra || 0, 0);
  const homeLoanInterest = Math.min(deductions.homeLoanInterest || 0, 200000);
  const nps = Math.min(deductions.nps80CCD1B || 0, 50000);
  const other = Math.max(deductions.otherDeductions || 0, 0);

  return Math.round(
    standardDeduction + 
    section80C + 
    section80D + 
    hra + 
    homeLoanInterest + 
    nps + 
    other
  );
}

/**
 * OLD TAX REGIME - FY 2024-25
 */
export function calculateOldRegime(
  grossIncome: number, 
  deductions: Deductions, 
  ageGroup: AgeGroup = 'below-60'
): TaxResult {
  // Standard deduction for salaried income
  const standardDeduction = 50000;
  
  // Calculate total deductions (capped appropriately)
  const totalDeductions = calculateTotalDeductions(deductions, standardDeduction);
  
  // Taxable income (after deductions)
  const taxableIncome = Math.max(0, Math.round(grossIncome - totalDeductions));

  // Age-based basic exemption (built into slab structure)
  let basicExemption = 250000;
  if (ageGroup === 'senior') basicExemption = 300000;
  if (ageGroup === 'super-senior') basicExemption = 500000;

  // Tax slabs for old regime (exemption is the first slab at 0%)
  const slabs: TaxSlabConfig[] = [
    { upto: basicExemption, rate: 0 },    // Up to exemption limit: 0%
    { upto: 250000, rate: 0.05 },         // Next ₹2.5L @ 5%
    { upto: 500000, rate: 0.20 },         // Next ₹5L @ 20%
    { upto: Infinity, rate: 0.30 },       // Above ₹10L @ 30%
  ];

  const { tax: taxBeforeRebate, breakdown } = computeTaxWithBreakdown(taxableIncome, slabs);

  // Section 87A rebate (if TAXABLE income ≤ ₹5L for residents)
  const { rebate, taxAfterRebate } = applyRebate(
    taxBeforeRebate,
    taxableIncome, // Rebate based on taxable income (not gross)
    12500,
    500000
  );

  // Health & Education Cess (4% on tax after rebate)
  const cess = Math.round(taxAfterRebate * CESS_RATE);
  const totalTax = taxAfterRebate + cess;
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  return {
    grossIncome: Math.round(grossIncome),
    deductions: totalDeductions,
    taxableIncome,
    taxBeforeRebate,
    rebate,
    taxAfterRebate,
    cess,
    totalTax,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    breakdown,
  };
}

/**
 * NEW TAX REGIME - FY 2024-25 (Default)
 */
export function calculateNewRegime(grossIncome: number): TaxResult {
  // Standard deduction (only deduction allowed)
  const standardDeduction = 50000;
  const taxableIncome = Math.max(0, Math.round(grossIncome - standardDeduction));

  // Tax slabs for new regime
  const slabs: TaxSlabConfig[] = [
    { upto: 300000, rate: 0 },      // ₹0 - ₹3L
    { upto: 300000, rate: 0.05 },   // ₹3L - ₹6L
    { upto: 300000, rate: 0.10 },   // ₹6L - ₹9L
    { upto: 300000, rate: 0.15 },   // ₹9L - ₹12L
    { upto: 300000, rate: 0.20 },   // ₹12L - ₹15L
    { upto: Infinity, rate: 0.30 }, // Above ₹15L
  ];

  const { tax: taxBeforeRebate, breakdown } = computeTaxWithBreakdown(taxableIncome, slabs);

  // Section 87A rebate (if taxable income ≤ ₹7L, rebate = full tax)
  const { rebate, taxAfterRebate } = applyRebate(
    taxBeforeRebate,
    taxableIncome, // Rebate based on taxable income for new regime
    taxBeforeRebate, // Full rebate allowed
    700000
  );

  // Health & Education Cess (4% on tax after rebate)
  const cess = Math.round(taxAfterRebate * CESS_RATE);
  const totalTax = taxAfterRebate + cess;
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  return {
    grossIncome: Math.round(grossIncome),
    deductions: standardDeduction,
    taxableIncome,
    taxBeforeRebate,
    rebate,
    taxAfterRebate,
    cess,
    totalTax,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    breakdown,
  };
}

/**
 * Compare both regimes and provide recommendation
 */
export function compareRegimes(
  grossIncome: number,
  deductions: Deductions,
  ageGroup: AgeGroup = 'below-60'
): ComparisonResult {
  const oldRegime = calculateOldRegime(grossIncome, deductions, ageGroup);
  const newRegime = calculateNewRegime(grossIncome);

  const savings = Math.abs(oldRegime.totalTax - newRegime.totalTax);
  const savingsPercentage = grossIncome > 0 
    ? (savings / grossIncome) * 100 
    : 0;

  let recommendation: 'old' | 'new' | 'equal';
  if (oldRegime.totalTax < newRegime.totalTax) {
    recommendation = 'old';
  } else if (newRegime.totalTax < oldRegime.totalTax) {
    recommendation = 'new';
  } else {
    recommendation = 'equal';
  }

  return {
    oldRegime,
    newRegime,
    recommendation,
    savings: Math.round(savings),
    savingsPercentage: Math.round(savingsPercentage * 100) / 100,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Format number with Indian numbering system
 */
export function formatIndianNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.round(num));
}
