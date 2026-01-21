/**
 * Income Tax Calculator Form Hook
 * Manages form state, validation, and regime comparison
 */

"use client"

import { useState, useCallback, useMemo } from "react"
import {
  type IncomeTaxCalculatorFormData,
  type IncomeTaxCalculatorValidationErrors,
  DEFAULT_INCOME_TAX_CALCULATOR_DATA,
  validateField,
  validateForm,
} from "@/lib/income-tax/schema"
import {
  compareRegimes,
  calculateTotalDeductions,
  type AgeGroup,
  type Deductions,
  type ComparisonResult,
} from "@/lib/income-tax/calculator"

export interface UseIncomeTaxFormReturn {
  formData: typeof DEFAULT_INCOME_TAX_CALCULATOR_DATA
  errors: IncomeTaxCalculatorValidationErrors
  touched: Set<string>
  comparisonResult: ComparisonResult | null
  handleChange: (field: string, value: any) => void
  handleBlur: (field: string) => void
  validateFormFull: () => { isValid: boolean; errors: IncomeTaxCalculatorValidationErrors }
  markFieldTouched: (field: string) => void
  fillTestData: () => void
  shouldShowError: (field: string) => boolean
  getError: (field: string) => string | undefined
  resetForm: () => void
  isFormComplete: boolean
  totalDeductions: number
}

// Sample test data for Income Tax calculator
const SAMPLE_INCOME_TAX_DATA = {
  grossIncome: "1200000",
  ageGroup: "below-60" as const,
  section80C: "150000",
  section80D: "25000",
  hra: "100000",
  homeLoanInterest: "200000",
  nps80CCD1B: "50000",
  otherDeductions: "0",
}

export function useIncomeTaxForm(
  initialData: Partial<typeof DEFAULT_INCOME_TAX_CALCULATOR_DATA> = {}
): UseIncomeTaxFormReturn {
  const [formData, setFormData] = useState({
    ...DEFAULT_INCOME_TAX_CALCULATOR_DATA,
    ...initialData,
  })

  const [errors, setErrors] = useState<IncomeTaxCalculatorValidationErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  /**
   * Handle field changes
   */
  const handleChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error for this field on change
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field as keyof IncomeTaxCalculatorValidationErrors]
      return newErrors
    })
  }, [])

  /**
   * Handle field blur (marks as touched and validates)
   */
  const handleBlur = useCallback(
    (field: string) => {
      markFieldTouched(field)

      // Get current value for validation
      const value = formData[field as keyof typeof formData]

      // Validate the field
      const error = validateField(field, value)
      if (error) {
        setErrors((prev) => ({ ...prev, [field]: error }))
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field as keyof IncomeTaxCalculatorValidationErrors]
          return newErrors
        })
      }
    },
    [formData]
  )

  /**
   * Mark field as touched
   */
  const markFieldTouched = useCallback((field: string) => {
    setTouched((prev) => new Set(prev).add(field))
  }, [])

  /**
   * Fill with test data
   */
  const fillTestData = useCallback(() => {
    setFormData(SAMPLE_INCOME_TAX_DATA)
    setTouched(new Set())
    setErrors({})
  }, [])

  /**
   * Check if field error should be shown
   */
  const shouldShowError = useCallback(
    (field: string): boolean => {
      return touched.has(field) && !!errors[field as keyof IncomeTaxCalculatorValidationErrors]
    },
    [touched, errors]
  )

  /**
   * Get error message for a field
   */
  const getError = useCallback(
    (field: string): string | undefined => {
      return shouldShowError(field) ? errors[field as keyof IncomeTaxCalculatorValidationErrors] : undefined
    },
    [shouldShowError, errors]
  )

  /**
   * Validate entire form
   */
  /**
   * Validate entire form
   */
  const validateFormFull = useCallback((): {
    isValid: boolean
    errors: IncomeTaxCalculatorValidationErrors
  } => {
    const validation = validateForm(formData)
    setErrors(validation.errors)
    setTouched(new Set(Object.keys(formData)))
    return validation
  }, [formData])

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_INCOME_TAX_CALCULATOR_DATA)
    setErrors({})
    setTouched(new Set())
  }, [])

  /**
   * Form completion status
   */
  const isFormComplete = useMemo(() => {
    const grossIncome = parseFloat(formData.grossIncome.replace(/,/g, ''))
    return !isNaN(grossIncome) && grossIncome > 0
  }, [formData.grossIncome])

  /**
   * Calculate comparison results
   */
  const comparisonResult = useMemo((): ComparisonResult | null => {
    if (!isFormComplete) return null

    const parseNumber = (val: string) => {
      const num = parseFloat(val.replace(/,/g, ''))
      return isNaN(num) ? 0 : num
    }

    const deductions: Deductions = {
      section80C: parseNumber(formData.section80C),
      section80D: parseNumber(formData.section80D),
      hra: parseNumber(formData.hra),
      homeLoanInterest: parseNumber(formData.homeLoanInterest),
      nps80CCD1B: parseNumber(formData.nps80CCD1B),
      otherDeductions: parseNumber(formData.otherDeductions),
    }

    return compareRegimes(
      parseNumber(formData.grossIncome),
      deductions,
      formData.ageGroup as AgeGroup
    )
  }, [formData, isFormComplete])

  /**
   * Calculate total deductions for display
   */
  const totalDeductions = useMemo(() => {
    const parseNumber = (val: string) => {
      const num = parseFloat(val.replace(/,/g, ''))
      return isNaN(num) ? 0 : num
    }

    const deductions: Deductions = {
      section80C: parseNumber(formData.section80C),
      section80D: parseNumber(formData.section80D),
      hra: parseNumber(formData.hra),
      homeLoanInterest: parseNumber(formData.homeLoanInterest),
      nps80CCD1B: parseNumber(formData.nps80CCD1B),
      otherDeductions: parseNumber(formData.otherDeductions),
    }
    return calculateTotalDeductions(deductions)
  }, [formData])

  return {
    formData,
    errors,
    touched,
    comparisonResult,
    handleChange,
    handleBlur,
    validateFormFull,
    markFieldTouched,
    fillTestData,
    shouldShowError,
    getError,
    resetForm,
    isFormComplete,
    totalDeductions,
  }
}
