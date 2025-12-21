# Feature Documentation

## Core Features

### 1. Invoice Form

**Location**: `components/invoice-form.tsx`

The main form component with integrated validation and suggestions.

**Features**:
- Real-time validation feedback
- Smart auto-fill (PAN from GSTIN)
- HSN code search and selection
- Tax rate suggestions
- Invoice number generation
- Live preview

**Usage**:
```typescript
import { InvoiceForm } from '@/components/invoice-form'

<InvoiceForm />
```

### 2. Validation System

**Location**: `lib/validation/`

Schema-based validation using Zod.

**Features**:
- Field-level validation
- Form-level validation
- Custom validation rules
- Type-safe error handling
- Helpful error messages

**Example**:
```typescript
import { useFormValidation } from '@/hooks/use-form-validation'

const { errors, validateField, shouldShowError } = useFormValidation()

// Validate on blur
handleBlur('email', value)

// Show error if touched
{shouldShowError('email') && <Error>{errors.email}</Error>}
```

### 3. Suggestion System

**Location**: `lib/suggestions/`

Smart autocomplete and data helpers.

**Features**:
- HSN code search (50+ codes)
- GSTIN state detection
- PAN extraction from GSTIN
- Invoice number generation
- GST rate suggestions

**Example**:
```typescript
import { useSuggestions } from '@/hooks/use-suggestions'

const { searchHSN, analyzeGSTIN, extractPAN } = useSuggestions()

// Search HSN codes
const codes = searchHSN('software')

// Analyze GSTIN
const { state, pan } = analyzeGSTIN('29ABCDE1234F1Z5')
```

### 4. Payment Integration

**Location**: `lib/services/payment/`

Modular payment provider system.

**Features**:
- Razorpay integration
- Secure order creation
- Payment verification
- Easy to add new providers

**Flow**:
1. User submits form
2. Server action creates order
3. Razorpay modal opens
4. Payment processed
5. Server verifies payment
6. PDF generated and downloaded

### 5. PDF Generation

**Location**: `lib/services/generators/`

Modular PDF generation system.

**Features**:
- GST-compliant format (standard domestic invoices)
- Company logo support
- Professional layout
- Easy to customize
- Extensible for new document types

**Customization**:
```typescript
// lib/services/generators/invoice-pdf-generator.ts
// Modify layout, colors, fonts, etc.
```

### 6. Form Sections

**Location**: `components/form-sections/`

Reusable form section components.

**Sections**:
- Seller Details
- Buyer Details
- Invoice Details
- Item Details
- Tax Details

**Example**:
```typescript
<SellerDetails
  formData={formData}
  onChange={handleChange}
  onBlur={handleBlur}
  errors={errors}
  shouldShowError={shouldShowError}
  suggestions={suggestions}
/>
```

## Advanced Features

### Auto-fill Chain

When user enters GSTIN:
1. Validate format
2. Extract state code
3. Show state name
4. Extract PAN
5. Auto-fill PAN field

### HSN Smart Selection

When user selects HSN code:
1. Show code and description
2. Display GST rate
3. Auto-fill CGST field
4. Auto-fill SGST field
5. Update totals

### Invoice Number Generation

Click magic wand button to generate:
- Format: `PREFIX-YYYYMM-XXX`
- Example: `INV-202501-123`
- Customizable prefix

### Real-time Preview

As user types:
- Form data updates
- Preview rerenders
- Totals recalculate
- Validation runs

## Feature Flags

Currently all features are enabled. To add feature flags:

```typescript
// lib/config/features.ts
export const features = {
  hsnSuggestions: true,
  autoFillPAN: true,
  invoiceGeneration: true,
  realTimeValidation: true
}

// Use in components
if (features.hsnSuggestions) {
  // Show HSN search
}
```

## Upcoming Features

### Planned

- [ ] Multiple items per invoice
- [ ] Discount support
- [ ] Multiple tax rates (IGST)
- [ ] Invoice templates
- [ ] Recurring invoices
- [ ] Client management
- [ ] Invoice history
- [ ] PDF customization UI
- [ ] Email delivery
- [ ] Multi-currency support

### Considering

- [ ] Quotation generation
- [ ] Purchase orders
- [ ] Credit notes
- [ ] Expense tracking
- [ ] Inventory management
- [ ] Payment tracking
- [ ] Reports and analytics
- [ ] Mobile app

## Feature Requests

To request a feature:
1. Check if it already exists in planned features
2. Open an issue describing the feature
3. Explain the use case and benefits
4. Consider contributing a PR

## Implementation Guide

### Adding a Feature

1. **Plan**: Define scope and requirements
2. **Design**: Sketch out UI and data flow
3. **Types**: Define TypeScript interfaces
4. **Validation**: Add Zod schemas
5. **Logic**: Implement business logic
6. **UI**: Create/update components
7. **Test**: Manual and automated testing
8. **Document**: Update relevant docs

### Feature Checklist

- [ ] Types defined
- [ ] Validation schema created
- [ ] Business logic implemented
- [ ] UI components created
- [ ] Error handling added
- [ ] Loading states implemented
- [ ] Mobile responsive
- [ ] Accessibility tested
- [ ] Documentation updated
- [ ] Manual testing completed
