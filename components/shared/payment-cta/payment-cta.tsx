/**
 * Payment CTA Component
 * Psychology-optimized call-to-action for document downloads
 * 
 * FULLY MODULAR: Handles payment internally via usePayment hook
 * Parent only needs to provide onPaymentSuccess callback
 * 
 * Implements:
 * - IKEA effect: User invested effort, so they value the result
 * - Endowment effect: "This is MY document"
 * - Loss aversion: "I'll lose this if I leave"
 * - Completion bias: "Just one last step"
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Download, Lock, CheckCircle2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePayment } from "@/lib/hooks/use-payment"
import { FormProgress } from "./form-progress"
import type { PaymentCTAProps } from "./types"
import { DOCUMENT_DISPLAY_NAMES } from "./types"

export function PaymentCTA({
  isFormComplete,
  price,
  documentType,
  ctaText,
  incompleteText,
  isTestMode = false,
  getHTMLContent,
  onPaymentSuccess,
  onPaymentError,
  completedSections,
  totalSections,
  paymentDescription,
  filename = "document.pdf",
}: PaymentCTAProps) {
  const documentName = DOCUMENT_DISPLAY_NAMES[documentType]
  const [isGenerating, setIsGenerating] = useState(false)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const { initiatePayment, loading: paymentLoading } = usePayment()
  
  // Combined processing state
  const isProcessing = isGenerating || paymentLoading
  
  // Show progress if section counts provided
  const showProgress = completedSections !== undefined && totalSections !== undefined

  /**
   * NEW SIMPLE FLOW: Generate PDF → Store in memory → Show payment → Download
   * Uses existing /api/generate-pdf endpoint
   */
  const handleClick = async () => {
    if (!isFormComplete || isProcessing) return

    // NEW FLOW: Use getHTMLContent if provided (simple in-memory storage)
    if (getHTMLContent) {
      setIsGenerating(true)
      
      try {
        // STEP 1: Get HTML content
        const htmlContent = getHTMLContent()
        if (!htmlContent) {
          throw new Error("Failed to generate HTML content")
        }

        // STEP 2: Generate PDF silently using EXISTING API
        console.log("[CTA] Pre-generating PDF...")
        const response = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ htmlContent, filename }),
        })

        if (!response.ok) {
          throw new Error('PDF generation failed')
        }

        // Store blob in browser memory
        const blob = await response.blob()
        setPdfBlob(blob)
        console.log("[CTA] PDF ready in memory")

        setIsGenerating(false)

        // Test mode: Download immediately without payment
        if (isTestMode) {
          downloadBlob(blob, filename)
          return
        }

        // STEP 3: PDF ready, now show payment modal
        initiatePayment({
          amount: price,
          name: documentName,
          description: paymentDescription || `${documentName} - Professional Document`,
          onSuccess: async (paymentId, orderId) => {
            console.log("[CTA] Payment successful, downloading PDF...")
            // STEP 4: Download the blob we already have
            downloadBlob(blob, filename)
            setPdfBlob(null)
          },
          onError: (error) => {
            console.error("[CTA] Payment failed:", error)
            onPaymentError?.(error)
            // Keep blob in memory so user can retry payment
          },
        })
        
      } catch (error) {
        // PDF generation failed BEFORE payment - user NOT charged
        console.error("[CTA] PDF generation failed before payment:", error)
        setIsGenerating(false)
        setPdfBlob(null)
        
        const errorMessage = error instanceof Error 
          ? error.message 
          : "Failed to generate PDF. Please try again."
        
        onPaymentError?.(errorMessage)
      }
      return
    }

    // OLD FLOW: Legacy support for existing forms
    if (isTestMode) {
      setIsGenerating(true)
      try {
        await onPaymentSuccess()
      } finally {
        setIsGenerating(false)
      }
      return
    }

    // OLD FLOW: Payment first, then generate
    initiatePayment({
      amount: price,
      name: documentName,
      description: paymentDescription || `${documentName} - Professional Document`,
      onSuccess: async (paymentId, orderId) => {
        console.log("Payment successful:", { paymentId, orderId })
        setIsGenerating(true)
        try {
          await onPaymentSuccess()
        } finally {
          setIsGenerating(false)
        }
      },
      onError: (error) => {
        console.error("Payment failed:", error)
        onPaymentError?.(error)
      },
    })
  }

  /**
   * Simple blob download helper
   */
  const downloadBlob = (blob: Blob, name: string) => {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-2">
      {/* Compact progress indicator (shows while form incomplete) */}
      {showProgress && !isFormComplete && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
          <FormProgress
            completedSections={completedSections}
            totalSections={totalSections}
            isComplete={isFormComplete}
          />
        </div>
      )}

      {/* Compact completion indicator (when form is complete) */}
      {isFormComplete && (
        <div 
          className={cn(
            "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/30",
            "border border-green-200 dark:border-green-800 rounded-lg px-3 py-2",
            "animate-in fade-in zoom-in-95 duration-500 ease-out"
          )}
        >
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm font-medium">Ready to download</span>
            <Sparkles className="h-3 w-3 ml-auto animate-pulse" />
          </div>
        </div>
      )}

      {/* Main CTA Button */}
      <Button
        type="button"
        size="lg"
        disabled={isProcessing || !isFormComplete}
        onClick={handleClick}
        className={cn(
          "w-full text-base relative overflow-hidden",
          // Slower, more satisfying transition (500ms)
          "transition-all duration-500 ease-out",
          // Transform on state change for visual feedback
          isFormComplete 
            ? "bg-primary hover:bg-primary/90 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]" 
            : "bg-muted text-muted-foreground cursor-not-allowed",
          // Entrance animation
          "animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100"
        )}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center animate-in fade-in duration-300">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isGenerating ? "Generating PDF..." : "Processing Payment..."}
          </span>
        ) : isFormComplete ? (
          <span className="flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
            <Download className="mr-2 h-4 w-4 animate-bounce" />
            {ctaText || (isTestMode 
              ? `Download ${documentName} (Test Mode - Free)` 
              : `Download ${documentName} – ₹${price}`
            )}
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <Lock className="mr-2 h-4 w-4" />
            {incompleteText || "Complete form to download PDF"}
          </span>
        )}
        
        {/* Shine effect on enabled button */}
        {isFormComplete && !isProcessing && (
          <div 
            className={cn(
              "absolute inset-0 -translate-x-full",
              "bg-gradient-to-r from-transparent via-white/20 to-transparent",
              "animate-shine"
            )} 
          />
        )}
      </Button>

      {/* Trust/Security text */}
      <p 
        className={cn(
          "text-xs text-center transition-all duration-500 ease-out",
          isFormComplete 
            ? "text-muted-foreground animate-in fade-in duration-500 delay-300" 
            : "text-muted-foreground/70"
        )}
      >
        {isTestMode ? (
          <span className="inline-flex items-center gap-1">
            ⚠️ Test mode enabled - PDF downloads are free
          </span>
        ) : isFormComplete ? (
          <span className="inline-flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Secure payment via Razorpay. {documentName} generated instantly.
          </span>
        ) : (
          <span className="animate-in fade-in duration-300">
            Fill all required fields to generate your {documentName}
          </span>
        )}
      </p>
    </div>
  )
}
