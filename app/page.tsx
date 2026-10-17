import Link from "next/link";

const links = [
  { href: "/dashboard", label: "On-chain data" },
  { href: "/governance", label: "Governance" },
  { href: "/treasury", label: "Treasury" },
  { href: "/link-wallet", label: "Link wallet" },
];

const BANNER =
  "https://cdn.phototourl.com/member/2026-10-17-1a5f940e-5861-4ed4-a043-b066d11a5d98.jpg";

const TREASURY =
  process.env.NEXT_PUBLIC_TREASURY_ADDRESS ||
  "21fsnH5cGMoKdN49psbw1dcbD16VW64ziu1nnKPy4NAP";

const TELEGRAM =
  process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/communitycoinchatt";
const X_URL =
  process.env.NEXT_PUBLIC_X_URL || "https://x.com/communitycoin14";

export default function Home() {
  const mint = process.env.NEXT_PUBLIC_TOKEN_MINT;

  return (
    <main>
      <nav className="nav shell">
        <Link className="brand" href="/">
          <span className="brand-mark">C</span>
          <span>
            community<span>coin</span>
          </span>
        </Link>
        <div className="nav-links">
          <a href="#vision">Vision</a>
          <a href="#vault">Vault</a>
          <a href="#telegram">Telegram</a>
          <a href="#memes">Memes</a>
          <a href="#transparency">Transparency</a>
        </div>
        <div className="nav-right">
          <a className="nav-cta" href={TELEGRAM} target="_blank" rel="noreferrer">
            Join community
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero shell">
        <div className="hero-banner">
          <img src={BANNER} alt="COMMUNITY COIN" />
        </div>

        <div className="hero-badge">
          <i /> Community-owned · Solana
        </div>

        <h1>
          One Community.
          <br />
          <span className="muted">One Billion-Dollar Vision.</span>
        </h1>

        <p className="hero-sub">
          Belongs to the community. No CEO. No private allocation. Holders
          create the memes, run the raids, and shape the movement.
        </p>

        <div className="hero-actions">
          <a className="btn btn-primary" href={TELEGRAM} target="_blank" rel="noreferrer">
            Join the movement
          </a>
          <a className="btn btn-secondary" href="#vault">
            Feed the vault
          </a>
        </div>
      </section>

      <div className="ticker">
        <div className="ticker-track">
          {Array.from({ length: 2 }, (_, i) => (
            <span key={i}>
              Community Owned <b>·</b> No CEO <b>·</b> Feed The Vault <b>·</b>{" "}
              Tip · Play · Earn <b>·</b> Meme Wall <b>·</b> Open Books <b>·</b>
            </span>
          ))}
        </div>
      </div>

      {/* OWNERSHIP */}
      <section className="section shell" id="vision">
        <div className="section-label">Community owned</div>
        <h2>
          No central team
          <br />
          <span className="muted">controlling the culture.</span>
        </h2>
        <p className="section-lead">
          Holders create the memes, run the raids, and shape the movement. The
          culture is built in public — by the people in the chat.
        </p>

        <div className="pillars">
          <article className="pillar">
            <div className="pillar-num">01</div>
            <h3>No CEO</h3>
            <p>No single operator owns the culture or the narrative.</p>
          </article>
          <article className="pillar">
            <div className="pillar-num">02</div>
            <h3>No private allocation</h3>
            <p>The movement is not structured around a hidden team bag.</p>
          </article>
          <article className="pillar">
            <div className="pillar-num">03</div>
            <h3>Holder-built</h3>
            <p>Memes, raids, and energy come from the community itself.</p>
          </article>
          <article className="pillar">
            <div className="pillar-num">04</div>
            <h3>$1B vision</h3>
            <p>A shared direction — not a promise of returns.</p>
          </article>
        </div>
      </section>

      {/* VAULT */}
      <section className="section shell" id="vault">
        <div className="section-label">Community vault</div>
        <h2>
          Feed the
          <br />
          <span className="muted">community vault.</span>
        </h2>
        <p className="section-lead">
          Support the vault to help fund memes, events, raids, and community
          rewards. Voluntary only. Not an investment product.
        </p>

        <div className="vision-row">
          <div className="mc-box">
            <div className="mc-label">Public treasury</div>
            <div
              className="mc-num"
              style={{ fontSize: "clamp(14px, 2.4vw, 18px)", letterSpacing: "-0.02em", wordBreak: "break-all", lineHeight: 1.35 }}
            >
              {TREASURY.slice(0, 6)}…{TREASURY.slice(-4)}
            </div>
            <div className="mc-unit">On-chain · viewable</div>
            <p className="mc-note">
              Deposits do not generate yield or guaranteed returns.
            </p>
          </div>
          <div className="vision-copy">
            <p>
              Anyone can voluntarily send SOL or tokens to the public treasury
              wallet. Balance and transactions are visible on-chain.
            </p>
            <p>
              Spending direction is shaped by the community — via Telegram
              discussion and simple proposals. All movements remain public on
              Solscan / Explorer.
            </p>
            <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                className="btn btn-primary"
                href={`https://explorer.solana.com/address/${TREASURY}`}
                target="_blank"
                rel="noreferrer"
              >
                View treasury
              </a>
              <Link href="/treasury" className="btn btn-secondary">
                Activity
              </Link>
            </div>
          </div>
        </div>

        <div className="feat-grid" style={{ marginTop: 12 }}>
          <article className="feat">
            <div className="feat-num">01</div>
            <h3>Voluntary sends</h3>
            <p>SOL or tokens to a public wallet. No obligation. No locked deposit product.</p>
          </article>
          <article className="feat">
            <div className="feat-num">02</div>
            <h3>Public balance</h3>
            <p>Treasury address and history stay open for anyone to inspect.</p>
          </article>
          <article className="feat">
            <div className="feat-num">03</div>
            <h3>Community direction</h3>
            <p>Proposals and discussion in Telegram. Spends remain transparent on-chain.</p>
          </article>
        </div>
      </section>

      {/* TELEGRAM */}
      <section className="section shell" id="telegram">
        <div className="section-label">Telegram</div>
        <h2>
          Tip, play,
          <br />
          <span className="muted">and stay active.</span>
        </h2>
        <p className="section-lead">
          Chat is where the culture lives. Commands below are the roadmap for
          community activity — starting simple, expanding carefully.
        </p>

        <div className="feat-grid">
          <article className="feat">
            <div className="feat-num">/tip</div>
            <h3>Tip members</h3>
            <p>
              <code style={{ color: "#ccc" }}>/tip @user 100</code> — recognize
              people who add value in chat.
            </p>
          </article>
          <article className="feat">
            <div className="feat-num">/rain</div>
            <h3>Rain the chat</h3>
            <p>Drop energy into an active room and keep the session moving.</p>
          </article>
          <article className="feat">
            <div className="feat-num">/daily</div>
            <h3>Daily check-in</h3>
            <p>Simple recurring habit to keep the community present.</p>
          </article>
          <article className="feat">
            <div className="feat-num">/quiz</div>
            <h3>Quizzes</h3>
            <p>Light games that reward attention and knowledge of the project.</p>
          </article>
          <article className="feat">
            <div className="feat-num">/memebattle</div>
            <h3>Meme battles</h3>
            <p>Compete in chat. Best memes feed the wall and the culture.</p>
          </article>
          <article className="feat">
            <div className="feat-num">/leaderboard</div>
            <h3>Leaderboard</h3>
            <p>Track contribution, activity, and standing in the community.</p>
          </article>
        </div>

        <p className="section-lead" style={{ marginTop: 28, marginBottom: 20 }}>
          Real token tipping only ships after secure wallet handling and
          moderation controls are in place. Until then, points-based activity
          keeps the chat alive.
        </p>
        <a className="btn btn-primary" href={TELEGRAM} target="_blank" rel="noreferrer">
          Open Telegram
        </a>
      </section>

      {/* MEME WALL */}
      <section className="section shell" id="memes">
        <div className="section-label">Culture</div>
        <h2>
          The meme wall.
          <br />
          <span className="muted">Built by holders.</span>
        </h2>
        <p className="section-lead">
          Submit memes via Telegram. The best rise on the wall. Weekly winners
          get the spotlight.
        </p>

        <div className="feat-grid">
          <article className="feat">
            <div className="feat-num">01</div>
            <h3>Submit</h3>
            <p>Drop memes in Telegram or through the community form when live.</p>
          </article>
          <article className="feat">
            <div className="feat-num">02</div>
            <h3>Upvote</h3>
            <p>Each card shows the creator, upvotes, and community reaction.</p>
          </article>
          <article className="feat">
            <div className="feat-num">03</div>
            <h3>Feature</h3>
            <p>
              Weekly Meme of the Week — site feature, Telegram role, X shoutout,
              leaderboard points.
            </p>
          </article>
        </div>

        <div
          className="addr-card"
          style={{ marginTop: 28, textAlign: "center", padding: "40px 24px" }}
        >
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 8 }}>
            Meme wall gallery
          </p>
          <p style={{ color: "#fff", fontWeight: 600, fontSize: 16, marginBottom: 20 }}>
            Coming online with the first community submissions
          </p>
          <a className="btn btn-primary" href={TELEGRAM} target="_blank" rel="noreferrer">
            Submit in Telegram
          </a>
        </div>
      </section>

      {/* JOIN */}
      <section className="section shell" id="join">
        <div className="section-label">Get started</div>
        <h2>
          Three steps.
          <br />
          <span className="muted">Take your time.</span>
        </h2>
        <p className="section-lead">
          New to Solana? Start with the community. Always verify links and
          addresses before interacting.
        </p>

        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <h3>Wallet</h3>
            <p>Use a wallet you trust. Recovery phrase stays on your device.</p>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <h3>Community</h3>
            <p>Join Telegram. Meet the people. Learn how the project moves.</p>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <h3>Verify</h3>
            <p>Check mint, treasury, and on-chain data before any decision.</p>
          </div>
        </div>

        <div style={{ marginTop: 36 }}>
          <a className="btn btn-primary" href={TELEGRAM} target="_blank" rel="noreferrer">
            Join Telegram
          </a>
        </div>
      </section>

      {/* TRANSPARENCY */}
      <section className="section shell" id="transparency">
        <div className="section-label">Transparency</div>
        <div className="trans-grid">
          <div>
            <h2>
              Trust, then
              <br />
              <span className="muted">verify.</span>
            </h2>
            <p className="section-lead" style={{ marginTop: 12, marginBottom: 28 }}>
              No mystery numbers. Explore on-chain records and confirm addresses
              independently.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/dashboard" className="btn btn-primary">
                Token data
              </Link>
              <Link href="/treasury" className="btn btn-secondary">
                Treasury activity
              </Link>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="addr-card">
              <div className="addr-head">
                <span>Token mint</span>
                <span className="live">
                  {mint ? "Configured" : "Not configured"}
                </span>
              </div>
              <div className="addr-body">
                <span>Solana mint address</span>
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
                    <strong
                      style={{
                        display: "block",
                        marginBottom: 8,
                        fontSize: 14,
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    >
                      Not configured yet
                    </strong>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        color: "var(--muted)",
                        lineHeight: 1.55,
                      }}
                    >
                      The official mint will appear here once set and verified.
                    </p>
                  </>
                )}
              </div>
              <div className="addr-foot">On-chain · independently verifiable</div>
            </div>

            <div className="addr-card">
              <div className="addr-head">
                <span>Community vault</span>
                <span className="live">Official</span>
              </div>
              <div className="addr-body">
                <span>Treasury wallet</span>
                <code>{TREASURY}</code>
                <a
                  href={`https://explorer.solana.com/address/${TREASURY}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on Explorer →
                </a>
              </div>
              <div className="addr-foot">
                Voluntary support only · no yield promised
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL */}
      <section className="final shell">
        <h2>
          Together, we grow.
          <br />
          Together, we make history.
        </h2>
        <p>There is room for one more.</p>
        <div className="final-actions">
          <a className="btn btn-primary" href={TELEGRAM} target="_blank" rel="noreferrer">
            Join Telegram
          </a>
          <a className="btn btn-secondary" href={X_URL} target="_blank" rel="noreferrer">
            Follow on X
          </a>
        </div>
      </section>

      <footer className="footer shell">
        <Link className="brand" href="/">
          <span className="brand-mark">C</span>
          <span>
            community<span>coin</span>
          </span>
        </Link>
        <div className="footer-links">
          {links.map((l) => (
            <Link href={l.href} key={l.href}>
              {l.label}
            </Link>
          ))}
          <a href={TELEGRAM} target="_blank" rel="noreferrer">
            Telegram
          </a>
          <a href={X_URL} target="_blank" rel="noreferrer">
            X
          </a>
        </div>
        <p className="disclaimer">
          Cryptocurrency involves risk. Nothing on this site is financial advice
          or a promise of returns. Vault deposits are voluntary and do not
          generate yield. The $1B market-cap figure is a shared long-term vision,
          not a guarantee.
        </p>
        <span>© {new Date().getFullYear()} COMMUNITY Coin</span>
      </footer>
    </main>
  );
}
