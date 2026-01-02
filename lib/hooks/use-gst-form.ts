/**
 * GST Calculator Form Hook
 * Manages form state, validation, and calculations
 */

"use client"

import { useState, useCallback, useMemo } from "react"
import {
  type GSTCalculatorFormData,
  type GSTCalculatorValidationErrors,
  DEFAULT_GST_CALCULATOR_DATA,
  validateField,
  validateForm,
} from "@/lib/gst/schema"
import { calculateGSTPenalty, type GSTPenaltyOutput } from "@/lib/gst/calculator"

export interface UseGSTFormReturn {
  formData: typeof DEFAULT_GST_CALCULATOR_DATA
  errors: GSTCalculatorValidationErrors
  touched: Set<string>
  calculations: GSTPenaltyOutput | null
  handleChange: (field: string, value: any) => void
  handleBlur: (field: string) => void
  validateFormFull: () => { isValid: boolean; errors: GSTCalculatorValidationErrors }
  markFieldTouched: (field: string) => void
  fillTestData: () => void
  shouldShowError: (field: string) => boolean
  getError: (field: string) => string | undefined
  resetForm: () => void
  // Form completion status
  isFormComplete: boolean
  completedSectionsCount: number
  totalSections: number
}

// Sample test data for GST calculator
const SAMPLE_GST_DATA = {
  returnType: "GSTR3B" as const,
  taxAmount: "50000",
  dueDate: "2024-01-20",
  filingDate: "2024-02-15",
  taxPaidLate: true,
}

export function useGSTForm(
  initialData: Partial<typeof DEFAULT_GST_CALCULATOR_DATA> = {}
): UseGSTFormReturn {
  const [formData, setFormData] = useState({
    ...DEFAULT_GST_CALCULATOR_DATA,
    ...initialData,
  })

  const [errors, setErrors] = useState<GSTCalculatorValidationErrors>({})
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
      delete newErrors[field as keyof GSTCalculatorValidationErrors]
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
          delete newErrors[field as keyof GSTCalculatorValidationErrors]
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
    setTouched((prev) => new Set([...prev, field]))
  }, [])

  /**
   * Validate entire form
   */
  const validateFormFull = useCallback(() => {
    const result = validateForm(formData)
    setErrors(result.errors)
    // Mark all fields as touched when validating full form
    setTouched(new Set(Object.keys(DEFAULT_GST_CALCULATOR_DATA)))
    return result
  }, [formData])

  /**
   * Fill form with test data
   */
  const fillTestData = useCallback(() => {
    setFormData(SAMPLE_GST_DATA)
    setTouched(new Set())
    setErrors({})
  }, [])

  /**
   * Reset form to defaults
   */
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_GST_CALCULATOR_DATA)
    setTouched(new Set())
    setErrors({})
  }, [])

  /**
   * Check if error should be shown (only after field is touched)
   */
  const shouldShowError = useCallback(
    (field: string) => {
      return touched.has(field) && !!errors[field as keyof GSTCalculatorValidationErrors]
    },
    [touched, errors]
  )

  /**
   * Get error message for field
   */
  const getError = useCallback(
    (field: string) => {
      return errors[field as keyof GSTCalculatorValidationErrors]
    },
    [errors]
  )

  /**
   * Form completion status using Zod validation
   */
  const isFormComplete = useMemo(() => {
    const result = validateForm(formData)
    return result.isValid
  }, [formData])

  // For GST calculator, treat it as a single section (simpler form)
  const completedSectionsCount = isFormComplete ? 1 : 0
  const totalSections = 1

  /**
   * Calculate GST penalty (memoized)
   */
  const calculations = useMemo(() => {
    // Only calculate if we have valid required data
    if (!formData.taxAmount || !formData.dueDate || !formData.filingDate) {
      return null
    }

    const taxAmount = Number(formData.taxAmount)
    if (isNaN(taxAmount) || taxAmount < 0) {
      return null
    }

    const dueDate = new Date(formData.dueDate)
    const filingDate = new Date(formData.filingDate)
    if (isNaN(dueDate.getTime()) || isNaN(filingDate.getTime())) {
      return null
    }

    if (filingDate < dueDate) {
      return null
    }

    return calculateGSTPenalty({
      returnType: formData.returnType,
      taxAmount,
      dueDate,
      filingDate,
      taxPaidLate: formData.taxPaidLate,
    })
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
    resetForm,
    // Form completion status
    isFormComplete,
    completedSectionsCount,
    totalSections,
  }
}
