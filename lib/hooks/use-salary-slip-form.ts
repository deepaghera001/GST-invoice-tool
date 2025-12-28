/**
 * Salary Slip Form Hook
 * Manages form state, validation, and calculations
 */

"use client"

import { useState, useCallback, useMemo } from "react"
import type { SalarySlipFormData, SalarySlipValidationErrors, SalarySlipCalculationResult } from "@/lib/salary-slip"
import { DEFAULT_SALARY_SLIP, SalarySlipCalculations, validateForm, validateField } from "@/lib/salary-slip"

export interface UseSalarySlipFormReturn {
  formData: SalarySlipFormData
  errors: SalarySlipValidationErrors
  touched: Set<string>
  calculations: SalarySlipCalculationResult
  handleChange: (field: string, value: any) => void
  handleBlur: (field: string) => void
  validateFormFull: () => { isValid: boolean; errors: SalarySlipValidationErrors }
  markFieldTouched: (field: string) => void
  fillTestData: () => void
  shouldShowError: (field: string) => boolean
  getError: (field: string) => string | undefined
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
  const handleChange = useCallback((field: string, value: any) => {
    setFormData((prev) => {
      const keys = field.split(".")
      if (keys.length === 1) {
        return { ...prev, [field]: value }
      }

      // Handle nested fields
      let obj: any = { ...prev }
      let current = obj
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
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
   * Calculate values memoized
   */
  const calculations = useMemo(() => {
    return SalarySlipCalculations.calculateAll(formData)
  }, [formData])

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
  }
}
