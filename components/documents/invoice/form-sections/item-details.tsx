"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import { Button } from "@/components/ui/button"
import type { useSuggestions } from "@/lib/hooks/use-suggestions"
import { Search } from "lucide-react"
import { Package } from "lucide-react"
import type { InvoiceData, InvoiceValidationErrors } from "@/lib/invoice"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const ITEM_FIELDS: FormFieldConfig[] = [
  {
    name: "itemDescription",
    label: "Item Description",
    type: "textarea",
    placeholder: "Describe the product or service",
    required: true,
    colSpan: "full", // Full width textarea
  },
  {
    name: "quantity",
    label: "Quantity",
    type: "number",
    placeholder: "1",
    required: true,
    colSpan: "third", // 1/3 width - number field doesn't need full space
    min: 0.01,
    step: 0.01,
  },
  {
    name: "unitPrice",
    label: "Unit Price (₹)",
    type: "number",
    placeholder: "0.00",
    required: true,
    colSpan: "third", // 1/3 width
    min: 0,
    step: 0.01,
  },
  {
    name: "hsnCode",
    label: "HSN Code",
    placeholder: "Enter or search HSN code",
    required: false,
    colSpan: "third", // 1/3 width
    maxLength: 8,
  },
]

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
  errors = {},
  shouldShowError = () => false,
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
    <FormSection
      title="Item Details"
      icon={Package}
      fields={ITEM_FIELDS}
      data={formData}
      errors={errors}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      isCompleted={isCompleted}
      layout={{ columns: 3, gap: 16 }} // 3-column layout: description full-width, quantity/price/hsn 1/3 each
    >
      {/* HSN Search Dropdown */}
      {suggestions && (
        <Popover open={hsnSearchOpen} onOpenChange={setHsnSearchOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
            >
              <Search className="h-4 w-4 mr-2" />
              Search HSN Code
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput
                placeholder="Search HSN code..."
                value={hsnSearchQuery}
                onValueChange={setHsnSearchQuery}
              />
              <CommandEmpty>No HSN codes found.</CommandEmpty>
              <CommandGroup>
                <CommandList>
                  {suggestions?.hsnSuggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion.value}
                      value={suggestion.value}
                      onSelect={() => handleHSNSelect(suggestion.value, suggestion.metadata)}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{suggestion.value}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{suggestion.metadata?.description}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </FormSection>
  )
}
