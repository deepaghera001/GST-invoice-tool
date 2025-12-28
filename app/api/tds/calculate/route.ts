import { calculateTDSPenalty, TDSPenaltyInput } from '@/lib/tds/calculator';
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

    const input: TDSPenaltyInput = {
      tdsSection: body.tdsSection,
      tdsAmount: parseFloat(body.tdsAmount),
      dueDate,
      filingDate,
    };

    // Validate required fields
    if (!input.tdsSection || isNaN(input.tdsAmount) || input.tdsAmount < 0) {
      return NextResponse.json(
        { error: 'Missing or invalid required fields' },
        { status: 400 }
      );
    }

    // Calculate penalty
    const result = calculateTDSPenalty(input);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
