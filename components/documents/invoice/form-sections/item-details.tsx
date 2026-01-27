"use client"

import type React from "react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import { Package } from "lucide-react"
import type { InvoiceData, InvoiceValidationErrors } from "@/lib/invoice"

const ITEM_FIELDS: FormFieldConfig[] = [
  {
    name: "itemDescription",
    label: "Item/Service Description",
    type: "textarea",
    placeholder: "e.g., Web development services for March 2025",
    required: true,
    colSpan: "full",
  },
  {
    name: "quantity",
    label: "Quantity",
    type: "number",
    placeholder: "1",
    required: true,
    colSpan: "third",
    min: 0.01,
    step: 0.01,
    helpText: "For services, keep as 1",
  },
  {
    name: "rate",
    label: "Unit Price (₹)",
    type: "number",
    placeholder: "0.00",
    required: true,
    colSpan: "third",
    min: 0,
    step: 0.01,
    helpText: "Total amount for the service",
  },
  {
    name: "hsnCode",
    label: "HSN/SAC Code (Optional)",
    type: "text",
    placeholder: "e.g., 998314 for IT services",
    required: false,
    colSpan: "third",
    maxLength: 8,
    helpText: "Leave blank if not applicable",
  },
]

interface ItemDetailsProps {
  formData: InvoiceData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: InvoiceValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  setFormData?: React.Dispatch<React.SetStateAction<InvoiceData>>
  isCompleted?: boolean
}

export function ItemDetails({
  formData,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  isCompleted,
}: ItemDetailsProps) {
  return (
    <FormSection
      title="Item Details"
      icon={Package}
      fields={ITEM_FIELDS}
      data={formData}
      errors={errors}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      isCompleted={isCompleted}
      layout={{ columns: 3, gap: 16 }}
    />
  )
}
