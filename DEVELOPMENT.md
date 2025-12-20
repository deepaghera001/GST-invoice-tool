# Development Guide

## Quick Start

1. Install dependencies (handled automatically by shadcn CLI)
2. Set up environment variables
3. Run `npm run dev`
4. Open http://localhost:3000

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

// 3. Constants
const MAX_ITEMS = 10

// 4. Component/Function
export function Component({ }: Props) {
  // ...
}
```

## Common Tasks

### Adding a New Payment Provider

See [lib/services/payment/README.md](./lib/services/payment/README.md)

### Adding a New Document Type

See [lib/services/generators/README.md](./lib/services/generators/README.md)

### Updating Validation Rules

See [lib/validation/README.md](./lib/validation/README.md)

### Adding Reference Data

See [lib/suggestions/README.md](./lib/suggestions/README.md)

## Debugging

### Validation Issues

```typescript
// Add console logs in validator
console.log('[v0] Validating field:', fieldName, value)
const error = FieldValidator.validateField(fieldName, value)
console.log('[v0] Validation result:', error)
```

### Suggestion Issues

```typescript
// Add console logs in provider
console.log('[v0] Searching HSN codes:', query)
const results = searchHSNCodes(query)
console.log('[v0] Found results:', results.length)
```

### Payment Issues

Check:
1. Environment variables are set correctly
2. Razorpay script loads (check network tab)
3. Server action returns valid order data
4. Payment verification succeeds on server

## Performance Tips

1. **Debounce Search**: Use debounce for suggestion searches
2. **Memoize Calculations**: Use `useMemo` for expensive calculations
3. **Lazy Load**: Lazy load heavy components if needed
4. **Optimize Validation**: Validate only changed fields

## Best Practices

### Validation

- Always validate on both client and server
- Show errors only after field interaction
- Provide clear, actionable error messages
- Use success indicators for positive feedback

### Suggestions

- Limit results to 10-20 items
- Show loading states during search
- Include helpful metadata
- Auto-fill related fields when possible

### Components

- Keep components under 300 lines
- Extract reusable logic to hooks
- Use composition over complex props
- Separate business logic from UI

### Security

- Never expose secrets to client
- Validate all inputs on server
- Use parameterized queries
- Implement rate limiting for APIs

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Zod Documentation](https://zod.dev/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Razorpay Docs](https://razorpay.com/docs/)
