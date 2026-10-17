"use client";
import { useEffect, useState } from "react";

type Activity = { signature: string; direction: string; amount: string; confirmedAt: string | null; explorerUrl: string };
type Data = { configured?: boolean; treasuryAddress?: string; activity?: Activity[]; message?: string; note?: string };

export default function TreasuryPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    fetch("/api/treasury", { cache: "no-store" })
      .then(r => r.json())
      .then(value => { if (active) setData(value); })
      .catch(() => { if (active) setData({ message: "Treasury data could not be loaded." }); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return (
    <main className="shell dashboard">
      <a className="dashboard-back" href="/">← Back to home</a>
      <div className="section-kicker"><span>COMMUNITY COIN / TREASURY</span><span>PUBLIC TRANSPARENCY</span></div>
      <h1>Every movement.<br /><em>Accounted for.</em></h1>
      <p className="dashboard-intro">Recent confirmed native SOL balance changes observed on Solana. SPL token transfers and multisig approvals are not yet indexed.</p>
      {loading ? <div className="data-panel">Loading treasury activity…</div> :
        !data?.configured || data.message ? (
          <div className="data-panel empty-state">
            <h2>{data?.configured ? "Treasury data unavailable" : "Treasury not configured"}</h2>
            <p>{data?.message || "Set a verified treasury address and Solana RPC endpoint to show confirmed activity."}</p>
          </div>
        ) : (
          <>
            <div className="data-panel">
              <p className="eyebrow">CONFIGURED TREASURY ADDRESS</p>
              <p className="mint-address" style={{ overflowWrap: "anywhere" }}>{data.treasuryAddress}</p>
              <a className="button button-dark" href={"https://explorer.solana.com/address/" + data.treasuryAddress} target="_blank" rel="noreferrer">View address on Explorer ↗</a>
            </div>
            <div className="section-kicker" style={{ marginTop: 28 }}><span>RECENT ACTIVITY</span><span>{data.activity?.length || 0} NET SOL MOVEMENTS</span></div>
            {data.activity?.length ? (
              <div className="proposal-list">{data.activity.map(item => (
                <article className="proposal-card" key={item.signature}>
                  <div className="proposal-meta"><span>{item.direction === "in" ? "INCOMING" : "OUTGOING"}</span><span>{item.confirmedAt ? new Date(item.confirmedAt).toLocaleString() : "Time unavailable"}</span></div>
                  <h2>{item.direction === "in" ? "+" : "−"}{item.amount} SOL</h2>
                  <p className="mint-address">{item.signature.slice(0, 10)}…{item.signature.slice(-8)}</p>
                  <a href={item.explorerUrl} target="_blank" rel="noreferrer">View transaction ↗</a>
                </article>
              ))}</div>
            ) : <div className="data-panel empty-state"><h2>No net SOL movements found</h2><p>No confirmed native SOL balance changes were found in the recent transactions queried.</p></div>}
            <p className="dashboard-foot">{data.note} Independently verify that this address is the official community treasury.</p>
          </>
        )}
    </main>
  );
}
