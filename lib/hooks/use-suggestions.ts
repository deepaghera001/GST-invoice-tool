"use client"

import { useCallback, useMemo } from "react"
import { SuggestionProvider } from "@/lib/invoice/providers"

export function useSuggestions() {
  const analyzeGSTIN = useCallback((gstin: string) => {
    return SuggestionProvider.analyzeGSTIN(gstin)
  }, [])

  const extractPAN = useCallback((gstin: string) => {
    return SuggestionProvider.extractPANFromGSTIN(gstin)
  }, [])

  const generateInvoiceNumber = useCallback((prefix?: string) => {
    return SuggestionProvider.generateInvoiceNumber(prefix)
  }, [])

  const invoiceTemplates = useMemo(() => {
    return SuggestionProvider.getInvoiceTemplates()
  }, [])

  const gstStates = useMemo(() => {
    return SuggestionProvider.getGSTStates()
  }, [])

  return {
    // GSTIN
    analyzeGSTIN,
    extractPAN,
    gstStates,

    // Invoice
    generateInvoiceNumber,
    invoiceTemplates,
  }
}
