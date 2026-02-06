export const EXAMPLE_UCP_MANIFEST = `{
  "ucp": {
    "version": "2026-01-23",
    "services": {
      "dev.ucp.shopping": [
        {
          "version": "2026-01-23",
          "spec": "https://ucp.dev/specification/overview",
          "transport": "rest",
          "endpoint": "https://example.com/api/ucp/v1",
          "schema": "https://ucp.dev/2026-01-23/services/shopping/rest.openapi.json"
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
      ],
      "dev.ucp.shopping.fulfillment": [
        {
          "version": "2026-01-23",
          "spec": "https://ucp.dev/specification/fulfillment",
          "schema": "https://ucp.dev/2026-01-23/schemas/shopping/fulfillment.json",
          "extends": "dev.ucp.shopping.checkout"
        }
      ]
    },
    "payment_handlers": {
      "com.example.tokenizer": [
        {
          "id": "merchant_tokenizer",
          "version": "2026-01-23",
          "spec": "https://example.com/specs/tokenizer",
          "schema": "https://example.com/schemas/tokenizer.json",
          "config": {
            "token_url": "https://api.psp.example.com/tokens",
            "public_key": "pk_live_example123"
          }
        }
      ]
    }
  },
  "signing_keys": [
    {
      "kid": "business_2026",
      "kty": "EC",
      "crv": "P-256",
      "x": "WbbXwVYGdJoP4Xm3qCkGvBRcRvKtEfXDbWvPzpPS8LA",
      "y": "sP4jHHxYqC89HBo8TjrtVOAGHfJDflYxw7MFMxuFMPY",
      "use": "sig",
      "alg": "ES256"
    }
  ]
}`;
