import { TestScenarioGroup } from '../types';

export const ucpScenarios: TestScenarioGroup<{ manifestInput: string; urlInput: string; inputMode: 'json' | 'url' }> = {
    formType: 'ucp',
    formName: 'UCP Validator',
    scenarios: [
        {
            id: 'ucp-valid-full',
            name: 'Valid Full Manifest',
            category: 'valid',
            description: 'A complete, valid UCP 2026 manifest with REST and MCP services.',
            data: {
                inputMode: 'json',
                manifestInput: `{
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
  }
}`
            }
        },
        {
            id: 'ucp-invalid-spec-binding',
            name: 'Invalid Spec Binding',
            category: 'invalid',
            description: 'Namespace and Spec URL origin mismatch.',
            data: {
                inputMode: 'json',
                manifestInput: `{
  "ucp": {
    "version": "2026-01-23",
    "services": {
      "com.oniricapps.service": [
        {
          "version": "2026-01-23",
          "spec": "https://ucp.dev/spec",
          "rest": {
            "endpoint": "https://oniricapps.com/api",
            "schema": "https://ucp.dev/schema"
          }
        }
      ]
    }
  }
}`
            }
        },
        {
            id: 'ucp-insecure-http',
            name: 'Insecure HTTP URLs',
            category: 'invalid',
            description: 'Strict HTTPS enforcement failure.',
            data: {
                inputMode: 'json',
                manifestInput: `{
  "ucp": {
    "version": "2026-01-23",
    "services": {
      "dev.ucp.shopping": [
        {
          "version": "2026-01-23",
          "spec": "http://ucp.dev/spec",
          "rest": {
            "endpoint": "http://example.com/api",
            "schema": "https://ucp.dev/schema"
          }
        }
      ]
    }
  }
}`
            }
        },
        {
            id: 'ucp-missing-required',
            name: 'Missing Required Fields',
            category: 'invalid',
            description: 'Missing ucp.version and service.spec.',
            data: {
                inputMode: 'json',
                manifestInput: `{
  "ucp": {
    "services": {
      "dev.ucp.shopping": [
        {
          "version": "2026-01-23",
          "rest": {
            "endpoint": "https://example.com/api",
            "schema": "https://ucp.dev/schema"
          }
        }
      ]
    }
  }
}`
            }
        },
        {
            id: 'ucp-url-mode-example',
            name: 'URL Mode Example',
            category: 'valid',
            description: 'Test fetching from a public URL.',
            data: {
                inputMode: 'url',
                urlInput: 'https://oniricapps.com/.well-known/ucp'
            }
        }
    ]
};
