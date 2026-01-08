/**
 * Share Transfer Restrictions Form Section - Section 6
 */

"use client"

import type React from "react"
import { Lock } from "lucide-react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import type { ShareholdersAgreementFormData, ShareholdersAgreementValidationErrors } from "@/lib/shareholders-agreement"

const TRANSFER_FIELDS: FormFieldConfig[] = [
  {
    name: "transferAllowed",
    label: "Transfer Allowed",
    type: "select",
    placeholder: "Select option",
    helpText: "Whether share transfers are allowed",
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
  },
  {
    name: "rightOfFirstRefusal",
    label: "Right of First Refusal",
    type: "select",
    placeholder: "Select option",
    helpText: "Existing shareholders have first right to buy shares",
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
  },
  {
    name: "lockInPeriod",
    label: "Lock-in Period (months)",
    type: "number",
    placeholder: "0",
    min: 0,
    max: 120,
    helpText: "Minimum period before shares can be transferred",
  },
]

interface ShareTransferRestrictionsProps {
  formData: ShareholdersAgreementFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: ShareholdersAgreementValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function ShareTransferRestrictions({
  formData,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  isCompleted,
}: ShareTransferRestrictionsProps) {
  return (
    <FormSection
      title="Share Transfer Restrictions"
      icon={Lock}
      fields={TRANSFER_FIELDS}
      data={formData.shareTransfer}
      errors={errors as Record<string, string>}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      isCompleted={isCompleted}
      fieldPrefix="shareTransfer"
    />
  )
}
