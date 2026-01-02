/**
 * Usage Rights Section - Content Usage and Ownership
 * Section 5 of the Influencer-Brand Contract
 */

"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { FormField } from "@/components/ui/form-field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, Shield } from "lucide-react"
import {
  USAGE_SCOPE_OPTIONS,
  USAGE_DURATION_OPTIONS,
  CONTENT_OWNERSHIP_OPTIONS,
} from "@/lib/influencer-contract"

interface UsageRightsSectionProps {
  formData: {
    usageScope: string
    usageDuration: string
    creditRequired: boolean
    contentOwnership: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: Partial<Record<string, string>>
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function UsageRightsSection({
  formData,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  isCompleted = false,
}: UsageRightsSectionProps) {
  const handleSelectChange = (field: string) => (value: string) => {
    const syntheticEvent = {
      target: { name: field, value, type: "text" },
    } as any
    onChange(syntheticEvent)
  }

  const handleCreditChange = (value: string) => {
    const syntheticEvent = {
      target: { name: "usageRights.creditRequired", value: value === "yes", type: "checkbox" },
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
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-lg">Content Usage Rights</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Usage Scope */}
          <FormField
            label="Usage Scope"
            htmlFor="usageRights.usageScope"
            required
            error={shouldShowError("usageRights.usageScope") ? errors["usageRights.usageScope"] : undefined}
            hint="How the brand can use your content"
          >
            <Select
              value={formData.usageScope}
              onValueChange={handleSelectChange("usageRights.usageScope")}
            >
              <SelectTrigger id="usageRights.usageScope">
                <SelectValue placeholder="Select usage scope" />
              </SelectTrigger>
              <SelectContent>
                {USAGE_SCOPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Usage Duration */}
          <FormField
            label="Usage Duration"
            htmlFor="usageRights.usageDuration"
            required
            error={shouldShowError("usageRights.usageDuration") ? errors["usageRights.usageDuration"] : undefined}
            hint="How long the brand can use content"
          >
            <Select
              value={formData.usageDuration}
              onValueChange={handleSelectChange("usageRights.usageDuration")}
            >
              <SelectTrigger id="usageRights.usageDuration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {USAGE_DURATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        {/* Credit Required */}
        <div className="space-y-3">
          <label className="text-sm font-medium">
            Credit to Influencer Required?
          </label>
          <RadioGroup
            value={formData.creditRequired ? "yes" : "no"}
            onValueChange={handleCreditChange}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="credit-yes" />
              <Label htmlFor="credit-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="credit-no" />
              <Label htmlFor="credit-no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground">
            {formData.creditRequired
              ? "Brand must credit/tag the influencer when using content"
              : "Brand can use content without crediting the influencer"}
          </p>
        </div>

        {/* Content Ownership */}
        <FormField
          label="Ownership of Raw Content"
          htmlFor="usageRights.contentOwnership"
          required
          error={shouldShowError("usageRights.contentOwnership") ? errors["usageRights.contentOwnership"] : undefined}
        >
          <Select
            value={formData.contentOwnership}
            onValueChange={handleSelectChange("usageRights.contentOwnership")}
          >
            <SelectTrigger id="usageRights.contentOwnership">
              <SelectValue placeholder="Select ownership" />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_OWNERSHIP_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        {/* Usage Rights Summary */}
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <p className="text-xs text-amber-800 dark:text-amber-200">
            <strong>Important:</strong> Usage rights determine how the brand can repurpose your content. 
            Higher usage rights (paid ads, commercial) typically command higher fees.
          </p>
        </div>
      </div>
    </div>
  )
}
