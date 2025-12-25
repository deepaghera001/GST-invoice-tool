"use client"

import type React from "react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import { Button } from "@/components/ui/button"
import type { useSuggestions } from "@/lib/hooks/use-suggestions"
import type { InvoiceData, InvoiceValidationErrors } from "@/lib/invoice"
import { Wand2 } from "lucide-react"
import { Calendar } from "lucide-react"

const INVOICE_FIELDS: FormFieldConfig[] = [
  {
    name: "invoiceNumber",
    label: "Invoice Number",
    placeholder: "INV-2025-001",
    required: true,
    colSpan: "half", // Only takes half width
  },
  {
    name: "invoiceDate",
    label: "Invoice Date",
    type: "date",
    required: true,
    colSpan: "half", // Only takes half width - clean 2-column layout
  },
]

interface InvoiceDetailsProps {
  formData: InvoiceData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: InvoiceValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  suggestions?: ReturnType<typeof useSuggestions>
  isCompleted?: boolean
}

export function InvoiceDetails({
  formData,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  suggestions,
  isCompleted,
}: InvoiceDetailsProps) {
  const handleGenerateInvoiceNumber = () => {
    if (!suggestions) return

    const invoiceNumber = suggestions.generateInvoiceNumber("INV-")
    const event = {
      target: { name: "invoiceNumber", value: invoiceNumber },
    } as React.ChangeEvent<HTMLInputElement>
    onChange(event)
  }


  return (
    <FormSection
      title="Invoice Details"
      icon={Calendar}
      fields={INVOICE_FIELDS}
      data={formData}
      errors={errors}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      isCompleted={isCompleted}
      layout={{ columns: 2, gap: 16 }} // 2-column layout for compact display
    >
      {suggestions && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGenerateInvoiceNumber}
          className="w-full mt-2 transition-all duration-200 hover:scale-105"
        >
          <Wand2 className="h-4 w-4 mr-2" />
          Generate Invoice Number
        </Button>
      )}
    </FormSection>
  )
}
