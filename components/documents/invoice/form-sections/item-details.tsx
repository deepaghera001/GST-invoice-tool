"use client"

import type React from "react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import { Package } from "lucide-react"
import type { InvoiceData, InvoiceValidationErrors } from "@/lib/invoice"
import { HSNSACSearch } from "@/components/ui/hsn-sac-search"
import type { HSNCode } from "@/lib/invoice/data/hsn-sac-codes"

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
  },
  {
    name: "hsnCode",
    label: "HSN/SAC Code",
    placeholder: "e.g., 998314",
    required: false,
    colSpan: "third",
    maxLength: 8,
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
  setFormData,
  isCompleted,
}: ItemDetailsProps) {

  const handleHSNSelect = (code: string, gstRate: number | null, codeDetails: HSNCode) => {
    // Update HSN code field
    const event = {
      target: { name: "hsnCode", value: code },
    } as React.ChangeEvent<HTMLInputElement>
    onChange(event)

    // Auto-fill GST rate if available (SAC codes only)
    if (gstRate && setFormData) {
      const halfRate = (gstRate / 2).toString()
      setFormData((prev) => ({
        ...prev,
        hsnCode: code,
        cgst: halfRate,
        sgst: halfRate,
      }))
    }
  }

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
    >
      {/* HSN/SAC Code Search Component */}
      <HSNSACSearch
        value={formData.hsnCode}
        onSelect={handleHSNSelect}
        placeholder="Search HSN/SAC Code (Auto-fills GST for services)"
      />
    </FormSection>
  )
}
