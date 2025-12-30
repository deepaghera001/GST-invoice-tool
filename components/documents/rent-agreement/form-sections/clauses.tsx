/**
 * Agreement Clauses Form Section
 */

"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollText, Check } from "lucide-react"
import type { RentAgreementFormData, RentAgreementValidationErrors } from "@/lib/rent-agreement"
import { STANDARD_CLAUSES } from "@/lib/rent-agreement"

interface ClausesProps {
  formData: RentAgreementFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onCheckboxChange?: (path: string, checked: boolean) => void
  errors?: RentAgreementValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

const CLAUSE_ITEMS = [
  { key: "noSubLetting", label: "No Sub-letting", description: STANDARD_CLAUSES.noSubLetting },
  { key: "propertyInspection", label: "Property Inspection", description: STANDARD_CLAUSES.propertyInspection },
  { key: "repairsResponsibility", label: "Repairs & Maintenance", description: STANDARD_CLAUSES.repairsResponsibility },
  { key: "utilityPayment", label: "Utility Payment", description: STANDARD_CLAUSES.utilityPayment },
  { key: "peacefulUse", label: "Peaceful Use", description: STANDARD_CLAUSES.peacefulUse },
  { key: "noIllegalActivity", label: "No Illegal Activity", description: STANDARD_CLAUSES.noIllegalActivity },
]

export function Clauses({
  formData,
  onChange,
  onCheckboxChange,
  errors = {},
  shouldShowError = () => false,
  isCompleted,
}: ClausesProps) {
  const clauses = formData.clauses

  return (
    <Card className="border-border animate-in fade-in duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ScrollText className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold">Agreement Clauses</CardTitle>
          </div>
          {isCompleted && (
            <Badge variant="secondary" className="gap-1">
              <Check className="h-3 w-3" />
              Complete
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Select the standard clauses to include in your agreement. All selected clauses will appear in the final document.
        </p>

        {/* Standard Clauses */}
        <div className="space-y-3">
          {CLAUSE_ITEMS.map((item) => (
            <div key={item.key} className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <Checkbox
                id={item.key}
                checked={clauses[item.key as keyof typeof clauses] as boolean}
                onCheckedChange={(checked) => onCheckboxChange?.(`clauses.${item.key}`, !!checked)}
                className="mt-0.5"
              />
              <div className="space-y-1 flex-1">
                <label htmlFor={item.key} className="text-sm font-medium cursor-pointer">
                  {item.label}
                </label>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lock-in Period */}
        <div className="p-3 rounded-lg border border-border space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="lockInPeriod"
              checked={clauses.lockInPeriod}
              onCheckedChange={(checked) => onCheckboxChange?.("clauses.lockInPeriod", !!checked)}
              className="mt-0.5"
            />
            <div className="space-y-1 flex-1">
              <label htmlFor="lockInPeriod" className="text-sm font-medium cursor-pointer">
                Lock-in Period
              </label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {STANDARD_CLAUSES.lockInPeriod}
              </p>
            </div>
          </div>

          {clauses.lockInPeriod && (
            <div className="ml-6">
              <FormField label="Lock-in Duration (months)">
                <Input
                  name="clauses.lockInMonths"
                  type="number"
                  value={clauses.lockInMonths || ""}
                  onChange={onChange}
                  placeholder="3"
                  min={1}
                  max={12}
                  className="max-w-[150px]"
                />
              </FormField>
            </div>
          )}
        </div>

        {/* Additional Clauses */}
        <FormField
          label="Additional Clauses (Optional)"
          error={shouldShowError("clauses.additionalClauses") ? errors["clauses.additionalClauses"] : undefined}
        >
          <Textarea
            name="clauses.additionalClauses"
            value={clauses.additionalClauses || ""}
            onChange={onChange}
            placeholder="Add any custom clauses or special conditions here..."
            className="min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Any additional terms and conditions specific to this agreement.
          </p>
        </FormField>
      </CardContent>
    </Card>
  )
}
