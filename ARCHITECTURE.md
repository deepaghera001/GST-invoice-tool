# Architecture Documentation

## Overview
This application uses a modular, service-oriented architecture that separates concerns and enables easy extension with proper validation and smart suggestions.

## Core Principles

### 1. Separation of Concerns
- **Types** (`lib/core/types/`): All interfaces and type definitions
- **Services** (`lib/services/`): Business logic and external integrations
- **Validation** (`lib/validation/`): Schema-based validation with Zod
- **Suggestions** (`lib/suggestions/`): Smart autocomplete and data helpers
- **Actions** (`lib/actions/`): Server actions for secure operations
- **Utils** (`lib/utils/`): Pure utility functions
- **Components** (`components/`): UI components
- **Hooks** (`hooks/`): Reusable React hooks
- **API Routes** (`app/api/`): Thin HTTP handlers

### 2. Security by Design
- Sensitive keys never exposed to client
- Server actions handle payment initialization
- Payment verification on server only
- Environment variables properly scoped
- Input validation on both client and server

### 3. Factory Pattern
Used for creating payment providers and PDF generators, enabling:
- Runtime provider selection
- Easy registration of new implementations
- Dependency injection
- Testability

### 4. Strategy Pattern
Payment providers and PDF generators implement common interfaces:
- `PaymentProvider` interface for all payment gateways
- `PDFGenerator` interface for all document generators

### 5. Dependency Inversion
High-level modules (DocumentService) depend on abstractions (interfaces), not concrete implementations.

### 6. Validation Layer
- Schema-based validation using Zod
- Field-level and form-level validation
- Reusable validation schemas
- Type-safe error handling

### 7. Suggestion System
- Data-driven suggestions for common fields
- Smart autocomplete for HSN codes
- GSTIN analysis and state detection
- Auto-fill PAN from GSTIN

## Module Structure

```
lib/
├── core/
│   └── types/              # Type definitions
│       ├── document.types.ts
│       ├── invoice.types.ts
│       ├── payment.types.ts
│       └── generator.types.ts
├── services/
│   ├── payment/            # Payment providers
│   │   ├── base-payment-provider.ts
│   │   ├── razorpay-provider.ts
│   │   └── payment-factory.ts
│   ├── generators/         # PDF generators
│   │   ├── base-pdf-generator.ts
│   │   ├── dom-html-generator.ts
│   │   └── generator-factory.ts
│   └── document-service.ts # Orchestration
├── validation/             # Validation system
│   ├── schemas/           # Zod schemas
│   │   ├── invoice.schema.ts
│   │   └── index.ts
│   └── validators/        # Validation logic
│       ├── field-validator.ts
│       └── index.ts
├── suggestions/            # Suggestion system
│   ├── data/              # Reference data
│   │   ├── gstin-states.ts
│   │   ├── common-hsn-codes.ts
│   │   ├── invoice-templates.ts
│   │   └── index.ts
│   └── providers/         # Suggestion providers
│       ├── suggestion-provider.ts
│       └── index.ts
├── actions/                # Server actions
│   └── payment-actions.ts
└── utils/                  # Pure functions
    ├── invoice-calculator.ts
    ├── number-to-words.ts
    └── formatters.ts

components/
├── ui/                     # Base UI components
│   ├── form-field.tsx     # Field with validation display
│   ├── combobox.tsx       # Searchable select
│   └── ...
└── form-sections/          # Form section components
    ├── seller-details.tsx
    ├── buyer-details.tsx
    ├── invoice-details.tsx
    ├── item-details.tsx
    └── tax-details.tsx

hooks/
├── use-form-validation.ts  # Form validation hook
└── use-suggestions.ts      # Suggestions hook
```

## Security Architecture

### Client-Server Separation
```
Client (Browser)
  ↓ Server Action
Server Action Layer (payment-actions.ts)
  ↓ Service Call
Service Layer (document-service.ts)
  ↓ Provider
Payment Provider (razorpay-provider.ts)
  ↓ External API
Razorpay API
```

### Environment Variables
- `RAZORPAY_KEY_ID` - Server only
- `RAZORPAY_KEY_SECRET` - Server only
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Public key, safe for client

## Validation System

### Schema-Based Validation
All validation rules are defined in Zod schemas:
- **Centralized rules**: Single source of truth
- **Type safety**: Automatic TypeScript types
- **Reusable**: Use same schema on client and server
- **Composable**: Build complex validations from simple ones

### Field Validation
```typescript
import { FieldValidator } from '@/lib/validation'

// Validate single field
const error = FieldValidator.validateField('sellerGSTIN', '29ABCDE1234F1Z5')

// Validate entire form
const { isValid, errors } = FieldValidator.validateForm(formData)
```

### Form Integration
The `useFormValidation` hook provides:
- Real-time field validation
- Form-level validation
- Touch tracking (show errors after blur)
- Error state management

## Suggestion System

### Smart Autocomplete
The suggestion system provides intelligent suggestions for:
- **HSN Codes**: Search 50+ common codes with GST rates
- **GSTIN Analysis**: Extract state and PAN from GSTIN
- **Invoice Numbers**: Auto-generate formatted numbers
- **Tax Rates**: Auto-fill based on HSN code

### Usage
```typescript
import { useSuggestions } from '@/hooks/use-suggestions'

const { searchHSN, analyzeGSTIN, generateInvoiceNumber } = useSuggestions()

// Search HSN codes
const suggestions = searchHSN('software')

// Analyze GSTIN
const { state, pan } = analyzeGSTIN('29ABCDE1234F1Z5')

// Generate invoice number
const invoiceNum = generateInvoiceNumber('INV-')
```

## Extension Points

### Adding New Payment Provider
1. Create class extending `BasePaymentProvider`
2. Implement `createOrder` and `verifyPayment`
3. Register in `PaymentFactory`
4. Update server action to support new provider

Example:
```typescript
// lib/services/payment/stripe-provider.ts
export class StripeProvider extends BasePaymentProvider {
  async createOrder(amount: number, currency: string) {
    // Implementation
  }
  
  async verifyPayment(data: any) {
    // Implementation
  }
}

// Register in factory
PaymentFactory.register('stripe', () => new StripeProvider())
```

### Adding New Document Type
1. Define types in `core/types/`
2. Create validation schema in `validation/schemas/`
3. Create calculator in `utils/` if needed
4. Create generator extending `BasePDFGenerator`
5. Register in `GeneratorFactory`

The system primarily uses HTML-to-PDF conversion:
- HTML-to-PDF: Capture HTML preview and convert to PDF via Playwright

Example:
```typescript
// lib/core/types/quotation.types.ts
export interface QuotationData extends BaseDocumentData {
  // Fields
}

// lib/validation/schemas/quotation.schema.ts
export const quotationSchema = z.object({
  // Validation rules
})

// lib/services/generators/quotation-pdf-generator.ts
export class QuotationPDFGenerator extends BasePDFGenerator {
  supports(documentType: string): boolean {
    return documentType === "quotation" // Use appropriate document type
  }
  
  async generate(data: QuotationData): Promise<Buffer> {
    // For HTML-to-PDF approach, generate HTML content from the data
    // The HTML will be converted to PDF via Playwright in the API route
  }
}
```

### Adding New Validation Rules
1. Update schema in `validation/schemas/`
2. Add custom validators if needed
3. Update error messages
4. Test with FieldValidator

Example:
```typescript
// Add custom validation
const customField = z.string()
  .refine(
    (val) => customLogic(val),
    { message: "Custom error message" }
  )
```

### Adding New Suggestions
1. Add reference data to `suggestions/data/`
2. Add methods to `SuggestionProvider`
3. Update `useSuggestions` hook if needed
4. Use in form components

Example:
```typescript
// lib/suggestions/data/countries.ts
export const countries = [...]

// lib/suggestions/providers/suggestion-provider.ts
static getCountrySuggestions(query: string) {
  return countries.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase())
  )
}
```

### Adding New Features
- **Validation**: Create schemas in `lib/validation/schemas/`
- **Suggestions**: Add data to `lib/suggestions/data/`
- **Templates**: Create templates in `lib/templates/`
- **Formatters**: Add to `lib/utils/formatters.ts`
- **Server Actions**: Add to `lib/actions/`
- **Hooks**: Create custom hooks in `hooks/`

## Benefits

### Maintainability
- Clear separation makes code easy to understand
- Each module has a single responsibility
- Changes are isolated to specific modules
- Validation rules centralized in schemas

### Security
- Sensitive operations on server only
- Keys never exposed to client
- Payment verification server-side
- Input validation prevents injection attacks

### Extensibility
- New payment providers: Just add a class
- New document types: Just add a generator
- New validation rules: Update schemas
- New suggestions: Add reference data

### User Experience
- Real-time validation feedback
- Smart autocomplete reduces typing
- Auto-fill from related fields (PAN from GSTIN)
- Contextual hints and suggestions

### Testability
- Pure functions are easy to test
- Factories enable dependency injection
- Interfaces enable mocking
- Validators can be tested independently

### Scalability
- Services can be extracted to microservices
- Generators can run in workers/lambdas
- Validation schemas shared across services
- Clear boundaries enable team parallelization

## Data Flow

### Form Submission Flow
```
User Input
  ↓
Field Validation (client)
  ↓
Form Validation (client)
  ↓
Server Action
  ↓
Payment Order Creation
  ↓
Payment Gateway
  ↓
Payment Verification (server)
  ↓
PDF Generation
  ↓
Download
```

### Validation Flow
```
User Types
  ↓
onChange Handler
  ↓
State Update
  ↓
onBlur Handler
  ↓
Mark Field Touched
  ↓
Validate Field
  ↓
Update Errors State
  ↓
Display Error (if touched)
```

### Suggestion Flow
```
User Types in Field
  ↓
Search Trigger
  ↓
SuggestionProvider.search()
  ↓
Filter Reference Data
  ↓
Update Suggestions State
  ↓
Display in Dropdown
  ↓
User Selects
  ↓
Auto-fill Related Fields
```

## Best Practices

### Validation
- Always validate on both client and server
- Show errors only after field is touched
- Provide helpful error messages
- Use success indicators for valid fields

### Suggestions
- Debounce search queries to reduce re-renders
- Show loading states during search
- Limit suggestions to reasonable count (10-20)
- Include metadata for context

### Components
- Keep components small and focused
- Use composition over inheritance
- Extract reusable UI patterns
- Separate business logic from presentation

### Services
- Keep services stateless
- Use dependency injection
- Return structured results (success/error)
- Handle errors gracefully

### Types
- Define types in central location
- Use type inference from schemas
- Avoid type assertions
- Document complex types
