/**
 * Parties Section - Influencer and Brand Details
 * Section 1 of the Influencer-Brand Contract
 */

"use client"

import type React from "react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import { Users } from "lucide-react"
import { INDIAN_STATES } from "@/lib/influencer-contract"

const STATE_OPTIONS = INDIAN_STATES.map((s) => ({
  value: s.code,
  label: s.name,
}))

const PARTIES_FIELDS: FormFieldConfig[] = [
  // Influencer Details
  {
    name: "influencerName",
    label: "Influencer Full Name",
    placeholder: "e.g., Priya Sharma",
    required: true,
    colSpan: "full",
    helpText: "Your legal name as it will appear on the contract",
  },
  {
    name: "influencerCity",
    label: "Influencer City",
    placeholder: "e.g., Mumbai",
    required: true,
    colSpan: "half",
  },
  {
    name: "influencerState",
    label: "Influencer State",
    type: "select",
    options: STATE_OPTIONS,
    required: true,
    colSpan: "half",
  },
  // Brand Details
  {
    name: "brandName",
    label: "Brand / Company Name",
    placeholder: "e.g., XYZ Cosmetics Pvt Ltd",
    required: true,
    colSpan: "full",
    helpText: "Official registered business name",
  },
  {
    name: "brandCity",
    label: "Brand City",
    placeholder: "e.g., Bangalore",
    required: true,
    colSpan: "half",
  },
  {
    name: "brandState",
    label: "Brand State",
    type: "select",
    options: STATE_OPTIONS,
    required: true,
    colSpan: "half",
  },
]

interface PartiesSectionProps {
  formData: {
    influencerName: string
    influencerCity: string
    influencerState: string
    brandName: string
    brandCity: string
    brandState: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: Partial<Record<string, string>>
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function PartiesSection({
  formData,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  isCompleted = false,
}: PartiesSectionProps) {
  return (
    <FormSection
      title="Parties"
      icon={Users}
      fields={PARTIES_FIELDS}
      data={formData}
      errors={errors as Record<string, string>}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      isCompleted={isCompleted}
      layout={{ columns: 2 }}
      fieldPrefix="parties"
    />
  )
}
