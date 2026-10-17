import Link from "next/link";

const links = [
  { href: "/dashboard", label: "On-chain data" },
  { href: "/governance", label: "Governance" },
  { href: "/treasury", label: "Treasury" },
  { href: "/link-wallet", label: "Link wallet" },
];

const BANNER =
  "https://cdn.phototourl.com/member/2026-10-17-1a5f940e-5861-4ed4-a043-b066d11a5d98.jpg";

/** Official community treasury wallet (public). */
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
          <a href="#features">Features</a>
          <a href="#join">Join</a>
          <a href="#transparency">Transparency</a>
        </div>
        <div className="nav-right">
          <a className="nav-cta" href={TELEGRAM} target="_blank" rel="noreferrer">
            Join community
          </a>
        </div>
      </nav>

      <section className="hero shell">
        <div className="hero-banner">
          <img src={BANNER} alt="COMMUNITY COIN" />
        </div>

        <div className="hero-badge">
          <i /> Community-powered · Solana
        </div>

        <h1>
          One Community.
          <br />
          <span className="muted">One Billion-Dollar Vision.</span>
        </h1>

        <p className="hero-sub">
          A community-powered journey on Solana. Built through cooperation,
          belief, and collective effort — not hype alone.
        </p>

        <div className="hero-actions">
          <a className="btn btn-primary" href={TELEGRAM} target="_blank" rel="noreferrer">
            Join the movement
          </a>
          <a className="btn btn-secondary" href="#vision">
            Our vision
          </a>
        </div>
      </section>

      <div className="ticker">
        <div className="ticker-track">
          {Array.from({ length: 2 }, (_, i) => (
            <span key={i}>
              Together We Grow <b>·</b> Together We Make History <b>·</b> One
              Community <b>·</b> One Goal <b>·</b> $1B Vision <b>·</b>
            </span>
          ))}
        </div>
      </div>

      <section className="section shell" id="vision">
        <div className="section-label">Shared ambition</div>
        <h2>
          One community.
          <br />
          <span className="muted">One goal.</span>
        </h2>
        <p className="section-lead">
          A journey we build together. Every participant has a role to play.
        </p>

        <div className="vision-row">
          <div className="mc-box">
            <div className="mc-label">Shared target</div>
            <div className="mc-num">$1B</div>
            <div className="mc-unit">Market Cap</div>
            <p className="mc-note">
              A long-term vision — not a guarantee of financial returns.
            </p>
          </div>
          <div className="vision-copy">
            <p>
              Growth is driven by cooperation and collective effort — not by a
              single founder or early cohort. Everyone matters.
            </p>
            <p>
              The objective is clear: build a community people are proud to have
              been part of. History is made together.
            </p>
            <div style={{ marginTop: 24 }}>
              <a className="btn btn-primary" href={TELEGRAM} target="_blank" rel="noreferrer">
                Join the movement
              </a>
            </div>
          </div>
        </div>

        <div className="pillars">
          <article className="pillar">
            <div className="pillar-num">01</div>
            <h3>Togetherness</h3>
            <p>Everyone matters — not only founders or early holders.</p>
          </article>
          <article className="pillar">
            <div className="pillar-num">02</div>
            <h3>Cooperation</h3>
            <p>Contribute, create, and carry the vision forward together.</p>
          </article>
          <article className="pillar">
            <div className="pillar-num">03</div>
            <h3>Ambition</h3>
            <p>$1B is the shared target — a direction, not a promise.</p>
          </article>
          <article className="pillar">
            <div className="pillar-num">04</div>
            <h3>History</h3>
            <p>Build something people will remember being part of.</p>
          </article>
        </div>
      </section>

      <section className="section shell" id="features">
        <div className="section-label">Why it matters</div>
        <h2>
          Built for people,
          <br />
          <span className="muted">not just charts.</span>
        </h2>
        <p className="section-lead">
          Culture, participation, and transparency. The strongest communities
          balance energy with substance.
        </p>

        <div className="feat-grid">
          <article className="feat">
            <div className="feat-num">01</div>
            <h3>Culture first</h3>
            <p>
              Memes and energy bring people in. Shared purpose is what keeps
              them.
            </p>
          </article>
          <article className="feat">
            <div className="feat-num">02</div>
            <h3>Voice for everyone</h3>
            <p>
              Ideas, polls, and participation — so the community can shape what
              comes next.
            </p>
            <Link href="/governance">Governance →</Link>
          </article>
          <article className="feat">
            <div className="feat-num">03</div>
            <h3>Open books</h3>
            <p>
              On-chain data when available. No fabricated figures. Verify
              everything yourself.
            </p>
            <Link href="/treasury">Treasury →</Link>
          </article>
        </div>
      </section>

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
            <p>
              Use a wallet you trust. Your recovery phrase never leaves your
              device.
            </p>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <h3>Community</h3>
            <p>
              Join Telegram, meet the people, and learn how the project operates.
            </p>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <h3>Verify</h3>
            <p>
              Review token data and on-chain records before making any decision.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 36 }}>
          <a className="btn btn-primary" href={TELEGRAM} target="_blank" rel="noreferrer">
            Join Telegram
          </a>
        </div>
      </section>

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
                      The official mint will appear here once it is set and
                      verified.
                    </p>
                  </>
                )}
              </div>
              <div className="addr-foot">On-chain · independently verifiable</div>
            </div>

            <div className="addr-card">
              <div className="addr-head">
                <span>Treasury</span>
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
              <div className="addr-foot">Community treasury · public address</div>
            </div>
          </div>
        </div>
      </section>

      <section className="final shell">
        <h2>
          Together, we grow.
          <br />
          Together, we make history.
        </h2>
        <p>There is room for one more.</p>
        <div className="final-actions">
          <a className="btn btn-primary" href={TELEGRAM} target="_blank" rel="noreferrer">
            Join the movement
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
          <Link href="/donate">Donate</Link>
        </div>
        <p className="disclaimer">
          Cryptocurrency involves risk. Nothing on this site is financial advice
          or a promise of returns. The $1B market-cap figure is a shared
          long-term vision, not a guarantee.
        </p>
        <span>© {new Date().getFullYear()} COMMUNITY Coin</span>
      </footer>
    </main>
  );
}
