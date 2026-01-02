# Shareholders Agreement - Developer Quick Reference

## 📂 Key Files Quick Links

| File | Purpose |
|------|---------|
| `app/shareholders-agreement/page.tsx` | Main route page |
| `components/documents/shareholders-agreement/shareholders-agreement-form.tsx` | Form container & state |
| `components/documents/shareholders-agreement/shareholders-agreement-preview.tsx` | PDF preview |
| `lib/hooks/use-shareholders-agreement-form.ts` | Form logic hook |
| `lib/shareholders-agreement/types.ts` | TypeScript interfaces |
| `lib/shareholders-agreement/constants.ts` | Defaults & pricing |

---

## 🔌 How It Works

### 1. Form Submission Flow
```
User fills form
     ↓
validateForm() checks all fields
     ↓
captureShareholdersAgreementPreviewHTML() grabs DOM
     ↓
POST /api/generate-pdf with HTML
     ↓
PDF blob returned
     ↓
Browser downloads file
```

### 2. Shareholder Management
```typescript
// Add shareholder
handleAddShareholder() 
  → appends to shareholders array
  → re-renders form sections

// Remove shareholder
handleRemoveShareholder(index)
  → removes from array
  → validation updates total shareholding

// Update shareholder
handleShareholderChange(index, field, value)
  → updates specific shareholder field
  → triggers total shareholding recalculation
```

### 3. State Management
```typescript
const {
  formData,           // All form data
  errors,             // Validation errors
  isSectionComplete,  // Boolean for each section
  handleChange,       // Input change handler
  handleCheckboxChange, // Multi-select/toggle handler
  handleAddShareholder, // Add shareholder
  handleRemoveShareholder, // Remove shareholder
  validateForm,       // Full form validation
  resetForm,          // Reset to defaults
} = useShareholdersAgreementForm()
```

---

## 🎯 Adding New Fields

### Example: Add "Registration Date" to Company Details

**Step 1:** Update type in `lib/shareholders-agreement/types.ts`
```typescript
export interface CompanyDetails {
  // ... existing fields
  registrationDate?: string // Add this
}
```

**Step 2:** Update default in `lib/shareholders-agreement/constants.ts`
```typescript
company: {
  // ... existing
  registrationDate: "",
}
```

**Step 3:** Add input in `components/documents/shareholders-agreement/form-sections/company-details.tsx`
```typescript
<div>
  <label className="text-sm font-medium mb-2 block">Registration Date</label>
  <input
    type="date"
    name="company.registrationDate"
    value={formData.company.registrationDate || ""}
    onChange={onChange}
    className="w-full px-3 py-2 border border-input rounded-md text-sm"
  />
</div>
```

**Step 4:** Add to preview in `shareholders-agreement-preview.tsx`
```typescript
<p><strong>Registration Date:</strong> {data.company?.registrationDate || "N/A"}</p>
```

---

## ✅ Form Validation Rules

### Built-in Validations
- Company name: required, min 2 chars
- Date: cannot be future date
- Email: valid format
- Shareholding: 1-100, total must be 100
- Shares: positive integer
- Lock-in: ≥ 0
- CIN: 21 alphanumeric (if provided)

### Custom Validation
```typescript
// In use-shareholders-agreement-form.ts
const { isValid, errors } = validateForm()

if (!isValid) {
  // errors object contains field-level messages
  console.log(errors["company.companyName"])
}
```

---

## 🎨 Styling Patterns

### Form Section
```tsx
<div className="space-y-6">
  <div className="flex items-center gap-2">
    <IconComponent className="h-5 w-5 text-primary" />
    <h2 className="text-xl font-semibold">Title</h2>
    {isCompleted && <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Completed</span>}
  </div>
  
  <Card className="p-6 space-y-4">
    {/* Fields here */}
  </Card>
</div>
```

### Input Field
```tsx
<div>
  <label className="text-sm font-medium mb-2 block">
    Label {required && <span className="text-red-500">*</span>}
  </label>
  <input
    type="text"
    name="path.to.field"
    value={formData.path.to.field}
    onChange={onChange}
    className="w-full px-3 py-2 border border-input rounded-md text-sm"
  />
</div>
```

---

## 📄 PDF Generation

### Capturing Content
```typescript
// Called on form submit
const htmlContent = captureShareholdersAgreementPreviewHTML()
```

**Element Requirements:**
- Preview must have ID: `shareholders-agreement-preview`
- All content must be in this element
- Styles are captured from `<head>`

### PDF Request Format
```typescript
POST /api/generate-pdf
{
  htmlContent: "<html>...</html>",
  filename: "shareholders-agreement-xyz.pdf"
}
```

---

## 🐛 Common Issues & Solutions

### "Shareholding must equal 100%"
```typescript
// Check real-time calculation
formData.shareholders.reduce((sum, sh) => sum + (sh.shareholding || 0), 0)
// Should equal 100
```

### "Cannot add shareholder"
- Check `handleAddShareholder` is properly connected
- Verify form section is passing callback

### PDF generation fails
- Ensure `shareholders-agreement-preview` element exists
- Check `/api/generate-pdf` is reachable
- Verify HTML content is valid

---

## 🔄 Conditional Rendering Examples

### Show field only if transfer allowed
```typescript
{formData.shareTransfer.transferAllowed && (
  <div>{/* ROFR field */}</div>
)}
```

### Show section only if enabled
```typescript
{formData.tagAlongDragAlong.enableTagAlong && (
  <div>{/* Tag-along % field */}</div>
)}
```

---

## 📊 Data Calculations

### Total Shareholding
```typescript
const totalShareholding = formData.shareholders.reduce(
  (sum: number, sh: any) => sum + (sh.shareholding || 0), 
  0
)
// 0-100, must be exactly 100 for form to submit
```

### Total Shares
```typescript
const totalShares = formData.shareholders.reduce(
  (sum: number, sh: any) => sum + (sh.noOfShares || 0), 
  0
)
```

---

## 🚀 Performance Tips

- Use `useMemo` for calculated values
- Debounce validation on large forms
- Lazy load preview for large documents
- Use `React.memo()` for section components if needed

---

## 📝 Component APIs

### Form Component Props
```typescript
interface ShareholdersAgreementFormProps {
  formData: ShareholdersAgreementFormData
  onChange: (e: ChangeEvent<HTMLInputElement | ...>) => void
  onBlur?: (fieldName: string, value: any) => void
  errors?: ShareholdersAgreementValidationErrors
  shouldShowError?: (fieldName: string) => boolean
  isCompleted?: boolean
}
```

---

## 💡 Pro Tips

1. **Testing:** Use `DEFAULT_SHAREHOLDERS_AGREEMENT_DATA` for test data
2. **Debugging:** Add `console.log(formData)` in handleChange to debug state
3. **UI:** Error state uses `shouldShowError()` - only shows after field blur
4. **Validation:** Run `validateForm()` before submit
5. **Preview:** Live updates happen via `useMemo` on formData change

---

**Last Updated:** January 2, 2026
**Status:** Production Ready ✅
