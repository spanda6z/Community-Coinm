import Link from "next/link";
import { VAULT_SPENDS } from "../../lib/vault-spends";

const TREASURY =
  process.env.NEXT_PUBLIC_TREASURY_ADDRESS ||
  "21fsnH5cGMoKdN49psbw1dcbD16VW64ziu1nnKPy4NAP";

export const metadata = {
  title: "Vault spends — COMMUNITY Coin",
  description: "Public log of community vault spends for marketing and airdrops.",
};

export default function SpendsPage() {
  return (
    <main className="wrap" style={{ paddingTop: 48, paddingBottom: 80 }}>
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
        Vault spends
      </h1>
      <p className="block-text">
        Every meaningful spend from the treasury should appear here — marketing
        and airdrops only. Voluntary deposits. No yield.
      </p>

      <p style={{ fontSize: 12, color: "var(--dim)", marginBottom: 28 }}>
        Treasury:{" "}
        <a
          href={`https://explorer.solana.com/address/${TREASURY}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: "var(--muted)", borderBottom: "1px solid #333" }}
        >
          {TREASURY.slice(0, 8)}…{TREASURY.slice(-6)}
        </a>
      </p>

      {VAULT_SPENDS.length === 0 ? (
        <div className="meme-teaser">
          <h3>No spends logged yet</h3>
          <p>
            When the vault pays for marketing or an airdrop, the entry and tx
            link will show up here.
          </p>
          <Link href="/treasury" className="btn btn-fill">
            On-chain activity
          </Link>
        </div>
      ) : (
        <div className="spends-list">
          {VAULT_SPENDS.map((s) => (
            <article key={s.id} className="spend-row">
              <div className="spend-meta">
                <span className="spend-date">{s.date}</span>
                <span className={`spend-tag tag-${s.category}`}>{s.category}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.detail}</p>
              <div className="spend-foot">
                <span className="spend-amt">{s.amountLabel}</span>
                {s.txUrl ? (
                  <a href={s.txUrl} target="_blank" rel="noreferrer">
                    View tx →
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
