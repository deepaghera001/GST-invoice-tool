/**
 * Property Details Form Section
 */

"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Home, Check } from "lucide-react"
import type { RentAgreementFormData, RentAgreementValidationErrors } from "@/lib/rent-agreement"
import { PROPERTY_TYPES, FURNISHING_OPTIONS, INDIAN_STATES } from "@/lib/rent-agreement"

interface PropertyDetailsProps {
  formData: RentAgreementFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  onCheckboxChange?: (path: string, checked: boolean) => void
  errors?: RentAgreementValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}

export function PropertyDetails({
  formData,
  onChange,
  onBlur,
  onCheckboxChange,
  errors = {},
  shouldShowError = () => false,
  isCompleted,
}: PropertyDetailsProps) {
  const property = formData.property

  return (
    <Card className="border-border animate-in fade-in duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold">Property Details</CardTitle>
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
        {/* Property Address */}
        <FormField
          label="Property Address"
          error={shouldShowError("property.address") ? errors["property.address"] : undefined}
          required
        >
          <Textarea
            name="property.address"
            value={property.address}
            onChange={onChange}
            onBlur={() => onBlur?.("property.address", property.address)}
            placeholder="Complete address of the rental property"
            className="min-h-[80px]"
          />
        </FormField>

        {/* City, State, Pincode */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="City"
            error={shouldShowError("property.city") ? errors["property.city"] : undefined}
            required
          >
            <Input
              name="property.city"
              value={property.city}
              onChange={onChange}
              onBlur={() => onBlur?.("property.city", property.city)}
              placeholder="City"
            />
          </FormField>

          <FormField
            label="State"
            error={shouldShowError("property.state") ? errors["property.state"] : undefined}
            required
          >
            <select
              name="property.state"
              value={property.state}
              onChange={onChange}
              onBlur={() => onBlur?.("property.state", property.state)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select State</option>
              {INDIAN_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Pincode"
            error={shouldShowError("property.pincode") ? errors["property.pincode"] : undefined}
            required
          >
            <Input
              name="property.pincode"
              value={property.pincode}
              onChange={onChange}
              onBlur={() => onBlur?.("property.pincode", property.pincode)}
              placeholder="6-digit pincode"
              maxLength={6}
            />
          </FormField>
        </div>

        {/* Property Type & Furnishing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Property Type" required>
            <select
              name="property.propertyType"
              value={property.propertyType}
              onChange={onChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Furnishing Status" required>
            <select
              name="property.furnishingStatus"
              value={property.furnishingStatus}
              onChange={onChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {FURNISHING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Area, Floor, Parking */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Area (sq. ft.)">
            <Input
              name="property.area"
              value={property.area || ""}
              onChange={onChange}
              placeholder="e.g., 1200"
            />
          </FormField>

          <FormField label="Floor">
            <Input
              name="property.floor"
              value={property.floor || ""}
              onChange={onChange}
              placeholder="e.g., 3rd Floor"
            />
          </FormField>

          <FormField label="Parking">
            <div className="flex items-center h-10 space-x-2">
              <Checkbox
                id="parking"
                checked={property.parking || false}
                onCheckedChange={(checked) => onCheckboxChange?.("property.parking", !!checked)}
              />
              <label htmlFor="parking" className="text-sm text-muted-foreground cursor-pointer">
                Parking included
              </label>
            </div>
          </FormField>
        </div>
      </CardContent>
    </Card>
  )
}
