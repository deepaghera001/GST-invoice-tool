"use client"

import { useState, useCallback } from "react"
import type { InvoiceValidationErrors } from "@/lib/validation"
import { FieldValidator } from "@/lib/validation"

export function useFormValidation() {
  const [errors, setErrors] = useState<InvoiceValidationErrors>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  const validateField = useCallback((fieldName: string, value: any) => {
    const error = FieldValidator.validateField(fieldName as any, value)

    setErrors((prev) => {
      const newErrors = { ...prev }
      if (error) {
        newErrors[fieldName as keyof InvoiceValidationErrors] = error
      } else {
        delete newErrors[fieldName as keyof InvoiceValidationErrors]
      }
      return newErrors
    })

    return error
  }, [])

  const validateForm = useCallback((data: any) => {
    const result = FieldValidator.validateForm(data)
    setErrors(result.errors)
    return result
  }, [])

  const markFieldTouched = useCallback((fieldName: string) => {
    setTouchedFields((prev) => new Set(prev).add(fieldName))
  }, [])

  const clearErrors = useCallback(() => {
    setErrors({})
    setTouchedFields(new Set())
  }, [])

  const shouldShowError = useCallback(
    (fieldName: string) => {
      return touchedFields.has(fieldName) && !!errors[fieldName as keyof InvoiceValidationErrors]
    },
    [touchedFields, errors],
  )

  return {
    errors,
    validateField,
    validateForm,
    markFieldTouched,
    clearErrors,
    shouldShowError,
  }
}
