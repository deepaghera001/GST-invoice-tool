/**
 * Board Management Control Form Section - Section 4
 */

"use client"

import type React from "react"
import { Users2, Check } from "lucide-react"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { ShareholdersAgreementFormData, ShareholdersAgreementValidationErrors } from "@/lib/shareholders-agreement"

const RESERVED_MATTERS = [
  { id: "dividends", label: "Declaration of dividends" },
  { id: "capitalExpenditure", label: "Capital expenditure >₹50 Lakhs" },
  { id: "borrowings", label: "Borrowings >₹1 Crore" },
  { id: "newDirectors", label: "Appointment of new directors" },
  { id: "mortgageAssets", label: "Mortgage/pledge of assets" },
  { id: "dissolutionWinding", label: "Dissolution/winding up" },
]

interface BoardManagementControlProps {
  formData: ShareholdersAgreementFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  onCheckboxChange?: (path: string, value: string, checked: boolean) => void
  errors?: ShareholdersAgreementValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function BoardManagementControl({
  formData,
  onChange,
  onBlur,
  onCheckboxChange,
  errors = {},
  shouldShowError = () => false,
  isCompleted,
}: BoardManagementControlProps) {
  return (
    <div
      className={`
        relative p-6 rounded-xl border transition-all duration-500 ease-out
        ${
          isCompleted
            ? "border-green-400/40 bg-gradient-to-br from-green-50/30 to-transparent dark:from-green-950/10 shadow-md shadow-green-500/5"
            : "border-border bg-card hover:border-primary/30 hover:shadow-md"
        }
      `}
    >
      {isCompleted && (
        <div className="absolute -top-2 -right-2 animate-in zoom-in duration-500">
          <Badge className="relative bg-green-500 text-white border-0 px-3 py-1.5">
            <Check className="h-4 w-4 mr-1" />
            Complete
          </Badge>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Users2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Board Management Control</h3>
        </div>

        {/* Director Details */}
        <div className="space-y-4">
          <FormField
            label="Number of Directors"
            htmlFor="directorCount"
            required
            error={shouldShowError("boardManagement.totalDirectors") ? errors["boardManagement.totalDirectors"] : undefined}
          >
            <Input
              id="directorCount"
              type="number"
              placeholder="5"
              min="1"
              value={formData.boardManagement.totalDirectors}
              onChange={(e) => onChange({ ...e, target: { ...e.target, name: "boardManagement.totalDirectors", type: e.target.type } })}
              onBlur={() => onBlur?.("boardManagement.totalDirectors", formData.boardManagement.totalDirectors)}
              className={shouldShowError("boardManagement.totalDirectors") ? "border-destructive" : ""}
            />
          </FormField>

          <FormField
            label="Appointment Method"
            htmlFor="appointmentMethod"
            required
            error={shouldShowError("boardManagement.directorAppointmentBy") ? errors["boardManagement.directorAppointmentBy"] : undefined}
          >
            <select
              id="appointmentMethod"
              value={formData.boardManagement.directorAppointmentBy}
              onChange={(e) => onChange({ ...e, target: { ...e.target, name: "boardManagement.directorAppointmentBy", type: e.target.type } } as any)}
              onBlur={(e) => onBlur?.("boardManagement.directorAppointmentBy", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md text-sm bg-background ${shouldShowError("boardManagement.directorAppointmentBy") ? "border-destructive" : "border-input"}`}
            >
              <option value="">Select method</option>
              <option value="majority-shareholders">Majority of Shareholders</option>
              <option value="each-founder">Each Founder Appoints</option>
            </select>
          </FormField>
        </div>

        {/* Reserved Matters */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Reserved Matters (require board approval)</h4>
          <div className="space-y-2">
            {RESERVED_MATTERS.map((matter) => (
              <label key={matter.id} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-muted/50 transition-colors">
                <Checkbox
                  checked={formData.boardManagement.reservedMatters?.includes(matter.id) ?? false}
                  onCheckedChange={(checked) =>
                    onCheckboxChange?.("boardManagement.reservedMatters", matter.id, checked === true)
                  }
                />
                <span className="text-sm text-foreground">{matter.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
