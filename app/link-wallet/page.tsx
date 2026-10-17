"use client";

import Script from "next/script";
import { useState } from "react";

type TelegramWebApp = { initData: string; ready: () => void; expand: () => void };
type SolanaProvider = {
  publicKey?: { toString: () => string };
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  signMessage: (message: Uint8Array, display?: "utf8") => Promise<{ signature: Uint8Array }>;
};
declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
    solana?: SolanaProvider;
    phantom?: { solana?: SolanaProvider };
  }
}

export default function LinkWalletPage() {
  const [wallet, setWallet] = useState("");
  const [status, setStatus] = useState("Open this page inside the official COMMUNITY Coin Telegram Web App to verify your Telegram identity.");
  const [busy, setBusy] = useState(false);
  const [verified, setVerified] = useState(false);

  async function linkWallet() {
    const initData = window.Telegram?.WebApp?.initData;
    const provider = window.phantom?.solana ?? window.solana;
    if (!initData) {
      setStatus("Telegram identity is missing. Open this page from the official Telegram Web App; do not paste Telegram data manually.");
      return;
    }
    if (!provider) {
      setStatus("No compatible Solana wallet was detected. Open this page in a browser with Phantom or another compatible wallet installed.");
      return;
    }
    setBusy(true);
    setStatus("Connecting wallet…");
    try {
      const connected = await provider.connect();
      const address = connected.publicKey.toString();
      setWallet(address);
      const challengeResponse = await fetch("/api/wallet/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData, wallet: address }),
      });
      const challenge = await challengeResponse.json();
      if (!challengeResponse.ok) throw new Error(challenge.error || "Could not create wallet challenge.");

      setStatus("Review the verification message in your wallet and sign it. This signs a message only; it does not send funds.");
      const signed = await provider.signMessage(new TextEncoder().encode(challenge.message), "utf8");
      let binary = "";
      for (const byte of signed.signature) binary += String.fromCharCode(byte);
      const signature = btoa(binary);
      const verifyResponse = await fetch("/api/wallet/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData, challengeId: challenge.challengeId, signature }),
      });
      const result = await verifyResponse.json();
      if (!verifyResponse.ok) throw new Error(result.error || "Wallet verification failed.");
      setVerified(true);
      setStatus("Wallet verified and linked to your Telegram account. No funds were moved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Wallet linking failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
    <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" />
    <main className="site-shell">
      <section className="hero-section" style={{ maxWidth: 760, margin: "0 auto", paddingTop: 72 }}>
        <a className="eyebrow" href="/">← COMMUNITY Coin</a>
        <p className="section-kicker" style={{ marginTop: 32 }}>SECURE IDENTITY</p>
        <h1>Link your <span className="gradient-text">wallet.</span></h1>
        <p className="hero-copy">Prove that you control a Solana wallet and connect it to your Telegram account. This process uses a short-lived, single-use signed message. It never asks for your seed phrase or private key and never transfers tokens.</p>
        <div className="feature-card" style={{ marginTop: 32, padding: 28 }}>
          <p className="eyebrow">WALLET STATUS</p>
          <p style={{ overflowWrap: "anywhere", marginTop: 12 }}>{wallet || "No wallet connected yet"}</p>
          <p role="status" aria-live="polite" style={{ marginTop: 20 }}>{status}</p>
          <button className="primary-button" onClick={linkWallet} disabled={busy || verified} style={{ marginTop: 20 }}>
            {busy ? "Verifying…" : verified ? "Wallet verified" : "Connect & verify wallet"}
          </button>
        </div>
        <p className="hero-copy" style={{ fontSize: 14, marginTop: 24 }}>Only sign the message shown for this COMMUNITY Coin domain. Never approve a transaction or share a recovery phrase to link a wallet.</p>
      </section>
    </main>
    </>
  );
}
