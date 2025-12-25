# 🏗️ Document Type Architecture Pattern (MANDATORY)

**This is the REQUIRED pattern for ALL document types. No exceptions.**

---

## 📐 Page Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Header: Logo + Title + Back Button                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Grid Layout: lg:grid-cols-2 gap-8                                     │
│  ┌──────────────────────────┬──────────────────────────┐               │
│  │ LEFT: Form               │ RIGHT: Preview           │               │
│  │ ════════════════════════ │ ════════════════════════ │               │
│  │                          │                          │               │
│  │ Title (h2 text-3xl)      │                          │               │
│  │ Subtitle (muted)         │                          │               │
│  │                          │ ┌──────────────────────┐ │               │
│  │ ┌────────────────────┐   │ │                      │ │               │
│  │ │ Info Box           │   │ │  Live PDF Preview    │ │               │
│  │ │ (delay-75)         │   │ │  (sticky top-8)      │ │               │
│  │ │ Shows key stats    │   │ │  (h-fit height)      │ │               │
│  │ └────────────────────┘   │ │                      │ │               │
│  │                          │ │ Updates real-time    │ │               │
│  │ ┌────────────────────┐   │ │ as form changes      │ │               │
│  │ │ Section 1          │   │ │                      │ │               │
│  │ │ (delay-150)        │   │ └──────────────────────┘ │               │
│  │ │ • Field 1          │   │                          │               │
│  │ │ • Field 2          │   │                          │               │
│  │ │ • Field 3          │   │                          │               │
│  │ └────────────────────┘   │                          │               │
│  │                          │                          │               │
│  │ ┌────────────────────┐   │                          │               │
│  │ │ Section 2          │   │                          │               │
│  │ │ (delay-225)        │   │                          │               │
│  │ │ • Field 4          │   │                          │               │
│  │ │ • Field 5          │   │                          │               │
│  │ └────────────────────┘   │                          │               │
│  │                          │                          │               │
│  │ ┌────────────────────┐   │                          │               │
│  │ │ Section 3          │   │                          │               │
│  │ │ (delay-300)        │   │                          │               │
│  │ │ • Field 6          │   │                          │               │
│  │ │ • Field 7          │   │                          │               │
│  │ └────────────────────┘   │                          │               │
│  │                          │                          │               │
│  │ ┌────────────────────┐   │                          │               │
│  │ │ Download Button    │   │                          │               │
│  │ │ (delay-375)        │   │                          │               │
│  │ │ w-full h-12        │   │                          │               │
│  │ └────────────────────┘   │                          │               │
│  │                          │                          │               │
│  └──────────────────────────┴──────────────────────────┘               │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ Footer: Copyright & Info                                                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Component File Structure

```
components/documents/[type]/
├── [type]-form.tsx              ← MAIN FORM (2-column layout)
│                                  - Renders form left + preview right
│                                  - Handles animations for sections
│                                  - Imports all form sections
│
├── [type]-preview.tsx           ← LIVE PREVIEW (right side)
│                                  - Receives formData prop
│                                  - Updates in real-time
│                                  - Shows calculated values
│
└── form-sections/               ← Individual sections (left side)
    ├── section-1.tsx            - styled with Card + icon
    ├── section-2.tsx            - each has delay-[XX] animation
    ├── section-3.tsx            - receives data/errors/handlers
    └── section-4.tsx            - validates on blur
```

---

## 🔄 Data Flow (Real-Time Sync)

```
User Types in Form
        ↓
handleChange() triggered
        ↓
Hook updates formData state
        ↓
useMemo recalculates values
        ↓
BOTH components re-render:
  ├─ Form re-renders (shows updated field)
  └─ Preview re-renders (shows updated preview)
        ↓
Preview shows exact PDF output
        ↓
User can see results instantly
```

---

## ⏱️ Animation Timeline (Critical for UX)

```
0ms      → Info Box appears
         → 75ms delay

75ms     → Section 1 starts fading in
         → 150ms delay (75ms + 75ms)

150ms    → Section 2 starts fading in
         → 225ms delay (150ms + 75ms)

225ms    → Section 3 starts fading in
         → 300ms delay

300ms    → Section 4 starts fading in
         → 375ms delay

375ms    → Download button starts fading in
         → 450ms delay

525ms    → All animations complete
         → Page fully interactive
```

Each section uses:
```css
animate-in fade-in slide-in-from-top-2 duration-200 delay-[XX]
```

---

## 💻 Code Template (Copy-Paste Ready)

### Form Component ([type]-form.tsx)

```typescript
"use client"

import { use[Type]Form } from "@/lib/hooks/use-[type]-form"
import { [Type]Preview } from "./[type]-preview"
import { Section1 } from "./form-sections/section-1"
import { Section2 } from "./form-sections/section-2"
import { Section3 } from "./form-sections/section-3"
import { Section4 } from "./form-sections/section-4"
import { Button } from "@/components/ui/button"

export function [Type]Form() {
  const { formData, errors, calculatedData, handleChange, handleBlur, handleSubmit, shouldShowError } = use[Type]Form()

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* LEFT COLUMN: Form */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Create [Document Type]</h2>
          <p className="text-muted-foreground">Fill details. Preview updates in real-time.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Info Box - First animation */}
          <div className="space-y-6 p-6 border rounded-xl bg-card shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Stats/Summary */}
          </div>

          {/* Section 1 */}
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-75">
            <Section1 data={formData} errors={errors} onChange={handleChange} onBlur={handleBlur} shouldShowError={shouldShowError} />
          </div>

          {/* Section 2 */}
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-150">
            <Section2 data={formData} errors={errors} onChange={handleChange} onBlur={handleBlur} shouldShowError={shouldShowError} />
          </div>

          {/* Section 3 */}
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-225">
            <Section3 data={formData} errors={errors} onChange={handleChange} onBlur={handleBlur} shouldShowError={shouldShowError} />
          </div>

          {/* Section 4 */}
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-300">
            <Section4 data={formData} errors={errors} onChange={handleChange} onBlur={handleBlur} shouldShowError={shouldShowError} />
          </div>

          {/* Download Button */}
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-375">
            <Button type="submit" className="w-full h-12 text-base">
              Download [Document Type] PDF
            </Button>
          </div>
        </form>
      </div>

      {/* RIGHT COLUMN: Live Preview */}
      <div className="sticky top-8 h-fit">
        <[Type]Preview formData={formData} calculatedData={calculatedData} />
      </div>
    </div>
  )
}
```

### Form Section Template (section-1.tsx)

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { SomeIcon } from "lucide-react"
import type { [Type]FormData } from "@/lib/[type]/schema"

interface Section1Props {
  data: [Type]FormData
  errors: Record<string, string>
  onChange: (field: string, value: string) => void
  onBlur: (field: string) => void
  shouldShowError: (field: string) => boolean
}

export function Section1({ data, errors, onChange, onBlur, shouldShowError }: Section1Props) {
  return (
    <Card className="border-border/50 hover:border-primary/30 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SomeIcon className="h-5 w-5 text-primary" />
          Section Title
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          label="Field 1"
          value={data.field1}
          onChange={(e) => onChange("field1", e.target.value)}
          onBlur={() => onBlur("field1")}
          error={shouldShowError("field1") ? errors.field1 : undefined}
          placeholder="Placeholder text"
        />
        {/* More fields */}
      </CardContent>
    </Card>
  )
}
```

### Preview Component ([type]-preview.tsx)

```typescript
"use client"

import type { [Type]FormData, [Type]Calculations } from "@/lib/[type]/types"

interface [Type]PreviewProps {
  formData: [Type]FormData
  calculatedData: [Type]Calculations
}

export function [Type]Preview({ formData, calculatedData }: [Type]PreviewProps) {
  return (
    <div className="border rounded-lg bg-white p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">{formData.docNumber}</h2>
        <p className="text-sm text-muted-foreground">{formData.docDate}</p>
      </div>

      {/* Content sections */}
      {/* ... */}

      {/* Totals */}
      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{calculatedData.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{calculatedData.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
```

### Page Component (page.tsx)

```typescript
import { [Type]Form } from "@/components/documents/[type]/[type]-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Create [Document Type] | DocGen",
}

export default function [Type]Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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

      <main className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <[Type]Form />
        </div>
      </main>

      <footer className="border-t mt-12 py-6 bg-white">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 DocGen. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
```

---

## ✅ Mandatory Checklist

Every new document type MUST have:

- [ ] **2-Column Layout**
  - [ ] `lg:grid-cols-2 gap-8` grid
  - [ ] Form on left side
  - [ ] Preview on right side
  - [ ] Stacks on mobile

- [ ] **Form Sections (Left Side)**
  - [ ] Card wrapper with border
  - [ ] Icon + title in CardHeader
  - [ ] FormFields in CardContent
  - [ ] Animated with `animate-in fade-in slide-in-from-top-2 duration-200 delay-[XX]`
  - [ ] Increasing delays: 75, 150, 225, 300, 375

- [ ] **Live Preview (Right Side)**
  - [ ] Receives `formData` prop
  - [ ] Receives `calculatedData` prop
  - [ ] Updates in real-time
  - [ ] Shows PDF-like preview
  - [ ] Sticky positioning: `sticky top-8 h-fit`

- [ ] **Page Structure**
  - [ ] Professional header
  - [ ] Back to home link
  - [ ] Footer with copyright
  - [ ] `max-w-7xl` container (not max-w-3xl)
  - [ ] Gradient background

- [ ] **Responsive Design**
  - [ ] 2-column on lg screens
  - [ ] 1-column on mobile
  - [ ] All text readable
  - [ ] Buttons full width on mobile

- [ ] **Validation & Errors**
  - [ ] Zod schema validates all fields
  - [ ] Errors show on blur
  - [ ] Submit blocked if errors exist
  - [ ] Toast confirmation on success

---

## 🎓 Why This Pattern?

1. **Beautiful UX** - Staggered animations feel polished and professional
2. **Real-Time Feedback** - Users see PDF instantly as they type
3. **Organized Form** - Sections are logical and easy to navigate
4. **Mobile Friendly** - Stacks nicely on small screens
5. **Consistent** - All document types look the same
6. **Maintainable** - Clear structure is easy to modify

---

## 📖 Reference Files

- [DOCS_HOME.md](DOCS_HOME.md) - Architecture overview
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Step-by-step guide
- [REFERENCE.md](REFERENCE.md) - Code patterns and utilities
- [app/invoice/page.tsx](app/invoice/page.tsx) - Working example
- [components/documents/invoice/invoice-form.tsx](components/documents/invoice/invoice-form.tsx) - Form example

---

**Remember: Copy from invoice page, change field names and calculations, done.**

This is the standard. No exceptions. All future document types follow this pattern.
