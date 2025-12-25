# 📖 Implementation Guide

Complete step-by-step guide to adding a new document type. Full code examples included.

**Time:** 1-2 hours | **Difficulty:** Intermediate | **Prerequisite:** Read [DOCS_HOME.md](DOCS_HOME.md)

---

## Table of Contents

1. [Overview](#-overview)
2. [Step-by-Step Guide](#-step-by-step-guide)
3. [Complete Code Examples](#-complete-code-examples)
4. [Troubleshooting](#-troubleshooting)
5. [Implementation Checklist](#-implementation-checklist)

---

## 📌 Overview

### What You'll Create

A complete document type with:
- ✅ Type definitions
- ✅ Validation schema
- ✅ Form state hook
- ✅ React form component
- ✅ Preview component
- ✅ PDF generator
- ✅ Page component
- ✅ API integration

### Architecture Flow

```
1. User fills form → 2. Hook validates → 3. Component renders
  ↓
4. Submit → 5. API route → 6. PDF generator → 7. Download
```

### Files You'll Create

```
lib/[type]/
├── types.ts              ← Data types
├── schema.ts             ← Zod validation
├── constants.ts          ← Regexes, defaults (optional)
└── calculations.ts       ← Business logic (optional)

lib/hooks/
└── use-[type]-form.ts    ← Form state hook

components/documents/[type]/
├── [type]-form.tsx       ← Main form
├── [type]-preview.tsx    ← Preview (optional)
└── form-sections/        ← Individual sections (optional)

app/[type]/
└── page.tsx              ← Route page

lib/services/generators/
└── [type]-generator.ts   ← PDF generator
```

---

## 🚀 Step-by-Step Guide

### Step 1: Define Your Types (15 min)

**Why:** TypeScript types define the shape of your data. Everything else flows from here.

**File:** `lib/[documentType]/types.ts`

```typescript
// lib/quotation/types.ts
export interface QuotationItem {
  description: string
  quantity: string
  rate: string
  tax: string
}

export interface QuotationData {
  // Seller details
  sellerName: string
  sellerAddress: string
  sellerGSTIN: string
  
  // Buyer details
  buyerName: string
  buyerAddress: string
  buyerGSTIN?: string
  
  // Document details
  documentNumber: string
  documentDate: string
  validUntil: string
  
  // Items
  items: QuotationItem[]
  
  // Tax
  taxRate: string
}

export interface QuotationTotals {
  subtotal: number
  taxAmount: number
  total: number
}
```

**Checklist:**
- [ ] File created at correct path
- [ ] All required fields included
- [ ] Types exported

---

### Step 2: Create Validation Schema (20 min)

**Why:** Zod validates user input and automatically generates TypeScript types.

**File:** `lib/[documentType]/schema.ts`

```typescript
// lib/quotation/schema.ts
import { z } from "zod"

// Common patterns (reuse these)
const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
const NAME_PATTERN = /^[a-zA-Z\s.,&-]{2,200}$/
const ADDRESS_PATTERN = /^[a-zA-Z0-9\s.,\-#/]{10,500}$/

// Item schema
const quotationItemSchema = z.object({
  description: z.string().min(3).max(500),
  quantity: z.string().refine(v => {
    const n = Number(v)
    return !isNaN(n) && n > 0
  }, "Quantity must be positive"),
  rate: z.string().refine(v => {
    const n = Number(v)
    return !isNaN(n) && n > 0
  }, "Rate must be positive"),
  tax: z.string().refine(v => {
    const n = Number(v)
    return n >= 0 && n <= 100
  }, "Tax must be 0-100"),
})

// Main schema
export const quotationSchema = z.object({
  sellerName: z.string()
    .min(2, "Seller name too short")
    .max(200, "Seller name too long"),
  sellerAddress: z.string()
    .min(10, "Address too short")
    .max(500, "Address too long"),
  sellerGSTIN: z.string().regex(GSTIN_PATTERN, "Invalid GSTIN format"),
  
  buyerName: z.string()
    .min(2, "Buyer name too short")
    .max(200, "Buyer name too long"),
  buyerAddress: z.string()
    .min(10, "Address too short")
    .max(500, "Address too long"),
  buyerGSTIN: z.string().regex(GSTIN_PATTERN, "Invalid GSTIN").optional().or(z.literal("")),
  
  documentNumber: z.string()
    .min(1, "Document number required")
    .max(20, "Document number too long"),
  documentDate: z.string()
    .refine(v => !isNaN(Date.parse(v)), "Invalid date"),
  validUntil: z.string()
    .refine(v => !isNaN(Date.parse(v)), "Invalid date"),
  
  items: z.array(quotationItemSchema).min(1, "At least one item required"),
  
  taxRate: z.string().refine(v => {
    const n = Number(v)
    return n >= 0 && n <= 100
  }, "Tax rate must be 0-100"),
}).refine(
  (data) => new Date(data.documentDate) < new Date(data.validUntil),
  { message: "Valid until date must be after document date", path: ["validUntil"] }
)

// Export types derived from schema
export type QuotationFormData = z.infer<typeof quotationSchema>
export type QuotationItem = z.infer<typeof quotationItemSchema>

// Field-level validation (use for blur events)
export const quotationFieldSchema = quotationSchema.partial()
```

**Key Patterns:**
```typescript
// String with length
z.string().min(2).max(200)

// Number validation
z.string().refine(v => Number(v) > 0, "Must be positive")

// Pattern/Regex
z.string().regex(/pattern/, "Error message")

// Optional fields
z.string().optional().or(z.literal(""))

// Cross-field validation
schema.refine((data) => data.date1 < data.date2)

// Array validation
z.array(itemSchema).min(1, "At least one item")
```

**Checklist:**
- [ ] Schema covers all fields in types
- [ ] Error messages are user-friendly
- [ ] Cross-field validation works
- [ ] Types exported

---

### Step 3: Create Form Hook (30 min)

**Why:** Encapsulates form state, validation, and calculations - keeps components clean.

**File:** `lib/hooks/use-[documentType]-form.ts`

```typescript
// lib/hooks/use-quotation-form.ts
"use client"

import { useState, useCallback, useMemo } from "react"
import { quotationSchema, type QuotationFormData } from "@/lib/quotation/schema"
import { quotationCalculations } from "@/lib/quotation/calculations"

// Default empty form data
const DEFAULT_FORM_DATA: QuotationFormData = {
  sellerName: "",
  sellerAddress: "",
  sellerGSTIN: "",
  buyerName: "",
  buyerAddress: "",
  buyerGSTIN: "",
  documentNumber: "",
  documentDate: new Date().toISOString().split("T")[0],
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  items: [{ description: "", quantity: "1", rate: "0", tax: "18" }],
  taxRate: "18",
}

export function useQuotationForm() {
  // State
  const [formData, setFormData] = useState<QuotationFormData>(DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle field changes
  const handleChange = useCallback((field: string, value: any) => {
    setFormData((prev) => {
      const keys = field.split(".")
      if (keys.length === 1) {
        return { ...prev, [field]: value }
      }
      // Nested update: "items.0.description"
      const copy = JSON.parse(JSON.stringify(prev))
      let current = copy
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      return copy
    })

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy[field]
        return copy
      })
    }
  }, [errors])

  // Validate on blur
  const handleBlur = useCallback((field: string) => {
    setTouchedFields((prev) => new Set(prev).add(field))

    // Validate field
    try {
      const keys = field.split(".")
      const value = keys.length === 1
        ? formData[keys[0] as keyof QuotationFormData]
        : formData.items[Number(keys[1])][keys[2] as keyof typeof formData.items[0]]

      quotationSchema.pick({ [keys[0]]: true }).parse({
        [keys[0]]: keys.length === 1 ? value : formData[keys[0] as keyof QuotationFormData],
      })
    } catch (error) {
      if (error instanceof Error) {
        setErrors((prev) => ({ ...prev, [field]: error.message }))
      }
    }
  }, [formData])

  // Full form validation
  const validateForm = useCallback(() => {
    try {
      quotationSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof Error && "errors" in error) {
        const newErrors: Record<string, string> = {}
        ;(error as any).errors.forEach((err: any) => {
          const path = err.path.join(".")
          newErrors[path] = err.message
        })
        setErrors(newErrors)
      }
      return false
    }
  }, [formData])

  // Handle form submission
  const handleSubmit = useCallback(
    async (onSuccess: (data: QuotationFormData) => Promise<void>) => {
      if (!validateForm()) return false

      setIsSubmitting(true)
      try {
        await onSuccess(formData)
        return true
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, validateForm]
  )

  // Calculate totals (memoized)
  const totals = useMemo(
    () => quotationCalculations.calculateTotals(formData),
    [formData]
  )

  // Helper to check if error should show
  const shouldShowError = useCallback(
    (field: string) => touchedFields.has(field),
    [touchedFields]
  )

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA)
    setErrors({})
    setTouchedFields(new Set())
  }, [])

  return {
    // State
    formData,
    errors,
    isSubmitting,
    touchedFields,
    totals,

    // Methods
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm,
    resetForm,

    // Helpers
    shouldShowError,
    getFieldError: (field: string) => (shouldShowError(field) ? errors[field] : undefined),
  }
}
```

**Key Patterns:**
```typescript
// State management
const [formData, setFormData] = useState(DEFAULT)
const [errors, setErrors] = useState({})
const [touched, setTouched] = useState(new Set())

// Field change with nested support
const handleChange = (field: string, value) => {
  // Handle "items.0.description" format
}

// Blur validation
const handleBlur = (field: string) => {
  // Validate against schema
}

// Memoized calculations
const totals = useMemo(() => calculate(formData), [formData])

// Error display control
const shouldShowError = (field) => touched.has(field)
```

**Checklist:**
- [ ] Hook is client component ("use client")
- [ ] State initialized with defaults
- [ ] handleChange clears errors
- [ ] handleBlur validates field
- [ ] validateForm checks entire form
- [ ] Nested field updates work
- [ ] Calculations memoized

---

### Step 4: Create Form Component (20 min)

**Why:** Renders the form UI using the hook above.

**File:** `components/documents/[documentType]/[documentType]-form.tsx`

```typescript
// components/documents/quotation/quotation-form.tsx
"use client"

import { useQuotationForm } from "@/lib/hooks/use-quotation-form"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Loader2, Trash2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export function QuotationForm() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    shouldShowError,
    getFieldError,
    totals,
  } = useQuotationForm()

  // Generate PDF
  const handleGeneratePDF = async () => {
    const success = await handleSubmit(async (data) => {
      try {
        const response = await fetch("/api/generate-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentType: "quotation",
            documentData: data,
          }),
        })

        if (!response.ok) throw new Error("Failed to generate PDF")

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `quotation-${data.documentNumber}.pdf`
        a.click()
        URL.revokeObjectURL(url)

        toast({
          title: "Success",
          description: "Quotation PDF generated successfully",
        })
      } catch (error) {
        throw error instanceof Error ? error : new Error("Unknown error")
      }
    })

    if (!success) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Seller Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Seller Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Seller Name *</label>
            <input
              type="text"
              value={formData.sellerName}
              onChange={(e) => handleChange("sellerName", e.target.value)}
              onBlur={() => handleBlur("sellerName")}
              className={`w-full px-3 py-2 border rounded ${
                getFieldError("sellerName") ? "border-red-500" : ""
              }`}
            />
            {getFieldError("sellerName") && (
              <span className="text-red-500 text-xs mt-1">{getFieldError("sellerName")}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">GSTIN *</label>
            <input
              type="text"
              value={formData.sellerGSTIN}
              onChange={(e) => handleChange("sellerGSTIN", e.target.value)}
              onBlur={() => handleBlur("sellerGSTIN")}
              className={`w-full px-3 py-2 border rounded ${
                getFieldError("sellerGSTIN") ? "border-red-500" : ""
              }`}
            />
            {getFieldError("sellerGSTIN") && (
              <span className="text-red-500 text-xs mt-1">{getFieldError("sellerGSTIN")}</span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 mt-4">Address *</label>
          <textarea
            value={formData.sellerAddress}
            onChange={(e) => handleChange("sellerAddress", e.target.value)}
            onBlur={() => handleBlur("sellerAddress")}
            rows={2}
            className={`w-full px-3 py-2 border rounded ${
              getFieldError("sellerAddress") ? "border-red-500" : ""
            }`}
          />
          {getFieldError("sellerAddress") && (
            <span className="text-red-500 text-xs mt-1">{getFieldError("sellerAddress")}</span>
          )}
        </div>
      </Card>

      {/* Buyer Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Buyer Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Buyer Name *</label>
            <input
              type="text"
              value={formData.buyerName}
              onChange={(e) => handleChange("buyerName", e.target.value)}
              onBlur={() => handleBlur("buyerName")}
              className={`w-full px-3 py-2 border rounded ${
                getFieldError("buyerName") ? "border-red-500" : ""
              }`}
            />
            {getFieldError("buyerName") && (
              <span className="text-red-500 text-xs mt-1">{getFieldError("buyerName")}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">GSTIN (Optional)</label>
            <input
              type="text"
              value={formData.buyerGSTIN || ""}
              onChange={(e) => handleChange("buyerGSTIN", e.target.value)}
              onBlur={() => handleBlur("buyerGSTIN")}
              className={`w-full px-3 py-2 border rounded ${
                getFieldError("buyerGSTIN") ? "border-red-500" : ""
              }`}
            />
            {getFieldError("buyerGSTIN") && (
              <span className="text-red-500 text-xs mt-1">{getFieldError("buyerGSTIN")}</span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 mt-4">Address *</label>
          <textarea
            value={formData.buyerAddress}
            onChange={(e) => handleChange("buyerAddress", e.target.value)}
            onBlur={() => handleBlur("buyerAddress")}
            rows={2}
            className={`w-full px-3 py-2 border rounded ${
              getFieldError("buyerAddress") ? "border-red-500" : ""
            }`}
          />
          {getFieldError("buyerAddress") && (
            <span className="text-red-500 text-xs mt-1">{getFieldError("buyerAddress")}</span>
          )}
        </div>
      </Card>

      {/* Document Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Document Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Number *</label>
            <input
              type="text"
              value={formData.documentNumber}
              onChange={(e) => handleChange("documentNumber", e.target.value)}
              onBlur={() => handleBlur("documentNumber")}
              className={`w-full px-3 py-2 border rounded ${
                getFieldError("documentNumber") ? "border-red-500" : ""
              }`}
            />
            {getFieldError("documentNumber") && (
              <span className="text-red-500 text-xs mt-1">{getFieldError("documentNumber")}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input
              type="date"
              value={formData.documentDate}
              onChange={(e) => handleChange("documentDate", e.target.value)}
              onBlur={() => handleBlur("documentDate")}
              className={`w-full px-3 py-2 border rounded ${
                getFieldError("documentDate") ? "border-red-500" : ""
              }`}
            />
            {getFieldError("documentDate") && (
              <span className="text-red-500 text-xs mt-1">{getFieldError("documentDate")}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Valid Until *</label>
            <input
              type="date"
              value={formData.validUntil}
              onChange={(e) => handleChange("validUntil", e.target.value)}
              onBlur={() => handleBlur("validUntil")}
              className={`w-full px-3 py-2 border rounded ${
                getFieldError("validUntil") ? "border-red-500" : ""
              }`}
            />
            {getFieldError("validUntil") && (
              <span className="text-red-500 text-xs mt-1">{getFieldError("validUntil")}</span>
            )}
          </div>
        </div>
      </Card>

      {/* Items */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Items</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              handleChange("items", [
                ...formData.items,
                { description: "", quantity: "1", rate: "0", tax: "18" },
              ])
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Item
          </Button>
        </div>

        {formData.items.map((item, idx) => (
          <div key={idx} className="mb-4 pb-4 border-b last:border-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    handleChange(`items.${idx}.description`, e.target.value)
                  }
                  onBlur={() => handleBlur(`items.${idx}.description`)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity *</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleChange(`items.${idx}.quantity`, e.target.value)
                  }
                  onBlur={() => handleBlur(`items.${idx}.quantity`)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rate *</label>
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => handleChange(`items.${idx}.rate`, e.target.value)}
                  onBlur={() => handleBlur(`items.${idx}.rate`)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            {formData.items.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-600 mt-2"
                onClick={() => {
                  handleChange(
                    "items",
                    formData.items.filter((_, i) => i !== idx)
                  )
                }}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </Button>
            )}
          </div>
        ))}
      </Card>

      {/* Summary */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>₹{totals.taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>₹{totals.total.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={resetForm}>
          Reset
        </Button>
        <Button
          type="button"
          onClick={handleGeneratePDF}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Generate PDF
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
```

**Checklist:**
- [ ] Uses hook for state
- [ ] Validation errors show on blur
- [ ] All fields have proper input types
- [ ] PDF generation works
- [ ] Form reset works
- [ ] Component is client-side

---

### Step 5: Create Form Component (CRITICAL - 2-Column Layout)

**Why:** This is the most important step. The form must follow the 2-column layout pattern (form left + preview right) with animations.

**File:** `components/documents/[documentType]/[type]-form.tsx`

**CRITICAL DESIGN PATTERN (REQUIRED):**
```
┌─────────────────────────────────────────────────────┐
│ Form (Left) - Animated Sections │ Preview (Right) - Live │
├─────────────────────────────────┼─────────────────────────┤
│ Title & Subtitle                │                         │
│ Info Box (animated)             │ Preview Component       │
│ Section 1 (delay-75)            │ (real-time sync with    │
│ Section 2 (delay-150)           │  form data)             │
│ Section 3 (delay-225)           │                         │
│ Download Button (delay-300)     │                         │
└─────────────────────────────────┴─────────────────────────┘

Layout: lg:grid-cols-2 gap-8 (2 columns on large, 1 on mobile)
Left: Form sections with staggered animations
Right: Live preview component (react in real-time to form changes)
```

```typescript
// components/documents/quotation/quotation-form.tsx
"use client"

import { useQuotationForm } from "@/lib/hooks/use-quotation-form"
import { QuotationPreview } from "./quotation-preview"
import { SellerDetailsSection } from "./form-sections/seller-details"
import { BuyerDetailsSection } from "./form-sections/buyer-details"
import { QuotationDetailsSection } from "./form-sections/quotation-details"
import { ItemsSection } from "./form-sections/items"
import { TaxSection } from "./form-sections/tax"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function QuotationForm() {
  const { 
    formData, 
    errors, 
    calculatedData,
    handleChange, 
    handleBlur, 
    handleSubmit,
    shouldShowError 
  } = useQuotationForm()

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* LEFT COLUMN: Form with Animated Sections */}
      <div className="space-y-6">
        {/* Title Section */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Create Quotation</h2>
          <p className="text-muted-foreground">
            Fill in details. Preview updates in real-time on the right.
          </p>
        </div>

        {/* Form Sections with Staggered Animations */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Info Box - First to animate */}
          <div className="space-y-6 p-6 border rounded-xl bg-card shadow-sm 
                          animate-in fade-in slide-in-from-top-2 duration-200">
            <div>
              <h3 className="font-semibold mb-2">Document Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Number</p>
                  <p className="font-medium">{formData.documentNumber || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{formData.documentDate || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Details - Second animation (delay-75) */}
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-75">
            <SellerDetailsSection
              data={formData}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              shouldShowError={shouldShowError}
            />
          </div>

          {/* Buyer Details - Third animation (delay-150) */}
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-150">
            <BuyerDetailsSection
              data={formData}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              shouldShowError={shouldShowError}
            />
          </div>

          {/* Quotation Details - Fourth animation (delay-225) */}
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-225">
            <QuotationDetailsSection
              data={formData}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              shouldShowError={shouldShowError}
            />
          </div>

          {/* Items - Fifth animation (delay-300) */}
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-300">
            <ItemsSection
              data={formData}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              shouldShowError={shouldShowError}
            />
          </div>

          {/* Tax - Sixth animation (delay-375) */}
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-375">
            <TaxSection
              data={formData}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              shouldShowError={shouldShowError}
            />
          </div>

          {/* Download Button - Last animation (delay-450) */}
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-450">
            <Button 
              type="submit" 
              className="w-full h-12 text-base"
              onClick={() => {
                if (Object.keys(errors).length === 0) {
                  toast.success("Quotation generated successfully!")
                }
              }}
            >
              Download Quotation PDF
            </Button>
          </div>
        </form>
      </div>

      {/* RIGHT COLUMN: Live Preview Component */}
      <div className="sticky top-8 h-fit">
        <QuotationPreview 
          formData={formData} 
          calculatedData={calculatedData}
        />
      </div>
    </div>
  )
}
```

**Key Points:**
- ✅ 2-column layout with `lg:grid-cols-2 gap-8`
- ✅ Left: Form sections with staggered animations
- ✅ Right: Live preview (real-time sync with formData)
- ✅ Animations with increasing delays: 75ms, 150ms, 225ms, 300ms, 375ms, 450ms
- ✅ Preview component receives formData and calculatedData
- ✅ Responsive: Stacks on mobile, 2-column on lg screens

**Checklist:**
- [ ] 2-column layout implemented (lg:grid-cols-2 gap-8)
- [ ] All form sections wrapped with delay animations
- [ ] Preview component on right side
- [ ] Preview receives formData and calculatedData props
- [ ] Animations: animate-in fade-in slide-in-from-top-2 duration-200 delay-[XX]
- [ ] Form submits correctly
- [ ] Preview updates in real-time

---

### Step 6: Create Form Sections (20 min)

**Why:** Individual sections make form maintainable and keep animations working.

**File:** `components/documents/[documentType]/form-sections/[section-name].tsx`

```typescript
// components/documents/quotation/form-sections/seller-details.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Building2 } from "lucide-react"

interface SellerDetailsSectionProps {
  data: QuotationFormData
  errors: Record<string, string>
  onChange: (field: string, value: string) => void
  onBlur: (field: string) => void
  shouldShowError: (field: string) => boolean
}

export function SellerDetailsSection({
  data,
  errors,
  onChange,
  onBlur,
  shouldShowError,
}: SellerDetailsSectionProps) {
  return (
    <Card className="border-border/50 hover:border-primary/30 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Your Company (Seller) Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          label="Company Name"
          value={data.sellerName}
          onChange={(e) => onChange("sellerName", e.target.value)}
          onBlur={() => onBlur("sellerName")}
          error={shouldShowError("sellerName") ? errors.sellerName : undefined}
          placeholder="Your Company Name"
        />
        <FormField
          label="Address"
          value={data.sellerAddress}
          onChange={(e) => onChange("sellerAddress", e.target.value)}
          onBlur={() => onBlur("sellerAddress")}
          error={shouldShowError("sellerAddress") ? errors.sellerAddress : undefined}
          placeholder="Full address"
        />
        <FormField
          label="GSTIN"
          value={data.sellerGSTIN}
          onChange={(e) => onChange("sellerGSTIN", e.target.value)}
          onBlur={() => onBlur("sellerGSTIN")}
          error={shouldShowError("sellerGSTIN") ? errors.sellerGSTIN : undefined}
          placeholder="GSTIN (e.g., 27AABCT1234H1Z0)"
        />
      </CardContent>
    </Card>
  )
}
```

**Section Pattern:**
- ✅ Named export matching component name
- ✅ Interface with Props type
- ✅ Card wrapper with icon and title
- ✅ FormFields inside CardContent
- ✅ Pass data, errors, onChange, onBlur, shouldShowError

**Checklist:**
- [ ] All required sections created
- [ ] FormFields bound to data
- [ ] Error handling in place
- [ ] Icons and titles descriptive

---

### Step 7: Create Page Component (10 min)

**Why:** Integrates form into a full page with header, layout, and navigation.

**File:** `app/[documentType]/page.tsx`

```typescript
// app/quotation/page.tsx
import { QuotationForm } from "@/components/documents/quotation/quotation-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Create Quotation | DocGen",
}

export default function QuotationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">DocGen</h1>
            <p className="text-sm text-gray-600">Professional Document Generation</p>
          </div>
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <QuotationForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 bg-white">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 DocGen. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
```

**Checklist:**
- [ ] Page component created
- [ ] Form imported correctly
- [ ] max-w-7xl for 2-column layout (not max-w-3xl)
- [ ] Header and footer included
- [ ] Link to home page works

---

### Step 8: Create PDF Generator (20 min)

**Why:** Handles PDF generation using Playwright.

**File:** `lib/services/generators/[documentType]-generator.ts`

```typescript
// lib/services/generators/quotation-generator.ts
import { PDFGenerator } from "./types"
import type { QuotationFormData } from "@/lib/quotation/schema"

export class QuotationGenerator implements PDFGenerator<QuotationFormData> {
  async generatePDF(formData: QuotationFormData): Promise<Buffer> {
    // HTML template for the PDF
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quotation</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          .container { max-width: 800px; margin: 0 auto; }
          
          .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .header h1 { font-size: 24px; font-weight: bold; color: #2c3e50; }
          .header .meta { text-align: right; }
          .header .meta p { margin: 5px 0; font-size: 12px; color: #666; }
          
          .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .details-section { border: 1px solid #ddd; padding: 15px; border-radius: 4px; }
          .details-section h3 { font-size: 12px; font-weight: bold; color: #2c3e50; margin-bottom: 10px; text-transform: uppercase; }
          .details-section p { font-size: 12px; margin: 5px 0; line-height: 1.6; }
          
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background-color: #2c3e50; color: white; padding: 12px; text-align: left; font-size: 12px; font-weight: bold; }
          td { padding: 12px; border-bottom: 1px solid #ddd; font-size: 12px; }
          tr:hover { background-color: #f5f5f5; }
          
          .totals { display: flex; justify-content: flex-end; margin-bottom: 30px; }
          .totals-table { width: 300px; }
          .totals-table tr td { padding: 8px 12px; }
          .totals-table tr:last-child { border-top: 2px solid #2c3e50; }
          .totals-table tr:last-child td { font-weight: bold; font-size: 14px; }
          
          .footer { text-align: center; color: #666; font-size: 11px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <h1>Quotation</h1>
            </div>
            <div class="meta">
              <p><strong>QT-${formData.documentNumber}</strong></p>
              <p>Date: ${new Date(formData.documentDate).toLocaleDateString()}</p>
              <p>Valid Until: ${new Date(formData.validUntil).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div class="details">
            <div class="details-section">
              <h3>From (Seller)</h3>
              <p><strong>${formData.sellerName}</strong></p>
              <p>${formData.sellerAddress}</p>
              <p>GSTIN: ${formData.sellerGSTIN}</p>
            </div>
            
            <div class="details-section">
              <h3>To (Buyer)</h3>
              <p><strong>${formData.buyerName}</strong></p>
              <p>${formData.buyerAddress}</p>
              ${formData.buyerGSTIN ? `<p>GSTIN: ${formData.buyerGSTIN}</p>` : ""}
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${formData.items.map((item) => {
                const amount = (Number(item.quantity) || 0) * (Number(item.rate) || 0)
                return `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>₹${Number(item.rate).toFixed(2)}</td>
                    <td>₹${amount.toFixed(2)}</td>
                  </tr>
                `
              }).join("")}
            </tbody>
          </table>
          
          <div class="totals">
            <table class="totals-table">
              <tr>
                <td>Subtotal</td>
                <td>₹${formData.items.reduce((sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.rate) || 0)), 0).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Tax (${formData.taxRate}%)</td>
                <td>₹${(formData.items.reduce((sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.rate) || 0)), 0) * (Number(formData.taxRate) || 0) / 100).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Total</td>
                <td>₹${(formData.items.reduce((sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.rate) || 0)), 0) * (1 + (Number(formData.taxRate) || 0) / 100)).toFixed(2)}</td>
              </tr>
            </table>
          </div>
          
          <div class="footer">
            <p>This is a computer-generated quotation. No signature is required.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Use Playwright to convert HTML to PDF
    const playwright = await import("playwright")
    const browser = await playwright.chromium.launch()
    const page = await browser.newPage()
    await page.setContent(html)
    const pdf = await page.pdf({ format: "A4" })
    await browser.close()

    return Buffer.from(pdf)
  }
}
```

**Checklist:**
- [ ] Generator class created
- [ ] Implements PDFGenerator interface
- [ ] HTML template complete
- [ ] CSS styles included
- [ ] Playwright integration working

---

### Step 9: Register in Factory (5 min)

**Why:** Makes the PDF generator discoverable by the document service.

**File:** `lib/services/generators/generator-factory.ts`

Find this code:
```typescript
export class GeneratorFactory {
  private static generators = new Map<string, PDFGenerator>()

  static {
    this.register(new DOMHTMLGenerator())
    this.register(new InvoiceGenerator())
    // ADD BELOW:
    this.register(new QuotationGenerator())
  }
  // ... rest
}
```

**Checklist:**
- [ ] Import statement added
- [ ] Register call added
- [ ] Matches document type name

---

### Step 10: Update Navigation (5 min)

**Why:** Adds link to new document type from home page.

**File:** `app/page.tsx`

Find the document cards section and add:
```typescript
<Link href="/quotation">
  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
    <CardHeader>
      <FileText className="w-8 h-8 mb-2 text-blue-600" />
      <CardTitle>Quotation</CardTitle>
      <CardDescription>Create professional quotations</CardDescription>
    </CardHeader>
  </Card>
</Link>
```

**Checklist:**
- [ ] Link added to navigation
- [ ] Icon chosen
- [ ] Title and description set

---

## 📚 Complete Code Examples

### Example 1: Simple Document Type (No Tax)

```typescript
// lib/receipt/types.ts
export interface ReceiptData {
  receiptNumber: string
  receiptDate: string
  sellerName: string
  buyerName: string
  amount: string
  paymentMethod: string
}

// lib/receipt/schema.ts
import { z } from "zod"

export const receiptSchema = z.object({
  receiptNumber: z.string().min(1),
  receiptDate: z.string().refine(v => !isNaN(Date.parse(v))),
  sellerName: z.string().min(2),
  buyerName: z.string().min(2),
  amount: z.string().refine(v => Number(v) > 0),
  paymentMethod: z.enum(["cash", "check", "transfer", "online"]),
})

export type ReceiptFormData = z.infer<typeof receiptSchema>
```

### Example 2: Document with Complex Calculations

```typescript
// lib/invoice/calculations.ts
export class InvoiceCalculations {
  static calculateTotals(data: InvoiceData): InvoiceTotals {
    let subtotal = 0
    let cgstTotal = 0
    let sgstTotal = 0

    data.items.forEach((item) => {
      const itemTotal = Number(item.quantity) * Number(item.rate)
      const cgst = (itemTotal * Number(item.cgst)) / 100
      const sgst = (itemTotal * Number(item.sgst)) / 100

      subtotal += itemTotal
      cgstTotal += cgst
      sgstTotal += sgst
    })

    return {
      subtotal,
      cgstAmount: cgstTotal,
      sgstAmount: sgstTotal,
      total: subtotal + cgstTotal + sgstTotal,
    }
  }
}
```

### Example 3: Conditional Validation

```typescript
// schema.ts with conditional validation
export const schema = z.object({
  isBusiness: z.boolean(),
  businessName: z.string().optional(),
  gstNumber: z.string().optional(),
}).refine(
  (data) => !data.isBusiness || (data.businessName && data.gstNumber),
  { message: "Business name and GST required if business", path: ["businessName"] }
)
```

---

## 🐛 Troubleshooting

### Form not validating

**Problem:** Errors not showing on blur

**Solution:**
```typescript
// Make sure touched fields is being updated
const handleBlur = (field) => {
  setTouchedFields(prev => new Set(prev).add(field)) // Add this line
  // ... rest of validation
}
```

### PDF not generating

**Problem:** 404 or CORS errors when calling API

**Solution:**
1. Check `/api/generate-pdf/route.ts` exists
2. Verify `documentType` matches your generator name
3. Check browser console for actual error

### Component not rendering

**Problem:** "use client" directive error

**Solution:**
```typescript
// Must be at the very top of file
"use client"

import { useState } from "react"
// ... rest of imports
```

### Validation too strict

**Problem:** Form won't submit with valid data

**Solution:** Check your Zod schema patterns:
```typescript
// Too strict - doesn't allow spaces
z.string().regex(/^[a-z]+$/)

// Better - allows spaces
z.string().regex(/^[a-z\s]+$/i)
```

---

## ✅ Implementation Checklist

Use this checklist to track your progress:

### Phase 1: Setup (15 min)
- [ ] Created `lib/[type]/types.ts`
- [ ] Created `lib/[type]/schema.ts`
- [ ] Created `lib/[type]/constants.ts` (if needed)
- [ ] All types exported

### Phase 2: Business Logic (20 min)
- [ ] Created `lib/[type]/calculations.ts` (if needed)
- [ ] Created `lib/hooks/use-[type]-form.ts`
- [ ] Form hook returns correct state
- [ ] Validation works

### Phase 3: UI Components (30 min)
- [ ] Created `components/documents/[type]/[type]-form.tsx`
- [ ] All form fields render
- [ ] Validation errors show
- [ ] Submit button works

### Phase 4: Pages (10 min)
- [ ] Created `app/[type]/page.tsx`
- [ ] Page loads without errors
- [ ] Form visible on page
- [ ] Navigation links work

### Phase 5: PDF Generation (20 min)
- [ ] Created `lib/services/generators/[type]-generator.ts`
- [ ] Generator class created
- [ ] HTML template complete
- [ ] PDF generation works

### Phase 6: Integration (10 min)
- [ ] Registered in `GeneratorFactory`
- [ ] Added to home page navigation
- [ ] End-to-end test passes
- [ ] PDF downloads correctly

**Total Time: 1-2 hours**

---

## 🎓 Learning Resources

- [Zod Documentation](https://zod.dev)
- [React Hooks](https://react.dev/reference/react/hooks)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Playwright Docs](https://playwright.dev)

---

**Next Step:** See [REFERENCE.md](REFERENCE.md) for any API/library lookups while implementing.

