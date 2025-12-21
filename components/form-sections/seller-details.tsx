"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { Badge } from "@/components/ui/badge"
import type { InvoiceData, InvoiceValidationErrors } from "@/lib/types"
import type { useSuggestions } from "@/hooks/use-suggestions"
import { Sparkles, Check } from "lucide-react"

interface SellerDetailsProps {
  formData: InvoiceData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: InvoiceValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  suggestions?: ReturnType<typeof useSuggestions>
  isCompleted?: boolean
}

export function SellerDetails({
  formData,
  onChange,
  onBlur,
  errors,
  shouldShowError,
  suggestions,
  isCompleted,
}: SellerDetailsProps) {
  const gstinAnalysis =
    suggestions && formData.sellerGSTIN.length === 15 ? suggestions.analyzeGSTIN(formData.sellerGSTIN) : null

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Seller Details</h3>
            <p className="text-sm text-muted-foreground">Your business information</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Step 1 of 4
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
          {formData.sellerGSTIN.length === 15 && !gstinAnalysis?.isValid && shouldShowError?.("sellerGSTIN") && (
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
