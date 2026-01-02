/**
 * Exit & Buyout Clauses Form Section - Section 8
 */

"use client"

import type React from "react"
import { LogOut, Check } from "lucide-react"
import { FormField } from "@/components/ui/form-field"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { ShareholdersAgreementFormData, ShareholdersAgreementValidationErrors } from "@/lib/shareholders-agreement"

const EXIT_OPTIONS = [
  { id: "buy-back-company", label: "Buy-back by company" },
  { id: "sale-third-party", label: "Sale to third party" },
  { id: "ipo", label: "IPO" },
]

interface ExitBuyoutClausesProps {
  formData: ShareholdersAgreementFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  onCheckboxChange?: (path: string, value: string, checked: boolean) => void
  errors?: ShareholdersAgreementValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function ExitBuyoutClauses({
  formData,
  onChange,
  onBlur,
  onCheckboxChange,
  errors = {},
  shouldShowError = () => false,
  isCompleted,
}: ExitBuyoutClausesProps) {
  return (
    <div
      className={`
        relative p-6 rounded-xl border transition-all duration-500 ease-out
        ${
          isCompleted
            ? "border-green-400/40 bg-gradient-to-br from-green-50/30 to-transparent dark:from-green-950/10 shadow-md shadow-green-500/5"
            : "border-border bg-card hover:border-primary/30 hover:shadow-md"
        }
      `}
    >
      {isCompleted && (
        <div className="absolute -top-2 -right-2 animate-in zoom-in duration-500">
          <Badge className="relative bg-green-500 text-white border-0 px-3 py-1.5">
            <Check className="h-4 w-4 mr-1" />
            Complete
          </Badge>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <LogOut className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Exit & Buyout Clauses</h3>
        </div>

        {/* Valuation Method */}
        <FormField
          label="Valuation Method"
          htmlFor="valuationMethod"
          required
          error={shouldShowError("exitBuyout.valuationMethod") ? errors["exitBuyout.valuationMethod"] : undefined}
        >
          <select
            id="valuationMethod"
            value={formData.exitBuyout.valuationMethod}
            onChange={(e) => onChange({ ...e, target: { ...e.target, name: "exitBuyout.valuationMethod", type: e.target.type } } as any)}
            onBlur={(e) => onBlur?.("exitBuyout.valuationMethod", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm bg-background ${shouldShowError("exitBuyout.valuationMethod") ? "border-destructive" : "border-input"}`}
          >
            <option value="">Select valuation method</option>
            <option value="fair-market-value">Fair Market Value</option>
            <option value="mutual-agreement">Mutual Agreement</option>
            <option value="independent-valuer">Independent Valuer</option>
          </select>
        </FormField>

        {/* Exit Options */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Exit Options (select applicable)</h4>
          <div className="space-y-2">
            {EXIT_OPTIONS.map((option) => (
              <label key={option.id} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-muted/50 transition-colors">
                <Checkbox
                  checked={formData.exitBuyout.exitOptions?.includes(option.id) ?? false}
                  onCheckedChange={(checked) =>
                    onCheckboxChange?.("exitBuyout.exitOptions", option.id, checked === true)
                  }
                />
                <span className="text-sm text-foreground">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
