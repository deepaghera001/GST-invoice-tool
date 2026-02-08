import { UCPManifest, ValidationResult, ValidationCheck } from './types';

/**
 * Normalize service/capability/handler definitions to array format
 * Handles both object format and array format from different UCP implementations
 */
function normalizeToArray<T>(data: T | T[]): T[] {
  if (Array.isArray(data)) {
    return data;
  }
  // Convert single object to array with one element
  return [data];
}

export class UCPValidator {
  private checks: ValidationCheck[] = [];

  validate(input: string, mode: 'json' | 'url'): ValidationResult {
    this.checks = [];
    let manifest: UCPManifest | undefined;

    // Step 1: Parse JSON
    const parseResult = this.validateJSON(input);
    if (!parseResult.valid || !parseResult.data) {
      return this.buildResult(false, manifest);
    }

    manifest = parseResult.data;

    // Step 2: Validate top-level structure
    this.validateTopLevelStructure(manifest);

    // Step 3: Validate version format
    if (manifest.ucp?.version) {
      this.validateVersion(manifest.ucp.version);
    }

    // Step 4: Validate services
    if (manifest.ucp.services) {
      this.validateServices(manifest.ucp.services);
    }

    // Step 5: Validate capabilities
    if (manifest.ucp.capabilities) {
      this.validateCapabilities(manifest.ucp.capabilities);
    }

    // Step 6: Validate payment handlers
    // Payment handlers may appear under `ucp.payment_handlers` (legacy) or
    // under top-level `payment.handlers` (canonical per spec). Accept both.
    if (manifest.ucp.payment_handlers) {
      this.validatePaymentHandlers(manifest.ucp.payment_handlers);
    } else if ((manifest as any).payment?.handlers) {
      this.validatePaymentHandlers((manifest as any).payment.handlers);
    }

    // Step 7: Validate signing keys
    if (manifest.signing_keys) {
      this.validateSigningKeys(manifest.signing_keys);
    }

    // Step 8: Validate URLs (HTTPS enforcement)
    this.validateURLs(manifest);

    const isValid = !this.checks.some(check => check.status === 'fail');
    return this.buildResult(isValid, manifest);
  }

  private validateJSON(input: string): { valid: boolean; data?: UCPManifest } {
    try {
      const data = JSON.parse(input);
      this.checks.push({
        id: 'json-valid',
        title: 'Valid JSON',
        status: 'pass',
        message: 'JSON is well-formed',
        severity: 'info'
      });
      return { valid: true, data };
    } catch (error) {
      this.checks.push({
        id: 'json-valid',
        title: 'Valid JSON',
        status: 'fail',
        message: 'Invalid JSON syntax',
        severity: 'critical',
        details: error instanceof Error ? error.message : 'Parse error'
      });
      return { valid: false };
    }
  }

  private validateTopLevelStructure(manifest: UCPManifest) {
    const requiredFields = ['ucp'];
    const requiredUCPFields = ['version'];

    // Check for top-level 'ucp' object
    if (!manifest.ucp) {
      this.checks.push({
        id: 'ucp-object',
        title: 'UCP Object Present',
        status: 'fail',
        message: 'Missing required "ucp" object',
        severity: 'critical'
      });
      return;
    }

    this.checks.push({
      id: 'ucp-object',
      title: 'UCP Object Present',
      status: 'pass',
      message: 'UCP object found',
      severity: 'info'
    });

    // Check for required UCP fields
    const missingFields = requiredUCPFields.filter(field => !manifest.ucp[field as keyof typeof manifest.ucp]);

    if (missingFields.length > 0) {
      this.checks.push({
        id: 'ucp-required-fields',
        title: 'Required UCP Fields',
        status: 'fail',
        message: `Missing required fields: ${missingFields.join(', ')}`,
        severity: 'critical'
      });
    } else {
      this.checks.push({
        id: 'ucp-required-fields',
        title: 'Required UCP Fields',
        status: 'pass',
        message: 'All required UCP fields present',
        severity: 'info'
      });
    }

    // Warn if optional but recommended fields are missing
    const optionalFields = ['services', 'capabilities'];
    const missingOptional = optionalFields.filter(field => !manifest.ucp[field as keyof typeof manifest.ucp]);

    if (missingOptional.length > 0) {
      this.checks.push({
        id: 'ucp-optional-fields',
        title: 'Optional UCP Fields',
        status: 'warning',
        message: `Missing optional fields: ${missingOptional.join(', ')}`,
        severity: 'warning',
        details: 'These fields are optional but recommended for full UCP compliance'
      });
    }
  }

  private validateVersion(version: string) {
    // Version must be in YYYY-MM-DD format
    const versionRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!versionRegex.test(version)) {
      this.checks.push({
        id: 'version-format',
        title: 'Version Format',
        status: 'fail',
        message: `Invalid version format: "${version}". Must be YYYY-MM-DD`,
        severity: 'error'
      });
      return;
    }

    // Validate it's a valid date
    const date = new Date(version);
    if (isNaN(date.getTime())) {
      this.checks.push({
        id: 'version-format',
        title: 'Version Format',
        status: 'fail',
        message: `Invalid date in version: "${version}"`,
        severity: 'error'
      });
      return;
    }

    this.checks.push({
      id: 'version-format',
      title: 'Version Format',
      status: 'pass',
      message: `Valid version format: ${version}`,
      severity: 'info'
    });
  }

  private validateServices(services: Record<string, any[]>) {
    const serviceCount = Object.keys(services).length;

    if (serviceCount === 0) {
      this.checks.push({
        id: 'services-present',
        title: 'Services Defined',
        status: 'warning',
        message: 'No services defined',
        severity: 'warning'
      });
      return;
    }

    let validServices = 0;
    let invalidServices = 0;

    Object.entries(services).forEach(([serviceName, serviceData]) => {
      // Validate namespace format
      if (!this.isValidNamespace(serviceName)) {
        this.checks.push({
          id: `service-${serviceName}`,
          title: `Service: ${serviceName}`,
          status: 'fail',
          message: `Invalid namespace format: ${serviceName}`,
          severity: 'error',
          details: 'Service names must use reverse-domain format: {reverse-domain}.{service}'
        });
        invalidServices++;
        return;
      }

      // Normalize to array format (handles both object and array formats)
      const serviceList = normalizeToArray(serviceData);

      // Validate each service definition
      serviceList.forEach((service, index) => {
        const required = ['version', 'spec'];
        const missing = required.filter(field => !service[field]);

        if (missing.length > 0) {
          this.checks.push({
            id: `service-${serviceName}-${index}`,
            title: `Service: ${serviceName}[${index}]`,
            status: 'fail',
            message: `Missing required fields: ${missing.join(', ')}`,
            severity: 'error'
          });
          invalidServices++;
        } else {
          validServices++;
        }

        // If transport bindings are present, enforce transport-specific required fields
        if (service.rest) {
          if (!service.rest.schema || !service.rest.endpoint) {
            this.checks.push({
              id: `service-${serviceName}-${index}-rest`,
              title: `Service REST binding: ${serviceName}[${index}]`,
              status: 'fail',
              message: 'REST transport requires both rest.schema and rest.endpoint',
              severity: 'error'
            });
            invalidServices++;
          }
        }
        if (service.mcp) {
          if (!service.mcp.schema || !service.mcp.endpoint) {
            this.checks.push({
              id: `service-${serviceName}-${index}-mcp`,
              title: `Service MCP binding: ${serviceName}[${index}]`,
              status: 'fail',
              message: 'MCP transport requires both mcp.schema and mcp.endpoint',
              severity: 'error'
            });
            invalidServices++;
          }
        }

        // Ensure at least one endpoint is defined (legacy, rest, or mcp)
        if (!service.endpoint && !service.rest?.endpoint && !service.mcp?.endpoint) {
          this.checks.push({
            id: `service-${serviceName}-${index}-endpoint`,
            title: `Service Endpoint: ${serviceName}[${index}]`,
            status: 'fail',
            message: 'Service must define at least one endpoint (legacy endpoint, rest.endpoint, or mcp.endpoint)',
            severity: 'error'
          });
          invalidServices++;
        }
      });
    });

    this.checks.push({
      id: 'services-valid',
      title: 'Service Validation',
      status: invalidServices === 0 ? 'pass' : 'fail',
      message: `${validServices} valid, ${invalidServices} invalid services`,
      severity: invalidServices > 0 ? 'error' : 'info'
    });
  }

  private validateCapabilities(capabilities: Record<string, any[]>) {
    const capabilityCount = Object.keys(capabilities).length;

    if (capabilityCount === 0) {
      this.checks.push({
        id: 'capabilities-present',
        title: 'Capabilities Defined',
        status: 'warning',
        message: 'No capabilities defined',
        severity: 'warning'
      });
      return;
    }

    let validCapabilities = 0;
    let invalidCapabilities = 0;

    Object.entries(capabilities).forEach(([capabilityName, capabilityData]) => {
      // Validate namespace format
      if (!this.isValidNamespace(capabilityName)) {
        this.checks.push({
          id: `capability-${capabilityName}`,
          title: `Capability: ${capabilityName}`,
          status: 'fail',
          message: `Invalid namespace format: ${capabilityName}`,
          severity: 'error',
          details: 'Capability names must use format: {reverse-domain}.{service}.{capability}'
        });
        invalidCapabilities++;
        return;
      }

      // Normalize to array format (handles both object and array formats)
      const capabilityList = normalizeToArray(capabilityData);

      // Validate each capability definition
      capabilityList.forEach((capability, index) => {
        // Per spec, capabilities MUST include version, spec and schema
        const required = ['version', 'spec', 'schema'];
        const missing = required.filter(field => !capability[field]);

        if (missing.length > 0) {
          this.checks.push({
            id: `capability-${capabilityName}-${index}`,
            title: `Capability: ${capabilityName}[${index}]`,
            status: 'fail',
            message: `Missing required fields: ${missing.join(', ')}`,
            severity: 'error'
          });
          invalidCapabilities++;
        } else {
          validCapabilities++;
        }

        // Validate spec URL origin matches namespace
        if (capability.spec) {
          this.validateSpecURLBinding(capabilityName, capability.spec);
        }
        // Also validate schema binding if provided
        if (capability.schema) {
          this.validateSpecURLBinding(capabilityName, capability.schema);
        }
      });
    });

    this.checks.push({
      id: 'capabilities-valid',
      title: 'Capability Validation',
      status: invalidCapabilities === 0 ? 'pass' : 'fail',
      message: `${validCapabilities} valid, ${invalidCapabilities} invalid capabilities`,
      severity: invalidCapabilities > 0 ? 'error' : 'info'
    });
  }

  private validatePaymentHandlers(handlers: Record<string, any>) {
    let validHandlers = 0;
    let invalidHandlers = 0;

    Object.entries(handlers).forEach(([handlerName, handlerData]) => {
      // Normalize to array format (handles both object and array formats)
      const handlerList = normalizeToArray(handlerData);

      handlerList.forEach((handler, index) => {
        const required = ['id', 'version'];
        const missing = required.filter(field => !handler[field]);

        if (missing.length > 0) {
          this.checks.push({
            id: `handler-${handlerName}-${index}`,
            title: `Payment Handler: ${handlerName}[${index}]`,
            status: 'fail',
            message: `Missing required fields: ${missing.join(', ')}`,
            severity: 'error'
          });
          invalidHandlers++;
        } else {
          validHandlers++;
        }
        // If a spec URL is present, ensure origin matches reverse-domain of handler name
        if (handler.spec) {
          this.validateSpecURLBinding(handlerName, handler.spec);
        }
      });
    });

    this.checks.push({
      id: 'payment-handlers-valid',
      title: 'Payment Handler Validation',
      status: invalidHandlers === 0 ? 'pass' : 'fail',
      message: `${validHandlers} valid, ${invalidHandlers} invalid payment handlers`,
      severity: invalidHandlers > 0 ? 'error' : 'info'
    });
  }

  private validateSigningKeys(keys: any[]) {
    let validKeys = 0;
    let invalidKeys = 0;

    keys.forEach((key, index) => {
      const required = ['kid', 'kty'];
      const missing = required.filter(field => !key[field]);

      if (missing.length > 0) {
        this.checks.push({
          id: `signing-key-${index}`,
          title: `Signing Key[${index}]`,
          status: 'fail',
          message: `Missing required fields: ${missing.join(', ')}`,
          severity: 'error'
        });
        invalidKeys++;
      } else {
        validKeys++;
      }
    });

    this.checks.push({
      id: 'signing-keys-valid',
      title: 'Signing Key Validation',
      status: invalidKeys === 0 ? 'pass' : 'fail',
      message: `${validKeys} valid, ${invalidKeys} invalid signing keys`,
      severity: invalidKeys > 0 ? 'error' : 'info'
    });
  }

  private validateURLs(manifest: UCPManifest) {
    const urls: string[] = [];

    // Collect all URLs from services
    if (manifest.ucp.services) {
      Object.values(manifest.ucp.services).forEach(serviceData => {
        const serviceList = normalizeToArray(serviceData);
        serviceList.forEach(service => {
          if (service.spec) urls.push(service.spec);
          if (service.endpoint) urls.push(service.endpoint);
          if (service.schema) urls.push(service.schema);

          // Check nested transport URLs
          if (service.rest) {
            if (service.rest.endpoint) urls.push(service.rest.endpoint);
            if (service.rest.schema) urls.push(service.rest.schema);
          }
          if (service.mcp) {
            if (service.mcp.endpoint) urls.push(service.mcp.endpoint);
            if (service.mcp.schema) urls.push(service.mcp.schema);
          }
        });
      });
    }

    // Collect all URLs from capabilities
    if (manifest.ucp.capabilities) {
      Object.values(manifest.ucp.capabilities).forEach(capabilityData => {
        const capabilityList = normalizeToArray(capabilityData);
        capabilityList.forEach(capability => {
          if (capability.spec) urls.push(capability.spec);
          if (capability.schema) urls.push(capability.schema);
        });
      });
    }

    // Collect all URLs from payment handlers
    if (manifest.ucp.payment_handlers) {
      Object.values(manifest.ucp.payment_handlers).forEach(handlerData => {
        const handlerList = normalizeToArray(handlerData);
        handlerList.forEach(handler => {
          if (handler.spec) urls.push(handler.spec);
          if (handler.schema) urls.push(handler.schema);
          if (handler.config_schema) urls.push(handler.config_schema);
          if (handler.instrument_schemas) {
            handler.instrument_schemas.forEach((s: string) => urls.push(s));
          }
        });
      });
    } else if ((manifest as any).payment?.handlers) {
      Object.values((manifest as any).payment.handlers).forEach(handlerData => {
        const handlerList = normalizeToArray(handlerData as any);
        handlerList.forEach((handler: any) => {
          if (handler.spec) urls.push(handler.spec);
          if (handler.schema) urls.push(handler.schema);
          if (handler.config_schema) urls.push(handler.config_schema);
        });
      });
    }

    let httpsCount = 0;
    let httpCount = 0;
    let invalidCount = 0;

    urls.forEach(url => {
      try {
        const urlObj = new URL(url);
        if (urlObj.protocol === 'https:') {
          httpsCount++;
        } else if (urlObj.protocol === 'http:') {
          httpCount++;
        } else {
          invalidCount++;
        }
      } catch {
        invalidCount++;
      }
    });

    if (httpCount > 0) {
      this.checks.push({
        id: 'https-enforcement',
        title: 'HTTPS Enforcement',
        status: 'fail',
        message: `${httpCount} HTTP URLs found (must use HTTPS)`,
        severity: 'error',
        details: 'All URLs must use HTTPS for security'
      });
    } else if (httpsCount > 0) {
      this.checks.push({
        id: 'https-enforcement',
        title: 'HTTPS Enforcement',
        status: 'pass',
        message: `All ${httpsCount} URLs use HTTPS`,
        severity: 'info'
      });
    }

    if (invalidCount > 0) {
      this.checks.push({
        id: 'url-validity',
        title: 'URL Validity',
        status: 'fail',
        message: `${invalidCount} invalid URLs found`,
        severity: 'error'
      });
    }
  }

  private isValidNamespace(namespace: string): boolean {
    // Must match format: {reverse-domain}.{service}.{capability}
    // Or at minimum: {reverse-domain}.{service}
    const parts = namespace.split('.');
    if (parts.length < 2) return false;

    // Determine reverse-domain parts (everything before service/capability parts)
    const reverseDomainParts = parts.length >= 4 ? parts.slice(0, parts.length - 2) : parts.slice(0, parts.length - 1);

    // Require at least two reverse-domain parts (e.g., ['com','example'] or ['dev','ucp'])
    return reverseDomainParts.length >= 2;
  }

  private validateSpecURLBinding(namespace: string, specURL: string) {
    try {
      const url = new URL(specURL);
      const namespaceParts = namespace.split('.');

      // Derive expected authority from reverse-domain portion of namespace
      const reverseDomainParts = namespaceParts.length >= 4 ? namespaceParts.slice(0, namespaceParts.length - 2) : namespaceParts.slice(0, namespaceParts.length - 1);
      if (reverseDomainParts.length < 2) return; // cannot derive authority

      const expectedAuthority = reverseDomainParts.slice().reverse().join('.');

      // Allow subdomains of expected authority (e.g., shop.ucp.dev)
      if (!url.hostname.endsWith(expectedAuthority)) {
        this.checks.push({
          id: `spec-binding-${namespace}`,
          title: 'Spec URL Binding',
          status: 'fail',
          message: `Spec URL origin mismatch for ${namespace}`,
          severity: 'error',
          details: `Namespace authority expects origin matching ${expectedAuthority}, got ${url.origin}`
        });
      }
    } catch {
      // URL validation handled elsewhere
    }
  }

  private buildResult(valid: boolean, manifest?: UCPManifest): ValidationResult {
    const errorCount = this.checks.filter(c => c.status === 'fail').length;
    const warningCount = this.checks.filter(c => c.status === 'warning').length;
    const passCount = this.checks.filter(c => c.status === 'pass').length;

    return {
      valid,
      checks: this.checks,
      errorCount,
      warningCount,
      passCount,
      manifest
    };
  }
}

export const validateUCP = (input: string, mode: 'json' | 'url' = 'json'): ValidationResult => {
  const validator = new UCPValidator();
  return validator.validate(input, mode);
};
