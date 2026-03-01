"use client";

import { useState } from "react";
import { FF } from "@/lib/data";

interface OrderFormProps {
  type: "service" | "workshop" | "retainer";
  packageId: string;
  packageTitle: string;
  onClose: () => void;
  showAttendees?: boolean;
  showDatePreference?: boolean;
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  fontSize: 14,
  fontFamily: "inherit",
  boxSizing: "border-box" as const,
  color: "#1e293b",
  background: "white",
};

export default function OrderForm({ type, packageId, packageTitle, onClose, showAttendees, showDatePreference }: OrderFormProps) {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "", attendees: "", datePreference: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const submit = async () => {
    if (!form.name || !form.email) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, packageId, packageTitle, ...form }),
      });
      if (res.ok) setStatus("sent");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") return (
    <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 32, textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
      <h3 style={{ fontFamily: FF, fontSize: 20, marginBottom: 8 }}>Takk fyrir!</h3>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 16 }}>
        {type === "workshop" ? "Skráning móttekin" : "Fyrirspurn móttekin"} — við heyrum í þér innan 24 klst.
      </p>
      <button onClick={onClose} style={{ padding: "8px 20px", border: "1px solid #d1d5db", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 13 }}>Loka</button>
    </div>
  );

  const isWorkshop = type === "workshop";

  return (
    <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ background: "#1e293b", padding: "16px 24px", color: "white" }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, opacity: .5, marginBottom: 4 }}>
          {isWorkshop ? "Skráning" : "Fyrirspurn"}
        </div>
        <div style={{ fontFamily: FF, fontSize: 16 }}>{packageId} · {packageTitle}</div>
      </div>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#334155", marginBottom: 6 }}>Nafn *</label>
          <input value={form.name} onChange={e => set("name", e.target.value)} style={inputStyle} placeholder="Fullt nafn" />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#334155", marginBottom: 6 }}>Netfang *</label>
          <input value={form.email} onChange={e => set("email", e.target.value)} type="email" style={inputStyle} placeholder="þitt@fyrirtæki.is" />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#334155", marginBottom: 6 }}>Fyrirtæki / Stofnun</label>
          <input value={form.company} onChange={e => set("company", e.target.value)} style={inputStyle} placeholder="Valfrjálst" />
        </div>
        {(showAttendees || isWorkshop) && (
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#334155", marginBottom: 6 }}>Fjöldi þátttakenda</label>
            <input value={form.attendees} onChange={e => set("attendees", e.target.value)} type="number" style={inputStyle} placeholder="T.d. 8" />
          </div>
        )}
        {(showDatePreference || isWorkshop) && (
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#334155", marginBottom: 6 }}>Dagsetningarósk</label>
            <input value={form.datePreference} onChange={e => set("datePreference", e.target.value)} style={inputStyle} placeholder="T.d. mars 2026, vikulok helst" />
          </div>
        )}
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#334155", marginBottom: 6 }}>Skilaboð</label>
          <textarea value={form.message} onChange={e => set("message", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Sérstakar óskir, spurningar eða samhengi..." />
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={submit}
            disabled={!form.name || !form.email || status === "sending"}
            style={{
              padding: "12px 28px", background: form.name && form.email ? "#1e293b" : "#e2e8f0",
              color: form.name && form.email ? "white" : "#94a3b8",
              border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14,
              cursor: form.name && form.email ? "pointer" : "not-allowed",
            }}
          >
            {status === "sending" ? "Sendi..." : isWorkshop ? "Skrá mig" : "Senda fyrirspurn"}
          </button>
          <button onClick={onClose} style={{ padding: "12px 20px", background: "none", border: "1px solid #d1d5db", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#64748b" }}>Hætta við</button>
          {status === "error" && <span style={{ fontSize: 13, color: "#dc2626" }}>Villa — reyndu aftur</span>}
        </div>
        <p style={{ fontSize: 11, color: "#94a3b8" }}>* Nauðsynlegt. Við deilum ekki upplýsingum þínum með þriðja aðila.</p>
      </div>
    </div>
  );
}
