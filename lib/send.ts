import { Resend } from "resend";

const TO = "bjarni@moholt.is";
const FROM = "Móholt Vefsíða <onboarding@resend.dev>"; // Change to noreply@moholt.is after domain verification

interface SendOpts {
  subject: string;
  html: string;
  replyTo?: string;
  to?: string;
}

export async function sendNotification({ subject, html, replyTo, to }: SendOpts) {
  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured - email not sent");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: to || TO,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });
    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }
    return { success: true, id: data?.id };
  } catch (err) {
    console.error("Email send failed:", err);
    return { success: false, error: err };
  }
}

// Reusable HTML email wrapper — clean, simple, matches site feel
export function emailTemplate(title: string, sections: Array<{ label: string; value: string }>, footer?: string) {
  const rows = sections
    .map(s => `<tr><td style="padding:8px 0;color:#64748b;font-size:13px;vertical-align:top;width:140px;">${s.label}</td><td style="padding:8px 0;color:#1e293b;font-size:14px;">${s.value}</td></tr>`)
    .join("");
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:560px;margin:0 auto;">
      <div style="background:#1e293b;padding:24px 32px;border-radius:8px 8px 0 0;">
        <h1 style="color:white;font-size:18px;margin:0;">Móholt ehf.</h1>
        <p style="color:rgba(255,255,255,.5);font-size:12px;margin:4px 0 0;">${title}</p>
      </div>
      <div style="background:white;padding:24px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
        <table style="width:100%;border-collapse:collapse;">${rows}</table>
        ${footer ? `<div style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">${footer}</div>` : ""}
      </div>
    </div>
  `;
}
