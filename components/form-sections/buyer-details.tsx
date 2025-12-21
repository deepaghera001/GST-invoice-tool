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
    <div
      className={`
        relative p-6 rounded-xl border-2 transition-all duration-500 ease-out
        ${isCompleted
          ? 'border-green-500/50 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20 shadow-lg shadow-green-500/10'
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
                {isCompleted ? <Check className="h-5 w-5" /> : '2'}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-0.5">Buyer Details</h3>
                <p className="text-sm text-muted-foreground">Customer information</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-medium">
              Step 2 of 4
            </Badge>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ease-out ${isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-primary/30'
                }`}
              style={{
                width: isCompleted ? '100%' : `${(formData.buyerName.trim().length >= 2 ? 50 : 0) +
                  (formData.buyerAddress.trim().length >= 10 ? 50 : 0)
                  }%`
              }}
            />
          </div>
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
              className="transition-all duration-200 focus:scale-[1.01]"
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
              className="uppercase transition-all duration-200 focus:scale-[1.01]"
            />
            {gstinAnalysis?.isValid && gstinAnalysis.state && (
              <Badge variant="secondary" className="mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Sparkles className="h-3 w-3 mr-1 text-yellow-500" />
                {gstinAnalysis.state}
              </Badge>
            )}
            {formData.buyerGSTIN && formData.buyerGSTIN.length === 15 && !gstinAnalysis?.isValid && shouldShowError?.("buyerGSTIN") && (
              <p className="text-xs text-destructive mt-2 animate-in fade-in slide-in-from-bottom-1">
                Invalid GSTIN format - Please check and re-enter
              </p>
            )}
            {!formData.buyerGSTIN && (
              <p className="text-xs text-muted-foreground mt-2">
                Buyer GSTIN is optional. Invoice will be generated without it.
              </p>
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
              className="transition-all duration-200 focus:scale-[1.005] resize-none"
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
                className="transition-all duration-200 focus:scale-[1.01]"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Needed only if your client does NOT have GSTIN
              </p>
            </FormField>
          )}
        </div>
      </div>
    </div>
  )
}
