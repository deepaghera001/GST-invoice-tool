/**
 * Share Capital Ownership Form Section - Section 3
 */

"use client"

import type React from "react"
import { DollarSign } from "lucide-react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import type { ShareholdersAgreementFormData, ShareholdersAgreementValidationErrors } from "@/lib/shareholders-agreement"

const SHARE_CAPITAL_FIELDS: FormFieldConfig[] = [
  {
    name: "authorizedShareCapital",
    label: "Authorized Share Capital (₹)",
    type: "number",
    placeholder: "50,00,000",
    required: true,
    min: 1,
    helpText: "Total authorized share capital of the company (from Articles/MOA). This is the MAXIMUM you can issue.",
  },
  {
    name: "faceValuePerShare",
    label: "Face Value Per Share (₹)",
    type: "number",
    placeholder: "10",
    required: true,
    min: 1,
    helpText: "Face value of each share (e.g., ₹10, ₹100). Common values: ₹5, ₹10, ₹100.",
  },
  {
    name: "issuedShares",
    label: "Total Issued Shares (Quantity)",
    type: "number",
    placeholder: "100000",
    required: true,
    min: 1,
    helpText: "Total number of equity shares issued (must be whole number, no decimals). CRITICAL: Issued Shares × Face Value must equal Paid-up Capital.",
  },
  {
    name: "paidUpShareCapital",
    label: "Paid-up Capital (₹)",
    type: "number",
    placeholder: "10,00,000",
    required: true,
    helpText: "MUST EQUAL: Issued Shares × Face Value Per Share. E.g., 100,000 shares × ₹10 = ₹10,00,000. BLOCKING VALIDATION: If this math fails, PDF cannot be generated.",
  },
]

interface ShareCapitalOwnershipProps {
  formData: ShareholdersAgreementFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: ShareholdersAgreementValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function ShareCapitalOwnership({
  formData,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  isCompleted,
}: ShareCapitalOwnershipProps) {
  const hasMathError = shouldShowError('shareCapital') && errors['shareCapital']
  const mathCheckPassed = 
    formData.shareCapital.issuedShares * formData.shareCapital.faceValuePerShare === 
    formData.shareCapital.paidUpShareCapital
  
  return (
    <>
      <FormSection
        title="Share Capital Ownership"
        icon={DollarSign}
        fields={SHARE_CAPITAL_FIELDS}
        data={formData.shareCapital}
        errors={errors as Record<string, string>}
        onChange={onChange}
        onBlur={onBlur}
        shouldShowError={shouldShowError}
        isCompleted={isCompleted}
        fieldPrefix="shareCapital"
        layout={{ columns: 2 }}
      />
      
      {/* Show math validation error if present */}
      {hasMathError && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <div className="text-red-600 font-bold text-lg mt-0.5">!</div>
          <div className="flex-1">
            <p className="font-medium text-red-900 mb-1">Math Validation Failed</p>
            <p className="text-sm text-red-800 mb-2">
              {errors['shareCapital']}
            </p>
            <div className="text-xs bg-red-100 rounded p-2 space-y-1 font-mono">
              <p>Your calculation:</p>
              <p>
                <span className="font-bold">{formData.shareCapital.issuedShares}</span> shares × 
                <span className="font-bold"> ₹{formData.shareCapital.faceValuePerShare}</span> = 
                <span className={mathCheckPassed ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
                  ₹{(formData.shareCapital.issuedShares * formData.shareCapital.faceValuePerShare).toLocaleString('en-IN')}
                </span>
              </p>
              <p>
                But you entered: <span className="font-bold">₹{formData.shareCapital.paidUpShareCapital.toLocaleString('en-IN')}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
