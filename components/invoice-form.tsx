"use client"

import type React from "react"
import { useState, useMemo } from "react"
import type { InvoiceData } from "@/lib/types"
import { calculateInvoiceTotals } from "@/lib/invoice-utils"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Download } from "lucide-react"
import { InvoicePreview } from "@/components/invoice-preview"
import { SellerDetails } from "@/components/form-sections/seller-details"
import { BuyerDetails } from "@/components/form-sections/buyer-details"
import { InvoiceDetails } from "@/components/form-sections/invoice-details"
import { ItemDetails } from "@/components/form-sections/item-details"
import { TaxDetails } from "@/components/form-sections/tax-details"
import { Separator } from "@/components/ui/separator"
import { createPaymentOrder } from "@/lib/actions/payment-actions"
import { useFormValidation } from "@/hooks/use-form-validation"
import { useSuggestions } from "@/hooks/use-suggestions"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const gstinRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

export function InvoiceForm() {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"quick" | "detailed">("detailed")
  const { errors, validateField, validateForm, markFieldTouched, shouldShowError } = useFormValidation()
  const suggestions = useSuggestions()

  const [formData, setFormData] = useState<InvoiceData>({
    sellerName: "",
    sellerAddress: "",
    sellerGSTIN: "",
    buyerName: "",
    buyerAddress: "",
    buyerGSTIN: "",
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    itemDescription: "",
    hsnCode: "",
    quantity: "1", // Default to 1
    rate: "",
    cgst: "9",
    sgst: "9",
    igst: "0",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (shouldShowError(name)) {
      validateField(name, value)
    }
  }

  const handleBlur = (fieldName: string, value: any) => {
    markFieldTouched(fieldName)
    validateField(fieldName, value)
  }

  const totals = calculateInvoiceTotals(formData)

  const isSellerGSTINValid = useMemo(() => {
    return gstinRegex.test(formData.sellerGSTIN)
  }, [formData.sellerGSTIN])

  const canSubmit = useMemo(() => {
    return (
      formData.sellerName.trim().length >= 2 &&
      formData.sellerAddress.trim().length >= 10 &&
      isSellerGSTINValid &&
      formData.invoiceNumber.trim().length >= 1 &&
      formData.invoiceDate.length > 0 &&
      formData.itemDescription.trim().length >= 3 &&
      Number.parseFloat(formData.quantity) > 0 &&
      Number.parseFloat(formData.rate) > 0
    )
  }, [formData, isSellerGSTINValid])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isSellerGSTINValid) {
      toast({
        title: "Invalid Seller GSTIN",
        description: "Please enter a valid seller GSTIN before proceeding with payment.",
        variant: "destructive",
      })
      return
    }

    const { isValid, errors: validationErrors } = validateForm(formData)

    if (!isValid) {
      Object.keys(validationErrors).forEach((field) => markFieldTouched(field))

      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const amount = selectedPlan === "quick" ? 25 : 99
      const orderResult = await createPaymentOrder(amount, "razorpay")

      if (!orderResult.success || !orderResult.data) {
        throw new Error(orderResult.error || "Failed to create order")
      }

      const { orderId, amount: orderAmount, currency, keyId } = orderResult.data

      const options = {
        key: keyId,
        amount: orderAmount,
        currency,
        name: "InvoiceGen",
        description: selectedPlan === "quick" ? "Quick Invoice PDF" : "Detailed GST Invoice PDF",
        order_id: orderId,
        handler: async (response: any) => {
          try {
            const pdfResponse = await fetch("/api/generate-pdf", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                invoiceData: formData,
              }),
            })

            if (!pdfResponse.ok) {
              throw new Error("Payment verification failed")
            }

            const blob = await pdfResponse.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `invoice-${formData.invoiceNumber}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            toast({
              title: "Success!",
              description: "Your invoice has been generated and downloaded",
            })
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to generate PDF. Please contact support.",
              variant: "destructive",
            })
          } finally {
            setIsProcessing(false)
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false)
          },
        },
        prefill: {
          name: formData.sellerName,
        },
        theme: {
          color: "#3b82f6",
        },
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground text-balance">Create Your Invoice</h2>
            <p className="text-muted-foreground text-pretty">
              Fill in the details below to generate a professional GST-compliant invoice. Preview updates in real-time.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 p-4 border border-border rounded-lg bg-card">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Choose Your Plan</h3>
                <p className="text-sm text-muted-foreground">Select the invoice type that fits your needs</p>
              </div>

              <RadioGroup
                value={selectedPlan}
                onValueChange={(value) => setSelectedPlan(value as "quick" | "detailed")}
              >
                <div className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="quick" id="quick" className="mt-1" />
                  <Label htmlFor="quick" className="cursor-pointer flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-foreground">Quick Invoice</span>
                      <span className="text-lg font-bold text-primary">₹25</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Basic invoice format for simple transactions</p>
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-3 border border-primary rounded-lg bg-primary/5 cursor-pointer">
                  <RadioGroupItem value="detailed" id="detailed" className="mt-1" />
                  <Label htmlFor="detailed" className="cursor-pointer flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-foreground">Detailed GST Invoice</span>
                      <span className="text-lg font-bold text-primary">₹99</span>
                    </div>
                    <p className="text-xs text-muted-foreground">CA-ready format with complete GST compliance</p>
                  </Label>
                </div>
              </RadioGroup>

              <p className="text-xs text-center text-muted-foreground pt-2">
                Cheaper than a CA call. Faster than Word. Safer than free tools.
              </p>
            </div>

            <Separator />

            <SellerDetails
              formData={formData}
              onChange={handleChange}
              onBlur={handleBlur}
              errors={errors}
              shouldShowError={shouldShowError}
              suggestions={suggestions}
            />
            <Separator />

            <BuyerDetails
              formData={formData}
              onChange={handleChange}
              onBlur={handleBlur}
              errors={errors}
              shouldShowError={shouldShowError}
            />
            <Separator />

            <InvoiceDetails
              formData={formData}
              onChange={handleChange}
              onBlur={handleBlur}
              errors={errors}
              shouldShowError={shouldShowError}
              suggestions={suggestions}
            />
            <Separator />

            <ItemDetails
              formData={formData}
              onChange={handleChange}
              onBlur={handleBlur}
              errors={errors}
              shouldShowError={shouldShowError}
              suggestions={suggestions}
              setFormData={setFormData}
            />
            <Separator />

            <TaxDetails formData={formData} onChange={handleChange} setFormData={setFormData} />

            <div className="flex flex-col gap-3 pt-4">
              <div className="text-center py-2">
                <p className="text-sm font-medium text-primary">Avoid GST mistakes in 2 minutes</p>
              </div>

              <Button type="submit" size="lg" disabled={isProcessing || !canSubmit} className="w-full">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Pay ₹{selectedPlan === "quick" ? "25" : "99"} & Download PDF
                  </>
                )}
              </Button>
              {!canSubmit && !isProcessing && (
                <p className="text-xs text-center text-destructive">
                  Please fill in all required fields with valid data to continue
                </p>
              )}
              <p className="text-xs text-center text-muted-foreground">
                Secure payment via Razorpay. Your invoice generates instantly after payment confirmation.
              </p>
              <p className="text-xs text-center text-muted-foreground italic">
                Based on standard GST invoice requirements for services.
              </p>
            </div>
          </form>
        </div>

        <div className="lg:block hidden">
          <InvoicePreview formData={formData} totals={totals} errors={errors} />
        </div>
      </div>
    </>
  )
}
