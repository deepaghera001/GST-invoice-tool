/**
 * PDF Download Utilities
 * Centralized PDF generation and download with proper error handling
 */

/**
 * Sanitizes filename for safe download
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "-") // Replace special chars with dash
    .replace(/-+/g, "-") // Replace multiple dashes with single dash
    .replace(/^-|-$/, "") // Remove leading/trailing dashes
    .toLowerCase()
    .substring(0, 255) // Limit filename length
}

/**
 * Validates if blob is a valid PDF
 */
export function isPDFBlob(blob: Blob): boolean {
  // Check MIME type
  if (blob.type !== "application/pdf") {
    return false
  }
  // Check minimum size (PDF header is at least 5 bytes: %PDF)
  if (blob.size < 100) {
    return false
  }
  return true
}

/**
 * Download blob as file with error handling
 */
export function downloadFile(blob: Blob, filename: string): void {
  if (!blob || blob.size === 0) {
    throw new Error("Download blob is empty")
  }

  if (!isPDFBlob(blob)) {
    throw new Error("Invalid PDF file received")
  }

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  
  try {
    link.href = url
    link.download = sanitizeFilename(filename)
    link.style.display = "none"
    
    document.body.appendChild(link)
    link.click()
    
    // Small delay to ensure click is processed
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)
  } catch (error) {
    // Cleanup on error
    window.URL.revokeObjectURL(url)
    if (link.parentElement === document.body) {
      document.body.removeChild(link)
    }
    throw error
  }
}

/**
 * Generate PDF with proper error handling and validation
 */
export async function generateAndDownloadPDF(
  htmlContent: string,
  filename: string,
  options?: {
    timeout?: number
  }
): Promise<void> {
  const { timeout = 30000 } = options || {}

  if (!htmlContent || htmlContent.trim().length === 0) {
    throw new Error("HTML content cannot be empty")
  }

  if (!filename || filename.trim().length === 0) {
    throw new Error("Filename cannot be empty")
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const pdfResponse = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        htmlContent,
        filename: sanitizeFilename(filename),
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text()
      const errorMessage = 
        pdfResponse.status === 400 ? "Invalid request data" :
        pdfResponse.status === 500 ? "Server error during PDF generation" :
        errorText || "Unknown error"
      throw new Error(`API Error: ${pdfResponse.status} - ${errorMessage}`)
    }

    const blob = await pdfResponse.blob()
    downloadFile(blob, filename)
  } catch (error) {
    if (error instanceof TypeError && error.name === "AbortError") {
      throw new Error("PDF generation timed out. Please try again.")
    }
    throw error
  }
}
