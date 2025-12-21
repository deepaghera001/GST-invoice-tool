"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { InvoiceData, InvoiceValidationErrors } from "@/lib/types"
import type { useSuggestions } from "@/hooks/use-suggestions"
import { Search } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ItemDetailsProps {
  formData: InvoiceData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: InvoiceValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  suggestions?: ReturnType<typeof useSuggestions>
  setFormData?: React.Dispatch<React.SetStateAction<InvoiceData>>
}

export function ItemDetails({
  formData,
  onChange,
  onBlur,
  errors,
  shouldShowError,
  suggestions,
  setFormData,
}: ItemDetailsProps) {
  const [hsnSearchOpen, setHsnSearchOpen] = useState(false)
  const [hsnSearchQuery, setHsnSearchQuery] = useState("")

  useEffect(() => {
    if (hsnSearchQuery && suggestions) {
      suggestions.searchHSN(hsnSearchQuery)
    }
  }, [hsnSearchQuery, suggestions])

  const handleHSNSelect = (hsnCode: string, metadata?: any) => {
    const event = {
      target: { name: "hsnCode", value: hsnCode },
    } as React.ChangeEvent<HTMLInputElement>
    onChange(event)

    if (metadata?.gstRate && setFormData) {
      const halfRate = (metadata.gstRate / 2).toString()
      setFormData((prev) => ({
        ...prev,
        hsnCode,
        cgst: halfRate,
        sgst: halfRate,
      }))
    }

    setHsnSearchOpen(false)
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Item Details</h3>
            <p className="text-sm text-muted-foreground">Service or product information</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            Step 4 of 4
          </Badge>
        </div>
      </div>
      <div className="grid gap-4">
        <FormField
          label="Description"
          htmlFor="itemDescription"
          required
          error={shouldShowError?.("itemDescription") ? errors?.itemDescription : undefined}
        >
          <Textarea
            id="itemDescription"
            name="itemDescription"
            value={formData.itemDescription}
            onChange={onChange}
            onBlur={() => onBlur?.("itemDescription", formData.itemDescription)}
            placeholder="Web Development Services / Product Name"
            rows={2}
          />
        </FormField>

        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            label="SAC Code"
            htmlFor="hsnCode"
            error={shouldShowError?.("hsnCode") ? errors?.hsnCode : undefined}
            hint="6 digits for services"
          >
            <Popover open={hsnSearchOpen} onOpenChange={setHsnSearchOpen}>
              <div className="flex gap-2">
                <Input
                  id="hsnCode"
                  name="hsnCode"
                  value={formData.hsnCode}
                  onChange={onChange}
                  onBlur={() => onBlur?.("hsnCode", formData.hsnCode)}
                  placeholder="998314"
                  maxLength={6}
                  className="flex-1"
                />
                {suggestions && (
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" size="icon" title="Search SAC codes">
                      <Search className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                )}
              </div>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search SAC codes..."
                    value={hsnSearchQuery}
                    onValueChange={setHsnSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No SAC codes found.</CommandEmpty>
                    <CommandGroup>
                      {suggestions?.hsnSuggestions.map((suggestion) => (
                        <CommandItem
                          key={suggestion.value}
                          value={suggestion.value}
                          onSelect={() => handleHSNSelect(suggestion.value, suggestion.metadata)}
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{suggestion.value}</span>
                              <Badge variant="outline" className="text-xs">
                                {suggestion.metadata?.gstRate}% GST
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">{suggestion.metadata?.description}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormField>

          <FormField
            label="Qty (units / hours)"
            htmlFor="quantity"
            required
            error={shouldShowError?.("quantity") ? errors?.quantity : undefined}
            hint="Number of units or hours"
          >
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={onChange}
              onBlur={() => onBlur?.("quantity", formData.quantity)}
              placeholder="1"
              min="0"
              step="0.01"
            />
          </FormField>

          <FormField
            label="Rate (₹)"
            htmlFor="rate"
            required
            error={shouldShowError?.("rate") ? errors?.rate : undefined}
          >
            <Input
              id="rate"
              name="rate"
              type="number"
              value={formData.rate}
              onChange={onChange}
              onBlur={() => onBlur?.("rate", formData.rate)}
              placeholder="10000"
              min="0"
              step="0.01"
            />
          </FormField>
        </div>
      </div>
    </div>
  )
}
