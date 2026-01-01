// TDS Late Filing Fee Summary PDF Template
// Professional, clean design - suitable for audit & record keeping

export interface TDSFeePDFData {
  tdsSection: string;
  tdsAmount: number;
  dueDate: string;
  filingDate: string;
  daysLate: number;
  lateFee: number;
  generatedAt: string;
}

const TDS_SECTION_NAMES: Record<string, string> = {
  '194J': 'Section 194J - Commission/Brokerage',
  '194O': 'Section 194O - E-commerce Seller',
  '195': 'Section 195 - Non-resident Income',
  'other': 'Other TDS Sections',
};

export function generateTDSFeeHTML(data: TDSFeePDFData): string {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const sectionName = TDS_SECTION_NAMES[data.tdsSection] || data.tdsSection;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 11px;
      line-height: 1.5;
      color: #1e293b;
      background: #fff;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      margin: 0 auto;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #1e293b;
      padding-bottom: 15px;
      margin-bottom: 25px;
    }
    
    .logo-section {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .logo {
      width: 36px;
      height: 36px;
      background: #1e293b;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 14px;
    }
    
    .brand-name {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
    }
    
    .brand-tagline {
      font-size: 10px;
      color: #64748b;
    }
    
    .document-title {
      text-align: right;
    }
    
    .document-title h1 {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
    }
    
    .document-title p {
      font-size: 10px;
      color: #64748b;
    }
    
    .section {
      margin-bottom: 20px;
    }
    
    .section-title {
      font-size: 12px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    
    .info-item {
      background: #f8fafc;
      padding: 10px 12px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }
    
    .info-item.full-width {
      grid-column: span 2;
    }
    
    .info-label {
      font-size: 9px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 3px;
    }
    
    .info-value {
      font-size: 12px;
      font-weight: 500;
      color: #1e293b;
    }
    
    .fee-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    
    .fee-table th,
    .fee-table td {
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .fee-table th {
      background: #f8fafc;
      font-size: 10px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .fee-table td {
      font-size: 11px;
    }
    
    .fee-table td:last-child {
      text-align: right;
      font-weight: 500;
    }
    
    .total-row {
      background: #1e293b !important;
    }
    
    .total-row td {
      color: white !important;
      font-weight: 600 !important;
      font-size: 12px !important;
      border-bottom: none !important;
    }
    
    .fee-amount {
      color: #dc2626;
      font-weight: 600;
    }
    
    .status-box {
      padding: 12px 15px;
      border-radius: 6px;
      margin-top: 15px;
    }
    
    .status-safe {
      background: #f0fdf4;
      border: 1px solid #86efac;
      color: #166534;
    }
    
    .status-warning {
      background: #fffbeb;
      border: 1px solid #fcd34d;
      color: #92400e;
    }
    
    .disclaimer {
      margin-top: 30px;
      padding: 15px;
      background: #f8fafc;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }
    
    .disclaimer-title {
      font-size: 10px;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 8px;
    }
    
    .disclaimer-text {
      font-size: 9px;
      color: #64748b;
      line-height: 1.6;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 15px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .footer-left {
      font-size: 9px;
      color: #64748b;
    }
    
    .footer-right {
      font-size: 9px;
      color: #64748b;
      text-align: right;
    }
    
    .reference-box {
      margin-top: 20px;
      padding: 12px 15px;
      background: #f1f5f9;
      border-radius: 6px;
      border-left: 3px solid #1e293b;
    }
    
    .reference-title {
      font-size: 10px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 5px;
    }
    
    .reference-text {
      font-size: 9px;
      color: #64748b;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo-section">
        <div class="logo">CK</div>
        <div>
          <div class="brand-name">ComplianceKit</div>
          <div class="brand-tagline">GST & TDS Compliance Tools</div>
        </div>
      </div>
      <div class="document-title">
        <h1>TDS Late Filing Fee Summary — Income-tax Act, 1961 (Sections 234E & 201(1A))</h1>
        <p>Generated on ${formatDate(data.generatedAt)}</p>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">TDS Return Details</div>
      <div class="info-grid">
        <div class="info-item full-width">
          <div class="info-label">TDS Section</div>
          <div class="info-value">${sectionName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">TDS Amount</div>
          <div class="info-value">${formatCurrency(data.tdsAmount)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Days Late</div>
          <div class="info-value">${data.daysLate} days</div>
        </div>
        <div class="info-item">
          <div class="info-label">Due Date</div>
          <div class="info-value">${formatDate(data.dueDate)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Filing Date</div>
          <div class="info-value">${formatDate(data.filingDate)}</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Fee Calculation</div>
      <table class="fee-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Days Late</td>
            <td>${data.daysLate} days</td>
          </tr>
          <tr>
            <td>Late Filing Fee @ ₹200/day (max = TDS amount deducted)</td>
            <td class="${data.lateFee > 0 ? 'fee-amount' : ''}">${formatCurrency(data.lateFee)}</td>
          </tr>
          <tr class="total-row">
            <td>Total Fee Payable</td>
            <td>${formatCurrency(data.lateFee)}</td>
          </tr>
        </tbody>
      </table>
      
      ${data.daysLate === 0 
        ? `<div class="status-box status-safe">
            <strong>✓ No Fee:</strong> Your TDS return was filed on time.
          </div>`
        : `<div class="status-box status-warning">
            <strong>Late Filing Fee Applies:</strong> Your TDS return was filed ${data.daysLate} days after the due date.
            ${data.lateFee >= 5000 ? ' The fee has been capped at the maximum of ₹5,000.' : ''}
          </div>`
      }
    </div>
    
    <div class="reference-box">
      <div class="reference-title">Legal Reference</div>
      <div class="reference-text">
        <strong>Late Filing Fee (Section 234E):</strong> As per Section 234E of the Income-tax Act, a late filing fee of ₹200 per day is charged for delayed filing of TDS returns. The fee is calculated from the due date until the actual date of filing. <strong>Maximum cap:</strong> Cannot exceed the total TDS amount deducted. This fee is applicable from Day 1 of the delay (no grace period). <strong>Interest (Section 201(1A)):</strong> 1.5% per month or part thereof for late payment.
      </div>
    </div>
    
    <div class="disclaimer">
      <div class="disclaimer-title">Important Disclaimer</div>
      <div class="disclaimer-text">
        This document is generated for estimation and reference purposes only. The actual fee may vary based on specific circumstances, amendments to Income Tax rules, or orders from tax authorities. This summary does not constitute legal or financial advice. Please consult a qualified Chartered Accountant or tax professional for official guidance. Penalty under Section 271H (₹10,000–₹1,00,000) is not included in this estimate. ComplianceKit is not liable for any decisions made based on this document.
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-left">
        Document ID: TDS-${Date.now().toString(36).toUpperCase()}<br>
        Generated via ComplianceKit
      </div>
      <div class="footer-right">
        This is a computer-generated document.<br>
        No signature required.
      </div>
    </div>
  </div>
</body>
</html>
`;
}
