"use server"
import { documentService } from "@/lib/services/document-service"

export async function createPaymentOrder(amount: number, provider = "razorpay") {
  try {
    const order = await documentService.createPaymentOrder({
      provider,
      amount,
      currency: "INR",
    })

    // Return payment configuration for client
    return {
      success: true,
      data: {
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      },
    }
  } catch (error) {
    console.error("[v0] Payment order creation failed:", error)
    return {
      success: false,
      error: "Failed to create payment order",
    }
  }
}
