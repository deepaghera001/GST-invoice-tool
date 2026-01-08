# 🚀 Quick Start: Adding a New Document Type

**Time:** 3-4 hours | **Difficulty:** Intermediate

---

## ⚡ 30-Second Overview

You're going to create a new document type (e.g., Bill of Supply) by:

1. **Defining the data shape** (types.ts)
2. **Creating validation** (schema.ts)
3. **Adding calculations** (calculations.ts, constants.ts)
4. **Building the form hook** (use-type-form.ts)
5. **Creating the 2-column form** (LEFT: form with animations, RIGHT: live preview) ⭐
6. **Making form sections** (seller, buyer, items, tax, etc.)
7. **Creating the preview** (shows PDF in real-time)
8. **Generating PDFs** (HTML template)
9. **Registering in factory** (so API knows about it)
10. **Adding to homepage** (navigation link)

---

## 📖 Before You Start

### Read These (15 minutes)
1. [PATTERN_ARCHITECTURE.md](PATTERN_ARCHITECTURE.md) - See the layout visually (5 min)
2. [DOCS_HOME.md](DOCS_HOME.md) - Understand the architecture (5 min)
3. Look at [app/invoice/page.tsx](app/invoice/page.tsx) - Reference example (5 min)

### Copy These
- [components/documents/invoice/invoice-form.tsx](components/documents/invoice/invoice-form.tsx) - Form structure
- [components/documents/invoice/invoice-preview.tsx](components/documents/invoice/invoice-preview.tsx) - Preview structure
- [lib/invoice/](lib/invoice/) - Types, schema, calculations

---

## 🎯 The One Rule

> **Form on left (animated sections) + Preview on right (real-time sync)**

```typescript
<div className="grid lg:grid-cols-2 gap-8">
  <div>{/* Form sections with animations */}</div>
  <div>{/* Preview component */}</div>
</div>
```

If you forget this, your document will look nothing like the invoice page.

---

## ⚙️ 10 Steps to Victory

### Step 1: Create Types (10 min)
```bash
touch lib/[type]/types.ts
```

**Minimal content:**
```typescript
export interface [Type]Data {
  // Copy field names from invoice, rename as needed
  sellerName: string
  buyerName: string
  items: Item[]
  taxRate: string
}

export interface Item {
  description: string
  quantity: string
  rate: string
}

export interface [Type]Totals {
  subtotal: number
  tax: number
  total: number
}
```

**Check:** TypeScript shows no errors ✓

---

### Step 2: Create Schema (15 min)
```bash
touch lib/[type]/schema.ts
```

**Copy from:** [lib/invoice/schema.ts](lib/invoice/schema.ts)

Just change:
- Field names
- Validation messages
- Cross-field checks (if needed)

**Check:** `z.infer` exports correct type ✓

---

### Step 3: Create Constants & Calculations (15 min)
```bash
touch lib/[type]/constants.ts lib/[type]/calculations.ts
```

**constants.ts:** Copy GSTIN regex, add any new constants

**calculations.ts:** Add calculation functions
```typescript
export function calculateTotals(items, taxRate) {
  const subtotal = items.reduce(...) // sum
  const tax = subtotal * (Number(taxRate) / 100)
  return { subtotal, tax, total: subtotal + tax }
}
```

**Check:** Functions return expected values ✓

---

### Step 4: Create Hook (30 min)
```bash
touch lib/hooks/use-[type]-form.ts
```

**Copy from:** [lib/hooks/use-invoice-form.ts](lib/hooks/use-invoice-form.ts)

Change:
- Import statements (types, schema)
- DEFAULT_FORM_DATA fields
- Calculation imports

**Check:** Form state works, validation works ✓

---

### Step 5: Create 2-Column Form (45 min) ⭐ CRITICAL
```bash
mkdir -p components/documents/[type]/form-sections
touch components/documents/[type]/[type]-form.tsx
```

**Copy from:** [components/documents/invoice/invoice-form.tsx](components/documents/invoice/invoice-form.tsx)

**MUST have:**
- `grid lg:grid-cols-2 gap-8` layout
- Left: Form sections
- Right: Preview component
- Each section animated: `delay-75`, `delay-150`, etc.

```typescript
export function [Type]Form() {
  const { formData, calculatedData, ... } = use[Type]Form()

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        {/* Form sections with animations */}
      </div>
      <div className="sticky top-8 h-fit">
        <[Type]Preview formData={formData} calculatedData={calculatedData} />
      </div>
    </div>
  )
}
```

**Check:** 2-column layout renders, animations work ✓

---

### Step 6: Create Form Sections (45 min)
```bash
touch components/documents/[type]/form-sections/{seller,buyer,items,tax}-details.tsx
```

**Copy from:** [components/documents/invoice/form-sections/](components/documents/invoice/form-sections/)

**Pattern for each:**
```typescript
export function SellerDetailsSection({ data, errors, onChange, onBlur, shouldShowError }) {
  return (
    <Card className="border-border/50 hover:border-primary/30 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BuildingIcon className="h-5 w-5 text-primary" />
          Your Company (Seller) Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField label="Name" value={data.sellerName} onChange={...} />
        <FormField label="Address" value={data.sellerAddress} onChange={...} />
        <FormField label="GSTIN" value={data.sellerGSTIN} onChange={...} />
      </CardContent>
    </Card>
  )
}
```

**Check:** All fields render, validation works ✓

---

### Step 7: Create Preview (30 min)
```bash
touch components/documents/[type]/[type]-preview.tsx
```

**Copy from:** [components/documents/invoice/invoice-preview.tsx](components/documents/invoice/invoice-preview.tsx)

**Must include:**
- Header (title, date, number)
- From/To (seller/buyer info)
- Items table
- Totals section

```typescript
export function [Type]Preview({ formData, calculatedData }) {
  return (
    <div className="border rounded-lg bg-white p-6 shadow-sm space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">{formData.documentNumber}</h2>
        <p className="text-sm text-muted-foreground">{formData.documentDate}</p>
      </div>
      
      {/* Seller, Buyer, Items, Totals */}
    </div>
  )
}
```

**Check:** Preview shows all data, updates in real-time ✓

---

### Step 8: Create PDF Generator (20 min)
```bash
touch lib/services/generators/[type]-generator.ts
```

**Copy from:** [lib/services/generators/invoice-generator.ts](lib/services/generators/invoice-generator.ts)

Create HTML template with all document details.

**Check:** PDF generates without errors ✓

---

### Step 9: Register in Factory (5 min)

**File:** [lib/services/generators/generator-factory.ts](lib/services/generators/generator-factory.ts)

Add:
```typescript
import { [Type]Generator } from './[type]-generator'
import type { [Type]FormData } from '@/lib/[type]/schema'

// In the factory:
case 'type':
  return new [Type]Generator() as PDFGenerator<[Type]FormData>
```

**Check:** No TypeScript errors ✓

---

### Step 10: Add to Home Page (5 min)

**File:** [app/page.tsx](app/page.tsx)

Add to `DOCUMENTS` array:
```typescript
{
  title: "[Document Type]",
  description: "Create professional [document type]",
  icon: DocumentIcon,
  href: "/[type]"
}
```

Create page file:
```bash
mkdir -p app/[type]
```

**[type]/page.tsx:**
```typescript
import { [Type]Form } from "@/components/documents/[type]/[type]-form"

export const metadata = { title: "Create [Type] | DocGen" }

export default function [Type]Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b bg-white">
        {/* Copy from invoice page */}
      </header>
      <main className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <[Type]Form />
        </div>
      </main>
      <footer className="border-t mt-12 py-6 bg-white">
        {/* Copy footer */}
      </footer>
    </div>
  )
}
```

**Check:** Link appears on home page, navigation works ✓

---

## 🧪 Test Your Work (20 min)

### Form Testing
- [ ] All fields accept input
- [ ] Validation shows errors
- [ ] Preview updates as you type

### Layout Testing
- [ ] Form on left, preview on right
- [ ] Animations run smoothly
- [ ] Responsive on mobile

### PDF Testing
- [ ] Download button works
- [ ] PDF has all data
- [ ] PDF looks professional

### Build Testing
```bash
npm run build
```
- [ ] No errors
- [ ] No warnings

---

## 🎨 The Layout (Must Match Invoice)

```
┌─────────────────────────────────────────────┐
│ FORM (LEFT)          │ PREVIEW (RIGHT)      │
├─────────────────────────────────────────────┤
│ Title (h2)           │                      │
│ [animate-in delay-0] │ ┌──────────────────┐│
│ ┌─────────────────┐  │ │  PDF Preview     ││
│ │ Info Box        │  │ │  sticky top-8    ││
│ │ (info)          │  │ │  h-fit           ││
│ └─────────────────┘  │ │  Updates         ││
│                      │ │  real-time       ││
│ [animate-in delay-75]│ │                  ││
│ ┌─────────────────┐  │ └──────────────────┘│
│ │ Seller Details  │  │                      │
│ └─────────────────┘  │                      │
│                      │                      │
│ [animate-in delay-150]                     │
│ ┌─────────────────┐  │                      │
│ │ Buyer Details   │  │                      │
│ └─────────────────┘  │                      │
│                      │                      │
│ [animate-in delay-225]                     │
│ ┌─────────────────┐  │                      │
│ │ Items           │  │                      │
│ └─────────────────┘  │                      │
│                      │                      │
│ [animate-in delay-300]                     │
│ ┌─────────────────┐  │                      │
│ │ Tax/Totals      │  │                      │
│ └─────────────────┘  │                      │
│                      │                      │
│ [animate-in delay-375]                     │
│ ┌─────────────────┐  │                      │
│ │ Download Button │  │                      │
│ │ w-full h-12     │  │                      │
│ └─────────────────┘  │                      │
└─────────────────────────────────────────────┘
```

---

## 📖 When Stuck

| Problem | Solution |
|---------|----------|
| Don't know what fields to include | Copy from invoice, modify as needed |
| 2-column layout not working | Use `grid lg:grid-cols-2 gap-8` |
| Animations not running | Use `animate-in fade-in slide-in-from-top-2 duration-200 delay-[XX]` |
| Preview not updating | Make sure component receives formData prop |
| PDF not generating | Check HTML template in generator |
| Type errors | Make sure schema.ts types are exported |

---

## ✅ Deployment Checklist

- [ ] All 10 steps completed
- [ ] npm run build succeeds
- [ ] Form renders correctly
- [ ] Preview updates in real-time
- [ ] PDF generates
- [ ] Mobile responsive
- [ ] Animations smooth
- [ ] Navigation link works
- [ ] No TypeScript errors
- [ ] Design matches invoice page

---

## 🎉 You're Done!

Congratulations! You've created a beautiful, professional document type that matches all other document types in the system.

**What you created:**
- ✅ Type-safe form with validation
- ✅ Real-time PDF preview
- ✅ Smooth animations
- ✅ PDF generation
- ✅ Professional UI/UX
- ✅ Mobile responsive

**Time spent:** ~3-4 hours  
**Complexity:** Medium  
**Result:** Beautiful, consistent document type 🚀

---

## 📚 Full Reference

- [DOCS_HOME.md](DOCS_HOME.md) - Architecture
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Detailed steps
- [REFERENCE.md](REFERENCE.md) - Code patterns
- [PATTERN_ARCHITECTURE.md](PATTERN_ARCHITECTURE.md) - Visual guide
- [NEW_DOCUMENT_CHECKLIST.md](NEW_DOCUMENT_CHECKLIST.md) - Full checklist
- [Invoice page](app/invoice/page.tsx) - Working example

---

**Ready? Start with Step 1! 🚀**
