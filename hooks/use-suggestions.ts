"use client"

import { useState, useCallback, useMemo } from "react"
import { SuggestionProvider, type Suggestion } from "@/lib/suggestions"

export function useSuggestions() {
  const [hsnSuggestions, setHsnSuggestions] = useState<Suggestion[]>([])

  const searchHSN = useCallback((query: string) => {
    const suggestions = SuggestionProvider.getHSNSuggestions(query)
    setHsnSuggestions(suggestions)
    return suggestions
  }, [])

  const getGSTRateForHSN = useCallback((hsnCode: string) => {
    return SuggestionProvider.getGSTRateSuggestion(hsnCode)
  }, [])

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
    // HSN
    hsnSuggestions,
    searchHSN,
    getGSTRateForHSN,

    // GSTIN
    analyzeGSTIN,
    extractPAN,
    gstStates,

    // Invoice
    generateInvoiceNumber,
    invoiceTemplates,
  }
}
