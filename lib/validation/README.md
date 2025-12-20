# Validation System

## Overview
Schema-based validation using Zod for type-safe, reusable validation rules.

## Structure

```
validation/
├── schemas/           # Zod schemas
│   ├── invoice.schema.ts
│   └── index.ts
└── validators/        # Validation logic
    ├── field-validator.ts
    └── index.ts
```

## Usage

### Field Validation
```typescript
import { FieldValidator } from '@/lib/validation'

const error = FieldValidator.validateField('sellerGSTIN', '29ABCDE1234F1Z5')
if (error) {
  console.error(error) // "Invalid GSTIN format"
}
```

### Form Validation
```typescript
import { FieldValidator } from '@/lib/validation'

const { isValid, errors } = FieldValidator.validateForm(formData)
if (!isValid) {
  console.log(errors)
  // { sellerName: "Seller name must be at least 2 characters", ... }
}
```

### React Hook
```typescript
import { useFormValidation } from '@/hooks/use-form-validation'

const {
  errors,
  validateField,
  validateForm,
  markFieldTouched,
  shouldShowError,
  clearErrors
} = useFormValidation()

// Validate on blur
const handleBlur = (fieldName: string, value: any) => {
  markFieldTouched(fieldName)
  validateField(fieldName, value)
}

// Show error if touched
{shouldShowError('email') && <span>{errors.email}</span>}
```

## Validation Rules

### GSTIN
- Format: 15 characters
- Pattern: 2 digits (state) + 10 char PAN + entity code + Z + checksum
- Example: `29ABCDE1234F1Z5`

### PAN
- Format: 10 characters
- Pattern: 5 letters + 4 digits + 1 letter
- Example: `ABCDE1234F`

### HSN Code
- Format: 4, 6, or 8 digits
- Examples: `9983`, `998314`, `99831400`

### Invoice Number
- Min: 1 character
- Max: 50 characters
- Allowed: Letters, numbers, hyphens, slashes
- Examples: `INV-2025-001`, `SI/2025/001`

### Invoice Date
- Format: YYYY-MM-DD
- Range: Last 3 months to next 1 month

## Adding New Validation

### 1. Update Schema
```typescript
// lib/validation/schemas/invoice.schema.ts
export const invoiceSchema = z.object({
  // ... existing fields
  newField: z.string()
    .min(5, "Must be at least 5 characters")
    .max(100, "Must be less than 100 characters")
    .regex(/pattern/, "Invalid format")
})
```

### 2. Use in Components
```typescript
const error = validateField('newField', value)
```

## Best Practices

1. **Centralize Rules**: Define all validation in schemas
2. **Helpful Messages**: Provide clear, actionable error messages
3. **Type Safety**: Let Zod infer types automatically
4. **Reuse**: Use same schema on client and server
5. **Progressive**: Show errors only after field interaction
