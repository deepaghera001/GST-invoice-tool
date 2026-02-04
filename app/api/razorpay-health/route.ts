import { NextResponse } from "next/server"

/**
 * Health check endpoint for Razorpay configuration
 * Verifies that all required environment variables are set
 */
export async function GET() {
  const checks = {
    server_key_id: !!process.env.RAZORPAY_KEY_ID,
    server_key_secret: !!process.env.RAZORPAY_KEY_SECRET,
    client_key_id: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    test_mode: process.env.NEXT_PUBLIC_TEST_MODE,
    environment: process.env.NODE_ENV,
  }

  const allConfigured = checks.server_key_id && checks.server_key_secret && checks.client_key_id

  // Return sanitized values (don't expose actual keys)
  return NextResponse.json({
    status: allConfigured ? "configured" : "missing_variables",
    checks: {
      server_key_id: checks.server_key_id ? "✓ Set" : "✗ Missing",
      server_key_secret: checks.server_key_secret ? "✓ Set" : "✗ Missing",
      client_key_id: checks.client_key_id ? "✓ Set" : "✗ Missing",
      test_mode: checks.test_mode || "not set",
      environment: checks.environment || "not set",
    },
    key_prefixes: {
      server_key_id: process.env.RAZORPAY_KEY_ID?.substring(0, 8) + "...",
      client_key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.substring(0, 8) + "...",
    },
    message: allConfigured
      ? "Razorpay is properly configured"
      : "Missing required environment variables",
  })
}
