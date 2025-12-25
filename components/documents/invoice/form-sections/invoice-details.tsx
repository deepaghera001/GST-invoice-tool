"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import type { useSuggestions } from "@/lib/hooks/use-suggestions"
import type { InvoiceData, InvoiceValidationErrors } from "@/lib/documents/invoice"
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
    <div
      className={`
        relative p-6 rounded-xl border transition-all duration-500 ease-out
        ${isCompleted
          ? 'border-green-400/40 bg-gradient-to-br from-green-50/30 to-transparent dark:from-green-950/10 shadow-md shadow-green-500/5'
          : 'border-border bg-card hover:border-primary/30 hover:shadow-md'
        }
      `}
    >
      {/* Completion celebration effect */}
      {isCompleted && (
        <div className="absolute -top-2 -right-2 animate-in zoom-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-50 animate-pulse"></div>
            <Badge className="relative bg-green-500 text-white border-0 px-3 py-1.5">
              <Check className="h-4 w-4 mr-1" />
              Complete
            </Badge>
          </div>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg transition-all duration-300
                ${isCompleted
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-primary/10 text-primary'
                }
              `}>
                {isCompleted ? <Check className="h-5 w-5" /> : '3'}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-0.5">Invoice Details</h3>
                <p className="text-sm text-muted-foreground">Invoice number and date</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-medium">
              Step 3 of 4
            </Badge>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ease-out ${isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-primary/30'
                }`}
              style={{
                width: isCompleted ? '100%' : `${(formData.invoiceNumber.trim().length >= 1 ? 50 : 0) +
                  (formData.invoiceDate.length > 0 ? 50 : 0)
                  }%`
              }}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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
                className="flex-1 transition-all duration-200 focus:scale-[1.01]"
              />
              {suggestions && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleGenerateInvoiceNumber}
                  title="Generate invoice number"
                  className="transition-all duration-200 hover:scale-105"
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
              className="transition-all duration-200 focus:scale-[1.01]"
            />
          </FormField>
        </div>
      </div>
    </div>
  )
}
