# UCP Validator

A free, comprehensive validator for Universal Commerce Protocol (UCP) manifests used by AI shopping agents like ChatGPT and Google AI Mode.

## 🚀 Quick Start

Visit `/ucp-validator` on your platform to validate UCP manifests instantly.

## 📝 Input Methods

### Option 1: Paste JSON
Directly paste your UCP manifest JSON into the textarea.

### Option 2: Enter URL
Provide a URL to your `/.well-known/ucp` endpoint for server-side fetching.

## ✅ Validation Checks

The validator performs 9 comprehensive checks:

1. **Valid JSON** - Proper JSON syntax
2. **UCP Object** - Required `ucp` object present
3. **Version Format** - YYYY-MM-DD format (e.g., `2026-01-23`)
4. **Services** - Valid service namespace and structure
5. **Capabilities** - Proper capability definitions
6. **Spec URL Binding** - Namespace-authority matching
7. **HTTPS Enforcement** - All URLs use HTTPS
8. **Payment Handlers** - Valid handler structure
9. **Signing Keys** - JWK format validation

## 🎯 Example Manifest

```json
{
  "ucp": {
    "version": "2026-01-23",
    "services": {
      "dev.ucp.shopping": [
        {
          "version": "2026-01-23",
          "spec": "https://ucp.dev/specification/overview",
          "transport": "rest",
          "endpoint": "https://example.com/api/ucp/v1"
        }
      ]
    },
    "capabilities": {
      "dev.ucp.shopping.checkout": [
        {
          "version": "2026-01-23",
          "spec": "https://ucp.dev/specification/checkout"
        }
      ]
    }
  }
}
```

## 🔧 API Usage

### Validation Endpoint

```bash
POST /api/ucp/validate
Content-Type: application/json

{
  "manifest": "{\"ucp\": {...}}",
  "mode": "json"
}
```

### URL Mode

```bash
POST /api/ucp/validate
Content-Type: application/json

{
  "mode": "url",
  "url": "https://example.com/.well-known/ucp"
}
```

## 📊 Response Format

```typescript
interface ValidationResult {
  valid: boolean;
  checks: ValidationCheck[];
  errorCount: number;
  warningCount: number;
  passCount: number;
  manifest?: UCPManifest;
}

interface ValidationCheck {
  id: string;
  title: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  severity: 'critical' | 'error' | 'warning' | 'info';
  details?: string;
}
```

## 🛠️ Development

### Files Structure
```
lib/ucp/
├── types.ts              # TypeScript interfaces
├── validator.ts          # Core validation engine
└── example.ts            # Sample manifest

app/
├── ucp-validator/page.tsx           # Main UI
└── api/ucp/validate/route.ts        # Validation API

components/documents/ucp/
├── ucp-validator-form.tsx           # Form component
└── ucp-validation-preview.tsx       # Results display
```

### Adding New Validation Rules

1. Add validation method to `UCPValidator` class
2. Call it in the main `validate()` method
3. Add corresponding check result
4. Update documentation

## 📚 UCP Specification

- **Official Spec**: https://ucp.dev/latest/
- **Version**: 2026-01-23
- **GitHub**: https://github.com/Universal-Commerce-Protocol/ucp

## 🤝 Contributing

The UCP validator is part of the PDF generation platform. Follow the platform's contribution guidelines for modifications.

## 📄 License

Same as the main platform.</content>
<parameter name="filePath">/Users/khilan/Projects/pdf-generation-tool-4 (1)/pdf-generation-tool-4/docs/UCP_VALIDATOR_README.md