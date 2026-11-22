import { Anton, Outfit } from "next/font/google";
import "./globals.css";
import { SITE } from "@/data/site";
import JsonLd from "@/components/JsonLd";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

const TITLE = `${SITE.name} — ${SITE.tagline}`;

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: TITLE, template: `%s | ${SITE.name}` },
  description: SITE.description,
  keywords: SITE.keywords,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_CI",
    url: SITE.url,
    siteName: SITE.name,
    title: TITLE,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: SITE.description },
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: "#E10F1F" };

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${anton.variable} ${outfit.variable}`}>
      <body>
        {children}
        <JsonLd />
      </body>
    </html>
  );
}