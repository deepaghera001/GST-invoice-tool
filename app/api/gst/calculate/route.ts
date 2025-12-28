import { calculateGSTPenalty, GSTPenaltyInput } from '@/lib/gst/calculator';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Parse and validate input
    const dueDate = new Date(body.dueDate);
    const filingDate = new Date(body.filingDate);

    if (isNaN(dueDate.getTime()) || isNaN(filingDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid dates' },
        { status: 400 }
      );
    }

    const input: GSTPenaltyInput = {
      returnType: body.returnType,
      taxAmount: parseFloat(body.taxAmount),
      dueDate,
      filingDate,
      taxPaidLate: body.taxPaidLate === true || body.taxPaidLate === 'true',
    };

    // Validate required fields
    if (!input.returnType || isNaN(input.taxAmount) || input.taxAmount < 0) {
      return NextResponse.json(
        { error: 'Missing or invalid required fields' },
        { status: 400 }
      );
    }

    // Calculate penalty
    const result = calculateGSTPenalty(input);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
