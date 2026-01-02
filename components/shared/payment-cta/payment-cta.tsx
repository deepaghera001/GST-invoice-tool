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
  onPaymentSuccess,
  onPaymentError,
  completedSections,
  totalSections,
  paymentDescription,
}: PaymentCTAProps) {
  const documentName = DOCUMENT_DISPLAY_NAMES[documentType]
  const [isGenerating, setIsGenerating] = useState(false)
  const { initiatePayment, loading: paymentLoading } = usePayment()
  
  // Combined processing state
  const isProcessing = isGenerating || paymentLoading
  
  // Show progress if section counts provided
  const showProgress = completedSections !== undefined && totalSections !== undefined

  /**
   * Handle button click - manages payment flow internally
   */
  const handleClick = async () => {
    if (!isFormComplete || isProcessing) return

    // Test mode: Skip payment, directly generate PDF
    if (isTestMode) {
      setIsGenerating(true)
      try {
        await onPaymentSuccess()
      } finally {
        setIsGenerating(false)
      }
      return
    }

    // Production mode: Initiate Razorpay payment
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

  return (
    <div className="space-y-4 pt-4">
      {/* Progress indicator (shows while form incomplete) */}
      {showProgress && !isFormComplete && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
          <FormProgress
            completedSections={completedSections}
            totalSections={totalSections}
            isComplete={isFormComplete}
          />
        </div>
      )}

      {/* Completion celebration (when form is complete) */}
      {isFormComplete && (
        <div 
          className={cn(
            "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/30",
            "border border-green-200 dark:border-green-800 rounded-xl p-5 space-y-3 relative",
            "shadow-lg shadow-green-100/50 dark:shadow-green-900/20",
            // Satisfying entrance animation (800ms)
            "animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-700 ease-out"
          )}
        >
          {/* Success header with bounce animation */}
          <div className="flex items-center gap-2.5 text-green-700 dark:text-green-400">
            <div className="relative">
              <CheckCircle2 
                className={cn(
                  "h-6 w-6",
                  "animate-in zoom-in-0 spin-in-180 duration-700"
                )} 
              />
              {/* Celebration ring pulse */}
              <div className="absolute inset-0 rounded-full bg-green-400/30 animate-ping" />
            </div>
            <span className="font-semibold text-base animate-in fade-in slide-in-from-left-2 duration-500 delay-200">
              All details verified
            </span>
          </div>
          
          {/* Benefits list with staggered animation */}
          <div className="text-sm text-green-600 dark:text-green-500 space-y-2 pl-1">
            <p className="flex items-center gap-2 animate-in fade-in slide-in-from-left-3 duration-500 delay-300">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Professional {documentName} ready</span>
            </p>
            <p className="flex items-center gap-2 animate-in fade-in slide-in-from-left-3 duration-500 delay-500">
              <Download className="h-4 w-4" />
              <span>{isTestMode ? "Download instantly" : "Download instantly after payment"}</span>
            </p>
          </div>
          
          {/* Subtle confetti dots */}
          <div className="absolute top-2 right-2 flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce delay-100" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce delay-300" />
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
