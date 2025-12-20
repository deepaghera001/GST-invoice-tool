export interface BaseDocumentData {
  id?: string
  createdAt?: string
}

export interface DocumentTotals {
  subtotal: number
  taxAmount: number
  total: number
  [key: string]: number
}

export interface DocumentMetadata {
  type: string
  version: string
  generatedBy?: string
}
