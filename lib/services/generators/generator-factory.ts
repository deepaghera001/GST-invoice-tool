import type { PDFGenerator } from "@/lib/core/types"
import { InvoicePDFGenerator } from "./invoice-pdf-generator"

export class GeneratorFactory {
  private static generators: PDFGenerator[] = []

  static {
    // Register default generators
    this.register(new InvoicePDFGenerator())
  }

  static register(generator: PDFGenerator): void {
    this.generators.push(generator)
  }

  static getGenerator(documentType: string): PDFGenerator {
    const generator = this.generators.find((g) => g.supports(documentType))
    if (!generator) {
      throw new Error(`No generator found for document type "${documentType}"`)
    }
    return generator
  }

  static getAvailableGenerators(): string[] {
    return this.generators.map((g) => g.name)
  }
}
