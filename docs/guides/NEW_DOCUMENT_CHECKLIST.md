# ✅ New Document Type Implementation Checklist

**Use this checklist when adding a new document type (Invoice, Bill of Supply, Quotation, etc.)**

---

## 📚 Pre-Implementation Reading (5 min)

- [ ] Read [DOCS_HOME.md](DOCS_HOME.md) - Architecture overview
- [ ] Read [PATTERN_ARCHITECTURE.md](PATTERN_ARCHITECTURE.md) - Visual layout patterns
- [ ] Review [app/invoice/page.tsx](app/invoice/page.tsx) - Working example
- [ ] Review [components/documents/invoice/invoice-form.tsx](components/documents/invoice/invoice-form.tsx) - Form structure

---

## 📁 Step 1: Create Type Definitions (10 min)

**File:** `lib/[type]/types.ts`

- [ ] Create `[Type]Data` interface with all required fields
- [ ] Create `[Type]Item` interface (if applicable)
- [ ] Create `[Type]Totals` interface (if applicable)
- [ ] Export all types
- [ ] Add JSDoc comments

**Reference:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md#step-1-define-your-types-15-min)

---

## 🔒 Step 2: Create Validation Schema (15 min)

**File:** `lib/[type]/schema.ts`

- [ ] Create Zod schema for each interface
- [ ] Add field-level validation (min/max, patterns, etc.)
- [ ] Add cross-field validation (date checks, dependencies, etc.)
- [ ] Export types from schema: `z.infer<typeof schema>`
- [ ] Test schema with sample data

**Reference:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md#step-2-create-validation-schema-20-min)

---

## 🧮 Step 3: Create Constants & Calculations (15 min)

**Files:** `lib/[type]/constants.ts` and `lib/[type]/calculations.ts`

**constants.ts:**
- [ ] Define REGEX patterns (GSTIN, phone, etc.)
- [ ] Define DEFAULT values
- [ ] Define TAX rates
- [ ] Define TEXT strings

**calculations.ts:**
- [ ] Create calculation functions (totals, taxes, etc.)
- [ ] Export calculation results as interface
- [ ] Use for memoization in hook

**Reference:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md#step-3-create-constants-10-min)

---

## 🎣 Step 4: Create Form Hook (30 min)

**File:** `lib/hooks/use-[type]-form.ts`

- [ ] Import schema and types
- [ ] Create DEFAULT_FORM_DATA constant
- [ ] Create form hook with useState
- [ ] Implement `handleChange()` method
- [ ] Implement `handleBlur()` method
- [ ] Implement `validateForm()` method
- [ ] Implement `shouldShowError()` helper
- [ ] Use useMemo for calculations
- [ ] Return all values from hook

**Check:**
- [ ] Nested field updates work
- [ ] Validation errors populate
- [ ] Calculations memoized

**Reference:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md#step-4-create-form-hook-30-min)

---

## 🎨 Step 5: Create Form Component (45 min)

**File:** `components/documents/[type]/[type]-form.tsx`

- [ ] **CRITICAL: 2-Column Layout**
  - [ ] Use `grid lg:grid-cols-2 gap-8`
  - [ ] Left column for form
  - [ ] Right column for preview
  - [ ] Preview uses `sticky top-8 h-fit`

- [ ] **Form Structure (Left Side)**
  - [ ] Title section (h2 text-3xl)
  - [ ] Subtitle (muted-foreground)
  - [ ] Info/summary box with first animation
  - [ ] Form sections with staggered animations
  - [ ] Download button as final section

- [ ] **Animations**
  - [ ] Info box: `animate-in fade-in slide-in-from-top-2 duration-200`
  - [ ] Section 1: `delay-75`
  - [ ] Section 2: `delay-150`
  - [ ] Section 3: `delay-225`
  - [ ] Section 4: `delay-300`
  - [ ] Section 5: `delay-375`
  - [ ] Download: `delay-450`

- [ ] **Preview Integration (Right Side)**
  - [ ] Import preview component
  - [ ] Pass `formData` prop
  - [ ] Pass `calculatedData` prop
  - [ ] Preview updates in real-time

- [ ] **Form Submission**
  - [ ] handleSubmit validates form
  - [ ] Shows error toast if invalid
  - [ ] Shows success toast if valid
  - [ ] Calls API to generate PDF

**Reference:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md#step-5-create-form-component-critical--2-column-layout) and [REFERENCE.md](REFERENCE.md#-2-column-layout--preview-components)

---

## 📝 Step 6: Create Form Sections (45 min)

**Files:** `components/documents/[type]/form-sections/*.tsx`

For each section:
- [ ] Create Card wrapper
- [ ] Add icon in CardHeader
- [ ] Add descriptive CardTitle
- [ ] Add FormFields in CardContent
- [ ] Bind to formData
- [ ] Bind to error handling
- [ ] Pass onChange, onBlur, shouldShowError

**Naming:**
- [ ] `seller-details.tsx`
- [ ] `buyer-details.tsx`
- [ ] `item-details.tsx` (if applicable)
- [ ] `tax-details.tsx` (if applicable)

**Check:**
- [ ] All fields properly labeled
- [ ] Placeholders helpful
- [ ] Error states work
- [ ] Validation triggers on blur

**Reference:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md#step-6-create-form-sections-20-min) and [REFERENCE.md](REFERENCE.md#form-section-animation-pattern)

---

## 👁️ Step 7: Create Preview Component (30 min)

**File:** `components/documents/[type]/[type]-preview.tsx`

- [ ] Accept `formData` prop
- [ ] Accept `calculatedData` prop
- [ ] Render document-like preview
- [ ] Show all relevant information
- [ ] Display calculated totals
- [ ] Use professional styling
- [ ] Update reactively as form changes

**Content Should Include:**
- [ ] Document header (title, number, date)
- [ ] Seller/From information
- [ ] Buyer/To information
- [ ] Items/details table
- [ ] Calculated totals
- [ ] Tax information

**Styling:**
- [ ] `border rounded-lg bg-white p-6 shadow-sm`
- [ ] Professional table layout
- [ ] Clear visual hierarchy
- [ ] Format currency values
- [ ] Responsive to content

**Reference:** [REFERENCE.md](REFERENCE.md#preview-component-pattern)

---

## 📄 Step 8: Create PDF Generator (20 min)

**File:** `lib/services/generators/[type]-generator.ts`

- [ ] Implement `PDFGenerator` interface
- [ ] Create HTML template for PDF
- [ ] Include all document details
- [ ] Style for print/PDF format
- [ ] Handle currency formatting
- [ ] Test PDF generation

**Template Must Include:**
- [ ] Document header
- [ ] Seller details
- [ ] Buyer details
- [ ] Items table
- [ ] Calculations/totals
- [ ] Footer/compliance info

**Check:**
- [ ] PDF generates without errors
- [ ] Layout matches preview
- [ ] All data appears
- [ ] Formatting looks professional

**Reference:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md#step-8-create-pdf-generator-20-min)

---

## 🔧 Step 9: Register in Factory (5 min)

**File:** `lib/services/generators/generator-factory.ts`

- [ ] Import new generator class
- [ ] Import new form data type
- [ ] Add case to switch statement
- [ ] Return new generator instance
- [ ] Verify generator registration

**Check:**
- [ ] Type inference works
- [ ] Factory returns correct generator
- [ ] No TypeScript errors

**Reference:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md#step-9-register-in-factory-5-min)

---

## 📍 Step 10: Create Page Component (10 min)

**File:** `app/[type]/page.tsx`

- [ ] Import form component
- [ ] Set metadata.title
- [ ] Create professional header
- [ ] Add back button to home
- [ ] Add footer with copyright
- [ ] Use `max-w-7xl` container (NOT max-w-3xl)
- [ ] Use gradient background: `from-slate-50 to-slate-100`

**Check:**
- [ ] Page renders correctly
- [ ] Back button works
- [ ] Layout matches invoice page
- [ ] Responsive on mobile

**Reference:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md#step-7-create-page-component-10-min)

---

## 📡 Step 11: Create API Route (10 min)

**File:** `app/api/generate-[type]/route.ts`

- [ ] Accept POST request with formData
- [ ] Validate using schema
- [ ] Get correct generator from factory
- [ ] Generate PDF
- [ ] Return PDF as blob/buffer
- [ ] Handle errors gracefully

**Check:**
- [ ] API route works
- [ ] PDF downloads correctly
- [ ] Error handling works

**Reference:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md#step-10-update-navigation-5-min)

---

## 🏠 Step 12: Update Home Page Navigation (5 min)

**File:** `app/page.tsx`

- [ ] Add new document to DOCUMENTS array
- [ ] Set correct title
- [ ] Set correct href: `/[type]`
- [ ] Update home page navigation
- [ ] Verify link works

**Check:**
- [ ] Link appears on home page
- [ ] Clicking navigates to new page
- [ ] New page loads correctly

**Reference:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md#step-10-update-navigation-5-min)

---

## 🧪 Testing Checklist (20 min)

### Form Testing
- [ ] All fields accept input
- [ ] Validation works (try invalid data)
- [ ] Error messages display
- [ ] Errors clear when fixed
- [ ] Preview updates as you type

### Layout Testing
- [ ] 2-column layout on desktop
- [ ] Stacks to 1-column on mobile
- [ ] Animations run smoothly
- [ ] All animations have correct delays
- [ ] Preview sticks while scrolling

### Preview Testing
- [ ] Shows correct document number
- [ ] Shows seller details
- [ ] Shows buyer details
- [ ] Shows items/details
- [ ] Calculates totals correctly
- [ ] Updates in real-time

### PDF Testing
- [ ] Generate PDF button works
- [ ] PDF downloads
- [ ] PDF has all data
- [ ] PDF formatting looks professional
- [ ] PDF matches preview

### Mobile Testing
- [ ] Page loads on mobile
- [ ] Form sections readable
- [ ] Can fill all fields
- [ ] Download button works
- [ ] PDF generates correctly

---

## 🎨 Design Verification

- [ ] Form sections have Card wrapper
- [ ] Each section has icon
- [ ] Hover effects work (border-primary/30)
- [ ] Colors consistent with invoice
- [ ] Typography matches (h2, h3, labels)
- [ ] Spacing matches (space-y-6, p-6, etc.)
- [ ] Preview looks professional
- [ ] Overall design matches invoice page

---

## 🔍 Final Verification

- [ ] `npm run build` succeeds ✅
- [ ] No TypeScript errors
- [ ] No eslint warnings
- [ ] All links work
- [ ] All forms work
- [ ] PDF generation works
- [ ] Mobile responsive
- [ ] Navigation updated

---

## ✨ Common Mistakes to Avoid

❌ **Don't:**
- Use single-column layout (vertical form)
- Create form without preview
- Forget animations on sections
- Use wrong animation delays
- Miss any form sections
- Forget to update home page
- Use max-w-3xl instead of max-w-7xl
- Skip validation schema
- Miss cross-field validation
- Use different styling than invoice

✅ **Do:**
- Always use 2-column layout
- Always include live preview
- Always add staggered animations
- Follow exact delay sequence
- Include all required sections
- Update home page navigation
- Use max-w-7xl for 2-column layout
- Use Zod for validation
- Validate cross-field dependencies
- Copy styling from invoice

---

## 📞 Quick Reference Links

| Need | Link |
|------|------|
| Architecture overview | [DOCS_HOME.md](DOCS_HOME.md) |
| Step-by-step guide | [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) |
| Code patterns | [REFERENCE.md](REFERENCE.md) |
| Layout patterns | [PATTERN_ARCHITECTURE.md](PATTERN_ARCHITECTURE.md) |
| Working example | [Invoice page](app/invoice/page.tsx) |
| Form example | [Invoice form](components/documents/invoice/invoice-form.tsx) |
| Preview example | [Invoice preview](components/documents/invoice/invoice-preview.tsx) |
| Update summary | [DOCUMENTATION_UPDATES.md](DOCUMENTATION_UPDATES.md) |

---

## 🎓 Tips for Success

1. **Copy from Invoice** - The invoice page is the template. Copy it and change field names.
2. **Test Early** - Build after each step, don't wait until the end.
3. **Use the Patterns** - Copy code from REFERENCE.md, don't write from scratch.
4. **Check Mobile** - Always test on mobile to ensure responsive design.
5. **Verify Animations** - Make sure all animations run smoothly.
6. **Preview Matters** - The live preview is what makes this special, don't skip it.
7. **Ask Questions** - If uncertain, reference the working invoice implementation.

---

**Total Time:** ~3-4 hours for a new document type  
**Difficulty:** Intermediate  
**Success Rate:** High (following this checklist)

**You've got this! 🚀**
