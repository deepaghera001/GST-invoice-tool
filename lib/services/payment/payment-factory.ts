import type { PaymentProvider } from "@/lib/core/types"
import { RazorpayProvider } from "./razorpay-provider"

export class PaymentFactory {
  private static providers = new Map<string, (mode: "test" | "live") => PaymentProvider>()

  static {
    // Register default providers
    this.register("razorpay", (mode) => {
      return new RazorpayProvider(
        process.env.RAZORPAY_KEY_ID!,
        process.env.RAZORPAY_KEY_SECRET!,
        mode
      )
    })
  }

  static register(name: string, factory: (mode: "test" | "live") => PaymentProvider): void {
    this.providers.set(name, factory)
  }

  static create(name: string, mode: "test" | "live" = "test"): PaymentProvider {
    const factory = this.providers.get(name)
    if (!factory) {
      throw new Error(`Payment provider "${name}" not found`)
    }
    return factory(mode)
  }

  static getAvailableProviders(): string[] {
    return Array.from(this.providers.keys())
  }
}
