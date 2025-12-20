# Services Architecture

## Overview
This directory contains modular, extensible services for document generation and payment processing.

## Structure

### Payment Services (`/payment`)
- **Base**: `base-payment-provider.ts` - Abstract base class for all payment providers
- **Implementations**: `razorpay-provider.ts` - Razorpay implementation
- **Factory**: `payment-factory.ts` - Provider registration and creation

#### Adding a New Payment Provider
```typescript
// 1. Create new provider class
export class StripeProvider extends BasePaymentProvider {
  name = "stripe"
  
  async createOrder(amount: number) {
    // Stripe implementation
  }
  
  async verifyPayment(data: PaymentVerificationData) {
    // Stripe verification
  }
}

// 2. Register in payment-factory.ts
PaymentFactory.register("stripe", () => {
  return new StripeProvider(process.env.STRIPE_KEY!)
})
```

### PDF Generators (`/generators`)
- **Base**: `base-pdf-generator.ts` - Abstract base for all generators
- **Implementations**: `invoice-pdf-generator.ts` - Invoice PDF generator
- **Factory**: `generator-factory.ts` - Generator registration

#### Adding a New Document Type
```typescript
// 1. Define types in core/types
export interface QuotationData extends BaseDocumentData {
  // Your fields
}

// 2. Create generator
export class QuotationPDFGenerator extends BasePDFGenerator<QuotationData> {
  name = "quotation-pdf-generator"
  
  supports(documentType: string) {
    return documentType === "quotation"
  }
  
  async generate(data: QuotationData) {
    // Generate PDF
  }
}

// 3. Register in generator-factory.ts
GeneratorFactory.register(new QuotationPDFGenerator())
```

### Document Service
High-level orchestration service that coordinates payment and document generation.

## Usage Examples

### Generate Invoice with Payment
```typescript
import { documentService } from '@/lib/services/document-service'

// Create payment order
const order = await documentService.createPaymentOrder({
  provider: 'razorpay',
  amount: 99
})

// After payment, verify and generate
const pdf = await documentService.verifyAndGenerateDocument(
  paymentData,
  invoiceData,
  'invoice',
  'razorpay'
)
```

### Generate Document Without Payment
```typescript
const pdf = await documentService.generateDocument(
  quotationData,
  'quotation'
)
