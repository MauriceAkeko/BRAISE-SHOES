import { Anton, Outfit } from "next/font/google";
import "./globals.css";
import { SITE } from "@/data/site";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
};

export const viewport = { themeColor: "#E10F1F" };

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${anton.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}