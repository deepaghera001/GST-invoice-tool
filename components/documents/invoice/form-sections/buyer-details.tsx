"use client"

import type React from "react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import type { useSuggestions } from "@/lib/hooks/use-suggestions"
import { Sparkles } from "lucide-react"
import { Users } from "lucide-react"
import type { InvoiceData, InvoiceValidationErrors } from "@/lib/invoice"

// Define fields once, reuse in component
const BUYER_FIELDS: FormFieldConfig[] = [
  {
    name: "buyerName",
    label: "Customer Name",
    placeholder: "Customer/Company Name",
    required: true,
  },
  {
    name: "buyerAddress",
    label: "Address",
    type: "textarea",
    placeholder: "Full address with pin code",
    required: true,
  },
  {
    name: "buyerGSTIN",
    label: "GSTIN (Optional)",
    placeholder: "GSTIN (optional)",
    required: false,
  },
]

interface BuyerDetailsProps {
  formData: InvoiceData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: InvoiceValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  suggestions?: ReturnType<typeof useSuggestions>
  isCompleted?: boolean
}

export function BuyerDetails({
  formData,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  suggestions,
  isCompleted,
}: BuyerDetailsProps) {
  const gstinAnalysis =
    suggestions && formData.buyerGSTIN && formData.buyerGSTIN.length === 15
      ? suggestions.analyzeGSTIN(formData.buyerGSTIN)
      : null

  return (
    <FormSection
      title="Customer (Buyer) Details"
      icon={Users}
      fields={BUYER_FIELDS}
      data={formData}
      errors={errors}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      isCompleted={isCompleted}
    >
      {/* Document-specific content (suggestions) */}
      {gstinAnalysis && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">GSTIN Validation</p>
          </div>
          {gstinAnalysis.isValid && gstinAnalysis.state && (
            <p className="text-sm text-blue-700 dark:text-blue-200">✓ {gstinAnalysis.state}</p>
          )}
        </div>
      )}
    </FormSection>
  )
}
