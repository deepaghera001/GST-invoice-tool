/**
 * Exclusivity Section - Exclusivity Period and Revisions
 * Section 6 of the Influencer-Brand Contract
 */

"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { FormField } from "@/components/ui/form-field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, Lock } from "lucide-react"
import { EXCLUSIVITY_PERIOD_OPTIONS, REVISION_ROUNDS_OPTIONS } from "@/lib/influencer-contract"

interface ExclusivitySectionProps {
  formData: {
    exclusivityPeriod: string
    revisionRounds: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: Partial<Record<string, string>>
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function ExclusivitySection({
  formData,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  isCompleted = false,
}: ExclusivitySectionProps) {
  const handleSelectChange = (field: string) => (value: string) => {
    const syntheticEvent = {
      target: { name: field, value, type: "text" },
    } as any
    onChange(syntheticEvent)
  }

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
      {/* Completion badge */}
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
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-lg">Exclusivity & Revisions</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Exclusivity Period */}
          <FormField
            label="Exclusivity Period"
            htmlFor="exclusivity.exclusivityPeriod"
            error={shouldShowError("exclusivity.exclusivityPeriod") ? errors["exclusivity.exclusivityPeriod"] : undefined}
            hint="Period during which you cannot promote competing brands"
          >
            <Select
              value={formData.exclusivityPeriod}
              onValueChange={handleSelectChange("exclusivity.exclusivityPeriod")}
            >
              <SelectTrigger id="exclusivity.exclusivityPeriod">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {EXCLUSIVITY_PERIOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Revision Rounds */}
          <FormField
            label="Revision Rounds Allowed"
            htmlFor="exclusivity.revisionRounds"
            error={shouldShowError("exclusivity.revisionRounds") ? errors["exclusivity.revisionRounds"] : undefined}
            hint="Number of times brand can request changes"
          >
            <Select
              value={formData.revisionRounds}
              onValueChange={handleSelectChange("exclusivity.revisionRounds")}
            >
              <SelectTrigger id="exclusivity.revisionRounds">
                <SelectValue placeholder="Select rounds" />
              </SelectTrigger>
              <SelectContent>
                {REVISION_ROUNDS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        {/* Info boxes */}
        {formData.exclusivityPeriod !== "none" && (
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
            <p className="text-xs text-purple-800 dark:text-purple-200">
              <strong>Exclusivity Note:</strong> During this period, you agree not to promote brands 
              that directly compete with the Brand in the same product category.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
