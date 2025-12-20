"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { Badge } from "@/components/ui/badge"
import type { InvoiceData, InvoiceValidationErrors } from "@/lib/types"
import type { useSuggestions } from "@/hooks/use-suggestions"
import { Sparkles } from "lucide-react"

interface SellerDetailsProps {
  formData: InvoiceData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: InvoiceValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  suggestions?: ReturnType<typeof useSuggestions>
}

export function SellerDetails({
  formData,
  onChange,
  onBlur,
  errors,
  shouldShowError,
  suggestions,
}: SellerDetailsProps) {
  const gstinAnalysis =
    suggestions && formData.sellerGSTIN.length === 15 ? suggestions.analyzeGSTIN(formData.sellerGSTIN) : null

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Seller Details</h3>
        <p className="text-sm text-muted-foreground">Your business information</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Business Name"
          htmlFor="sellerName"
          required
          error={shouldShowError?.("sellerName") ? errors?.sellerName : undefined}
        >
          <Input
            id="sellerName"
            name="sellerName"
            value={formData.sellerName}
            onChange={onChange}
            onBlur={() => onBlur?.("sellerName", formData.sellerName)}
            placeholder="Your Company Pvt Ltd"
          />
        </FormField>

        <FormField
          label="GSTIN"
          htmlFor="sellerGSTIN"
          required
          error={shouldShowError?.("sellerGSTIN") ? errors?.sellerGSTIN : undefined}
          hint="Format: 29ABCDE1234F1Z5"
          success={gstinAnalysis?.isValid}
        >
          <Input
            id="sellerGSTIN"
            name="sellerGSTIN"
            value={formData.sellerGSTIN}
            onChange={onChange}
            onBlur={() => onBlur?.("sellerGSTIN", formData.sellerGSTIN)}
            placeholder="29ABCDE1234F1Z5"
            className="uppercase"
          />
          {gstinAnalysis?.isValid && gstinAnalysis.state && (
            <Badge variant="secondary" className="mt-1 animate-in fade-in">
              <Sparkles className="h-3 w-3 mr-1" />
              {gstinAnalysis.state}
            </Badge>
          )}
          {formData.sellerGSTIN.length === 15 && !gstinAnalysis?.isValid && (
            <p className="text-xs text-destructive mt-1">Invalid GSTIN format - Please check and re-enter</p>
          )}
        </FormField>

        <FormField
          label="Address"
          htmlFor="sellerAddress"
          required
          error={shouldShowError?.("sellerAddress") ? errors?.sellerAddress : undefined}
          className="md:col-span-2"
        >
          <Textarea
            id="sellerAddress"
            name="sellerAddress"
            value={formData.sellerAddress}
            onChange={onChange}
            onBlur={() => onBlur?.("sellerAddress", formData.sellerAddress)}
            placeholder="123 Business Park, Mumbai, Maharashtra 400001"
            rows={2}
          />
        </FormField>
      </div>
    </div>
  )
}
