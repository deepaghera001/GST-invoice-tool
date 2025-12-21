# Validation System Updates

## Overview
This document describes the updated validation system with separated concerns for each field type. The new structure maintains backward compatibility while providing more granular control over validation logic.

## New Structure
```
validation/
├── schemas/           
│   ├── invoice.schema.ts
│   └── index.ts
└── validators/        
    ├── seller-validator.ts     # Seller-specific validations
    ├── buyer-validator.ts      # Buyer-specific validations
    ├── invoice-validator.ts    # Invoice-specific validations
    ├── item-validator.ts       # Item-specific validations
    ├── tax-validator.ts        # Tax-specific validations
    ├── composite-validator.ts  # Composite validation functions
    ├── field-validator.ts      # Backward-compatible wrapper
    └── index.ts               # Exports all validators
```

## Individual Validator Functions

### Seller Validators
- `validateSellerName(value: string): string | null`
- `validateSellerAddress(value: string): string | null`
- `validateSellerGSTIN(value: string): string | null`
- `validateSellerFields(data: { sellerName?, sellerAddress?, sellerGSTIN? }): Record<string, string>`

### Buyer Validators
- `validateBuyerName(value: string): string | null`
- `validateBuyerAddress(value: string): string | null`
- `validateBuyerGSTIN(value: string): string | null`
- `validateBuyerFields(data: { buyerName?, buyerAddress?, buyerGSTIN? }): Record<string, string>`

### Invoice Validators
- `validateInvoiceNumber(value: string): string | null`
- `validateInvoiceDate(value: string): string | null`
- `validateInvoiceFields(data: { invoiceNumber?, invoiceDate? }): Record<string, string>`

### Item Validators
- `validateItemDescription(value: string): string | null`
- `validateHSNCode(value: string): string | null`
- `validateQuantity(value: string): string | null`
- `validateRate(value: string): string | null`
- `validateItemFields(data: { itemDescription?, hsnCode?, quantity?, rate? }): Record<string, string>`

### Tax Validators
- `validateCGST(value: string): string | null`
- `validateSGST(value: string): string | null`
- `validateIGST(value: string): string | null`
- `validateTaxFields(data: { cgst?, sgst?, igst? }): Record<string, string>`

### Composite Validators
- `validateAllFields(data: any): InvoiceValidationErrors`

## Usage Examples

### Individual Field Validation
```typescript
import { validateSellerName, validateQuantity } from '@/lib/validation/validators'

const nameError = validateSellerName("Test Company")
const quantityError = validateQuantity("10")
```

### Section Validation
```typescript
import { validateSellerFields, validateItemFields } from '@/lib/validation/validators'

const sellerErrors = validateSellerFields({
  sellerName: "Test Company",
  sellerAddress: "123 Test St",
  sellerGSTIN: "29ABCDE1234F1Z5"
})

const itemErrors = validateItemFields({
  itemDescription: "Software Services",
  quantity: "10",
  rate: "5000"
})
```

### Composite Validation
```typescript
import { validateAllFields } from '@/lib/validation/validators'

const errors = validateAllFields(formData)
const isValid = Object.keys(errors).length === 0
```

### Backward Compatible Usage
```typescript
import { FieldValidator } from '@/lib/validation'

// Existing usage still works
const error = FieldValidator.validateField('sellerName', 'Test Company')
const { isValid, errors } = FieldValidator.validateForm(formData)
```

## Benefits of the New Structure

1. **Separation of Concerns**: Each validator focuses on a specific domain
2. **Reusability**: Individual functions can be used in isolation
3. **Maintainability**: Changes to validation rules for one field type don't affect others
4. **Testability**: Each validator can be tested independently
5. **Performance**: Only validate the fields that need validation
6. **Backward Compatibility**: Existing code continues to work unchanged

## Migration Guide

Existing code using `FieldValidator` requires no changes. New code can take advantage of the granular validators for better performance and clearer intent.