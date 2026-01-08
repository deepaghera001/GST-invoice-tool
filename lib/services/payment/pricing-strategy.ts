export interface PricingStrategy {
  calculatePrice(data: any): number
}

export class PerPdfPricing implements PricingStrategy {
  calculatePrice(data: { pages: number }): number {
    const pricePerPage = 10 // Example: ₹10 per page
    return data.pages * pricePerPage
  }
}

export class SubscriptionPricing implements PricingStrategy {
  calculatePrice(): number {
    return 999 // Example: ₹999 per month
  }
}

export class PricingContext {
  private strategy: PricingStrategy

  constructor(strategy: PricingStrategy) {
    this.strategy = strategy
  }

  setStrategy(strategy: PricingStrategy) {
    this.strategy = strategy
  }

  calculate(data: any): number {
    return this.strategy.calculatePrice(data)
  }
}