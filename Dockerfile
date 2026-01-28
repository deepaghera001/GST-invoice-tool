FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /app

# Build-time env vars
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID
ARG NEXT_PUBLIC_TEST_MODE
ARG NEXT_PUBLIC_AB_SHOW_STICKY

ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=$NEXT_PUBLIC_RAZORPAY_KEY_ID
ENV NEXT_PUBLIC_TEST_MODE=$NEXT_PUBLIC_TEST_MODE
ENV NEXT_PUBLIC_AB_SHOW_STICKY=$NEXT_PUBLIC_AB_SHOW_STICKY

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

ENV NODE_ENV=production

# Copy standalone build for optimized size
RUN cp -R .next/standalone/. . && \
    cp -R .next/static .next/standalone/.next/static && \
    cp -R public .next/standalone/public

# ❌ DO NOT hardcode PORT
# Railway provides it at runtime

EXPOSE 3000

# Use standalone server for better performance
CMD ["node", "server.js"]
