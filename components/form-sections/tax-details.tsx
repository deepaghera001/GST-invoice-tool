"use client"

import type React from "react"
import { useEffect } from "react"
import type { InvoiceData } from "@/lib/core/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Info, Check } from "lucide-react"

interface TaxDetailsProps {
  formData: InvoiceData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  setFormData?: React.Dispatch<React.SetStateAction<InvoiceData>>
  isCompleted?: boolean
}

function getStateCodeFromGSTIN(gstin: string): string | null {
  if (!gstin || gstin.length < 2) return null
  return gstin.substring(0, 2)
}

export function TaxDetails({ formData, onChange, setFormData, isCompleted }: TaxDetailsProps) {
  const sellerState = getStateCodeFromGSTIN(formData.sellerGSTIN)
  const buyerState = getStateCodeFromGSTIN(formData.buyerGSTIN)
  // If buyer GSTIN is missing, use place of supply state if available
  const isInterState = buyerState
    ? sellerState !== buyerState
    : formData.placeOfSupplyState
      ? sellerState !== formData.placeOfSupplyState
      : false // Default to intra-state when both buyer GSTIN and place of supply are missing

  const totalGST = isInterState
    ? Number.parseFloat(formData.igst || "0") || 0
    : (Number.parseFloat(formData.cgst) || 0) + (Number.parseFloat(formData.sgst) || 0)

  const gstPresets = [
    { rate: 0, label: "0%" },
    { rate: 5, label: "5%" },
    { rate: 12, label: "12%" },
    { rate: 18, label: "18%" },
    { rate: 28, label: "28%" },
  ]

  const handlePresetClick = (rate: number) => {
    if (!setFormData) return

    if (isInterState) {
      setFormData((prev) => ({ ...prev, igst: rate.toString(), cgst: "0", sgst: "0" }))
    } else {
      const half = (rate / 2).toString()
      setFormData((prev) => ({ ...prev, cgst: half, sgst: half, igst: "0" }))
    }
  }

  useEffect(() => {
    if (!setFormData) return

    if (isInterState) {
      const currentTotal = (Number.parseFloat(formData.cgst) || 0) + (Number.parseFloat(formData.sgst) || 0)
      if (currentTotal > 0) {
        setFormData((prev) => ({ ...prev, igst: currentTotal.toString(), cgst: "0", sgst: "0" }))
      }
    } else {
      const currentIGST = Number.parseFloat(formData.igst || "0") || 0
      if (currentIGST > 0) {
        const half = (currentIGST / 2).toString()
        setFormData((prev) => ({ ...prev, cgst: half, sgst: half, igst: "0" }))
      }
    }
  }, [isInterState, setFormData])

  const validRates = [0, 5, 12, 18, 28]
  const isValidGST = validRates.includes(totalGST)

  return (
    <div
      className={`
        relative p-6 rounded-xl border-2 transition-all duration-500 ease-out
        ${isCompleted
          ? 'border-green-500/50 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20 shadow-lg shadow-green-500/10'
          : 'border-border bg-card hover:border-primary/30 hover:shadow-md'
        }
      `}
    >
      {/* Completion celebration effect */}
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
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg transition-all duration-300
                ${isCompleted
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-primary/10 text-primary'
                }
              `}>
                {isCompleted ? <Check className="h-5 w-5" /> : '5'}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-0.5">Tax Details</h3>
                <p className="text-sm text-muted-foreground">GST rates for the invoice</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-medium">
                Final Step
              </Badge>
              {totalGST > 0 && (
                <Badge variant={isValidGST ? "secondary" : "destructive"} className="text-xs">
                  Total GST: {totalGST}%
                </Badge>
              )}
            </div>
          </div>

          {/* Progress bar - always 100% since tax is auto-calculated */}
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-700 ease-out bg-gradient-to-r from-green-500 to-emerald-500"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div className="text-sm text-muted-foreground text-center py-3 border border-border rounded-lg bg-muted/50">
          <Info className="h-4 w-4 inline-block mr-2" />
          We calculate the correct GST automatically.
        </div>

        {buyerState && (
          <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50 border border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">
                {isInterState
                  ? "We detected an inter-state transaction and applied IGST automatically."
                  : "We detected an intra-state transaction and applied CGST/SGST automatically."}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isInterState
                  ? `Seller state: ${sellerState}, Buyer state: ${buyerState}`
                  : `Same state (${sellerState})`}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Quick Select GST Rate</Label>
          <div className="flex gap-2 flex-wrap">
            {gstPresets.map((preset) => (
              <Button
                key={preset.rate}
                type="button"
                variant={totalGST === preset.rate ? "default" : "outline"}
                size="sm"
                onClick={() => handlePresetClick(preset.rate)}
                className="transition-all duration-200 hover:scale-105"
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {isInterState
              ? "Supported GST slabs: 0%, 5%, 12%, 18%, 28% - Applied as IGST"
              : "Supported GST slabs: 0%, 5%, 12%, 18%, 28% - Auto-splits into CGST/SGST"}
          </p>
        </div>

        {isInterState ? (
          <div className="space-y-2">
            <Label htmlFor="igst" className="text-sm font-medium">IGST (%) - Read only, use quick select above</Label>
            <Input
              id="igst"
              name="igst"
              type="number"
              value={formData.igst || "0"}
              readOnly
              className="bg-muted cursor-not-allowed"
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">Integrated GST (for inter-state transactions)</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cgst" className="text-sm font-medium">CGST (%) - Read only</Label>
              <Input
                id="cgst"
                name="cgst"
                type="number"
                value={formData.cgst}
                readOnly
                className="bg-muted cursor-not-allowed"
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">Central GST rate</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sgst" className="text-sm font-medium">SGST (%) - Read only</Label>
              <Input
                id="sgst"
                name="sgst"
                type="number"
                value={formData.sgst}
                readOnly
                className="bg-muted cursor-not-allowed"
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">State GST rate</p>
            </div>
          </div>
        )}

        {!isValidGST && totalGST > 0 && (
          <p className="text-xs text-destructive animate-in fade-in slide-in-from-bottom-1">
            GST must be 0%, 5%, 12%, 18%, or 28%
          </p>
        )}
      </div>
    </div>
  )
}
