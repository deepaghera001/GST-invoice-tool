/**
 * Salary Slip Form Hook
 * Manages form state, validation, and calculations
 */

"use client"

import { useState, useCallback, useMemo } from "react"
import type { SalarySlipFormData, SalarySlipValidationErrors, SalarySlipCalculationResult } from "@/lib/salary-slip"
import { 
  DEFAULT_SALARY_SLIP, 
  SalarySlipCalculations, 
  validateForm, 
  validateField,
  PeriodSchema,
  EmployeeSchema,
  CompanySchema,
  EarningsSchema,
  DeductionsSchema,
  BankingDetailsSchema,
} from "@/lib/salary-slip"

/**
 * Section completion status for progressive form validation
 * Used for psychology-based CTA display (show download only when complete)
 */
export interface SectionCompletionStatus {
  period: boolean
  employee: boolean
  company: boolean
  earnings: boolean
  deductions: boolean
  bankingDetails: boolean
}

export interface UseSalarySlipFormReturn {
  formData: SalarySlipFormData
  errors: SalarySlipValidationErrors
  touched: Set<string>
  calculations: SalarySlipCalculationResult
  handleChange: (field: string, value: any, type?: string) => void
  handleBlur: (field: string) => void
  validateFormFull: () => { isValid: boolean; errors: SalarySlipValidationErrors }
  markFieldTouched: (field: string) => void
  fillTestData: () => void
  shouldShowError: (field: string) => boolean
  getError: (field: string) => string | undefined
  resetForm: () => void
  /** Section-level completion checks using Zod schemas */
  isSectionComplete: SectionCompletionStatus
  /** Whether all sections are complete (form ready to submit) */
  isFormComplete: boolean
  /** Count of completed sections (for progress tracking) */
  completedSectionsCount: number
  /** Total number of sections */
  totalSections: number
}

export function useSalarySlipForm(initialData: Partial<SalarySlipFormData> = {}): UseSalarySlipFormReturn {
  const [formData, setFormData] = useState<SalarySlipFormData>({
    ...DEFAULT_SALARY_SLIP,
    ...initialData,
  })

  const [errors, setErrors] = useState<SalarySlipValidationErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  /**
   * Handle field changes (supports nested paths like "period.month")
   */
  const handleChange = useCallback((field: string, value: any, type?: string) => {
    // Coerce number inputs from string to actual numbers
    let processedValue = value
    if (type === "number") {
      processedValue = value === "" ? 0 : parseFloat(value)
    }
    
    setFormData((prev) => {
      const keys = field.split(".")
      if (keys.length === 1) {
        return { ...prev, [field]: processedValue }
      }

      // Handle nested fields
      let obj: any = { ...prev }
      let current = obj
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = processedValue
      return obj
    })

    // Clear error for this field on change
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  /**
   * Handle field blur (marks as touched and validates)
   */
  const handleBlur = useCallback((field: string) => {
    markFieldTouched(field)

    // Get current value for validation
    const keys = field.split(".")
    let value: any = formData
    for (const key of keys) {
      value = value?.[key]
    }

    // Validate the field
    const error = validateField(field, value)
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }))
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [formData])

  /**
   * Mark field as touched
   */
  const markFieldTouched = useCallback((field: string) => {
    setTouched((prev) => new Set([...prev, field]))
  }, [])

  /**
   * Validate entire form
   */
  const validateFormFull = useCallback(() => {
    const validationErrors = validateForm(formData)
    setErrors(validationErrors)
    return {
      isValid: Object.keys(validationErrors).length === 0,
      errors: validationErrors,
    }
  }, [formData])

  /**
   * Fill form with test data
   */
  const fillTestData = useCallback(() => {
    const { SAMPLE_SALARY_SLIP } = require("@/lib/salary-slip")
    setFormData(SAMPLE_SALARY_SLIP)
    setTouched(new Set())
    setErrors({})
  }, [])

  /**
   * Check if error should be shown (only after field is touched)
   */
  const shouldShowError = useCallback(
    (field: string) => {
      return touched.has(field) && !!errors[field]
    },
    [touched, errors]
  )

  /**
   * Get error message for field
   */
  const getError = useCallback(
    (field: string) => {
      return errors[field]
    },
    [errors]
  )

  /**
   * Reset form to defaults
   */
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_SALARY_SLIP)
    setTouched(new Set())
    setErrors({})
  }, [])

  /**
   * Calculate values memoized
   */
  const calculations = useMemo(() => {
    return SalarySlipCalculations.calculateAll(formData)
  }, [formData])

  /**
   * Section completion checks using Zod schemas
   * Used for progressive validation and psychology-based CTA display
   */
  const isSectionComplete = useMemo<SectionCompletionStatus>(() => ({
    period: PeriodSchema.safeParse(formData.period).success,
    employee: EmployeeSchema.safeParse(formData.employee).success,
    company: CompanySchema.safeParse(formData.company).success,
    earnings: EarningsSchema.safeParse(formData.earnings).success && formData.earnings.basicSalary > 0,
    deductions: DeductionsSchema.safeParse(formData.deductions).success,
    bankingDetails: BankingDetailsSchema.safeParse(formData.bankingDetails).success,
  }), [formData])

  /**
   * Count of completed sections (for progress tracking)
   */
  const completedSectionsCount = useMemo(() => {
    return Object.values(isSectionComplete).filter(Boolean).length
  }, [isSectionComplete])

  const totalSections = 6

  /**
   * Whether all required sections are complete (form ready to submit)
   */
  const isFormComplete = useMemo(() => {
    return completedSectionsCount === totalSections
  }, [completedSectionsCount])

  return {
    formData,
    errors,
    touched,
    calculations,
    handleChange,
    handleBlur,
    validateFormFull,
    markFieldTouched,
    fillTestData,
    shouldShowError,
    getError,
    resetForm,
    isSectionComplete,
    isFormComplete,
    completedSectionsCount,
    totalSections,
  }
}
