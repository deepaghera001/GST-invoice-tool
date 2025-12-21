import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { getStateFromGSTIN } from "@/lib/suggestions/data/gstin-states"

interface InvoiceData {
  sellerName: string
  sellerAddress: string
  sellerGSTIN: string
  sellerPAN: string
  buyerName: string
  buyerAddress: string
  buyerGSTIN: string
  invoiceNumber: string
  invoiceDate: string
  itemDescription: string
  hsnCode: string
  quantity: string
  rate: string
  cgst: string
  sgst: string
  igst?: string // Added IGST support
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  const doc = new jsPDF()

  const quantity = Number.parseFloat(data.quantity) || 0
  const rate = Number.parseFloat(data.rate) || 0
  const cgstRate = Number.parseFloat(data.cgst) || 0
  const sgstRate = Number.parseFloat(data.sgst) || 0
  const igstRate = Number.parseFloat(data.igst || "0") || 0

  const sellerState = data.sellerGSTIN.substring(0, 2)
  const buyerState = data.buyerGSTIN ? data.buyerGSTIN.substring(0, 2) : sellerState
  const isInterState = buyerState !== sellerState && data.buyerGSTIN

  // Validate GSTINs
  const gstinRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  const isSellerGSTINValid = gstinRegex.test(data.sellerGSTIN)
  const isBuyerGSTINValid = !data.buyerGSTIN || gstinRegex.test(data.buyerGSTIN)

  const subtotal = quantity * rate

  let cgstAmount = 0
  let sgstAmount = 0
  let igstAmount = 0

  if (isInterState) {
    igstAmount = (subtotal * igstRate) / 100
  } else {
    cgstAmount = (subtotal * cgstRate) / 100
    sgstAmount = (subtotal * sgstRate) / 100
  }

  const total = subtotal + cgstAmount + sgstAmount + igstAmount

  // Header
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  doc.text("TAX INVOICE", 105, 20, { align: "center" })

  // Invoice Details Box
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Invoice No: ${data.invoiceNumber}`, 150, 30)
  doc.text(`Date: ${data.invoiceDate}`, 150, 35)

  // Seller Details
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("Seller Details:", 20, 50)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(data.sellerName, 20, 56)
  if (data.sellerAddress) {
    const addressLines = doc.splitTextToSize(data.sellerAddress, 80)
    doc.text(addressLines, 20, 61)
  }
  if (isSellerGSTINValid) {
    doc.text(`GSTIN: ${data.sellerGSTIN}`, 20, 71)
  } else {
    doc.text(`GSTIN: — Invalid —`, 20, 71)
  }
  if (data.sellerPAN) {
    doc.text(`PAN: ${data.sellerPAN}`, 20, 76)
  }

  // Buyer Details
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("Buyer Details:", 120, 50)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(data.buyerName, 120, 56)
  if (data.buyerAddress) {
    const addressLines = doc.splitTextToSize(data.buyerAddress, 70)
    doc.text(addressLines, 120, 61)
  }
  // Only show buyer GSTIN if it's valid
  if (data.buyerGSTIN && isBuyerGSTINValid) {
    doc.text(`GSTIN: ${data.buyerGSTIN}`, 120, 71)
  }

  // Place of Supply (as per GST Rule 46)
  const placeOfSupply = getStateFromGSTIN(data.buyerGSTIN || data.sellerGSTIN) || 
                       (isInterState ? "Other Territory" : getStateFromGSTIN(data.sellerGSTIN) || "Unknown")
  doc.text(`Place of Supply: ${placeOfSupply}`, 120, 76)

  // Items Table
  const tableStartY = 95
  ;(doc as any).autoTable({
    startY: tableStartY,
    head: [["Description", "HSN/SAC", "Qty", "Rate", "Amount"]],
    body: [
      [
        data.itemDescription,
        data.hsnCode || "-",
        quantity.toString(),
        `₹${rate.toFixed(2)}`,
        `₹${subtotal.toFixed(2)}`,
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 30 },
      2: { cellWidth: 20 },
      3: { cellWidth: 30 },
      4: { cellWidth: 35, halign: "right" },
    },
  })

  const finalY = (doc as any).lastAutoTable.finalY + 10

  // Tax Summary
  doc.text("Subtotal:", 140, finalY)
  doc.text(`₹${subtotal.toFixed(2)}`, 185, finalY, { align: "right" })

  if (isInterState) {
    doc.text(`IGST (${igstRate}%):`, 140, finalY + 6)
    doc.text(`₹${igstAmount.toFixed(2)}`, 185, finalY + 6, { align: "right" })
  } else {
    doc.text(`CGST (${cgstRate}%):`, 140, finalY + 6)
    doc.text(`₹${cgstAmount.toFixed(2)}`, 185, finalY + 6, { align: "right" })

    doc.text(`SGST (${sgstRate}%):`, 140, finalY + 12)
    doc.text(`₹${sgstAmount.toFixed(2)}`, 185, finalY + 12, { align: "right" })
  }

  // Draw line before total
  const lineY = isInterState ? finalY + 10 : finalY + 16
  doc.setLineWidth(0.5)
  doc.line(140, lineY, 190, lineY)

  // Total
  const totalY = isInterState ? finalY + 16 : finalY + 22
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Total:", 140, totalY)
  doc.text(`₹${total.toFixed(2)}`, 185, totalY, { align: "right" })

  // Amount in words
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(`Amount in words: ${numberToWords(total)} Rupees Only`, 20, totalY + 35)

  // Footer
  doc.setFontSize(9)
  doc.setTextColor(100)
  doc.text("This is a computer-generated invoice", 105, 280, { align: "center" })

  // Convert to buffer
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"))
  return pdfBuffer
}

// Helper function to convert number to words (simplified for Indian numbering)
function numberToWords(num: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ]

  if (num === 0) return "Zero"

  const crores = Math.floor(num / 10000000)
  const lakhs = Math.floor((num % 10000000) / 100000)
  const thousands = Math.floor((num % 100000) / 1000)
  const hundreds = Math.floor((num % 1000) / 100)
  const remainder = Math.floor(num % 100)

  let words = ""

  if (crores > 0) words += convertTwoDigit(crores) + " Crore "
  if (lakhs > 0) words += convertTwoDigit(lakhs) + " Lakh "
  if (thousands > 0) words += convertTwoDigit(thousands) + " Thousand "
  if (hundreds > 0) words += ones[hundreds] + " Hundred "
  if (remainder > 0) words += convertTwoDigit(remainder)

  return words.trim()

  function convertTwoDigit(n: number): string {
    if (n < 10) return ones[n]
    if (n >= 10 && n < 20) return teens[n - 10]
    return tens[Math.floor(n / 10)] + (n % 10 > 0 ? " " + ones[n % 10] : "")
  }
}