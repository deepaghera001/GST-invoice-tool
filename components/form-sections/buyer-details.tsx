"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { Badge } from "@/components/ui/badge"
import type { InvoiceData, InvoiceValidationErrors } from "@/lib/types"
import type { useSuggestions } from "@/hooks/use-suggestions"
import { Sparkles, Check } from "lucide-react"

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
  errors, 
  shouldShowError, 
  suggestions,
  isCompleted
}: BuyerDetailsProps) {
  const gstinAnalysis =
    suggestions && formData.buyerGSTIN && formData.buyerGSTIN.length === 15
      ? suggestions.analyzeGSTIN(formData.buyerGSTIN)
      : null

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Buyer Details</h3>
            <p className="text-sm text-muted-foreground">Customer information</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Step 2 of 4
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
          {formData.buyerGSTIN && formData.buyerGSTIN.length === 15 && !gstinAnalysis?.isValid && shouldShowError?.("buyerGSTIN") && (
            <p className="text-xs text-destructive mt-1">Invalid GSTIN format - Please check and re-enter</p>
          )}
          {!formData.buyerGSTIN && (
            <p className="text-xs text-muted-foreground mt-1">Buyer GSTIN is optional. Invoice will be generated without it.</p>
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

        {!formData.buyerGSTIN && (
          <FormField
            label="Place of Supply State Code"
            htmlFor="placeOfSupplyState"
            hint="Needed only if your client does NOT have GSTIN"
            className="md:col-span-2"
          >
            <Input
              id="placeOfSupplyState"
              name="placeOfSupplyState"
              value={formData.placeOfSupplyState || ""}
              onChange={onChange}
              onBlur={() => onBlur?.("placeOfSupplyState", formData.placeOfSupplyState)}
              placeholder="29 (for Karnataka)"
              maxLength={2}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Needed only if your client does NOT have GSTIN
            </p>
          </FormField>
        )}
      </div>
    </div>
  )
}
