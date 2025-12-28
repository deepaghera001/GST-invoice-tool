import { type NextRequest, NextResponse } from "next/server"
import { chromium } from "@playwright/test"
import { generateGSTPenaltyHTML, type GSTPenaltyPDFData } from "@/lib/gst/pdf-template"

export async function POST(request: NextRequest) {
  try {
    const data: GSTPenaltyPDFData = await request.json()

    // Validate required fields
    if (!data.returnType || !data.dueDate || !data.filingDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Add generation timestamp
    data.generatedAt = new Date().toISOString()

    // Generate HTML
    const htmlContent = generateGSTPenaltyHTML(data)

    // Generate PDF
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

    let pdfBuffer: Buffer
    try {
      const page = await browser.newPage()
      await page.setContent(htmlContent, { waitUntil: "networkidle" })
      pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
      })
    } finally {
      await browser.close()
    }

    const filename = `GST-Penalty-Summary-${data.returnType}-${Date.now()}.pdf`

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("[API] GST PDF generation error:", error)
    const message = error instanceof Error ? error.message : "Failed to generate PDF"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
