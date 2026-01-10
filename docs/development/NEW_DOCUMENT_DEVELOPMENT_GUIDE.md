# New Document Page Development Guide

> Complete checklist and flow for creating new document pages in Workngin.
> Follow this step-by-step to avoid issues and maintain code consistency.

---

## 📁 Project Structure Overview

```
lib/
├── {document-name}/           # Domain logic folder
│   ├── types.ts               # TypeScript interfaces
│   ├── constants.ts           # Default values, regex patterns, options
│   ├── schema.ts              # Zod validation schemas
│   ├── calculations.ts        # Business logic calculations
│   └── index.ts               # Barrel exports
├── hooks/
│   └── use-{document-name}-form.ts  # Form state management hook
├── testing/
│   └── scenarios/             # Test scenarios for the document
└── utils/
    └── dom-capture-utils.ts   # PDF capture functions (add new capture fn)

components/
├── documents/
│   └── {document-name}/       # Document components folder
│       ├── {document-name}-form.tsx      # Main form container
│       ├── {document-name}-preview.tsx   # PDF preview component
│       └── form-sections/                # Individual form sections
│           ├── index.ts
│           └── {section-name}.tsx
├── shared/
│   ├── form-section.tsx       # Reusable form section component
│   └── payment-cta/           # Payment CTA component
└── documents/shared/
    └── preview-wrapper.tsx    # Reusable preview wrapper

app/
└── {document-route}/
    └── page.tsx               # Next.js page
```

---

## ✅ Development Checklist

### Phase 1: Domain Layer (lib/{document-name}/)

#### Step 1.1: Create Types (types.ts)
- [ ] Define all form data interfaces
- [ ] Define calculation result interface
- [ ] Define validation errors type
- [ ] Export all types

```typescript
// lib/{document-name}/types.ts
export interface {DocumentName}FormData {
  section1: Section1Data
  section2: Section2Data
  // ... all sections
}

export interface {DocumentName}Calculations {
  // calculated values
}

export type {DocumentName}ValidationErrors = Partial<Record<string, string>>
```

**✓ Verify:** Types compile without errors

---

#### Step 1.2: Create Constants (constants.ts)
- [ ] Define regex patterns for validation
- [ ] Define default form data
- [ ] Define dropdown/select options
- [ ] Define any static config values

```typescript
// lib/{document-name}/constants.ts
export const FIELD_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/

export const DEFAULT_{DOCUMENT}_DATA: {DocumentName}FormData = {
  section1: { ... },
  section2: { ... },
}

export const DROPDOWN_OPTIONS = [
  { value: "option1", label: "Option 1" },
]
```

**✓ Verify:** Constants are properly typed

---

#### Step 1.3: Create Zod Schema (schema.ts)
- [ ] Create section-level schemas (for progressive validation)
- [ ] Create main form schema combining all sections
- [ ] Export individual section schemas (for hook use)
- [ ] Create validateField helper function
- [ ] Create validateForm helper function

```typescript
// lib/{document-name}/schema.ts
import { z } from "zod"

// Section schemas (exported for isSectionComplete checks)
export const Section1Schema = z.object({
  field1: z.string().min(2, "Required"),
  field2: z.number().min(0, "Cannot be negative"),
})

export const Section2Schema = z.object({ ... })

// Main form schema
export const {documentName}FormSchema = z.object({
  section1: Section1Schema,
  section2: Section2Schema,
})

// Type inference
export type {DocumentName}FormDataSchema = z.infer<typeof {documentName}FormSchema>

// Validation helpers
export function validateField(field: string, value: any): string | null { ... }
export function validateForm(data: {DocumentName}FormData): {DocumentName}ValidationErrors { ... }
```

**✓ Verify:** Run `npx tsc --noEmit` - no schema errors

---

#### Step 1.4: Create Calculations (calculations.ts)
- [ ] Implement all business logic
- [ ] Pure functions (no side effects)
- [ ] Handle edge cases (zeros, nulls)

```typescript
// lib/{document-name}/calculations.ts
export class {DocumentName}Calculations {
  static calculate(data: {DocumentName}FormData): {DocumentName}CalculationResult {
    // Business logic here
    return { ... }
  }
}
```

**✓ Verify:** Unit test calculations manually with sample data

---

#### Step 1.5: Create Barrel Export (index.ts)
- [ ] Export all types
- [ ] Export all constants
- [ ] Export all schemas (including section schemas)
- [ ] Export calculation class

```typescript
// lib/{document-name}/index.ts
export * from "./types"
export * from "./constants"
export * from "./schema"
export { {DocumentName}Calculations } from "./calculations"

// Re-export individual schemas for section-level validation
export {
  Section1Schema,
  Section2Schema,
  {documentName}FormSchema,
} from "./schema"
```

**✓ Verify:** Import from `@/lib/{document-name}` works

---

### Phase 2: Form Hook (lib/hooks/)

#### Step 2.1: Create Form Hook (use-{document-name}-form.ts)
- [ ] Import section schemas from domain layer
- [ ] Implement useState for formData, errors, touched
- [ ] Implement handleChange (with nested path support)
- [ ] Implement handleBlur (mark touched + validate)
- [ ] Implement validateFormFull
- [ ] Implement isSectionComplete using Zod safeParse
- [ ] Implement derived: isFormComplete, completedSectionsCount, totalSections
- [ ] Implement resetForm
- [ ] Implement fillTestData (for development)

```typescript
// lib/hooks/use-{document-name}-form.ts
import { useState, useCallback, useMemo } from "react"
import {
  Section1Schema,
  Section2Schema,
  DEFAULT_{DOCUMENT}_DATA,
  validateField,
  validateForm,
} from "@/lib/{document-name}"

export interface Use{DocumentName}FormReturn {
  formData: {DocumentName}FormData
  errors: {DocumentName}ValidationErrors
  handleChange: (field: string, value: any, type?: string) => void
  handleBlur: (field: string) => void
  validateFormFull: () => { isValid: boolean; errors: ... }
  shouldShowError: (field: string) => boolean
  getError: (field: string) => string | undefined
  resetForm: () => void
  
  // Section completion (Zod-based)
  isSectionComplete: {
    section1: boolean
    section2: boolean
  }
  
  // Progress metrics (for PaymentCTA)
  isFormComplete: boolean
  completedSectionsCount: number
  totalSections: number
}

export function use{DocumentName}Form(): Use{DocumentName}FormReturn {
  // ... implementation
  
  // Section completion using Zod safeParse
  const isSectionComplete = useMemo(() => ({
    section1: Section1Schema.safeParse(formData.section1).success,
    section2: Section2Schema.safeParse(formData.section2).success,
  }), [formData])
  
  // Derived progress metrics
  const completedSectionsCount = useMemo(
    () => Object.values(isSectionComplete).filter(Boolean).length,
    [isSectionComplete]
  )
  const totalSections = Object.keys(isSectionComplete).length
  const isFormComplete = completedSectionsCount === totalSections
  
  return { ... }
}
```

**✓ Verify:** Hook compiles, test in isolation with console.log

---

### Phase 3: Components (components/documents/{document-name}/)

#### Step 3.1: Create Form Sections (form-sections/)

For each section, create a component:

```typescript
// components/documents/{document-name}/form-sections/section1.tsx
"use client"

import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import { Building2 } from "lucide-react"

interface Section1Props {
  formData: {DocumentName}FormData
  onChange: (e: React.ChangeEvent<...>) => void
  onBlur: (fieldName: string, value: any) => void
  errors: Record<string, string>
  shouldShowError: (fieldName: string) => boolean
  isCompleted: boolean
}

const SECTION1_FIELDS: FormFieldConfig[] = [
  {
    name: "section1.field1",
    label: "Field 1",
    type: "text",
    placeholder: "Enter value",
    required: true,
    colSpan: 2,  // half width in 2-col grid
  },
  // ... more fields
]

export function Section1({
  formData,
  onChange,
  onBlur,
  errors,
  shouldShowError,
  isCompleted,
}: Section1Props) {
  return (
    <FormSection
      title="Section 1 Title"
      icon={Building2}
      fields={SECTION1_FIELDS}
      data={formData}
      errors={errors}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      isCompleted={isCompleted}
      layout={{ columns: 2 }}
    />
  )
}
```

- [ ] Create section components using FormSection
- [ ] Define field configs with proper types
- [ ] Pass isCompleted for visual feedback
- [ ] Create index.ts barrel export

**✓ Verify:** Each section renders without errors

---

#### Step 3.2: Create Preview Component ({document-name}-preview.tsx)

```typescript
// components/documents/{document-name}/{document-name}-preview.tsx
"use client"

import { FileText } from "lucide-react"
import { PreviewWrapper } from "../shared/preview-wrapper"

interface {DocumentName}PreviewProps {
  data: {DocumentName}FormData
  calculations: {DocumentName}CalculationResult
  maxHeight?: string  // Required for sticky layout
}

export function {DocumentName}Preview({
  data,
  calculations,
  maxHeight,
}: {DocumentName}PreviewProps) {
  return (
    <PreviewWrapper
      title="Document Preview"
      icon={<FileText className="h-5 w-5" />}
      previewId="{document-name}-preview"
      dataTestId="{document-name}-preview"
      pdfContentId="{document-name}-pdf-content"
      maxHeight={maxHeight}  // Pass through for sticky layout
    >
      {/* PDF content - this div gets captured */}
      <div data-testid="{document-name}-preview" className="space-y-5 text-sm bg-white">
        {/* Document content here */}
      </div>
    </PreviewWrapper>
  )
}
```

- [ ] Use PreviewWrapper component
- [ ] Accept maxHeight prop (for sticky layout)
- [ ] Include data-testid for PDF capture
- [ ] Style content for A4 PDF output

**✓ Verify:** Preview renders with sample data

---

#### Step 3.3: Create Main Form Component ({document-name}-form.tsx)

```typescript
// components/documents/{document-name}/{document-name}-form.tsx
"use client"

import { useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { use{DocumentName}Form } from "@/lib/hooks/use-{document-name}-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FlaskConical, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PaymentCTA } from "@/components/shared/payment-cta"
import { TestScenarioSelector, {document}Scenarios, isTestMode } from "@/lib/testing"
import { Section1, Section2 } from "./form-sections"
import { {DocumentName}Preview } from "./{document-name}-preview"

const PDF_PRICE = 199  // ₹199

export function {DocumentName}Form() {
  const { toast } = useToast()
  
  const {
    formData,
    setFormData,
    errors,
    calculations,
    handleChange,
    handleBlur,
    validateFormFull,
    shouldShowError,
    resetForm,
    isSectionComplete,
    isFormComplete,
    completedSectionsCount,
    totalSections,
  } = use{DocumentName}Form()

  // Generate PDF - called by PaymentCTA after payment
  const generateAndDownloadPDF = useCallback(async () => {
    const { isValid } = validateFormFull()
    if (!isValid) {
      throw new Error("Please fix form errors")
    }

    // Capture HTML from preview
    const { capture{DocumentName}PreviewHTML } = await import("@/lib/utils/dom-capture-utils")
    const htmlContent = capture{DocumentName}PreviewHTML()

    // Call PDF API
    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        htmlContent,
        filename: `{document-name}-${Date.now()}.pdf`,
      }),
    })

    if (!response.ok) throw new Error("Failed to generate PDF")

    // Download
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `{document-name}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    toast({ title: "Success!", description: "Document downloaded" })
  }, [validateFormFull, toast])

  const handlePaymentError = useCallback((error: string) => {
    toast({ title: "Error", description: error, variant: "destructive" })
  }, [toast])

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Column: Form */}
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-foreground">Create Your Document</h2>
            {isTestMode && (
              <Badge variant="outline" className="border-amber-500 text-amber-600 gap-1">
                <FlaskConical className="h-3 w-3" />
                Test Mode
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-muted-foreground">
              Fill details below. Preview updates in real-time.
            </p>
            <TestScenarioSelector
              scenarios={{document}Scenarios}
              onApply={(data) => setFormData({ ...formData, ...data })}
              label="Test Scenarios"
            />
          </div>
        </div>

        {/* Form Sections */}
        <Section1
          formData={formData}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          shouldShowError={shouldShowError}
          isCompleted={isSectionComplete.section1}
        />
        
        <Section2 ... />

        {/* Reset Form */}
        <Button type="button" variant="outline" className="w-full" onClick={resetForm}>
          Reset Form
        </Button>
      </div>

      {/* Right Column: Preview + CTA (Sticky) */}
      <div className="sticky top-24 self-start space-y-3">
        {calculations ? (
          <>
            <{DocumentName}Preview
              data={formData}
              calculations={calculations}
              maxHeight="55vh"
            />
            <PaymentCTA
              isFormComplete={isFormComplete}
              price={PDF_PRICE}
              documentType="{document-type}"
              isTestMode={isTestMode}
              onPaymentSuccess={generateAndDownloadPDF}
              onPaymentError={handlePaymentError}
              completedSections={completedSectionsCount}
              totalSections={totalSections}
              paymentDescription="Document Name"
            />
          </>
        ) : (
          <Card className="border-dashed bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center h-full py-20">
              <FileText className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">Enter details to see preview</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
```

- [ ] Use standard two-column layout
- [ ] Right column: sticky with preview (maxHeight="55vh") + PaymentCTA
- [ ] Include Reset Form button at bottom of left column
- [ ] Include Test Mode badge and TestScenarioSelector
- [ ] Implement generateAndDownloadPDF callback
- [ ] Implement handlePaymentError callback

**✓ Verify:** Form renders, sections show, preview updates

---

### Phase 4: DOM Capture & Testing

#### Step 4.1: Add DOM Capture Function

```typescript
// lib/utils/dom-capture-utils.ts (add to existing file)

export function capture{DocumentName}PreviewHTML(): string {
  const previewEl = document.getElementById("{document-name}-pdf-content")
  if (!previewEl) {
    throw new Error("{DocumentName} preview element not found")
  }
  
  const styles = captureStyles()
  const htmlContent = previewEl.innerHTML
  
  return wrapHTMLWithStyles(htmlContent, "{Document Name}", styles)
}
```

- [ ] Add capture function to dom-capture-utils.ts
- [ ] Use correct element ID matching pdfContentId

**✓ Verify:** PDF generates correctly

---

#### Step 4.2: Add Test Scenarios

```typescript
// lib/testing/scenarios/{document-name}.ts
import type { {DocumentName}FormData } from "@/lib/{document-name}"
import type { TestScenario } from "../types"

export const {document}Scenarios: TestScenario<Partial<{DocumentName}FormData>>[] = [
  {
    name: "Complete Valid",
    description: "All fields filled correctly",
    data: {
      // Full valid form data
    },
  },
  {
    name: "Edge Case",
    description: "Tests boundary conditions",
    data: { ... },
  },
]
```

- [ ] Create scenario file
- [ ] Add to lib/testing/scenarios/index.ts exports
- [ ] Add to lib/testing/index.ts exports

**✓ Verify:** Test scenarios work in UI

---

### Phase 5: Page Route (app/{document-route}/)

#### Step 5.1: Create Page

```typescript
// app/{document-route}/page.tsx
import { {DocumentName}Form } from "@/components/documents/{document-name}/{document-name}-form"

export const metadata = {
  title: "Document Name - Workngin",
  description: "Create your document easily",
}

export default function {DocumentName}Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        {/* Standard header content */}
      </header>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <{DocumentName}Form />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-auto">
        {/* Standard footer content */}
      </footer>
    </div>
  )
}
```

- [ ] Create page with standard layout
- [ ] Add metadata for SEO
- [ ] Import and render form component

**✓ Verify:** Page loads at route, full flow works

---

### Phase 6: Add to PaymentCTA Types

```typescript
// components/shared/payment-cta/types.ts
export const DOCUMENT_DISPLAY_NAMES: Record<string, string> = {
  // ... existing
  "{document-type}": "Document Display Name",
}
```

- [ ] Add document type to DOCUMENT_DISPLAY_NAMES

---

## 🔍 Verification Checklist (Run After Each Phase)

```bash
# TypeScript check
npx tsc --noEmit

# Build check
npm run build

# Dev server test
npm run dev
# Then test at http://localhost:3000/{document-route}
```

### Manual Testing Checklist

- [ ] Form loads without console errors
- [ ] All fields accept input correctly
- [ ] Validation errors show on blur
- [ ] Preview updates in real-time
- [ ] Section completion indicators work
- [ ] PaymentCTA shows progress
- [ ] Reset Form clears all data
- [ ] Test Mode allows free download
- [ ] PDF generates and downloads correctly
- [ ] PDF content matches preview
- [ ] Mobile responsive layout works

---

## 📋 Quick Reference: Common Patterns

### Nested Field Handling
```typescript
// Field name format: "section.field"
handleChange("employee.name", value)
handleBlur("employee.name")
shouldShowError("employee.name")
```

### Section Completion (Zod-based)
```typescript
const isSectionComplete = useMemo(() => ({
  employee: EmployeeSchema.safeParse(formData.employee).success,
}), [formData])
```

### FormSection Field Config
```typescript
const fields: FormFieldConfig[] = [
  { name: "field", label: "Label", type: "text", required: true, colSpan: 2 },
  { name: "amount", label: "Amount", type: "number", min: 0, step: "0.01" },
  { name: "type", label: "Type", type: "select", options: [...] },
]
```

### Preview maxHeight Pattern
```typescript
// In form component - right column
<Preview maxHeight="55vh" />
<PaymentCTA ... />

// In preview component - pass to PreviewWrapper
<PreviewWrapper maxHeight={maxHeight} ... />
```

---

## 🚨 Common Mistakes to Avoid

1. **Missing section schema exports** - Always export individual schemas for hook use
2. **Forgetting maxHeight** - Preview needs maxHeight for sticky layout to work
3. **Wrong pdfContentId** - Must match ID in dom-capture-utils
4. **Missing resetForm** - Always implement and expose from hook
5. **Not using Zod safeParse** - Use for isSectionComplete, not manual checks
6. **Hardcoded validation** - Always derive from Zod schemas
7. **Missing test scenarios** - Add before manual testing
8. **Not testing PDF output** - Always verify PDF matches preview

---

## 📂 File Creation Order

1. `lib/{document}/types.ts`
2. `lib/{document}/constants.ts`
3. `lib/{document}/schema.ts`
4. `lib/{document}/calculations.ts`
5. `lib/{document}/index.ts`
6. `lib/hooks/use-{document}-form.ts`
7. `components/documents/{document}/form-sections/*.tsx`
8. `components/documents/{document}/form-sections/index.ts`
9. `components/documents/{document}/{document}-preview.tsx`
10. `components/documents/{document}/{document}-form.tsx`
11. `lib/utils/dom-capture-utils.ts` (add capture function)
12. `lib/testing/scenarios/{document}.ts`
13. `lib/testing/scenarios/index.ts` (add export)
14. `lib/testing/index.ts` (add export)
15. `components/shared/payment-cta/types.ts` (add document type)
16. `app/{route}/page.tsx`

---

## 🎯 Summary: The 6-Phase Flow

| Phase | Focus | Output | Verify |
|-------|-------|--------|--------|
| 1 | Domain Layer | types, constants, schema, calculations | `tsc --noEmit` |
| 2 | Form Hook | state management, validation, completion | Hook compiles |
| 3 | Components | sections, preview, main form | UI renders |
| 4 | DOM Capture | PDF capture, test scenarios | PDF generates |
| 5 | Page Route | Next.js page | Page loads |
| 6 | Integration | PaymentCTA types | Full flow works |

**Always verify after each phase before moving to the next!**
