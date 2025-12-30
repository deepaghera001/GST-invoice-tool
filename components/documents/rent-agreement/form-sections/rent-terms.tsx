/**
 * Rent Terms Form Section
 */

"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { IndianRupee, Check } from "lucide-react"
import type { RentAgreementFormData, RentAgreementValidationErrors } from "@/lib/rent-agreement"
import { DURATION_OPTIONS, NOTICE_PERIOD_OPTIONS, PAYMENT_MODES, RENT_DUE_DAYS } from "@/lib/rent-agreement"

interface RentTermsProps {
  formData: RentAgreementFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  onCheckboxChange?: (path: string, checked: boolean) => void
  errors?: RentAgreementValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function RentTerms({
  formData,
  onChange,
  onBlur,
  onCheckboxChange,
  errors = {},
  shouldShowError = () => false,
  isCompleted,
}: RentTermsProps) {
  const rentTerms = formData.rentTerms

  return (
    <Card className="border-border animate-in fade-in duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IndianRupee className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold">Rent & Terms</CardTitle>
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
        {/* Monthly Rent & Security Deposit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Monthly Rent (₹)"
            error={shouldShowError("rentTerms.monthlyRent") ? errors["rentTerms.monthlyRent"] : undefined}
            required
          >
            <Input
              name="rentTerms.monthlyRent"
              type="number"
              value={rentTerms.monthlyRent || ""}
              onChange={onChange}
              onBlur={() => onBlur?.("rentTerms.monthlyRent", rentTerms.monthlyRent)}
              placeholder="25000"
              min={1000}
            />
          </FormField>

          <FormField
            label="Security Deposit (₹)"
            error={shouldShowError("rentTerms.securityDeposit") ? errors["rentTerms.securityDeposit"] : undefined}
            required
          >
            <Input
              name="rentTerms.securityDeposit"
              type="number"
              value={rentTerms.securityDeposit || ""}
              onChange={onChange}
              onBlur={() => onBlur?.("rentTerms.securityDeposit", rentTerms.securityDeposit)}
              placeholder="100000"
              min={0}
            />
          </FormField>
        </div>

        {/* Maintenance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Maintenance Charges (₹/month)">
            <Input
              name="rentTerms.maintenanceCharges"
              type="number"
              value={rentTerms.maintenanceCharges || ""}
              onChange={onChange}
              placeholder="3000"
              min={0}
              disabled={rentTerms.maintenanceIncluded}
            />
          </FormField>

          <FormField label="Maintenance">
            <div className="flex items-center h-10 space-x-2">
              <Checkbox
                id="maintenanceIncluded"
                checked={rentTerms.maintenanceIncluded}
                onCheckedChange={(checked) => onCheckboxChange?.("rentTerms.maintenanceIncluded", !!checked)}
              />
              <label htmlFor="maintenanceIncluded" className="text-sm text-muted-foreground cursor-pointer">
                Included in rent
              </label>
            </div>
          </FormField>
        </div>

        {/* Agreement Start & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Agreement Start Date"
            error={shouldShowError("rentTerms.agreementStartDate") ? errors["rentTerms.agreementStartDate"] : undefined}
            required
          >
            <Input
              name="rentTerms.agreementStartDate"
              type="date"
              value={rentTerms.agreementStartDate}
              onChange={onChange}
              onBlur={() => onBlur?.("rentTerms.agreementStartDate", rentTerms.agreementStartDate)}
            />
          </FormField>

          <FormField label="Agreement Duration" required>
            <select
              name="rentTerms.agreementDuration"
              value={rentTerms.agreementDuration}
              onChange={onChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {DURATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Rent Due Day & Notice Period */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Rent Due Day" required>
            <select
              name="rentTerms.rentDueDay"
              value={rentTerms.rentDueDay}
              onChange={onChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {RENT_DUE_DAYS.slice(0, 10).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Notice Period" required>
            <select
              name="rentTerms.noticePeriod"
              value={rentTerms.noticePeriod}
              onChange={onChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {NOTICE_PERIOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Payment Mode & Rent Increment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Payment Mode" required>
            <select
              name="rentTerms.paymentMode"
              value={rentTerms.paymentMode}
              onChange={onChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {PAYMENT_MODES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Annual Rent Increment (%)">
            <Input
              name="rentTerms.rentIncrementPercent"
              type="number"
              value={rentTerms.rentIncrementPercent || ""}
              onChange={onChange}
              placeholder="5"
              min={0}
              max={20}
            />
          </FormField>
        </div>
      </CardContent>
    </Card>
  )
}
