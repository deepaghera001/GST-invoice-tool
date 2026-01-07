# 📧 Email Setup Guide for Document Requests

This guide explains how to set up **free email notifications** for document requests.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create a Resend Account (FREE)

1. Go to [resend.com](https://resend.com)
2. Sign up with GitHub or email
3. **Free tier includes**: 3,000 emails/month, 100 emails/day

### Step 2: Get Your API Key

1. After logging in, go to [API Keys](https://resend.com/api-keys)
2. Click **"Create API Key"**
3. Give it a name like "PDF Tool Document Requests"
4. Copy the API key (it starts with `re_`)

### Step 3: Configure Environment Variables

Open your `.env.local` file and update:

```env
RESEND_API_KEY=re_your_actual_api_key_here
ADMIN_EMAIL=your.email@example.com
```

**Replace:**
- `re_your_actual_api_key_here` with your actual Resend API key
- `your.email@example.com` with the email where you want to receive requests

### Step 4: Deploy to Production

When deploying to Vercel/Netlify, add these environment variables in your hosting dashboard:

**Vercel:**
1. Go to your project → Settings → Environment Variables
2. Add `RESEND_API_KEY` and `ADMIN_EMAIL`
3. Redeploy

**Netlify:**
1. Go to Site settings → Environment variables
2. Add `RESEND_API_KEY` and `ADMIN_EMAIL`
3. Trigger new deploy

## ✅ What Happens

When a user submits a document request:
1. Form data is validated
2. A beautifully formatted email is sent to your `ADMIN_EMAIL`
3. Email includes:
   - Document name
   - Description
   - User's email (if provided)
   - Additional info
   - Timestamp

## 📧 Sample Email Preview

You'll receive emails that look like this:

```
Subject: 📄 New Document Request: Employment Agreement

New Document Request Received
━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Document Name
Employment Agreement

📝 Description
Need a template for hiring full-time employees with
Indian labor law compliance...

👤 User Contact
Email: user@example.com
Submitted: Jan 7, 2026, 10:30 AM
```

## 🆓 100% Free Solution

- **No database required**
- **No monthly costs**
- **No credit card required** (Resend free tier)
- **3,000 emails/month** is more than enough for most projects

## 🔒 Security Note

Never commit your `.env.local` file to Git. The `.gitignore` already includes it.

## 🧪 Testing Locally

1. Set up your environment variables
2. Run `npm run dev`
3. Go to `http://localhost:3000/request-document`
4. Submit a test request
5. Check your email inbox!

## ❓ Troubleshooting

**Not receiving emails?**
- Check your spam folder
- Verify `RESEND_API_KEY` is correct
- Verify `ADMIN_EMAIL` is correct
- Check the terminal/console for error messages

**Emails go to spam?**
- This is normal with `onboarding@resend.dev` (test domain)
- To fix: [Verify your own domain](https://resend.com/docs/dashboard/domains/introduction) in Resend (free)

## 🎯 Alternative: Email Without Resend

If you don't want to use Resend, requests will still work - they'll just be logged to the console. You can check the Vercel/Netlify logs to see submissions.

Or you can integrate with:
- [Formspree](https://formspree.io) (free tier)
- [EmailJS](https://www.emailjs.com) (free tier)
- Your own SMTP server
