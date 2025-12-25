/**
 * useInvoiceForm hook
 * Manages invoice form state, validation, and calculations
 * Decoupled from React components for testing and reusability
 */

"use client"

import { useState, useCallback, useMemo } from "react"
import type {
  InvoiceData,
  InvoiceTotals,
  InvoiceValidationErrors,
  InvoiceCalculatedData,
} from "@/lib/documents/invoice"
import {
  calculateInvoiceTotals,
  invoiceSchema,
  invoiceFieldSchema,
  DEFAULT_INVOICE_DATA,
  type InvoiceFormData,
} from "@/lib/documents/invoice"

interface UseInvoiceFormReturn {
  // State
  formData: InvoiceData
  errors: InvoiceValidationErrors
  touchedFields: Set<string>

  // Calculated data (real-time)
  calculatedData: InvoiceCalculatedData

  // Form control methods
  setFormData: (data: InvoiceData) => void
  setFieldValue: (fieldName: string, value: any) => void
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleBlur: (fieldName: string, value?: any) => void

  // Validation methods
  validateField: (fieldName: string, value: any) => string | null
  validateForm: (data?: InvoiceData) => { isValid: boolean; errors: InvoiceValidationErrors }
  markFieldTouched: (fieldName: string) => void
  clearErrors: () => void

  // Query methods
  shouldShowError: (fieldName: string) => boolean
  isFieldTouched: (fieldName: string) => boolean

  // Helper methods
  resetForm: () => void
  fillTestData: () => void
}

/**
 * Custom hook for managing invoice form state and validation
 * @returns Object with form state and methods
 */
export function useInvoiceForm(): UseInvoiceFormReturn {
  // Form state
  const [formData, setFormData] = useState<InvoiceData>(DEFAULT_INVOICE_DATA)
  const [errors, setErrors] = useState<InvoiceValidationErrors>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  // Calculate derived data in real-time
  const calculatedData = useMemo<InvoiceCalculatedData>(() => {
    const totals = calculateInvoiceTotals(formData)
    return {
      formData,
      totals,
    }
  }, [formData])

  /**
   * Validate a single field
   */
  const validateField = useCallback((fieldName: string, value: any): string | null => {
    try {
      const result = invoiceFieldSchema.safeParse({ [fieldName]: value })
      if (!result.success) {
        const error = result.error.errors.find((err) => err.path[0] === fieldName)
        return error?.message || null
      }
      return null
    } catch {
      console.error(`[Invoice] Field validation error for ${fieldName}:`, value)
      return null
    }
  }, [])

  /**
   * Validate entire form
   */
  const validateForm = useCallback(
    (data?: InvoiceData): { isValid: boolean; errors: InvoiceValidationErrors } => {
      const dataToValidate = data || formData
      const result = invoiceSchema.safeParse(dataToValidate)

      if (!result.success) {
        const newErrors: InvoiceValidationErrors = {}
        result.error.errors.forEach((error) => {
          const fieldName = error.path[0] as string
          newErrors[fieldName as keyof InvoiceData] = error.message
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
   * Update single field value
   */
  const setFieldValue = useCallback((fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))

    // Real-time validation if field is touched
    if (touchedFields.has(fieldName)) {
      const error = validateField(fieldName, value)
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error || undefined,
      }))
    }
  }, [touchedFields, validateField])

  /**
   * Handle change event from input elements
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFieldValue(name, value)
    },
    [setFieldValue]
  )

  /**
   * Handle blur event - mark field as touched and validate
   */
  const handleBlur = useCallback(
    (fieldName: string, value?: any) => {
      markFieldTouched(fieldName)
      const fieldValue = value !== undefined ? value : formData[fieldName as keyof InvoiceData]
      const error = validateField(fieldName, fieldValue)
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error || undefined,
      }))
    },
    [formData, validateField]
  )

  /**
   * Mark field as touched
   */
  const markFieldTouched = useCallback((fieldName: string) => {
    setTouchedFields((prev) => new Set([...prev, fieldName]))
  }, [])

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  /**
   * Should show error for field (only if touched)
   */
  const shouldShowError = useCallback((fieldName: string): boolean => {
    return touchedFields.has(fieldName) && !!errors[fieldName as keyof InvoiceValidationErrors]
  }, [errors, touchedFields])

  /**
   * Check if field is touched
   */
  const isFieldTouched = useCallback(
    (fieldName: string): boolean => {
      return touchedFields.has(fieldName)
    },
    [touchedFields]
  )

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_INVOICE_DATA)
    setErrors({})
    setTouchedFields(new Set())
  }, [])

  /**
   * Fill form with test data for development
   */
  const fillTestData = useCallback(() => {
    const testData: InvoiceData = {
      sellerName: "ABC Software Solutions Pvt Ltd",
      sellerAddress: "123 Tech Park, Bangalore, Karnataka 560001",
      sellerGSTIN: "29ABCDE1234F1Z5",
      buyerName: "XYZ Corporation",
      buyerAddress: "456 Business Center, Mumbai, Maharashtra 400001",
      buyerGSTIN: "27XYZWV9876F1Z3",
      placeOfSupplyState: "27",
      invoiceNumber: "INV-2025-001",
      invoiceDate: new Date().toISOString().split("T")[0],
      itemDescription: "Software Development Services - Custom Web Application Development",
      hsnCode: "998314",
      quantity: "10",
      rate: "15000",
      cgst: "9",
      sgst: "9",
      igst: "0",
    }

    setFormData(testData)

    // Mark all fields as touched to show validation states
    const allFields = Object.keys(testData) as Array<keyof InvoiceData>
    setTouchedFields(new Set(allFields))

    // Validate all fields
    const newErrors: InvoiceValidationErrors = {}
    allFields.forEach((field) => {
      const error = validateField(field, testData[field])
      if (error) {
        newErrors[field] = error
      }
    })
    setErrors(newErrors)
  }, [validateField])

  return {
    // State
    formData,
    errors,
    touchedFields,

    // Calculated
    calculatedData,

    // State setters
    setFormData,
    setFieldValue,
    handleChange,
    handleBlur,

    // Validation
    validateField,
    validateForm,
    markFieldTouched,
    clearErrors,

    // Query
    shouldShowError,
    isFieldTouched,

    // Helpers
    resetForm,
    fillTestData,
  }
}
