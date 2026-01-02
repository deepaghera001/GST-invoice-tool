/**
 * Confirmation Section - Disclaimer Acceptance
 * Section 8 of the Influencer-Brand Contract
 */

"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, AlertTriangle } from "lucide-react"

interface ConfirmationSectionProps {
  formData: {
    acceptedDisclaimer: boolean
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  errors?: Partial<Record<string, string>>
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function ConfirmationSection({
  formData,
  onChange,
  errors = {},
  shouldShowError = () => false,
  isCompleted = false,
}: ConfirmationSectionProps) {
  const handleCheckChange = (checked: boolean) => {
    const syntheticEvent = {
      target: { name: "confirmation.acceptedDisclaimer", value: checked, type: "checkbox" },
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
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-lg">Legal Confirmation</h3>
        </div>

        {/* Disclaimer Box */}
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={formData.acceptedDisclaimer}
              onCheckedChange={handleCheckChange}
              className="mt-1"
            />
            <div className="space-y-2">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                I understand this is a draft template for reference only and does not constitute legal advice.
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                By checking this box, you acknowledge that you have read and understood the above disclaimer. 
                This document is intended as a starting point and may need to be reviewed by a legal professional 
                for your specific situation.
              </p>
            </div>
          </label>
        </div>

        {shouldShowError("confirmation.acceptedDisclaimer") && errors["confirmation.acceptedDisclaimer"] && (
          <p className="text-sm text-destructive">{errors["confirmation.acceptedDisclaimer"]}</p>
        )}

        {!formData.acceptedDisclaimer && (
          <p className="text-xs text-muted-foreground">
            ⚠️ You must accept the disclaimer to generate the contract document.
          </p>
        )}
      </div>
    </div>
  )
}
