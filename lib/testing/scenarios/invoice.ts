/**
 * Invoice Test Scenarios
 * Add new test case = Add new object to array
 */

import type { TestScenario } from '../types';
import type { InvoiceData } from '@/lib/invoice';

// Base valid data - reuse across scenarios
const VALID_BASE: InvoiceData = {
  sellerName: "ABC Software Solutions Pvt Ltd",
  sellerAddress: "123 Tech Park, Whitefield, Bangalore, Karnataka 560066",
  sellerGSTIN: "29ABCDE1234F1Z5",
  buyerName: "XYZ Corporation",
  buyerAddress: "456 Business Center, Andheri East, Mumbai, Maharashtra 400069",
  buyerGSTIN: "27XYZWV9876F1Z3",
  placeOfSupplyState: "27",
  invoiceNumber: "INV-2025-001",
  invoiceDate: new Date().toISOString().split("T")[0],
  itemDescription: "Software Development Services - Custom Web Application",
  hsnCode: "998314",
  quantity: "10",
  rate: "15000",
  cgst: "9",
  sgst: "9",
  igst: "0",
};

/**
 * Invoice Test Scenarios
 * 🟢 To add new test: Just add a new object below!
 */
export const invoiceScenarios: TestScenario<InvoiceData>[] = [
  // ✅ VALID SCENARIOS
  {
    id: 'valid-complete',
    name: '✅ Complete Valid Invoice',
    category: 'valid',
    description: 'All fields filled with valid data - intra-state',
    data: VALID_BASE,
  },
  {
    id: 'valid-inter-state',
    name: '✅ Valid Inter-State (IGST)',
    category: 'valid',
    description: 'Inter-state invoice with IGST',
    data: {
      ...VALID_BASE,
      buyerGSTIN: "07PQRST5678G1Z2", // Delhi
      placeOfSupplyState: "07",
      cgst: "0",
      sgst: "0",
      igst: "18",
    },
  },
  {
    id: 'valid-no-buyer-gstin',
    name: '✅ Valid B2C (No Buyer GSTIN)',
    category: 'valid',
    description: 'B2C invoice without buyer GSTIN',
    data: {
      ...VALID_BASE,
      buyerGSTIN: "",
      placeOfSupplyState: "29",
    },
  },

  // ❌ INVALID SCENARIOS
  {
    id: 'invalid-seller-gstin',
    name: '❌ Invalid Seller GSTIN',
    category: 'invalid',
    description: 'Tests GSTIN format validation',
    data: {
      ...VALID_BASE,
      sellerGSTIN: "INVALID123",
    },
    expectedErrors: ['sellerGSTIN'],
  },
  {
    id: 'invalid-buyer-gstin',
    name: '❌ Invalid Buyer GSTIN',
    category: 'invalid',
    description: 'Tests buyer GSTIN format validation',
    data: {
      ...VALID_BASE,
      buyerGSTIN: "WRONG_FORMAT_GSTIN",
    },
    expectedErrors: ['buyerGSTIN'],
  },
  {
    id: 'invalid-hsn',
    name: '❌ Invalid HSN/SAC Code',
    category: 'invalid',
    description: 'Tests HSN/SAC code format (must be 4-8 digits)',
    data: {
      ...VALID_BASE,
      hsnCode: "12", // Too short
    },
    expectedErrors: ['hsnCode'],
  },
  {
    id: 'invalid-zero-rate',
    name: '❌ Zero Rate',
    category: 'invalid',
    description: 'Tests rate must be positive',
    data: {
      ...VALID_BASE,
      rate: "0",
    },
    expectedErrors: ['rate'],
  },
  {
    id: 'invalid-negative-quantity',
    name: '❌ Negative Quantity',
    category: 'invalid',
    description: 'Tests quantity must be positive',
    data: {
      ...VALID_BASE,
      quantity: "-5",
    },
    expectedErrors: ['quantity'],
  },

  // ⚠️ EDGE CASES
  {
    id: 'edge-long-description',
    name: '⚠️ Very Long Description',
    category: 'edge-case',
    description: 'Tests description at max length',
    data: {
      ...VALID_BASE,
      itemDescription: "A".repeat(200) + " - Testing maximum length handling for item description field to ensure proper display and PDF generation",
    },
  },
  {
    id: 'edge-high-value',
    name: '⚠️ High Value Invoice',
    category: 'edge-case',
    description: 'Tests large amounts (₹1 Crore)',
    data: {
      ...VALID_BASE,
      quantity: "100",
      rate: "100000",
    },
  },
  {
    id: 'edge-decimal-quantity',
    name: '⚠️ Decimal Quantity',
    category: 'edge-case',
    description: 'Tests fractional quantity (0.5 hours)',
    data: {
      ...VALID_BASE,
      quantity: "0.5",
      rate: "10000",
    },
  },

  // 📝 PARTIAL DATA
  {
    id: 'partial-seller-only',
    name: '📝 Seller Details Only',
    category: 'partial',
    description: 'Only seller section filled',
    data: {
      sellerName: "ABC Software Solutions Pvt Ltd",
      sellerAddress: "123 Tech Park, Bangalore, Karnataka 560066",
      sellerGSTIN: "29ABCDE1234F1Z5",
      buyerName: "",
      buyerAddress: "",
      buyerGSTIN: "",
      placeOfSupplyState: "",
      invoiceNumber: "",
      invoiceDate: "",
      itemDescription: "",
      hsnCode: "",
      quantity: "",
      rate: "",
      cgst: "9",
      sgst: "9",
      igst: "0",
    },
  },
  {
    id: 'partial-empty',
    name: '📝 Empty Form',
    category: 'partial',
    description: 'Tests all required field validations',
    data: {
      sellerName: "",
      sellerAddress: "",
      sellerGSTIN: "",
      buyerName: "",
      buyerAddress: "",
      buyerGSTIN: "",
      placeOfSupplyState: "",
      invoiceNumber: "",
      invoiceDate: "",
      itemDescription: "",
      hsnCode: "",
      quantity: "",
      rate: "",
      cgst: "0",
      sgst: "0",
      igst: "0",
    },
    expectedErrors: ['sellerName', 'sellerAddress', 'sellerGSTIN', 'invoiceNumber', 'invoiceDate', 'itemDescription', 'quantity', 'rate'],
  },
];
