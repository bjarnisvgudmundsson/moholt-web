import { google } from "googleapis";

const SHEET_ID = process.env.GOOGLE_SHEETS_ID;

export async function appendRow(tab: string, values: (string | number)[]) {
  // Graceful degradation — return early if not configured
  if (!SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    return { success: false, error: "Google Sheets not configured" };
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${tab}!A:Z`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] },
    });

    return { success: true };
  } catch (err) {
    console.error(`Sheets append error (${tab}):`, err);
    return { success: false, error: err };
  }
}
