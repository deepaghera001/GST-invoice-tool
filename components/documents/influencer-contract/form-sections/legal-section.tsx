/**
 * Legal Section - Termination and Jurisdiction
 * Section 7 of the Influencer-Brand Contract
 */

"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, Scale } from "lucide-react"
import { CANCELLATION_TERMS_OPTIONS, INDIAN_STATES } from "@/lib/influencer-contract"

const STATE_OPTIONS = INDIAN_STATES.map((s) => ({
  value: s.code,
  label: s.name,
}))

interface LegalSectionProps {
  formData: {
    cancellationTerms: string
    governingState: string
    agreementDate: string
  }
  influencerState: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: Partial<Record<string, string>>
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function LegalSection({
  formData,
  influencerState,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  isCompleted = false,
}: LegalSectionProps) {
  const handleSelectChange = (field: string) => (value: string) => {
    const syntheticEvent = {
      target: { name: field, value, type: "text" },
    } as any
    onChange(syntheticEvent)
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const syntheticEvent = {
      ...e,
      target: { ...e.target, name: "legal.agreementDate", value: e.target.value, type: "date" },
    } as React.ChangeEvent<HTMLInputElement>
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
            <Scale className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-lg">Termination & Legal</h3>
        </div>

        {/* Cancellation Terms */}
        <FormField
          label="Cancellation Terms"
          htmlFor="legal.cancellationTerms"
          required
          error={shouldShowError("legal.cancellationTerms") ? errors["legal.cancellationTerms"] : undefined}
        >
          <Select
            value={formData.cancellationTerms}
            onValueChange={handleSelectChange("legal.cancellationTerms")}
          >
            <SelectTrigger id="legal.cancellationTerms">
              <SelectValue placeholder="Select terms" />
            </SelectTrigger>
            <SelectContent>
              {CANCELLATION_TERMS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Governing State */}
          <FormField
            label="Governing State (Jurisdiction)"
            htmlFor="legal.governingState"
            required
            error={shouldShowError("legal.governingState") ? errors["legal.governingState"] : undefined}
            hint="Courts of this state will have jurisdiction"
          >
            <Select
              value={formData.governingState}
              onValueChange={handleSelectChange("legal.governingState")}
            >
              <SelectTrigger id="legal.governingState">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {STATE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Agreement Date */}
          <FormField
            label="Agreement Date"
            htmlFor="legal.agreementDate"
            required
            error={shouldShowError("legal.agreementDate") ? errors["legal.agreementDate"] : undefined}
          >
            <Input
              id="legal.agreementDate"
              type="date"
              name="legal.agreementDate"
              value={formData.agreementDate}
              onChange={handleDateChange}
              onBlur={() => onBlur?.("legal.agreementDate", formData.agreementDate)}
            />
          </FormField>
        </div>

        {/* Legal Notice */}
        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Any disputes arising from this agreement shall be resolved through arbitration 
            or courts in the selected governing state.
          </p>
        </div>
      </div>
    </div>
  )
}
