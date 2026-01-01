import Razorpay from "razorpay"
import crypto from "crypto"
import { BasePaymentProvider } from "./base-payment-provider"
import type { PaymentOrder, PaymentVerificationData } from "@/lib/core/types"
import type { IncomingMessage } from "http"

export class RazorpayProvider extends BasePaymentProvider {
  name = "razorpay"
  private client: Razorpay
  private mode: "test" | "live"

  constructor(keyId: string, keySecret: string, mode: "test" | "live" = "test") {
    super()
    this.mode = mode
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
      amount: Number(order.amount), // Ensure amount is a number
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

  async handleWebhook(req: IncomingMessage, secret: string): Promise<any> {
    const chunks: Uint8Array[] = []
    for await (const chunk of req) {
      chunks.push(chunk)
    }
    const body = Buffer.concat(chunks).toString()

    const signature = req.headers["x-razorpay-signature"] as string
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex")

    if (signature !== expectedSignature) {
      throw new Error("Invalid webhook signature")
    }

    return JSON.parse(body)
  }
}
