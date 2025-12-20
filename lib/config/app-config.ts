export const appConfig = {
  payment: {
    defaultProvider: "razorpay",
    defaultCurrency: "INR",
    defaultAmount: 99,
  },
  pdf: {
    defaultFormat: "A4" as const,
    defaultOrientation: "portrait" as const,
  },
  app: {
    name: "InvoiceGen",
    description: "Professional GST Invoice Generator",
  },
} as const
