# Railway + Razorpay Production Setup Guide

## The Problem

You changed keys in Railway and redeployed, but the site shows "Something went wrong" error.

## Root Cause

Next.js **embeds** `NEXT_PUBLIC_*` environment variables **at build time**, not runtime. Railway needs these vars **during the build step**, not just after deployment.

## Solution: Configure Railway Environment Variables

### Step 1: Go to Railway Dashboard

1. Open your Railway project: https://railway.app/project/[your-project-id]
2. Click on your service
3. Go to **Variables** tab

### Step 2: Add ALL These Variables

**Critical - Required for Build:**
```
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
NEXT_PUBLIC_TEST_MODE=false
```

**Critical - Required for Runtime:**
```
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET
```

**Email (Optional but recommended):**
```
RESEND_API_KEY=re_YOUR_RESEND_KEY
ADMIN_EMAIL=your.email@example.com
```

**Other Settings:**
```
NODE_ENV=production
NEXT_PUBLIC_AB_SHOW_STICKY=0
```

### Step 3: Important - Use LIVE Keys for Production

Replace test keys with live keys:
- **Test key:** `rzp_test_...` ❌
- **Live key:** `rzp_live_...` ✅

Get live keys from: https://dashboard.razorpay.com/app/keys

⚠️ **IMPORTANT:** Never commit live keys to git! Only set them in Railway dashboard.

### Step 4: Redeploy

After setting ALL variables:

1. Click **Deploy** button in Railway, OR
2. Push to git (Railway auto-deploys):
   ```bash
   git commit --allow-empty -m "trigger Railway rebuild with new keys"
   git push origin main
   ```

### Step 5: Verify Deployment

#### A. Check Build Logs in Railway

Look for:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Creating an optimized production build
```

If you see errors about missing variables, double-check Step 2.

#### B. Test the Health Check Endpoint

Once deployed, visit:
```
https://your-app.railway.app/api/razorpay-health
```

You should see:
```json
{
  "status": "configured",
  "checks": {
    "server_key_id": "✓ Set",
    "server_key_secret": "✓ Set",
    "client_key_id": "✓ Set",
    "test_mode": "false",
    "environment": "production"
  },
  "key_prefixes": {
    "server_key_id": "rzp_live...",
    "client_key_id": "rzp_live..."
  },
  "message": "Razorpay is properly configured"
}
```

If any show "✗ Missing", go back to Step 2.

#### C. Test Payment Flow

1. Visit your site: `https://your-app.railway.app`
2. Fill out a document form
3. Click the download button
4. Verify Razorpay checkout opens
5. Use Razorpay test card (even with live keys in test mode):
   - Card: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: Any future date

## Common Issues & Fixes

### Issue 1: "Something went wrong" Error

**Cause:** Environment variables not set in Railway dashboard.

**Fix:** Complete Step 2 above, then redeploy.

### Issue 2: Razorpay Checkout Shows Wrong Key

**Cause:** Built with old keys, or `NEXT_PUBLIC_RAZORPAY_KEY_ID` not set.

**Fix:** 
1. Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set in Railway
2. Trigger new build (push or manual deploy)

### Issue 3: Order Creation Fails

**Cause:** Server-side keys missing or wrong.

**Fix:** 
1. Check `/api/razorpay-health` endpoint
2. Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set

### Issue 4: Build Succeeds but App Crashes at Runtime

**Check Railway logs:**
```
View → Deployments → [Latest] → View Logs
```

Common causes:
- Missing Playwright dependencies (should be fine with playwright Docker image)
- Port binding issues (Railway auto-sets PORT)
- Missing runtime env vars

## Dockerfile Configuration

Your current Dockerfile is **correct** and already includes:

```dockerfile
# Build-time args (Railway injects these during build)
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID
ARG NEXT_PUBLIC_TEST_MODE
ARG NEXT_PUBLIC_AB_SHOW_STICKY

# Make them available to Next.js
ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=$NEXT_PUBLIC_RAZORPAY_KEY_ID
ENV NEXT_PUBLIC_TEST_MODE=$NEXT_PUBLIC_TEST_MODE
ENV NEXT_PUBLIC_AB_SHOW_STICKY=$NEXT_PUBLIC_AB_SHOW_STICKY
```

✅ **No changes needed to Dockerfile!**

## Test Mode vs Production Mode

### Test Mode (Development)
```
NEXT_PUBLIC_TEST_MODE=true
```
- Free downloads, no payment required
- Shows "Test Mode" badge on forms

### Production Mode (Live)
```
NEXT_PUBLIC_TEST_MODE=false
```
- Requires payment
- Uses live Razorpay keys
- Real transactions

## Security Checklist

Before going live:

- ✅ `NEXT_PUBLIC_TEST_MODE=false` in Railway
- ✅ Using `rzp_live_*` keys (not `rzp_test_*`)
- ✅ Live keys ONLY in Railway dashboard (not in code)
- ✅ Verify `.env.local` is in `.gitignore`
- ✅ Test payment flow with live keys
- ✅ Enable Razorpay webhooks (optional but recommended)

## Support

If still having issues:

1. Check `/api/razorpay-health` endpoint output
2. Share Railway build logs (without exposing keys)
3. Check browser console for client-side errors
4. Verify Razorpay dashboard shows test/live mode correctly

## Quick Reference

**Railway Variables Tab:**
```
NEXT_PUBLIC_RAZORPAY_KEY_ID → rzp_live_...
RAZORPAY_KEY_ID → rzp_live_...
RAZORPAY_KEY_SECRET → (secret)
NEXT_PUBLIC_TEST_MODE → false
NODE_ENV → production
```

**Health Check:**
```
https://your-app.railway.app/api/razorpay-health
```

**Razorpay Dashboard:**
```
https://dashboard.razorpay.com
```
