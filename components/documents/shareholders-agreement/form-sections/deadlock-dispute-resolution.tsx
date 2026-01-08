/**
 * Deadlock & Dispute Resolution Form Section - Section 10
 */

"use client"

import type React from "react"
import { Gavel } from "lucide-react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import type { ShareholdersAgreementFormData, ShareholdersAgreementValidationErrors } from "@/lib/shareholders-agreement"

const DISPUTE_FIELDS: FormFieldConfig[] = [
  {
    name: "deadlockResolution",
    label: "Deadlock Resolution Method",
    type: "select",
    placeholder: "Select resolution method",
    required: true,
    helpText: "How disagreements between shareholders are resolved",
    options: [
      { value: "arbitration", label: "Arbitration" },
      { value: "mediation", label: "Mediation" },
      { value: "buy-sell-mechanism", label: "Buy-Sell Mechanism" },
    ],
  },
  {
    name: "arbitrationLocation",
    label: "Jurisdiction/Location for Disputes",
    type: "text",
    placeholder: "Mumbai, Delhi, etc.",
    required: true,
    helpText: "Where disputes will be resolved",
  },
]

interface DeadlockDisputeResolutionProps {
  formData: ShareholdersAgreementFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: ShareholdersAgreementValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function DeadlockDisputeResolution({
  formData,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  isCompleted,
}: DeadlockDisputeResolutionProps) {
  return (
    <FormSection
      title="Deadlock & Dispute Resolution"
      icon={Gavel}
      fields={DISPUTE_FIELDS}
      data={formData.deadlockResolution}
      errors={errors as Record<string, string>}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      isCompleted={isCompleted}
      fieldPrefix="deadlockResolution"
    />
  )
}
