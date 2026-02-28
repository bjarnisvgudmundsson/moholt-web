import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/csat
 * Receives CSAT survey responses.
 * 
 * TODO: Connect to Google Sheets, Airtable, or database.
 * For now, logs to server console and returns success.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    const { context, contextId, answers, ts } = body;
    if (!context || !answers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // TODO: Replace with actual storage
    // Options: Google Sheets API, Airtable, Supabase, etc.
    console.log("CSAT submission:", JSON.stringify({ context, contextId, answers, ts }, null, 2));

    return NextResponse.json({ success: true, message: "Takk fyrir endurgjöfina" });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
