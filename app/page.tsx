import Link from "next/link";
import { VAULT_SPENDS } from "../lib/vault-spends";

const TREASURY =
  process.env.NEXT_PUBLIC_TREASURY_ADDRESS ||
  "21fsnH5cGMoKdN49psbw1dcbD16VW64ziu1nnKPy4NAP";

const TELEGRAM =
  process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/communitycoinchatt";
const X_URL =
  process.env.NEXT_PUBLIC_X_URL || "https://x.com/communitycoin14";

const BANNER =
  "https://cdn.phototourl.com/member/2026-10-17-1a5f940e-5861-4ed4-a043-b066d11a5d98.jpg";

export default function Home() {
  const mint = process.env.NEXT_PUBLIC_TOKEN_MINT;
  const recentSpends = VAULT_SPENDS.slice(0, 3);

  return (
    <main>
      <nav className="nav wrap">
        <Link className="logo" href="/">
          community<span>coin</span>
        </Link>
        <div className="nav-links">
          <a href="#vault">Vault</a>
          <a href="#telegram">Telegram</a>
          <a href="#memes">Memes</a>
          <a href="#transparency">On-chain</a>
        </div>
        <a className="nav-cta" href={TELEGRAM} target="_blank" rel="noreferrer">
          Join
        </a>
      </nav>

      <section className="hero wrap">
        <div className="hero-img">
          <img src={BANNER} alt="COMMUNITY COIN" />
        </div>
        <p className="hero-kicker">Community-owned · Solana</p>
        <h1>
          One community.
          <br />
          <em>One billion-dollar vision.</em>
        </h1>
        <p className="hero-lead">
          Holders make the culture. The vault funds the push — marketing and
          airdrops only.
        </p>
        <div className="hero-actions">
          <a className="btn btn-fill" href={TELEGRAM} target="_blank" rel="noreferrer">
            Join the movement
          </a>
          <a className="btn btn-line" href="#vault">
            Fuel marketing &amp; airdrops
          </a>
        </div>
      </section>

      <hr className="rule" />

      <section className="statement wrap">
        <p>
          Community-owned on Solana. No CEO. No private allocation. Vault →
          marketing &amp; airdrops. No yield.
        </p>
        <span>Verify everything on-chain</span>
      </section>

      <hr className="rule" />

      <section className="block wrap" id="vault">
        <p className="block-label">Community vault</p>
        <h2>Fuel marketing &amp; airdrops.</h2>
        <p className="block-text">
          Treasury funds pay for growth and community rewards — not salaries in
          the dark. Contributions are voluntary. Not an investment product. No
          yield.
        </p>

        <div className="split-wide">
          <div>
            <div className="rows">
              <div className="row">
                <span className="row-num">01</span>
                <div>
                  <h3>Marketing</h3>
                  <p>
                    Raids, content, creators, and visibility so more people find
                    the community.
                  </p>
                </div>
              </div>
              <div className="row">
                <span className="row-num">02</span>
                <div>
                  <h3>Airdrops</h3>
                  <p>
                    Distributions to active holders and contributors who show
                    up.
                  </p>
                </div>
              </div>
              <div className="row">
                <span className="row-num">03</span>
                <div>
                  <h3>Public spends</h3>
                  <p>
                    Meaningful spends are logged with context. On-chain txs stay
                    verifiable.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="vault-panel">
            <p className="label">Treasury wallet</p>
            <p className="addr">{TREASURY}</p>
            <p className="note">
              Marketing &amp; airdrops only. Voluntary. No yield. No guaranteed
              returns.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a
                className="btn btn-fill"
                href={`https://explorer.solana.com/address/${TREASURY}`}
                target="_blank"
                rel="noreferrer"
              >
                View on Explorer
              </a>
              <Link className="btn btn-line" href="/spends">
                Vault spends log
              </Link>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 48 }}>
          <p className="block-label">Recent spends</p>
          {recentSpends.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
              No spends logged yet. When the vault pays for marketing or an
              airdrop, it will be listed here and on the{" "}
              <Link href="/spends" style={{ borderBottom: "1px solid #444" }}>
                spends page
              </Link>
              .
            </p>
          ) : (
            <div className="spends-list">
              {recentSpends.map((s) => (
                <article key={s.id} className="spend-row">
                  <div className="spend-meta">
                    <span className="spend-date">{s.date}</span>
                    <span className={`spend-tag tag-${s.category}`}>
                      {s.category}
                    </span>
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
              <Link
                href="/spends"
                style={{
                  display: "inline-block",
                  marginTop: 16,
                  fontSize: 13,
                  color: "var(--muted)",
                  borderBottom: "1px solid #333",
                }}
              >
                Full spends log →
              </Link>
            </div>
          )}
        </div>
      </section>

      <hr className="rule" />

      <section className="block wrap" id="telegram">
        <p className="block-label">Telegram</p>
        <h2>
          Tip, play, <em>and stay active.</em>
        </h2>
        <p className="block-text">
          Chat is where the culture lives. Daily habits beat empty feature
          lists.
        </p>

        <div className="cmds">
          <div className="cmd">
            <code>/daily</code>
            <p>Check in. Build the streak.</p>
          </div>
          <div className="cmd">
            <code>/tip @user 50</code>
            <p>Recognize people who add value.</p>
          </div>
          <div className="cmd">
            <code>/rain 100</code>
            <p>Share points with active chatters.</p>
          </div>
          <div className="cmd">
            <code>/leaderboard</code>
            <p>See who shows up.</p>
          </div>
          <div className="cmd">
            <code>/memebattle</code>
            <p>Compete — winners feed the wall.</p>
          </div>
          <div className="cmd">
            <code>/vault</code>
            <p>Treasury address + purpose.</p>
          </div>
        </div>

        <p className="block-text" style={{ marginTop: 36, marginBottom: 24 }}>
          New members pass a maths check in 3 minutes or get removed. Points are
          for activity — not tokens.
        </p>
        <a className="btn btn-fill" href={TELEGRAM} target="_blank" rel="noreferrer">
          Open Telegram
        </a>
      </section>

      <hr className="rule" />

      <section className="block wrap" id="memes">
        <p className="block-label">Culture</p>
        <h2>The meme wall.</h2>
        <p className="block-text">
          Submit in Telegram. Upvote the best. Weekly winners get the site,
          a role, an X shoutout, and points.
        </p>

        <div className="rows" style={{ marginBottom: 40 }}>
          <div className="row">
            <span className="row-num">01</span>
            <div>
              <h3>Submit</h3>
              <p>Drop memes in chat. Holders build the wall.</p>
            </div>
          </div>
          <div className="row">
            <span className="row-num">02</span>
            <div>
              <h3>Battle</h3>
              <p>Use /memebattle — short contests, clear winners.</p>
            </div>
          </div>
          <div className="row">
            <span className="row-num">03</span>
            <div>
              <h3>Feature</h3>
              <p>Meme of the Week across site, Telegram, and X.</p>
            </div>
          </div>
        </div>

        <div className="meme-teaser">
          <h3>Gallery opening soon</h3>
          <p>First community submissions will appear here.</p>
          <a className="btn btn-fill" href={TELEGRAM} target="_blank" rel="noreferrer">
            Submit in Telegram
          </a>
        </div>
      </section>

      <hr className="rule" />

      <section className="block wrap" id="transparency">
        <p className="block-label">On-chain</p>
        <h2>
          Trust, then <em>verify.</em>
        </h2>
        <p className="block-text">
          No mystery numbers. Confirm mint, vault, and spends yourself.
        </p>

        <div className="split">
          <div className="addr-block">
            <div className="addr-item">
              <p className="lbl">Token mint</p>
              {mint ? (
                <>
                  <code>{mint}</code>
                  <a
                    href={`https://explorer.solana.com/address/${mint}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on Explorer →
                  </a>
                </>
              ) : (
                <>
                  <code style={{ color: "var(--muted)" }}>Not configured yet</code>
                  <p style={{ fontSize: 13, color: "var(--dim)", marginTop: 8 }}>
                    Official mint appears here once set and verified.
                  </p>
                </>
              )}
            </div>
            <div className="addr-item">
              <p className="lbl">Vault · marketing &amp; airdrops</p>
              <code>{TREASURY}</code>
              <a
                href={`https://explorer.solana.com/address/${TREASURY}`}
                target="_blank"
                rel="noreferrer"
              >
                View on Explorer →
              </a>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              justifyContent: "center",
            }}
          >
            <Link
              href="/dashboard"
              className="btn btn-fill"
              style={{ alignSelf: "flex-start" }}
            >
              Token data
            </Link>
            <Link
              href="/treasury"
              className="btn btn-line"
              style={{ alignSelf: "flex-start" }}
            >
              Treasury activity
            </Link>
            <Link
              href="/spends"
              className="btn btn-line"
              style={{ alignSelf: "flex-start" }}
            >
              Spends log
            </Link>
          </div>
        </div>
      </section>

      <hr className="rule" />

      <section className="final wrap">
        <h2>
          Together, we grow.
          <br />
          Together, we make history.
        </h2>
        <p>There is room for one more.</p>
        <div className="final-actions">
          <a className="btn btn-fill" href={TELEGRAM} target="_blank" rel="noreferrer">
            Join Telegram
          </a>
          <a className="btn btn-line" href={X_URL} target="_blank" rel="noreferrer">
            Follow on X
          </a>
        </div>
      </section>

      <footer className="footer wrap">
        <Link className="logo" href="/">
          community<span>coin</span>
        </Link>
        <div className="footer-links">
          <Link href="/dashboard">On-chain</Link>
          <Link href="/treasury">Treasury</Link>
          <Link href="/spends">Spends</Link>
          <a href={TELEGRAM} target="_blank" rel="noreferrer">
            Telegram
          </a>
          <a href={X_URL} target="_blank" rel="noreferrer">
            X
          </a>
        </div>
        <p className="disclaimer">
          Crypto involves risk. Not financial advice. Vault funds are for
          marketing and airdrops only. Deposits are voluntary and do not
          generate yield. The $1B figure is a shared vision, not a guarantee.
        </p>
        <span>© {new Date().getFullYear()} COMMUNITY Coin</span>
      </footer>
    </main>
  );
}
