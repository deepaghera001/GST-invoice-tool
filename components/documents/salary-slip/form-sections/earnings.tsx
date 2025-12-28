/**
 * Earnings Details Form Section
 * Salary components (basic, DA, HRA, conveyance, others)
 */

"use client"

import type React from "react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import { TrendingUp } from "lucide-react"

const EARNINGS_FIELDS: FormFieldConfig[] = [
  {
    name: "basicSalary",
    label: "Basic Salary",
    type: "number",
    placeholder: "50000",
    required: true,
    colSpan: "half",
    min: 0,
    step: "0.01",
  },
  {
    name: "dearness",
    label: "Dearness Allowance",
    type: "number",
    placeholder: "10000",
    colSpan: "half",
    min: 0,
    step: "0.01",
  },
  {
    name: "houseRent",
    label: "House Rent Allowance",
    type: "number",
    placeholder: "8000",
    colSpan: "half",
    min: 0,
    step: "0.01",
  },
  {
    name: "conveyance",
    label: "Conveyance",
    type: "number",
    placeholder: "2000",
    colSpan: "half",
    min: 0,
    step: "0.01",
  },
  {
    name: "otherEarnings",
    label: "Other Earnings",
    type: "number",
    placeholder: "0",
    colSpan: "half",
    min: 0,
    step: "0.01",
  },
]

interface EarningsProps {
  basicSalary: number
  dearness: number
  houseRent: number
  conveyance: number
  otherEarnings: number
  totalEarnings?: number
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: Record<string, string>
  shouldShowError?: (fieldName: string) => boolean
  fieldPrefix?: string
}

export function Earnings({
  basicSalary,
  dearness,
  houseRent,
  conveyance,
  otherEarnings,
  totalEarnings = 0,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  fieldPrefix,
}: EarningsProps) {
  const formData = {
    basicSalary,
    dearness,
    houseRent,
    conveyance,
    otherEarnings,
  }

  return (
    <FormSection
      title="Earnings"
      icon={TrendingUp}
      fields={EARNINGS_FIELDS}
      data={formData}
      errors={errors}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      layout={{ columns: 2 }}
      fieldPrefix={fieldPrefix}
      isCompleted={basicSalary > 0}
    >
      {totalEarnings > 0 && (
        <div className="col-span-full mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            Total Earnings: <span className="text-lg">₹{totalEarnings.toLocaleString("en-IN")}</span>
          </p>
        </div>
      )}
    </FormSection>
  )
}
