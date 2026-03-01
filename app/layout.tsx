import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Móholt ehf. — Stafræn ráðgjöf sem skilar árangri",
    template: "%s | Móholt ehf.",
  },
  description: "Sérfræðiráðgjöf á sviði verkefnastjórnunar, málastjórnunar, reglufylgni og stafrænnar umbreytingar — til hins opinbera og einkaaðila.",
  metadataBase: new URL("https://moholt.is"),
  openGraph: {
    type: "website",
    locale: "is_IS",
    siteName: "Móholt ehf.",
    title: "Móholt ehf. — Stafræn ráðgjöf sem skilar árangri",
    description: "Ráðgjöf · Innleiðing · Stafræn umbreyting",
    images: [{ url: "https://moholt.is/og-image.png", width: 1200, height: 630, alt: "Móholt ehf." }],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="is">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap"
          rel="stylesheet"
        />
        {/* Analytics: uncomment when ready
        <script defer data-domain="moholt.is" src="https://plausible.io/js/script.js"></script>
        */}
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Móholt ehf.",
              url: "https://moholt.is",
              logo: "https://moholt.is/logo.png",
              description: "Sérfræðiráðgjöf á sviði verkefnastjórnunar, málastjórnunar, reglufylgni og stafrænnar umbreytingar.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Bæjargil 97",
                addressLocality: "Garðabær",
                postalCode: "210",
                addressCountry: "IS",
              },
              email: "bjarni@moholt.is",
              founder: {
                "@type": "Person",
                name: "Bjarni Sv. Guðmundsson",
                jobTitle: "Framkvæmdastjóri",
              },
              areaServed: [
                { "@type": "Country", name: "Iceland" },
                { "@type": "Country", name: "United Kingdom" },
              ],
              knowsAbout: [
                "Case Management Systems",
                "ISO 27001",
                "GDPR Compliance",
                "Digital Transformation",
                "Legal Technology",
                "Court Technology",
                "AI Implementation",
                "Process Optimization",
                "Project Governance",
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Þjónustupakkar",
                itemListElement: [
                  { "@type": "Offer", name: "Gervigreind & Greining", description: "AI-knúnar lausnir fyrir málastjórnunarkerfi" },
                  { "@type": "Offer", name: "Reglufylgni & Stjórnun", description: "ISO 27001, GDPR og innri stjórnun" },
                  { "@type": "Offer", name: "Upplifun & Samþætting", description: "Notendamiðuð hönnun og kerfissamþætting" },
                  { "@type": "Offer", name: "Ráðgjöf & Stefnumótun", description: "Stefnumiðuð ráðgjöf fyrir stafræna umbreytingu" },
                ],
              },
            }).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
