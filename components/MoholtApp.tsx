"use client";

import { useState, useCallback, useEffect } from "react";
import {
  FF, ASSESSMENT_SECTIONS, MATURITY_LEVELS, SERVICE_PACKAGES,
  RETAINERS, BYRDING_FLOWS, CSAT_Q, WORKSHOPS, card, hoverCard, unhoverCard,
} from "@/lib/data";
import OrderForm from "@/components/OrderForm";

/* ═══════════════════════════════════════════════════════════════
   COOKIE CONSENT BANNER
   ═══════════════════════════════════════════════════════════════ */
function CookieBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="no-print" style={{ position:"fixed", bottom:0, left:0, right:0, background:"#1e293b", color:"white", padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"center", gap:16, zIndex:200, flexWrap:"wrap", fontSize:13 }}>
      <span>Þessi vefsíða notar aðeins nauðsynlegar vafrakökur. Engin greiningarkökur eru notaðar án samþykkis.</span>
      <button onClick={()=>setVisible(false)} style={{ padding:"8px 20px", background:"#2563eb", color:"white", border:"none", borderRadius:6, fontWeight:600, cursor:"pointer", fontSize:13 }}>Samþykkja</button>
      <button onClick={()=>setVisible(false)} style={{ padding:"8px 20px", background:"transparent", color:"#94a3b8", border:"1px solid #475569", borderRadius:6, fontWeight:500, cursor:"pointer", fontSize:13 }}>Hafna</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CSAT WIDGET — reusable
   ═══════════════════════════════════════════════════════════════ */
function CSATWidget({ context, contextId, contextTitle, onClose }: { context: string; contextId: string; contextTitle: string; onClose?: () => void }) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const qs = CSAT_Q[context] || CSAT_Q.service;
  const set = (id: string, v: any) => setAnswers(p=>({...p,[id]:v}));
  if (submitted) return (
    <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:12, padding:32, textAlign:"center" }}>
      <div style={{ fontSize:32, marginBottom:12 }}>✓</div>
      <h3 style={{ fontFamily:FF, fontSize:20, marginBottom:8 }}>Takk fyrir endurgjöfina</h3>
      <p style={{ color:"#64748b", fontSize:14 }}>Svör þín hjálpa okkur að bæta þjónustuna.</p>
      {onClose && <button onClick={onClose} style={{ marginTop:16, padding:"8px 20px", border:"1px solid #d1d5db", borderRadius:8, background:"white", cursor:"pointer", fontSize:13 }}>Loka</button>}
    </div>
  );
  return (
    <div style={{ ...card, overflow:"hidden", padding:0 }}>
      <div style={{ background:"linear-gradient(135deg,#1e293b,#334155)", padding:"20px 24px", color:"white" }}>
        <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, opacity:.7, marginBottom:4 }}>Ánægjukönnun</div>
        <div style={{ fontFamily:FF, fontSize:18 }}>{contextTitle}</div>
      </div>
      <div style={{ padding:24, display:"flex", flexDirection:"column", gap:20 }}>
        {qs.map((q: any)=>(
          <div key={q.id}>
            <label style={{ display:"block", fontWeight:500, fontSize:14, marginBottom:8, color:"#334155" }}>{q.label}</label>
            {q.type==="rating"&&<div style={{ display:"flex", gap:6 }}>{[1,2,3,4,5].map((n: number)=><button key={n} onClick={()=>set(q.id,n)} style={{ width:40, height:40, borderRadius:8, border:answers[q.id]===n?"2px solid #2563eb":"1px solid #d1d5db", background:answers[q.id]===n?"#eff6ff":"white", cursor:"pointer", fontWeight:600, fontSize:15, color:answers[q.id]===n?"#2563eb":"#64748b" }}>{n}</button>)}</div>}
            {q.type==="nps"&&<div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>{[0,1,2,3,4,5,6,7,8,9,10].map((n: number)=><button key={n} onClick={()=>set(q.id,n)} style={{ width:36, height:36, borderRadius:8, border:answers[q.id]===n?"2px solid #2563eb":"1px solid #d1d5db", background:answers[q.id]===n?"#eff6ff":n<=6?"#fef2f2":n<=8?"#fffbeb":"#f0fdf4", cursor:"pointer", fontSize:13, fontWeight:500, color:answers[q.id]===n?"#2563eb":"#64748b" }}>{n}</button>)}</div>}
            {q.type==="text"&&<textarea value={answers[q.id]||""} onChange={e=>set(q.id,e.target.value)} rows={3} placeholder="Frjáls athugasemd..." style={{ width:"100%", borderRadius:8, border:"1px solid #d1d5db", padding:"10px 12px", fontSize:14, resize:"vertical", fontFamily:"inherit", boxSizing:"border-box" }} />}
          </div>
        ))}
        <button onClick={()=>{
          fetch("/api/csat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ context, contextId, contextTitle, answers, ts: new Date().toISOString() }),
          }).catch(() => {});
          setSubmitted(true);
        }} style={{ padding:"12px 24px", background:"#1e293b", color:"white", border:"none", borderRadius:8, fontWeight:600, fontSize:15, cursor:"pointer", alignSelf:"flex-start" }}>Senda svör</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BYRÐING FLOW
   ═══════════════════════════════════════════════════════════════ */
function ByrdingFlow({ flow, onBack }: { flow: any; onBack: () => void }) {
  const [cur,setCur]=useState(0);const [checks,setChecks]=useState<Record<string, boolean>>({});const [showCSAT,setShowCSAT]=useState(false);
  const step=flow.steps[cur];const done=cur>=flow.steps.length;
  const toggle=(si: number, ii: number)=>{const k=`${si}-${ii}`;setChecks(p=>({...p,[k]:!p[k]}));};
  const prog=(si: number)=>{const s=flow.steps[si];const t=s.checklist.length;const d=s.checklist.filter((_: any,i: number)=>checks[`${si}-${i}`]).length;return{d,t};};
  const reqOk=()=>done||step.checklist.every((c: any, i: number)=>!c.required||checks[`${cur}-${i}`]);

  if(done) return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, color:"#64748b", marginBottom:24 }}>← Til baka</button>
      {!showCSAT?(<div style={{ textAlign:"center", padding:"48px 24px" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>✓</div>
        <h2 style={{ fontFamily:FF, fontSize:28, marginBottom:12 }}>Byrðing lokið!</h2>
        <p style={{ color:"#64748b", maxWidth:480, margin:"0 auto 32px", lineHeight:1.6 }}>Frábært — þú hefur lokið öllum undirbúningsskrefum.</p>
        <button onClick={()=>setShowCSAT(true)} style={{ padding:"12px 28px", background:"#1e293b", color:"white", border:"none", borderRadius:8, fontWeight:600, cursor:"pointer" }}>Gefa endurgjöf</button>
      </div>):<CSATWidget context="byrding" contextId={flow.id} contextTitle={flow.title} onClose={onBack} />}
    </div>
  );
  return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, color:"#64748b", marginBottom:24 }}>← Til baka</button>
      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:"#64748b", marginBottom:4 }}>{flow.id} · Byrðing</div>
        <h2 style={{ fontFamily:FF, fontSize:28, color:"#1e293b", marginBottom:4 }}>{flow.title}</h2>
        <p style={{ color:"#64748b" }}>{flow.tagline}</p>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:32 }}>
        {flow.steps.map((s: any, i: number)=>{const p=prog(i);const ic=i===cur;const id=i<cur;return(
          <div key={i} onClick={()=>i<=cur&&setCur(i)} style={{ flex:1, cursor:i<=cur?"pointer":"default", opacity:i>cur?.4:1 }}>
            <div style={{ height:4, borderRadius:2, background:id?"#22c55e":ic?"#2563eb":"#e2e8f0", marginBottom:8 }} />
            <div style={{ fontSize:12, fontWeight:600, color:ic?"#2563eb":id?"#22c55e":"#94a3b8" }}>Skref {i+1}: {s.title}</div>
            <div style={{ fontSize:11, color:"#94a3b8" }}>{p.d}/{p.t}</div>
          </div>
        );})}
      </div>
      <div style={{ ...card, padding:0, overflow:"hidden" }}>
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #e2e8f0" }}>
          <h3 style={{ fontFamily:FF, fontSize:20, marginBottom:4 }}>{step.title}</h3>
          <p style={{ color:"#64748b", fontSize:14 }}>{step.description}</p>
        </div>
        <div style={{ padding:24 }}>
          {step.checklist.map((c: any, i: number)=>{const ch=!!checks[`${cur}-${i}`];return(
            <label key={i} onClick={()=>toggle(cur,i)} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 0", borderBottom:i<step.checklist.length-1?"1px solid #f1f5f9":"none", cursor:"pointer" }}>
              <div style={{ width:22, height:22, borderRadius:6, border:ch?"none":"2px solid #d1d5db", background:ch?"#2563eb":"white", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:"white", fontSize:13 }}>{ch&&"✓"}</div>
              <div><span style={{ fontWeight:500, color:ch?"#94a3b8":"#1e293b", textDecoration:ch?"line-through":"none" }}>{c.item}</span>
              {c.required&&!ch&&<span style={{ display:"inline-block", marginLeft:8, fontSize:10, background:"#fef2f2", color:"#dc2626", padding:"2px 6px", borderRadius:4, fontWeight:600 }}>Nauðsynlegt</span>}</div>
            </label>
          );})}
        </div>
        <div style={{ padding:"16px 24px", background:"#f8fafc", borderTop:"1px solid #e2e8f0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:13, color:"#64748b" }}>{prog(cur).d} af {prog(cur).t} lokið</div>
          <button disabled={!reqOk()} onClick={()=>setCur(cur+1)} style={{ padding:"10px 24px", borderRadius:8, border:"none", fontWeight:600, fontSize:14, cursor:reqOk()?"pointer":"not-allowed", background:reqOk()?"#1e293b":"#e2e8f0", color:reqOk()?"white":"#94a3b8" }}>
            {cur===flow.steps.length-1?"Ljúka byrðingu":"Áfram →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE: Heilsufarsmat (Self-Assessment)
   ═══════════════════════════════════════════════════════════════ */
function HeilsufarsmatPage() {
  const [phase,setPhase]=useState("intro"); // intro | quiz | results
  const [answers,setAnswers]=useState<Record<number, number>>({});
  const [results,setResults]=useState<any>(null);
  const [notes,setNotes]=useState<Record<number, string>>({});
  const [org, setOrg] = useState("");
  const [respondentEmail, setRespondentEmail] = useState("");
  const totalQ=20;
  const answered=Object.keys(answers).length;

  const selectAnswer=(qId: number, val: number)=>{setAnswers(p=>({...p,[qId]:val}));};
  const setNote=(qId: number, txt: string)=>{setNotes(p=>({...p,[qId]:txt}));};

  const calculate=()=>{
    const total=(Object.values(answers) as number[]).reduce((a: number, b: number)=>a+b,0);
    const level=MATURITY_LEVELS.find((l: any)=>total>=l.min&&total<=l.max)||MATURITY_LEVELS[0];
    const dims: any={};
    ASSESSMENT_SECTIONS.forEach((sec: any)=>{
      const score=sec.questions.reduce((s: number, q: any)=>s+(answers[q.id]||0),0);
      const max=sec.questions.length*4;
      dims[sec.key]={name:sec.name,score,max,pct:Math.round((score/max)*100),color:sec.color};
    });
    // Sort dims by score asc for recs
    const sortedDims=Object.entries(dims).sort((a: any, b: any)=>a[1].pct-b[1].pct);
    const recs=sortedDims.slice(0,3).map(([k,d]: [string, any])=>{
      const recMap: any={A:{t:"Ferla- og verkflæðisgreining",b:"Ráðfærst er við ferlaskjölun og skilgreiningu á helstu triggers, stigmögnun og handanfaramódeli."},B:{t:"Gagna- og leitarúttekt",b:"Farið er yfir uppbyggingu gagnasafna, leitarlykla og samþætting við önnur kerfi."},C:{t:"Reglufylgni og öryggisskoðun",b:"Farið er yfir RBAC-uppbyggingu, audit-trail og GDPR-ferla."},D:{t:"Tækniáætlun og gervigreindarmat",b:"Mat á núverandi tæknigrunni og tillögur um næstu skref í sjálfvirkni og AI-samþættingu."}};
      return recMap[k];
    });
    // Insights
    const insights=[];
    if(dims.A.pct<50) insights.push({icon:"⚠",cls:"warn",t:"Ferli og verkflæði þarf endurskoðun",b:"Grunngallar í því hvernig mál ræst og handanfarir eru stjórnaðar."});
    else insights.push({icon:"✓",cls:"ok",t:"Góð grunngeta í ferlum",b:"Grunnverkflæði er komið á en svigrúm er til að sjálfvirknivæða."});
    if(dims.C.pct<50) insights.push({icon:"⚠",cls:"warn",t:"Reglufylgni – áhætta til staðar",b:"Aðgangsheimildir, audit-trail og GDPR-stjórnun þarfnast athygli."});
    else insights.push({icon:"✓",cls:"ok",t:"Reglufylgni á góðum stigi",b:"Aðgangsheimildir og skráningarferlar eru í lagi."});
    if(dims.D.pct<50) insights.push({icon:"ℹ",cls:"info",t:"Tæknigrunngurinn þarf uppfærslu",b:"Kerfið er of fast og erfiðlega aðlaganlegt."});
    else insights.push({icon:"✓",cls:"ok",t:"Sterk tæknigeta",b:"Kerfið er nútímalegt. Næsta skref: nýta grunninn með AI."});

    setResults({total,level,dims,recs,insights,levelIdx:MATURITY_LEVELS.indexOf(level),notes,org,respondentEmail});

    // Send to API
    fetch("/api/heilsufarsmat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, notes, total, level: level.label, dims, org, respondentEmail, ts: new Date().toISOString() }),
    }).catch(() => {}); // fire and forget — don't block results display

    setPhase("results");
  };

  // INTRO
  if(phase==="intro") return (
    <div style={{ textAlign:"center", padding:"40px 24px" }}>
      <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:"#64748b", marginBottom:8 }}>Sjálfsmat · Heilsufarsmat</div>
      <h2 style={{ fontFamily:FF, fontSize:36, color:"#0f172a", marginBottom:12 }}>Hversu þroskuð er málastjórnun þín?</h2>
      <p style={{ color:"#64748b", maxWidth:520, margin:"0 auto 32px", lineHeight:1.7 }}>15 mínútna mat sem gefur þér skýra mynd af þroskaþrepi, veikleikum og forgangsröðun – án skuldbindingar.</p>
      <div style={{ display:"flex", justifyContent:"center", gap:32, marginBottom:40, flexWrap:"wrap" }}>
        {[{n:"15 mín",l:"meðaltími"},{n:"20",l:"spurningar"},{n:"5",l:"þroskaþrep"},{n:"Ókeypis",l:"án skuldbindingar"}].map((s: any, i: number)=>(
          <div key={i} style={{ textAlign:"center" }}>
            <div style={{ fontFamily:FF, fontSize:28, color:"#1e293b" }}>{s.n}</div>
            <div style={{ fontSize:11, color:"#94a3b8", textTransform:"uppercase", letterSpacing:1 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:12, maxWidth:480, margin:"0 auto 24px", flexWrap:"wrap" }}>
        <input
          value={org}
          onChange={e => setOrg(e.target.value)}
          placeholder="Stofnun / fyrirtæki (valfrjálst)"
          style={{ flex:1, minWidth:200, padding:"10px 14px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:14, fontFamily:"inherit", color:"#1e293b" }}
        />
        <input
          value={respondentEmail}
          onChange={e => setRespondentEmail(e.target.value)}
          type="email"
          placeholder="Netfang þátttakanda (valfrjálst)"
          style={{ flex:1, minWidth:200, padding:"10px 14px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:14, fontFamily:"inherit", color:"#1e293b" }}
        />
      </div>
      <p style={{ fontSize:11, color:"#94a3b8", maxWidth:480, margin:"0 auto 24px", textAlign:"center" }}>
        Upplýsingarnar eru eingöngu notaðar til að senda þér niðurstöður. Við deilum þeim ekki með þriðja aðila.
      </p>
      <button onClick={()=>setPhase("quiz")} style={{ padding:"16px 40px", background:"#1e293b", color:"white", border:"none", borderRadius:8, fontWeight:600, fontSize:16, cursor:"pointer" }}>Hefja mat →</button>
    </div>
  );

  // RESULTS
  if(phase==="results"&&results) {
    const { total, level, dims, insights, recs, notes: savedNotes, org: savedOrg, respondentEmail: savedEmail } = results;
    const pct = Math.round((total / 80) * 100);
    const dimsArray = Object.entries(dims).map(([key, d]: [string, any]) => ({
      key,
      name: d.name,
      score: d.score,
      max: d.max,
      pct: d.pct,
      label: d.pct<40?"Veikt":d.pct<60?"Miðlungs":d.pct<80?"Gott":"Sterkt",
    }));

    return (
      <div>
        {/* Light header — matches other pages */}
        <div style={{ marginBottom:32 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 }}>
            <div>
              <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:"#64748b", marginBottom:4 }}>Heilsufarsmat málastjórnunar</div>
              <h2 style={{ fontFamily:FF, fontSize:32, color:"#0f172a", marginBottom:4 }}>Niðurstöður</h2>
              {savedOrg && <p style={{ fontSize:14, color:"#64748b" }}>{savedOrg}</p>}
              <p style={{ fontSize:12, color:"#94a3b8" }}>{new Date().toLocaleDateString("is-IS", { day:"numeric", month:"long", year:"numeric" })}</p>
            </div>
            <button
              onClick={() => window.print()}
              className="no-print"
              style={{ padding:"10px 20px", background:"white", border:"1px solid #e2e8f0", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:500, color:"#475569", display:"flex", alignItems:"center", gap:6 }}
            >
              🖨 Prenta niðurstöður
            </button>
          </div>
        </div>

        {/* Score summary — light card, not dark block */}
        <div style={{ background:"#f8fafc", borderRadius:12, padding:"28px 32px", marginBottom:24, display:"flex", alignItems:"center", gap:32, flexWrap:"wrap" }}>
          <div style={{ textAlign:"center", minWidth:100 }}>
            <div style={{ fontFamily:FF, fontSize:48, color:"#0f172a", lineHeight:1 }}>{total}<span style={{ fontSize:20, color:"#94a3b8" }}>/80</span></div>
            <div style={{ fontSize:12, color:"#94a3b8", marginTop:4 }}>{pct}%</div>
          </div>
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ fontFamily:FF, fontSize:20, color:"#0f172a", marginBottom:4 }}>Þrep: {level.label}</div>
            <p style={{ fontSize:14, color:"#64748b", lineHeight:1.5, marginBottom:12 }}>{level.desc}</p>
            {/* Simple thin gauge */}
            <div style={{ display:"flex", gap:3 }}>
              {MATURITY_LEVELS.map((ml: any, i: number) => (
                <div key={i} style={{ flex:1, height:4, borderRadius:2, background: i <= MATURITY_LEVELS.indexOf(level) ? "#1e293b" : "#e2e8f0" }} />
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
              {MATURITY_LEVELS.map((ml: any, i: number) => (
                <span key={i} style={{ fontSize:9, color: i === MATURITY_LEVELS.indexOf(level) ? "#1e293b" : "#cbd5e1", textTransform:"uppercase", letterSpacing:.5, fontWeight: i === MATURITY_LEVELS.indexOf(level) ? 700 : 400 }}>{ml.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Dimension cards — compact 2x2 grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:32 }}>
          {dimsArray.map((d: any) => (
            <div key={d.key} style={{ background:"white", border:"1px solid #e2e8f0", borderRadius:10, padding:"16px 20px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <span style={{ fontSize:13, fontWeight:500, color:"#334155" }}>{d.key} · {d.name}</span>
                <span style={{ fontSize:12, color:"#64748b", background:"#f1f5f9", padding:"2px 8px", borderRadius:4 }}>{d.label}</span>
              </div>
              <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:6 }}>
                <span style={{ fontFamily:FF, fontSize:24, color:"#0f172a" }}>{d.score}</span>
                <span style={{ fontSize:13, color:"#94a3b8" }}>/20</span>
              </div>
              <div style={{ height:3, background:"#f1f5f9", borderRadius:2 }}>
                <div style={{ height:"100%", width:`${d.pct}%`, background:"#1e293b", borderRadius:2 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Key insights — simple rows */}
        <h3 style={{ fontFamily:FF, fontSize:18, color:"#0f172a", marginBottom:12 }}>Helstu niðurstöður</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:32 }}>
          {insights.map((ins: any, i: number) => (
            <div key={i} style={{ background:"white", border:"1px solid #e2e8f0", borderRadius:8, padding:"12px 16px", display:"flex", gap:12, alignItems:"flex-start" }}>
              <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>{ins.cls === "warn" ? "⚠" : ins.cls === "ok" ? "✓" : "→"}</span>
              <div>
                <strong style={{ fontSize:14, color:"#1e293b" }}>{ins.t}</strong>
                <p style={{ fontSize:13, color:"#64748b", marginTop:2, lineHeight:1.4 }}>{ins.b}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations — numbered action items */}
        <h3 style={{ fontFamily:FF, fontSize:18, color:"#0f172a", marginBottom:12 }}>Forgangsráðleggingar</h3>
        <p style={{ fontSize:13, color:"#64748b", marginBottom:16, lineHeight:1.5 }}>Þessar ráðleggingar eru byggðar á niðurstöðum matsins og miða að því að styrkja þau svið sem mest þurfa á bætingu að halda.</p>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:32 }}>
          {recs.map((r: any, i: number) => (
            <div key={i} style={{ background:"white", border:"1px solid #e2e8f0", borderRadius:10, padding:"16px 20px", display:"flex", gap:16, alignItems:"flex-start" }}>
              <div style={{ width:28, height:28, borderRadius:8, background:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#475569", flexShrink:0 }}>{i + 1}</div>
              <div>
                <strong style={{ fontSize:14, color:"#1e293b", display:"block", marginBottom:2 }}>{r.t}</strong>
                <p style={{ fontSize:13, color:"#64748b", lineHeight:1.5 }}>{r.b}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Notes summary — only if user wrote notes */}
        {savedNotes && Object.values(savedNotes).some((v: any) => v) && (
          <>
            <h3 style={{ fontFamily:FF, fontSize:18, color:"#0f172a", marginBottom:12 }}>Athugasemdir þátttakanda</h3>
            <div style={{ background:"#f8fafc", borderRadius:10, padding:"16px 20px", marginBottom:32 }}>
              {Object.entries(savedNotes).filter(([, v]) => v).map(([qId, text]) => (
                <div key={qId} style={{ marginBottom:8, fontSize:13, color:"#475569", lineHeight:1.5 }}>
                  <span style={{ color:"#94a3b8", fontSize:12 }}>Sp. {qId}: </span>{String(text)}
                </div>
              ))}
            </div>
          </>
        )}

        {/* CTA — light, not dark */}
        <div className="no-print" style={{ background:"#f8fafc", borderRadius:12, padding:"28px 32px", textAlign:"center", marginBottom:32 }}>
          <h3 style={{ fontFamily:FF, fontSize:18, color:"#0f172a", marginBottom:6 }}>Langar þig að ræða þetta nánar?</h3>
          <p style={{ color:"#64748b", fontSize:14, maxWidth:480, margin:"0 auto 20px", lineHeight:1.5 }}>Við bjóðum upp á stuttan, 30 mínútna, endurgjafafund þar sem við förum yfir niðurstöðurnar — án skuldbindingar.</p>
          <a href={`mailto:bjarni@moholt.is?subject=Endurgjafafundur%20-%20Heilsufarsmat${savedOrg ? "%20-%20" + encodeURIComponent(savedOrg) : ""}`} style={{ display:"inline-block", padding:"12px 28px", background:"#1e293b", color:"white", borderRadius:8, fontWeight:600, fontSize:14, textDecoration:"none" }}>Bóka endurgjafafund</a>
        </div>

        {/* Restart */}
        <div className="no-print" style={{ textAlign:"center" }}>
          <button onClick={() => { setPhase("intro"); setAnswers({}); setNotes({}); setOrg(""); setRespondentEmail(""); }} style={{ background:"none", border:"none", color:"#94a3b8", fontSize:13, cursor:"pointer" }}>Taka matið aftur →</button>
        </div>
      </div>
    );
  }

  // QUIZ
  return (
    <div>
      {/* Progress */}
      <div style={{ ...card, padding:"16px 24px", marginBottom:24, display:"flex", alignItems:"center", gap:16, position:"sticky", top:56, zIndex:50 }}>
        <span style={{ fontSize:12, color:"#64748b", textTransform:"uppercase", letterSpacing:1, whiteSpace:"nowrap" }}>Framvinda</span>
        <div style={{ flex:1, height:4, background:"#e2e8f0", borderRadius:2, overflow:"hidden" }}>
          <div style={{ height:"100%", background:"linear-gradient(90deg,#2d5a6b,#c8a96e)", borderRadius:2, transition:"width .3s", width:`${Math.round((answered/totalQ)*100)}%` }} />
        </div>
        <span style={{ fontSize:12, fontWeight:600, color:"#2563eb", minWidth:36, textAlign:"right" }}>{answered}/{totalQ}</span>
      </div>

      {ASSESSMENT_SECTIONS.map((sec: any)=>(
        <div key={sec.key}>
          <div style={{ display:"flex", alignItems:"flex-end", gap:14, marginTop:40, marginBottom:8, paddingBottom:12, borderBottom:"1px solid #e2e8f0" }}>
            <span style={{ fontFamily:FF, fontSize:36, color:"#cbd5e1", lineHeight:1 }}>{sec.key}</span>
            <span style={{ fontFamily:FF, fontSize:20 }}>{sec.name}</span>
          </div>
          <p style={{ fontSize:13, color:"#64748b", marginBottom:24 }}>{sec.desc}</p>
          {sec.questions.map((q: any)=>(
            <div key={q.id} style={{ ...card, marginBottom:12 }}>
              <div style={{ fontSize:11, fontFamily:FF, color:"#94a3b8", letterSpacing:1, marginBottom:8 }}>{String(q.id).padStart(2,"0")} / 20</div>
              <p style={{ fontSize:14, fontWeight:500, marginBottom:16, lineHeight:1.5 }}>{q.text}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {q.opts.map((opt: any, oi: number)=>{const val=oi+1;const sel=answers[q.id]===val;return(
                  <div key={oi}>
                    <div onClick={()=>selectAnswer(q.id,val)} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", border:`1px solid ${sel?"#1e293b":"#e2e8f0"}`, borderRadius:sel&&opt.explain?"4px 4px 0 0":"4px", cursor:"pointer", background:sel?"rgba(30,41,59,.04)":"white", transition:"all .15s" }}>
                      <div style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${sel?"#1e293b":"#d1d5db"}`, background:sel?"#1e293b":"white", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {sel&&<div style={{ width:5, height:5, borderRadius:"50%", background:"white" }} />}
                      </div>
                      <span style={{ fontSize:13, color:"#1e293b", fontWeight:sel?500:300, flex:1 }}>{opt.label}</span>
                    </div>
                    {sel&&opt.explain&&(
                      <div style={{ borderLeft:"1px solid #1e293b", borderRight:"1px solid #1e293b", borderBottom:"1px solid #1e293b", borderRadius:"0 0 4px 4px", overflow:"hidden", animation:"fadeUp .2s ease" }}>
                        <div style={{ padding:"10px 14px 10px 42px", background:"#f8fafc", fontSize:12, color:"#64748b", lineHeight:1.6 }}>
                          {opt.explain}
                        </div>
                        <div style={{ padding:"8px 14px 12px 42px", background:"#f8fafc", borderTop:"1px dashed #e2e8f0" }}>
                          <label style={{ fontSize:11, color:"#94a3b8", display:"block", marginBottom:4 }}>Viltu skýra frekar? <span style={{ fontWeight:300 }}>(valfrjálst)</span></label>
                          <textarea value={notes[q.id]||""} onChange={e=>setNote(q.id,e.target.value)} rows={2} placeholder="T.d. hvaða kerfi er í notkun, sérstakar áskoranir, áætlanir..." style={{ width:"100%", borderRadius:4, border:"1px solid #e2e8f0", padding:"8px 10px", fontSize:12, resize:"vertical", fontFamily:"inherit", boxSizing:"border-box", background:"white", color:"#334155" }} onClick={e=>e.stopPropagation()} />
                        </div>
                      </div>
                    )}
                  </div>
                );})}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div style={{ textAlign:"center", marginTop:40 }}>
        <button disabled={answered<totalQ} onClick={calculate} style={{ padding:"16px 40px", background:answered>=totalQ?"#1e293b":"#e2e8f0", color:answered>=totalQ?"white":"#94a3b8", border:"none", borderRadius:8, fontWeight:600, fontSize:16, cursor:answered>=totalQ?"pointer":"not-allowed" }}>
          Senda inn og sjá niðurstöður
        </button>
        <p style={{ fontSize:12, color:"#94a3b8", marginTop:12 }}>{answered < totalQ ? `Þarf að svara öllum 20 spurningum · ${answered}/20 svöruð` : "Tilbúið – ýttu á hnappinn!"}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE: Um Okkur
   ═══════════════════════════════════════════════════════════════ */
function UmOkkurPage() {
  return (
    <div>
      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:"#64748b", marginBottom:4 }}>Um okkur</div>
        <h2 style={{ fontFamily:FF, fontSize:32, color:"#0f172a", marginBottom:16 }}>Móholt ehf.</h2>
      </div>
      <div style={{ ...card, marginBottom:24 }}>
        <p style={{ fontSize:15, lineHeight:1.8, color:"#334155", marginBottom:16 }}>
          Móholt er með áratuga reynslu á sviði verkefnastjórnunar, málaflokkunar, greiningu ferla, uppbyggingu og innleiðingu málastjórnunarkerfa, þjálfunar o.m.fl. Skýrslugerð og uppbygging framvindumælikvarða er einnig sérgrein félagsins sem og framlenging mála og ferla til borgara eða viðskiptavina.
        </p>
        <p style={{ fontSize:15, lineHeight:1.8, color:"#334155" }}>
          Bjarni Sv. Guðmundsson er stofnandi Móholts og helsti ráðgjafi félagsins. Hann er menntaður í rekstrarfræði og verkefnastjórnun og hefur á löngum ferli öðlast ríka þekkingu í aðstoð við dómstóla, sveitarfélög og aðra hagaðila í málastýringu og umbreytingarverkefnum.
        </p>
      </div>
      <div style={{ ...card }}>
        <h3 style={{ fontFamily:FF, fontSize:18, marginBottom:12 }}>Hafðu samband</h3>
        <p style={{ fontSize:14, color:"#64748b", lineHeight:1.8 }}>
          Bjarni Sv. Guðmundsson<br/>
          Netfang: <a href="mailto:bjarni@moholt.is" style={{ color:"#2563eb" }}>bjarni@moholt.is</a><br/>
          Bæjargil 97, 210 Garðabær<br/>
          Kt. 5509033340<br/>
          Móholt ehf.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE: Persónuverndarstefna
   ═══════════════════════════════════════════════════════════════ */
function PersonuverndPage() {
  return (
    <div>
      <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:"#64748b", marginBottom:4 }}>Lögfræðilegt</div>
      <h2 style={{ fontFamily:FF, fontSize:28, color:"#0f172a", marginBottom:24 }}>Persónuverndarstefna</h2>
      <div style={{ ...card }}>
        <div style={{ fontSize:14, lineHeight:1.8, color:"#334155" }}>
          <p style={{ marginBottom:16 }}><strong>Ábyrgðaraðili:</strong> Móholt ehf., kt. 5509033340, Bæjargil 97, 210 Garðabær.</p>
          <p style={{ marginBottom:16 }}><strong>Hvaða gögn söfnum við?</strong> Þegar þú notar heilsufarsmatið eða sendir okkur fyrirspurn, söfnum við aðeins þeim upplýsingum sem þú veitir sjálf/ur: nafn, netfang og svör við spurningum. Engin persónugreinanleg gögn eru tengd svörum úr heilsufarsmatinu nema þú kjósir sjálf/ur að deila þeim.</p>
          <p style={{ marginBottom:16 }}><strong>Vafrakökur:</strong> Vefsíðan notar aðeins nauðsynlegar vafrakökur til að tryggja virkni. Engar greiningarkökur eru notaðar án samþykkis þíns.</p>
          <p style={{ marginBottom:16 }}><strong>Þriðju aðilar:</strong> Við deilum ekki persónuupplýsingum þínum með þriðju aðilum nema lögskylda krefjist þess.</p>
          <p style={{ marginBottom:16 }}><strong>Réttindi þín:</strong> Þú átt rétt á aðgangi að gögnum þínum, leiðréttingu og eyðingu. Hafðu samband við bjarni@moholt.is.</p>
          <p><strong>Uppfært:</strong> febrúar 2026.</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE: Skilmálar
   ═══════════════════════════════════════════════════════════════ */
function SkilmalarPage() {
  return (
    <div>
      <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:"#64748b", marginBottom:4 }}>Lögfræðilegt</div>
      <h2 style={{ fontFamily:FF, fontSize:28, color:"#0f172a", marginBottom:24 }}>Skilmálar</h2>
      <div style={{ ...card }}>
        <div style={{ fontSize:14, lineHeight:1.8, color:"#334155" }}>
          <p style={{ marginBottom:16 }}><strong>1. Almennir skilmálar.</strong> Þessi vefsíða er rekin af Móholt ehf. Efni vefsíðunnar er eingöngu til upplýsinga og ráðgjöf sem birt er á vefsíðunni felur ekki í sér skuldbindandi tilboð.</p>
          <p style={{ marginBottom:16 }}><strong>2. Þjónustusamningar.</strong> Allir þjónustupakkar og ráðgjafasamningar eru háðir sérstökum samningum sem gerðir eru á milli Móholts og viðskiptavinar. Verð á vefsíðu eru leiðbeinandi.</p>
          <p style={{ marginBottom:16 }}><strong>3. Heilsufarsmat.</strong> Niðurstöður heilsufarsmatið eru leiðbeinandi og byggðar á svörum þínum. Þær fela ekki í sér formlegt mat eða ábyrgð af hálfu Móholts.</p>
          <p style={{ marginBottom:16 }}><strong>4. Hugverkaréttindi.</strong> Allt efni á vefsíðunni er eign Móholt ehf. og er varið af hugverkarétti.</p>
          <p><strong>5. Lög og varnarþing.</strong> Íslensk lög gilda um notkun þessarar vefsíðu. Varnarþing er Héraðsdómur Reykjavíkur.</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE: Vinnustofur (Workshops)
   ═══════════════════════════════════════════════════════════════ */
function VinnustofurPage({ nav }: { nav: (pg: string, p?: string | null) => void }) {
  const [workshop, setWorkshop] = useState<typeof WORKSHOPS[0] | null>(null);
  const [showOrder, setShowOrder] = useState(false);
  const [filter, setFilter] = useState("all");
  const cats = [{id:"all",l:"Allar"},{id:"ai",l:"AI & Greining"},{id:"compliance",l:"Reglufylgni"},{id:"ux",l:"UX & Samþætting"},{id:"advisory",l:"Ráðgjöf"}];
  const list = filter === "all" ? WORKSHOPS : WORKSHOPS.filter((w: any) => w.category === filter);

  if (workshop) return (
    <div>
      <button onClick={() => setWorkshop(null)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, color:"#64748b", marginBottom:24 }}>← Til baka í vinnustofur</button>
      <div style={{ display:"flex", gap:6, marginBottom:8 }}>
        <span style={{ fontSize:11, background:"#f1f5f9", padding:"3px 8px", borderRadius:4, color:"#64748b", fontWeight:600 }}>{workshop.id}</span>
        <span style={{ fontSize:11, background:workshop.color+"18", padding:"3px 8px", borderRadius:4, color:workshop.color, fontWeight:600 }}>{workshop.format}</span>
      </div>
      <h2 style={{ fontFamily:FF, fontSize:32, color:"#0f172a", marginBottom:8 }}>{workshop.title}</h2>
      <p style={{ color:"#64748b", fontSize:16, lineHeight:1.6, maxWidth:600, marginBottom:32 }}>{workshop.description}</p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:32 }}>
        <div style={{ background:"#f8fafc", borderRadius:12, padding:24 }}><div style={{ fontSize:12, color:"#94a3b8", fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Verð</div><div style={{ fontFamily:FF, fontSize:22, color:"#1e293b" }}>{workshop.price}</div></div>
        <div style={{ background:"#f8fafc", borderRadius:12, padding:24 }}><div style={{ fontSize:12, color:"#94a3b8", fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Snið</div><div style={{ fontFamily:FF, fontSize:22, color:"#1e293b" }}>{workshop.format}</div></div>
        <div style={{ background:"#f8fafc", borderRadius:12, padding:24 }}><div style={{ fontSize:12, color:"#94a3b8", fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Hámark</div><div style={{ fontFamily:FF, fontSize:22, color:"#1e293b" }}>{workshop.maxAttendees} þátttak.</div></div>
      </div>

      {/* Agenda */}
      <h3 style={{ fontFamily:FF, fontSize:18, marginBottom:16 }}>Dagskrá</h3>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:32 }}>
        {workshop.agenda.map((a: any, i: number) => (
          <div key={i} style={{ ...card, display:"flex", gap:16, alignItems:"flex-start" }}>
            <div style={{ fontSize:12, fontWeight:600, color:workshop.color, whiteSpace:"nowrap", minWidth:120 }}>{a.time}</div>
            <div><strong style={{ fontSize:14 }}>{a.title}</strong><p style={{ fontSize:13, color:"#64748b", marginTop:4 }}>{a.desc}</p></div>
          </div>
        ))}
      </div>

      {/* Pre-work */}
      <h3 style={{ fontFamily:FF, fontSize:18, marginBottom:16 }}>Undirbúningur þátttakenda</h3>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:32 }}>
        {workshop.prework.map((p: any, i: number) => (
          <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:20, height:20, borderRadius:6, background:workshop.color+"18", color:workshop.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0, marginTop:2 }}>{i+1}</div>
            <span style={{ fontSize:14, color:"#334155", lineHeight:1.5 }}>{p}</span>
          </div>
        ))}
      </div>

      {/* Deliverables */}
      <h3 style={{ fontFamily:FF, fontSize:18, marginBottom:16 }}>Afrakstur</h3>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:32 }}>
        {workshop.deliverables.map((d: any, i: number) => (
          <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <span style={{ color:workshop.color, fontWeight:700, flexShrink:0 }}>✓</span>
            <span style={{ fontSize:14, color:"#334155", lineHeight:1.5 }}>{d}</span>
          </div>
        ))}
      </div>

      {/* Cross-sell to related packages */}
      {workshop.relatedPackages.length > 0 && (
        <div style={{ ...card, background:"#f8fafc", marginBottom:32 }}>
          <h4 style={{ fontFamily:FF, fontSize:16, marginBottom:12 }}>Viltu fara lengra?</h4>
          <p style={{ fontSize:14, color:"#64748b", lineHeight:1.6, marginBottom:16 }}>Þessi vinnustofa er fyrsta skrefið. Ef niðurstöðurnar kalla á djúpri vinnu, þá tengist hún beint í:</p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {workshop.relatedPackages.map((pid: any) => {
              const pkg = SERVICE_PACKAGES.find((p: any) => p.id === pid);
              if (!pkg) return null;
              return (
                <button key={pid} onClick={() => nav("thjonusta", pkg.slug)} style={{ padding:"8px 16px", background:"white", border:"1px solid #e2e8f0", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:500 }}>
                  {pkg.id} · {pkg.title} →
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      {!showOrder ? (
        <div style={{ background:"#1e293b", borderRadius:12, padding:"40px 32px", textAlign:"center", color:"white" }}>
          <h3 style={{ fontFamily:FF, fontSize:20, marginBottom:8 }}>Skráðu þig á vinnustofu</h3>
          <p style={{ color:"rgba(255,255,255,.6)", fontSize:14, maxWidth:480, margin:"0 auto 24px" }}>Hafðu samband og við finnum dagsetningu sem hentar. Vinnustofan er haldin hjá ykkur, með ykkar gögnum.</p>
          <button onClick={() => setShowOrder(true)} style={{ padding:"14px 36px", background:"white", color:"#1e293b", fontFamily:FF, fontSize:15, fontWeight:700, border:"none", borderRadius:4, cursor:"pointer" }}>Skrá mig á vinnustofu</button>
        </div>
      ) : (
        <OrderForm type="workshop" packageId={workshop.id} packageTitle={workshop.title} onClose={() => setShowOrder(false)} showAttendees showDatePreference />
      )}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:"#64748b", marginBottom:4 }}>Vinnustofur</div>
        <h2 style={{ fontFamily:FF, fontSize:32, color:"#0f172a", marginBottom:8 }}>Vinnustofur og námskeið</h2>
        <p style={{ color:"#64748b", maxWidth:520, lineHeight:1.6 }}>Verklegar vinnustofur hjá ykkur, með ykkar gögnum og kerfum. Hvert námskeið er fyrsta skrefið í átt að innleiðingu.</p>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        {cats.map((c: any) => (
          <button key={c.id} onClick={() => setFilter(c.id)} style={{ padding:"6px 16px", borderRadius:20, border:"1px solid", fontSize:13, fontWeight:500, cursor:"pointer", borderColor:filter===c.id?"#2563eb":"#e2e8f0", background:filter===c.id?"#eff6ff":"white", color:filter===c.id?"#2563eb":"#64748b" }}>{c.l}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
        {list.map((w: any) => (
          <div key={w.id} onClick={() => setWorkshop(w)} style={{ ...card, cursor:"pointer" }} onMouseEnter={hoverCard} onMouseLeave={unhoverCard}>
            <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600, marginBottom:12 }}>{w.id}</div>
            <h3 style={{ fontFamily:FF, fontSize:18, color:"#1e293b", marginBottom:6 }}>{w.title}</h3>
            <p style={{ fontSize:13, color:"#64748b", lineHeight:1.5, marginBottom:16 }}>{w.tagline}</p>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:13, fontWeight:600, color:w.color }}>{w.price}</span>
              <span style={{ fontSize:12, color:"#94a3b8" }}>{w.format}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bundle Offers */}
      <div style={{ marginTop:40 }}>
        <h3 style={{ fontFamily:FF, fontSize:20, marginBottom:16 }}>Pakkasérboð</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div style={{ ...card }}>
            <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Byrjendapakki</div>
            <h4 style={{ fontFamily:FF, fontSize:18, color:"#1e293b", marginBottom:8 }}>3 vinnustofur að eigin vali</h4>
            <p style={{ fontSize:14, color:"#64748b", lineHeight:1.6, marginBottom:16 }}>Veldu þrjár vinnustofur og fáðu 20% afslátt. Sameiginlegt lærdómsskjal fylgir.</p>
            <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
              <span style={{ fontFamily:FF, fontSize:22, color:"#1e293b" }}>frá 840.000 ISK</span>
              <span style={{ fontSize:12, color:"#94a3b8", textDecoration:"line-through" }}>1.050.000 ISK</span>
            </div>
            <div style={{ fontSize:12, color:"#059669", fontWeight:600, marginTop:4 }}>20% afsláttur</div>
          </div>
          <div style={{ ...card, border:"1px solid #1e293b", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:12, right:-28, background:"#1e293b", color:"white", fontSize:10, fontWeight:700, padding:"3px 32px", transform:"rotate(45deg)", textTransform:"uppercase", letterSpacing:1 }}>Best</div>
            <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Umbreytingarferðalag</div>
            <h4 style={{ fontFamily:FF, fontSize:18, color:"#1e293b", marginBottom:8 }}>Allar 7 vinnustofur</h4>
            <p style={{ fontSize:14, color:"#64748b", lineHeight:1.6, marginBottom:16 }}>Heildaryfirlit yfir alla þætti. Stjórnendaskýrsla og kynning fylgja.</p>
            <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
              <span style={{ fontFamily:FF, fontSize:22, color:"#1e293b" }}>1.925.000 ISK</span>
              <span style={{ fontSize:12, color:"#94a3b8", textDecoration:"line-through" }}>2.750.000 ISK</span>
            </div>
            <div style={{ fontSize:12, color:"#059669", fontWeight:600, marginTop:4 }}>30% afsláttur</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REMAINING PAGES: Forsíða, Þjónusta, Samningar, Byrðing
   ═══════════════════════════════════════════════════════════════ */

function HomePage({ nav }: { nav: (page: string, param?: string | null) => void }) {
  return (
    <div>
      <div style={{ textAlign:"center", padding:"56px 24px 48px", position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle,rgba(37,99,235,.08) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ fontSize:12, textTransform:"uppercase", letterSpacing:3, color:"#64748b", marginBottom:16 }}>Ráðgjöf · Innleiðing · Stafræn umbreyting</div>
        <h1 style={{ fontFamily:FF, fontSize:42, lineHeight:1.15, color:"#0f172a", maxWidth:600, margin:"0 auto 16px" }}>Stafræn ráðgjöf sem skilar árangri</h1>
        <p style={{ color:"#64748b", maxWidth:520, margin:"0 auto 32px", lineHeight:1.7, fontSize:16 }}>Móholt ehf. veitir sérfræðiráðgjöf á sviði verkefnastjórnunar, málastjórnunar, reglufylgni og stafrænnar umbreytingar — til hins opinbera og einkaaðila.</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={()=>nav("thjonusta")} style={{ padding:"14px 32px", background:"#1e293b", color:"white", border:"none", borderRadius:8, fontWeight:600, fontSize:15, cursor:"pointer" }}>Skoða þjónustu</button>
          <button onClick={()=>nav("heilsufarsmat")} style={{ padding:"14px 32px", background:"#1e293b", color:"white", border:"none", borderRadius:8, fontWeight:600, fontSize:15, cursor:"pointer" }}>Heilsufarsmat</button>
          <button onClick={()=>nav("retainer")} style={{ padding:"14px 32px", background:"#1e293b", color:"white", border:"none", borderRadius:8, fontWeight:600, fontSize:15, cursor:"pointer" }}>Ráðgjafasamningar</button>
        </div>
      </div>
      {/* Package preview */}
      <div style={{ marginBottom:48 }}>
        <h2 style={{ fontFamily:FF, fontSize:24, marginBottom:24 }}>Þjónustupakkar</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
          {SERVICE_PACKAGES.slice(0,4).map((p: any)=>(
            <div key={p.id} onClick={()=>nav("thjonusta",p.slug)} style={{ ...card, cursor:"pointer" }} onMouseEnter={e=>hoverCard(e)} onMouseLeave={unhoverCard}>
              <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600, marginBottom:8 }}>{p.id}</div>
              <h3 style={{ fontFamily:FF, fontSize:18, color:"#1e293b", marginBottom:6 }}>{p.title}</h3>
              <p style={{ fontSize:13, color:"#64748b", lineHeight:1.5, marginBottom:12 }}>{p.tagline}</p>
              <div style={{ fontSize:13, fontWeight:600, color:p.color }}>{p.price}</div>
            </div>
          ))}
        </div>
        <button onClick={()=>nav("thjonusta")} style={{ marginTop:16, padding:"10px 20px", background:"none", border:"1px solid #d1d5db", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:500, color:"#64748b" }}>Sjá alla {SERVICE_PACKAGES.length} pakka →</button>
      </div>

      {/* Free consultation CTA */}
      <div style={{ ...card, background:"#f8fafc", marginBottom:48, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
        <div>
          <h3 style={{ fontFamily:FF, fontSize:18, color:"#1e293b", marginBottom:4 }}>Ekki viss hvar á að byrja?</h3>
          <p style={{ fontSize:14, color:"#64748b", maxWidth:400 }}>Bókaðu ókeypis 15 mínútna símtal þar sem við skoðum stöðuna og mælum með réttri leið — án skuldbindingar.</p>
        </div>
        <a href="mailto:bjarni@moholt.is?subject=Ókeypis ráðgjöf – 15 mín." style={{ padding:"12px 28px", background:"#1e293b", color:"white", borderRadius:8, fontWeight:600, fontSize:14, textDecoration:"none", whiteSpace:"nowrap" }}>Bóka 15 mín. símtal</a>
      </div>

      {/* 3-col feature cards */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
        <div onClick={()=>nav("heilsufarsmat")} style={{ background:"linear-gradient(135deg,#2d5a6b,#1e293b)", borderRadius:12, padding:28, color:"white", cursor:"pointer", transition:"transform .2s" }} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
          <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, opacity:.6, marginBottom:8 }}>Heilsufarsmat</div>
          <h3 style={{ fontFamily:FF, fontSize:18, marginBottom:8 }}>Málastjórnun sjálfsmat</h3>
          <p style={{ fontSize:12, opacity:.7, lineHeight:1.5 }}>20 spurningar · 5 þroskaþrep · Ókeypis</p>
        </div>
        <div onClick={()=>nav("vinnustofur")} style={{ background:"linear-gradient(135deg,#1e293b,#334155)", borderRadius:12, padding:28, color:"white", cursor:"pointer", transition:"transform .2s" }} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
          <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, opacity:.6, marginBottom:8 }}>Vinnustofur</div>
          <h3 style={{ fontFamily:FF, fontSize:18, marginBottom:8 }}>Verklegar vinnustofur</h3>
          <p style={{ fontSize:12, opacity:.7, lineHeight:1.5 }}>7 vinnustofur · Hjá ykkur · Með ykkar gögnum</p>
        </div>
        <div onClick={()=>nav("retainer")} style={{ background:"linear-gradient(135deg,#1e3a5f,#1e293b)", borderRadius:12, padding:28, color:"white", cursor:"pointer", transition:"transform .2s" }} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
          <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, opacity:.6, marginBottom:8 }}>Samningar</div>
          <h3 style={{ fontFamily:FF, fontSize:18, marginBottom:8 }}>Stöðugur stuðningur</h3>
          <p style={{ fontSize:12, opacity:.7, lineHeight:1.5 }}>Mánaðarlegir ráðgjafasamningar</p>
        </div>
      </div>
    </div>
  );
}

function ThjonustuPage({ nav, slug }: { nav: (page: string, param?: string | null) => void; slug: string | null }) {
  const [pkg,setPkg]=useState(slug?SERVICE_PACKAGES.find((p: any)=>p.slug===slug):null);
  const [csat,setCsat]=useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [filter,setFilter]=useState("all");
  const cats=[{id:"all",l:"Allt"},{id:"ai",l:"AI & Greining"},{id:"compliance",l:"Reglufylgni"},{id:"ux",l:"UX & Samþætting"},{id:"advisory",l:"Ráðgjöf"}];
  const list=filter==="all"?SERVICE_PACKAGES:SERVICE_PACKAGES.filter((p: any)=>p.category===filter);

  if(pkg) return (
    <div>
      <button onClick={()=>{setPkg(null);setCsat(false);}} style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, color:"#64748b", marginBottom:24 }}>← Til baka í þjónustu</button>
      <div style={{ display:"flex", gap:6, marginBottom:8 }}>
        <span style={{ fontSize:11, background:"#f1f5f9", padding:"3px 8px", borderRadius:4, color:"#64748b", fontWeight:600 }}>{pkg.id}</span>
        <span style={{ fontSize:11, background:pkg.color+"18", padding:"3px 8px", borderRadius:4, color:pkg.color, fontWeight:600 }}>{pkg.category}</span>
      </div>
      <h2 style={{ fontFamily:FF, fontSize:32, color:"#0f172a", marginBottom:8 }}>{pkg.title}</h2>
      <p style={{ color:"#64748b", fontSize:16, lineHeight:1.6, maxWidth:600, marginBottom:32 }}>{pkg.description}</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:32 }}>
        <div style={{ background:"#f8fafc", borderRadius:12, padding:24 }}><div style={{ fontSize:12, color:"#94a3b8", fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Verð</div><div style={{ fontFamily:FF, fontSize:22, color:"#1e293b" }}>{pkg.price}</div></div>
        <div style={{ background:"#f8fafc", borderRadius:12, padding:24 }}><div style={{ fontSize:12, color:"#94a3b8", fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Tímarammi</div><div style={{ fontFamily:FF, fontSize:22, color:"#1e293b" }}>{pkg.duration}</div></div>
      </div>
      <h3 style={{ fontFamily:FF, fontSize:18, marginBottom:16 }}>Afurðir</h3>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:32 }}>{pkg.deliverables.map((d: any, i: number)=>(<div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}><div style={{ width:20, height:20, borderRadius:6, background:pkg.color+"18", color:pkg.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0, marginTop:2 }}>{i+1}</div><span style={{ fontSize:14, color:"#334155", lineHeight:1.5 }}>{d}</span></div>))}</div>
      <h3 style={{ fontFamily:FF, fontSize:18, marginBottom:16 }}>Verkáfangar</h3>
      <div style={{ display:"flex", gap:0, marginBottom:32 }}>{pkg.phases.map((ph: any, i: number)=>(<div key={i} style={{ flex:1 }}><div style={{ height:4, background:i===0?pkg.color:"#e2e8f0", borderRadius:i===0?"2px 0 0 2px":i===pkg.phases.length-1?"0 2px 2px 0":0 }} /><div style={{ fontSize:12, fontWeight:500, color:"#64748b", marginTop:8, paddingRight:8 }}>{ph}</div></div>))}</div>
      <div style={{ display:"flex", gap:12, marginBottom:32, flexWrap:"wrap" }}>
        <button onClick={() => setShowOrder(!showOrder)} style={{ padding:"12px 24px", background:"#1e293b", color:"white", border:"none", borderRadius:8, fontWeight:600, fontSize:14, cursor:"pointer" }}>
          {showOrder ? "Fela eyðublað" : "Panta þjónustu"}
        </button>
        {BYRDING_FLOWS.find((b: any) => b.forPackages.includes(pkg.id)) && (
          <button onClick={() => { const f = BYRDING_FLOWS.find((b: any) => b.forPackages.includes(pkg.id)); if (f) nav("byrding", f.slug); }} style={{ padding:"12px 24px", background:"white", color:"#64748b", border:"1px solid #d1d5db", borderRadius:8, fontWeight:600, fontSize:14, cursor:"pointer" }}>
            Hefja undirbúning →
          </button>
        )}
      </div>
      {showOrder && (
        <div style={{ marginBottom:32 }}>
          <OrderForm type="service" packageId={pkg.id} packageTitle={pkg.title} onClose={() => setShowOrder(false)} />
        </div>
      )}
      {/* Cross-sell: related workshop */}
      {WORKSHOPS.filter((w: any) => w.relatedPackages.includes(pkg.id)).length > 0 && (
        <div style={{ ...card, background:"#f8fafc", marginBottom:32 }}>
          <h4 style={{ fontFamily:FF, fontSize:16, marginBottom:12 }}>Byrjaðu með vinnustofu</h4>
          <p style={{ fontSize:14, color:"#64748b", lineHeight:1.6, marginBottom:16 }}>Ekki viss um fullan pakka? Prófaðu vinnustofu fyrst – verklegt námskeið sem sýnir gildi þessarar þjónustu.</p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {WORKSHOPS.filter((w: any) => w.relatedPackages.includes(pkg.id)).map((w: any) => (
              <button key={w.id} onClick={() => nav("vinnustofur")} style={{ padding:"8px 16px", background:"white", border:"1px solid #e2e8f0", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:500 }}>
                {w.id} · {w.title} · {w.price} →
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:"#64748b", marginBottom:4 }}>Þjónusta</div>
        <h2 style={{ fontFamily:FF, fontSize:32, color:"#0f172a", marginBottom:8 }}>Þjónustupakkar</h2>
        <p style={{ color:"#64748b", maxWidth:520 }}>Veldu þann pakka sem hentar best. Allir pakkar innihalda AI-aukningu og skýrar afurðir.</p>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>{cats.map((c: any)=>(<button key={c.id} onClick={()=>setFilter(c.id)} style={{ padding:"6px 16px", borderRadius:20, border:"1px solid", fontSize:13, fontWeight:500, cursor:"pointer", borderColor:filter===c.id?"#2563eb":"#e2e8f0", background:filter===c.id?"#eff6ff":"white", color:filter===c.id?"#2563eb":"#64748b" }}>{c.l}</button>))}</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
        {list.map((p: any)=>(<div key={p.id} onClick={()=>setPkg(p)} style={{ ...card, cursor:"pointer" }} onMouseEnter={e=>hoverCard(e)} onMouseLeave={unhoverCard}>
          <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600, marginBottom:12 }}>{p.id}</div>
          <h3 style={{ fontFamily:FF, fontSize:18, color:"#1e293b", marginBottom:6 }}>{p.title}</h3>
          <p style={{ fontSize:13, color:"#64748b", lineHeight:1.5, marginBottom:16 }}>{p.tagline}</p>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}><span style={{ fontSize:13, fontWeight:600, color:p.color }}>{p.price}</span><span style={{ fontSize:12, color:"#94a3b8" }}>{p.duration}</span></div>
        </div>))}
      </div>
    </div>
  );
}

function RetainerPage() {
  const [csatId,setCsatId]=useState(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  return (
    <div>
      <div style={{ marginBottom:32 }}><div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:"#64748b", marginBottom:4 }}>Ráðgjafasamningar</div><h2 style={{ fontFamily:FF, fontSize:32, color:"#0f172a", marginBottom:8 }}>Mánaðarlegir samningar</h2><p style={{ color:"#64748b", maxWidth:520 }}>Stöðugur aðgangur að sérfræðiráðgjöf.</p></div>
      {RETAINERS.map((r: any)=>(<div key={r.id} style={{ marginBottom:40 }}>
        <div style={{ marginBottom:20 }}><h3 style={{ fontFamily:FF, fontSize:22, color:"#1e293b" }}>{r.title}</h3><p style={{ fontSize:13, color:"#64748b" }}>{r.tagline}</p></div>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${r.tiers.length},1fr)`, gap:16, marginBottom:16 }}>{r.tiers.map((t: any, i: number)=>{const pop=i===r.tiers.length-1;return(<div key={i} style={{ ...card, border:pop?"1px solid #1e293b":"1px solid #e2e8f0", position:"relative", overflow:"hidden" }}>{pop&&<div style={{ position:"absolute", top:12, right:-28, background:"#1e293b", color:"white", fontSize:10, fontWeight:700, padding:"3px 32px", transform:"rotate(45deg)", textTransform:"uppercase", letterSpacing:1 }}>Vinsælt</div>}
          <div style={{ fontSize:12, color:"#94a3b8", fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>{t.name}</div>
          <div style={{ fontFamily:FF, fontSize:24, color:"#1e293b", marginBottom:4 }}>{t.price}</div>
          <div style={{ fontSize:13, color:r.color, fontWeight:500, marginBottom:16 }}>{t.hours} klst./mán.</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>{t.features.map((f: any, j: number)=><div key={j} style={{ display:"flex", gap:8, alignItems:"flex-start", fontSize:13, color:"#475569" }}><span style={{ color:r.color, fontWeight:700, flexShrink:0 }}>✓</span>{f}</div>)}</div>
        </div>);})}</div>
        <div style={{ display:"flex", gap:12, marginBottom:16 }}>
          <button onClick={() => setOrderId(orderId === r.id ? null : r.id)} style={{ padding:"8px 16px", background:orderId === r.id ? "#64748b" : "#1e293b", color:"white", border:"none", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600 }}>
            {orderId === r.id ? "Fela" : "Hefja samning"}
          </button>
        </div>
        {orderId === r.id && (
          <div style={{ marginBottom:24 }}>
            <OrderForm type="retainer" packageId={r.id} packageTitle={r.title} onClose={() => setOrderId(null)} />
          </div>
        )}
      </div>))}
      <div style={{ ...card, background:"#f8fafc" }}><h4 style={{ fontFamily:FF, fontSize:16, marginBottom:8 }}>Hvers vegna ráðgjafasamningur?</h4><p style={{ fontSize:14, color:"#64748b", lineHeight:1.6 }}>Samanborið við tímakaup (25.000–35.000 ISK/klst.) sparar samningur 15–30% og tryggir forgangsaðgang og fyrirsjáanlegan kostnað.</p></div>
    </div>
  );
}

function ByrdingPage({ nav, slug }: { nav: (page: string, param?: string | null) => void; slug: string | null }) {
  const [flow,setFlow]=useState(slug?BYRDING_FLOWS.find((b: any)=>b.slug===slug):null);
  if(flow) return <ByrdingFlow flow={flow} onBack={()=>setFlow(null)} />;
  return (
    <div>
      <div style={{ marginBottom:32 }}><div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:"#64748b", marginBottom:4 }}>Byrðing</div><h2 style={{ fontFamily:FF, fontSize:32, color:"#0f172a", marginBottom:8 }}>Undirbúningur verkefna</h2><p style={{ color:"#64748b", maxWidth:520, lineHeight:1.6 }}>Byrðing tryggir að verkefni byrji á réttum grunni.</p></div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>{BYRDING_FLOWS.map((f: any)=>(<div key={f.id} onClick={()=>setFlow(f)} style={{ ...card, cursor:"pointer" }} onMouseEnter={e=>hoverCard(e)} onMouseLeave={unhoverCard}>
        <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600, marginBottom:8 }}>{f.id} · Tengist: {f.forPackages.join(", ")}</div>
        <h3 style={{ fontFamily:FF, fontSize:18, color:"#1e293b", marginBottom:6 }}>{f.title}</h3>
        <p style={{ fontSize:13, color:"#64748b", lineHeight:1.5, marginBottom:12 }}>{f.tagline}</p>
        <div style={{ fontSize:13, color:"#2563eb", fontWeight:500 }}>{f.steps.length} skref · {f.steps.reduce((a: number, s: any)=>a+s.checklist.length,0)} atriði →</div>
      </div>))}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP SHELL
   ═══════════════════════════════════════════════════════════════ */
export default function MoholtApp() {
  const [route,setRoute]=useState("home");
  const [param,setParam]=useState<string | null>(null);
  const [menuOpen,setMenuOpen]=useState(false);
  const nav=useCallback((pg: string, p: string | null = null)=>{setRoute(pg);setParam(p);setMenuOpen(false);window.scrollTo(0,0);window.history.pushState({route:pg,param:p},"",`/${pg==="home"?"":pg}${p?"/"+p:""}`);},[]);

  useEffect(()=>{
    // Read initial route from URL
    const path = window.location.pathname.replace(/^\//, "") || "home";
    const parts = path.split("/");
    const initialRoute = parts[0] || "home";
    const initialParam = parts[1] || null;
    if (initialRoute !== "home") {
      setRoute(initialRoute);
      setParam(initialParam);
    }

    const onPop=(e: PopStateEvent)=>{
      if(e.state){setRoute(e.state.route||"home");setParam(e.state.param||null);}
      else{setRoute("home");setParam(null);}
    };
    window.history.replaceState({route:initialRoute,param:initialParam},"",window.location.pathname);
    window.addEventListener("popstate",onPop);
    return ()=>window.removeEventListener("popstate",onPop);
  },[]);
  const items=[{id:"home",l:"Forsíða"},{id:"thjonusta",l:"Þjónusta"},{id:"vinnustofur",l:"Vinnustofur"},{id:"retainer",l:"Samningar"},{id:"heilsufarsmat",l:"Heilsufarsmat"},{id:"um",l:"Um okkur"}];

  return (
    <div style={{ fontFamily:"'Söhne','Satoshi',-apple-system,BlinkMacSystemFont,sans-serif", background:"#fafafa", minHeight:"100vh", color:"#1e293b" }}>

      <header className="no-print" style={{ background:"white", borderBottom:"1px solid #e2e8f0", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:960, margin:"0 auto", padding:"0 24px", display:"flex", justifyContent:"space-between", alignItems:"center", height:56 }}>
          <div onClick={()=>nav("home")} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
            <img src="/logo.png" alt="Móholt" style={{ height:28 }} />
            <span style={{ fontFamily:FF, fontSize:18, color:"#0f172a" }}>Móholt</span>
          </div>
          {/* Desktop nav */}
          <nav style={{ display:"flex", gap:4 }}>
            {items.map((i: any)=><button key={i.id} onClick={()=>nav(i.id)} style={{ padding:"6px 12px", borderRadius:6, border:"none", background:route===i.id?"#f1f5f9":"transparent", color:route===i.id?"#1e293b":"#64748b", fontWeight:500, fontSize:13, cursor:"pointer" }}>{i.l}</button>)}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth:960, margin:"0 auto", padding:"32px 24px 64px" }}>
        {route==="home"&&<HomePage nav={nav} />}
        {route==="thjonusta"&&<ThjonustuPage nav={nav} slug={param} />}
        {route==="vinnustofur"&&<VinnustofurPage nav={nav} />}
        {route==="heilsufarsmat"&&<HeilsufarsmatPage />}
        {route==="byrding"&&<ByrdingPage nav={nav} slug={param} />}
        {route==="retainer"&&<RetainerPage />}
        {route==="um"&&<UmOkkurPage />}
        {route==="personuvernd"&&<PersonuverndPage />}
        {route==="skilmalar"&&<SkilmalarPage />}
      </main>

      <footer className="no-print" style={{ borderTop:"1px solid #e2e8f0", padding:"32px 24px", background:"white" }}>
        <div style={{ maxWidth:960, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <div>
            <div style={{ fontFamily:FF, fontSize:16, marginBottom:4 }}>Móholt ehf.</div>
            <div style={{ fontSize:12, color:"#94a3b8" }}>Ráðgjöf · Innleiðing · Stafræn umbreyting · Kt. 5509033340</div>
          </div>
          <div style={{ display:"flex", gap:16 }}>
            <span onClick={()=>nav("personuvernd")} style={{ fontSize:12, color:"#64748b", cursor:"pointer", textDecoration:"underline" }}>Persónuverndarstefna</span>
            <span onClick={()=>nav("skilmalar")} style={{ fontSize:12, color:"#64748b", cursor:"pointer", textDecoration:"underline" }}>Skilmálar</span>
          </div>
        </div>
        <div style={{ maxWidth:960, margin:"12px auto 0", fontSize:11, color:"#cbd5e1" }}>© {new Date().getFullYear()} Móholt ehf.</div>
      </footer>

      <CookieBanner />
    </div>
  );
}
