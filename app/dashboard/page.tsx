"use client";

import { useEffect, useState } from "react";

type TokenData = {
  configured?: boolean;
  message?: string;
  mint?: string;
  supply?: { amount: string; decimals: number; uiAmount: string | null };
  largestAccounts?: { address: string; amount: string; uiAmount: string | null }[];
  source?: string;
  fetchedAt?: string;
  note?: string;
  error?: string;
};

export default function Dashboard() {
  const [data, setData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    fetch("/api/token", { cache: "no-store" })
      .then(async (r) => ({ ok: r.ok, body: await r.json() }))
      .then(({ body }) => { if (alive) setData(body); })
      .catch(() => { if (alive) setData({ error: "Could not reach the token data API." }); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);
  const short = (value: string) => value.length > 18 ? value.slice(0, 8) + "…" + value.slice(-7) : value;
  return <main className="dashboard shell">
    <a className="dashboard-back" href="/">← Back to home</a>
    <div className="section-kicker"><span>COMMUNITY COIN / ON-CHAIN DATA</span><span>READ-ONLY DASHBOARD</span></div>
    <h1>Proof over <em>promises.</em></h1>
    <p className="dashboard-intro">Read-only data retrieved from the configured Solana RPC. This page never asks for a seed phrase or private key.</p>
    {loading ? <div className="data-panel">Loading verified on-chain data…</div> : data?.supply ? <>
      <div className="dashboard-cards">
        <article className="data-panel"><span>Total token supply</span><strong>{Number(data.supply.uiAmount ?? 0).toLocaleString(undefined,{maximumFractionDigits: data.supply.decimals})}</strong><small>Token decimals: {data.supply.decimals}</small></article>
        <article className="data-panel"><span>Token mint</span><strong className="mint-address">{short(data.mint ?? "")}</strong><small>{data.mint}</small></article>
        <article className="data-panel"><span>Data source</span><strong>{data.source}</strong><small>Commitment: confirmed</small></article>
      </div>
      <section className="holders-panel"><div className="holders-title"><h2>Largest token accounts</h2><span>{data.largestAccounts?.length ?? 0} accounts</span></div><p className="dashboard-muted">Largest accounts are not the same as unique holders. Exchange wallets and token authorities may hold balances for many people.</p><div className="account-list">{(data.largestAccounts ?? []).map((a,i)=><div className="account-row" key={a.address}><span className="account-rank">{String(i+1).padStart(2,"0")}</span><code>{a.address}</code><strong>{Number(a.uiAmount ?? 0).toLocaleString(undefined,{maximumFractionDigits: data.supply!.decimals})}</strong><a href={`https://explorer.solana.com/address/${a.address}`} target="_blank" rel="noreferrer" aria-label="View account in Solana Explorer">↗</a></div>)}</div></section>
      <p className="data-updated">Last fetched: {data.fetchedAt ? new Date(data.fetchedAt).toLocaleString() : "just now"}</p>
    </> : <div className="data-panel empty-state"><span className="empty-icon">◈</span><h2>{data?.error ? "Data temporarily unavailable" : "On-chain data is not connected yet"}</h2><p>{data?.error ?? data?.message ?? "Set a verified token mint and Solana RPC endpoint to activate this dashboard. We won't display made-up numbers."}</p><a className="button button-dark" href="https://explorer.solana.com/" target="_blank" rel="noreferrer">Open Solana Explorer ↗</a></div>}
    <footer className="dashboard-foot">Independent read-only view. Always verify addresses on an official explorer before sending funds.</footer>
  </main>;
}
