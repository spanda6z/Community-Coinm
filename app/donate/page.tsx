"use client";
import { useState } from "react";

const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS || "";

export default function DonatePage() {
  const [copied, setCopied] = useState(false);
  async function copyAddress() {
    if (!treasuryAddress) return;
    try {
      await navigator.clipboard.writeText(treasuryAddress);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return (
    <main className="shell dashboard">
      <a className="dashboard-back" href="/">← Back to home</a>
      <div className="section-kicker"><span>COMMUNITY COIN / DONATIONS</span><span>VOLUNTARY SUPPORT</span></div>
      <h1>Build it <em>together.</em></h1>
      <p className="dashboard-intro">Contributions are voluntary. Check the destination address independently before sending anything. This page never asks for your recovery phrase or private key.</p>
      {treasuryAddress ? (
        <section className="data-panel">
          <p className="eyebrow">CONFIGURED TREASURY ADDRESS</p>
          <p className="mint-address" style={{ overflowWrap: "anywhere" }}>{treasuryAddress}</p>
          <button className="button button-dark" onClick={copyAddress}>{copied ? "Address copied" : "Copy address"}</button>
          <p style={{ marginTop: 16 }}>Only send an asset on a network you have independently verified. Sending the wrong token or using the wrong network can result in permanent loss.</p>
          <a href={"https://explorer.solana.com/address/" + treasuryAddress} target="_blank" rel="noreferrer">Inspect address on Solana Explorer ↗</a>
        </section>
      ) : (
        <section className="data-panel empty-state">
          <h2>Donations are not configured</h2>
          <p>No treasury address is published here because the project has not configured one. Do not send funds to an address shared in unofficial messages.</p>
        </section>
      )}
      <p className="dashboard-foot">A displayed address is not proof of official ownership. Confirm the official address through multiple trusted project channels before donating. Community polls do not authorize treasury spending; use of funds should be governed by independent multisig controls.</p>
    </main>
  );
}
