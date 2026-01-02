/**
 * Payment Section - Payment Terms and Structure
 * Section 4 of the Influencer-Brand Contract
 */

"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, IndianRupee } from "lucide-react"
import {
  PAYMENT_STRUCTURE_OPTIONS,
  PAYMENT_TIMELINE_OPTIONS,
  PAYMENT_MODE_OPTIONS,
} from "@/lib/influencer-contract"
import type { PaymentBreakdown } from "@/lib/influencer-contract"

interface PaymentSectionProps {
  formData: {
    totalAmount: number
    paymentStructure: string
    paymentTimeline: string
    customPaymentDate: string
    paymentModes: string[]
  }
  paymentBreakdown: PaymentBreakdown
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onArrayChange: (field: string, value: string, checked: boolean) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: Partial<Record<string, string>>
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function PaymentSection({
  formData,
  paymentBreakdown,
  onChange,
  onArrayChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
  isCompleted = false,
}: PaymentSectionProps) {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const syntheticEvent = {
      ...e,
      target: { ...e.target, name: "payment.totalAmount", value: e.target.value, type: "number" },
    } as React.ChangeEvent<HTMLInputElement>
    onChange(syntheticEvent)
  }

  const handleStructureChange = (value: string) => {
    const syntheticEvent = {
      target: { name: "payment.paymentStructure", value, type: "text" },
    } as any
    onChange(syntheticEvent)
  }

  const handleTimelineChange = (value: string) => {
    const syntheticEvent = {
      target: { name: "payment.paymentTimeline", value, type: "text" },
    } as any
    onChange(syntheticEvent)
  }

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const syntheticEvent = {
      ...e,
      target: { ...e.target, name: "payment.customPaymentDate", value: e.target.value, type: "date" },
    } as React.ChangeEvent<HTMLInputElement>
    onChange(syntheticEvent)
  }

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
      {/* Completion badge */}
      {isCompleted && (
        <div className="absolute -top-2 -right-2 animate-in zoom-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-50 animate-pulse"></div>
            <Badge className="relative bg-green-500 text-white border-0 px-3 py-1.5">
              <Check className="h-4 w-4 mr-1" />
              Complete
            </Badge>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <IndianRupee className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-lg">Payment Terms</h3>
        </div>

        {/* Total Payment Amount */}
        <FormField
          label="Total Payment Amount (₹)"
          htmlFor="payment.totalAmount"
          required
          error={shouldShowError("payment.totalAmount") ? errors["payment.totalAmount"] : undefined}
          hint="Minimum ₹500"
        >
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
            <Input
              id="payment.totalAmount"
              type="number"
              name="payment.totalAmount"
              value={formData.totalAmount || ""}
              onChange={handleAmountChange}
              onBlur={() => onBlur?.("payment.totalAmount", formData.totalAmount)}
              placeholder="50000"
              min={500}
              className="pl-8"
            />
          </div>
        </FormField>

        {/* Payment Structure */}
        <FormField
          label="Payment Structure"
          htmlFor="payment.paymentStructure"
          required
          error={shouldShowError("payment.paymentStructure") ? errors["payment.paymentStructure"] : undefined}
        >
          <Select
            value={formData.paymentStructure}
            onValueChange={handleStructureChange}
          >
            <SelectTrigger id="payment.paymentStructure">
              <SelectValue placeholder="Select payment structure" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_STRUCTURE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        {/* Payment Breakdown Preview */}
        {formData.totalAmount >= 500 && formData.paymentStructure === "half-advance" && (
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Payment Breakdown</p>
            <div className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex justify-between">
                <span>Advance (50%)</span>
                <span className="font-medium">₹{paymentBreakdown.advanceAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>After Posting (50%)</span>
                <span className="font-medium">₹{paymentBreakdown.remainingAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Timeline */}
        <FormField
          label="Payment Timeline"
          htmlFor="payment.paymentTimeline"
          required
          error={shouldShowError("payment.paymentTimeline") ? errors["payment.paymentTimeline"] : undefined}
        >
          <Select
            value={formData.paymentTimeline}
            onValueChange={handleTimelineChange}
          >
            <SelectTrigger id="payment.paymentTimeline">
              <SelectValue placeholder="Select payment timeline" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_TIMELINE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        {/* Custom Payment Date */}
        {formData.paymentTimeline === "custom" && (
          <FormField
            label="Custom Payment Date"
            htmlFor="payment.customPaymentDate"
            required
            error={shouldShowError("payment.customPaymentDate") ? errors["payment.customPaymentDate"] : undefined}
          >
            <Input
              id="payment.customPaymentDate"
              type="date"
              name="payment.customPaymentDate"
              value={formData.customPaymentDate}
              onChange={handleCustomDateChange}
              onBlur={() => onBlur?.("payment.customPaymentDate", formData.customPaymentDate)}
              min={new Date().toISOString().split("T")[0]}
            />
          </FormField>
        )}

        {/* Payment Mode */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Payment Mode <span className="text-destructive">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {PAYMENT_MODE_OPTIONS.map((mode) => (
              <label
                key={mode.value}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all
                  ${formData.paymentModes.includes(mode.value)
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50"
                  }
                `}
              >
                <Checkbox
                  checked={formData.paymentModes.includes(mode.value)}
                  onCheckedChange={(checked) =>
                    onArrayChange("payment.paymentModes", mode.value, checked as boolean)
                  }
                />
                <span className="text-sm">{mode.label}</span>
              </label>
            ))}
          </div>
          {shouldShowError("payment.paymentModes") && errors["payment.paymentModes"] && (
            <p className="text-xs text-destructive">{errors["payment.paymentModes"]}</p>
          )}
        </div>
      </div>
    </div>
  )
}
