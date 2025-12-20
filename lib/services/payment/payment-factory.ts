import type { PaymentProvider } from "@/lib/core/types"
import { RazorpayProvider } from "./razorpay-provider"

export class PaymentFactory {
  private static providers = new Map<string, () => PaymentProvider>()

  static {
    // Register default providers
    this.register("razorpay", () => {
      return new RazorpayProvider(process.env.RAZORPAY_KEY_ID!, process.env.RAZORPAY_KEY_SECRET!)
    })
  }

  static register(name: string, factory: () => PaymentProvider): void {
    this.providers.set(name, factory)
  }

  static create(name: string): PaymentProvider {
    const factory = this.providers.get(name)
    if (!factory) {
      throw new Error(`Payment provider "${name}" not found`)
    }
    return factory()
  }

  static getAvailableProviders(): string[] {
    return Array.from(this.providers.keys())
  }
}
