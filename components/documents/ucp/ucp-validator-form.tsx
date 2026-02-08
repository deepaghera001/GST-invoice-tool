/**
 * UCP Validator Form Component
 * Follows the platform pattern: FormSection → Preview → PaymentCTA
 * 
 * Features:
 * - JSON input mode: Paste manifest directly
 * - URL input mode: Fetch manifest from URL (e.g., /.well-known/ucp)
 * - Comprehensive validation with detailed report
 * - PDF generation with payment integration
 */

"use client"

import type React from "react"
import { useCallback, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FlaskConical,
  FileText,
  CheckCircle2,
  AlertCircle,
  Globe,
  Loader2,
  ExternalLink,
  Copy,
  RotateCcw
} from "lucide-react"
import { FormSection } from "@/components/shared/form-section"
import { PaymentCTA } from "@/components/shared/payment-cta"
import { UCPValidationPreview } from "./ucp-validation-preview"
import { TestScenarioSelector, ucpScenarios, isTestMode } from "@/lib/testing"
import type { UCPManifest, ValidationResult } from "@/lib/ucp/types"

const PDF_PRICE = 99 // ₹99

// NOTE: Example URLs removed — use test scenarios when in test mode

export function UCPValidatorForm() {
  const { toast } = useToast()
  const [inputMode, setInputMode] = useState<'json' | 'url'>('json')
  const [manifestInput, setManifestInput] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [manifest, setManifest] = useState<UCPManifest | null>(null)

  // Track completion
  const currentInput = inputMode === 'json' ? manifestInput : urlInput
  const isInputComplete = currentInput.trim().length > 0
  const isValidationComplete = validationResult !== null // Changed: any result (pass or fail) is a completion
  const isFormComplete = isInputComplete && isValidationComplete

  // Section completion tracking
  const completedSections = isValidationComplete ? 2 : isInputComplete ? 1 : 0
  const totalSections = 2

  /**
   * Validate UCP manifest
   */
  const handleValidate = useCallback(async () => {
    // Validate input based on mode
    if (inputMode === 'url') {
      if (!urlInput.trim()) {
        toast({
          title: "Empty URL",
          description: "Please enter a UCP manifest URL",
          variant: "destructive",
        })
        return
      }
    } else {
      // JSON mode
      if (!manifestInput.trim()) {
        toast({
          title: "Empty Input",
          description: "Please paste your UCP manifest JSON",
          variant: "destructive",
        })
        return
      }
    }

    setIsValidating(true)

    try {
      // Prepare request body based on mode
      const requestBody = inputMode === 'url'
        ? { mode: 'url', url: urlInput.trim(), manifest: '' }
        : { mode: 'json', manifest: manifestInput }

      const response = await fetch("/api/ucp/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Validation failed")
      }

      setValidationResult(data)
      if (data.manifest) {
        setManifest(data.manifest)
      }

      toast({
        title: data.valid ? "✅ Valid UCP Manifest" : "❌ Invalid UCP Manifest",
        description: data.valid
          ? "All validation checks passed!"
          : `Found ${data.errorCount || 0} error(s)`,
        variant: data.valid ? "default" : "destructive",
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Validation failed"
      toast({
        title: inputMode === 'url' ? "Fetch/Validation Error" : "Validation Error",
        description: message,
        variant: "destructive",
      })
      setValidationResult({
        valid: false,
        checks: [{
          id: "system",
          title: inputMode === 'url' ? "URL Fetch Error" : "System Error",
          status: "fail" as const,
          message,
          severity: "critical" as const
        }],
        errorCount: 1,
        warningCount: 0,
        passCount: 0,
      })
    } finally {
      setIsValidating(false)
    }
  }, [inputMode, manifestInput, urlInput, toast])

  /**
   * Handle input change
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'manifestInput') {
      setManifestInput(value)
    } else if (name === 'urlInput') {
      setUrlInput(value)
    }
    // Reset validation when input changes
    setValidationResult(null)
    setManifest(null)
  }, [])

  /**
   * Handle blur for validation feedback
   */
  const handleBlur = useCallback((fieldName: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldName))
  }, [])

  /**
   * Should show error for field
   */
  const shouldShowError = useCallback((fieldName: string) => {
    return touchedFields.has(fieldName)
  }, [touchedFields])

  /**
   * Generate and download validation report PDF
   */
  /**
   * Handle applying a test scenario
   */
  const handleApplyScenario = useCallback((data: any) => {
    if (data.inputMode) setInputMode(data.inputMode)
    if (data.manifestInput !== undefined) setManifestInput(data.manifestInput)
    if (data.urlInput !== undefined) setUrlInput(data.urlInput)

    // Clear previous results when applying new scenario
    setValidationResult(null)
    setManifest(null)

    toast({
      title: "Scenario Applied",
      description: "Test data has been loaded. Click Validate to test.",
    })
  }, [toast])

  const handleGenerateAndDownloadPDF = useCallback(async () => {
    if (!validationResult) {
      toast({
        title: "No Validation Result",
        description: "Please validate your manifest first",
        variant: "destructive",
      })
      throw new Error("No validation result available")
    }

    // Allow download even if invalid, as requested by user
    // (A report of why it failed is also valuable)

    try {
      // Capture HTML from preview
      const { captureUCPValidationPreviewHTML } = await import("@/lib/utils/dom-capture-utils")
      const htmlContent = captureUCPValidationPreviewHTML()

      const { generateAndDownloadPDF } = await import("@/lib/utils/pdf-download-utils")
      await generateAndDownloadPDF(htmlContent, `ucp-validation-report-${Date.now()}.pdf`)

      toast({
        title: "Success! 🎉",
        description: "Your validation report has been generated and downloaded",
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate PDF"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw error
    }
  }, [validationResult, toast])

  /**
   * Handle payment error
   */
  const handlePaymentError = useCallback((error: string) => {
    toast({
      title: "Payment Error",
      description: error,
      variant: "destructive",
    })
  }, [toast])

  /**
   * Reset form
   */
  const handleReset = useCallback(() => {
    setManifestInput("")
    setUrlInput("")
    setValidationResult(null)
    setManifest(null)
    setTouchedFields(new Set())
    toast({
      title: "Form Reset",
      description: "All fields have been cleared",
    })
  }, [toast])

  /**
   * Switch input mode
   */
  const handleModeSwitch = useCallback((mode: 'json' | 'url') => {
    setInputMode(mode)
    setValidationResult(null)
    setManifest(null)
  }, [])

  /**
   * Load example JSON manifest
   */
  const loadExampleJSON = useCallback(async () => {
    const { EXAMPLE_UCP_MANIFEST } = await import("@/lib/ucp/example")
    setManifestInput(EXAMPLE_UCP_MANIFEST)
    setValidationResult(null)
    setManifest(null)
    toast({
      title: "Example Loaded",
      description: "Example UCP manifest JSON has been loaded",
    })
  }, [toast])

  /**
   * Load example URL
   */
  // Example URL loader removed; use TestScenarioSelector to apply test URL data

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl font-bold text-foreground text-balance">
                UCP Manifest Validator
              </h2>
              {isTestMode && (
                <Badge variant="outline" className="border-amber-500 text-amber-600 gap-1">
                  <FlaskConical className="h-3 w-3" />
                  Test Mode
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Validate Universal Commerce Protocol (UCP) manifests for AI shopping agents. Supports UCP Protocol 2026-01-23.
            </p>
            {isTestMode && (
              <div className="pt-1">
                <TestScenarioSelector
                  scenarios={ucpScenarios.scenarios}
                  onApply={handleApplyScenario}
                  label="UCP Test Scenarios"
                />
              </div>
            )}
          </div>

          <form className="space-y-6">
            {/* Input Mode Selector - Tab Style */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex border-b">
                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${inputMode === 'json'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  onClick={() => handleModeSwitch('json')}
                >
                  <FileText className="h-4 w-4" />
                  Paste JSON Manifest
                </button>
                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${inputMode === 'url'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  onClick={() => handleModeSwitch('url')}
                >
                  <Globe className="h-4 w-4" />
                  Fetch from URL
                </button>
              </div>

              {/* JSON Mode Content */}
              {inputMode === 'json' && (
                <div className="p-4 space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="manifestInput" className="text-sm font-medium">
                        UCP Manifest JSON <span className="text-destructive">*</span>
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={loadExampleJSON}
                        className="h-7 text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Load Example
                      </Button>
                    </div>
                    <Textarea
                      id="manifestInput"
                      name="manifestInput"
                      value={manifestInput}
                      onChange={handleChange}
                      onBlur={() => handleBlur('manifestInput')}
                      placeholder='{\n  "ucp": {\n    "version": "2026-01-23",\n    "services": { ... },\n    "capabilities": { ... }\n  }\n}'
                      className="h-56 max-h-[48vh] overflow-auto resize-none font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Paste the complete UCP manifest JSON from your website&apos;s <code className="bg-muted px-1 rounded">/.well-known/ucp</code> file
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={handleValidate}
                    disabled={!manifestInput.trim() || isValidating}
                    className="w-full"
                    size="lg"
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Validate Manifest
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* URL Mode Content */}
              {inputMode === 'url' && (
                <div className="p-4 space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="urlInput" className="text-sm font-medium">
                        UCP Manifest URL <span className="text-destructive">*</span>
                      </Label>
                      {isTestMode ? (
                        <div className="h-7">
                          <TestScenarioSelector
                            scenarios={ucpScenarios.scenarios}
                            onApply={handleApplyScenario}
                            label="UCP URL Test"
                          />
                        </div>
                      ) : null}
                    </div>
                    <Input
                      id="urlInput"
                      name="urlInput"
                      type="url"
                      value={urlInput}
                      onChange={handleChange}
                      onBlur={() => handleBlur('urlInput')}
                      placeholder="https://example.com/.well-known/ucp"
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the full URL to your UCP manifest. Common paths:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs font-mono">
                        /.well-known/ucp
                      </Badge>
                      <Badge variant="outline" className="text-xs font-mono">
                        /.well-known/ucp.json
                      </Badge>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleValidate}
                    disabled={!urlInput.trim() || isValidating}
                    className="w-full"
                    size="lg"
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Fetching & Validating...
                      </>
                    ) : (
                      <>
                        <Globe className="mr-2 h-4 w-4" />
                        Fetch & Validate
                      </>
                    )}
                  </Button>

                  {/* URL Mode Info */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-700">
                      <strong>Note:</strong> We fetch the URL server-side to avoid CORS issues.
                      Make sure the URL is publicly accessible.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Validation Result Summary */}
            {validationResult && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200 delay-100">
                <FormSection
                  title="Validation Result"
                  icon={validationResult.valid ? CheckCircle2 : AlertCircle}
                  fields={[]}
                  data={{}}
                  onChange={() => { }}
                  isCompleted={validationResult.valid}
                >
                  <div className="space-y-3">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {validationResult.valid ? (
                        <Badge variant="default" className="bg-green-500">
                          ✓ Valid UCP Manifest
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          ✗ Invalid Manifest
                        </Badge>
                      )}
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="p-2 bg-green-50 border border-green-200 rounded">
                        <p className="text-xs text-muted-foreground">Passed</p>
                        <p className="text-lg font-bold text-green-700">{validationResult.passCount || 0}</p>
                      </div>
                      <div className="p-2 bg-red-50 border border-red-200 rounded">
                        <p className="text-xs text-muted-foreground">Failed</p>
                        <p className="text-lg font-bold text-red-700">{validationResult.errorCount || 0}</p>
                      </div>
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded">
                        <p className="text-xs text-muted-foreground">Warnings</p>
                        <p className="text-lg font-bold text-amber-700">{validationResult.warningCount || 0}</p>
                      </div>
                    </div>

                    {/* Error Summary */}
                    {validationResult.checks && validationResult.checks.filter(c => c.status === 'fail').length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium text-destructive">
                          {validationResult.checks.filter(c => c.status === 'fail').length} Error(s) Found:
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {validationResult.checks
                            .filter(c => c.status === 'fail')
                            .slice(0, 3)
                            .map((check, idx) => (
                              <li key={idx} className="text-muted-foreground">
                                {check.title}: {check.message}
                              </li>
                            ))}
                          {validationResult.checks.filter(c => c.status === 'fail').length > 3 && (
                            <li className="text-muted-foreground italic">
                              +{validationResult.checks.filter(c => c.status === 'fail').length - 3} more errors (see preview)
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Warning Summary */}
                    {validationResult.checks && validationResult.checks.filter(c => c.status === 'warning').length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium text-amber-600">
                          {validationResult.checks.filter(c => c.status === 'warning').length} Warning(s):
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {validationResult.checks
                            .filter(c => c.status === 'warning')
                            .slice(0, 2)
                            .map((check, idx) => (
                              <li key={idx} className="text-muted-foreground">
                                {check.title}: {check.message}
                              </li>
                            ))}
                          {validationResult.checks.filter(c => c.status === 'warning').length > 2 && (
                            <li className="text-muted-foreground italic">
                              +{validationResult.checks.filter(c => c.status === 'warning').length - 2} more warnings (see preview)
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </FormSection>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Based on UCP Protocol 2026-01-23
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-muted-foreground"
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Reset
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Preview + PaymentCTA */}
        <div className="lg:block hidden sticky top-24 self-start space-y-3">
          {/* Preview */}
          <UCPValidationPreview
            validationResult={validationResult}
            manifest={manifest}
            maxHeight="55vh"
          />

          {/* Psychology-optimized Payment CTA */}
          <PaymentCTA
            isFormComplete={isFormComplete}
            price={PDF_PRICE}
            documentType="ucp-validation"
            isTestMode={isTestMode}
            onPaymentSuccess={handleGenerateAndDownloadPDF}
            onPaymentError={handlePaymentError}
            completedSections={completedSections}
            totalSections={totalSections}
            paymentDescription="UCP Validation Report - Professional Document"
          />
        </div>
      </div>
    </>
  )
}
