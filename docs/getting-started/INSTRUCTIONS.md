# How to Add New Document Templates

This guide explains how to extend InvoiceGen with new document types using the modular architecture.

## Quick Start

Adding a new document type involves 3 main steps:
1. Create a JSON template
2. Create a PDF generator class
3. Update the form component (or create new one)

## Step 1: Create JSON Template

Create a new file in `lib/templates/` (e.g., `rent-agreement.json`):

\`\`\`json
{
  "id": "rent-agreement",
  "name": "Rent Agreement",
  "description": "Professional rent agreement for property owners",
  "version": "1.0",
  "price": 149,
  "fields": {
    "landlord": {
      "name": { "type": "text", "required": true, "label": "Landlord Name" },
      "address": { "type": "textarea", "required": true, "label": "Property Address" }
    },
    "tenant": {
      "name": { "type": "text", "required": true, "label": "Tenant Name" },
      "phone": { "type": "tel", "required": true, "label": "Phone Number" }
    },
    "terms": {
      "rentAmount": { "type": "number", "required": true, "label": "Monthly Rent (₹)" },
      "deposit": { "type": "number", "required": true, "label": "Security Deposit (₹)" },
      "startDate": { "type": "date", "required": true, "label": "Lease Start Date" },
      "duration": { "type": "number", "required": true, "label": "Duration (months)" }
    }
  },
  "calculations": {
    "totalFirstPayment": "terms.rentAmount + terms.deposit"
  },
  "layout": {
    "header": {
      "title": "RENT AGREEMENT",
      "alignment": "center"
    },
    "sections": [
      { "id": "landlord", "title": "Landlord Details" },
      { "id": "tenant", "title": "Tenant Details" },
      { "id": "terms", "title": "Terms & Conditions" }
    ]
  }
}
\`\`\`

## Step 2: Create PDF Generator

Create a new PDF generator class that extends BasePDFGenerator. Create a new file in `lib/services/generators/` (e.g., `rent-agreement-pdf-generator.ts`):

```typescript
import { BasePDFGenerator } from "./base-pdf-generator"
import type { GeneratorOptions } from "@/lib/core/types"

interface RentAgreementData {
  landlord: {
    name: string
    address: string
  }
  tenant: {
    name: string
    phone: string
  }
  terms: {
    rentAmount: string
    deposit: string
    startDate: string
    duration: string
  }
}

export class RentAgreementPDFGenerator extends BasePDFGenerator<RentAgreementData> {
  name = "rent-agreement-pdf-generator"

  supports(documentType: string): boolean {
    return documentType === "rent-agreement"
  }

  async generate(data: RentAgreementData, options?: GeneratorOptions): Promise<Buffer> {
    // For the current system, we recommend using HTML-to-PDF conversion
    // which captures the HTML preview and converts it to PDF
    // However, if you prefer direct PDF generation, you can use a library like jsPDF
    
    // Example using HTML-to-PDF approach (current default):
    // The HTML content would be generated from the data
    // and then converted to PDF via Playwright in the API route
    
    // For direct PDF generation (alternative approach):
    // const { jsPDF } = await import('jspdf')
    // const doc = new jsPDF()
    
    // Header
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('RENT AGREEMENT', 105, 20, { align: 'center' })
    
    // Landlord Details
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Landlord Details:', 20, 40)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(data.landlord.name, 20, 46)
    doc.text(data.landlord.address, 20, 52)
    
    // Tenant Details
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('Tenant Details:', 20, 70)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(data.tenant.name, 20, 76)
    doc.text(data.tenant.phone, 20, 82)
    
    // Terms
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('Terms & Conditions:', 20, 100)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Monthly Rent: ₹${data.terms.rentAmount}`, 20, 106)
    doc.text(`Security Deposit: ₹${data.terms.deposit}`, 20, 112)
    doc.text(`Lease Start: ${data.terms.startDate}`, 20, 118)
    doc.text(`Duration: ${data.terms.duration} months`, 20, 124)
    
    // For HTML-to-PDF approach, return the HTML content as string
    // For direct PDF generation, return as buffer:
    // return Buffer.from(doc.output('arraybuffer'))
    
    // Placeholder return - implement based on your chosen approach
    return Buffer.from('')
  }
}
```

## Step 3: Register the Generator

The new generator will be automatically registered in the GeneratorFactory when you import it. The system will automatically discover and use the new generator based on the document type you specify in the `supports` method.

The main API route (`app/api/generate-pdf/route.ts`) will automatically use the correct generator based on the document type passed in the request.

## Step 4: Create or Update Form

You can either:

**Option A: Create a new page** (e.g., `app/rent-agreement/page.tsx`)

**Option B: Use dynamic form renderer** (more scalable)

Create `components/dynamic-form.tsx` that reads the JSON template and generates form fields automatically.

## Field Types

Supported field types in templates:

- `text` - Single-line text input
- `textarea` - Multi-line text input
- `number` - Numeric input
- `date` - Date picker
- `tel` - Phone number input
- `email` - Email input
- `select` - Dropdown (with options array)

## Validation Patterns

Add validation in field definitions:

\`\`\`json
{
  "gstin": {
    "type": "text",
    "required": true,
    "pattern": "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
    "errorMessage": "Invalid GSTIN format"
  }
}
\`\`\`

## Calculations

Define computed fields:

\`\`\`json
{
  "calculations": {
    "subtotal": "quantity * rate",
    "tax": "subtotal * 0.18",
    "total": "subtotal + tax"
  }
}
\`\`\`

## Best Practices

1. **Keep templates simple** - Start with minimal fields, add more based on user feedback
2. **Validate early** - Add validation at both frontend and backend
3. **Test thoroughly** - Generate sample PDFs before going live
4. **Price appropriately** - Research competitor pricing
5. **SEO optimize** - Create dedicated landing pages for each template

## Example: Receipt Template

Here's a complete example for a simple receipt:

### 1. Template (`lib/templates/receipt.json`)
\`\`\`json
{
  "id": "receipt",
  "name": "Payment Receipt",
  "price": 49,
  "fields": {
    "business": {
      "name": { "type": "text", "required": true, "label": "Business Name" }
    },
    "customer": {
      "name": { "type": "text", "required": true, "label": "Customer Name" }
    },
    "payment": {
      "amount": { "type": "number", "required": true, "label": "Amount (₹)" },
      "date": { "type": "date", "required": true, "label": "Payment Date" },
      "method": {
        "type": "select",
        "required": true,
        "label": "Payment Method",
        "options": ["Cash", "Card", "UPI", "Bank Transfer"]
      }
    }
  }
}
\`\`\`

### 2. PDF Generator
```typescript
// This would be part of a class that extends BasePDFGenerator
async generate(data: ReceiptData, options?: GeneratorOptions): Promise<Buffer> {
  // Implement based on your chosen approach (HTML-to-PDF or direct PDF generation)
  // For HTML-to-PDF: generate HTML content and return as Buffer
  // For direct PDF: use a library like jsPDF
  
  // Placeholder implementation
  return Buffer.from('')
}
\`\`\`

## Deployment Checklist

When adding a new template:

- [ ] JSON template created and validated
- [ ] PDF generator function implemented
- [ ] Form component created/updated
- [ ] API route handles new template
- [ ] Tested in development
- [ ] Price configured correctly
- [ ] SEO metadata added
- [ ] Landing page created (optional)
- [ ] Documentation updated

## Troubleshooting

**PDF not generating?**
- Check console for errors
- Verify all required fields are provided
- Test PDF generation locally first

**Payment fails?**
- Verify Razorpay credentials
- Check signature verification logic
- Ensure amount is in correct format (paise)

**Form validation issues?**
- Check field patterns in template
- Add custom validation in form component
- Show clear error messages to users

## Support

For questions or issues with extending templates, refer to the main README or contact support.
