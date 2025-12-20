import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { BasePDFGenerator } from "./base-pdf-generator"
import type { InvoiceData, GeneratorOptions } from "@/lib/core/types"
import { calculateInvoiceTotals } from "@/lib/utils/invoice-calculator"
import { numberToWords } from "@/lib/utils/number-to-words"

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
    })

    const totals = calculateInvoiceTotals(data)

    // Header
    this.renderHeader(doc, data)

    // Party Details
    this.renderPartyDetails(doc, data)

    // Items Table
    const finalY = this.renderItemsTable(doc, data, totals)

    // Tax Summary
    this.renderTaxSummary(doc, totals, finalY)

    // Amount in Words
    this.renderAmountInWords(doc, totals.total, finalY)

    // Footer
    this.renderFooter(doc)

    return Buffer.from(doc.output("arraybuffer"))
  }

  private renderHeader(doc: jsPDF, data: InvoiceData): void {
    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.text("TAX INVOICE", 105, 20, { align: "center" })

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Invoice No: ${data.invoiceNumber}`, 150, 30)
    doc.text(`Date: ${data.invoiceDate}`, 150, 35)
  }

  private renderPartyDetails(doc: jsPDF, data: InvoiceData): void {
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
    doc.text(`GSTIN: ${data.sellerGSTIN}`, 20, 71)

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
    if (data.buyerGSTIN) {
      doc.text(`GSTIN: ${data.buyerGSTIN}`, 120, 71)
    }
  }

  private renderItemsTable(doc: jsPDF, data: InvoiceData, totals: any): number {
    const quantity = Number.parseFloat(data.quantity) || 0
    const rate = Number.parseFloat(data.rate) || 0
    ;(doc as any).autoTable({
      startY: 95,
      head: [["Description", "HSN/SAC", "Qty", "Rate", "Amount"]],
      body: [
        [
          data.itemDescription,
          data.hsnCode || "-",
          quantity.toString(),
          `₹${rate.toFixed(2)}`,
          `₹${totals.subtotal.toFixed(2)}`,
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

    return (doc as any).lastAutoTable.finalY + 10
  }

  private renderTaxSummary(doc: jsPDF, totals: any, startY: number): void {
    const cgstRate = Number.parseFloat(totals.cgstRate || "9")
    const sgstRate = Number.parseFloat(totals.sgstRate || "9")

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)

    doc.text("Subtotal:", 140, startY)
    doc.text(`₹${totals.subtotal.toFixed(2)}`, 185, startY, { align: "right" })

    doc.text(`CGST (${cgstRate}%):`, 140, startY + 6)
    doc.text(`₹${totals.cgstAmount.toFixed(2)}`, 185, startY + 6, { align: "right" })

    doc.text(`SGST (${sgstRate}%):`, 140, startY + 12)
    doc.text(`₹${totals.sgstAmount.toFixed(2)}`, 185, startY + 12, { align: "right" })

    doc.setLineWidth(0.5)
    doc.line(140, startY + 16, 190, startY + 16)

    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("Total:", 140, startY + 22)
    doc.text(`₹${totals.total.toFixed(2)}`, 185, startY + 22, { align: "right" })
  }

  private renderAmountInWords(doc: jsPDF, total: number, startY: number): void {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text(`Amount in words: ${numberToWords(total)} Rupees Only`, 20, startY + 35)
  }

  private renderFooter(doc: jsPDF): void {
    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text("This is a computer-generated invoice", 105, 280, { align: "center" })
  }
}
