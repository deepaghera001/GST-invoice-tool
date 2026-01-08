# InvoiceGen - Professional PDF Generation Tool

A modular, extensible PDF generation web app for Indian freelancers and small businesses. Generate GST-compliant invoices (standard domestic) with secure payment integration, smart validation, and intelligent suggestions.

## Features

- 🧾 GST-compliant invoice generation (standard domestic invoices)
- ✅ Real-time field validation with helpful error messages
- 🤖 Smart suggestions (HSN codes, GSTIN analysis, auto-fill)
- 💳 Integrated Razorpay payment (₹99 per document)
- 📱 Mobile-first responsive design
- 🔒 Secure payment verification
- 📄 Professional PDF output
- 🎨 Modern, clean UI with Tailwind CSS
- 🏗️ Modular architecture for easy extension

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **UI**: shadcn/ui components, Tailwind CSS v4
- **Validation**: Zod schema validation
- **PDF Generation**: HTML-to-PDF conversion via Playwright
- **Payment**: Razorpay
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Razorpay account (for payment integration)

### Environment Variables

In v0, add these environment variables in the **Vars** section of the in-chat sidebar:

``env
# Razorpay Credentials
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id_here
```

For local development, create a `.env.local` file with the same variables:

```env
# Razorpay Configuration (required for production)
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_here

# Development Settings
NODE_ENV=development
```

**Note**: For development and testing, payment integration is disabled by default. You can generate PDFs without setting up Razorpay keys. For production deployment, you must configure the Razorpay credentials.

### Installation

The shadcn CLI will handle installation automatically when you download the project:

```bash
# Using shadcn CLI (recommended)
npx shadcn@latest init

# Or manually
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── create-order/          # Payment order creation (deprecated)
│   │   └── generate-pdf/          # PDF generation & payment verification
│   ├── layout.tsx                 # Root layout with fonts
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles with design tokens
├── components/
│   ├── invoice-form.tsx           # Main form with validation
│   ├── form-sections/             # Modular form sections
│   │   ├── seller-details.tsx
│   │   ├── buyer-details.tsx
│   │   ├── invoice-details.tsx
│   │   ├── item-details.tsx
│   │   └── tax-details.tsx
│   └── ui/                        # shadcn/ui components
│       ├── form-field.tsx         # Field with validation display
│       ├── combobox.tsx           # Searchable select
│       └── ...
├── lib/
│   ├── core/
│   │   └── types/                 # TypeScript interfaces
│   ├── services/
│   │   ├── payment/               # Payment providers (Factory pattern)
│   │   ├── generators/            # PDF generators (Strategy pattern)
│   │   └── document-service.ts   # Orchestration service
│   ├── validation/                # Zod schemas and validators
│   │   ├── schemas/
│   │   └── validators/
│   ├── suggestions/               # Smart autocomplete system
│   │   ├── data/                  # Reference data (HSN, states)
│   │   └── providers/
│   ├── actions/                   # Server actions
│   │   └── payment-actions.ts
│   └── utils/                     # Pure utility functions
├── hooks/
│   ├── use-form-validation.ts     # Form validation hook
│   └── use-suggestions.ts         # Suggestions hook
└── Documentation/
    ├── ARCHITECTURE.md            # System design
    ├── DEVELOPMENT.md             # Development guide
    └── FEATURES.md                # Feature documentation
```

## Architecture Highlights

### 🏗️ Modular Design

- **Separation of Concerns**: Clear boundaries between types, services, validation, and UI
- **Factory Pattern**: Easy registration of new payment providers
- **Strategy Pattern**: Swap implementations without changing code
- **Dependency Inversion**: High-level modules depend on abstractions

### 🔒 Security First

- Sensitive keys never exposed to client
- Server actions for secure operations
- Payment verification on server only
- Input validation prevents injection attacks

### ✅ Validation System

- **Schema-based**: Zod schemas with type inference
- **Field-level**: Validate as user types/blurs
- **Form-level**: Validate entire form before submit
- **User-friendly**: Clear, actionable error messages

### 🤖 Smart Suggestions

- **HSN Code Search**: 50+ common codes with descriptions
- **GSTIN Analysis**: Extract state and PAN automatically
- **Auto-fill**: PAN from GSTIN, tax rates from HSN
- **Invoice Numbers**: Generate formatted numbers

## Key Features

### Real-time Validation

Form fields validate on blur and show:
- ❌ Error messages with icons
- ✅ Success indicators
- 💡 Helpful hints

### Intelligent Auto-fill

- Enter GSTIN → Auto-fills PAN and shows state
- Select HSN code → Auto-fills CGST/SGST rates
- Click magic wand → Generates invoice number

### Modular Form Sections

Each section is a standalone component:
- Seller Details (with GSTIN validation)
- Buyer Details (optional GSTIN)
- Invoice Details (with number generator)
- Item Details (with HSN search)
- Tax Details (with rate calculator)

## Extension Guide

### Adding a New Payment Provider

```typescript
// 1. Create provider class
export class StripeProvider extends BasePaymentProvider {
  async createOrder(amount: number, currency: string) {
    // Implementation
  }
  
  async verifyPayment(data: any) {
    // Implementation
  }
}

// 2. Register in factory
PaymentFactory.register('stripe', () => new StripeProvider())

// 3. Use it
const order = await createPaymentOrder(99, 'stripe')
```

See [lib/services/payment/README.md](lib/services/payment/README.md) for details.

### Adding a New Document Type

```typescript
// 1. Define types in lib/core/types/quotation.types.ts
// 2. Create validation schema in lib/validation/schemas/quotation.schema.ts
// 3. Create PDF generator in lib/services/generators/quotation-pdf-generator.ts
// 4. Register in GeneratorFactory
```

The system supports two PDF generation approaches:
- HTML-to-PDF: Capture HTML preview and convert to PDF (current default)
- jsPDF: Direct PDF generation from code (legacy option)

See [ARCHITECTURE.md](ARCHITECTURE.md) for complete guide.

### Adding Validation Rules

```typescript
// Update schema in lib/validation/schemas/invoice.schema.ts
export const invoiceSchema = z.object({
  newField: z.string()
    .min(5, "Must be at least 5 characters")
    .regex(/pattern/, "Invalid format")
})
```

See [lib/validation/README.md](lib/validation/README.md) for details.

### Adding Suggestions

```typescript
// 1. Add data to lib/suggestions/data/your-data.ts
// 2. Add search method to SuggestionProvider
// 3. Update useSuggestions hook
// 4. Use in component with Combobox
```

See [lib/suggestions/README.md](lib/suggestions/README.md) for details.

## Payment Flow

1. User fills form with validation
2. Suggestions help complete fields
3. Click "Pay & Download PDF"
4. Server action creates Razorpay order
5. Razorpay checkout modal opens
6. User completes payment
7. Payment verified on server
8. PDF generated and downloaded

## Development

### Local Setup

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development Workflow

1. Read [DEVELOPMENT.md](DEVELOPMENT.md) for detailed guide
2. Understand [ARCHITECTURE.md](ARCHITECTURE.md) for system design
3. Make changes following the patterns
4. Test thoroughly (validation, suggestions, payment flow)
5. Update documentation

### Code Style

- TypeScript strict mode
- Functional React components
- Custom hooks for reusable logic
- Clear separation of concerns
- Comprehensive type safety

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables in Vercel

Add these in Project Settings → Environment Variables:
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`

### Razorpay Setup

1. Create account at [razorpay.com](https://razorpay.com)
2. Enable test mode for development
3. Get API keys from Dashboard
4. For production: Complete KYC and switch to live mode

## Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and patterns
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development workflows
- **[FEATURES.md](FEATURES.md)** - Feature documentation
- **[lib/validation/README.md](lib/validation/README.md)** - Validation system
- **[lib/suggestions/README.md](lib/suggestions/README.md)** - Suggestion system

## Roadmap

### Current Features ✅
- GST-compliant invoice generation (standard domestic invoices)
- Real-time validation
- Smart suggestions and auto-fill
- Secure payment integration
- Professional PDF output

### Planned Features 🚧
- [ ] Multiple items per invoice
- [ ] Discount support
- [ ] IGST for inter-state transactions
- [ ] Invoice templates (Sales, Service, Proforma, Export)
- [ ] Client management
- [ ] Invoice history
- [ ] Email delivery
- [ ] Multi-currency support

### Future Enhancements 💡
- [ ] Quotation generation
- [ ] Purchase orders
- [ ] Credit notes
- [ ] Expense tracking
- [ ] Reports and analytics
- [ ] Mobile app

## Benefits

### For Developers
- **Easy to extend**: Add features without touching existing code
- **Type-safe**: Full TypeScript coverage with schema validation
- **Well-documented**: Comprehensive docs for every module
- **Testable**: Clear separation enables easy testing

### For Users
- **Fast**: Real-time validation and suggestions
- **Smart**: Auto-fill reduces typing
- **Reliable**: Comprehensive validation prevents errors
- **Professional**: High-quality PDF output

## License

MIT

## Support

For issues or questions:
- Check [DEVELOPMENT.md](DEVELOPMENT.md) for common tasks
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- Open an issue on GitHub

## Contributing

Contributions welcome! Please:
1. Read [DEVELOPMENT.md](DEVELOPMENT.md) first
2. Follow existing code patterns
3. Add tests for new features
4. Update documentation
5. Submit a pull request
