"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const TREASURY =
  process.env.NEXT_PUBLIC_TREASURY_ADDRESS ||
  "21fsnH5cGMoKdN49psbw1dcbD16VW64ziu1nnKPy4NAP";

type VaultData = {
  ok?: boolean;
  solFormatted?: string;
};

export default function DonatePage() {
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState<string>("—");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/vault")
      .then((r) => r.json())
      .then((d: VaultData) => {
        if (!cancelled && d.ok && d.solFormatted) setBalance(d.solFormatted);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(TREASURY);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="wrap donate">
      <Link className="dashboard-back" href="/">
        ← Back
      </Link>
      <p className="block-label">Community vault</p>
      <h1
        style={{
          fontFamily: "var(--serif)",
          fontWeight: 400,
          fontSize: "clamp(28px, 4vw, 40px)",
          letterSpacing: "-0.03em",
          marginBottom: 12,
        }}
      >
        Fuel marketing &amp; airdrops
      </h1>
      <p className="block-text">
        Voluntary support only. Funds are used for marketing and airdrops — not
        an investment product. No yield. No guaranteed returns. Always verify
        the address yourself.
      </p>

      <div className="vault-panel" style={{ maxWidth: 480 }}>
        <div className="vault-panel-top">
          <p className="label">Vault balance</p>
          <span className="live-badge">
            <span className="live-dot" aria-hidden />
            Live
          </span>
        </div>
        <p className="vault-balance">
          <span className="vault-sol">{balance}</span>
          <span className="vault-unit"> SOL</span>
        </p>
        <p className="label" style={{ marginTop: 24 }}>
          Treasury wallet
        </p>
        <p className="addr">{TREASURY}</p>
        <p className="note">
          Only send SOL (or assets you have verified) on Solana. Wrong network
          or token can mean permanent loss. Never share a seed phrase.
        </p>
        <div className="vault-actions">
          <button type="button" className="btn btn-fill" onClick={copyAddress}>
            {copied ? "Copied" : "Copy address"}
          </button>
          <a
            className="btn btn-line"
            href={`https://explorer.solana.com/address/${TREASURY}`}
            target="_blank"
            rel="noreferrer"
          >
            Explorer
          </a>
          <Link className="btn btn-line" href="/spends">
            Spends log
          </Link>
        </div>
      </div>

      <p
        style={{
          marginTop: 36,
          fontSize: 12,
          color: "var(--dim)",
          lineHeight: 1.6,
          maxWidth: 480,
        }}
      >
        Confirm this address through official project channels before sending.
        A page on the internet is not proof by itself.
      </p>
    </main>
  );
}
