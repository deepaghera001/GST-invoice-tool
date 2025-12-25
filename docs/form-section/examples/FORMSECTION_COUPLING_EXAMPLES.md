# FormSection - Low Coupling Examples

## Problem: Tight Coupling

❌ **Before (Tightly Coupled)**
```typescript
// Validation hardcoded inside component
function BuyerDetails(props) {
  const validateGSTIN = (gstin) => {
    if (gstin.length !== 15) return "Must be 15 chars"
    // ... more hardcoded validation
  }
  
  // Component knows about specific business rules
  // Hard to reuse, hard to test, hard to extend
}
```

---

## Solution: Pluggable Design

✅ **After (Low Coupling)**

### 1. Validation in Config (Not Component)
```typescript
// validation.ts - Separate file, no imports needed
export const gstinValidation = (value: string) => {
  if (!value) return undefined  // Optional field
  if (value.length !== 15) return "GSTIN must be 15 characters"
  if (!/^[0-9A-Z]{15}$/.test(value)) return "Invalid GSTIN format"
  return undefined  // Valid
}

export const emailValidation = (value: string) => {
  if (!value.includes("@")) return "Must contain @"
  return undefined
}

// Field configuration
const BUYER_FIELDS: FormFieldConfig[] = [
  {
    name: "buyerGSTIN",
    label: "GSTIN",
    placeholder: "29AABCT1332L1ZZ",
    validate: gstinValidation,  // ← Pluggable!
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    validate: emailValidation,  // ← Pluggable!
  },
];
```

**Benefits:**
- ✅ Validation is testable (pure function)
- ✅ Reusable across documents
- ✅ Easy to modify without touching component
- ✅ No tight coupling

---

### 2. Layout Without Constraints
```typescript
// ❌ Bad: Hardcoded layout
function InvoiceDetails() {
  return (
    <div className="grid grid-cols-2">
      <div className="col-span-1">...</div>
      <div className="col-span-1">...</div>
    </div>
  )
}

// ✅ Good: Configurable layout
const INVOICE_FIELDS: FormFieldConfig[] = [
  {
    name: "invoiceNumber",
    label: "Invoice Number",
    colSpan: "half",  // ← Flexible!
  },
  {
    name: "invoiceDate",
    label: "Invoice Date",
    type: "date",
    colSpan: "half",  // ← Flexible!
  },
];

<FormSection
  fields={INVOICE_FIELDS}
  layout={{ columns: 2 }}  // ← Changeable!
/>
```

---

### 3. Transformations (Formatting Without Coupling)
```typescript
// formatters.ts - Reusable formatting functions
export const phoneFormatter = (value: string) => {
  return value.replace(/\D/g, "").slice(0, 10)
}

export const gstinFormatter = (value: string) => {
  return value.toUpperCase().slice(0, 15)
}

// Field configuration
const FIELDS: FormFieldConfig[] = [
  {
    name: "phone",
    label: "Phone",
    type: "tel",
    transform: phoneFormatter,  // ← Pluggable!
  },
  {
    name: "gstin",
    label: "GSTIN",
    transform: gstinFormatter,  // ← Pluggable!
  },
];
```

---

### 4. Conditional Fields (No Hardcoding)
```typescript
// Calculate fields dynamically - FormSection doesn't care
function MyDocumentForm() {
  const [formData, setFormData] = useState({...})
  
  // Dynamically modify fields based on form state
  const fields = INITIAL_FIELDS.map(field => ({
    ...field,
    hidden: field.name === "state" && formData.country !== "IN"
  }))
  
  return (
    <FormSection
      fields={fields}  // ← Changed based on state, not hardcoded!
    />
  )
}
```

---

### 5. Custom Field Types (Extensible)
```typescript
// ❌ Bad: Component only supports predefined types
// type?: "text" | "email" | "number"

// ✅ Good: Any custom field via children
<FormSection {...props}>
  {/* Standard fields rendered automatically */}
  {/* Custom fields via children */}
  <DateRangePicker name="dateRange" />
  <TagInput name="tags" />
  <FileUpload name="attachment" />
  <ColorPicker name="color" />
</FormSection>
```

---

## Comparison Table

| Aspect | Tightly Coupled | Low Coupling (New) |
|--------|-----------------|-------------------|
| **Validation** | Hardcoded in component | Via config callbacks |
| **Layout** | Fixed grid in JSX | Configurable via prop |
| **Transformations** | No support | Via optional transform |
| **Field types** | Limited set | Extensible via children |
| **Testing** | Hard (logic in component) | Easy (pure functions) |
| **Reusability** | Limited | High (composition) |
| **New document time** | 5-6 hours | 1-2 hours |
| **Modification** | Change component | Change config only |

---

## Why Low Coupling Matters

### Problem: Tight Coupling
```typescript
// Add feature → Modify component → Risk breaking changes
function BuyerDetails() {
  // All logic mixed together
  const validateGSTIN = () => {...}
  const handleAutoFill = () => {...}
  const calculateState = () => {...}
  // ... hundreds of lines
}
```

### Solution: Composition
```typescript
// Add feature → Just add to config → No risk
const BUYER_FIELDS = [
  { name: "...", validate: customFunc },
  { name: "...", transform: formatterFunc },
  { name: "...", hidden: conditionalFunc },
]

// FormSection doesn't care - it just renders based on config
```

---

## Rule of Thumb

✅ **In FormSection:** Layout, rendering, styling  
❌ **NOT in FormSection:** Validation logic, business rules, document-specific logic

All document-specific concerns → **In field config or children prop**

This keeps FormSection **pure, reusable, and testable**!
