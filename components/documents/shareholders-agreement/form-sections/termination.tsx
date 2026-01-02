/**
 * Termination Form Section - Section 11
 */

"use client"

import type React from "react"
import { XCircle, Check } from "lucide-react"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { ShareholdersAgreementFormData, ShareholdersAgreementValidationErrors } from "@/lib/shareholders-agreement"

const TERMINATION_CONDITIONS = [
  { id: "mutual-consent", label: "Mutual consent" },
  { id: "insolvency", label: "Insolvency" },
  { id: "breach-terms", label: "Breach of terms" },
]

interface TerminationProps {
  formData: ShareholdersAgreementFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  onCheckboxChange?: (path: string, value: string, checked: boolean) => void
  errors?: ShareholdersAgreementValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function Termination({
  formData,
  onChange,
  onBlur,
  onCheckboxChange,
  errors = {},
  shouldShowError = () => false,
  isCompleted,
}: TerminationProps) {
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
          <XCircle className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Termination</h3>
        </div>

        {/* Notice Period */}
        <FormField
          label="Notice Period (days)"
          htmlFor="noticePeriod"
          hint="Days required to provide termination notice"
          error={shouldShowError("termination.noticePeriod") ? errors["termination.noticePeriod"] : undefined}
        >
          <Input
            id="noticePeriod"
            type="number"
            placeholder="30"
            min={0}
            max={365}
            value={formData.termination.noticePeriod}
            onChange={(e) => onChange({ ...e, target: { ...e.target, name: "termination.noticePeriod", type: e.target.type } })}
            onBlur={() => onBlur?.("termination.noticePeriod", formData.termination.noticePeriod)}
            className={shouldShowError("termination.noticePeriod") ? "border-destructive" : ""}
          />
        </FormField>

        {/* Termination Conditions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Termination Conditions (select applicable)</h4>
          <div className="space-y-2">
            {TERMINATION_CONDITIONS.map((condition) => (
              <label key={condition.id} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-muted/50 transition-colors">
                <Checkbox
                  checked={formData.termination.terminationConditions?.includes(condition.id) ?? false}
                  onCheckedChange={(checked) =>
                    onCheckboxChange?.("termination.terminationConditions", condition.id, checked === true)
                  }
                />
                <span className="text-sm text-foreground">{condition.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
