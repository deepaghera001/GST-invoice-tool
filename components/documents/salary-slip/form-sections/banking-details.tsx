/**
 * Banking Details Form Section
 * Bank account information for salary transfer
 */

"use client"

import type React from "react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import { DollarSign } from "lucide-react"
import { IFSC_REGEX } from "@/lib/salary-slip"

const BANKING_FIELDS: FormFieldConfig[] = [
  {
    name: "bankName",
    label: "Bank Name",
    placeholder: "HDFC Bank",
    required: true,
    colSpan: "half",
  },
  {
    name: "accountHolder",
    label: "Account Holder Name",
    placeholder: "John Doe",
    required: true,
    colSpan: "half",
  },
  {
    name: "accountNumber",
    label: "Account Number",
    placeholder: "123456789012345",
    required: true,
    colSpan: "half",
  },
  {
    name: "ifscCode",
    label: "IFSC Code",
    placeholder: "HDFC0000001",
    required: true,
    colSpan: "half",
    transform: (value) => value.toUpperCase(),
  },
]

interface BankingDetailsProps {
  bankName: string
  accountHolder: string
  accountNumber: string
  ifscCode: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: Record<string, string>
  shouldShowError?: (fieldName: string) => boolean
  fieldPrefix?: string
}

export function BankingDetails({
  bankName,
  accountHolder,
  accountNumber,
  ifscCode,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  fieldPrefix,
}: BankingDetailsProps) {
  const formData = {
    bankName,
    accountHolder,
    accountNumber,
    ifscCode,
  }

  return (
    <FormSection
      title="Banking Details"
      icon={DollarSign}
      fields={BANKING_FIELDS}
      data={formData}
      errors={errors}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      layout={{ columns: 2 }}
      fieldPrefix={fieldPrefix}
      isCompleted={
        bankName.trim().length > 0 &&
        accountHolder.trim().length > 0 &&
        accountNumber.trim().length > 0 &&
        IFSC_REGEX.test(ifscCode)
      }
    />
  )
}
