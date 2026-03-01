import { NextRequest, NextResponse } from "next/server";
import { sendNotification, emailTemplate } from "@/lib/send";
import { appendRow } from "@/lib/sheets";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers, notes, total, level, dims, org, respondentEmail, ts } = body;

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

    const sections = [
      { label: "Heildarstig", value: `<strong style="font-size:24px;">${total}/80</strong>` },
      { label: "Þroskaþrep", value: `<strong>${level}</strong>` },
      { label: "Víddir", value: dimRows },
      { label: "Athugasemdir", value: noteRows },
      { label: "Tími", value: new Date(ts).toLocaleString("is-IS") },
    ];

    if (org) sections.splice(0, 0, { label: "Stofnun", value: org });
    if (respondentEmail) sections.splice(org ? 1 : 0, 0, { label: "Netfang", value: `<a href="mailto:${respondentEmail}">${respondentEmail}</a>` });

    const html = emailTemplate(`Heilsufarsmat · ${new Date(ts).toLocaleDateString("is-IS")}`, sections, "Niðurstöður úr heilsufarsmatinu á moholt.is");

    // Send to Bjarni
    await sendNotification({
      subject: `Heilsufarsmat: ${level} (${total}/80)${org ? ` — ${org}` : ""}`,
      html,
    });

    // Send copy to respondent if they provided email
    if (respondentEmail) {
      await sendNotification({
        subject: `Niðurstöður heilsufarsmat — ${org || "Þínar niðurstöður"}`,
        html: emailTemplate(`Niðurstöður heilsufarsmat`, sections, "Þessar niðurstöður eru sendar á beiðni þína frá moholt.is. Hafðu samband við bjarni@moholt.is ef þú vilt ræða þær nánar."),
        to: respondentEmail,
      });
    }

    // Append to Google Sheets (fire-and-forget, optional)
    appendRow("Heilsufarsmat", [
      new Date().toISOString(),
      org || "",
      respondentEmail || "",
      total,
      level,
      dims.A?.score || 0,
      dims.B?.score || 0,
      dims.C?.score || 0,
      dims.D?.score || 0,
    ]).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
