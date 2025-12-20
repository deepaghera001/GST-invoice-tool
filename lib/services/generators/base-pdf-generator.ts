import type { PDFGenerator, GeneratorOptions } from "@/lib/core/types"

export abstract class BasePDFGenerator<T = any> implements PDFGenerator<T> {
  abstract name: string

  abstract generate(data: T, options?: GeneratorOptions): Promise<Buffer>

  abstract supports(documentType: string): boolean

  protected getDefaultOptions(): GeneratorOptions {
    return {
      format: "A4",
      orientation: "portrait",
      margins: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    }
  }
}
