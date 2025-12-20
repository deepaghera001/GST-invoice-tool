import { type NextRequest, NextResponse } from "next/server"
import { documentService } from "@/lib/services/document-service"

export async function POST(request: NextRequest) {
  try {
    const { amount, provider = "razorpay" } = await request.json()

    const order = await documentService.createPaymentOrder({
      provider,
      amount,
      currency: "INR",
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("[v0] Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
