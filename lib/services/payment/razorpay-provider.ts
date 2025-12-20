import Razorpay from "razorpay"
import crypto from "crypto"
import { BasePaymentProvider } from "./base-payment-provider"
import type { PaymentOrder, PaymentVerificationData } from "@/lib/core/types"

export class RazorpayProvider extends BasePaymentProvider {
  name = "razorpay"
  private client: Razorpay

  constructor(keyId: string, keySecret: string) {
    super()
    this.client = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
  }

  async createOrder(amount: number, metadata?: Record<string, any>): Promise<PaymentOrder> {
    this.validateAmount(amount)

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: metadata?.receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
    }

    const order = await this.client.orders.create(options)

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      provider: this.name,
    }
  }

  async verifyPayment(paymentData: PaymentVerificationData): Promise<boolean> {
    const { orderId, paymentId, signature } = paymentData

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${orderId}|${paymentId}`)
      .digest("hex")

    return generatedSignature === signature
  }
}
