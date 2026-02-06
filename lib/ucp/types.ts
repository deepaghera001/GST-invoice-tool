// UCP Validator Types
export interface UCPManifest {
  ucp: {
    version: string;
    services?: Record<string, ServiceDefinition[]>;
    capabilities?: Record<string, CapabilityDefinition[]>;
    payment_handlers?: Record<string, PaymentHandlerDefinition[]>;
  };
  signing_keys?: SigningKey[];
}

export interface ServiceDefinition {
  version: string;
  spec: string;
  transport?: string;
  endpoint?: string;
  schema?: string;
}

export interface CapabilityDefinition {
  version: string;
  spec: string;
  schema?: string;
  extends?: string;
  config?: Record<string, any>;
}

export interface PaymentHandlerDefinition {
  id: string;
  version: string;
  spec?: string;
  schema?: string;
  config?: Record<string, any>;
}

export interface SigningKey {
  kid: string;
  kty: string;
  crv?: string;
  x?: string;
  y?: string;
  use?: string;
  alg?: string;
}

export interface ValidationResult {
  valid: boolean;
  checks: ValidationCheck[];
  errorCount: number;
  warningCount: number;
  passCount: number;
  manifest?: UCPManifest;
}

export interface ValidationCheck {
  id: string;
  title: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  severity: 'critical' | 'error' | 'warning' | 'info';
  details?: string;
}

export interface UCPValidatorInput {
  mode: 'json' | 'url';
  content: string;
}
