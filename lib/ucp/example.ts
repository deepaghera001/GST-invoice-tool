export const EXAMPLE_UCP_MANIFEST = `{
  "ucp": {
    "version": "2026-01-23",
    "services": {
      "dev.ucp.shopping": [
        {
          "version": "2026-01-23",
          "spec": "https://ucp.dev/specification/overview",
          "rest": {
            "endpoint": "https://example.com/api/ucp/v1",
            "schema": "https://ucp.dev/2026-01-23/services/shopping/rest.openapi.json"
          },
          "mcp": {
            "endpoint": "https://example.com/mcp/ucp/v1",
            "schema": "https://ucp.dev/2026-01-23/services/shopping/mcp.json"
          }
        }
      ]
    },
    "capabilities": {
      "dev.ucp.shopping.checkout": [
        {
          "version": "2026-01-23",
          "spec": "https://ucp.dev/specification/checkout",
          "schema": "https://ucp.dev/2026-01-23/schemas/shopping/checkout.json"
        }
      ]
    }
  },
  "payment": {
    "handlers": {
      "com.example.tokenizer": [
        {
          "id": "merchant_tokenizer",
          "version": "2026-01-23",
          "name": "Standard Tokenizer",
          "spec": "https://example.com/specs/tokenizer",
          "schema": "https://example.com/schemas/tokenizer.json",
          "instrument_schemas": ["https://ucp.dev/schemas/instruments/card.json"],
          "config": {
            "token_url": "https://api.psp.example.com/tokens"
          }
        }
      ]
    }
  }
}`;
