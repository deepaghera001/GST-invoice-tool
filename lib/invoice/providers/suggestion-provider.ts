/**
 * Suggestion Provider
 * Provides GSTIN and invoice-related suggestions
 */

import { gstinStates, getStateFromGSTIN } from "../data/gstin-states"
import { invoiceTemplates, generateInvoiceNumber } from "../data/invoice-templates"

export interface Suggestion {
  value: string
  label: string
  metadata?: any
}

export class SuggestionProvider {
  /**
   * Get state name from GSTIN
   */
  static getStateFromGSTIN(gstin: string): string | null {
    return getStateFromGSTIN(gstin)
  }

  /**
   * Get all GST states
   */
  static getGSTStates(): typeof gstinStates {
    return gstinStates
  }

  /**
   * Get invoice templates
   */
  static getInvoiceTemplates(): typeof invoiceTemplates {
    return invoiceTemplates
  }

  /**
   * Generate invoice number
   */
  static generateInvoiceNumber(prefix = "INV-"): string {
    return generateInvoiceNumber(prefix)
  }

  /**
   * Validate and extract info from GSTIN
   */
  static analyzeGSTIN(gstin: string): {
    isValid: boolean
    state: string | null
    stateCode: string | null
    pan: string | null
  } {
    if (gstin.length !== 15) {
      return { isValid: false, state: null, stateCode: null, pan: null }
    }

    const stateCode = gstin.substring(0, 2)
    const pan = gstin.substring(2, 12)
    const state = getStateFromGSTIN(gstin)

    return {
      isValid: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin),
      state,
      stateCode,
      pan,
    }
  }

  /**
   * Auto-fill PAN from GSTIN
   */
  static extractPANFromGSTIN(gstin: string): string | null {
    if (gstin.length < 12) return null
    return gstin.substring(2, 12)
  }
}
