/**
 * Base64 Encoded Fonts for PDF Generation
 * 
 * Fonts are embedded directly in HTML to ensure consistent rendering
 * in Playwright PDF generation across all environments.
 * 
 * This eliminates network dependencies and URL resolution issues.
 */

import fs from 'fs';
import path from 'path';

// Cache for base64 encoded fonts
let fontCache: Record<string, string> | null = null;

/**
 * Get base64 encoded fonts for embedding in HTML
 * Reads font files and converts to base64 data URIs
 */
export function getBase64Fonts(): Record<string, string> {
  if (fontCache) {
    return fontCache;
  }

  const fontsDir = path.join(process.cwd(), 'public', 'fonts');
  
  const fonts: Record<string, string> = {};
  
  try {
    // Inter Regular
    const interRegular = fs.readFileSync(path.join(fontsDir, 'Inter-Regular.woff2'));
    fonts.interRegular = `data:font/woff2;base64,${interRegular.toString('base64')}`;
    
    // Inter SemiBold
    const interSemiBold = fs.readFileSync(path.join(fontsDir, 'Inter-SemiBold.woff2'));
    fonts.interSemiBold = `data:font/woff2;base64,${interSemiBold.toString('base64')}`;
    
    // Inter Bold
    const interBold = fs.readFileSync(path.join(fontsDir, 'Inter-Bold.woff2'));
    fonts.interBold = `data:font/woff2;base64,${interBold.toString('base64')}`;
    
    // Noto Sans Regular (TTF format)
    const notoSans = fs.readFileSync(path.join(fontsDir, 'NotoSans-Regular.ttf'));
    fonts.notoSans = `data:font/ttf;base64,${notoSans.toString('base64')}`;
  } catch (error) {
    console.error('[PDF] Error loading fonts:', error);
    // Return empty - will fallback to system fonts
  }
  
  fontCache = fonts;
  return fonts;
}

/**
 * Generate @font-face CSS with base64 embedded fonts
 */
export function getEmbeddedFontCSS(): string {
  const fonts = getBase64Fonts();
  
  if (!fonts.interRegular) {
    // Fonts not available - return empty
    console.warn('[PDF] Embedded fonts not available, using system fonts');
    return '';
  }
  
  return `
    /* Embedded Inter Font Family */
    @font-face {
      font-family: "Inter";
      src: url("${fonts.interRegular}") format("woff2");
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: "Inter";
      src: url("${fonts.interSemiBold}") format("woff2");
      font-weight: 600;
      font-style: normal;
    }
    @font-face {
      font-family: "Inter";
      src: url("${fonts.interBold}") format("woff2");
      font-weight: 700;
      font-style: normal;
    }
    
    /* Embedded Noto Sans for currency symbols */
    @font-face {
      font-family: "Noto Sans";
      src: url("${fonts.notoSans}") format("truetype");
      font-weight: 400;
      font-style: normal;
    }
    
    /* CSS Variable for document font */
    :root {
      --font-document: "Inter", "Noto Sans", -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    /* Apply to all PDF content */
    body, .pdf-document-content {
      font-family: var(--font-document) !important;
    }
  `;
}
