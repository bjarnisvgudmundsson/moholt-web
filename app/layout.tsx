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
      <body>{children}</body>
    </html>
  );
}
