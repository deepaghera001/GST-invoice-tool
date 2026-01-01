/**
 * Landlord Details Form Section
 */

"use client"

import type React from "react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import { User } from "lucide-react"
import type { RentAgreementFormData, RentAgreementValidationErrors } from "@/lib/rent-agreement"

const LANDLORD_FIELDS: FormFieldConfig[] = [
  {
    name: "name",
    label: "Full Name",
    placeholder: "Landlord's full name as per ID",
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
    type: "textarea",
    placeholder: "Full permanent address",
    required: true,
  },
  {
    name: "panNumber",
    label: "PAN Number",
    placeholder: "ABCDE1234F",
    helpText: "Optional — include only if required by parties",
  },
  {
    name: "aadharNumber",
    label: "Aadhar Number",
    placeholder: "12-digit Aadhar number",
    helpText: "Optional — include only if required by parties",
  },
]

interface LandlordDetailsProps {
  formData: RentAgreementFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: RentAgreementValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function LandlordDetails({
  formData,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  isCompleted,
}: LandlordDetailsProps) {
  return (
    <FormSection
      title="Landlord Details"
      icon={User}
      fields={LANDLORD_FIELDS}
      data={formData.landlord}
      errors={errors}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      isCompleted={isCompleted}
      fieldPrefix="landlord"
      layout={{ columns: 2 }}
    />
  )
}
