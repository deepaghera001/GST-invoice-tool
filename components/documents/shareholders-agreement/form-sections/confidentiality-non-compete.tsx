/**
 * Confidentiality & Non-Compete Form Section - Section 9
 */

"use client"

import type React from "react"
import { Shield } from "lucide-react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import type { ShareholdersAgreementFormData, ShareholdersAgreementValidationErrors } from "@/lib/shareholders-agreement"

const CONF_FIELDS: FormFieldConfig[] = [
  {
    name: "confidentialityClause",
    label: "Confidentiality Clause",
    type: "select",
    placeholder: "Select option",
    helpText: "Shareholders must maintain confidentiality",
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
  },
  {
    name: "nonCompeteDuration",
    label: "Non-Compete Duration (months)",
    type: "number",
    placeholder: "24",
    min: 0,
    max: 120,
    helpText: "How long non-compete applies after exit",
  },
  {
    name: "nonSolicitation",
    label: "Non-Solicitation Clause",
    type: "select",
    placeholder: "Select option",
    helpText: "Prevent poaching of employees/clients",
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
  },
]

interface ConfidentialityNonCompeteProps {
  formData: ShareholdersAgreementFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: ShareholdersAgreementValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function ConfidentialityNonCompete({
  formData,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  isCompleted,
}: ConfidentialityNonCompeteProps) {
  return (
    <FormSection
      title="Confidentiality & Non-Compete"
      icon={Shield}
      fields={CONF_FIELDS}
      data={formData.confidentialityNonCompete}
      errors={errors as Record<string, string>}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      isCompleted={isCompleted}
      fieldPrefix="confidentialityNonCompete"
    />
  )
}
