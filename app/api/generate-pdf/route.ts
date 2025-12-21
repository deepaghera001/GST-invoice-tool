import { type NextRequest, NextResponse } from "next/server"
import { documentService } from "@/lib/services/document-service"

export async function POST(request: NextRequest) {
  try {
    const { paymentId, orderId, signature, invoiceData, documentType = "invoice", skipPayment = false } = await request.json()
    
    console.log("[API] Received PDF generation request:", { paymentId, orderId, signature, documentType, skipPayment });
    console.log("[API] Invoice data:", invoiceData);

    let pdfBuffer: Buffer

    if (skipPayment) {
      // In development mode, skip payment verification and generate PDF directly
      console.log("[API] Skipping payment verification, generating document directly");
      pdfBuffer = await documentService.generateDocument(invoiceData, documentType)
    } else {
      // Production mode - verify payment before generating PDF
      console.log("[API] Verifying payment before generating document");
      pdfBuffer = await documentService.verifyAndGenerateDocument(
        { paymentId, orderId, signature },
        invoiceData,
        documentType,
        "razorpay",
      )
    }
    
    console.log("[API] PDF generated successfully, size:", pdfBuffer.length);

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