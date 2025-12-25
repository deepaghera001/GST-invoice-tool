"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { Badge } from "@/components/ui/badge"
import type { useSuggestions } from "@/hooks/use-suggestions"
import { Sparkles, Check } from "lucide-react"
import type { InvoiceData, InvoiceValidationErrors } from "@/lib/documents/invoice"

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
                {isCompleted ? <Check className="h-5 w-5" /> : '1'}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-0.5">Seller Details</h3>
                <p className="text-sm text-muted-foreground">Your business information</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-medium">
              Step 1 of 4
            </Badge>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ease-out ${isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-primary/30'
                }`}
              style={{
                width: isCompleted ? '100%' : `${(formData.sellerName.trim().length >= 2 ? 33 : 0) +
                  (formData.sellerAddress.trim().length >= 10 ? 33 : 0) +
                  (gstinAnalysis?.isValid ? 34 : 0)
                  }%`
              }}
            />
          </div>
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
              className="transition-all duration-200 focus:scale-[1.01]"
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
              className="uppercase transition-all duration-200 focus:scale-[1.01]"
            />
            {gstinAnalysis?.isValid && gstinAnalysis.state && (
              <Badge variant="secondary" className="mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Sparkles className="h-3 w-3 mr-1 text-yellow-500" />
                {gstinAnalysis.state}
              </Badge>
            )}
            {formData.sellerGSTIN.length === 15 && !gstinAnalysis?.isValid && shouldShowError?.("sellerGSTIN") && (
              <p className="text-xs text-destructive mt-2 animate-in fade-in slide-in-from-bottom-1">
                Invalid GSTIN format - Please check and re-enter
              </p>
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
              className="transition-all duration-200 focus:scale-[1.005] resize-none"
            />
          </FormField>
        </div>
      </div>
    </div>
  )
}
