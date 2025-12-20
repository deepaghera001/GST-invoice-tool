export interface PaymentProvider {
  name: string
  createOrder: (amount: number, metadata?: Record<string, any>) => Promise<PaymentOrder>
  verifyPayment: (paymentData: PaymentVerificationData) => Promise<boolean>
}

export interface PaymentOrder {
  orderId: string
  amount: number
  currency: string
  provider: string
}

export interface PaymentVerificationData {
  paymentId: string
  orderId: string
  signature: string
  [key: string]: string
}

export interface PaymentConfig {
  provider: string
  amount: number
  currency?: string
  metadata?: Record<string, any>
}
