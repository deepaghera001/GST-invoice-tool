/**
 * Rent Agreement PDF Template
 * Professional, legally formatted rent agreement document
 */

import type { RentAgreementCalculatedData } from "./types"
import { 
  INDIAN_STATES, 
  PROPERTY_TYPES, 
  FURNISHING_OPTIONS, 
  PAYMENT_MODES,
  STANDARD_CLAUSES 
} from "./constants"
import { formatAgreementDate, getDurationText, amountToWords } from "./calculations"

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function getStateName(code: string): string {
  return INDIAN_STATES.find((s) => s.code === code)?.name || code
}

function getPropertyTypeName(value: string): string {
  return PROPERTY_TYPES.find((t) => t.value === value)?.label || value
}

function getFurnishingName(value: string): string {
  return FURNISHING_OPTIONS.find((f) => f.value === value)?.label || value
}

function getPaymentModeName(value: string): string {
  return PAYMENT_MODES.find((p) => p.value === value)?.label || value
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}

export function generateRentAgreementHTML(data: RentAgreementCalculatedData): string {
  const { formData, calculations } = data
  const { landlord, tenant, property, rentTerms, clauses } = formData

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long", 
    year: "numeric"
  })

  // Build clauses list
  const selectedClauses: string[] = []
  
  if (clauses.noSubLetting) {
    selectedClauses.push(`<li><strong>No Sub-letting:</strong> ${STANDARD_CLAUSES.noSubLetting}</li>`)
  }
  if (clauses.propertyInspection) {
    selectedClauses.push(`<li><strong>Property Inspection:</strong> ${STANDARD_CLAUSES.propertyInspection}</li>`)
  }
  if (clauses.repairsResponsibility) {
    selectedClauses.push(`<li><strong>Repairs & Maintenance:</strong> ${STANDARD_CLAUSES.repairsResponsibility}</li>`)
  }
  if (clauses.utilityPayment) {
    selectedClauses.push(`<li><strong>Utility Payment:</strong> ${STANDARD_CLAUSES.utilityPayment}</li>`)
  }
  if (clauses.peacefulUse) {
    selectedClauses.push(`<li><strong>Peaceful Use:</strong> ${STANDARD_CLAUSES.peacefulUse}</li>`)
  }
  if (clauses.noIllegalActivity) {
    selectedClauses.push(`<li><strong>No Illegal Activity:</strong> ${STANDARD_CLAUSES.noIllegalActivity}</li>`)
  }
  if (clauses.lockInPeriod && clauses.lockInMonths) {
    selectedClauses.push(`<li><strong>Lock-in Period:</strong> Both parties agree to a lock-in period of ${clauses.lockInMonths} month(s) during which neither party can terminate the agreement except for breach of terms.</li>`)
  }

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
      font-family: 'Times New Roman', Times, serif;
      font-size: 12px;
      line-height: 1.8;
      color: #1a1a1a;
      background: #fff;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm 25mm;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #1a1a1a;
      padding-bottom: 20px;
    }
    
    .header h1 {
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 3px;
      margin-bottom: 8px;
    }
    
    .header .subtitle {
      font-size: 11px;
      color: #555;
    }
    
    .section {
      margin-bottom: 25px;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 12px;
      padding-bottom: 5px;
      border-bottom: 1px solid #ccc;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .preamble {
      text-align: justify;
      margin-bottom: 25px;
    }
    
    .preamble p {
      margin-bottom: 15px;
    }
    
    .party-label {
      font-weight: bold;
      text-align: center;
      margin: 15px 0;
      font-size: 13px;
    }
    
    .party-details {
      background: #f9f9f9;
      padding: 15px;
      border: 1px solid #ddd;
      margin-bottom: 15px;
    }
    
    .party-details p {
      margin-bottom: 5px;
    }
    
    .property-box {
      background: #f5f5f5;
      padding: 15px;
      border: 1px solid #ddd;
      margin: 15px 0;
    }
    
    .property-box table {
      width: 100%;
    }
    
    .property-box td {
      padding: 5px 10px;
      vertical-align: top;
    }
    
    .property-box .label {
      font-weight: bold;
      width: 150px;
      color: #555;
    }
    
    .terms-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    
    .terms-table th,
    .terms-table td {
      border: 1px solid #ddd;
      padding: 10px 12px;
      text-align: left;
    }
    
    .terms-table th {
      background: #f0f0f0;
      font-weight: bold;
      width: 40%;
    }
    
    .terms-table td {
      background: #fff;
    }
    
    .clauses-list {
      list-style: decimal;
      padding-left: 25px;
    }
    
    .clauses-list li {
      margin-bottom: 15px;
      text-align: justify;
    }
    
    .additional-clauses {
      background: #fffef0;
      border: 1px solid #e6e0a0;
      padding: 15px;
      margin: 15px 0;
    }
    
    .signature-section {
      margin-top: 50px;
      page-break-inside: avoid;
    }
    
    .signature-grid {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
    }
    
    .signature-box {
      width: 45%;
      text-align: center;
    }
    
    .signature-line {
      border-top: 1px solid #1a1a1a;
      margin-top: 60px;
      padding-top: 10px;
    }
    
    .signature-label {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .signature-name {
      font-size: 11px;
      color: #555;
    }
    
    .witness-section {
      margin-top: 40px;
      border-top: 1px solid #ddd;
      padding-top: 20px;
    }
    
    .witness-grid {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    
    .witness-box {
      width: 45%;
    }
    
    .witness-box .signature-line {
      margin-top: 40px;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 15px;
      border-top: 1px solid #ddd;
      font-size: 10px;
      color: #777;
      text-align: center;
    }
    
    .amount-words {
      font-style: italic;
      color: #555;
    }

    @media print {
      .page {
        padding: 15mm 20mm;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>RENT AGREEMENT</h1>
      <div class="subtitle">Under Section 107 of the Transfer of Property Act, 1882</div>
    </div>
    
    <div class="preamble">
      <p>
        This <strong>RENT AGREEMENT</strong> is made and executed on this 
        <strong>${formatAgreementDate(rentTerms.agreementStartDate) || "____________________"}</strong>
        at <strong>${property.city || "____________________"}</strong>, 
        <strong>${getStateName(property.state)}</strong>.
      </p>
      
      <div class="party-label">BETWEEN</div>
      
      <div class="party-details">
        <p><strong>Name:</strong> ${landlord.name || "____________________"}</p>
        <p><strong>Address:</strong> ${landlord.address || "____________________"}</p>
        <p><strong>Phone:</strong> ${landlord.phone || "____________________"}</p>
        ${landlord.email ? `<p><strong>Email:</strong> ${landlord.email}</p>` : ""}
        ${landlord.panNumber ? `<p><strong>PAN:</strong> ${landlord.panNumber}</p>` : ""}
        ${landlord.aadharNumber ? `<p><strong>Aadhar:</strong> ${landlord.aadharNumber}</p>` : ""}
      </div>
      
      <p style="text-align: center;">(Hereinafter referred to as the <strong>"LANDLORD/LESSOR"</strong>, which expression shall, unless repugnant to the context or meaning thereof, include their heirs, executors, administrators, legal representatives, and assigns of the First Part)</p>
      
      <div class="party-label">AND</div>
      
      <div class="party-details">
        <p><strong>Name:</strong> ${tenant.name || "____________________"}</p>
        <p><strong>Address:</strong> ${tenant.address || "____________________"}</p>
        <p><strong>Phone:</strong> ${tenant.phone || "____________________"}</p>
        ${tenant.email ? `<p><strong>Email:</strong> ${tenant.email}</p>` : ""}
        ${tenant.panNumber ? `<p><strong>PAN:</strong> ${tenant.panNumber}</p>` : ""}
        ${tenant.aadharNumber ? `<p><strong>Aadhar:</strong> ${tenant.aadharNumber}</p>` : ""}
      </div>
      
      <p style="text-align: center;">(Hereinafter referred to as the <strong>"TENANT/LESSEE"</strong>, which expression shall, unless repugnant to the context or meaning thereof, include their heirs, executors, administrators, legal representatives, and assigns of the Second Part)</p>
    </div>
    
    <div class="section">
      <div class="section-title">Schedule of Property</div>
      <div class="property-box">
        <table>
          <tr>
            <td class="label">Property Address:</td>
            <td>${property.address || "____________________"}</td>
          </tr>
          <tr>
            <td class="label">City & State:</td>
            <td>${property.city || "____"}, ${getStateName(property.state)} - ${property.pincode || "______"}</td>
          </tr>
          <tr>
            <td class="label">Property Type:</td>
            <td>${getPropertyTypeName(property.propertyType)}</td>
          </tr>
          <tr>
            <td class="label">Furnishing Status:</td>
            <td>${getFurnishingName(property.furnishingStatus)}</td>
          </tr>
          ${property.area ? `<tr><td class="label">Area:</td><td>${property.area} sq. ft.</td></tr>` : ""}
          ${property.floor ? `<tr><td class="label">Floor:</td><td>${property.floor}</td></tr>` : ""}
          ${property.parking ? `<tr><td class="label">Parking:</td><td>Included</td></tr>` : ""}
        </table>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Terms and Conditions</div>
      <table class="terms-table">
        <tr>
          <th>Monthly Rent</th>
          <td>
            <strong>${formatCurrency(rentTerms.monthlyRent || 0)}</strong><br>
            <span class="amount-words">(${amountToWords(rentTerms.monthlyRent || 0)})</span>
          </td>
        </tr>
        <tr>
          <th>Security Deposit</th>
          <td>
            <strong>${formatCurrency(rentTerms.securityDeposit || 0)}</strong><br>
            <span class="amount-words">(${amountToWords(rentTerms.securityDeposit || 0)})</span>
          </td>
        </tr>
        ${!rentTerms.maintenanceIncluded && rentTerms.maintenanceCharges ? `
        <tr>
          <th>Maintenance Charges</th>
          <td>${formatCurrency(rentTerms.maintenanceCharges)} per month (payable separately)</td>
        </tr>
        ` : `
        <tr>
          <th>Maintenance Charges</th>
          <td>Included in rent</td>
        </tr>
        `}
        <tr>
          <th>Agreement Duration</th>
          <td>${getDurationText(rentTerms.agreementDuration)}</td>
        </tr>
        <tr>
          <th>Commencement Date</th>
          <td>${formatAgreementDate(rentTerms.agreementStartDate)}</td>
        </tr>
        <tr>
          <th>Expiry Date</th>
          <td>${formatAgreementDate(calculations.agreementEndDate)}</td>
        </tr>
        <tr>
          <th>Rent Due Day</th>
          <td>${rentTerms.rentDueDay}${getOrdinalSuffix(rentTerms.rentDueDay)} of every month</td>
        </tr>
        <tr>
          <th>Notice Period</th>
          <td>${rentTerms.noticePeriod} month(s)</td>
        </tr>
        <tr>
          <th>Payment Mode</th>
          <td>${getPaymentModeName(rentTerms.paymentMode)}</td>
        </tr>
        ${rentTerms.rentIncrementPercent ? `
        <tr>
          <th>Annual Rent Increment</th>
          <td>${rentTerms.rentIncrementPercent}% on renewal</td>
        </tr>
        ` : ""}
      </table>
    </div>
    
    ${selectedClauses.length > 0 ? `
    <div class="section">
      <div class="section-title">Terms and Covenants</div>
      <p style="margin-bottom: 15px;">The Tenant hereby agrees to the following terms and conditions:</p>
      <ol class="clauses-list">
        ${selectedClauses.join("\n        ")}
      </ol>
    </div>
    ` : ""}
    
    ${clauses.additionalClauses ? `
    <div class="section">
      <div class="section-title">Additional Clauses</div>
      <div class="additional-clauses">
        ${clauses.additionalClauses}
      </div>
    </div>
    ` : ""}
    
    <div class="signature-section">
      <p style="margin-bottom: 10px;">
        <strong>IN WITNESS WHEREOF</strong>, the parties have signed this Agreement on the date first mentioned above, in the presence of the following witnesses:
      </p>
      
      <div class="signature-grid">
        <div class="signature-box">
          <div class="signature-line">
            <div class="signature-label">LANDLORD/LESSOR</div>
            <div class="signature-name">${landlord.name || "____________________"}</div>
          </div>
        </div>
        <div class="signature-box">
          <div class="signature-line">
            <div class="signature-label">TENANT/LESSEE</div>
            <div class="signature-name">${tenant.name || "____________________"}</div>
          </div>
        </div>
      </div>
      
      <div class="witness-section">
        <p><strong>WITNESSES:</strong></p>
        <div class="witness-grid">
          <div class="witness-box">
            <p>1. Name: ____________________</p>
            <p>Address: ____________________</p>
            <div class="signature-line">
              <p>Signature</p>
            </div>
          </div>
          <div class="witness-box">
            <p>2. Name: ____________________</p>
            <p>Address: ____________________</p>
            <div class="signature-line">
              <p>Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>Document ID: RA-${Date.now().toString(36).toUpperCase()}</p>
    </div>
  </div>
</body>
</html>
`
}
