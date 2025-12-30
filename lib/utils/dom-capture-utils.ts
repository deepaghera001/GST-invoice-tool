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
      top: "0",
      right: "0",
      bottom: "0",
      left: "0",
    },
    displayHeaderFooter: false,
    preferCSSPageSize: true,
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
        @page {
          size: A4;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
          background-color: white;
        }
        /* General PDF Reset: Ensures the captured content fills the page and removes UI-only styling */
        body > * {
          border: none !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          position: static !important;
        }
        .sticky {
          position: static !important;
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

/**
 * Capture the HTML content of the rent agreement preview
 */
export function captureRentAgreementPreviewHTML(): string {
  const previewElement = document.querySelector('[data-testid="rent-agreement-preview"]');
  
  if (!previewElement) {
    throw new Error('Rent agreement preview element not found');
  }
  
  // Clone the element to avoid modifying the original
  const clonedElement = previewElement.cloneNode(true) as HTMLElement;
  
  // Get the outer HTML
  const htmlContent = clonedElement.outerHTML;
  
  // Capture styles
  const styles = captureStyles();
  
  // Wrap in a complete HTML document with styles
  return wrapHTMLWithStyles(htmlContent, 'Rent Agreement', styles);
}