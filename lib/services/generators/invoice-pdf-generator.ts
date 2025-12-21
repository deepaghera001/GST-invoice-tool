import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { BasePDFGenerator } from "./base-pdf-generator"
import type { InvoiceData, GeneratorOptions } from "@/lib/core/types"
import { calculateInvoiceTotals } from "@/lib/utils/invoice-calculator"
import { getStateFromGSTIN } from "@/lib/suggestions/data/gstin-states"

export class InvoicePDFGenerator extends BasePDFGenerator<InvoiceData> {
  name = "invoice-pdf-generator"

  supports(documentType: string): boolean {
    return documentType === "invoice" || documentType === "gst-invoice"
  }

  async generate(data: InvoiceData, options?: GeneratorOptions): Promise<Buffer> {
    const opts = { ...this.getDefaultOptions(), ...options }

    const doc = new jsPDF({
      format: opts.format,
      orientation: opts.orientation,
    }) as any

    doc.setFont("helvetica")
    const totals = calculateInvoiceTotals(data)

    this.renderHeader(doc, data)
    const partyEndY = this.renderPartyDetails(doc, data)
    const tableEndY = this.renderItemsTable(doc, data, totals, partyEndY)
    const taxEndY = this.renderTaxSummary(doc, data, totals, tableEndY)
    this.renderAmountInWords(doc, totals.total, taxEndY)
    this.renderFooter(doc)

    return Buffer.from(doc.output("arraybuffer"))
  }

  /* ---------------- HEADER ---------------- */

  private renderHeader(doc: any, data: InvoiceData): void {
    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.text("TAX INVOICE", 105, 20, { align: "center" })

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Invoice No: ${data.invoiceNumber}`, 150, 30)

    const date = new Date(data.invoiceDate)
    const formatted = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    doc.text(`Date: ${formatted}`, 150, 35)
  }

  /* ---------------- PARTY DETAILS ---------------- */

  private renderPartyDetails(doc: any, data: InvoiceData): number {
    let y = 45
    const gstinRegex =
      /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/

    doc.setDrawColor(200)
    doc.line(20, y, 190, y)
    y += 6

    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text("From", 20, y)
    y += 6

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(data.sellerName, 20, y)
    y += 5

    if (data.sellerAddress) {
      const addr = doc.splitTextToSize(data.sellerAddress, 80)
      doc.text(addr, 20, y)
      y += addr.length * 5
    }

    if (data.sellerGSTIN && gstinRegex.test(data.sellerGSTIN)) {
      doc.text(`GSTIN: ${data.sellerGSTIN}`, 20, y)
      y += 5
    }

    let buyerY = 56
    doc.setFont("helvetica", "bold")
    doc.text("Bill To", 120, buyerY)
    buyerY += 6

    doc.setFont("helvetica", "normal")
    doc.text(data.buyerName, 120, buyerY)
    buyerY += 5

    if (data.buyerAddress) {
      const addr = doc.splitTextToSize(data.buyerAddress, 70)
      doc.text(addr, 120, buyerY)
      buyerY += addr.length * 5
    }

    if (data.buyerGSTIN && gstinRegex.test(data.buyerGSTIN)) {
      doc.text(`GSTIN: ${data.buyerGSTIN}`, 120, buyerY)
      buyerY += 5
    }

    const place =
      getStateFromGSTIN(data.buyerGSTIN || data.sellerGSTIN) || "Unknown"
    doc.text(`Place of Supply: ${place}`, 120, buyerY)

    const maxY = Math.max(y, buyerY + 5)
    doc.line(20, maxY, 190, maxY)

    return maxY + 6
  }

  /* ---------------- ITEMS TABLE ---------------- */

  private renderItemsTable(
    doc: any,
    data: InvoiceData,
    totals: any,
    startY: number
  ): number {
    const qty = Number(data.quantity) || 0
    const rate = Number(data.rate) || 0

    const money = (n: number) =>
      `Rs. ${n.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`

    autoTable(doc, {
      startY,
      theme: "grid",
      head: [["Description", "HSN/SAC", "Qty", "Rate", "Amount"]],
      body: [[
        data.itemDescription,
        data.hsnCode || "-",
        qty.toString(),
        money(rate),
        money(totals.subtotal),
      ]],
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 25 },
        2: { cellWidth: 15, halign: "right" },
        3: { cellWidth: 25, halign: "right" },
        4: { cellWidth: 30, halign: "right" },
      },
    })

    return doc.lastAutoTable.finalY + 6
  }

  /* ---------------- TAX SUMMARY ---------------- */

  private renderTaxSummary(
    doc: any,
    data: InvoiceData,
    totals: any,
    startY: number
  ): number {
    let y = startY

    const money = (n: number) =>
      `Rs. ${n.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`

    doc.setFontSize(10)
    doc.text("Subtotal:", 140, y)
    doc.text(money(totals.subtotal), 185, y, { align: "right" })
    y += 6

    if (totals.isInterState) {
      doc.text(`IGST (${data.igst}%):`, 140, y)
      doc.text(money(totals.igstAmount), 185, y, { align: "right" })
      y += 6
    } else {
      doc.text(`CGST (${data.cgst}%):`, 140, y)
      doc.text(money(totals.cgstAmount), 185, y, { align: "right" })
      y += 6

      doc.text(`SGST (${data.sgst}%):`, 140, y)
      doc.text(money(totals.sgstAmount), 185, y, { align: "right" })
      y += 6
    }

    doc.line(140, y, 185, y)
    y += 4

    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("Total:", 140, y)
    doc.text(money(totals.total), 185, y, { align: "right" })

    return y + 10
  }

  /* ---------------- AMOUNT IN WORDS ---------------- */

  private renderAmountInWords(doc: any, total: number, y: number): void {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text(
      `Amount in words: ${this.numberToWords(total)} Rupees Only`,
      20,
      y
    )
  }

  /* ---------------- FOOTER ---------------- */

  private renderFooter(doc: any): void {
    const h = doc.internal.pageSize.height
    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text("This is a computer-generated invoice", 105, h - 10, {
      align: "center",
    })
  }

  /* ---------------- NUMBER TO WORDS ---------------- */

  private numberToWords(num: number): string {
    if (num === 0) return "Zero"

    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"]
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

    const two = (n: number) =>
      n < 10 ? ones[n] : n < 20 ? teens[n - 10] : tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "")

    let n = Math.floor(num)
    let words = ""

    const crore = Math.floor(n / 10000000)
    n %= 10000000
    const lakh = Math.floor(n / 100000)
    n %= 100000
    const thousand = Math.floor(n / 1000)
    n %= 1000
    const hundred = Math.floor(n / 100)
    const rest = n % 100

    if (crore) words += two(crore) + " Crore "
    if (lakh) words += two(lakh) + " Lakh "
    if (thousand) words += two(thousand) + " Thousand "
    if (hundred) words += ones[hundred] + " Hundred "
    if (rest) words += two(rest)

    return words.trim()
  }
}
