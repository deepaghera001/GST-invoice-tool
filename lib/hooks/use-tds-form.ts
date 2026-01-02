/**
 * TDS Calculator Form Hook
 * Manages form state, validation, and calculations
 */

"use client"

import { useState, useCallback, useMemo } from "react"
import {
  type TDSCalculatorFormData,
  type TDSCalculatorValidationErrors,
  DEFAULT_TDS_CALCULATOR_DATA,
  validateField,
  validateForm,
  DeductionTypeSchema,
  TDSAmountSchema,
  DateSchema,
  OptionalDateSchema,
} from "@/lib/tds/schema"
import { calculateTDSPenalty, type TDSPenaltyOutput } from "@/lib/tds/calculator"
import { z } from "zod"

/**
 * Section completion status for TDS form
 * TDS has 3 logical sections:
 * 1. TDS Details (section type + amount)
 * 2. Dates (due date + filing date)
 * 3. Optional Interest (deposit date, only when enabled)
 */
export interface TDSSectionCompletionStatus {
  tdsDetails: boolean
  dates: boolean
  interestOptions: boolean
}

export interface UseTDSFormReturn {
  formData: typeof DEFAULT_TDS_CALCULATOR_DATA
  errors: TDSCalculatorValidationErrors
  touched: Set<string>
  calculations: TDSPenaltyOutput | null
  handleChange: (field: string, value: any) => void
  handleBlur: (field: string) => void
  validateFormFull: () => { isValid: boolean; errors: TDSCalculatorValidationErrors }
  markFieldTouched: (field: string) => void
  fillTestData: () => void
  shouldShowError: (field: string) => boolean
  getError: (field: string) => string | undefined
  resetForm: () => void
  /** Section completion status (for progress tracking) */
  isSectionComplete: TDSSectionCompletionStatus
  /** Whether all required sections are complete */
  isFormComplete: boolean
  /** Number of completed sections */
  completedSectionsCount: number
  /** Total number of sections */
  totalSections: number
}

// Sample test data for TDS calculator
const SAMPLE_TDS_DATA = {
  deductionType: "salary" as const,
  tdsAmount: "25000",
  dueDate: "2024-02-07",
  filingDate: "2024-04-15",
  depositDate: "2024-03-01",
  depositedLate: true,
}

export function useTDSForm(
  initialData: Partial<typeof DEFAULT_TDS_CALCULATOR_DATA> = {}
): UseTDSFormReturn {
  const [formData, setFormData] = useState({
    ...DEFAULT_TDS_CALCULATOR_DATA,
    ...initialData,
  })

  const [errors, setErrors] = useState<TDSCalculatorValidationErrors>({})
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
      delete newErrors[field as keyof TDSCalculatorValidationErrors]
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
          delete newErrors[field as keyof TDSCalculatorValidationErrors]
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
    setTouched(new Set(Object.keys(DEFAULT_TDS_CALCULATOR_DATA)))
    return result
  }, [formData])

  /**
   * Fill form with test data
   */
  const fillTestData = useCallback(() => {
    setFormData(SAMPLE_TDS_DATA)
    setTouched(new Set())
    setErrors({})
  }, [])

  /**
   * Reset form to defaults
   */
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_TDS_CALCULATOR_DATA)
    setTouched(new Set())
    setErrors({})
  }, [])

  /**
   * Check if error should be shown (only after field is touched)
   */
  const shouldShowError = useCallback(
    (field: string) => {
      return touched.has(field) && !!errors[field as keyof TDSCalculatorValidationErrors]
    },
    [touched, errors]
  )

  /**
   * Get error message for field
   */
  const getError = useCallback(
    (field: string) => {
      return errors[field as keyof TDSCalculatorValidationErrors]
    },
    [errors]
  )

  /**
   * Calculate TDS late fee (memoized)
   */
  const calculations = useMemo(() => {
    // Only calculate if we have valid required data
    if (!formData.tdsAmount || !formData.dueDate || !formData.filingDate) {
      return null
    }

    const tdsAmount = Number(formData.tdsAmount)
    if (isNaN(tdsAmount) || tdsAmount <= 0) {
      return null
    }

    const dueDate = new Date(formData.dueDate)
    const filingDate = new Date(formData.filingDate)

    if (
      isNaN(dueDate.getTime()) ||
      isNaN(filingDate.getTime())
    ) {
      return null
    }

    if (filingDate < dueDate) {
      return null
    }

    // Map deductionType to tdsSection format expected by calculator
    const tdsSection = formData.deductionType === 'salary' ? '194J' 
      : formData.deductionType === 'contractor' ? '194C'
      : formData.deductionType === 'rent' ? '194I'
      : formData.deductionType === 'professional' ? '194J'
      : formData.deductionType === 'commission' ? '194H'
      : 'other';

    // If payment interest is enabled, ensure depositDate is provided and valid.
    if (formData.depositedLate) {
      const raw = formData.depositDate
      const depositDate = raw ? new Date(raw) : undefined
      if (!raw || !depositDate || isNaN(depositDate.getTime())) {
        // set inline validation error and do not run calculation
        setErrors((prev) => ({ ...prev, depositDate: 'Deposit date is required when interest is enabled' }))
        return null
      }

      // Clear any existing depositDate error
      setErrors((prev) => {
        const next = { ...prev }
        delete next.depositDate
        return next
      })

      return calculateTDSPenalty({
        tdsSection: tdsSection as any,
        tdsAmount,
        dueDate,
        filingDate,
        depositDate,
        tdsDeductedLate: false,
        tdsDepositedLate: formData.depositedLate,
      })
    }

    // No payment interest requested — simple calculation
    return calculateTDSPenalty({
      tdsSection: tdsSection as any,
      tdsAmount,
      dueDate,
      filingDate,
      tdsDeductedLate: false,
      tdsDepositedLate: formData.depositedLate,
    })
  }, [formData])

  /**
   * Section completion status using Zod schemas
   * This enables progress tracking for the PaymentCTA component
   */
  const isSectionComplete = useMemo((): TDSSectionCompletionStatus => {
    // TDS Details: deduction type + TDS amount
    const tdsDetailsSchema = z.object({
      deductionType: DeductionTypeSchema,
      tdsAmount: TDSAmountSchema,
    })

    // Dates: due date + filing date (with filing >= due validation)
    const datesSchema = z.object({
      dueDate: DateSchema,
      filingDate: DateSchema,
    }).refine(
      (data) => {
        const dueDate = new Date(data.dueDate)
        const filingDate = new Date(data.filingDate)
        return filingDate >= dueDate
      },
      { message: "Filing date must be on or after due date" }
    )

    // Interest options: always complete if depositedLate is false
    // If depositedLate is true, requires valid depositDate
    const interestOptionsComplete = !formData.depositedLate || 
      (formData.depositDate !== '' && 
       /^\d{4}-\d{2}-\d{2}$/.test(formData.depositDate) &&
       !isNaN(new Date(formData.depositDate).getTime()))

    return {
      tdsDetails: tdsDetailsSchema.safeParse({
        deductionType: formData.deductionType,
        tdsAmount: formData.tdsAmount,
      }).success,
      dates: datesSchema.safeParse({
        dueDate: formData.dueDate,
        filingDate: formData.filingDate,
      }).success,
      interestOptions: interestOptionsComplete,
    }
  }, [formData])

  /**
   * Check if all required sections are complete
   */
  const isFormComplete = useMemo(() => {
    return (
      isSectionComplete.tdsDetails &&
      isSectionComplete.dates &&
      isSectionComplete.interestOptions
    )
  }, [isSectionComplete])

  /**
   * Count completed sections
   */
  const completedSectionsCount = useMemo(() => {
    return Object.values(isSectionComplete).filter(Boolean).length
  }, [isSectionComplete])

  const totalSections = 3

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
