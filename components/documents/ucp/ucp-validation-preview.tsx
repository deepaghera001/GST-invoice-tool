/**
 * UCP Validation Preview Component
 * Professional PDF-ready validation report using PreviewWrapper pattern
 * 
 * Matches: invoice-preview.tsx, salary-slip-preview.tsx
 */

"use client"

import type { ValidationResult, UCPManifest } from "@/lib/ucp/types"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { PreviewWrapper } from "../shared/preview-wrapper"
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  FileText, 
  Globe, 
  Package, 
  Key, 
  Shield, 
  Code,
  Server,
  CreditCard,
  ExternalLink
} from "lucide-react"

/**
 * Normalize service/capability/handler definitions to array format
 * Handles both object format and array format from different UCP implementations
 */
function normalizeToArray<T>(data: T | T[]): T[] {
  if (Array.isArray(data)) {
    return data;
  }
  return [data];
}

interface UCPValidationPreviewProps {
  validationResult: ValidationResult | null
  manifest: UCPManifest | null
  maxHeight?: string
}

export function UCPValidationPreview({
  validationResult,
  manifest,
  maxHeight,
}: UCPValidationPreviewProps) {
  // Empty state
  if (!validationResult) {
    return (
      <PreviewWrapper
        title="UCP Validation Report"
        icon={<Shield className="h-5 w-5" />}
        previewId="ucp-validation-preview"
        dataTestId="ucp-validation-preview"
        pdfContentId="ucp-pdf-content"
        maxHeight={maxHeight}
      >
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-20 w-20 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Validation Yet</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Paste your UCP manifest JSON or enter a URL and click "Validate Manifest" to generate a comprehensive validation report
          </p>
        </div>
      </PreviewWrapper>
    )
  }

  // Calculate validation counts
  const passedCount = validationResult.checks?.filter(c => c.status === 'pass').length || 0
  const failedCount = validationResult.checks?.filter(c => c.status === 'fail').length || 0
  const warningCount = validationResult.checks?.filter(c => c.status === 'warning').length || 0
  const totalChecks = passedCount + failedCount + warningCount

  // Extract manifest details
  const ucpVersion = manifest?.ucp?.version || "Not specified"
  const servicesCount = manifest?.ucp?.services ? Object.keys(manifest.ucp.services).length : 0
  const capabilitiesCount = manifest?.ucp?.capabilities ? Object.keys(manifest.ucp.capabilities).length : 0
  const handlersCount = manifest?.ucp?.payment_handlers ? Object.keys(manifest.ucp.payment_handlers).length : 0
  const signingKeysCount = manifest?.signing_keys?.length || 0

  return (
    <PreviewWrapper
      title="UCP Validation Report"
      icon={<Shield className="h-5 w-5" />}
      previewId="ucp-validation-preview"
      dataTestId="ucp-validation-preview"
      pdfContentId="ucp-pdf-content"
      maxHeight={maxHeight}
    >
      <div className="pdf-document-content p-4">
        {/* ==================== REPORT HEADER ==================== */}
        <div className="text-center pb-6 border-b-2 border-primary/20">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            UCP MANIFEST VALIDATION REPORT
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Universal Commerce Protocol (UCP) • Spec Version 2026-01-23
          </p>
          <div className="flex justify-center mt-4">
            <Badge 
              variant={validationResult.valid ? "default" : "destructive"}
              className="text-base px-6 py-2 font-semibold"
            >
              {validationResult.valid ? "✓ COMPLIANT" : "✗ NON-COMPLIANT"}
            </Badge>
          </div>
        </div>

        {/* ==================== EXECUTIVE SUMMARY ==================== */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground uppercase tracking-wide">
              Executive Summary
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="border-2 rounded-lg p-4 text-center bg-green-50 border-green-300">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-green-700">{passedCount}</p>
              <p className="text-sm font-medium text-green-600">PASSED</p>
            </div>
            <div className="border-2 rounded-lg p-4 text-center bg-red-50 border-red-300">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-red-700">{failedCount}</p>
              <p className="text-sm font-medium text-red-600">FAILED</p>
            </div>
            <div className="border-2 rounded-lg p-4 text-center bg-amber-50 border-amber-300">
              <AlertTriangle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-amber-700">{warningCount}</p>
              <p className="text-sm font-medium text-amber-600">WARNINGS</p>
            </div>
          </div>

          {/* Summary Message */}
          <div className="p-4 rounded-lg bg-muted/50 border">
            <p className="text-sm leading-relaxed">
              {validationResult.valid ? (
                <>
                  <span className="font-bold text-green-700">✓ Validation Passed:</span>{" "}
                  Your UCP manifest successfully passes all {totalChecks} validation checks 
                  and is ready for production deployment at{" "}
                  <code className="bg-green-100 px-1 rounded text-xs">/.well-known/ucp</code>
                  {warningCount > 0 && (
                    <span className="text-amber-700">
                      {" "}({warningCount} non-critical warning{warningCount > 1 ? 's' : ''} to review)
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="font-bold text-red-700">✗ Validation Failed:</span>{" "}
                  Your UCP manifest has {failedCount} critical issue{failedCount > 1 ? 's' : ''} that 
                  must be resolved before deployment. Review the detailed results below.
                </>
              )}
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        {/* ==================== MANIFEST INFORMATION ==================== */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground uppercase tracking-wide">
              Manifest Information
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded-lg p-3 bg-blue-50/50">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-4 w-4 text-blue-600" />
                <p className="text-xs text-muted-foreground uppercase font-medium">UCP Version</p>
              </div>
              <p className="font-bold text-foreground text-lg">{ucpVersion}</p>
            </div>
            <div className="border rounded-lg p-3 bg-purple-50/50">
              <div className="flex items-center gap-2 mb-1">
                <Server className="h-4 w-4 text-purple-600" />
                <p className="text-xs text-muted-foreground uppercase font-medium">Services</p>
              </div>
              <p className="font-bold text-foreground text-lg">{servicesCount} defined</p>
            </div>
            <div className="border rounded-lg p-3 bg-indigo-50/50">
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-4 w-4 text-indigo-600" />
                <p className="text-xs text-muted-foreground uppercase font-medium">Capabilities</p>
              </div>
              <p className="font-bold text-foreground text-lg">{capabilitiesCount} defined</p>
            </div>
            <div className="border rounded-lg p-3 bg-green-50/50">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="h-4 w-4 text-green-600" />
                <p className="text-xs text-muted-foreground uppercase font-medium">Payment Handlers</p>
              </div>
              <p className="font-bold text-foreground text-lg">{handlersCount} defined</p>
            </div>
          </div>

          {signingKeysCount > 0 && (
            <div className="border rounded-lg p-3 bg-amber-50/50 mt-3">
              <div className="flex items-center gap-2 mb-1">
                <Key className="h-4 w-4 text-amber-600" />
                <p className="text-xs text-muted-foreground uppercase font-medium">Signing Keys</p>
              </div>
              <p className="font-bold text-foreground">{signingKeysCount} key(s) configured</p>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        {/* ==================== SERVICES DETAIL ==================== */}
        {manifest?.ucp?.services && servicesCount > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Server className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-foreground uppercase tracking-wide">
                Services Analysis ({servicesCount})
              </h2>
            </div>

            <div className="space-y-3">
              {Object.entries(manifest.ucp.services).map(([serviceName, serviceData]) => {
                const services = normalizeToArray(serviceData);
                return (
                  <div key={serviceName} className="border rounded-lg overflow-hidden">
                    <div className="bg-purple-100 px-4 py-2 flex items-center gap-2">
                      <Code className="h-4 w-4 text-purple-700" />
                      <p className="font-semibold text-purple-900 text-sm">{serviceName}</p>
                    </div>
                    <div className="p-4 bg-white space-y-3">
                      {services.map((service: any, idx: number) => (
                        <div key={idx} className="text-sm space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-50 rounded p-2">
                              <p className="text-xs text-muted-foreground">Version</p>
                              <p className="font-medium">{service.version || "Not specified"}</p>
                            </div>
                            {service.spec && (
                              <div className="bg-gray-50 rounded p-2">
                                <p className="text-xs text-muted-foreground">Specification</p>
                                <p className="font-medium text-xs break-all text-blue-600 flex items-center gap-1">
                                  {service.spec}
                                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                </p>
                              </div>
                            )}
                          </div>
                          {service.endpoint && (
                            <div className="bg-green-50 rounded p-2 border border-green-200">
                              <p className="text-xs text-green-700">Endpoint</p>
                              <p className="font-mono text-xs break-all">{service.endpoint}</p>
                            </div>
                          )}
                          {service.rest?.endpoint && (
                            <div className="bg-blue-50 rounded p-2 border border-blue-200">
                              <p className="text-xs text-blue-700">REST Endpoint</p>
                              <p className="font-mono text-xs break-all">{service.rest.endpoint}</p>
                            </div>
                          )}
                          {service.mcp?.endpoint && (
                            <div className="bg-indigo-50 rounded p-2 border border-indigo-200">
                              <p className="text-xs text-indigo-700">MCP Endpoint</p>
                              <p className="font-mono text-xs break-all">{service.mcp.endpoint}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator className="my-6" />
          </div>
        )}

        {/* ==================== CAPABILITIES DETAIL ==================== */}
        {manifest?.ucp?.capabilities && capabilitiesCount > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-foreground uppercase tracking-wide">
                Capabilities Analysis ({capabilitiesCount})
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {Object.entries(manifest.ucp.capabilities).map(([capName, capData]) => {
                const capabilities = normalizeToArray(capData);
                return (
                  <div key={capName} className="border rounded-lg overflow-hidden">
                    <div className="bg-indigo-100 px-4 py-2 flex items-center gap-2">
                      <Package className="h-4 w-4 text-indigo-700" />
                      <p className="font-semibold text-indigo-900 text-sm truncate">{capName}</p>
                    </div>
                    <div className="p-3 bg-white">
                      {capabilities.map((cap: any, idx: number) => (
                        <div key={idx} className="text-sm grid grid-cols-2 gap-2">
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-xs text-muted-foreground">Version</p>
                            <p className="font-medium">{cap.version || "Not specified"}</p>
                          </div>
                          {cap.extends && (
                            <div className="bg-purple-50 rounded p-2">
                              <p className="text-xs text-purple-700">Extends</p>
                              <p className="font-medium text-xs">{cap.extends}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator className="my-6" />
          </div>
        )}

        {/* ==================== PAYMENT HANDLERS DETAIL ==================== */}
        {manifest?.ucp?.payment_handlers && handlersCount > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-foreground uppercase tracking-wide">
                Payment Handlers ({handlersCount})
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {Object.entries(manifest.ucp.payment_handlers).map(([handlerName, handlerData]) => {
                const handlers = normalizeToArray(handlerData);
                return (
                  <div key={handlerName} className="border rounded-lg overflow-hidden">
                    <div className="bg-green-100 px-4 py-2 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-green-700" />
                      <p className="font-semibold text-green-900 text-sm">{handlerName}</p>
                    </div>
                    <div className="p-3 bg-white">
                      {handlers.map((handler: any, idx: number) => (
                        <div key={idx} className="text-sm grid grid-cols-3 gap-2">
                          {handler.id && (
                            <div className="bg-gray-50 rounded p-2">
                              <p className="text-xs text-muted-foreground">ID</p>
                              <p className="font-medium text-xs">{handler.id}</p>
                            </div>
                          )}
                          {handler.version && (
                            <div className="bg-gray-50 rounded p-2">
                              <p className="text-xs text-muted-foreground">Version</p>
                              <p className="font-medium">{handler.version}</p>
                            </div>
                          )}
                          {handler.config?.type && (
                            <div className="bg-gray-50 rounded p-2">
                              <p className="text-xs text-muted-foreground">Type</p>
                              <p className="font-medium">{handler.config.type}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator className="my-6" />
          </div>
        )}

        {/* ==================== VALIDATION CHECKS ==================== */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground uppercase tracking-wide">
              Detailed Validation Results
            </h2>
          </div>

          {/* Failed Checks First (Most Important) */}
          {failedCount > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 text-red-700 bg-red-100 px-3 py-2 rounded-t-lg border border-red-200">
                <AlertCircle className="h-5 w-5" />
                <p className="font-bold text-sm">Failed Checks ({failedCount})</p>
              </div>
              <div className="border border-t-0 border-red-200 rounded-b-lg p-3 space-y-2">
                {validationResult.checks
                  ?.filter(c => c.status === 'fail')
                  .map((check, idx) => (
                    <div
                      key={idx}
                      className="border-l-4 border-red-500 bg-red-50 p-3 rounded-r"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-red-900 text-sm">{check.title}</p>
                          <p className="text-sm text-red-700 mt-1">{check.message}</p>
                          {check.details && (
                            <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800">
                              <strong>Details:</strong> {check.details}
                            </div>
                          )}
                          <Badge variant="destructive" className="text-xs mt-2">
                            {check.severity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Warning Checks */}
          {warningCount > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 text-amber-700 bg-amber-100 px-3 py-2 rounded-t-lg border border-amber-200">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-bold text-sm">Warnings ({warningCount})</p>
              </div>
              <div className="border border-t-0 border-amber-200 rounded-b-lg p-3 space-y-2">
                {validationResult.checks
                  ?.filter(c => c.status === 'warning')
                  .map((check, idx) => (
                    <div
                      key={idx}
                      className="border-l-4 border-amber-400 bg-amber-50 p-3 rounded-r"
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-amber-900 text-sm">{check.title}</p>
                          <p className="text-sm text-amber-700 mt-1">{check.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Passed Checks */}
          {passedCount > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 text-green-700 bg-green-100 px-3 py-2 rounded-t-lg border border-green-200">
                <CheckCircle2 className="h-5 w-5" />
                <p className="font-bold text-sm">Passed Checks ({passedCount})</p>
              </div>
              <div className="border border-t-0 border-green-200 rounded-b-lg p-3 space-y-1">
                {validationResult.checks
                  ?.filter(c => c.status === 'pass')
                  .map((check, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2 bg-green-50 rounded border-l-4 border-green-500"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-green-900 text-sm">{check.title}</p>
                        <p className="text-xs text-green-700">{check.message}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        {/* ==================== SUCCESS/READY STATUS ==================== */}
        {validationResult.valid && (
          <div className="p-4 rounded-lg bg-green-50 border-2 border-green-300">
            <div className="flex items-center gap-3 text-green-700 mb-2">
              <CheckCircle2 className="h-6 w-6" />
              <p className="font-bold text-lg">Ready for Production</p>
            </div>
            <p className="text-sm text-green-700 leading-relaxed">
              Your UCP manifest is fully compliant with the protocol specification.
              You can safely deploy this manifest to{" "}
              <code className="bg-green-100 px-2 py-0.5 rounded text-xs font-mono">/.well-known/ucp</code>
            </p>
          </div>
        )}

        {/* ==================== REPORT FOOTER ==================== */}
        <div className="text-center pt-6 mt-6 border-t-2 border-muted/50">
          <p className="text-xs text-muted-foreground mb-1">
            <strong>Report Generated:</strong>{" "}
            {new Date().toLocaleString('en-IN', { 
              dateStyle: 'full', 
              timeStyle: 'short',
              timeZone: 'Asia/Kolkata'
            })} IST
          </p>
          <p className="text-xs text-muted-foreground">
            Universal Commerce Protocol (UCP) Validator • Powered by Workngin
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Protocol Specification: Version 2026-01-23 • https://ucp.dev
          </p>
        </div>
      </div>
    </PreviewWrapper>
  )
}
