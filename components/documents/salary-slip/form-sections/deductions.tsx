/**
 * Deductions Details Form Section
 * Salary deductions (PF, ESI, tax, others)
 */

"use client"

import type React from "react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import { TrendingDown } from "lucide-react"

const DEDUCTIONS_FIELDS: FormFieldConfig[] = [
  {
    name: "providentFund",
    label: "Provident Fund (PF)",
    type: "number",
    placeholder: "6000",
    colSpan: "half",
    min: 0,
    step: "0.01",
  },
  {
    name: "esi",
    label: "ESI",
    type: "number",
    placeholder: "510",
    colSpan: "half",
    min: 0,
    step: "0.01",
  },
  {
    name: "incomeTax",
    label: "Income Tax",
    type: "number",
    placeholder: "3880",
    colSpan: "half",
    min: 0,
    step: "0.01",
  },
  {
    name: "otherDeductions",
    label: "Other Deductions",
    type: "number",
    placeholder: "0",
    colSpan: "half",
    min: 0,
    step: "0.01",
  },
]

interface DeductionsProps {
  providentFund: number
  esi: number
  incomeTax: number
  otherDeductions: number
  totalDeductions?: number
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: Record<string, string>
  shouldShowError?: (fieldName: string) => boolean
  fieldPrefix?: string
}

export function Deductions({
  providentFund,
  esi,
  incomeTax,
  otherDeductions,
  totalDeductions = 0,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  fieldPrefix,
}: DeductionsProps) {
  const formData = {
    providentFund,
    esi,
    incomeTax,
    otherDeductions,
  }

  return (
    <FormSection
      title="Deductions"
      icon={TrendingDown}
      fields={DEDUCTIONS_FIELDS}
      data={formData}
      errors={errors}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      layout={{ columns: 2 }}
      fieldPrefix={fieldPrefix}
    >
      {totalDeductions > 0 && (
        <div className="col-span-full mt-4 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm font-semibold text-red-900 dark:text-red-100">
            Total Deductions: <span className="text-lg">₹{totalDeductions.toLocaleString("en-IN")}</span>
          </p>
        </div>
      )}
    </FormSection>
  )
}
