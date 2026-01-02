/**
 * useShareholdersAgreementForm hook
 * Manages shareholders agreement form state, validation, and calculations
 */

"use client"

import { useState, useCallback, useMemo } from "react"
import type {
  ShareholdersAgreementFormData,
  ShareholdersAgreementCalculations,
  ShareholdersAgreementValidationErrors,
  ShareholdersAgreementCalculatedData,
} from "@/lib/shareholders-agreement"
import { shareholdersAgreementSchema, shareholdersAgreementFieldSchema } from "@/lib/shareholders-agreement/schema"
import { DEFAULT_SHAREHOLDERS_AGREEMENT_DATA } from "@/lib/shareholders-agreement/constants"

interface UseShareholdersAgreementFormReturn {
  // State
  formData: ShareholdersAgreementFormData
  errors: ShareholdersAgreementValidationErrors
  touchedFields: Set<string>

  // Calculated data (real-time)
  calculatedData: ShareholdersAgreementCalculatedData

  // Form control methods
  setFormData: (data: ShareholdersAgreementFormData) => void
  setNestedValue: (path: string, value: any) => void
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleBlur: (fieldPath: string, value?: any) => void
  handleCheckboxChange: (path: string, value: string, checked: boolean) => void
  handleAddShareholder: () => void
  handleRemoveShareholder: (index: number) => void
  handleShareholderChange: (index: number, field: string, value: any) => void

  // Validation methods
  validateField: (fieldPath: string, value: any) => string | null
  validateForm: () => { isValid: boolean; errors: ShareholdersAgreementValidationErrors }
  markFieldTouched: (fieldPath: string) => void
  clearErrors: () => void

  // Section completion checks
  isSectionComplete: {
    company: boolean
    shareholders: boolean
    shareCapital: boolean
    boardManagement: boolean
    votingRights: boolean
    shareTransfer: boolean
    tagAlongDragAlong: boolean
    exitBuyout: boolean
    confidentiality: boolean
    deadlockResolution: boolean
    termination: boolean
    signatureDetails: boolean
  }

  // Query methods
  shouldShowError: (fieldPath: string) => boolean
  isFieldTouched: (fieldPath: string) => boolean

  // Helper methods
  resetForm: () => void
}

/**
 * Get nested value from object using dot notation path
 */
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => acc?.[key], obj)
}

/**
 * Set nested value in object using dot notation path
 */
function setNestedValueHelper(obj: any, path: string, value: any): any {
  const keys = path.split(".")
  const result = JSON.parse(JSON.stringify(obj)) // Deep clone
  
  let current = result
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {}
    current = current[keys[i]]
  }
  current[keys[keys.length - 1]] = value
  
  return result
}

/**
 * Custom hook for managing shareholders agreement form state and validation
 */
export function useShareholdersAgreementForm(): UseShareholdersAgreementFormReturn {
  // Form state
  const [formData, setFormData] = useState<ShareholdersAgreementFormData>(DEFAULT_SHAREHOLDERS_AGREEMENT_DATA)
  const [errors, setErrors] = useState<ShareholdersAgreementValidationErrors>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  // Calculate derived data in real-time
  const calculatedData = useMemo<ShareholdersAgreementCalculatedData>(() => {
    const totalShareholding = formData.shareholders.reduce((sum, sh) => sum + (sh.shareholding || 0), 0)
    
    const calculations: ShareholdersAgreementCalculations = {
      totalShareholdingVerified: totalShareholding === 100,
    }
    
    return {
      formData,
      calculations,
    }
  }, [formData])

  // Section completion checks
  const isSectionComplete = useMemo(() => ({
    company: 
      formData.company.companyName.trim().length >= 2 &&
      formData.company.registeredAddress.trim().length >= 10 &&
      formData.company.dateOfAgreement.trim().length > 0 &&
      !!formData.company.companyType, // enum - just check if has value
    shareholders:
      formData.shareholders.length >= 2 &&
      formData.shareholders.every(sh => 
        sh.name.trim().length >= 2 && 
        sh.email.trim().length >= 5 && 
        sh.shareholding > 0 &&
        sh.noOfShares > 0 &&
        !!sh.role // enum - just check if has value
      ) &&
      formData.shareholders.reduce((sum, sh) => sum + (sh.shareholding || 0), 0) === 100,
    shareCapital:
      formData.shareCapital.authorizedShareCapital > 0 &&
      formData.shareCapital.paidUpShareCapital > 0 &&
      formData.shareCapital.faceValuePerShare > 0 &&
      formData.shareCapital.paidUpShareCapital <= formData.shareCapital.authorizedShareCapital,
    boardManagement:
      formData.boardManagement.totalDirectors > 0 &&
      !!formData.boardManagement.directorAppointmentBy, // enum - just check if has value
    votingRights:
      !!formData.votingRights.votingBasis && // enum - just check if has value
      !!formData.votingRights.decisionsRequire, // enum - just check if has value
    shareTransfer:
      (formData.shareTransfer.lockInPeriod ?? 0) >= 0,
    tagAlongDragAlong: true, // Optional section
    exitBuyout:
      !!formData.exitBuyout.valuationMethod, // enum - just check if has value
    confidentiality: true, // Optional section
    deadlockResolution:
      !!formData.deadlockResolution.deadlockResolution && // enum - just check if has value
      formData.deadlockResolution.arbitrationLocation.trim().length > 0, // text field
    termination: (formData.termination.noticePeriod ?? 0) >= 0,
    signatureDetails:
      formData.signatureDetails.placeOfSigning.trim().length >= 2 &&
      formData.signatureDetails.noOfWitnesses >= 0,
  }), [formData])

  /**
   * Set a nested value in form data
   */
  const setNestedFormValue = useCallback((path: string, value: any) => {
    setFormData((prev) => setNestedValueHelper(prev, path, value))
  }, [])

  /**
   * Handle input change
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target
      
      let processedValue: any = value
      
      // Handle number inputs
      if (type === "number") {
        processedValue = value === "" ? 0 : parseFloat(value)
      }
      
      setNestedFormValue(name, processedValue)
      
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    },
    [setNestedFormValue, errors]
  )

  /**
   * Handle checkbox change
   */
  const handleCheckboxChange = useCallback((path: string, value: string, checked: boolean) => {
    setFormData((prev) => {
      const current = getNestedValue(prev, path) || []
      const updated = checked 
        ? [...current, value]
        : current.filter((v: string) => v !== value)
      return setNestedValueHelper(prev, path, updated)
    })
  }, [])

  /**
   * Add a new shareholder
   */
  const handleAddShareholder = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      shareholders: [
        ...prev.shareholders,
        {
          name: "",
          email: "",
          address: "",
          shareholding: 0,
          noOfShares: 0,
          role: "founder",
        },
      ],
    }))
  }, [])

  /**
   * Remove a shareholder
   */
  const handleRemoveShareholder = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      shareholders: prev.shareholders.filter((_, i) => i !== index),
    }))
  }, [])

  /**
   * Handle shareholder field change
   */
  const handleShareholderChange = useCallback((index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.shareholders]
      if (field === "shareholding" || field === "noOfShares") {
        updated[index] = { ...updated[index], [field]: typeof value === "string" ? parseFloat(value) || 0 : value }
      } else {
        updated[index] = { ...updated[index], [field]: value }
      }
      return { ...prev, shareholders: updated }
    })
  }, [])

  /**
   * Validate a single field using Zod schema
   */
  const validateField = useCallback((fieldPath: string, value: any): string | null => {
    try {
      // Create a test object with this field to validate against partial schema
      const testObj = setNestedValueHelper(formData, fieldPath, value)
      const result = shareholdersAgreementSchema.safeParse(testObj)
      
      if (!result.success) {
        // Find error for this specific path
        const error = result.error.errors.find(err => err.path.join(".") === fieldPath)
        return error?.message || null
      }
      return null
    } catch (error) {
      console.error(`[Shareholders Agreement] Field validation error:`, error)
      return null
    }
  }, [formData])

  /**
   * Validate entire form using Zod schema
   */
  const validateForm = useCallback(
    (data?: ShareholdersAgreementFormData): { isValid: boolean; errors: ShareholdersAgreementValidationErrors } => {
      const dataToValidate = data || formData
      const result = shareholdersAgreementSchema.safeParse(dataToValidate)

      if (!result.success) {
        const newErrors: ShareholdersAgreementValidationErrors = {}
        result.error.errors.forEach((error) => {
          const fieldName = error.path.join(".") as string
          newErrors[fieldName as keyof typeof newErrors] = error.message
        })
        setErrors(newErrors)
        return { isValid: false, errors: newErrors }
      }

      setErrors({})
      return { isValid: true, errors: {} }
    },
    [formData]
  )

  /**
   * Handle field blur for validation
   */
  const handleBlur = useCallback(
    (fieldPath: string, value?: any) => {
      setTouchedFields((prev) => new Set(prev).add(fieldPath))
      
      const fieldValue = value ?? getNestedValue(formData, fieldPath)
      const error = validateField(fieldPath, fieldValue)
      
      if (error) {
        setErrors((prev) => ({ ...prev, [fieldPath]: error }))
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[fieldPath]
          return newErrors
        })
      }
    },
    [formData, validateField]
  )

  /**
   * Mark a field as touched
   */
  const markFieldTouched = useCallback((fieldPath: string) => {
    setTouchedFields((prev) => new Set(prev).add(fieldPath))
  }, [])

  /**
   * Check if should show error for field
   */
  const shouldShowError = useCallback(
    (fieldPath: string) => touchedFields.has(fieldPath) && !!errors[fieldPath],
    [touchedFields, errors]
  )

  /**
   * Check if field is touched
   */
  const isFieldTouched = useCallback((fieldPath: string) => touchedFields.has(fieldPath), [touchedFields])

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_SHAREHOLDERS_AGREEMENT_DATA)
    setErrors({})
    setTouchedFields(new Set())
  }, [])

  return {
    formData,
    errors,
    touchedFields,
    calculatedData,
    setFormData,
    setNestedValue: setNestedFormValue,
    handleChange,
    handleBlur,
    handleCheckboxChange,
    handleAddShareholder,
    handleRemoveShareholder,
    handleShareholderChange,
    validateField,
    validateForm,
    markFieldTouched,
    clearErrors,
    isSectionComplete,
    shouldShowError,
    isFieldTouched,
    resetForm,
  }
}
