/**
 * Influencer Contract Form Hook
 * Manages form state, validation, and calculations
 */

"use client"

import { useState, useCallback, useMemo } from "react"
import type { InfluencerContractFormData, InfluencerContractValidationErrors } from "@/lib/influencer-contract"
import type { InfluencerContractCalculations } from "@/lib/influencer-contract"
import {
  DEFAULT_INFLUENCER_CONTRACT_DATA,
  InfluencerContractCalculator,
  validateForm,
  validateField,
  validateDeadlineAfterAgreement,
  PartiesSchema,
  CampaignSchema,
  TimelineSchema,
  PaymentSchema,
  UsageRightsSchema,
  ExclusivitySchema,
  LegalSchema,
  ConfirmationSchema,
} from "@/lib/influencer-contract"

/**
 * Section completion status for progressive form validation
 */
export interface SectionCompletionStatus {
  parties: boolean
  campaign: boolean
  timeline: boolean
  payment: boolean
  usageRights: boolean
  exclusivity: boolean
  legal: boolean
  confirmation: boolean
}

export interface UseInfluencerContractFormReturn {
  formData: InfluencerContractFormData
  setFormData: React.Dispatch<React.SetStateAction<InfluencerContractFormData>>
  errors: InfluencerContractValidationErrors
  touched: Set<string>
  calculations: InfluencerContractCalculations
  handleChange: (field: string, value: any, type?: string) => void
  handleBlur: (field: string) => void
  validateFormFull: () => { isValid: boolean; errors: InfluencerContractValidationErrors }
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
  /** Handle multi-select array changes */
  handleArrayChange: (field: string, value: string, checked: boolean) => void
}

export function useInfluencerContractForm(
  initialData: Partial<InfluencerContractFormData> = {}
): UseInfluencerContractFormReturn {
  const [formData, setFormData] = useState<InfluencerContractFormData>({
    ...DEFAULT_INFLUENCER_CONTRACT_DATA,
    ...initialData,
  })

  const [errors, setErrors] = useState<InfluencerContractValidationErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  /**
   * Handle field changes (supports nested paths like "parties.influencerName")
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
   * Handle array field changes (for multi-select checkboxes)
   */
  const handleArrayChange = useCallback((field: string, value: string, checked: boolean) => {
    setFormData((prev) => {
      const keys = field.split(".")
      let current: any = prev
      
      // Navigate to parent
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      
      const arrayKey = keys[keys.length - 1]
      const currentArray = current[arrayKey] as string[]
      
      let newArray: string[]
      if (checked) {
        newArray = [...currentArray, value]
      } else {
        newArray = currentArray.filter((v) => v !== value)
      }

      // Rebuild object with new array
      let obj: any = { ...prev }
      let target = obj
      for (let i = 0; i < keys.length - 1; i++) {
        target[keys[i]] = { ...target[keys[i]] }
        target = target[keys[i]]
      }
      target[arrayKey] = newArray
      
      return obj
    })

    // Clear error for this field
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

    // Special validation: deadline must be after agreement date
    if (field === "timeline.contentDeadline" || field === "legal.agreementDate") {
      const deadlineError = validateDeadlineAfterAgreement(
        formData.legal.agreementDate,
        formData.timeline.contentDeadline
      )
      if (deadlineError) {
        setErrors((prev) => ({ ...prev, "timeline.contentDeadline": deadlineError }))
      }
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
    
    // Add deadline validation
    const deadlineError = validateDeadlineAfterAgreement(
      formData.legal.agreementDate,
      formData.timeline.contentDeadline
    )
    if (deadlineError) {
      validationErrors["timeline.contentDeadline"] = deadlineError
    }
    
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
    const { SAMPLE_INFLUENCER_CONTRACT_DATA } = require("@/lib/influencer-contract")
    setFormData(SAMPLE_INFLUENCER_CONTRACT_DATA)
    setTouched(new Set())
    setErrors({})
  }, [])

  /**
   * Reset form to defaults
   */
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_INFLUENCER_CONTRACT_DATA)
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
    return InfluencerContractCalculator.calculateAll(formData)
  }, [formData])

  /**
   * Section completion checks using Zod schemas
   */
  const isSectionComplete = useMemo<SectionCompletionStatus>(() => ({
    parties: PartiesSchema.safeParse(formData.parties).success,
    campaign: CampaignSchema.safeParse(formData.campaign).success && 
              formData.campaign.platforms.length > 0 && 
              formData.campaign.contentTypes.length > 0,
    timeline: TimelineSchema.safeParse(formData.timeline).success && 
              formData.timeline.contentDeadline !== "",
    payment: PaymentSchema.safeParse(formData.payment).success && 
             formData.payment.totalAmount >= 500 &&
             formData.payment.paymentModes.length > 0,
    usageRights: UsageRightsSchema.safeParse(formData.usageRights).success,
    exclusivity: ExclusivitySchema.safeParse(formData.exclusivity).success,
    legal: LegalSchema.safeParse(formData.legal).success && 
           formData.legal.agreementDate !== "",
    confirmation: ConfirmationSchema.safeParse(formData.confirmation).success && 
                  formData.confirmation.acceptedDisclaimer === true,
  }), [formData])

  /**
   * Count of completed sections (for progress tracking)
   */
  const completedSectionsCount = useMemo(() => {
    return Object.values(isSectionComplete).filter(Boolean).length
  }, [isSectionComplete])

  const totalSections = 8

  /**
   * Whether all required sections are complete (form ready to submit)
   */
  const isFormComplete = useMemo(() => {
    return completedSectionsCount === totalSections
  }, [completedSectionsCount])

  return {
    formData,
    setFormData,
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
    handleArrayChange,
  }
}
