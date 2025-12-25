# Development Guide

## Quick Start

1. Install dependencies (handled automatically by shadcn CLI)
2. Set up environment variables
3. Run `npm run dev`
4. Open http://localhost:3000

## Environment Setup

### Development Mode

This application supports two modes of operation:

1. **Development Mode** (`NODE_ENV=development`):
   - Payment integration is bypassed
   - PDFs can be generated directly without payment processing
   - Ideal for local development and testing

2. **Production Mode** (`NODE_ENV=production`):
   - Full payment integration with Razorpay
   - Requires valid Razorpay credentials
   - Used in production deployments

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Razorpay Configuration (required for production)
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_here

# Development Settings
NODE_ENV=development
```

**Note**: For development, you don't need to configure the Razorpay keys. The application will work in development mode by default.

## Development Workflow

### 1. Understanding the Codebase

Start by reading:
- `README.md` - Overview and features
- `ARCHITECTURE.md` - System design and patterns
- Module-specific READMEs in `lib/` subdirectories

### 2. Making Changes

#### Adding a New Form Field

1. **Update Types**:
```typescript
// lib/core/types/invoice.types.ts
export interface InvoiceData {
  // ... existing fields
  newField: string
}
```

2. **Add Validation**:
```typescript
// lib/validation/schemas/invoice.schema.ts
export const invoiceSchema = z.object({
  // ... existing fields
  newField: z.string().min(1, "New field is required")
})
```

3. **Update Form Component**:
```typescript
// components/form-sections/your-section.tsx
<FormField label="New Field" htmlFor="newField" required>
  <Input
    id="newField"
    name="newField"
    value={formData.newField}
    onChange={onChange}
    onBlur={() => onBlur?.('newField', formData.newField)}
  />
</FormField>
```

4. **Update PDF Generator** (if needed):
```typescript
// lib/services/generators/invoice-pdf-generator.ts
// Add field to PDF layout
```

#### Adding Validation Rules

1. **Simple Validation**:
```typescript
fieldName: z.string()
  .min(5, "Minimum 5 characters")
  .max(100, "Maximum 100 characters")
  .regex(/pattern/, "Invalid format")
```

2. **Custom Validation**:
```typescript
fieldName: z.string()
  .refine(
    (val) => customLogic(val),
    { message: "Custom error message" }
  )
```

3. **Cross-field Validation**:
```typescript
export const schema = z.object({
  field1: z.string(),
  field2: z.string()
}).refine(
  (data) => data.field1 !== data.field2,
  { message: "Fields must be different", path: ["field2"] }
)
```

#### Adding Suggestions

1. **Add Data Source**:
```typescript
// lib/suggestions/data/your-data.ts
export const yourData = [
  { code: 'A1', name: 'Option A' },
  { code: 'B1', name: 'Option B' }
]
```

2. **Add Search Function**:
```typescript
// lib/suggestions/providers/suggestion-provider.ts
static searchYourData(query: string) {
  return yourData.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.code.includes(query)
  )
}
```

3. **Update Hook**:
```typescript
// hooks/use-suggestions.ts
const searchYourData = useCallback((query: string) => {
  return SuggestionProvider.searchYourData(query)
}, [])

return { searchYourData, ... }
```

4. **Use in Component**:
```typescript
const { searchYourData } = useSuggestions()
const [suggestions, setSuggestions] = useState([])

useEffect(() => {
  setSuggestions(searchYourData(query))
}, [query])
```

### 3. Testing Changes

#### Manual Testing Checklist

- [ ] Form validation works for all fields
- [ ] Error messages are clear and helpful
- [ ] Success states show correctly
- [ ] Suggestions load and filter properly
- [ ] Auto-fill features work
- [ ] PDF generates with correct data
- [ ] Payment flow completes successfully
- [ ] Mobile responsive design works

#### Testing Validation

```typescript
// Test in browser console
import { FieldValidator } from '@/lib/validation'

// Test field validation
FieldValidator.validateField('sellerGSTIN', '29ABCDE1234F1Z5')

// Test form validation
FieldValidator.validateForm({
  sellerName: 'Test Company',
  // ... other fields
})
```

## Code Style

### TypeScript

- Use explicit return types for functions
- Avoid `any` type
- Prefer interfaces for objects, types for unions
- Use type inference from Zod schemas

### React

- Use functional components
- Prefer hooks over class components
- Keep components small and focused
- Extract reusable logic to custom hooks

### Naming Conventions

- **Components**: PascalCase (`InvoiceForm.tsx`)
- **Files**: kebab-case (`invoice-form.tsx`)
- **Functions**: camelCase (`validateField`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_LENGTH`)
- **Types/Interfaces**: PascalCase (`InvoiceData`)

### File Organization

```typescript
// 1. Imports (external first, then internal)
import React from 'react'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// 2. Types/Interfaces
interface Props {
  // ...
}
```