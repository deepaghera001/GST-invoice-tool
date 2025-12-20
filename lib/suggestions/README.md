# Suggestion System

## Overview
Smart autocomplete and data helpers to improve form filling experience.

## Structure

```
suggestions/
├── data/              # Reference data
│   ├── gstin-states.ts
│   ├── common-hsn-codes.ts
│   ├── invoice-templates.ts
│   └── index.ts
└── providers/         # Suggestion providers
    ├── suggestion-provider.ts
    └── index.ts
```

## Features

### 1. HSN Code Search
Search 50+ common HSN/SAC codes with descriptions and GST rates.

```typescript
const suggestions = SuggestionProvider.getHSNSuggestions('software')
// [{ value: '9954', label: '9954 - Software development services (18% GST)', ... }]
```

### 2. GSTIN Analysis
Extract state and PAN from GSTIN automatically.

```typescript
const analysis = SuggestionProvider.analyzeGSTIN('29ABCDE1234F1Z5')
// { isValid: true, state: 'Karnataka', stateCode: '29', pan: 'ABCDE1234F' }
```

### 3. Auto-fill PAN
Extract PAN from GSTIN to reduce typing.

```typescript
const pan = SuggestionProvider.extractPANFromGSTIN('29ABCDE1234F1Z5')
// 'ABCDE1234F'
```

### 4. Invoice Number Generation
Generate formatted invoice numbers with date.

```typescript
const invoiceNum = SuggestionProvider.generateInvoiceNumber('INV-')
// 'INV-202501123'
```

### 5. GST Rate Suggestion
Get suggested CGST/SGST rates based on HSN code.

```typescript
const rates = SuggestionProvider.getGSTRateSuggestion('9954')
// { cgst: '9', sgst: '9' }
```

## Usage in React

### Hook
```typescript
import { useSuggestions } from '@/hooks/use-suggestions'

function MyComponent() {
  const {
    hsnSuggestions,
    searchHSN,
    getGSTRateForHSN,
    analyzeGSTIN,
    extractPAN,
    generateInvoiceNumber,
    invoiceTemplates,
    gstStates
  } = useSuggestions()

  // Search HSN codes
  useEffect(() => {
    searchHSN('software')
  }, [searchHSN])

  // Use suggestions
  return (
    <Combobox
      options={hsnSuggestions}
      onSelect={(hsn) => {
        const rates = getGSTRateForHSN(hsn)
        // Auto-fill tax rates
      }}
    />
  )
}
```

## Reference Data

### HSN Codes
50+ common codes across categories:
- Services (health, education, software, construction)
- IT & Electronics
- Clothing & Textiles
- Food & Beverages
- Automotive
- Furniture
- Books & Stationery

### GST States
All 38 Indian states/UTs with codes (01-38)

### Invoice Templates
4 common templates:
- Sales Invoice (SI-)
- Service Invoice (SRV-)
- Proforma Invoice (PI-)
- Export Invoice (EXP-)

## Adding New Suggestions

### 1. Add Reference Data
```typescript
// lib/suggestions/data/categories.ts
export const categories = [
  { id: 'cat1', name: 'Category 1' },
  { id: 'cat2', name: 'Category 2' },
]
```

### 2. Add Provider Method
```typescript
// lib/suggestions/providers/suggestion-provider.ts
static getCategorySuggestions(query: string) {
  return categories.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase())
  )
}
```

### 3. Update Hook
```typescript
// hooks/use-suggestions.ts
const searchCategories = useCallback((query: string) => {
  return SuggestionProvider.getCategorySuggestions(query)
}, [])

return { searchCategories, ... }
```

### 4. Use in Component
```typescript
const { searchCategories } = useSuggestions()
const suggestions = searchCategories('query')
```

## Best Practices

1. **Debounce Search**: Avoid too many re-renders
2. **Limit Results**: Show 10-20 suggestions max
3. **Include Metadata**: Add context for better UX
4. **Auto-fill Related**: When selecting HSN, auto-fill GST rates
5. **Validate After**: Always validate auto-filled values
```

```typescript file="" isHidden
