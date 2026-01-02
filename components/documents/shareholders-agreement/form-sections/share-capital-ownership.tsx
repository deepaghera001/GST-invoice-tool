/**
 * Share Capital Ownership Form Section - Section 3
 */

"use client"

import type React from "react"
import { DollarSign } from "lucide-react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import type { ShareholdersAgreementFormData, ShareholdersAgreementValidationErrors } from "@/lib/shareholders-agreement"

const SHARE_CAPITAL_FIELDS: FormFieldConfig[] = [
  {
    name: "authorizedShareCapital",
    label: "Authorized Share Capital (₹)",
    type: "number",
    placeholder: "Amount in rupees",
    required: true,
    min: 100000,
    helpText: "Total authorized share capital of the company",
  },
  {
    name: "faceValuePerShare",
    label: "Face Value Per Share (₹)",
    type: "number",
    placeholder: "10",
    required: true,
    min: 1,
    helpText: "Face value of each share",
  },
  {
    name: "paidUpShareCapital",
    label: "Paid-up Capital (₹)",
    type: "number",
    placeholder: "Amount in rupees",
    required: true,
    helpText: "Amount paid by shareholders so far",
  },
]

interface ShareCapitalOwnershipProps {
  formData: ShareholdersAgreementFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: ShareholdersAgreementValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function ShareCapitalOwnership({
  formData,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  isCompleted,
}: ShareCapitalOwnershipProps) {
  return (
    <FormSection
      title="Share Capital Ownership"
      icon={DollarSign}
      fields={SHARE_CAPITAL_FIELDS}
      data={formData.shareCapital}
      errors={errors as Record<string, string>}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      isCompleted={isCompleted}
      fieldPrefix="shareCapital"
      layout={{ columns: 2 }}
    />
  )
}
