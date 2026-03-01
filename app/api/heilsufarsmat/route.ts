import { NextRequest, NextResponse } from "next/server";
import { sendNotification, emailTemplate } from "@/lib/send";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers, notes, total, level, dims, ts } = body;

    if (!answers || total === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Build dimension summary
    const dimRows = Object.entries(dims || {}).map(([key, d]: [string, any]) =>
      `${key} · ${d.name}: ${d.score}/${d.max} (${d.pct}%)`
    ).join("<br>");

    // Build notes summary
    const noteEntries = Object.entries(notes || {}).filter(([, v]) => v);
    const noteRows = noteEntries.length > 0
      ? noteEntries.map(([qId, text]) => `Sp. ${qId}: ${text}`).join("<br>")
      : "Engar athugasemdir";

    const html = emailTemplate(`Heilsufarsmat · ${new Date(ts).toLocaleDateString("is-IS")}`, [
      { label: "Heildarstig", value: `<strong style="font-size:24px;">${total}/80</strong>` },
      { label: "Þroskaþrep", value: `<strong>${level}</strong>` },
      { label: "Víddir", value: dimRows },
      { label: "Athugasemdir", value: noteRows },
      { label: "Tími", value: new Date(ts).toLocaleString("is-IS") },
    ], "Niðurstöður úr heilsufarsmatinu á moholt.is");

    await sendNotification({
      subject: `Heilsufarsmat: ${level} (${total}/80)`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
