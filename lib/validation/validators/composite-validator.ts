import type { InvoiceValidationErrors } from "../schemas/invoice.schema"
import { validateSellerFields } from "./seller-validator"
import { validateBuyerFields } from "./buyer-validator"
import { validateInvoiceFields } from "./invoice-validator"
import { validateItemFields } from "./item-validator"
import { validateTaxFields } from "./tax-validator"

/**
 * Validate all fields by section
 * @param data - The complete invoice data to validate
 * @returns Object with field names as keys and error messages as values
 */
export function validateAllFields(data: any): InvoiceValidationErrors {
  const errors: InvoiceValidationErrors = {}
  
  // Validate seller fields
  const sellerErrors = validateSellerFields({
    sellerName: data.sellerName,
    sellerAddress: data.sellerAddress,
    sellerGSTIN: data.sellerGSTIN
  })
  Object.assign(errors, sellerErrors)
  
  // Validate buyer fields
  const buyerErrors = validateBuyerFields({
    buyerName: data.buyerName,
    buyerAddress: data.buyerAddress,
    buyerGSTIN: data.buyerGSTIN
  })
  Object.assign(errors, buyerErrors)
  
  // Validate invoice fields
  const invoiceErrors = validateInvoiceFields({
    invoiceNumber: data.invoiceNumber,
    invoiceDate: data.invoiceDate
  })
  Object.assign(errors, invoiceErrors)
  
  // Validate item fields
  const itemErrors = validateItemFields({
    itemDescription: data.itemDescription,
    hsnCode: data.hsnCode,
    quantity: data.quantity,
    rate: data.rate
  })
  Object.assign(errors, itemErrors)
  
  // Validate tax fields
  const taxErrors = validateTaxFields({
    cgst: data.cgst,
    sgst: data.sgst,
    igst: data.igst
  })
  Object.assign(errors, taxErrors)
  
  return errors
}