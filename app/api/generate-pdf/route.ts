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
  let browser = null;
  
  try {
    const body = await request.json();
    const { htmlContent, filename = "document.pdf" } = body;
    
    // Validate inputs
    if (!htmlContent || typeof htmlContent !== "string") {
      return NextResponse.json(
        { error: "htmlContent is required and must be a string" },
        { status: 400 }
      );
    }

    if (htmlContent.trim().length === 0) {
      return NextResponse.json(
        { error: "htmlContent cannot be empty" },
        { status: 400 }
      );
    }

    if (!filename || typeof filename !== "string") {
      return NextResponse.json(
        { error: "filename is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate HTML content is not too large (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (Buffer.byteLength(htmlContent) > maxSize) {
      return NextResponse.json(
        { error: "HTML content exceeds maximum size of 10MB" },
        { status: 413 }
      );
    }

    console.log("[API] Generating PDF, filename:", filename, "content size:", Buffer.byteLength(htmlContent));

    // Launch browser and generate PDF with timeout
    browser = await Promise.race([
      chromium.launch(getBrowserLaunchConfig()),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Browser launch timeout after 30s")), 30000)
      )
    ]) as any;

    let pdfBuffer: Buffer;
    try {
      const page = await browser.newPage();
      
      // Set timeout for page operations
      page.setDefaultTimeout(30000);
      page.setDefaultNavigationTimeout(30000);
      
      await page.setContent(htmlContent, { waitUntil: "networkidle" });
      pdfBuffer = await page.pdf(getPDFGenerationOptions());
      
      await page.close();

      // Validate PDF output
      if (!pdfBuffer || pdfBuffer.length === 0) {
        throw new Error("PDF generation produced empty output");
      }

      console.log("[API] PDF generated successfully, size:", pdfBuffer.length);
    } finally {
      if (browser) {
        await browser.close();
      }
    }

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[API] PDF generation error:", error);
    
    const message = error instanceof Error ? error.message : "Failed to generate PDF";
    const status = message.includes("timeout") ? 504 : 500;
    
    return NextResponse.json({ error: message }, { status });
  } finally {
    // Ensure browser is closed even if error occurs
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error("[API] Error closing browser:", e);
      }
    }
  }
}