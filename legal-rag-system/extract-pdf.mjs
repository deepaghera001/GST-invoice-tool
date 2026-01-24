import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_PATH = path.join(__dirname, 'documents/raw/income_tax/FINANCE_ACT_2024/FINANCE_ACT_2024__orig.pdf');
const OUTPUT_PATH = path.join(__dirname, 'parsed/income_tax/FINANCE_ACT_2024/pages.json');
const METADATA_PATH = path.join(__dirname, 'documents/raw/income_tax/FINANCE_ACT_2024/metadata.json');

async function extractPDFPages() {
  console.log('📄 Reading PDF:', PDF_PATH);
  
  // Read metadata for hash
  const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf-8'));
  
  // Read PDF file
  const pdfBuffer = fs.readFileSync(PDF_PATH);
  
  console.log('⚙️  Parsing PDF with PDF.js...');
  
  // Load PDF document
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(pdfBuffer),
    useSystemFonts: true,
  });
  
  const pdfDocument = await loadingTask.promise;
  const numPages = pdfDocument.numPages;
  
  console.log(`📊 Total pages: ${numPages}`);
  
  const pages = [];
  
  // Extract text from each page
  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Combine text items into readable text
    let pageText = '';
    let lastY = null;
    
    for (const item of textContent.items) {
      // Add newline if Y position changed significantly (new line)
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
        pageText += '\n';
      }
      
      pageText += item.str;
      
      // Add space if next item is on same line
      if (item.str && !item.str.endsWith(' ')) {
        pageText += ' ';
      }
      
      lastY = item.transform[5];
    }
    
    pageText = pageText.trim();
    
    pages.push({
      page_number: pageNum,
      text: pageText
    });
    
    console.log(`✅ Page ${pageNum} extracted (${pageText.length} chars)`);
  }
  
  // Create output structure
  const output = {
    document_id: "FINANCE_ACT_2024",
    pdf_hash: metadata.sha256,
    page_count: numPages,
    extracted_at: new Date().toISOString(),
    pages: pages
  };
  
  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write output
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  
  console.log('\n✅ SUCCESS!');
  console.log(`📁 Output: ${OUTPUT_PATH}`);
  console.log(`📊 Pages extracted: ${pages.length}/${numPages}`);
  
  // Summary
  console.log('\n📋 SUMMARY:');
  console.log(`   Document ID: ${output.document_id}`);
  console.log(`   PDF Hash: ${output.pdf_hash}`);
  console.log(`   Total Pages: ${output.page_count}`);
  console.log(`   Pages Extracted: ${pages.length}`);
  
  if (pages.length === numPages) {
    console.log('\n✅ Pages extracted correctly (26/26)');
  } else {
    console.warn(`\n⚠️  Warning: Expected ${numPages} pages but extracted ${pages.length}`);
  }
  
  return output;
}

// Run
extractPDFPages().catch(console.error);
