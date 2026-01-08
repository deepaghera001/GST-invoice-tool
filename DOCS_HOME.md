# 📚 Documentation Home

> **Start here.** Everything you need to add new document types and understand the system.

---

## 🎯 Quick Navigation

**I want to...** | **Read this** | **Time**
---|---|---
Add a new document type | [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) | 30-120 min
Understand the architecture | [This page - Architecture](#-architecture-overview) | 15 min
Look up how to use something | [REFERENCE.md](REFERENCE.md) | 5-10 min
See a quick example | [Quick Start](#-quick-start-example) | 5 min
Check code standards | [This page - Standards](#-code-standards) | 10 min
Get productive immediately | [This page - 30 Min Path](#-30-minute-path) | 30 min

---

## ✨ 30-Minute Path

Get productive in half an hour:

1. **Read this page** (10 min)
2. **Skim [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) Steps 1-5** (10 min)
3. **Copy-paste from IMPLEMENTATION_GUIDE.md** (10 min)
4. **Run locally and test** ✅

---

## 🏗️ Architecture Overview

### System Design

```
User Input (Form - Left Side)          Live Preview (Right Side)
    ↓                                         ↓
React Hook (useDocumentForm)      DocumentPreview Component
    ├─ State Management                ├─ Real-time updates
    ├─ Zod Validation                  ├─ Professional layout
    └─ Calculations                    └─ Copy formData reactively
    ↓                                         ↓
Form Sections (Animated)           Render Document Preview
    ├─ Seller Details                        
    ├─ Buyer Details                   
    ├─ Items/Details                   
    └─ Tax Details                     
    ↓
Submit → API Route (/api/generate-pdf) → PDF Generation → Download
```

### Page Layout Pattern (MUST FOLLOW THIS)

```
┌─────────────────────────────────────────────────────────┐
│  Header (Logo + Back Button)                            │
└─────────────────────────────────────────────────────────┘
│                                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐  │
│  │   Form Left Side     │  │  Preview Right Side  │  │
│  │  (Animated Sections) │  │  (Real-time update)  │  │
│  │                      │  │                      │  │
│  │ - Section 1 (fade)   │  │ Live document        │  │
│  │ - Section 2 (slide)  │  │ preview showing      │  │
│  │ - Section 3 (fade)   │  │ how PDF will look    │  │
│  │ - Pricing box (fade) │  │                      │  │
│  │                      │  │                      │  │
│  │ [Download Button]    │  │                      │  │
│  └──────────────────────┘  └──────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Key Layers

| Layer | Purpose | Examples |
|-------|---------|----------|
| **Types** | Data definitions | `lib/invoice/types.ts` |
| **Validation** | Zod schemas | `lib/invoice/schema.ts` |
| **Business Logic** | Calculations | `lib/invoice/calculations.ts` |
| **Hooks** | State management | `lib/hooks/use-invoice-form.ts` |
| **Form Components** | UI form sections | `components/documents/invoice/form-sections/` |
| **Preview Component** | Live document preview | `components/documents/invoice/invoice-preview.tsx` |
| **Main Form** | Layout + integration | `components/documents/invoice/invoice-form.tsx` |
| **Pages** | Route handlers | `app/invoice/page.tsx` |
| **API** | PDF generation | `app/api/generate-pdf/route.ts` |

### Design Patterns Used

- **Factory Pattern** - PDF generators registered dynamically
- **Strategy Pattern** - Different generators for different document types
- **Custom Hooks** - Encapsulate form logic
- **Type Inference** - Zod schemas generate types automatically
- **2-Column Layout** - Form (left) + Preview (right) side-by-side
- **Real-time Sync** - Preview updates as user types
- **Animated Sections** - Fade-in/slide-in animations for better UX

---

## 📋 Code Standards

### Page Layout (MUST USE THIS STRUCTURE)

**All document type pages must follow this 2-column layout pattern:**

```typescript
// app/[documentType]/page.tsx
export default function DocumentTypePage() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* LEFT COLUMN: Form */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Create Your [Document Type]</h2>
          <p className="text-muted-foreground">Fill in details. Preview updates in real-time.</p>
        </div>

        {/* Pricing/Info Box */}
        <div className="space-y-6 p-6 border rounded-xl bg-card shadow-sm 
                        animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Info content */}
        </div>

        {/* Form with Sections */}
        <form className="space-y-6">
          {/* Each section animated */}
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-75">
            <Section1 />
          </div>
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-100">
            <Section2 />
          </div>
          {/* ... more sections with delay-150, delay-200 */}
          
          <Button>Generate PDF</Button>
        </form>
      </div>

      {/* RIGHT COLUMN: Live Preview */}
      <div>
        <DocumentPreview formData={formData} calculatedData={calculatedData} />
      </div>
    </div>
  )
}
```

### Form Section Pattern

```typescript
// Each form section component
export function SectionName({ 
  data, 
  errors, 
  onChange, 
  onBlur, 
  shouldShowError 
}) {
  return (
    <Card className="border-border/50 hover:border-primary/30 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          Section Title
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form fields */}
      </CardContent>
    </Card>
  )
}
```

### Styling & Animations

```typescript
// Animation delays for sections (increase for each)
delay-75, delay-100, delay-150, delay-200

// Cards styling
"border-border/50 hover:border-primary/30 transition-colors"
"animate-in fade-in slide-in-from-top-2 duration-200"

// Colors
primary = blue-600
muted-foreground = gray-600
card = white background
```

### Naming Conventions

```typescript
// Types/Interfaces - PascalCase
interface InvoiceData { }
type InvoiceValidationErrors = {}

// Files - kebab-case
invoice-form.tsx
use-invoice-form.ts
invoice-preview.tsx

// Variables/Functions - camelCase
const formData = {}
const handleChange = () => {}

// Components - PascalCase
function InvoiceForm() { }
function SellerDetails() { }

// Constants - UPPER_SNAKE_CASE
const GSTIN_REGEX = /pattern/
const DEFAULT_TAX_RATE = 18

// Form sections folder
components/documents/[type]/form-sections/
```

### File Organization (CORRECT STRUCTURE)

```
lib/[document-type]/
├── types.ts          ← Data interfaces
├── schema.ts         ← Zod validation
├── constants.ts      ← Constants & regexes
├── calculations.ts   ← Business logic
└── index.ts          ← Exports

lib/hooks/
└── use-[type]-form.ts    ← Form state hook

components/documents/[document-type]/
├── [type]-form.tsx           ← MAIN FORM (layout + sections)
├── [type]-preview.tsx        ← LIVE PREVIEW (right side)
└── form-sections/            ← Individual form sections
    ├── section-1.tsx
    ├── section-2.tsx
    └── section-3.tsx

app/[document-type]/
└── page.tsx          ← Page component (2-column layout)

lib/services/generators/
└── [type]-generator.ts   ← PDF generator
```

### Error Handling

```typescript
// ✅ Good - Explicit error handling
try {
  const result = await riskyOperation()
  toast.success("Success!")
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error"
  toast.error(message)
} finally {
  setIsLoading(false)
}

// ❌ Bad - Silent failures
const data = await riskyOperation()
```

### Validation Pattern

```typescript
// Real-time validation on blur
const handleBlur = (field) => {
  const error = validateField(field, formData[field])
  if (error) setErrors({ ...errors, [field]: error })
}

// Full form validation on submit
const handleSubmit = () => {
  if (!validateForm()) {
    toast.error("Please fix errors")
    return
  }
  // Process form
}
```

---

## 🎯 Quick Start Example

### Adding "Quotation" Document Type

#### Step 1: Create Types (5 min)
**File:** `lib/quotation/types.ts`
```typescript
export interface QuotationData {
  sellerName: string
  sellerAddress: string
  sellerGSTIN: string
  buyerName: string
  buyerAddress: string
  buyerGSTIN?: string
  documentNumber: string
  documentDate: string
  itemDescription: string
  quantity: string
  rate: string
  cgst: string
  sgst: string
  igst?: string
}

export interface QuotationTotals {
  subtotal: number
  cgstAmount: number
  sgstAmount: number
  igstAmount: number
  total: number
  isInterState: boolean
}
```

#### Step 2: Create Schema (5 min)
**File:** `lib/quotation/schema.ts`
```typescript
import { z } from "zod"
import { GSTIN_REGEX, TAX_RANGES } from "./constants"

export const quotationSchema = z.object({
  sellerName: z.string().min(2).max(200),
  sellerAddress: z.string().min(10).max(500),
  sellerGSTIN: z.string().regex(GSTIN_REGEX),
  buyerName: z.string().min(2).max(200),
  buyerAddress: z.string().min(10).max(500),
  buyerGSTIN: z.string().optional(),
  documentNumber: z.string().min(1).max(20),
  documentDate: z.string(),
  itemDescription: z.string().min(3),
  quantity: z.string().refine(v => Number(v) > 0),
  rate: z.string().refine(v => Number(v) > 0),
  cgst: z.string().refine(v => {
    const n = Number(v)
    return n >= TAX_RANGES.cgst.min && n <= TAX_RANGES.cgst.max
  }),
  sgst: z.string().refine(v => {
    const n = Number(v)
    return n >= TAX_RANGES.sgst.min && n <= TAX_RANGES.sgst.max
  }),
})

export const quotationFieldSchema = quotationSchema.partial()
export type QuotationFormData = z.infer<typeof quotationSchema>
```

#### Step 3: Create Hook (10 min)
**File:** `lib/hooks/use-quotation-form.ts`
```typescript
"use client"
import { useState, useCallback, useMemo } from "react"
import { quotationSchema } from "@/lib/quotation/schema"
import type { QuotationData } from "@/lib/quotation/types"

export function useQuotationForm() {
  const [formData, setFormData] = useState<QuotationData>({
    sellerName: "", sellerAddress: "", sellerGSTIN: "",
    buyerName: "", buyerAddress: "", buyerGSTIN: "",
    documentNumber: "", documentDate: "",
    itemDescription: "", quantity: "1", rate: "0",
    cgst: "9", sgst: "9", igst: ""
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(new Set())

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }, [errors])

  const handleBlur = useCallback((field) => {
    setTouched(prev => new Set(prev).add(field))
    try {
      quotationSchema.pick({ [field]: true }).parse({ [field]: formData[field] })
    } catch (error) {
      setErrors(prev => ({ ...prev, [field]: error.errors?.[0]?.message }))
    }
  }, [formData])

  const validateForm = useCallback(() => {
    try {
      quotationSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      return false
    }
  }, [formData])

  const totals = useMemo(() => {
    const qty = Number(formData.quantity) || 0
    const rate = Number(formData.rate) || 0
    const subtotal = qty * rate
    const cgst = (subtotal * Number(formData.cgst)) / 100
    const sgst = (subtotal * Number(formData.sgst)) / 100
    return { subtotal, cgstAmount: cgst, sgstAmount: sgst, total: subtotal + cgst + sgst }
  }, [formData])

  return {
    formData, errors, totals, handleChange, handleBlur, validateForm,
    shouldShowError: (field) => touched.has(field)
  }
}
```

#### Step 4: Create Form Component (10 min)
**File:** `components/documents/quotation/quotation-form.tsx`
```typescript
"use client"
import { useState } from "react"
import { useQuotationForm } from "@/lib/hooks/use-quotation-form"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"

export function QuotationForm() {
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const { formData, errors, shouldShowError, handleChange, handleBlur, validateForm } = useQuotationForm()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      toast({ title: "Error", description: "Please fix errors", variant: "destructive" })
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        body: JSON.stringify({ documentData: formData, documentType: "quotation" })
      })
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${formData.documentNumber}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast({ title: "Success", description: "PDF generated!" })
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-semibold mb-2">Seller Name</label>
        <input
          value={formData.sellerName}
          onChange={(e) => handleChange("sellerName", e.target.value)}
          onBlur={() => handleBlur("sellerName")}
          className="w-full px-3 py-2 border rounded"
        />
        {shouldShowError("sellerName") && errors.sellerName && (
          <span className="text-red-500 text-sm">{errors.sellerName}</span>
        )}
      </div>

      {/* Repeat for other fields... */}

      <Button type="submit" disabled={isProcessing}>
        {isProcessing ? (
          <><Loader2 className="animate-spin mr-2" />Generating...</>
        ) : (
          <><Download className="mr-2" />Generate PDF</>
        )}
      </Button>
    </form>
  )
}
```

#### Step 5: Create Page (5 min)
**File:** `app/quotation/page.tsx`
```typescript
import { QuotationForm } from "@/components/documents/quotation/quotation-form"
import Link from "next/link"

export default function QuotationPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <Link href="/" className="font-bold">DocGen</Link>
          <Link href="/" className="text-blue-600">← Back</Link>
        </div>
      </header>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-bold mb-2">Create Quotation</h2>
          <p className="text-gray-600 mb-8">Fill in details and generate your quotation</p>
          <QuotationForm />
        </div>
      </section>
    </div>
  )
}
```

#### Step 6: Register in Factory (2 min)
**File:** `lib/services/generators/generator-factory.ts`
```typescript
import { QuotationGenerator } from "./quotation-generator"

export class GeneratorFactory {
  private static generators: PDFGenerator[] = []

  static {
    this.register(new DOMHTMLGenerator())
    this.register(new QuotationGenerator()) // ← ADD THIS
  }
  // ... rest of code
}
```

**Done!** Your quotation document type is ready. 🎉

---

## 🔍 Common Questions

<details>
<summary><b>Q: Where do I put business logic?</b></summary>

Create a calculations class in `lib/[type]/calculations.ts`:

```typescript
export class QuotationCalculations {
  static calculateTotals(data: QuotationData): QuotationTotals {
    const subtotal = Number(data.quantity) * Number(data.rate)
    const cgst = (subtotal * Number(data.cgst)) / 100
    const sgst = (subtotal * Number(data.sgst)) / 100
    return { subtotal, cgstAmount: cgst, sgstAmount: sgst, total: subtotal + cgst + sgst, isInterState: false }
  }
}
```

Then use in your hook:
```typescript
const totals = useMemo(
  () => QuotationCalculations.calculateTotals(formData),
  [formData]
)
```
</details>

<details>
<summary><b>Q: How do I validate forms?</b></summary>

Use Zod schemas:

```typescript
// Validate single field
const handleBlur = (field) => {
  try {
    schema.pick({ [field]: true }).parse({ [field]: value })
    // Valid - clear error
  } catch (error) {
    // Invalid - show error
  }
}

// Validate entire form
const validateForm = () => {
  try {
    schema.parse(formData)
    return true
  } catch (error) {
    return false
  }
}
```

See [REFERENCE.md](REFERENCE.md#-validation-with-zod) for more.
</details>

<details>
<summary><b>Q: How do I generate PDFs?</b></summary>

The API route `/api/generate-pdf` already handles it. Just call:

```typescript
const response = await fetch("/api/generate-pdf", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    documentData: formData,
    documentType: "quotation" // Must match your document type
  })
})

const blob = await response.blob()
// Download blob as file
```

See [REFERENCE.md](REFERENCE.md#-pdf-generation) for details.
</details>

<details>
<summary><b>Q: What libraries do I need?</b></summary>

Main libraries (already installed):
- **React** - UI framework
- **TypeScript** - Type safety
- **Zod** - Validation
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Lucide React** - Icons

See [REFERENCE.md](REFERENCE.md#-libraries) for complete reference.
</details>

<details>
<summary><b>Q: Where is the invoice implementation I can copy from?</b></summary>

Reference files:
- Types: `lib/invoice/types.ts`
- Schema: `lib/invoice/schema.ts`
- Hook: `lib/hooks/use-invoice-form.ts`
- Components: `components/documents/invoice/`
- Page: `app/invoice/page.tsx`

Use these as templates when creating your document type.
</details>

<details>
<summary><b>Q: What are the main files I need to create?</b></summary>

For each document type, create:
```
✅ lib/[type]/types.ts
✅ lib/[type]/schema.ts
✅ lib/[type]/constants.ts (if needed)
✅ lib/hooks/use-[type]-form.ts
✅ components/documents/[type]/[type]-form.tsx
✅ components/documents/[type]/[type]-preview.tsx (optional)
✅ components/documents/[type]/form-sections/ (individual sections)
✅ app/[type]/page.tsx
✅ lib/services/generators/[type]-generator.ts
✅ Update lib/services/generators/generator-factory.ts
```

Total: ~10-15 files per document type
</details>

---

## 📚 Documentation Files

Only **3 files** to reference:

| File | Contains | When to Use |
|------|----------|-------------|
| **[DOCS_HOME.md](DOCS_HOME.md)** | This page - Quick answers & overview | Everything starts here |
| **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** | Step-by-step with full code examples | Adding new document type |
| **[REFERENCE.md](REFERENCE.md)** | All libraries & utilities reference | Looking up how to do something |

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Get this doc | 5 min |
| Understand architecture | 10 min |
| Add new document type | 1-2 hours |
| Master the system | 3-4 hours |
| Find specific answer | 5 min |

---

## 🚀 Next Steps

1. **For quick start:** Copy code from [Quick Start Example](#-quick-start-example) above
2. **For detailed guide:** Open [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
3. **For any reference:** Check [REFERENCE.md](REFERENCE.md)
4. **For checklists:** See [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md#-implementation-checklist)

---

## ✅ You're Ready!

You now have everything needed to:
- ✅ Add new document types
- ✅ Understand the architecture
- ✅ Follow code standards
- ✅ Reference any library/utility
- ✅ Troubleshoot issues

**Start with [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for the complete walkthrough.**

