import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'COMMUNITY Coin — A movement, not a one-man coin',
  description: 'A community-first Solana project built on transparency, participation, and shared momentum.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
