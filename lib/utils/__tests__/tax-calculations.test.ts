/**
 * Unit Tests for Income Tax Calculations
 * FY 2024-25 (AY 2025-26)
 * 
 * Tests cover:
 * - Tax slab boundaries
 * - Rebate logic (Section 87A)
 * - Age-based exemptions
 * - Deduction caps
 * - Cess calculations
 * - Edge cases
 */

import { describe, it, expect } from '@jest/globals';
import {
  calculateOldRegime,
  calculateNewRegime,
  compareRegimes,
  calculateTotalDeductions,
  type Deductions,
  type AgeGroup,
} from '../tax-calculations';

describe('Tax Calculations - FY 2024-25', () => {
  
  // ===== NEW REGIME TESTS =====
  
  describe('New Regime', () => {
    
    it('should calculate zero tax for income ≤ ₹3L', () => {
      const result = calculateNewRegime(300000);
      expect(result.totalTax).toBe(0);
      expect(result.taxableIncome).toBe(250000); // After ₹50k std deduction
    });

    it('should calculate zero tax for income ≤ ₹7L (rebate)', () => {
      const result = calculateNewRegime(700000);
      expect(result.taxableIncome).toBe(650000);
      expect(result.taxBeforeRebate).toBeGreaterThan(0);
      expect(result.rebate).toBe(result.taxBeforeRebate); // Full rebate
      expect(result.totalTax).toBe(0);
    });

    it('should calculate tax correctly at ₹7.01L (just above rebate)', () => {
      const result = calculateNewRegime(701000);
      expect(result.taxableIncome).toBe(651000);
      expect(result.rebate).toBe(0); // No rebate above ₹7L
      expect(result.taxBeforeRebate).toBeGreaterThan(0);
      expect(result.totalTax).toBeGreaterThan(0);
    });

    it('should calculate tax correctly for ₹10L income', () => {
      const result = calculateNewRegime(1000000);
      const expectedTaxableIncome = 950000; // 10L - 50k
      
      // Tax calculation:
      // 0-3L: 0
      // 3L-6L: 300k @ 5% = 15,000
      // 6L-9L: 300k @ 10% = 30,000
      // 9L-9.5L: 50k @ 15% = 7,500
      // Total: 52,500
      const expectedTax = 52500;
      const expectedCess = Math.round(expectedTax * 0.04); // 2,100
      
      expect(result.taxableIncome).toBe(expectedTaxableIncome);
      expect(result.taxBeforeRebate).toBe(expectedTax);
      expect(result.cess).toBe(expectedCess);
      expect(result.totalTax).toBe(expectedTax + expectedCess);
    });

    it('should calculate tax correctly for ₹15L income', () => {
      const result = calculateNewRegime(1500000);
      
      // Tax: 0 + 15k + 30k + 45k + 60k = 150,000
      const expectedTax = 150000;
      const expectedCess = 6000;
      
      expect(result.taxBeforeRebate).toBe(expectedTax);
      expect(result.cess).toBe(expectedCess);
      expect(result.totalTax).toBe(156000);
    });

    it('should calculate tax correctly for ₹20L income (highest slab)', () => {
      const result = calculateNewRegime(2000000);
      
      // Tax: 0 + 15k + 30k + 45k + 60k + 150k (5L @ 30%) = 300,000
      const expectedTax = 300000;
      const expectedCess = 12000;
      
      expect(result.taxBeforeRebate).toBe(expectedTax);
      expect(result.totalTax).toBe(312000);
    });

    it('should handle edge case: exactly at rebate threshold ₹7L', () => {
      const result = calculateNewRegime(700000);
      expect(result.totalTax).toBe(0);
    });

    it('should handle very high income (₹1 crore)', () => {
      const result = calculateNewRegime(10000000);
      expect(result.totalTax).toBeGreaterThan(0);
      expect(result.effectiveRate).toBeGreaterThan(0);
    });
  });

  // ===== OLD REGIME TESTS =====
  
  describe('Old Regime - Below 60 years', () => {
    const noDeductions: Deductions = {
      section80C: 0,
      section80D: 0,
      hra: 0,
      homeLoanInterest: 0,
      nps80CCD1B: 0,
      otherDeductions: 0,
    };

    it('should calculate zero tax for income ≤ ₹2.5L', () => {
      const result = calculateOldRegime(250000, noDeductions, 'below-60');
      expect(result.totalTax).toBe(0);
    });

    it('should calculate zero tax for income ≤ ₹5L (rebate)', () => {
      const result = calculateOldRegime(500000, noDeductions, 'below-60');
      expect(result.rebate).toBeGreaterThan(0);
      expect(result.totalTax).toBe(0);
    });

    it('should calculate tax for ₹5.01L (just above rebate)', () => {
      const result = calculateOldRegime(501000, noDeductions, 'below-60');
      expect(result.rebate).toBe(0); // No rebate above ₹5L
      expect(result.totalTax).toBeGreaterThan(0);
    });

    it('should calculate tax correctly for ₹10L income', () => {
      const result = calculateOldRegime(1000000, noDeductions, 'below-60');
      
      // Taxable: 10L - 50k (std) - 2.5L (exemption) = 7L
      // Tax: 2.5L @ 5% + 4.5L @ 20% = 12,500 + 90,000 = 102,500
      const expectedTax = 102500;
      const expectedCess = 4100;
      
      expect(result.taxableIncome).toBe(700000);
      expect(result.taxBeforeRebate).toBe(expectedTax);
      expect(result.totalTax).toBe(expectedTax + expectedCess);
    });

    it('should apply deductions correctly', () => {
      const deductions: Deductions = {
        section80C: 150000,
        section80D: 25000,
        hra: 100000,
        homeLoanInterest: 200000,
        nps80CCD1B: 50000,
        otherDeductions: 0,
      };

      const result = calculateOldRegime(1000000, deductions, 'below-60');
      
      // Total deductions: 50k + 150k + 25k + 100k + 200k + 50k = 575k
      // Taxable: 10L - 575k - 2.5L = 1,75,000
      expect(result.deductions).toBe(575000);
      expect(result.taxableIncome).toBe(175000);
      
      // Tax on 1,75,000 @ 5% = 8,750
      expect(result.taxBeforeRebate).toBe(8750);
    });

    it('should cap 80C at ₹1.5L', () => {
      const deductions: Deductions = {
        section80C: 200000, // Exceeds limit
        section80D: 0,
        hra: 0,
        homeLoanInterest: 0,
        nps80CCD1B: 0,
        otherDeductions: 0,
      };

      const totalDed = calculateTotalDeductions(deductions);
      // Should be: 50k (std) + 150k (capped 80C) = 200k
      expect(totalDed).toBe(200000);
    });

    it('should cap home loan interest at ₹2L', () => {
      const deductions: Deductions = {
        section80C: 0,
        section80D: 0,
        hra: 0,
        homeLoanInterest: 300000, // Exceeds limit
        nps80CCD1B: 0,
        otherDeductions: 0,
      };

      const totalDed = calculateTotalDeductions(deductions);
      // Should be: 50k (std) + 200k (capped home loan) = 250k
      expect(totalDed).toBe(250000);
    });
  });

  // ===== AGE-BASED EXEMPTION TESTS =====
  
  describe('Old Regime - Age-based exemptions', () => {
    const noDeductions: Deductions = {
      section80C: 0,
      section80D: 0,
      hra: 0,
      homeLoanInterest: 0,
      nps80CCD1B: 0,
      otherDeductions: 0,
    };

    it('should apply ₹3L basic exemption for senior citizens', () => {
      const result = calculateOldRegime(500000, noDeductions, 'senior');
      
      // Taxable: 5L - 50k - 3L = 1,50,000
      expect(result.taxableIncome).toBe(150000);
    });

    it('should apply ₹5L basic exemption for super seniors', () => {
      const result = calculateOldRegime(800000, noDeductions, 'super-senior');
      
      // Taxable: 8L - 50k - 5L = 2,50,000
      expect(result.taxableIncome).toBe(250000);
    });

    it('should result in zero tax for super senior with ₹5L income', () => {
      const result = calculateOldRegime(500000, noDeductions, 'super-senior');
      expect(result.totalTax).toBe(0);
    });
  });

  // ===== REBATE TESTS (Section 87A) =====
  
  describe('Rebate - Section 87A', () => {
    
    it('should apply full rebate for old regime at ₹5L', () => {
      const result = calculateOldRegime(500000, {
        section80C: 0,
        section80D: 0,
        hra: 0,
        homeLoanInterest: 0,
        nps80CCD1B: 0,
        otherDeductions: 0,
      }, 'below-60');
      
      expect(result.rebate).toBeGreaterThan(0);
      expect(result.rebate).toBeLessThanOrEqual(12500);
      expect(result.totalTax).toBe(0);
    });

    it('should apply full rebate for new regime at ₹7L', () => {
      const result = calculateNewRegime(700000);
      expect(result.rebate).toBeGreaterThan(0);
      expect(result.totalTax).toBe(0);
    });

    it('should cap rebate at tax amount (never negative)', () => {
      const result = calculateOldRegime(400000, {
        section80C: 0,
        section80D: 0,
        hra: 0,
        homeLoanInterest: 0,
        nps80CCD1B: 0,
        otherDeductions: 0,
      }, 'below-60');
      
      expect(result.taxAfterRebate).toBeGreaterThanOrEqual(0);
    });
  });

  // ===== COMPARISON TESTS =====
  
  describe('Regime Comparison', () => {
    
    it('should recommend new regime for low deductions', () => {
      const comparison = compareRegimes(1000000, {
        section80C: 0,
        section80D: 0,
        hra: 0,
        homeLoanInterest: 0,
        nps80CCD1B: 0,
        otherDeductions: 0,
      }, 'below-60');
      
      expect(comparison.recommendation).toBe('new');
      expect(comparison.savings).toBeGreaterThan(0);
    });

    it('should recommend old regime for high deductions', () => {
      const comparison = compareRegimes(1500000, {
        section80C: 150000,
        section80D: 50000,
        hra: 150000,
        homeLoanInterest: 200000,
        nps80CCD1B: 50000,
        otherDeductions: 50000,
      }, 'below-60');
      
      expect(comparison.recommendation).toBe('old');
      expect(comparison.savings).toBeGreaterThan(0);
    });

    it('should show equal when both regimes have same tax', () => {
      // This is rare but possible at certain income/deduction combinations
      const comparison = compareRegimes(300000, {
        section80C: 0,
        section80D: 0,
        hra: 0,
        homeLoanInterest: 0,
        nps80CCD1B: 0,
        otherDeductions: 0,
      }, 'below-60');
      
      // Both should be 0 for low income
      if (comparison.oldRegime.totalTax === comparison.newRegime.totalTax) {
        expect(comparison.recommendation).toBe('equal');
        expect(comparison.savings).toBe(0);
      }
    });

    it('should calculate savings percentage correctly', () => {
      const comparison = compareRegimes(1000000, {
        section80C: 0,
        section80D: 0,
        hra: 0,
        homeLoanInterest: 0,
        nps80CCD1B: 0,
        otherDeductions: 0,
      }, 'below-60');
      
      expect(comparison.savingsPercentage).toBeGreaterThanOrEqual(0);
      expect(comparison.savingsPercentage).toBeLessThan(100);
    });
  });

  // ===== CESS CALCULATION TESTS =====
  
  describe('Cess Calculation', () => {
    
    it('should calculate cess at 4% of tax after rebate', () => {
      const result = calculateNewRegime(1000000);
      const expectedCess = Math.round(result.taxAfterRebate * 0.04);
      expect(result.cess).toBe(expectedCess);
    });

    it('should be zero cess when tax is zero', () => {
      const result = calculateNewRegime(300000);
      expect(result.cess).toBe(0);
    });
  });

  // ===== EDGE CASES =====
  
  describe('Edge Cases', () => {
    
    it('should handle zero income', () => {
      const result = calculateNewRegime(0);
      expect(result.totalTax).toBe(0);
      expect(result.effectiveRate).toBe(0);
    });

    it('should handle negative deductions (should be floored at 0)', () => {
      const result = calculateOldRegime(1000000, {
        section80C: -50000, // Invalid
        section80D: 0,
        hra: 0,
        homeLoanInterest: 0,
        nps80CCD1B: 0,
        otherDeductions: 0,
      }, 'below-60');
      
      // Should handle gracefully
      expect(result.totalTax).toBeGreaterThanOrEqual(0);
    });

    it('should round all amounts to nearest rupee', () => {
      const result = calculateNewRegime(1234567);
      
      expect(Number.isInteger(result.totalTax)).toBe(true);
      expect(Number.isInteger(result.taxBeforeRebate)).toBe(true);
      expect(Number.isInteger(result.cess)).toBe(true);
    });

    it('should calculate effective tax rate correctly', () => {
      const result = calculateNewRegime(1000000);
      const expectedRate = (result.totalTax / 1000000) * 100;
      expect(result.effectiveRate).toBeCloseTo(expectedRate, 2);
    });
  });

  // ===== SLAB BOUNDARY TESTS =====
  
  describe('Slab Boundary Tests - New Regime', () => {
    
    it('should handle exactly ₹3L', () => {
      const result = calculateNewRegime(300000);
      expect(result.totalTax).toBe(0);
    });

    it('should handle exactly ₹6L', () => {
      const result = calculateNewRegime(600000);
      expect(result.taxableIncome).toBe(550000);
      // Tax: 250k @ 5% = 12,500
      expect(result.taxBeforeRebate).toBe(12500);
    });

    it('should handle exactly ₹9L', () => {
      const result = calculateNewRegime(900000);
      expect(result.taxableIncome).toBe(850000);
      // Tax: 300k @ 5% + 300k @ 10% + 250k @ 15% = 15k + 30k + 37.5k = 82,500
      expect(result.taxBeforeRebate).toBe(82500);
    });

    it('should handle exactly ₹12L', () => {
      const result = calculateNewRegime(1200000);
      expect(result.taxableIncome).toBe(1150000);
      // Tax: 15k + 30k + 45k + 60k = 150,000
      expect(result.taxBeforeRebate).toBe(150000);
    });

    it('should handle exactly ₹15L', () => {
      const result = calculateNewRegime(1500000);
      expect(result.taxBeforeRebate).toBe(150000);
    });
  });
});
