import type { PaymentProvider, PaymentOrder, PaymentVerificationData } from "@/lib/core/types"

export abstract class BasePaymentProvider implements PaymentProvider {
  abstract name: string

  abstract createOrder(amount: number, metadata?: Record<string, any>): Promise<PaymentOrder>

  abstract verifyPayment(paymentData: PaymentVerificationData): Promise<boolean>

  protected validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0")
    }
  }
}
