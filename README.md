# Móholt ehf. — moholt.is

Consulting website for Móholt ehf. Built with Next.js 15 (App Router) and React 19.

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy to Vercel

```bash
# Push to GitHub first, then:
npx vercel
# Or connect the repo at https://vercel.com/new
```

## Project Structure

```
moholt-web/
├── app/
│   ├── layout.tsx          # Root layout, SEO metadata, fonts
│   ├── page.tsx            # Home page (renders client app)
│   ├── globals.css         # Global styles + animations
│   └── api/
│       ├── csat/route.ts          # CSAT survey endpoint
│       └── heilsufarsmat/route.ts # Assessment results endpoint
├── components/
│   └── MoholtApp.tsx       # Full client application
├── lib/
│   └── data.ts             # All data: packages, retainers, assessment questions
└── public/                 # Static assets (add logo here)
```

## Features

- **Heilsufarsmat** — 20-question maturity assessment with scoring, insights, recommendations, and free-text notes
- **Þjónustupakkar** — VP01–VP04 (Hugvit), M01–M03 (Móholt) with detail pages
- **Ráðgjafasamningar** — R01–R02 retainer tiers
- **Byrðing** — B01–B02 onboarding checklists
- **CSAT** — Contextual satisfaction surveys
- **Legal** — Persónuverndarstefna, Skilmálar, Cookie consent
- **SEO** — Metadata, Open Graph, structured for is_IS locale

## TODO

- [ ] Add Móholt logo to `/public/` and update header
- [ ] Connect CSAT/Heilsufarsmat APIs to storage (Google Sheets / Supabase)
- [ ] Enable Plausible analytics (uncomment in layout.tsx)
- [ ] Add workshops (vinnustofur) section
- [ ] Custom domain: moholt.is
- [ ] Migrate to file-based routing for individual pages (optional)

## Contact

Bjarni Sv. Guðmundsson  
bjarni@moholt.is  
Kt. 5509033340
