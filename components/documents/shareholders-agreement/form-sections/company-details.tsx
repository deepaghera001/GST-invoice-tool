/**
 * Company Details Form Section - Section 1
 */

"use client"

import type React from "react"
import { Building2 } from "lucide-react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import type { ShareholdersAgreementFormData, ShareholdersAgreementValidationErrors } from "@/lib/shareholders-agreement"

const COMPANY_FIELDS: FormFieldConfig[] = [
  {
    name: "companyName",
    label: "Company Name",
    placeholder: "Your registered company name",
    required: true,
    helpText: "Must match with ROC registration",
  },
  {
    name: "cin",
    label: "CIN / Registration Number",
    placeholder: "U12345XY2020PTC123456",
    helpText: "Optional but recommended - Corporate Identification Number",
  },
  {
    name: "registeredAddress",
    label: "Registered Office Address",
    type: "textarea",
    placeholder: "Full address including city, state, and pincode",
    required: true,
  },
  {
    name: "dateOfAgreement",
    label: "Date of Agreement",
    type: "date",
    required: true,
  },
  {
    name: "companyType",
    label: "Company Type",
    type: "select",
    placeholder: "Select company type",
    required: true,
    helpText: "Select the type of company",
    options: [
      { value: "private-limited", label: "Private Limited Company" },
      { value: "llp", label: "Limited Liability Partnership (LLP)" },
    ],
  },
]

interface CompanyDetailsProps {
  formData: ShareholdersAgreementFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: ShareholdersAgreementValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function CompanyDetails({
  formData,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  isCompleted,
}: CompanyDetailsProps) {
  return (
    <FormSection
      title="Company Details"
      icon={Building2}
      fields={COMPANY_FIELDS}
      data={formData.company}
      errors={errors as Record<string, string>}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      isCompleted={isCompleted}
      fieldPrefix="company"
      layout={{ columns: 2 }}
    />
  )
}
