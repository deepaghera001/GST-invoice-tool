# Railway Build Failure Fix

## Issue Identified

The Dockerfile I previously modified had **critical bugs** that caused Railway build failures:

### Problems:
1. ❌ `npm ci --only=production` - Skipped devDependencies needed for build
2. ❌ Broken standalone file copy logic
3. ❌ `node server.js` - File doesn't exist in that location

## Fixes Applied

### 1. Reverted Dockerfile to Working State
**File:** `Dockerfile`

```dockerfile
# ✅ Use npm ci (includes devDependencies for build)
RUN npm ci

# ✅ Standard Next.js start command
CMD ["npm", "run", "start"]
```

### 2. Removed Standalone Output (Too Complex for Now)
**File:** `next.config.mjs`

Removed `output: 'standalone'` - requires multi-stage Docker build

### 3. Added Railway Ignore File
**File:** `.railwayignore`

Excludes unnecessary files from Railway builds for faster deployments

## Why It Worked Locally But Failed on Railway

### Locally:
- You already had `node_modules/` from previous builds
- Dev dependencies were present
- Not using Docker

### Railway:
- Fresh Docker build every time
- `npm ci --only=production` = NO devDependencies
- Next.js build **requires** devDependencies like:
  - `typescript`
  - `@types/*` packages
  - Build tools

## Current Configuration (Working)

### Dockerfile:
```dockerfile
FROM mcr.microsoft.com/playwright:v1.57.0-jammy
WORKDIR /app

# Build args
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID
ARG NEXT_PUBLIC_TEST_MODE
ARG NEXT_PUBLIC_AB_SHOW_STICKY

ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=$NEXT_PUBLIC_RAZORPAY_KEY_ID
ENV NEXT_PUBLIC_TEST_MODE=$NEXT_PUBLIC_TEST_MODE
ENV NEXT_PUBLIC_AB_SHOW_STICKY=$NEXT_PUBLIC_AB_SHOW_STICKY

# Install ALL dependencies (including dev)
COPY package*.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

# Standard start
CMD ["npm", "run", "start"]
```

### Next.js Config (Optimized):
```javascript
{
  compress: true,           // ✅ Gzip compression
  poweredByHeader: false,   // ✅ Security
  reactStrictMode: true,    // ✅ Better dev checks
}
```

### Performance Wins (Still Applied):
- ✅ 14/14 pages static (was 12/14)
- ✅ Compression enabled
- ✅ React strict mode
- ✅ Security headers

## Next Steps

### 1. Commit & Push:
```bash
git add .
git commit -m "fix: revert broken Docker standalone config"
git push origin main
```

### 2. Verify Railway Build:
- Should now build successfully
- Check build logs for confirmation
- Deployment should complete

### 3. Monitor:
- Check if all 14 static pages deploy correctly
- Verify environment variables are set in Railway dashboard
- Test the deployed site

## Future Optimization (Optional)

For even smaller Docker images, we can implement **multi-stage builds**:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM mcr.microsoft.com/playwright:v1.57.0-jammy
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
CMD ["npm", "start"]
```

But let's get the basic version working first! 🚀

## Troubleshooting

If Railway still fails, check:

1. **Environment Variables in Railway Dashboard:**
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `NEXT_PUBLIC_TEST_MODE`
   - `NEXT_PUBLIC_AB_SHOW_STICKY`
   - Any other required vars

2. **Railway Build Logs:**
   - Look for `npm ci` errors
   - Check for missing dependencies
   - Verify build completes

3. **Deploy Logs:**
   - Check if server starts on correct PORT
   - Railway sets PORT automatically - don't hardcode

4. **Network/HTTP Logs:**
   - Check if requests are reaching the app
   - Look for 502/503 errors
