import { NextRequest, NextResponse } from "next/server";
import { sendNotification, emailTemplate } from "@/lib/send";
import { appendRow } from "@/lib/sheets";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, packageId, packageTitle, name, email, company, message, attendees, datePreference } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nafn og netfang vantar" }, { status: 400 });
    }

    const sections: Array<{ label: string; value: string }> = [
      { label: "Tegund", value: type === "workshop" ? "Vinnustofa" : type === "retainer" ? "Ráðgjafasamningur" : "Þjónustupakki" },
      { label: "Pakki", value: `${packageId} · ${packageTitle}` },
      { label: "Nafn", value: name },
      { label: "Netfang", value: `<a href="mailto:${email}">${email}</a>` },
    ];

    if (company) sections.push({ label: "Fyrirtæki", value: company });
    if (attendees) sections.push({ label: "Fjöldi", value: `${attendees} þátttakendur` });
    if (datePreference) sections.push({ label: "Dagsetning", value: datePreference });
    if (message) sections.push({ label: "Skilaboð", value: message });

    const typeLabel = type === "workshop" ? "Skráning" : "Pöntun";

    const html = emailTemplate(`${typeLabel} · ${packageTitle}`, sections,
      `Móttekið ${new Date().toLocaleString("is-IS")} · Svarið viðskiptavininum innan 24 klst.`
    );

    await sendNotification({
      subject: `${typeLabel}: ${packageId} ${packageTitle}`,
      html,
      replyTo: email,
    });

    // Append to Google Sheets (fire-and-forget, optional)
    appendRow("Pantanir", [
      new Date().toISOString(),
      type,
      `${packageId} ${packageTitle}`,
      name,
      email,
      company || "",
      attendees || "",
      datePreference || "",
      message || "",
    ]).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Villa kom upp" }, { status: 400 });
  }
}
