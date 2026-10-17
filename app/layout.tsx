import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://community-coinm.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "COMMUNITY Coin — Community-owned on Solana",
    template: "%s · COMMUNITY Coin",
  },
  description:
    "Community-owned Solana project. Vault funds marketing and airdrops. No CEO. No yield. Holders build the culture.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "COMMUNITY Coin",
    description:
      "Community-owned on Solana. Vault → marketing & airdrops. No CEO. No yield.",
    type: "website",
    url: siteUrl,
    siteName: "COMMUNITY Coin",
  },
  twitter: {
    card: "summary_large_image",
    title: "COMMUNITY Coin",
    description:
      "Community-owned on Solana. Vault → marketing & airdrops. No CEO. No yield.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
