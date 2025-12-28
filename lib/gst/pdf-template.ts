// GST Penalty Summary PDF Template
// Professional, clean design - suitable for audit & record keeping

export interface GSTPenaltyPDFData {
  returnType: string;
  taxAmount: number;
  dueDate: string;
  filingDate: string;
  daysLate: number;
  lateFee: number;
  interest: number;
  totalPenalty: number;
  taxPaidLate: boolean;
  generatedAt: string;
}

export function generateGSTPenaltyHTML(data: GSTPenaltyPDFData): string {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

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
    
    .penalty-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    
    .penalty-table th,
    .penalty-table td {
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .penalty-table th {
      background: #f8fafc;
      font-size: 10px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .penalty-table td {
      font-size: 11px;
    }
    
    .penalty-table td:last-child {
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
    
    .penalty-amount {
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
        <h1>GST Penalty Summary</h1>
        <p>Generated on ${formatDate(data.generatedAt)}</p>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Return Details</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Return Type</div>
          <div class="info-value">${data.returnType === 'GSTR1' ? 'GSTR-1 (Monthly)' : 'GSTR-3B (Quarterly)'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Tax Amount</div>
          <div class="info-value">${formatCurrency(data.taxAmount)}</div>
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
      <div class="section-title">Penalty Calculation</div>
      <table class="penalty-table">
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
            <td>Late Filing Fee (₹100/day after 30 days, max ₹5,000)</td>
            <td class="${data.lateFee > 0 ? 'penalty-amount' : ''}">${formatCurrency(data.lateFee)}</td>
          </tr>
          <tr>
            <td>Interest @ 18% p.a. ${data.taxPaidLate ? '(Tax paid late)' : '(Not applicable)'}</td>
            <td class="${data.interest > 0 ? 'penalty-amount' : ''}">${formatCurrency(data.interest)}</td>
          </tr>
          <tr class="total-row">
            <td>Total Penalty Payable</td>
            <td>${formatCurrency(data.totalPenalty)}</td>
          </tr>
        </tbody>
      </table>
      
      ${data.daysLate === 0 
        ? `<div class="status-box status-safe">
            <strong>✓ No Penalty:</strong> Your return was filed on time or within the grace period.
          </div>`
        : `<div class="status-box status-warning">
            <strong>Penalty Applies:</strong> Your return was filed ${data.daysLate} days after the due date.
          </div>`
      }
    </div>
    
    <div class="reference-box">
      <div class="reference-title">Legal Reference</div>
      <div class="reference-text">
        <strong>Late Fee:</strong> As per GST Act Section 47, a late fee of ₹100 per day (₹50 CGST + ₹50 SGST) applies for returns filed after 30 days of the due date, subject to a maximum of ₹5,000.<br><br>
        <strong>Interest:</strong> As per GST Act Section 48, interest at 18% per annum is charged on the tax amount if both the return and tax payment are delayed.
      </div>
    </div>
    
    <div class="disclaimer">
      <div class="disclaimer-title">Important Disclaimer</div>
      <div class="disclaimer-text">
        This document is generated for estimation and reference purposes only. The actual penalty may vary based on specific circumstances, amendments to GST rules, or orders from GST authorities. This summary does not constitute legal or financial advice. Please consult a qualified Chartered Accountant or tax professional for official guidance. ComplianceKit is not liable for any decisions made based on this document.
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-left">
        Document ID: GST-${Date.now().toString(36).toUpperCase()}<br>
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
