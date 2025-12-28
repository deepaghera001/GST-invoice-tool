/**
 * Period Details Form Section
 * Month and Year selection for salary slip
 */

"use client"

import type React from "react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import { Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField } from "@/components/ui/form-field"
import { MONTHS } from "@/lib/salary-slip"

const PERIOD_FIELDS: FormFieldConfig[] = [
  {
    name: "year",
    label: "Year",
    type: "number",
    placeholder: new Date().getFullYear().toString(),
    required: true,
    colSpan: "half",
    min: 2000,
    max: new Date().getFullYear() + 1,
  },
]

interface PeriodDetailsProps {
  month: string
  year: number
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: Record<string, string>
  shouldShowError?: (fieldName: string) => boolean
  fieldPrefix?: string
}

export function PeriodDetails({
  month,
  year,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  fieldPrefix,
}: PeriodDetailsProps) {
  const formData = { year }

  const handleMonthChange = (value: string) => {
    const event = {
      target: { name: "month", value },
    } as any
    onChange(event)
  }

  return (
    <FormSection
      title="Salary Period"
      icon={Calendar}
      fields={PERIOD_FIELDS}
      data={formData}
      errors={errors}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      layout={{ columns: 2 }}
      fieldPrefix={fieldPrefix}
    >
      <div className="col-span-full sm:col-span-1">
        <FormField label="Month" htmlFor="period-month" required>
          <Select value={month} onValueChange={handleMonthChange}>
            <SelectTrigger id="period-month">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>
    </FormSection>
  )
}
