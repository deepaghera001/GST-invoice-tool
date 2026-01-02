/**
 * Shareholders Details Form Section - Section 2
 */

"use client"

import type React from "react"
import { Users, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { ShareholdersAgreementFormData, ShareholdersAgreementValidationErrors } from "@/lib/shareholders-agreement"

interface ShareholdersDetailsProps {
  formData: ShareholdersAgreementFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  onShareholderChange?: (index: number, field: string, value: any) => void
  onAddShareholder?: () => void
  onRemoveShareholder?: (index: number) => void
  errors?: ShareholdersAgreementValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function ShareholdersDetails({
  formData,
  onChange,
  onBlur,
  onShareholderChange,
  onAddShareholder,
  onRemoveShareholder,
  errors = {},
  shouldShowError = () => false,
  isCompleted,
}: ShareholdersDetailsProps) {
  const totalShares = formData.shareholders.reduce((sum: number, sh: any) => sum + (sh.shareholding || 0), 0)
  const isSharesBalanced = totalShares === 100

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
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-50 animate-pulse"></div>
            <Badge className="relative bg-green-500 text-white border-0 px-3 py-1.5">
              <span>✓ Complete</span>
            </Badge>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Shareholders Details</h3>
        </div>

        {/* Shareholding Balance Indicator */}
        <div
          className={`p-3 rounded-lg border text-sm ${
            isSharesBalanced
              ? "bg-green-50/50 border-green-200 text-green-800"
              : "bg-amber-50/50 border-amber-200 text-amber-800"
          }`}
        >
          <p className="font-medium">
            Total Shareholding: <span className="font-bold">{totalShares.toFixed(2)}%</span>
          </p>
          {!isSharesBalanced && (
            <p className="text-xs mt-1">Must equal 100% to proceed</p>
          )}
        </div>

        {/* Shareholders List */}
        <div className="space-y-4">
          {formData.shareholders.map((shareholder: any, index: number) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Shareholder {index + 1}</h4>
                {formData.shareholders.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveShareholder?.(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  label="Full Name"
                  htmlFor={`shareholder-${index}-name`}
                  required
                  error={shouldShowError(`shareholders.${index}.name`) ? errors[`shareholders.${index}.name`] : undefined}
                >
                  <Input
                    id={`shareholder-${index}-name`}
                    placeholder="Shareholder name"
                    value={shareholder.name}
                    onChange={(e) => onShareholderChange?.(index, "name", e.target.value)}
                    onBlur={(e) => onBlur?.(`shareholders.${index}.name`, e.target.value)}
                    className={shouldShowError(`shareholders.${index}.name`) ? "border-destructive" : ""}
                  />
                </FormField>

                <FormField
                  label="Email"
                  htmlFor={`shareholder-${index}-email`}
                  required
                  error={shouldShowError(`shareholders.${index}.email`) ? errors[`shareholders.${index}.email`] : undefined}
                >
                  <Input
                    id={`shareholder-${index}-email`}
                    type="email"
                    placeholder="shareholder@example.com"
                    value={shareholder.email}
                    onChange={(e) => onShareholderChange?.(index, "email", e.target.value)}
                    onBlur={(e) => onBlur?.(`shareholders.${index}.email`, e.target.value)}
                    className={shouldShowError(`shareholders.${index}.email`) ? "border-destructive" : ""}
                  />
                </FormField>
              </div>

              <FormField
                label="Address"
                htmlFor={`shareholder-${index}-address`}
                error={shouldShowError(`shareholders.${index}.address`) ? errors[`shareholders.${index}.address`] : undefined}
              >
                <Input
                  id={`shareholder-${index}-address`}
                  placeholder="Shareholder address (optional)"
                  value={shareholder.address || ""}
                  onChange={(e) => onShareholderChange?.(index, "address", e.target.value)}
                  onBlur={(e) => onBlur?.(`shareholders.${index}.address`, e.target.value)}
                  className={shouldShowError(`shareholders.${index}.address`) ? "border-destructive" : ""}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormField
                  label="Shareholding %"
                  htmlFor={`shareholder-${index}-shareholding`}
                  required
                  error={shouldShowError(`shareholders.${index}.shareholding`) ? errors[`shareholders.${index}.shareholding`] : undefined}
                >
                  <Input
                    id={`shareholder-${index}-shareholding`}
                    type="number"
                    placeholder="0.00"
                    min="0"
                    max="100"
                    step="0.01"
                    value={shareholder.shareholding}
                    onChange={(e) => onShareholderChange?.(index, "shareholding", parseFloat(e.target.value) || 0)}
                    onBlur={(e) => onBlur?.(`shareholders.${index}.shareholding`, shareholder.shareholding)}
                    className={shouldShowError(`shareholders.${index}.shareholding`) ? "border-destructive" : ""}
                  />
                </FormField>

                <FormField
                  label="Number of Shares"
                  htmlFor={`shareholder-${index}-shares`}
                  required
                  error={shouldShowError(`shareholders.${index}.noOfShares`) ? errors[`shareholders.${index}.noOfShares`] : undefined}
                >
                  <Input
                    id={`shareholder-${index}-shares`}
                    type="number"
                    placeholder="0"
                    min="0"
                    value={shareholder.noOfShares}
                    onChange={(e) => onShareholderChange?.(index, "noOfShares", parseInt(e.target.value) || 0)}
                    onBlur={(e) => onBlur?.(`shareholders.${index}.noOfShares`, shareholder.noOfShares)}
                    className={shouldShowError(`shareholders.${index}.noOfShares`) ? "border-destructive" : ""}
                  />
                </FormField>

                <FormField
                  label="Role / Designation"
                  htmlFor={`shareholder-${index}-role`}
                  required
                  error={shouldShowError(`shareholders.${index}.role`) ? errors[`shareholders.${index}.role`] : undefined}
                >
                  <select
                    id={`shareholder-${index}-role`}
                    value={shareholder.role}
                    onChange={(e) => onShareholderChange?.(index, "role", e.target.value)}
                    onBlur={(e) => onBlur?.(`shareholders.${index}.role`, e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md text-sm bg-background ${shouldShowError(`shareholders.${index}.role`) ? "border-destructive" : "border-input"}`}
                  >
                    <option value="">Select role</option>
                    <option value="founder">Founder</option>
                    <option value="investor">Investor</option>
                    <option value="employee-shareholder">Employee Shareholder</option>
                  </select>
                </FormField>
              </div>
            </div>
          ))}
        </div>

        {/* Add Shareholder Button */}
        <Button
          type="button"
          variant="outline"
          onClick={onAddShareholder}
          className="w-full gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Another Shareholder
        </Button>
      </div>
    </div>
  )
}
