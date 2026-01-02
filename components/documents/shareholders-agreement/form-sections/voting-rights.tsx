/**
 * Voting Rights Form Section - Section 5
 */

"use client"

import type React from "react"
import { Vote, Check } from "lucide-react"
import { FormField } from "@/components/ui/form-field"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { ShareholdersAgreementFormData, ShareholdersAgreementValidationErrors } from "@/lib/shareholders-agreement"

const SPECIAL_MAJORITY_MATTERS = [
  { id: "amendAoA", label: "Amendment of Articles of Association" },
  { id: "changeShareCapital", label: "Change in authorized share capital" },
  { id: "issueNewShares", label: "Issue of new shares or securities" },
  { id: "mergerAcquisition", label: "Merger, acquisition, or sale of substantial assets" },
  { id: "windingUp", label: "Winding up or dissolution of the Company" },
  { id: "relatedPartyTransactions", label: "Related party transactions above threshold" },
]

interface VotingRightsProps {
  formData: ShareholdersAgreementFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  onCheckboxChange?: (path: string, value: string, checked: boolean) => void
  errors?: ShareholdersAgreementValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function VotingRights({
  formData,
  onChange,
  onBlur,
  onCheckboxChange,
  errors = {},
  shouldShowError = () => false,
  isCompleted,
}: VotingRightsProps) {
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
          <Vote className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Voting Rights</h3>
        </div>

        {/* Voting Basis */}
        <FormField
          label="Voting Basis"
          htmlFor="votingBasis"
          required
          error={shouldShowError("votingRights.votingBasis") ? errors["votingRights.votingBasis"] : undefined}
          hint="How voting power is determined"
        >
          <select
            id="votingBasis"
            value={formData.votingRights.votingBasis}
            onChange={(e) => onChange({ ...e, target: { ...e.target, name: "votingRights.votingBasis", value: e.target.value, type: e.target.type } } as React.ChangeEvent<HTMLSelectElement>)}
            onBlur={(e) => onBlur?.("votingRights.votingBasis", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm bg-background ${shouldShowError("votingRights.votingBasis") ? "border-destructive" : "border-input"}`}
          >
            <option value="">Select voting basis</option>
            <option value="one-share-one-vote">One Share = One Vote</option>
            <option value="special-voting-rights">Special Voting Rights</option>
          </select>
        </FormField>

        {/* Decisions Require */}
        <FormField
          label="Decisions Require"
          htmlFor="decisionsRequire"
          required
          error={shouldShowError("votingRights.decisionsRequire") ? errors["votingRights.decisionsRequire"] : undefined}
          hint="Approval threshold for major decisions"
        >
          <select
            id="decisionsRequire"
            value={formData.votingRights.decisionsRequire}
            onChange={(e) => onChange({ ...e, target: { ...e.target, name: "votingRights.decisionsRequire", value: e.target.value, type: e.target.type } } as React.ChangeEvent<HTMLSelectElement>)}
            onBlur={(e) => onBlur?.("votingRights.decisionsRequire", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm bg-background ${shouldShowError("votingRights.decisionsRequire") ? "border-destructive" : "border-input"}`}
          >
            <option value="">Select approval threshold</option>
            <option value="simple-majority">Simple Majority (50%+)</option>
            <option value="special-majority-75">Special Majority (75%+)</option>
            <option value="unanimous">Unanimous Consent</option>
          </select>
        </FormField>

        {/* Special Majority Matters */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Special Majority (75%) Required For</h4>
          <p className="text-xs text-muted-foreground">Select matters that require 75% shareholder approval</p>
          <div className="space-y-2">
            {SPECIAL_MAJORITY_MATTERS.map((matter) => (
              <label key={matter.id} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-muted/50 transition-colors">
                <Checkbox
                  checked={formData.votingRights.specialMajorityMatters?.includes(matter.id) ?? false}
                  onCheckedChange={(checked) =>
                    onCheckboxChange?.("votingRights.specialMajorityMatters", matter.id, checked === true)
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
