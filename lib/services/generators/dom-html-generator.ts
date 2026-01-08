import { BasePDFGenerator } from "./base-pdf-generator"
import type { GeneratorOptions } from "@/lib/core/types"
import type { InvoiceData } from "@/lib/invoice"

export class DOMHTMLGenerator extends BasePDFGenerator<InvoiceData> {
  name = "dom-html-generator"

  supports(documentType: string): boolean {
    return documentType === "html-invoice"
  }

  async generate(data: InvoiceData, options?: GeneratorOptions): Promise<Buffer> {
    // This generator expects the HTML content to be passed in the options
    // Since we can't pass it through the standard interface, we'll throw an error
    // This is just a placeholder - the actual implementation will be in the API route
    throw new Error("DOMHTMLGenerator should not be called directly. Use the API route instead.")
  }
}