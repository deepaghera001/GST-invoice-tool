/**
 * Employee Details Form Section
 * Employee information (ID, name, designation, etc.)
 */

"use client"

import type React from "react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import { User } from "lucide-react"
import { PAN_REGEX, EMPLOYEE_ID_REGEX, UAN_REGEX } from "@/lib/salary-slip"

const EMPLOYEE_FIELDS: FormFieldConfig[] = [
  {
    name: "employeeId",
    label: "Employee ID",
    placeholder: "EMP001",
    required: true,
    colSpan: "half",
  },
  {
    name: "employeeName",
    label: "Employee Name",
    placeholder: "John Doe",
    required: true,
    colSpan: "half",
  },
  {
    name: "designation",
    label: "Designation",
    placeholder: "Software Engineer",
    required: true,
    colSpan: "half",
  },
  {
    name: "department",
    label: "Department",
    placeholder: "Engineering",
    required: true,
    colSpan: "half",
  },
  {
    name: "dateOfJoining",
    label: "Date of Joining",
    type: "date",
    required: true,
    colSpan: "half",
  },
  {
    name: "panNumber",
    label: "PAN Number",
    placeholder: "ABCDE1234F",
    required: true,
    colSpan: "half",
    transform: (value) => value.toUpperCase(),
  },
  {
    name: "uan",
    label: "UAN (Optional)",
    placeholder: "123456789012",
    required: false,
    colSpan: "half",
    helpText: "12-digit UAN (optional)",
  },
]

interface EmployeeDetailsProps {
  employeeId: string
  employeeName: string
  designation: string
  department: string
  dateOfJoining: string
  panNumber: string
  uan?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: Record<string, string>
  shouldShowError?: (fieldName: string) => boolean
  fieldPrefix?: string
}

export function EmployeeDetails({
  employeeId,
  employeeName,
  designation,
  department,
  dateOfJoining,
  panNumber,
  uan,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  fieldPrefix,
}: EmployeeDetailsProps) {
  const formData = {
    employeeId,
    employeeName,
    designation,
    department,
    dateOfJoining,
    panNumber,
    uan,
  }

  return (
    <FormSection
      title="Employee Details"
      icon={User}
      fields={EMPLOYEE_FIELDS}
      data={formData}
      errors={errors}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      layout={{ columns: 2 }}
      fieldPrefix={fieldPrefix}
      isCompleted={
        employeeId.trim().length > 0 &&
        employeeName.trim().length >= 2 &&
        designation.trim().length > 0 &&
        department.trim().length > 0 &&
        dateOfJoining.length > 0 &&
        PAN_REGEX.test(panNumber)
      }
    />
  )
}
