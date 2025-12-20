"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { Badge } from "@/components/ui/badge"
import type { InvoiceData, InvoiceValidationErrors } from "@/lib/types"
import type { useSuggestions } from "@/hooks/use-suggestions"
import { Sparkles } from "lucide-react"

interface BuyerDetailsProps {
  formData: InvoiceData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: InvoiceValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  suggestions?: ReturnType<typeof useSuggestions>
}

export function BuyerDetails({ formData, onChange, onBlur, errors, shouldShowError, suggestions }: BuyerDetailsProps) {
  const gstinAnalysis =
    suggestions && formData.buyerGSTIN && formData.buyerGSTIN.length === 15
      ? suggestions.analyzeGSTIN(formData.buyerGSTIN)
      : null

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Buyer Details</h3>
        <p className="text-sm text-muted-foreground">Customer information</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Customer Name"
          htmlFor="buyerName"
          required
          error={shouldShowError?.("buyerName") ? errors?.buyerName : undefined}
        >
          <Input
            id="buyerName"
            name="buyerName"
            value={formData.buyerName}
            onChange={onChange}
            onBlur={() => onBlur?.("buyerName", formData.buyerName)}
            placeholder="Client Company Ltd"
          />
        </FormField>

        <FormField
          label="GSTIN"
          htmlFor="buyerGSTIN"
          error={shouldShowError?.("buyerGSTIN") ? errors?.buyerGSTIN : undefined}
          hint="Enter only if your client is GST-registered in India"
          success={gstinAnalysis?.isValid}
        >
          <Input
            id="buyerGSTIN"
            name="buyerGSTIN"
            value={formData.buyerGSTIN}
            onChange={onChange}
            onBlur={() => onBlur?.("buyerGSTIN", formData.buyerGSTIN)}
            placeholder="29AABCT1332L1ZZ"
            className="uppercase"
          />
          {gstinAnalysis?.isValid && gstinAnalysis.state && (
            <Badge variant="secondary" className="mt-1 animate-in fade-in">
              <Sparkles className="h-3 w-3 mr-1" />
              {gstinAnalysis.state}
            </Badge>
          )}
          {formData.buyerGSTIN && formData.buyerGSTIN.length === 15 && !gstinAnalysis?.isValid && (
            <p className="text-xs text-destructive mt-1">Invalid GSTIN format - Please check and re-enter</p>
          )}
        </FormField>

        <FormField
          label="Address"
          htmlFor="buyerAddress"
          required
          error={shouldShowError?.("buyerAddress") ? errors?.buyerAddress : undefined}
          className="md:col-span-2"
        >
          <Textarea
            id="buyerAddress"
            name="buyerAddress"
            value={formData.buyerAddress}
            onChange={onChange}
            onBlur={() => onBlur?.("buyerAddress", formData.buyerAddress)}
            placeholder="456 Client Street, Bangalore, Karnataka 560001"
            rows={2}
          />
        </FormField>
      </div>
    </div>
  )
}
