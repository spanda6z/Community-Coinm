"use client";
import { useEffect, useState } from "react";
type TreasuryData = { configured?: boolean; treasuryAddress?: string; activity?: { signature: string; direction: string; asset: string; amount: string; confirmedAt: string }[]; message?: string };
export default function TreasuryPage() {
  const [data,setData]=useState<TreasuryData|null>(null);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{let alive=true;fetch("/api/treasury",{cache:"no-store"}).then(async r=>({ok:r.ok,data:await r.json()})).then(({data})=>{if(alive)setData(data)}).catch(()=>{if(alive)setData({message:"Treasury data could not be loaded."})}).finally(()=>{if(alive)setLoading(false)});return()=>{alive=false}},[]);
  const short=(s:string)=>s.length>22?s.slice(0,10)+"…"+s.slice(-8):s;
  return <main className="shell dashboard">
    <a className="dashboard-back" href="/">← Back to home</a>
    <div className="section-kicker"><span>COMMUNITY COIN / TREASURY</span><span>PUBLIC TRANSPARENCY</span></div>
    <h1>Every movement.<br/><em>Accounted for.</em></h1>
    <p className="dashboard-intro">A public view of community treasury activity. This page will only show transactions retrieved from verified on-chain sources.</p>
    {loading?<div className="data-panel">Loading treasury status…</div>:<div className="data-panel empty-state"><span className="empty-icon">◈</span><h2>{data?.treasuryAddress?"Indexer not connected":"Treasury not configured"}</h2><p>{data?.message||"A verified multisig treasury address and transaction indexer are required before balances or transfers can be shown."}</p>{data?.treasuryAddress&&<p className="mint-address">{short(data.treasuryAddress)}</p>}<a className="button button-dark" href="https://explorer.solana.com/" target="_blank" rel="noreferrer">Open Solana Explorer ↗</a></div>}
    <p className="dashboard-foot">Treasury funds should be controlled by a multisig. A community vote alone never executes a transfer.</p>
  </main>;
}
