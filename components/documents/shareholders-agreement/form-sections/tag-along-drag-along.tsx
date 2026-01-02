/**
 * Tag Along Drag Along Form Section - Section 7
 */

"use client"

import type React from "react"
import { GitBranch } from "lucide-react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import type { ShareholdersAgreementFormData, ShareholdersAgreementValidationErrors } from "@/lib/shareholders-agreement"

const TAGDRAG_FIELDS: FormFieldConfig[] = [
  {
    name: "enableTagAlong",
    label: "Tag-Along Rights Enabled",
    type: "select",
    placeholder: "Select option",
    helpText: "Minority shareholders can sell when majority does",
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
  },
  {
    name: "tagAlongTriggerPercent",
    label: "Tag-Along Trigger %",
    type: "number",
    placeholder: "50",
    min: 0,
    max: 100,
    helpText: "Percentage threshold to trigger tag-along rights",
  },
  {
    name: "enableDragAlong",
    label: "Drag-Along Rights Enabled",
    type: "select",
    placeholder: "Select option",
    helpText: "Majority can force minority to sell",
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
  },
  {
    name: "dragAlongTriggerPercent",
    label: "Drag-Along Trigger %",
    type: "number",
    placeholder: "75",
    min: 0,
    max: 100,
    helpText: "Percentage threshold to trigger drag-along rights",
  },
]

interface TagAlongDragAlongProps {
  formData: ShareholdersAgreementFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: ShareholdersAgreementValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function TagAlongDragAlong({
  formData,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  isCompleted,
}: TagAlongDragAlongProps) {
  return (
    <FormSection
      title="Tag-Along / Drag-Along Rights"
      icon={GitBranch}
      fields={TAGDRAG_FIELDS}
      data={formData.tagAlongDragAlong}
      errors={errors as Record<string, string>}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      isCompleted={isCompleted}
      fieldPrefix="tagAlongDragAlong"
    />
  )
}
