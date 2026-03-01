import { NextRequest, NextResponse } from "next/server";
import { sendNotification, emailTemplate } from "@/lib/send";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { context, contextId, contextTitle, answers, ts } = body;

    if (!context || !answers) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Calculate average rating
    const ratings = Object.entries(answers)
      .filter(([, v]) => typeof v === "number" && v <= 10)
      .map(([, v]) => v as number);
    const avg = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "N/A";

    const sections = Object.entries(answers).map(([key, value]) => ({
      label: key,
      value: String(value),
    }));

    sections.unshift({ label: "Þjónusta", value: `${contextId} · ${contextTitle}` });
    sections.unshift({ label: "Tegund", value: context });

    const html = emailTemplate(`CSAT · ${contextTitle || context}`, sections,
      `Meðaleinkunn: ${avg} · ${new Date(ts || Date.now()).toLocaleString("is-IS")}`
    );

    await sendNotification({
      subject: `CSAT: ${contextId || context} — ${avg}/5`,
      html,
    });

    return NextResponse.json({ success: true, message: "Takk fyrir endurgjöfina" });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
