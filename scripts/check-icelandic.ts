/**
 * Icelandic Language QA Script
 * Extracts all Icelandic text from lib/data.ts and checks via yfirlestur.is API
 *
 * Usage: npm run check-icelandic
 */

const API_URL = "https://yfirlestur.is/correct.api";

interface Annotation {
  start: number;
  end: number;
  code: string;
  text: string;
  suggest: string;
  detail: string;
}

interface Result {
  original: string;
  annotations: Annotation[];
}

async function checkText(text: string): Promise<Result> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `text=${encodeURIComponent(text)}&format=text`,
  });
  const data = await res.json();
  return {
    original: text,
    annotations: data.result?.flatMap((p: any) =>
      (p[1] || []).map((a: any) => ({
        start: a[0],
        end: a[1],
        code: a[2],
        text: a[3],
        suggest: a[4],
        detail: a[5] || "",
      }))
    ) || [],
  };
}

async function main() {
  // Import all text content from data.ts
  const { ASSESSMENT_SECTIONS, SERVICE_PACKAGES, WORKSHOPS, RETAINERS, MATURITY_LEVELS } = await import("../lib/data");

  const texts: Array<{ source: string; text: string }> = [];

  // Assessment questions and options
  for (const section of ASSESSMENT_SECTIONS) {
    texts.push({ source: `Assessment.${section.key}.name`, text: section.name });
    texts.push({ source: `Assessment.${section.key}.desc`, text: section.desc });
    for (const q of section.questions) {
      texts.push({ source: `Assessment.${section.key}.${q.id}`, text: q.text });
      for (const opt of q.opts) {
        texts.push({ source: `Assessment.${section.key}.${q.id}.opt`, text: opt.label });
        if (opt.explain) texts.push({ source: `Assessment.${section.key}.${q.id}.explain`, text: opt.explain });
      }
    }
  }

  // Service packages
  for (const pkg of SERVICE_PACKAGES) {
    texts.push({ source: `Package.${pkg.id}.title`, text: pkg.title });
    texts.push({ source: `Package.${pkg.id}.tagline`, text: pkg.tagline });
  }

  // Workshops
  for (const w of WORKSHOPS) {
    texts.push({ source: `Workshop.${w.id}.title`, text: w.title });
    texts.push({ source: `Workshop.${w.id}.tagline`, text: w.tagline });
    texts.push({ source: `Workshop.${w.id}.desc`, text: w.description });
    for (const d of w.deliverables) texts.push({ source: `Workshop.${w.id}.deliverable`, text: d });
    for (const p of w.prework) texts.push({ source: `Workshop.${w.id}.prework`, text: p });
  }

  console.log(`\n🇮🇸 Yfirlestur.is QA — Checking ${texts.length} text segments...\n`);

  let errorCount = 0;
  for (const item of texts) {
    const result = await checkText(item.text);
    if (result.annotations.length > 0) {
      errorCount += result.annotations.length;
      console.log(`⚠ ${item.source}`);
      console.log(`  "${item.text}"`);
      for (const a of result.annotations) {
        console.log(`  → ${a.code}: "${a.text}" → suggestion: "${a.suggest}" ${a.detail}`);
      }
      console.log();
    }
    // Rate limit: wait 200ms between calls
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n${"═".repeat(50)}`);
  console.log(`Checked: ${texts.length} segments`);
  console.log(`Issues found: ${errorCount}`);
  console.log(`${"═".repeat(50)}\n`);
}

main().catch(console.error);
