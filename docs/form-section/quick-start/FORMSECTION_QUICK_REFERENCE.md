# FormSection Component - Quick Reference

## Basic Usage
```typescript
import { FormSection, type FormFieldConfig } from "@/components/shared/form-section"

const FIELDS: FormFieldConfig[] = [
  { name: "fieldName", label: "Field Label", required: true }
]

<FormSection
  title="Section Title"
  icon={IconComponent}
  fields={FIELDS}
  data={formData}
  errors={errors}
  onChange={handleChange}
/>
```

---

## Column Control
```typescript
// Make fields narrower - not full width
const FIELDS = [
  { name: "quantity", colSpan: "third" },      // 1/3 width
  { name: "price", colSpan: "third" },         // 1/3 width
  { name: "hsn", colSpan: "third" },           // 1/3 width
  
  { name: "desc", colSpan: "half" },           // 1/2 width
  { name: "date", colSpan: "half" },           // 1/2 width
  
  { name: "longText", colSpan: "full" },       // Full width
]

// Enable multi-column layout
<FormSection layout={{ columns: 3 }} />
<FormSection layout={{ columns: 2 }} />
```

---

## Number Field Configuration
```typescript
{
  name: "quantity",
  type: "number",
  min: 0.01,
  step: 0.01,           // Decimal support
  max: 9999,
  colSpan: "third",     // Narrow width
}

{
  name: "price",
  type: "number",
  step: 0.01,
  colSpan: "third",
}
```

---

## Validation (Pluggable)
```typescript
// Define validation separately - NO coupling
const validateEmail = (value: string) => {
  if (!value.includes("@")) return "Invalid email"
  return undefined
}

// Use in config
const FIELDS = [
  {
    name: "email",
    type: "email",
    validate: validateEmail,  // ← Pluggable!
  }
]
```

---

## Value Formatting
```typescript
// Transform values on input
const FIELDS = [
  {
    name: "phone",
    type: "tel",
    transform: (val) => val.replace(/\D/g, "").slice(0, 10)
  },
  {
    name: "gstin",
    transform: (val) => val.toUpperCase().slice(0, 15)
  }
]
```

---

## Conditional Fields
```typescript
// Hide/show fields based on state
const fields = INITIAL_FIELDS.map(f => ({
  ...f,
  hidden: f.name === "state" && data.country !== "IN"
}))

<FormSection fields={fields} />
```

---

## Layout Options
```typescript
// 1 column (default)
<FormSection layout={{ columns: 1 }} />

// 2 columns
<FormSection layout={{ columns: 2 }} />

// 3 columns
<FormSection layout={{ columns: 3 }} />

// Custom gap
<FormSection layout={{ columns: 2, gap: 24 }} />

// Force single column (responsive override)
<FormSection layout={{ singleColumn: true }} />
```

---

## Custom Fields via Children
```typescript
<FormSection {...props}>
  {/* Standard fields rendered automatically from config */}
  
  {/* Add custom fields here */}
  <CustomDateRange name="dateRange" />
  <TagInput name="tags" />
  <FileUpload name="attachment" />
</FormSection>
```

---

## Field Configuration Cheatsheet

```typescript
interface FormFieldConfig {
  // Required
  name: string                    // Field key
  label: string                   // Display label
  
  // Type & appearance
  type?: "text"|"textarea"|"number"|"email"|"date"|"tel"|"url"
  placeholder?: string
  
  // Layout
  colSpan?: 1|2|3|"full"|"half"|"third"
  
  // Validation
  required?: boolean
  validate?: (val) => string|undefined
  helpText?: string
  
  // Constraints
  min?: number|string
  max?: number|string
  step?: number|string
  maxLength?: number
  pattern?: string
  
  // Transform
  transform?: (val: string) => string|number
  
  // Rendering
  hidden?: boolean
}
```

---

## Common Patterns

### 2-Column Form
```typescript
const FIELDS = [
  { name: "firstName", colSpan: "half" },
  { name: "lastName", colSpan: "half" },
  { name: "email", colSpan: "full" },
]

<FormSection layout={{ columns: 2 }} fields={FIELDS} />
```

### 3-Column Item Table
```typescript
const FIELDS = [
  { name: "description", colSpan: "full" },
  { name: "qty", type: "number", colSpan: "third", step: 0.01 },
  { name: "rate", type: "number", colSpan: "third", step: 0.01 },
  { name: "hsn", colSpan: "third" },
]

<FormSection layout={{ columns: 3 }} fields={FIELDS} />
```

### With Validation
```typescript
const FIELDS = [
  {
    name: "gstin",
    validate: (val) => {
      if (val.length !== 15) return "Must be 15 characters"
      return undefined
    }
  }
]
```

---

## Migration Guide (Old to New)

### Before (Full Width Everything)
```typescript
const FIELDS = [
  { name: "qty" },
  { name: "price" },
]
// Both fields take full width (bad)
```

### After (Optimized Layout)
```typescript
const FIELDS = [
  { name: "qty", type: "number", colSpan: "third", step: 0.01 },
  { name: "price", type: "number", colSpan: "third", step: 0.01 },
]
<FormSection layout={{ columns: 3 }} />
// Fields now properly sized, responsive layout
```

---

## Key Principles

✅ **No tight coupling** - Config-driven, not component-logic driven  
✅ **Flexible layouts** - 1/2/3 columns, per-field control  
✅ **Pluggable validation** - Optional callbacks, no hardcoding  
✅ **Extensible** - Add field types via children  
✅ **Responsive** - Grid system handles breakpoints  
✅ **Type-safe** - Full TypeScript support  

---

## Pro Tips

1. **Use colSpan for narrow fields**
   ```typescript
   { type: "number", colSpan: "third" }  // Not full width
   ```

2. **Validation is optional**
   ```typescript
   // Only add if needed - no validation = undefined errors
   validate: (val) => undefined  // Always pass
   ```

3. **Transform for formatting**
   ```typescript
   transform: (val) => val.toUpperCase()  // Auto-format
   ```

4. **Children for custom logic**
   ```typescript
   <FormSection>
     {showSpecial && <SpecialWidget />}  // Conditional
   </FormSection>
   ```

5. **Layout per-section**
   ```typescript
   <BuyerDetails layout={{ columns: 1 }} />
   <ItemDetails layout={{ columns: 3 }} />
   ```

---

## TypeScript Support

```typescript
import { FormSection, type FormFieldConfig, type FormSectionLayout } from "@/components/shared/form-section"

const layout: FormSectionLayout = { columns: 2 }
const fields: FormFieldConfig[] = [...]
```

---

**FormSection is production-ready and fully flexible!** 🚀
