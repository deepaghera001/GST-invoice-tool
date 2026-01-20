/**
 * Test script to verify fonts are working in PDF generation
 */

const testHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Font Test</title>
</head>
<body class="pdf-document-content">
  <div style="padding: 40px;">
    <h1 style="font-weight: 700;">Bold Text Test (font-weight: 700)</h1>
    <h2 style="font-weight: 600;">SemiBold Text Test (font-weight: 600)</h2>
    <p style="font-weight: 400;">Regular Text Test (font-weight: 400)</p>
    <hr style="margin: 20px 0;">
    <h2>Currency Symbol Test</h2>
    <p style="font-size: 24px;">₹ 1,00,000 (Indian Rupee)</p>
    <p style="font-size: 24px;">€ 1,000 (Euro)</p>
    <p style="font-size: 24px;">£ 500 (British Pound)</p>
    <hr style="margin: 20px 0;">
    <h2>Mixed Content</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr style="background: #f0f0f0;">
        <th style="font-weight: 700; padding: 10px; text-align: left; border: 1px solid #ccc;">Description</th>
        <th style="font-weight: 700; padding: 10px; text-align: right; border: 1px solid #ccc;">Amount</th>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ccc;">Salary</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ccc;">₹ 50,000</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: 600; border: 1px solid #ccc;">Total</td>
        <td style="padding: 10px; text-align: right; font-weight: 700; border: 1px solid #ccc;">₹ 50,000</td>
      </tr>
    </table>
  </div>
</body>
</html>
`;

async function testPDF() {
  console.log('Testing PDF generation with embedded fonts...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        htmlContent: testHTML,
        filename: 'font-test.pdf',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ PDF generation failed:', error);
      process.exit(1);
    }

    const buffer = await response.arrayBuffer();
    const fs = await import('fs');
    fs.writeFileSync('test-results/font-test.pdf', Buffer.from(buffer));
    
    console.log('✅ PDF generated successfully!');
    console.log('📄 File saved to: test-results/font-test.pdf');
    console.log('📊 File size:', buffer.byteLength, 'bytes');
    console.log('\nPlease open the PDF and verify:');
    console.log('  - Bold text appears bold (not regular weight)');
    console.log('  - ₹ symbol renders correctly (not a box or missing)');
    console.log('  - SemiBold text appears slightly bolder than regular');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testPDF();
