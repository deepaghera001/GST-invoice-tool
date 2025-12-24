import type { PDFGenerator } from "@/lib/core/types"
import { DOMHTMLGenerator } from "./dom-html-generator"

export class GeneratorFactory {
  private static generators: PDFGenerator[] = []

  static {
    // Register default generators
    this.register(new DOMHTMLGenerator())
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