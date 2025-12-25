/**
 * Invoice Templates and Number Generation
 * Templates for different invoice types and number generation logic
 */

export interface InvoiceTemplate {
  id: string
  name: string
  invoicePrefix: string
  description: string
}

export const invoiceTemplates: InvoiceTemplate[] = [
  {
    id: "sales",
    name: "Sales Invoice",
    invoicePrefix: "SI-",
    description: "Standard sales invoice",
  },
  {
    id: "service",
    name: "Service Invoice",
    invoicePrefix: "SRV-",
    description: "Invoice for services rendered",
  },
  {
    id: "proforma",
    name: "Proforma Invoice",
    invoicePrefix: "PI-",
    description: "Quotation or proforma invoice",
  },
  {
    id: "export",
    name: "Export Invoice",
    invoicePrefix: "EXP-",
    description: "Invoice for export",
  },
]

export function generateInvoiceNumber(prefix: string): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")

  return `${prefix}${year}${month}${random}`
}
