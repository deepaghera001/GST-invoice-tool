/**
 * Salary Slip Calculations
 * All business logic for salary slip computations
 */

import type { SalarySlipFormData, SalarySlipCalculationResult } from "./types"
import { PF_PERCENTAGE, ESI_PERCENTAGE, ESI_THRESHOLD } from "./constants"

export class SalarySlipCalculations {
  /**
   * Calculate total earnings
   */
  static calculateTotalEarnings(data: SalarySlipFormData): number {
    const earnings = data.earnings
    return (
      (earnings.basicSalary || 0) +
      (earnings.dearness || 0) +
      (earnings.houseRent || 0) +
      (earnings.conveyance || 0) +
      (earnings.otherEarnings || 0)
    )
  }

  /**
   * Calculate total deductions
   */
  static calculateTotalDeductions(data: SalarySlipFormData): number {
    const deductions = data.deductions
    return (
      (deductions.providentFund || 0) +
      (deductions.esi || 0) +
      (deductions.incomeTax || 0) +
      (deductions.otherDeductions || 0)
    )
  }

  /**
   * Calculate PF (12% of basic + dearness)
   */
  static calculatePF(data: SalarySlipFormData): number {
    const pfBase = (data.earnings.basicSalary || 0) + (data.earnings.dearness || 0)
    return Math.round((pfBase * PF_PERCENTAGE) / 100)
  }

  /**
   * Calculate ESI (0.75% if salary < 21000)
   */
  static calculateESI(data: SalarySlipFormData): number {
    const totalEarnings = this.calculateTotalEarnings(data)
    if (totalEarnings >= ESI_THRESHOLD) {
      return 0
    }
    return Math.round((totalEarnings * ESI_PERCENTAGE) / 100)
  }

  /**
   * Calculate net salary (Total Earnings - Total Deductions)
   */
  static calculateNetSalary(data: SalarySlipFormData): number {
    return this.calculateTotalEarnings(data) - this.calculateTotalDeductions(data)
  }

  /**
   * Convert amount to words (Indian number system)
   */
  static amountInWords(amount: number): string {
    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
    const tens = [
      "",
      "ten",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ]
    const scales = [
      "",
      "thousand",
      "lakh",
      "crore",
      "arab",
      "kharab",
      "neel",
      "padma",
      "shankh",
    ]

    if (amount === 0) return "zero"
    if (amount < 0) return "negative " + this.amountInWords(-amount)

    const parts: string[] = []
    let scaleIndex = 0

    while (amount > 0) {
      let groupValue: number
      let divisor: number

      if (scaleIndex === 0) {
        // Ones place (units)
        groupValue = amount % 100
        divisor = 100
      } else if (scaleIndex === 1) {
        // Thousands
        groupValue = amount % 1000
        divisor = 1000
      } else {
        // Lakhs, crores, etc (2 digits each)
        groupValue = amount % 100
        divisor = 100
      }

      if (groupValue > 0) {
        parts.unshift(this.convertGroupToWords(groupValue, ones, tens) + (scales[scaleIndex] || ""))
      }

      amount = Math.floor(amount / divisor)
      scaleIndex++
    }

    return parts
      .filter((p) => p.length > 0)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()
  }

  /**
   * Convert a group (0-999) to words
   */
  private static convertGroupToWords(num: number, ones: string[], tens: string[]): string {
    if (num === 0) return ""

    const parts: string[] = []

    const hundreds = Math.floor(num / 100)
    if (hundreds > 0) {
      parts.push(ones[hundreds], "hundred")
    }

    const remainder = num % 100
    if (remainder >= 10 && remainder <= 19) {
      const teens = [
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
      ]
      parts.push(teens[remainder - 10])
    } else {
      const tenDigit = Math.floor(remainder / 10)
      const oneDigit = remainder % 10

      if (tenDigit > 0) {
        parts.push(tens[tenDigit])
      }
      if (oneDigit > 0) {
        parts.push(ones[oneDigit])
      }
    }

    return parts.filter((p) => p.length > 0).join(" ")
  }

  /**
   * Calculate all values at once
   */
  static calculateAll(data: SalarySlipFormData): SalarySlipCalculationResult {
    const totalEarnings = this.calculateTotalEarnings(data)
    const totalDeductions = this.calculateTotalDeductions(data)
    const netSalary = this.calculateNetSalary(data)

    return {
      totalEarnings,
      totalDeductions,
      grossSalary: totalEarnings,
      netSalary,
      amountInWords: this.amountInWords(Math.round(netSalary)),
    }
  }
}
