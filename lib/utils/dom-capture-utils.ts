/**
 * Utility functions for capturing DOM content for PDF generation
 */

interface BrowserLaunchConfig {
  headless: boolean;
  args: string[];
}

interface PDFMargin {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

interface PDFGenerationOptions {
  format?: string;
  printBackground?: boolean;
  margin?: PDFMargin;
  displayHeaderFooter?: boolean;
  preferCSSPageSize?: boolean;
}

/**
 * Get browser launch configuration for Playwright
 */
export function getBrowserLaunchConfig(): BrowserLaunchConfig {
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

/**
 * Get PDF generation options for consistent rendering
 */
export function getPDFGenerationOptions(): PDFGenerationOptions {
  return {
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
  };
}

/**
 * Capture styles from the document
 */
export function captureStyles(): string {
  return Array.from(document.styleSheets)
    .map(styleSheet => {
      try {
        return Array.from(styleSheet.cssRules || [])
          .map(rule => rule.cssText)
          .join('\n');
      } catch (e) {
        // Skip cross-origin stylesheets
        return '';
      }
    })
    .join('\n');
}

/**
 * Wrap HTML content in a complete document with styles
 */
export function wrapHTMLWithStyles(htmlContent: string, title: string, styles: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        ${styles}
        /* Additional styles to ensure proper rendering */
        body {
          margin: 0;
          padding: 20px;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
        }
        .sticky {
          position: relative;
        }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;
}

/**
 * Capture the HTML content of the invoice preview
 */
export function captureInvoicePreviewHTML(invoiceNumber: string): string {
  const previewElement = document.querySelector('[data-testid="invoice-preview"]');
  
  if (!previewElement) {
    throw new Error('Invoice preview element not found');
  }
  
  // Clone the element to avoid modifying the original
  const clonedElement = previewElement.cloneNode(true) as HTMLElement;
  
  // Get the outer HTML
  const htmlContent = clonedElement.outerHTML;
  
  // Capture styles
  const styles = captureStyles();
  
  // Wrap in a complete HTML document with styles
  return wrapHTMLWithStyles(htmlContent, `Invoice ${invoiceNumber}`, styles);
}

/**
 * Capture the HTML content of the salary slip preview
 */
export function captureSalarySlipPreviewHTML(): string {
  const previewElement = document.querySelector('#salary-slip-preview');
  
  if (!previewElement) {
    throw new Error('Salary slip preview element not found');
  }
  
  // Clone the element to avoid modifying the original
  const clonedElement = previewElement.cloneNode(true) as HTMLElement;
  
  // Get the outer HTML
  const htmlContent = clonedElement.outerHTML;
  
  // Capture styles
  const styles = captureStyles();
  
  // Wrap in a complete HTML document with styles
  return wrapHTMLWithStyles(htmlContent, 'Salary Slip', styles);
}