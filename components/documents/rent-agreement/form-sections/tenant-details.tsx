/**
 * Tenant Details Form Section
 */

"use client"

import type React from "react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import { Users } from "lucide-react"
import type { RentAgreementFormData, RentAgreementValidationErrors } from "@/lib/rent-agreement"

const TENANT_FIELDS: FormFieldConfig[] = [
  {
    name: "name",
    label: "Full Name",
    placeholder: "Tenant's full name as per ID",
    required: true,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "10-digit mobile number",
    required: true,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "email@example.com",
  },
  {
    name: "address",
    label: "Permanent Address",
    placeholder: "Full permanent address",
    type: "textarea",
    required: true,
  },
  {
    name: "panNumber",
    label: "PAN Number",
    placeholder: "ABCDE1234F",
  },
  {
    name: "aadharNumber",
    label: "Aadhar Number",
    placeholder: "12-digit Aadhar number",
  },
]

interface TenantDetailsProps {
  formData: RentAgreementFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: RentAgreementValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function TenantDetails({
  formData,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  isCompleted,
}: TenantDetailsProps) {
  return (
    <FormSection
      title="Tenant Details"
      icon={Users}
      fields={TENANT_FIELDS}
      data={formData.tenant}
      errors={errors}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      isCompleted={isCompleted}
      fieldPrefix="tenant"
      layout={{ columns: 2 }}
    />
  )
}
