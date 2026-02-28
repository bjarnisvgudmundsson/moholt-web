import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/heilsufarsmat
 * Receives assessment results including scores and free-text notes.
 * 
 * TODO: Store in database / send email notification to bjarni@moholt.is
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers, notes, total, level, dims, ts } = body;

    if (!answers || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // TODO: Replace with actual storage + email notification
    console.log("HEILSUFARSMAT submission:", JSON.stringify({ answers, notes, total, level, dims, ts }, null, 2));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
