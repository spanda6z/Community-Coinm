"use client";
import { useEffect, useState } from "react";

type Proposal = { id: string; title: string; description: string; status: string; createdAt: string; endsAt: string | null; voteCount: number };
export default function GovernancePage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const [message, setMessage] = useState("");
  useEffect(() => {
    let alive = true;
    fetch("/api/proposals", { cache: "no-store" }).then(async r => ({ ok: r.ok, data: await r.json() })).then(({ok,data}) => {
      if (!alive) return;
      setProposals(data.proposals ?? []);
      setMessage(data.message ?? "");
      setStatus(ok && data.configured ? "ready" : "unavailable");
    }).catch(() => { if (alive) { setStatus("unavailable"); setMessage("Governance data could not be loaded."); } });
    return () => { alive = false; };
  }, []);
  return <main className="shell dashboard governance-page">
    <a className="dashboard-back" href="/">← Back to home</a>
    <div className="section-kicker"><span>COMMUNITY COIN / GOVERNANCE</span><span>COMMUNITY SIGNAL</span></div>
    <h1>Make your voice <em>count.</em></h1>
    <p className="dashboard-intro">Explore community proposals and discussions. Any displayed poll counts are informational until voting identity and eligibility are verified.</p>
    {status === "loading" ? <div className="data-panel">Loading community proposals…</div> : status === "unavailable" ? <div className="data-panel empty-state"><span className="empty-icon">◎</span><h2>Governance is being connected</h2><p>{message || "Connect the database to load real proposals. We do not fill this page with fake votes or made-up community decisions."}</p><a className="button button-dark" href="https://github.com/spanda6z/Community-Coinm">Follow development ↗</a></div> : proposals.length === 0 ? <div className="data-panel empty-state"><span className="empty-icon">◎</span><h2>No proposals yet</h2><p>The governance database is connected, but there are no proposals published yet.</p></div> : <div className="proposal-list">{proposals.map(p=><article className="proposal-card" key={p.id}><div className="proposal-meta"><span>{p.status.toUpperCase()}</span><span>{p.voteCount} recorded votes</span></div><h2>{p.title}</h2><p>{p.description}</p>{p.endsAt && <small>Closes {new Date(p.endsAt).toLocaleString()}</small>}</article>)}</div>}
    <p className="dashboard-foot">Community polls are not authorization to move treasury funds. Treasury spending requires independent multisig approval.</p>
  </main>;
}
