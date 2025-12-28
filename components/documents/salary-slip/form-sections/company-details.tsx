/**
 * Company Details Form Section
 * Company information (name, address, PAN, CIN)
 */

"use client"

import type React from "react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import { Building2 } from "lucide-react"
import { PAN_REGEX } from "@/lib/salary-slip"

const COMPANY_FIELDS: FormFieldConfig[] = [
  {
    name: "companyName",
    label: "Company Name",
    placeholder: "Tech Solutions Pvt Ltd",
    required: true,
    colSpan: "full",
  },
  {
    name: "companyAddress",
    label: "Company Address",
    type: "textarea",
    placeholder: "123 Business Park, Mumbai, Maharashtra 400001",
    required: true,
    colSpan: "full",
    maxLength: 300,
  },
  {
    name: "panNumber",
    label: "Company PAN",
    placeholder: "AAACT1234D",
    required: true,
    colSpan: "half",
    transform: (value) => value.toUpperCase(),
  },
  {
    name: "cin",
    label: "CIN (Optional)",
    placeholder: "U62030MH2015PTC260923",
    colSpan: "half",
    transform: (value) => value.toUpperCase(),
  },
]

interface CompanyDetailsProps {
  companyName: string
  companyAddress: string
  panNumber: string
  cin?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: Record<string, string>
  shouldShowError?: (fieldName: string) => boolean
  fieldPrefix?: string
}

export function CompanyDetails({
  companyName,
  companyAddress,
  panNumber,
  cin = "",
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  fieldPrefix,
}: CompanyDetailsProps) {
  const formData = {
    companyName,
    companyAddress,
    panNumber,
    cin,
  }

  return (
    <FormSection
      title="Company Details"
      icon={Building2}
      fields={COMPANY_FIELDS}
      data={formData}
      errors={errors}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      layout={{ columns: 2 }}
      fieldPrefix={fieldPrefix}
      isCompleted={
        companyName.trim().length >= 2 &&
        companyAddress.trim().length >= 10 &&
        PAN_REGEX.test(panNumber)
      }
    />
  )
}
