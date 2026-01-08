# 🔍 Reference Guide

Quick lookup for libraries, patterns, and code snippets. **Use this when implementing.**

---

## 📚 Quick Links

**I need to...** | **See section**
---|---
Validate form input | [Validation with Zod](#-validation-with-zod)
Create a React component | [React Patterns](#-react-patterns)
Build 2-column layout | [2-Column Layout & Preview Components](#-2-column-layout--preview-components)
Create preview component | [Preview Component Pattern](#preview-component-pattern)
Handle form state | [Form State Management](#-form-state-management)
Generate PDF | [PDF Generation](#-pdf-generation)
Use utility functions | [Common Utilities](#-common-utilities)
Understand file structure | [Project File Structure](#-project-file-structure)

---

## 🛡️ Validation with Zod

### Basic String Validation

```typescript
import { z } from "zod"

const schema = z.object({
  // Required string
  name: z.string().min(2).max(100),
  
  // Optional string
  middleName: z.string().optional(),
  
  // String or empty
  nickname: z.string().optional().or(z.literal("")),
  
  // Specific pattern
  email: z.string().email(),
  
  // Custom regex
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  
  // Choose from options
  country: z.enum(["India", "USA", "UK"]),
})
```

### Number Validation

```typescript
const schema = z.object({
  // Integer
  quantity: z.number().int().positive(),
  
  // Float
  price: z.number().positive(),
  
  // Range
  rating: z.number().min(0).max(5),
})
```

### Date Validation

```typescript
const schema = z.object({
  // ISO date string
  invoiceDate: z.string().refine(
    v => !isNaN(Date.parse(v)),
    "Invalid date format"
  ),
  
  // Date object
  dateObj: z.date(),
})
```

### Array Validation

```typescript
const schema = z.object({
  // Array with min items
  items: z.array(z.object({
    name: z.string(),
    qty: z.number().positive(),
  })).min(1, "At least one item required"),
  
  // Optional array
  tags: z.array(z.string()).optional(),
})
```

### Cross-Field Validation

```typescript
const schema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  isBusiness: z.boolean(),
  gstNumber: z.string().optional(),
}).refine(
  (data) => new Date(data.startDate) < new Date(data.endDate),
  { message: "End date must be after start date", path: ["endDate"] }
).refine(
  (data) => !data.isBusiness || data.gstNumber,
  { message: "GST required for business", path: ["gstNumber"] }
)
```

### Using Schema in Hook

```typescript
// Validate single field
const handleBlur = (field: string, value: any) => {
  try {
    schema.pick({ [field]: true }).parse({ [field]: value })
    // Valid
  } catch (error) {
    if (error instanceof z.ZodError) {
      setError(field, error.errors[0].message)
    }
  }
}

// Validate entire form
const handleSubmit = () => {
  try {
    const validated = schema.parse(formData)
    // Proceed with validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = {}
      error.errors.forEach(err => {
        const path = err.path.join(".")
        errors[path] = err.message
      })
      setErrors(errors)
    }
  }
}

// Generate type from schema
type FormData = z.infer<typeof schema>
```

### Common Validation Patterns

```typescript
// GSTIN (Indian Tax ID)
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
z.string().regex(GSTIN_REGEX, "Invalid GSTIN format")

// PAN (Permanent Account Number)
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
z.string().regex(PAN_REGEX, "Invalid PAN format")

// Phone
z.string().regex(/^[0-9]{10}$/, "Must be 10 digits")

// Percentage
z.string().refine(v => {
  const n = Number(v)
  return n >= 0 && n <= 100
}, "Must be between 0-100")

// URL
z.string().url()

// Email
z.string().email()

// Positive number
z.string().refine(v => Number(v) > 0, "Must be positive")

// Integer
z.string().refine(v => Number.isInteger(Number(v)), "Must be integer")
```

---

## ⚛️ React Patterns

### useState for Form Data

```typescript
const [formData, setFormData] = useState({
  name: "",
  email: "",
  items: [],
})

const handleChange = (field, value) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }))
}

// Nested update
const handleNestedChange = (field, index, nestedField, value) => {
  setFormData(prev => ({
    ...prev,
    [field]: prev[field].map((item, i) => 
      i === index ? { ...item, [nestedField]: value } : item
    )
  }))
}
```

### useMemo for Calculations

```typescript
const totals = useMemo(() => {
  let subtotal = 0
  formData.items.forEach(item => {
    subtotal += Number(item.qty) * Number(item.price)
  })
  return {
    subtotal,
    tax: subtotal * 0.18,
    total: subtotal * 1.18
  }
}, [formData.items])
```

### useCallback for Event Handlers

```typescript
const handleChange = useCallback((field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }))
}, [])

const handleBlur = useCallback((field) => {
  validateField(field)
}, [])
```

### Custom Hook Pattern

```typescript
export function useMyFeature() {
  const [state, setState] = useState(INITIAL)
  
  const handleEvent = useCallback(() => {
    // Logic
  }, [state])
  
  return {
    state,
    handleEvent,
    // ... other methods
  }
}

// Usage
function MyComponent() {
  const { state, handleEvent } = useMyFeature()
  return <div>{state}</div>
}
```

### Conditional Rendering

```typescript
// Ternary
{isLoading ? <Spinner /> : <Content />}

// Short-circuit &&
{errors.name && <span className="error">{errors.name}</span>}

// Element variable
const element = isAdmin ? <AdminPanel /> : <UserPanel />
return <div>{element}</div>
```

---

## 🎨 2-Column Layout & Preview Components

### Critical: 2-Column Layout Pattern

**Every document type page MUST follow this layout pattern** (form left + preview right):

```typescript
// components/documents/[type]/[type]-form.tsx
export function DocumentTypeForm() {
  const { formData, calculatedData, ... } = useDocumentTypeForm()

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* LEFT COLUMN: Form */}
      <div className="space-y-6">
        {/* Sections with animations */}
      </div>
      
      {/* RIGHT COLUMN: Preview */}
      <div className="sticky top-8 h-fit">
        <DocumentTypePreview 
          formData={formData} 
          calculatedData={calculatedData}
        />
      </div>
    </div>
  )
}
```

**Key CSS Classes:**
- `lg:grid-cols-2` = 2 columns on large screens
- `gap-8` = 32px gap between columns
- `sticky top-8` = Preview sticks to top when scrolling
- `h-fit` = Preview adjusts height to content

### Form Section Animation Pattern

Each form section in the left column must have staggered animations:

```typescript
// Increasing delays for cascade effect
<div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-75">
  <Section1 />
</div>

<div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-150">
  <Section2 />
</div>

<div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-225">
  <Section3 />
</div>

<div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-300">
  <Section4 />
</div>
```

**Delay Sequence:** 75ms, 150ms, 225ms, 300ms, 375ms, 450ms

**Animation Classes:**
- `animate-in` = Enable animation
- `fade-in` = Opacity fade
- `slide-in-from-top-2` = Slide down 8px
- `duration-200` = 200ms animation
- `delay-[XX]` = Start delay in milliseconds

### Preview Component Pattern

```typescript
// components/documents/[type]/[type]-preview.tsx
"use client"

import type { DocumentTypeFormData, DocumentTypeCalculations } from "@/lib/[type]/types"

interface DocumentTypePreviewProps {
  formData: DocumentTypeFormData
  calculatedData: DocumentTypeCalculations
}

export function DocumentTypePreview({ 
  formData, 
  calculatedData 
}: DocumentTypePreviewProps) {
  // Render preview based on formData
  return (
    <div className="border rounded-lg bg-white p-6 shadow-sm">
      {/* PDF Preview Content */}
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold">{formData.documentNumber}</h2>
          <p className="text-sm text-muted-foreground">{formData.documentDate}</p>
        </div>

        {/* Seller Info */}
        <div>
          <h3 className="font-semibold mb-2">From</h3>
          <p className="text-sm">{formData.sellerName}</p>
          <p className="text-sm text-muted-foreground">{formData.sellerAddress}</p>
        </div>

        {/* Buyer Info */}
        <div>
          <h3 className="font-semibold mb-2">To</h3>
          <p className="text-sm">{formData.buyerName}</p>
          <p className="text-sm text-muted-foreground">{formData.buyerAddress}</p>
        </div>

        {/* Items Table */}
        <div>
          <h3 className="font-semibold mb-2">Items</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Rate</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2">{item.description}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">₹{item.rate}</td>
                  <td className="text-right">
                    ₹{(Number(item.quantity) * Number(item.rate)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{calculatedData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({formData.taxRate}%)</span>
            <span>₹{calculatedData.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{calculatedData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Key Points:**
- ✅ Accepts `formData` and `calculatedData` as props
- ✅ Updates in real-time as form changes
- ✅ Shows calculated totals dynamically
- ✅ Styled to look like a real PDF preview
- ✅ Responsive and clean layout

### Complete Example: 2-Column Form

```typescript
// components/documents/quotation/quotation-form.tsx
"use client"

import { useQuotationForm } from "@/lib/hooks/use-quotation-form"
import { QuotationPreview } from "./quotation-preview"
import { SellerDetailsSection } from "./form-sections/seller-details"
import { BuyerDetailsSection } from "./form-sections/buyer-details"
import { ItemsSection } from "./form-sections/items"
import { TaxSection } from "./form-sections/tax"
import { Button } from "@/components/ui/button"

export function QuotationForm() {
  const { formData, errors, calculatedData, handleChange, handleBlur, handleSubmit, shouldShowError } = useQuotationForm()

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* LEFT: Form */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Create Quotation</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-75">
            <SellerDetailsSection {...props} />
          </div>
          
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-150">
            <BuyerDetailsSection {...props} />
          </div>
          
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-225">
            <ItemsSection {...props} />
          </div>
          
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-300">
            <TaxSection {...props} />
          </div>
          
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-375">
            <Button type="submit" className="w-full">
              Download Quotation PDF
            </Button>
          </div>
        </form>
      </div>
      
      {/* RIGHT: Preview */}
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

---

## 📝 Form State Management

### Basic Hook Setup

```typescript
"use client"

import { useState, useCallback } from "react"
import { formSchema } from "@/lib/schema"
import type { FormData } from "@/lib/schema"

export function useFormHook() {
  const [formData, setFormData] = useState<FormData>(DEFAULT_DATA)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  const handleChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev }
        delete copy[field]
        return copy
      })
    }
  }, [errors])

  const handleBlur = useCallback((field: string) => {
    setTouched(prev => new Set(prev).add(field))
    // Validate field
    try {
      formSchema.pick({ [field]: true }).parse({ [field]: formData[field] })
    } catch (error) {
      if (error instanceof Error) {
        setErrors(prev => ({ ...prev, [field]: error.message }))
      }
    }
  }, [formData])

  const validateForm = useCallback(() => {
    try {
      formSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof Error && "errors" in error) {
        const newErrors: Record<string, string> = {}
        ;(error as any).errors.forEach((err: any) => {
          newErrors[err.path.join(".")] = err.message
        })
        setErrors(newErrors)
      }
      return false
    }
  }, [formData])

  const shouldShowError = useCallback((field: string) => {
    return touched.has(field) && !!errors[field]
  }, [touched, errors])

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    shouldShowError,
    getError: (field: string) => shouldShowError(field) ? errors[field] : undefined,
  }
}
```

### Form Component Template

```typescript
"use client"

export function MyForm() {
  const { formData, errors, handleChange, handleBlur, handleSubmit, shouldShowError } = useMyForm()

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSubmit(async (data) => {
        // Process data
      })
    }}>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Field Name</label>
        <input
          value={formData.fieldName}
          onChange={(e) => handleChange("fieldName", e.target.value)}
          onBlur={() => handleBlur("fieldName")}
          className={`w-full px-3 py-2 border rounded ${
            shouldShowError("fieldName") ? "border-red-500" : ""
          }`}
        />
        {shouldShowError("fieldName") && (
          <span className="text-red-500 text-sm">{errors.fieldName}</span>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  )
}
```

---

## 📄 PDF Generation

### API Route Template

```typescript
// app/api/generate-pdf/route.ts
import { DocumentService } from "@/lib/services/document-service"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { documentType, documentData } = await request.json()

    if (!documentType || !documentData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const service = new DocumentService()
    const pdfBuffer = await service.generatePDF(documentType, documentData)

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="document.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PDF generation failed" },
      { status: 500 }
    )
  }
}
```

### Client-Side PDF Download

```typescript
const handleGeneratePDF = async (formData) => {
  try {
    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentType: "invoice",
        documentData: formData
      })
    })

    if (!response.ok) throw new Error("Failed to generate PDF")

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoice-${formData.number}.pdf`
    a.click()
    URL.revokeObjectURL(url)

    toast({ title: "Success", description: "PDF generated!" })
  } catch (error) {
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive"
    })
  }
}
```

### HTML Template for PDF

```typescript
const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
      * { margin: 0; padding: 0; }
      body { font-family: Arial; padding: 40px; color: #333; }
      .header { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
      .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f0f0f0; font-weight: bold; }
      .total { text-align: right; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="header">Invoice</div>
    <div class="details">
      <div><strong>From:</strong><br/>${sellerName}</div>
      <div><strong>To:</strong><br/>${buyerName}</div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>₹${item.rate}</td>
            <td>₹${item.qty * item.rate}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    <div class="total">Total: ₹${total}</div>
  </body>
  </html>
`
```

---

## 🛠️ Common Utilities

### Number Formatting

```typescript
// Format as currency
const formatCurrency = (num: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(num)
}

formatCurrency(1000) // "₹1,000.00"

// Format with decimals
const formatDecimal = (num: number, decimals = 2) => {
  return num.toFixed(decimals)
}

// Format as percentage
const formatPercent = (num: number) => {
  return `${num.toFixed(2)}%`
}
```

### Date Formatting

```typescript
// Format date
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
}

formatDate("2024-01-15") // "15/01/2024"

// Get today's date as string
const getTodayString = () => {
  const today = new Date()
  return today.toISOString().split("T")[0]
}

// Add days
const addDays = (dateStr: string, days: number) => {
  const date = new Date(dateStr)
  date.setDate(date.getDate() + days)
  return date.toISOString().split("T")[0]
}
```

### String Utilities

```typescript
// Capitalize
const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Trim whitespace
const trim = (str: string) => str.trim()

// Remove special characters
const removeSpecial = (str: string) => {
  return str.replace(/[^a-zA-Z0-9\s]/g, "")
}

// Check if valid email
const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
```

### Array Utilities

```typescript
// Remove duplicates
const unique = (arr: any[]) => [...new Set(arr)]

// Group by key
const groupBy = (arr: any[], key: string) => {
  return arr.reduce((acc, obj) => {
    const k = obj[key]
    if (!acc[k]) acc[k] = []
    acc[k].push(obj)
    return acc
  }, {})
}

// Sum by key
const sumBy = (arr: any[], key: string) => {
  return arr.reduce((sum, obj) => sum + Number(obj[key]), 0)
}
```

---

## 📂 Project File Structure

### Directory Organization

```
pdf-generation-tool/
├── app/                          # Next.js app router
│   ├── [document-type]/
│   │   └── page.tsx              # Document type page
│   ├── api/
│   │   └── generate-pdf/
│   │       └── route.ts          # PDF generation API
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
│
├── lib/                          # Business logic
│   ├── [document-type]/          # Per-document-type logic
│   │   ├── types.ts              # Type definitions
│   │   ├── schema.ts             # Zod validation
│   │   ├── constants.ts          # Constants & regex
│   │   ├── calculations.ts       # Business logic
│   │   └── index.ts              # Exports
│   ├── hooks/                    # Custom React hooks
│   │   └── use-[type]-form.ts
│   ├── services/                 # Services
│   │   ├── document-service.ts   # Main service
│   │   └── generators/
│   │       ├── types.ts
│   │       ├── [type]-generator.ts
│   │       └── generator-factory.ts
│   ├── utils/                    # Utility functions
│   │   ├── formatters.ts
│   │   ├── invoice-calculator.ts
│   │   └── number-to-words.ts
│   ├── validation/               # Shared validation
│   │   └── index.ts
│   └── types.ts                  # Global types
│
├── components/                   # React components
│   ├── documents/[type]/         # Document-specific components
│   │   ├── [type]-form.tsx       # Main form
│   │   ├── [type]-preview.tsx    # Preview
│   │   └── form-sections/        # Individual sections
│   └── ui/                       # Shared UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── ...
│
├── styles/
│   └── globals.css
│
├── public/
│   └── (static files)
│
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

### File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `InvoiceForm.tsx` |
| Pages | kebab-case | `invoice-form.tsx` |
| Hooks | `use-` prefix | `use-invoice-form.ts` |
| Utils | camelCase | `formatCurrency.ts` |
| Types/Interfaces | PascalCase | `InvoiceData.ts` |
| Constants | UPPER_SNAKE_CASE | `GSTIN_REGEX` |
| Classes | PascalCase | `DocumentService` |

---

## 📚 Libraries Reference

### React & Next.js

```typescript
import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
```

### Zod

```typescript
import { z } from "zod"

const schema = z.object({
  field: z.string().min(2)
})

type Data = z.infer<typeof schema>
```

### Radix UI (if using custom components)

```typescript
import * as Dialog from "@radix-ui/react-dialog"
import * as Select from "@radix-ui/react-select"
```

### Tailwind CSS

```typescript
// Class names
className="w-full px-3 py-2 border rounded bg-blue-600 hover:bg-blue-700"

// Responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Conditional
className={`px-3 py-2 ${isError ? 'border-red-500' : 'border-gray-300'}`}
```

### Lucide Icons

```typescript
import { Download, Loader2, Save, Trash2, Plus, ArrowLeft } from "lucide-react"

<Download className="w-4 h-4" />
```

---

## 🔗 Common API Patterns

### Fetch with Error Handling

```typescript
const response = await fetch("/api/endpoint", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
})

if (!response.ok) throw new Error(`HTTP ${response.status}`)

const result = await response.json()
```

### Form Submission

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!validateForm()) {
    toast.error("Please fix errors")
    return
  }

  setIsLoading(true)
  try {
    const response = await fetch("/api/submit", {
      method: "POST",
      body: JSON.stringify(formData)
    })
    
    if (!response.ok) throw new Error("Failed to submit")
    
    toast.success("Submitted successfully!")
  } catch (error) {
    toast.error(error.message)
  } finally {
    setIsLoading(false)
  }
}
```

---

## ⚙️ Configuration Files

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 🚀 Performance Tips

### Memoization

```typescript
// Memoize component to prevent re-renders
const FormSection = React.memo(function FormSection({ data, onChange }) {
  return <div>...</div>
})

// Memoize callback to prevent re-creation
const handleChange = useCallback((field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }))
}, [])

// Memoize computed value
const total = useMemo(() => calculate(items), [items])
```

### Lazy Loading

```typescript
import dynamic from "next/dynamic"

const HeavyComponent = dynamic(() => import("@/components/heavy"), {
  loading: () => <Spinner />
})
```

---

**See [DOCS_HOME.md](DOCS_HOME.md) for index. See [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for step-by-step.**
