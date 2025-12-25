"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { useSuggestions } from "@/lib/hooks/use-suggestions"
import { Search, Check } from "lucide-react"
import type { InvoiceData, InvoiceValidationErrors } from "@/lib/invoice"
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
  isCompleted?: boolean
}

export function ItemDetails({
  formData,
  onChange,
  onBlur,
  errors,
  shouldShowError,
  suggestions,
  setFormData,
  isCompleted,
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
    <div
      className={`
        relative p-6 rounded-xl border transition-all duration-500 ease-out
        ${isCompleted
          ? 'border-green-400/40 bg-gradient-to-br from-green-50/30 to-transparent dark:from-green-950/10 shadow-md shadow-green-500/5'
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
                {isCompleted ? <Check className="h-5 w-5" /> : '4'}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-0.5">Item Details</h3>
                <p className="text-sm text-muted-foreground">Service or product information</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-medium">
              Step 4 of 4
            </Badge>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ease-out ${isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-primary/30'
                }`}
              style={{
                width: isCompleted ? '100%' : `${(formData.itemDescription.trim().length >= 3 ? 33 : 0) +
                  (Number.parseFloat(formData.quantity) > 0 ? 33 : 0) +
                  (Number.parseFloat(formData.rate) > 0 ? 34 : 0)
                  }%`
              }}
            />
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
              className="transition-all duration-200 focus:scale-[1.005] resize-none"
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
                    className="flex-1 transition-all duration-200 focus:scale-[1.01]"
                  />
                  {suggestions && (
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        title="Search SAC codes"
                        className="transition-all duration-200 hover:scale-105"
                      >
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
                className="transition-all duration-200 focus:scale-[1.01]"
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
                className="transition-all duration-200 focus:scale-[1.01]"
              />
            </FormField>
          </div>
        </div>
      </div>
    </div>
  )
}
