# Salary Slip Development Guide - Mistakes & Lessons Learned

## ⚠️ Critical Issues Fixed in Latest Version

### Issue 1: Static Page Rendering (Most Critical)
**Problem:** Page was statically prerendered but contains interactive form elements that need React hydration.
**Fix:** Added `export const dynamic = "force-dynamic"` to `/app/salary-slip/page.tsx`
**Lesson:** Always use `dynamic = "force-dynamic"` for pages with client-side interactive forms using React hooks.

### Issue 2: Validation Not Wired to UI
**Problem:** Validation logic existed but wasn't called on submit, errors weren't displayed.
**Fix:** 
- Called `validateFormFull()` on form submission
- Passed real `errors` and `shouldShowError` to form sections
- Added `canSubmit` check for button state
**Lesson:** Don't leave validation partially implemented. Wire validation from hook → submit handler → UI completely.

### Issue 3: Layout Mismatch with Invoice
**Problem:** Custom 3-column layout, no download button, sticky issues, missing title.
**Fix:** Refactored to match Invoice's proven 2-column layout pattern:
```tsx
// ✅ Correct: 2-column grid matching Invoice pattern
<div className="grid lg:grid-cols-2 gap-8">
  <div>  {/* Form with title and download button */}</div>
  <div className="hidden lg:block">  {/* Sticky preview */}</div>
</div>
```
**Lesson:** Reuse proven layout patterns. If it works in Invoice, use it in Salary Slip. Consistency reduces bugs.

### Issue 4: Form Sections Not Showing Errors
**Problem:** Form sections always rendered with `errors={{}}` and `shouldShowError={() => false}`.
**Fix:** Pass actual validation state:
```tsx
<EmployeeDetails
  errors={errors}           // ✅ Real errors from hook
  shouldShowError={shouldShowError}  // ✅ Real validation function
/>
```
**Lesson:** Don't use placeholder values. Connect real state from hooks to UI components.

### Issue 5: Download Button Missing
**Problem:** No way to download the generated salary slip PDF.
**Fix:** Added download button with PDF generation logic (matching Invoice pattern).
**Lesson:** For document generators, always include a download/submit button. It's core functionality.

---

## Complete Architecture (After Fixes)

### Component Hierarchy
```
salary-slip/page.tsx (dynamic = "force-dynamic")
└── SalarySlipForm (uses useSalarySlipForm hook)
    ├── Form (with validation on submit)
    │   ├── PeriodDetails (FormSection)
    │   ├── EmployeeDetails (FormSection)
    │   ├── CompanyDetails (FormSection)
    │   ├── Earnings (FormSection)
    │   ├── Deductions (FormSection)
    │   ├── BankingDetails (FormSection)
    │   └── Download Button
    └── SalarySlipPreview (real-time, sticky)
```

### Key Features Now Working
✅ Dynamic page rendering with proper React hydration
✅ Full validation with error display
✅ 2-column layout matching Invoice
✅ Professional sticky preview
✅ Download PDF button
✅ Real-time form updates
✅ All calculations displaying correctly

---

## Complete File Structure

```
lib/salary-slip/
  ├── types.ts              - SalarySlipFormData, nested interfaces
  ├── constants.ts          - MONTHS, PAYMENT_MODES, defaults
  ├── schema.ts             - Zod validation schemas
  ├── calculations.ts       - SalarySlipCalculations class
  └── index.ts              - Barrel exports

lib/hooks/
  └── use-salary-slip-form.ts  - State, validation, calculations

lib/utils/
  └── dom-capture-utils.ts  - captureSalarySlipPreviewHTML()

components/documents/salary-slip/
  ├── form-sections/
  │   ├── period-details.tsx     (uses FormSection)
  │   ├── employee-details.tsx   (uses FormSection)
  │   ├── company-details.tsx    (uses FormSection)
  │   ├── earnings.tsx           (uses FormSection)
  │   ├── deductions.tsx         (uses FormSection)
  │   └── banking-details.tsx    (uses FormSection)
  ├── salary-slip-form.tsx       (main form, download button, validation)
  └── salary-slip-preview.tsx    (professional display, id="salary-slip-preview")

app/
  ├── salary-slip/
  │   └── page.tsx           (dynamic = "force-dynamic")
  └── test-form-debug/
      └── page.tsx           (debug test page)
```

---

## Key Patterns Used

### 1. FormSection Component Pattern
Every form section follows this pattern:
```tsx
const SECTION_FIELDS: FormFieldConfig[] = [
  { name: "field1", label: "Label", required: true, ... }
]

export function SectionName({ field1, onChange, onBlur, errors, shouldShowError }: Props) {
  const formData = { field1 }
  
  return (
    <FormSection
      title="Title"
      icon={Icon}
      fields={SECTION_FIELDS}
      data={formData}
      errors={errors}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
    />
  )
}
```

### 2. Hook-Based State Management
All form logic in hook:
```tsx
const {
  formData,
  errors,
  touched,
  calculations,
  handleChange,
  handleBlur,
  validateFormFull,
  shouldShowError
} = useSalarySlipForm()
```

### 3. 2-Column Layout Pattern
```tsx
<div className="grid lg:grid-cols-2 gap-8">
  <div className="space-y-6">
    {/* Form with title, sections, button */}
  </div>
  <div className="hidden lg:block">
    <div className="sticky top-6">
      {/* Preview */}
    </div>
  </div>
</div>
```

### 4. Validation Pattern
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const { isValid } = validateFormFull()
  if (!isValid) {
    toast({ title: "Validation Error", ... })
    return
  }
  // Generate PDF
}
```

---

## How to Verify Everything Works

### 1. Test Page Loads
```bash
npm run dev
curl http://localhost:3000/salary-slip
# Should return HTML with all form inputs and preview
```

### 2. Test Form Input
1. Open http://localhost:3000/salary-slip in browser
2. Click on any input field (e.g., Employee ID)
3. Type some text
4. **Expected:** Text appears in input ✅

### 3. Test Preview Updates
1. Fill in multiple form fields
2. **Expected:** Preview updates in real-time on right side ✅

### 4. Test Validation
1. Click Download button without filling form
2. **Expected:** Toast shows "Validation Error" ✅
3. Fill all required fields
4. **Expected:** Download button becomes enabled ✅

### 5. Test Download (Dev Mode)
1. Fill all form fields with valid data
2. Click "Download Salary Slip" button
3. **Expected:** PDF downloads to your computer ✅

---

## Files Modified in Latest Fix

| File | Change | Why |
|------|--------|-----|
| `/app/salary-slip/page.tsx` | Added `dynamic = "force-dynamic"` | Force server rendering for React hydration |
| `/components/documents/salary-slip/salary-slip-form.tsx` | Complete refactor | Added validation, button, proper layout |
| `/lib/hooks/use-salary-slip-form.ts` | Added logging | Debug validation flow |
| `/lib/utils/dom-capture-utils.ts` | Added `captureSalarySlipPreviewHTML()` | PDF generation support |

---

## Prevention Checklist for Future Projects

### Before Building a Form:
- [ ] Mark page with `dynamic = "force-dynamic"` if it has React hooks
- [ ] Design 2-column layout (form + preview/payment)
- [ ] Plan validation: when to show errors, when to allow submit
- [ ] Plan button: what does it do (download/pay/submit)
- [ ] Test form input in browser (actually type, verify onChange works)
- [ ] Test validation (submit empty form, see errors)
- [ ] Test state updates (fill field, watch preview update)

### While Building a Form:
- [ ] Use FormSection for all form sections (not manual Card/Input)
- [ ] Pass real errors and shouldShowError, never empty objects
- [ ] Wire validation to submit handler completely
- [ ] Test each section independently
- [ ] Check browser console for errors (F12 DevTools)
- [ ] Build and verify: `npm run build`

### After Building a Form:
- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test on mobile (iPhone, Android)
- [ ] Test dark mode
- [ ] Test form with invalid data
- [ ] Test form with valid data
- [ ] Download/submit functionality works
- [ ] Preview updates in real-time

---

## Replicating This Pattern for Other Documents

For Quotation, PO, Bill of Supply, or any new document form:

1. **Copy foundation:**
   ```bash
   cp -r lib/salary-slip lib/quotation
   # Edit types, constants, calculations for quotation logic
   ```

2. **Create form hook:**
   ```bash
   cp lib/hooks/use-salary-slip-form.ts lib/hooks/use-quotation-form.ts
   # Adapt to quotation structure
   ```

3. **Create form sections:**
   - Use FormSection component ALWAYS
   - Create 4-6 form section components
   - Each gets real errors and shouldShowError

4. **Create preview:**
   - Design professional preview layout
   - Real-time updates from form
   - id="quotation-preview" for HTML capture

5. **Create main form:**
   - 2-column grid layout
   - Title + Description
   - Form sections + Download button
   - Sticky preview on right

6. **Create page:**
   ```tsx
   export const dynamic = "force-dynamic"  // CRITICAL
   ```

---

## Summary: Don't Make These Mistakes

| Mistake | Fix | Why It Matters |
|---------|-----|---|
| Static pages with interactive forms | Use `dynamic = "force-dynamic"` | Forms won't be interactive without React hydration |
| Validation logic without UI | Wire validation to form submit and error display | Users get no feedback about invalid data |
| Custom layouts | Reuse proven 2-column pattern | Consistency, fewer bugs, faster development |
| Placeholder errors/validation functions | Pass real state from hooks | Validation becomes invisible/non-functional |
| No download button | Add button wired to submit handler | Users can't use the form output |
| Don't test in browser | Actually type in inputs, check console | Find real problems early |

---

## Original Architecture Below

(See original sections for detailed implementation patterns)



### Why FormSection Component?
- ✅ **Consistent Design**: All forms look professional and uniform
- ✅ **Flexible Layout**: Supports 1, 2, or 3 column layouts
- ✅ **Built-in Validation**: Error display, field validation
- ✅ **Custom Fields**: Supports custom child content (selections, suggestions)
- ✅ **Less Code**: Define fields once, render automatically
- ✅ **Invoice Pattern**: Matches existing invoice implementation

### Component Hierarchy
```
salary-slip-form.tsx (Main Component)
├── period-details.tsx (uses FormSection)
├── employee-details.tsx (uses FormSection)
├── company-details.tsx (uses FormSection)
├── earnings.tsx (uses FormSection)
├── deductions.tsx (uses FormSection)
├── banking-details.tsx (uses FormSection)
└── salary-slip-preview.tsx (Real-time preview)
```

---

## Phase 1: Foundation (Types, Constants, Schema)

### 1.1 Create Types File
**File:** `lib/salary-slip/types.ts`

---

## Phase-Based Development Approach

### Why This Works
- ✅ **Foundation First:** Types → Constants → Schema (No assumptions)
- ✅ **Logic Verified:** Calculations tested before UI
- ✅ **Incremental Testing:** Test after each phase
- ✅ **Clean Architecture:** UI components depend on verified logic
- ✅ **No Rework:** Avoids "meshed up code"

---

## Phase 1: Foundation (Types, Constants, Schema)

### 1.1 Create Types File
**File:** `lib/salary-slip/types.ts`

```bash
# Create the file at:
/lib/salary-slip/types.ts

# Content structure:
- 6 nested interfaces (Period, Employee, Company, Earnings, Deductions, BankingDetails)
- 1 main form interface (SalarySlipFormData)
- Utility types (SalarySlipCalculationResult, SalarySlipValidationErrors, FormFieldHandler)
```

**Key Principles:**
- Define ALL data structures upfront
- Use nested objects (not flat) for complex forms
- Export types for use in other files
- Include JSDoc comments for clarity

**Example Structure:**
```typescript
export interface Period {
  month: string
  year: number
}

export interface SalarySlipFormData {
  period: Period
  employee: Employee
  company: Company
  earnings: Earnings
  deductions: Deductions
  bankingDetails: BankingDetails
}
```

### 1.2 Create Constants File
**File:** `lib/salary-slip/constants.ts`

```bash
# Create the file at:
/lib/salary-slip/constants.ts

# Content includes:
- Regex patterns (PAN, EMPLOYEE_ID, IFSC)
- Dropdown options (MONTHS, PAYMENT_MODES)
- Percentages & thresholds (PF_PERCENTAGE, ESI_THRESHOLD)
- Default values (DEFAULT_SALARY_SLIP)
- Sample data (SAMPLE_SALARY_SLIP for testing)
```

**Key Principles:**
- All magic numbers → constants
- Use sample data for testing
- Group related constants
- Make patterns reusable

**Example Constants:**
```typescript
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/
export const MONTHS = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  // ... etc
]
export const PF_PERCENTAGE = 12
export const DEFAULT_SALARY_SLIP: SalarySlipFormData = { /* ... */ }
```

### 1.3 Create Schema File
**File:** `lib/salary-slip/schema.ts`

```bash
# Create the file at:
/lib/salary-slip/schema.ts

# Content includes:
- Field-level Zod schemas (one per interface)
- Form-level schema combining all fields
- Helper functions (validateField, validateForm)
- Type inference from schema
```

**Key Principles:**
- Use Zod for runtime validation
- Match TypeScript types exactly
- Provide helpful error messages
- Support partial validation

**Example Schema:**
```typescript
export const PeriodSchema = z.object({
  month: z.string().min(1, "Month is required"),
  year: z.number().min(2000).max(2100)
})

export const salarySlipFormSchema = z.object({
  period: PeriodSchema,
  employee: EmployeeSchema,
  // ... etc
})
```

### 1.4 Create Barrel Export
**File:** `lib/salary-slip/index.ts`

```bash
# Create the file at:
/lib/salary-slip/index.ts

# Content:
export * from "./types"
export * from "./constants"
export * from "./schema"
```

### Phase 1 Verification
```bash
# Run TypeScript compiler to check for errors
npx tsc --noEmit

# Expected: 0 errors in salary-slip files
```

---

## Phase 2: Logic Layer (Calculations)

### 2.1 Create Calculations File
**File:** `lib/salary-slip/calculations.ts`

```bash
# Create the file at:
/lib/salary-slip/calculations.ts

# Structure:
- Static class: SalarySlipCalculations
- 7 methods for different calculations
- Support both flat and nested data structures
```

**Key Methods:**
```typescript
export class SalarySlipCalculations {
  static calculateTotalEarnings(data: SalarySlipFormData): number
  static calculateTotalDeductions(data: SalarySlipFormData): number
  static calculatePF(data: SalarySlipFormData): number
  static calculateESI(data: SalarySlipFormData): number
  static calculateNetSalary(data: SalarySlipFormData): number
  static amountInWords(amount: number): string
  static calculateAll(data: SalarySlipFormData): SalarySlipCalculationResult
}
```

**Key Principles:**
- Use utility functions (formatCurrency, numberToWords)
- Handle edge cases (ESI threshold, negative values)
- Return complete result object
- Keep methods pure (no side effects)

### 2.2 Create Test File
**File:** `lib/salary-slip/calculations.test.ts`

```bash
# Create the file at:
/lib/salary-slip/calculations.test.ts

# Write 8 comprehensive tests:
1. Total Earnings calculation
2. Total Deductions calculation
3. Net Salary calculation
4. PF calculation (12%)
5. ESI calculation (above threshold)
6. ESI calculation (below threshold)
7. Salary period formatting
8. Complete calculation with all values
```

**Running Tests:**
```bash
# Install test dependency (if needed)
npm install vitest --save-dev

# Run tests
npx vitest run lib/salary-slip/calculations.test.ts

# Expected: ✅ 8 tests PASS
```

### Phase 2 Verification
```bash
# Verify no TypeScript errors
npx tsc --noEmit

# Run all tests
npm run test

# Expected: All tests pass ✅
```

---

## Phase 3: Form Hook (State Management)

### 3.1 Create Form Hook
**File:** `lib/hooks/use-salary-slip-form.ts`

```bash
# Create the file at:
/lib/hooks/use-salary-slip-form.ts

# Structure:
- useState for form data, errors, touched
- handleChange: updates nested form state
- handleBlur: marks field as touched
- validateForm: validates complete form
- calculations: useMemo for performance
- Helper functions: shouldShowError, getError
```

**Key Features:**
```typescript
export function useSalarySlipForm(initialData?: SalarySlipFormData) {
  const [formData, setFormData] = useState<SalarySlipFormData>()
  const [errors, setErrors] = useState<SalarySlipValidationErrors>()
  const [touched, setTouched] = useState<Set<string>>()

  const handleChange = (field: string, value: any) => { /* ... */ }
  const handleBlur = (field: string) => { /* ... */ }
  const validateFormFull = () => { /* ... */ }
  
  const calculations = useMemo(() => 
    SalarySlipCalculations.calculateAll(formData), 
    [formData]
  )

  return { formData, errors, touched, calculations, handleChange, handleBlur, /* ... */ }
}
```

**Key Principles:**
- Support nested field paths: "period.month", "employee.panNumber"
- Touch-based error display (only show after user interacts)
- Memoize expensive calculations
- Clear errors on field change

### Phase 3 Verification
```bash
# Check for errors
npx tsc --noEmit

# Expected: No salary-slip related errors
```

---

## Phase 4: UI Components (Using FormSection)

### 4.1 FormSection Component Pattern

All form sections follow this structure:

```typescript
"use client"

import type React from "react"
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"
import { IconComponent } from "lucide-react"

// 1. Define fields configuration
const SECTION_FIELDS: FormFieldConfig[] = [
  {
    name: "fieldName",
    label: "Field Label",
    placeholder: "Placeholder text",
    required: true,
    colSpan: "half", // or "full", "third"
    type: "text", // or "number", "date", "textarea"
    transform: (value) => value.toUpperCase(), // Optional
  },
  // ... more fields
]

// 2. Define component interface
interface SectionDetailsProps {
  field1: string
  field2: number
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: Record<string, string>
  shouldShowError?: (fieldName: string) => boolean
}

// 3. Create form data object
export function SectionDetails({
  field1,
  field2,
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
}: SectionDetailsProps) {
  const formData = {
    field1,
    field2,
  }

  // 4. Use FormSection component
  return (
    <FormSection
      title="Section Title"
      icon={IconComponent}
      fields={SECTION_FIELDS}
      data={formData}
      errors={errors}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      layout={{ columns: 2 }} // Optional layout
    >
      {/* Optional: Custom content (like custom select or suggestions) */}
      {customContent && <CustomContentComponent />}
    </FormSection>
  )
}
```

### 4.2 Real Salary Slip Examples

**Employee Details (2-column layout):**
```typescript
const EMPLOYEE_FIELDS: FormFieldConfig[] = [
  {
    name: "employeeId",
    label: "Employee ID",
    placeholder: "EMP001",
    required: true,
    colSpan: "half",
  },
  {
    name: "employeeName",
    label: "Employee Name",
    placeholder: "John Doe",
    required: true,
    colSpan: "half",
  },
  // ... more fields
]
```

**Earnings Section (with total calculation):**
```typescript
const EARNINGS_FIELDS: FormFieldConfig[] = [
  {
    name: "basicSalary",
    label: "Basic Salary",
    type: "number",
    step: "0.01",
    colSpan: "half",
    required: true,
  },
  // ... more earning fields
]

export function Earnings({
  basicSalary,
  otherEarnings,
  totalEarnings = 0, // From calculations
  onChange,
  onBlur,
  errors = {},
  shouldShowError = () => false,
}: EarningsProps) {
  const formData = { basicSalary, otherEarnings }

  return (
    <FormSection
      title="Earnings"
      fields={EARNINGS_FIELDS}
      data={formData}
      errors={errors}
      onChange={onChange}
      onBlur={onBlur}
      shouldShowError={shouldShowError}
      layout={{ columns: 2 }}
    >
      {/* Display total calculation */}
      {totalEarnings > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border">
          <p className="font-semibold">Total Earnings: ₹{totalEarnings}</p>
        </div>
      )}
    </FormSection>
  )
}
```

### 4.3 Custom Select Fields

For custom select/dropdown fields (like Month or Payment Mode), use the `children` prop:

```typescript
<FormSection
  // ... other props
>
  <div>
    <FormField label="Month" htmlFor="period-month" required>
      <Select value={month} onValueChange={(value) => onChange({ target: { name: "month", value } } as any)}>
        <SelectTrigger id="period-month">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  </div>
</FormSection>
```

### 4.4 Create All Form Sections

Create these components (all using FormSection):
- `period-details.tsx` - Month/Year (2 columns)
- `employee-details.tsx` - Employee info (2 columns)
- `company-details.tsx` - Company info (full width)
- `earnings.tsx` - Earnings breakdown (2 columns + summary)
- `deductions.tsx` - Deductions breakdown (2 columns + summary)
- `banking-details.tsx` - Bank details (2 columns)

**Key Points:**
- Each component accepts `onChange`, `onBlur`, `errors`, `shouldShowError`
- Define fields as FormFieldConfig array (reusable, testable)
- Use `layout={{ columns: 2 }}` for multi-column sections
- Add custom content in `children` prop for calculations/summaries

---

## Phase 4b: Updated UI Components

**Component 1: Period Details**
```bash
File: components/documents/salary-slip/form-sections/period-details.tsx
Inputs: Month (select), Year (number)
Lines: ~70
```

**Component 2: Earnings**
```bash
File: components/documents/salary-slip/form-sections/earnings.tsx
Inputs: 5 numeric fields (basic, DA, HRA, conveyance, other)
Lines: ~95
Real-time total display
```

**Component 3: Deductions**
```bash
File: components/documents/salary-slip/form-sections/deductions.tsx
Inputs: 4 numeric fields (PF, ESI, tax, other)
Lines: ~75
```

**Component 4: Employee Details**
```bash
File: components/documents/salary-slip/form-sections/employee-details.tsx
Inputs: 6 fields (ID, name, designation, department, DOJ, PAN)
Lines: ~95
Auto-uppercase PAN
```

**Component 5: Company Details**
```bash
File: components/documents/salary-slip/form-sections/company-details.tsx
Inputs: 3 fields (name, address textarea, PAN)
Lines: ~85
Multi-line address support
```

**Component 6: Banking Details**
```bash
File: components/documents/salary-slip/form-sections/banking-details.tsx
Inputs: 3 fields (account, IFSC, payment mode)
Lines: ~95
Validation rules for account/IFSC
```

### 4.2 Component Structure (Consistent Pattern)
All 6 components follow the same pattern:

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LucideIcon } from "lucide-react"

interface ComponentProps {
  field1: string | number
  field2: string | number
  // ... all fields
  onChange: (field: string, value: any) => void
  onBlur: (field: string) => void
}

export function ComponentName({ /* fields */, onChange, onBlur }: ComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconComponent className="h-5 w-5" />
          Section Title
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input fields using onChange/onBlur */}
      </CardContent>
    </Card>
  )
}
```

### 4.3 Create Test Pages
```bash
# Test Period Details
File: app/test-period-details/page.tsx
Command: npm run dev
URL: http://localhost:3000/test-period-details
Verify: Month dropdown and year input working ✅

# Test Earnings
File: app/test-earnings/page.tsx
Command: npm run dev
URL: http://localhost:3000/test-earnings
Verify: All 5 inputs working, total calculation displaying ✅
```

### Phase 4 Verification
```bash
# Build and check for errors
npm run build

# Expected: All components compile
# Routes detected: 9 (including test pages)

# Test in dev mode
npm run dev

# Visit each test page and verify inputs work
# Check that onChange/onBlur handlers fire correctly
```

---

## Phase 5: Integration Components

### 5.1 Create Preview Component
**File:** `components/documents/salary-slip/salary-slip-preview.tsx`

```bash
Structure:
- Real-time preview of salary slip
- 7 sections: Header, Company, Employee, Earnings, Deductions, Net Salary, Banking
- Uses formatCurrency utility
- Conditional rendering for empty sections
- id="salary-slip-preview" for HTML capture (PDF)
- Lines: ~190+
```

**Key Features:**
```typescript
interface SalarySlipPreviewProps {
  formData: SalarySlipFormData
  calculations: SalarySlipCalculationResult
}

export function SalarySlipPreview({ formData, calculations }: SalarySlipPreviewProps) {
  return (
    <div id="salary-slip-preview" className="space-y-4">
      {/* Header with period */}
      {/* Company section (conditional) */}
      {/* Employee section (conditional) */}
      {/* Earnings with calculations */}
      {/* Deductions with calculations */}
      {/* Net salary highlighted card */}
      {/* Banking details (conditional) */}
    </div>
  )
}
```

## Phase 5: Integration & Preview

### 5.1 Professional Salary Slip Preview

The preview component displays:
- ✅ Header with period (January 2024)
- ✅ Company details (name, address, PAN)
- ✅ Employee details (ID, name, designation, dept)
- ✅ Earnings breakdown with total
- ✅ Deductions breakdown with total
- ✅ NET SALARY highlighted in green
- ✅ Amount in words (₹55,610 = "Fifty Five Thousand Six Hundred Ten")
- ✅ Banking details
- ✅ Professional styling (proper borders, spacing, colors)

**Design Features:**
```
┌─────────────────────────────┐
│       SALARY SLIP           │
│     January 2024            │
├─────────────────────────────┤
│ COMPANY DETAILS             │
│ - Name, Address, PAN        │
├─────────────────────────────┤
│ EMPLOYEE DETAILS (2 cols)   │
│ - ID, Name, Designation     │
├─────────────────────────────┤
│ EARNINGS (Blue background)  │
│ - Basic: ₹50,000            │
│ - DA: ₹10,000               │
│ - HRA: ₹8,000               │
├─────────────────────────────┤
│ - Total: ₹68,000            │
├─────────────────────────────┤
│ DEDUCTIONS (Red background) │
│ - PF: ₹6,000                │
│ - ESI: ₹510                 │
│ - Total: ₹12,390            │
├─────────────────────────────┤
│ NET SALARY: ₹55,610 ✓       │
│ Fifty Five Thousand...      │
├─────────────────────────────┤
│ BANKING DETAILS             │
│ - Account: 12345...         │
│ - IFSC: SBIN0001234         │
└─────────────────────────────┘
```

### 5.2 Main Form Component (2-Column Layout)

```typescript
export function SalarySlipForm() {
  const { formData, handleChange, handleBlur, calculations } = useSalarySlipForm()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Form Sections (lg:col-span-2) */}
      <div className="space-y-4">
        <PeriodDetails {...} onChange={handleChange} onBlur={handleBlur} />
        <EmployeeDetails {...} onChange={handleChange} onBlur={handleBlur} />
        <CompanyDetails {...} onChange={handleChange} onBlur={handleBlur} />
        <Earnings {...totalEarnings={calculations.totalEarnings}} />
        <Deductions {...totalDeductions={calculations.totalDeductions}} />
        <BankingDetails {...} />
      </div>

      {/* Right: Real-time Preview (lg:col-span-1) */}
      <div className="sticky top-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <SalarySlipPreview formData={formData} calculations={calculations} />
      </div>
    </div>
  )
}
```

### 5.3 Page Component

```typescript
app/salary-slip/page.tsx
- Header with back link
- Main form component
- Footer with copyright
- Metadata for SEO
```

## Key Commands Used

```bash
# Phase 1: Foundation (types, constants, schema)
mkdir -p lib/salary-slip
touch lib/salary-slip/types.ts
touch lib/salary-slip/constants.ts
touch lib/salary-slip/schema.ts
touch lib/salary-slip/index.ts
npx tsc --noEmit  # Verify compilation

# Phase 2: Logic (calculations + tests)
touch lib/salary-slip/calculations.ts
touch lib/salary-slip/calculations.test.ts
npx vitest run lib/salary-slip/calculations.test.ts  # Run tests

# Phase 3: Form hook
touch lib/hooks/use-salary-slip-form.ts

# Phase 4: UI Components (with FormSection)
mkdir -p components/documents/salary-slip/form-sections
# Create 6 form section components
# Each uses FormSection component pattern
# No need for Card/Input/Label - FormSection handles it

# Phase 5: Integration
touch components/documents/salary-slip/salary-slip-preview.tsx
touch components/documents/salary-slip/salary-slip-form.tsx
touch app/salary-slip/page.tsx

# Final verification
npm run build
npm run dev
# Visit http://localhost:3000/salary-slip
```

---

## Complete File Structure

```
lib/
  salary-slip/
    ├── types.ts              (95 lines)
    ├── constants.ts          (140+ lines)
    ├── schema.ts             (220+ lines)
    ├── index.ts              (4 lines)
    ├── calculations.ts       (180+ lines)
    └── calculations.test.ts  (100+ lines)
  
  hooks/
    └── use-salary-slip-form.ts (100+ lines)

components/
  documents/
    salary-slip/
      ├── salary-slip-form.tsx    (98 lines)
      ├── salary-slip-preview.tsx (218 lines)
      └── form-sections/
          ├── period-details.tsx      (70 lines)
          ├── earnings.tsx            (95 lines)
          ├── deductions.tsx          (75 lines)
          ├── employee-details.tsx    (95 lines)
          ├── company-details.tsx     (85 lines)
          └── banking-details.tsx     (95 lines)

app/
  salary-slip/
    └── page.tsx          (50 lines)
  test-period-details/
    └── page.tsx          (test)
  test-earnings/
    └── page.tsx          (test)
  test-salary-slip-form/
    └── page.tsx          (test)

Total: 14 core files + 3 test files = 17 files
Total Lines: ~1,500+
```

---

## Testing Checklist

### Phase 1 Testing
- [ ] Types file compiles
- [ ] Constants file compiles
- [ ] Schema file compiles
- [ ] No TypeScript errors: `npx tsc --noEmit`

### Phase 2 Testing
- [ ] Calculations file compiles
- [ ] All 8 tests pass: `npx vitest run`
- [ ] Test earnings: `calculateTotalEarnings(SAMPLE)` = 68,000
- [ ] Test deductions: `calculateTotalDeductions(SAMPLE)` = 12,390
- [ ] Test net: `calculateNetSalary(SAMPLE)` = 55,610

### Phase 3 Testing
- [ ] Hook compiles
- [ ] State updates on field change
- [ ] Validation works
- [ ] Errors show only when touched

### Phase 4 Testing
- [ ] All 6 components compile
- [ ] Each test page loads: `npm run dev`
- [ ] Period inputs work: `/test-period-details`
- [ ] Earnings displays total: `/test-earnings`
- [ ] Build succeeds: `npm run build`

### Phase 5 Testing
- [ ] Preview component renders
- [ ] Main form loads: `/test-salary-slip-form`
- [ ] 2-column layout displays
- [ ] Form inputs update preview in real-time
- [ ] All calculations display correctly

---

## How to Replicate for Other Documents

## How to Replicate for Other Documents

### For Quotation:
```bash
# 1. Copy salary-slip foundation and adapt
mkdir -p lib/quotation
cp lib/salary-slip/types.ts lib/quotation/types.ts
# Edit types.ts to match quotation structure

# 2. Copy calculations
cp lib/salary-slip/calculations.ts lib/quotation/calculations.ts
# Implement: calculateSubtotal(), calculateTax(), calculateTotal()

# 3. Copy form hook
cp lib/hooks/use-salary-slip-form.ts lib/hooks/use-quotation-form.ts
# Adapt to quotation form structure

# 4. Create form sections using FormSection (5-6 components)
mkdir -p components/documents/quotation/form-sections
# Create: buyer-details.tsx, seller-details.tsx, items.tsx, etc.
# EACH USES FormSection COMPONENT (don't create Card manually)

# 5. Create preview component
touch components/documents/quotation/quotation-preview.tsx
# Design: Professional quotation layout with line items

# 6. Create main form and page
touch components/documents/quotation/quotation-form.tsx
touch app/quotation/page.tsx
```

### For PO (Purchase Order):
Same structure as Quotation but with:
- Vendor management section
- Line items with quantity/price/total
- Terms and conditions textarea
- Payment terms field
- GST/Tax calculation
- PO number and date

### For Bill of Supply:
Same structure but with:
- Customer/Seller sections
- Invoice number and date
- HSN codes for items (optional)
- IGST/CGST/SGST calculation (Indian GST)
- Reverse charge section

---

## FormSection Component Benefits

### Before (Manual approach)
```tsx
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Icon /> Title
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <Label>Field 1</Label>
      <Input ... />
    </div>
    <div>
      <Label>Field 2</Label>
      <Input ... />
    </div>
    {/* More fields */}
  </CardContent>
</Card>
```
**Problems:** Repetitive, hard to maintain, 60+ lines per component

### After (FormSection approach)
```tsx
const FIELDS = [
  { name: "field1", label: "Field 1", ... },
  { name: "field2", label: "Field 2", ... },
]

return (
  <FormSection
    title="Title"
    icon={Icon}
    fields={FIELDS}
    data={formData}
    errors={errors}
    onChange={onChange}
    onBlur={onBlur}
    shouldShowError={shouldShowError}
  />
)
```
**Benefits:** Clean, maintainable, ~30 lines per component, reusable fields

---

## Complete File Checklist

```
lib/salary-slip/
  ✅ types.ts              - All interfaces
  ✅ constants.ts          - Defaults, patterns, sample data
  ✅ schema.ts             - Zod validation
  ✅ calculations.ts       - Business logic
  ✅ calculations.test.ts  - 8+ tests (ALL PASSING)
  ✅ index.ts              - Barrel export

lib/hooks/
  ✅ use-salary-slip-form.ts  - State management

components/documents/salary-slip/
  ✅ form-sections/
     ✅ period-details.tsx      - FormSection based
     ✅ employee-details.tsx    - FormSection based
     ✅ company-details.tsx     - FormSection based
     ✅ earnings.tsx            - FormSection based
     ✅ deductions.tsx          - FormSection based
     ✅ banking-details.tsx     - FormSection based
  ✅ salary-slip-form.tsx       - 2-column layout
  ✅ salary-slip-preview.tsx    - Professional preview

app/
  ✅ salary-slip/page.tsx       - Main page
```

---

## Testing URLs

```
Development:
http://localhost:3000/salary-slip  - Main salary slip form
http://localhost:3000/test-salary-slip-form  - Form test page

Test each:
- Form inputs work (onChange fires)
- Preview updates in real-time
- All calculations display correctly
- Mobile responsive design works
- Dark mode looks good
```

---

## Summary: FormSection is Key

**Before Refactor:**
- 6 form components, each ~100 lines
- Lots of Card/Input/Label repetition
- Hard to maintain consistent design
- ~600 lines of UI code

**After Refactor (Using FormSection):**
- 6 form components, each ~50-60 lines
- FormSection handles all styling/layout
- Consistent professional design
- Easy to add new fields (just add to array)
- ~300 lines of UI code

**The Secret:** Use `@/components/shared/form-section` for ALL form-based documents!

---

## Next Steps: Build Quotation

Follow this exact pattern for Quotation, PO, Bill of Supply, etc:
1. Copy salary-slip foundation and adapt
2. Define types for quotation
3. Create calculations
4. Create form hook
5. **Create 5-6 form sections using FormSection component**
6. Create professional preview
7. Create main form component (2-column layout)
8. Create page component
