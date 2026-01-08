/**
 * Campaign Section - Platform and Content Details
 * Section 2 of the Influencer-Brand Contract
 */

"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { Check, Megaphone } from "lucide-react"
import { PLATFORM_OPTIONS, CONTENT_TYPE_OPTIONS } from "@/lib/influencer-contract"

interface CampaignSectionProps {
  formData: {
    platforms: string[]
    contentTypes: string[]
    deliverables: string
    campaignDescription: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onArrayChange: (field: string, value: string, checked: boolean) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: Partial<Record<string, string>>
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function CampaignSection({
  formData,
  onChange,
  onArrayChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  isCompleted = false,
}: CampaignSectionProps) {
  const handleDeliverables = (e: React.ChangeEvent<HTMLInputElement>) => {
    const syntheticEvent = {
      ...e,
      target: { ...e.target, name: "campaign.deliverables", value: e.target.value, type: "text" },
    } as React.ChangeEvent<HTMLInputElement>
    onChange(syntheticEvent)
  }

  const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const syntheticEvent = {
      ...e,
      target: { ...e.target, name: "campaign.campaignDescription", value: e.target.value, type: "textarea" },
    } as React.ChangeEvent<HTMLTextAreaElement>
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
            <Megaphone className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-lg">Platform & Campaign</h3>
        </div>

        {/* Platform Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Platform <span className="text-destructive">*</span>
          </label>
          <p className="text-xs text-muted-foreground">Select all platforms where content will be posted</p>
          <div className="flex flex-wrap gap-3 pt-1">
            {PLATFORM_OPTIONS.map((platform) => (
              <label
                key={platform.value}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all
                  ${formData.platforms.includes(platform.value)
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50"
                  }
                `}
              >
                <Checkbox
                  checked={formData.platforms.includes(platform.value)}
                  onCheckedChange={(checked) => 
                    onArrayChange("campaign.platforms", platform.value, checked as boolean)
                  }
                />
                <span className="text-sm">{platform.label}</span>
              </label>
            ))}
          </div>
          {shouldShowError("campaign.platforms") && errors["campaign.platforms"] && (
            <p className="text-xs text-destructive">{errors["campaign.platforms"]}</p>
          )}
        </div>

        {/* Content Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Content Type <span className="text-destructive">*</span>
          </label>
          <p className="text-xs text-muted-foreground">Select all content formats to be created</p>
          <div className="flex flex-wrap gap-3 pt-1">
            {CONTENT_TYPE_OPTIONS.map((type) => (
              <label
                key={type.value}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all
                  ${formData.contentTypes.includes(type.value)
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50"
                  }
                `}
              >
                <Checkbox
                  checked={formData.contentTypes.includes(type.value)}
                  onCheckedChange={(checked) =>
                    onArrayChange("campaign.contentTypes", type.value, checked as boolean)
                  }
                />
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
          {shouldShowError("campaign.contentTypes") && errors["campaign.contentTypes"] && (
            <p className="text-xs text-destructive">{errors["campaign.contentTypes"]}</p>
          )}
        </div>

        {/* Deliverables */}
        <FormField
          label="Number of Deliverables"
          htmlFor="campaign.deliverables"
          required
          error={shouldShowError("campaign.deliverables") ? errors["campaign.deliverables"] : undefined}
          hint="e.g., 2 Reels + 3 Stories"
        >
          <Input
            id="campaign.deliverables"
            name="campaign.deliverables"
            value={formData.deliverables}
            onChange={handleDeliverables}
            onBlur={() => onBlur?.("campaign.deliverables", formData.deliverables)}
            placeholder="e.g., 2 Reels + 3 Stories"
          />
        </FormField>

        {/* Campaign Description */}
        <FormField
          label="Campaign Description"
          htmlFor="campaign.campaignDescription"
          error={shouldShowError("campaign.campaignDescription") ? errors["campaign.campaignDescription"] : undefined}
          hint="Brief description of the campaign (optional, max 300 chars)"
        >
          <Textarea
            id="campaign.campaignDescription"
            name="campaign.campaignDescription"
            value={formData.campaignDescription}
            onChange={handleDescription}
            onBlur={() => onBlur?.("campaign.campaignDescription", formData.campaignDescription)}
            placeholder="e.g., Promotion of skincare product launch"
            maxLength={300}
            rows={2}
          />
          <p className="text-xs text-muted-foreground text-right mt-1">
            {formData.campaignDescription.length}/300
          </p>
        </FormField>
      </div>
    </div>
  )
}
