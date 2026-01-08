/**
 * Timeline Section - Content Deadline and Approval
 * Section 3 of the Influencer-Brand Contract
 */

"use client"

import type React from "react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import { Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"

interface TimelineSectionProps {
  formData: {
    contentDeadline: string
    brandApprovalRequired: boolean
  }
  agreementDate: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: Partial<Record<string, string>>
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function TimelineSection({
  formData,
  agreementDate,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  isCompleted = false,
}: TimelineSectionProps) {
  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const syntheticEvent = {
      ...e,
      target: { ...e.target, name: "timeline.contentDeadline", value: e.target.value, type: "date" },
    } as React.ChangeEvent<HTMLInputElement>
    onChange(syntheticEvent)
  }

  const handleApprovalChange = (value: string) => {
    const syntheticEvent = {
      target: { name: "timeline.brandApprovalRequired", value: value === "yes", type: "checkbox" },
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
            <Calendar className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-lg">Timeline</h3>
        </div>

        {/* Content Deadline */}
        <FormField
          label="Content Posting Deadline"
          htmlFor="timeline.contentDeadline"
          required
          error={shouldShowError("timeline.contentDeadline") ? errors["timeline.contentDeadline"] : undefined}
          hint="The date by which all content must be posted"
        >
          <Input
            id="timeline.contentDeadline"
            type="date"
            name="timeline.contentDeadline"
            value={formData.contentDeadline}
            onChange={handleDeadlineChange}
            onBlur={() => onBlur?.("timeline.contentDeadline", formData.contentDeadline)}
            min={agreementDate || new Date().toISOString().split("T")[0]}
          />
        </FormField>

        {/* Brand Approval Required */}
        <div className="space-y-3">
          <label className="text-sm font-medium">
            Brand Approval Required Before Posting?
          </label>
          <RadioGroup
            value={formData.brandApprovalRequired ? "yes" : "no"}
            onValueChange={handleApprovalChange}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="approval-yes" />
              <Label htmlFor="approval-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="approval-no" />
              <Label htmlFor="approval-no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground">
            {formData.brandApprovalRequired
              ? "Brand must approve all content before it goes live"
              : "Influencer can post without prior brand approval"}
          </p>
        </div>
      </div>
    </div>
  )
}
