import { type NextRequest, NextResponse } from "next/server"
import { chromium } from "@playwright/test"

// Get browser launch configuration
function getBrowserLaunchConfig() {
  return {
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
  };
}

// Get PDF generation options
function getPDFGenerationOptions() {
  return {
    format: "A4" as const,
    printBackground: true,
    margin: {
      top: "0",
      right: "0",
      bottom: "0",
      left: "0",
    },
    displayHeaderFooter: false,
    preferCSSPageSize: true,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { htmlContent, filename = "document.pdf" } = await request.json();
    
    if (!htmlContent) {
      return NextResponse.json({ error: "htmlContent is required" }, { status: 400 });
    }

    console.log("[API] Generating PDF, filename:", filename);

    // Launch browser and generate PDF
    const browser = await chromium.launch(getBrowserLaunchConfig())

    let pdfBuffer: Buffer;
    try {
      const page = await browser.newPage()
      await page.setContent(htmlContent, { waitUntil: "networkidle" })
      pdfBuffer = await page.pdf(getPDFGenerationOptions())
    } finally {
      await browser.close()
    }
    
    console.log("[API] PDF generated successfully, size:", pdfBuffer.length);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("[API] PDF generation error:", error)
    const message = error instanceof Error ? error.message : "Failed to generate PDF"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}