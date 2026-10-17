import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COMMUNITY Coin — One Community. One Billion-Dollar Vision.",
  description:
    "Community-powered Solana project. Together we grow. Together we make history.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://community-coinm.vercel.app"
  ),
  openGraph: {
    title: "COMMUNITY Coin",
    description: "One community. One billion-dollar vision.",
    type: "website",
  },
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
