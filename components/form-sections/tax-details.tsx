"use client"

import type React from "react"
import { useEffect } from "react"
import type { InvoiceData } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"

interface TaxDetailsProps {
  formData: InvoiceData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  setFormData?: React.Dispatch<React.SetStateAction<InvoiceData>>
}

function getStateCodeFromGSTIN(gstin: string): string | null {
  if (!gstin || gstin.length < 2) return null
  return gstin.substring(0, 2)
}

export function TaxDetails({ formData, onChange, setFormData }: TaxDetailsProps) {
  const sellerState = getStateCodeFromGSTIN(formData.sellerGSTIN)
  const buyerState = getStateCodeFromGSTIN(formData.buyerGSTIN)
  const isInterState = buyerState ? sellerState !== buyerState : false

  const totalGST = isInterState
    ? Number.parseInt(formData.igst || "0", 10) || 0
    : (Number.parseInt(formData.cgst, 10) || 0) + (Number.parseInt(formData.sgst, 10) || 0)

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
      const half = Math.floor(rate / 2).toString()
      setFormData((prev) => ({ ...prev, cgst: half, sgst: half, igst: "0" }))
    }
  }

  useEffect(() => {
    if (!setFormData) return

    if (isInterState) {
      const currentTotal = (Number.parseInt(formData.cgst, 10) || 0) + (Number.parseInt(formData.sgst, 10) || 0)
      if (currentTotal > 0) {
        setFormData((prev) => ({ ...prev, igst: currentTotal.toString(), cgst: "0", sgst: "0" }))
      }
    } else {
      const currentIGST = Number.parseInt(formData.igst || "0", 10) || 0
      if (currentIGST > 0) {
        const half = Math.floor(currentIGST / 2).toString()
        setFormData((prev) => ({ ...prev, cgst: half, sgst: half, igst: "0" }))
      }
    }
  }, [isInterState, setFormData])

  const validRates = [0, 5, 12, 18, 28]
  const isValidGST = validRates.includes(totalGST)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Tax Details</h3>
          <p className="text-sm text-muted-foreground">GST rates for the invoice</p>
        </div>
        {totalGST > 0 && (
          <Badge variant={isValidGST ? "secondary" : "destructive"} className="text-sm">
            Total GST: {totalGST}%
          </Badge>
        )}
      </div>

      {buyerState && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground">
              {isInterState ? "Inter-state transaction detected" : "Intra-state transaction"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isInterState
                ? `Seller state: ${sellerState}, Buyer state: ${buyerState} → Use IGST`
                : `Same state (${sellerState}) → Use CGST + SGST`}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Quick Select GST Rate</Label>
        <div className="flex gap-2 flex-wrap">
          {gstPresets.map((preset) => (
            <Button
              key={preset.rate}
              type="button"
              variant={totalGST === preset.rate ? "default" : "outline"}
              size="sm"
              onClick={() => handlePresetClick(preset.rate)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {isInterState
            ? "Standard Indian GST rates - Applied as IGST"
            : "Standard Indian GST rates - Auto-splits into CGST/SGST"}
        </p>
      </div>

      {isInterState ? (
        <div className="space-y-2">
          <Label htmlFor="igst">IGST (%) - Read only, use quick select above</Label>
          <Input
            id="igst"
            name="igst"
            type="number"
            value={formData.igst || "0"}
            readOnly
            className="bg-muted"
            placeholder="0"
          />
          <p className="text-xs text-muted-foreground">Integrated GST (for inter-state transactions)</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cgst">CGST (%) - Read only</Label>
            <Input
              id="cgst"
              name="cgst"
              type="number"
              value={formData.cgst}
              readOnly
              className="bg-muted"
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">Central GST rate</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sgst">SGST (%) - Read only</Label>
            <Input
              id="sgst"
              name="sgst"
              type="number"
              value={formData.sgst}
              readOnly
              className="bg-muted"
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">State GST rate</p>
          </div>
        </div>
      )}

      {!isValidGST && totalGST > 0 && <p className="text-xs text-destructive">GST must be 0%, 5%, 12%, 18%, or 28%</p>}
    </div>
  )
}
