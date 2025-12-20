import { type NextRequest, NextResponse } from "next/server"
import { documentService } from "@/lib/services/document-service"

export async function POST(request: NextRequest) {
  try {
    const { paymentId, orderId, signature, invoiceData, documentType = "invoice" } = await request.json()

    const pdfBuffer = await documentService.verifyAndGenerateDocument(
      { paymentId, orderId, signature },
      invoiceData,
      documentType,
      "razorpay",
    )

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${invoiceData.invoiceNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error("[v0] PDF generation error:", error)
    const message = error instanceof Error ? error.message : "Failed to generate PDF"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
