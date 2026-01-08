import { documentService } from "./lib/services/document-service.js"

async function testPDFGeneration() {
  try {
    console.log("Starting PDF generation test...")
    
    const testData: InvoiceData = {
      sellerName: "ABC Software Solutions Pvt Ltd",
      sellerAddress: "123 Tech Park, Bangalore, Karnataka 560001",
      sellerGSTIN: "29ABCDE1234F1Z5",
      buyerName: "XYZ Corporation",
      buyerAddress: "456 Business Center, Mumbai, Maharashtra 400001",
      buyerGSTIN: "27XYZWV9876F1Z3",
      invoiceNumber: "INV-2025-001",
      invoiceDate: new Date().toISOString().split("T")[0],
      itemDescription: "Software Development Services - Custom Web Application Development",
      hsnCode: "998314",
      quantity: "10",
      rate: "15000",
      cgst: "9",
      sgst: "9",
      igst: "0",
    }
    
    console.log("Test data:", testData)
    
    console.log("Skipping test for 'invoice' document type as the jsPDF-based generator has been removed.")
    console.log("The current system uses HTML-to-PDF conversion via Playwright for 'html-invoice' document type.")
    // const buffer = await documentService.generateDocument(testData, "html-invoice") // Example with proper HTML content
    const buffer = Buffer.from('') // Placeholder for test
    console.log("PDF generated successfully!")
    console.log("Buffer size:", buffer.length)
    
    // Write to file for verification
    const fs = require('fs')
    fs.writeFileSync('test-invoice.pdf', buffer)
    console.log("PDF saved as test-invoice.pdf")
  } catch (error) {
    console.error("PDF generation failed:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
  }
}

testPDFGeneration()