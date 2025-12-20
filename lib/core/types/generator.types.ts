export interface PDFGenerator<T = any> {
  name: string
  generate: (data: T, options?: GeneratorOptions) => Promise<Buffer>
  supports: (documentType: string) => boolean
}

export interface GeneratorOptions {
  format?: "A4" | "Letter"
  orientation?: "portrait" | "landscape"
  margins?: {
    top: number
    right: number
    bottom: number
    left: number
  }
}
