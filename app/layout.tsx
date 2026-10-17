import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COMMUNITY Coin — Built Together",
  description: "A community-powered Solana project. Community first, transparency always.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://community-coin.example"),
  openGraph: { title: "COMMUNITY Coin — Built Together", description: "Not a one-man coin. A community movement.", type: "website" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
