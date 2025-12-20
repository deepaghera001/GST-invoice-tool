import type { PaymentConfig, PaymentVerificationData } from "@/lib/core/types"
import { PaymentFactory } from "./payment/payment-factory"
import { GeneratorFactory } from "./generators/generator-factory"

export class DocumentService {
  async createPaymentOrder(config: PaymentConfig) {
    const provider = PaymentFactory.create(config.provider)
    return provider.createOrder(config.amount, config.metadata)
  }

  async verifyAndGenerateDocument<T>(
    paymentData: PaymentVerificationData,
    documentData: T,
    documentType: string,
    providerName = "razorpay",
  ): Promise<Buffer> {
    // Verify payment
    const provider = PaymentFactory.create(providerName)
    const isValid = await provider.verifyPayment(paymentData)

    if (!isValid) {
      throw new Error("Payment verification failed")
    }

    // Generate document
    const generator = GeneratorFactory.getGenerator(documentType)
    return generator.generate(documentData)
  }

  async generateDocument<T>(documentData: T, documentType: string): Promise<Buffer> {
    const generator = GeneratorFactory.getGenerator(documentType)
    return generator.generate(documentData)
  }
}

// Singleton instance
export const documentService = new DocumentService()
