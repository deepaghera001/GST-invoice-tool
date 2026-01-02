# 🎯 Shareholders Agreement - Access & Testing

## ✅ Page is LIVE

### URL
```
http://localhost:3000/shareholders-agreement
```

### What You'll See
- Full-screen two-column layout
- Left: Comprehensive 12-section form
- Right: Live-updating PDF preview
- Submit button with ₹499-₹999 pricing tiers

---

## 📋 Form Sections You Can Fill

1. **Company Details** - Company name, CIN, address, date, type
2. **Shareholders** - Add 2+ shareholders with shareholding %  (must total 100%)
3. **Share Capital** - Authorized, paid-up, face value
4. **Board Control** - Directors count, appointment method, reserved matters
5. **Voting Rights** - Voting basis, decision requirements
6. **Transfer Restrictions** - Lock-in period, ROFR settings
7. **Tag/Drag Along** (Premium) - Trigger percentages
8. **Exit Clauses** - Exit options, valuation method
9. **Confidentiality** - Confidentiality & non-compete duration
10. **Dispute Resolution** - Deadlock method, arbitration location
11. **Termination** - Termination conditions, notice period
12. **Signatures** - Place of signing, witness details

---

## 🧪 Test Data (Copy-Paste Ready)

### Quick Test Scenario: 2-Founder Startup

**Company Details:**
- Name: `TechStartup India Pvt Ltd`
- CIN: `U72900MH2020PTC123456`
- Address: `123 Business Park, Mumbai 400001`
- Date: `2024-01-01`
- Type: `Private Limited`

**Shareholder 1:**
- Name: `Rajesh Kumar`
- Email: `rajesh@startup.com`
- Address: `Mumbai, India`
- Shareholding: `60%`
- Shares: `6000`
- Role: `Founder`

**Shareholder 2:**
- Name: `Priya Sharma`
- Email: `priya@startup.com`
- Address: `Bangalore, India`
- Shareholding: `40%`
- Shares: `4000`
- Role: `Founder`

**Share Capital:**
- Authorized: `₹2000000`
- Paid-up: `₹1000000`
- Face Value: `₹10`

**Board:**
- Directors: `2`
- Appointment: `Each founder`
- Reserved: All 4 (Issue, Change, Borrowing, Sale)

**Voting:**
- Basis: `One share = one vote`
- Decision: `Special majority (75%)`

**Transfer:**
- Allowed: `No`
- ROFR: `No`
- Lock-in: `12 months`

**Exit Options:**
- Buy-back by company ✓
- Sale to third party ✓
- Valuation: `Fair market value`

**Confidentiality:**
- Clause: `Yes`
- Duration: `24 months`
- Non-solicitation: `Yes`

**Dispute:**
- Method: `Arbitration`
- Location: `New Delhi`

**Termination:**
- Conditions: Mutual consent, Breach
- Notice: `30 days`

**Signatures:**
- Place: `Mumbai`
- Witnesses: `2`

---

## 🎬 Step-by-Step Testing

### 1. Load the Page
```
Visit: http://localhost:3000/shareholders-agreement
Expected: Two-column form layout loads
```

### 2. Fill Company Details
```
✓ Company name required
✓ Date picker works
✓ Select dropdown shows Private Limited / LLP
```

### 3. Add Shareholders
```
✓ "Add Shareholder" button adds new shareholder
✓ Can remove if > 2 shareholders
✓ Shareholding % validator shows total at bottom
```

### 4. Real-time Preview
```
✓ Preview updates as you type
✓ Shareholder table shows in preview
✓ All sections visible before submission
```

### 5. Validation
```
✓ Submit button disabled until form valid
✓ Error messages appear on blur
✓ Shareholding 100% check triggers validation
```

### 6. Submit (Test Mode)
```
Click "Pay ₹499 & Download" button
Expected: 
- Form validates
- PDF captures from preview
- PDF downloads as shareholders-agreement-techstartup-india-pvt-ltd.pdf
```

---

## 🔍 What Gets Validated

### Required Fields
- ✅ Company name (min 2 chars)
- ✅ Registered address (min 10 chars)
- ✅ Date of agreement (not future)
- ✅ Company type (select required)
- ✅ At least 2 shareholders
- ✅ Total shareholding = 100%
- ✅ Each shareholder: name, email, shareholding, role
- ✅ Face value > 0
- ✅ Voting basis & decisions required
- ✅ Deadlock resolution method
- ✅ Arbitration location
- ✅ Place of signing

### Validations (Automatic)
- Email format check
- Shareholding % range (0-100)
- Shares must be integer
- Paid-up ≤ Authorized capital
- Date cannot be future
- CIN format (if provided)
- Governing law locked to "India"

---

## 📱 Responsive Design

| Device | Layout |
|--------|--------|
| Desktop (>1024px) | 2-column: form + preview side-by-side |
| Tablet (768-1024px) | 2-column narrower, sticky preview |
| Mobile (<768px) | Single column: form full width, preview below |

---

## 🎨 Visual Indicators

| Indicator | Meaning |
|-----------|---------|
| Green badge "Completed" | Section fully filled & valid |
| Red asterisk `*` | Required field |
| Red text below input | Validation error |
| Disabled submit button | Form has errors |
| Enabled submit button | Form is valid |

---

## 📥 PDF Output Structure

### What's in the Generated PDF:

1. **Title Page**
   - "SHAREHOLDERS AGREEMENT" heading
   - Company name

2. **Table of Contents**
   - All 12 sections listed

3. **Full Content** (12 pages typical)
   - Section 1: Company Details with all data
   - Section 2: Shareholders with shareholding table
   - Section 3: Share capital figures
   - Sections 4-11: All form data bound
   - Section 12: Signature pages with blank spaces

4. **Signature Pages**
   - Each shareholder: blank line for signature
   - Witnesses: blank lines
   - Place and date

5. **Legal Disclaimer**
   - Yellow box at bottom
   - Professional legal notice

---

## 🔗 Integration Checklist

- [x] Page route created
- [x] Form components built
- [x] Type definitions complete
- [x] Hook with validation ready
- [x] PDF preview working
- [x] DOM capture function added
- [x] Build compiles successfully
- [ ] Connect Razorpay payment (next step)
- [ ] Add `/api/generate-pdf` integration (next step)
- [ ] Email delivery (optional)

---

## 💾 Data Persistence (Optional)

Currently data is not persisted. To add:

1. **LocalStorage** (client-only)
```typescript
// Save in handleChange
localStorage.setItem('shareholders_form', JSON.stringify(formData))

// Load on mount
const saved = localStorage.getItem('shareholders_form')
if (saved) setFormData(JSON.parse(saved))
```

2. **Database** (production)
```typescript
// POST to backend
await fetch('/api/shareholders-agreements', {
  method: 'POST',
  body: JSON.stringify(formData)
})
```

---

## 🚀 Production Deployment

### Ready for:
- ✅ Vercel (Next.js optimized)
- ✅ Self-hosted Node.js
- ✅ Docker containerization
- ✅ CI/CD pipelines

### Pre-deployment:
- [ ] Set up Razorpay keys in `.env`
- [ ] Configure `/api/generate-pdf` endpoint
- [ ] Test PDF generation
- [ ] Set up email notifications
- [ ] Add analytics tracking

---

## 🐞 Debugging Tips

### Check Form State
```typescript
// In browser console
// Add to component:
useEffect(() => {
  console.log('Form Data:', formData)
  console.log('Errors:', errors)
  console.log('Section Complete:', isSectionComplete)
}, [formData, errors, isSectionComplete])
```

### Validate Without Submit
```typescript
// In browser console
formData.shareholders.reduce((sum, sh) => sum + (sh.shareholding || 0), 0)
// Should equal 100
```

### Check Preview HTML
```javascript
// In console
document.getElementById('shareholders-agreement-preview').innerHTML
```

---

## 📞 Support

For issues or questions:
1. Check `SHAREHOLDERS_AGREEMENT_DEVELOPER_GUIDE.md`
2. Review form validation rules above
3. Test with provided test data
4. Check browser console for errors

---

**Status:** ✅ Ready to Test
**Last Build:** ✓ Successful (3.5s)
**Route:** http://localhost:3000/shareholders-agreement

🎉 **You're all set to start generating shareholders agreements!**
