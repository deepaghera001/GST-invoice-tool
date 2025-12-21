"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import type { InvoiceData, InvoiceValidationErrors } from "@/lib/types"
import type { useSuggestions } from "@/hooks/use-suggestions"
import { Wand2, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
  errors,
  shouldShowError,
  suggestions,
  isCompleted,
}: InvoiceDetailsProps) {
  const [showTemplates, setShowTemplates] = useState(false)

  const handleGenerateInvoiceNumber = () => {
    if (!suggestions) return

    const invoiceNumber = suggestions.generateInvoiceNumber("INV-")
    const event = {
      target: { name: "invoiceNumber", value: invoiceNumber },
    } as React.ChangeEvent<HTMLInputElement>
    onChange(event)
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Invoice Details</h3>
            <p className="text-sm text-muted-foreground">Invoice number and date</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Step 3 of 4
            </Badge>
            {isCompleted && (
              <Badge variant="secondary" className="text-xs p-1">
                <Check className="h-3 w-3" />
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <FormField
          label="Invoice Number"
          htmlFor="invoiceNumber"
          required
          error={shouldShowError?.("invoiceNumber") ? errors?.invoiceNumber : undefined}
          hint="e.g., INV-2025-001"
        >
          <div className="flex gap-2">
            <Input
              id="invoiceNumber"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={onChange}
              onBlur={() => onBlur?.("invoiceNumber", formData.invoiceNumber)}
              placeholder="INV-2025-001"
              className="flex-1"
            />
            {suggestions && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleGenerateInvoiceNumber}
                title="Generate invoice number"
              >
                <Wand2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </FormField>

        <FormField
          label="Invoice Date"
          htmlFor="invoiceDate"
          required
          error={shouldShowError?.("invoiceDate") ? errors?.invoiceDate : undefined}
        >
          <Input
            id="invoiceDate"
            name="invoiceDate"
            type="date"
            value={formData.invoiceDate}
            onChange={onChange}
            onBlur={() => onBlur?.("invoiceDate", formData.invoiceDate)}
          />
        </FormField>
      </div>
    </div>
  )
}
