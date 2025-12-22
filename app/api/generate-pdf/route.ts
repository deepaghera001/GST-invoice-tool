import { type NextRequest, NextResponse } from "next/server"
import { documentService } from "@/lib/services/document-service"
import { chromium } from "@playwright/test"

export async function POST(request: NextRequest) {
  try {
    const { paymentId, orderId, signature, invoiceData, documentType = "invoice", skipPayment = false, htmlContent } = await request.json()
    
    console.log("[API] Received PDF generation request:", { paymentId, orderId, signature, documentType, skipPayment });
    console.log("[API] Invoice data:", invoiceData);

    let pdfBuffer: Buffer

    // Check if we're generating from DOM HTML content
    if (documentType === "html-invoice" && htmlContent) {
      console.log("[API] Generating PDF from DOM HTML content");
      
      // Launch browser and generate PDF from the provided HTML content
      const browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      })

      try {
        const page = await browser.newPage()
        
        // Set content from the DOM HTML
        await page.setContent(htmlContent, {
          waitUntil: "networkidle",
        })
        
        // Generate PDF with settings that match the preview
        pdfBuffer = await page.pdf({
          format: "A4",
          printBackground: true,
          margin: {
            top: "0.4in",
            right: "0.4in",
            bottom: "0.4in",
            left: "0.4in",
          },
          displayHeaderFooter: false,
          preferCSSPageSize: false,
        })
        
        console.log("[API] PDF generated from DOM HTML, size:", pdfBuffer.length);
      } finally {
        await browser.close()
      }
    } else if (skipPayment) {
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