/**
 * Signature Details Form Section - Section 12
 */

"use client"

import type React from "react"
import { PenTool } from "lucide-react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import type { ShareholdersAgreementFormData, ShareholdersAgreementValidationErrors } from "@/lib/shareholders-agreement"

const SIGNATURE_FIELDS: FormFieldConfig[] = [
  {
    name: "placeOfSigning",
    label: "Place of Signing",
    placeholder: "Mumbai, Delhi, Bangalore, etc.",
    required: true,
  },
  {
    name: "noOfWitnesses",
    label: "Number of Witnesses",
    type: "number",
    placeholder: "0",
    min: 0,
    max: 10,
    required: true,
  },
  {
    name: "witnessNames",
    label: "Witness Names (comma-separated)",
    type: "textarea",
    placeholder: "Name 1, Name 2",
    helpText: "Enter witness names separated by commas",
  },
]

interface SignatureDetailsProps {
  formData: ShareholdersAgreementFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: ShareholdersAgreementValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function SignatureDetails({
  formData,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  isCompleted,
}: SignatureDetailsProps) {
  return (
    <FormSection
      title="Signature Details"
      icon={PenTool}
      fields={SIGNATURE_FIELDS}
      data={formData.signatureDetails}
      errors={errors as Record<string, string>}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      isCompleted={isCompleted}
      fieldPrefix="signatureDetails"
    />
  )
}
