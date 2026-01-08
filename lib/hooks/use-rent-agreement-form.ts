/**
 * useRentAgreementForm hook
 * Manages rent agreement form state, validation, and calculations
 */

"use client"

import { useState, useCallback, useMemo } from "react"
import type {
  RentAgreementFormData,
  RentAgreementCalculations,
  RentAgreementValidationErrors,
  RentAgreementCalculatedData,
} from "@/lib/rent-agreement"
import {
  calculateRentAgreement,
  rentAgreementSchema,
  DEFAULT_RENT_AGREEMENT_DATA,
} from "@/lib/rent-agreement"

// Extract section schemas from the main schema for section-level validation
const landlordSchema = rentAgreementSchema.shape.landlord
const tenantSchema = rentAgreementSchema.shape.tenant
const propertySchema = rentAgreementSchema.shape.property
const rentTermsSchema = rentAgreementSchema.shape.rentTerms
const clausesSchema = rentAgreementSchema.shape.clauses

interface UseRentAgreementFormReturn {
  // State
  formData: RentAgreementFormData
  errors: RentAgreementValidationErrors
  touchedFields: Set<string>

  // Calculated data (real-time)
  calculatedData: RentAgreementCalculatedData

  // Form control methods
  setFormData: (data: RentAgreementFormData) => void
  setNestedValue: (path: string, value: any) => void
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleBlur: (fieldPath: string, value?: any) => void
  handleCheckboxChange: (path: string, checked: boolean) => void

  // Validation methods
  validateField: (fieldPath: string, value: any) => string | null
  validateForm: () => { isValid: boolean; errors: RentAgreementValidationErrors }
  markFieldTouched: (fieldPath: string) => void
  clearErrors: () => void

  // Section completion checks (using Zod)
  isSectionComplete: {
    landlord: boolean
    tenant: boolean
    property: boolean
    rentTerms: boolean
    clauses: boolean
  }
  isFormComplete: boolean
  completedSectionsCount: number
  totalSections: number

  // Query methods
  shouldShowError: (fieldPath: string) => boolean
  isFieldTouched: (fieldPath: string) => boolean

  // Helper methods
  resetForm: () => void
  fillTestData: () => void
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
function setNestedValue(obj: any, path: string, value: any): any {
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
 * Custom hook for managing rent agreement form state and validation
 */
export function useRentAgreementForm(): UseRentAgreementFormReturn {
  // Form state
  const [formData, setFormData] = useState<RentAgreementFormData>(DEFAULT_RENT_AGREEMENT_DATA)
  const [errors, setErrors] = useState<RentAgreementValidationErrors>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  // Calculate derived data in real-time
  const calculatedData = useMemo<RentAgreementCalculatedData>(() => {
    const calculations = calculateRentAgreement(formData)
    return {
      formData,
      calculations,
    }
  }, [formData])

  // Section completion checks using Zod validation
  const isSectionComplete = useMemo(() => ({
    landlord: landlordSchema.safeParse(formData.landlord).success,
    tenant: tenantSchema.safeParse(formData.tenant).success,
    property: propertySchema.safeParse(formData.property).success,
    rentTerms: rentTermsSchema.safeParse(formData.rentTerms).success,
    clauses: clausesSchema.safeParse(formData.clauses).success,
  }), [formData])

  // Form completion status
  const isFormComplete = useMemo(() => 
    Object.values(isSectionComplete).every(Boolean),
    [isSectionComplete]
  )

  const completedSectionsCount = useMemo(() => 
    Object.values(isSectionComplete).filter(Boolean).length,
    [isSectionComplete]
  )

  const totalSections = 5

  /**
   * Set a nested value in form data
   */
  const setNestedFormValue = useCallback((path: string, value: any) => {
    setFormData((prev) => setNestedValue(prev, path, value))
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
  const handleCheckboxChange = useCallback((path: string, checked: boolean) => {
    setNestedFormValue(path, checked)
  }, [setNestedFormValue])

  /**
   * Validate a single field
   */
  const validateField = useCallback((fieldPath: string, value: any): string | null => {
    // Basic validation for required fields
    const requiredFields = [
      "landlord.name", "landlord.address", "landlord.phone",
      "tenant.name", "tenant.address", "tenant.phone",
      "property.address", "property.city", "property.state", "property.pincode",
      "rentTerms.monthlyRent", "rentTerms.securityDeposit", "rentTerms.agreementStartDate",
    ]
    
    if (requiredFields.includes(fieldPath)) {
      if (value === "" || value === null || value === undefined || value === 0) {
        return "This field is required"
      }
    }
    
    // Phone validation
    if (fieldPath.endsWith(".phone") && value) {
      const phoneRegex = /^[6-9]\d{9}$/
      if (!phoneRegex.test(value)) {
        return "Invalid phone number (10 digits starting with 6-9)"
      }
    }
    
    // Email validation
    if (fieldPath.endsWith(".email") && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return "Invalid email address"
      }
    }
    
    // Pincode validation
    if (fieldPath === "property.pincode" && value) {
      const pincodeRegex = /^\d{6}$/
      if (!pincodeRegex.test(value)) {
        return "Invalid pincode (6 digits)"
      }
    }
    
    // PAN validation
    if (fieldPath.endsWith(".panNumber") && value) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
      if (!panRegex.test(value.toUpperCase())) {
        return "Invalid PAN format (e.g., ABCDE1234F)"
      }
    }
    
    // Aadhar validation
    if (fieldPath.endsWith(".aadharNumber") && value) {
      const aadharRegex = /^\d{12}$/
      if (!aadharRegex.test(value)) {
        return "Invalid Aadhar number (12 digits)"
      }
    }
    
    return null
  }, [])

  /**
   * Validate entire form
   */
  const validateForm = useCallback((): { isValid: boolean; errors: RentAgreementValidationErrors } => {
    const result = rentAgreementSchema.safeParse(formData)

    if (!result.success) {
      const newErrors: RentAgreementValidationErrors = {}
      result.error.errors.forEach((error) => {
        const path = error.path.join(".")
        newErrors[path] = error.message
      })
      setErrors(newErrors)
      return { isValid: false, errors: newErrors }
    }

    setErrors({})
    return { isValid: true, errors: {} }
  }, [formData])

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
   * Check if error should be shown for a field
   */
  const shouldShowError = useCallback(
    (fieldPath: string): boolean => {
      return touchedFields.has(fieldPath) && !!errors[fieldPath]
    },
    [touchedFields, errors]
  )

  /**
   * Check if field has been touched
   */
  const isFieldTouched = useCallback(
    (fieldPath: string): boolean => {
      return touchedFields.has(fieldPath)
    },
    [touchedFields]
  )

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  /**
   * Reset form to default values
   */
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_RENT_AGREEMENT_DATA)
    setErrors({})
    setTouchedFields(new Set())
  }, [])

  /**
   * Fill form with test data
   */
  const fillTestData = useCallback(() => {
    const today = new Date()
    const startDate = new Date(today.getFullYear(), today.getMonth() + 1, 1) // First of next month
    
    setFormData({
      landlord: {
        name: "Rajesh Kumar Sharma",
        address: "Flat 501, Sunrise Apartments, MG Road, Bangalore - 560001",
        phone: "9876543210",
        email: "rajesh.sharma@email.com",
        panNumber: "ABCDE1234F",
        aadharNumber: "123456789012",
      },
      tenant: {
        name: "Priya Patel",
        address: "45, Green Valley Society, Andheri West, Mumbai - 400053",
        phone: "8765432109",
        email: "priya.patel@email.com",
        panNumber: "FGHIJ5678K",
        aadharNumber: "987654321098",
      },
      property: {
        address: "Flat 302, Blue Sky Towers, Koramangala 4th Block",
        city: "Bangalore",
        state: "KA",
        pincode: "560034",
        propertyType: "apartment",
        furnishingStatus: "semi-furnished",
        area: "1200",
        floor: "3",
        parking: true,
      },
      rentTerms: {
        monthlyRent: 25000,
        securityDeposit: 100000,
        maintenanceCharges: 3000,
        maintenanceIncluded: false,
        rentDueDay: 5,
        agreementStartDate: startDate.toISOString().split("T")[0],
        agreementDuration: 11,
        noticePeriod: 1,
        rentIncrementPercent: 5,
        paymentMode: "bank-transfer",
      },
      clauses: {
        noSubLetting: true,
        propertyInspection: true,
        repairsResponsibility: true,
        utilityPayment: true,
        peacefulUse: true,
        noIllegalActivity: true,
        lockInPeriod: true,
        lockInMonths: 3,
        additionalClauses: "",
      },
    })
    setErrors({})
    setTouchedFields(new Set())
  }, [])

  return {
    // State
    formData,
    errors,
    touchedFields,
    calculatedData,

    // Form control methods
    setFormData,
    setNestedValue: setNestedFormValue,
    handleChange,
    handleBlur,
    handleCheckboxChange,

    // Validation methods
    validateField,
    validateForm,
    markFieldTouched,
    clearErrors,

    // Section completion (Zod-based)
    isSectionComplete,
    isFormComplete,
    completedSectionsCount,
    totalSections,

    // Query methods
    shouldShowError,
    isFieldTouched,

    // Helper methods
    resetForm,
    fillTestData,
  }
}
