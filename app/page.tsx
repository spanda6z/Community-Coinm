import Link from "next/link";

const links = [
  { href: "/dashboard", label: "On-chain data" },
  { href: "/governance", label: "Governance" },
  { href: "/treasury", label: "Treasury" },
  { href: "/link-wallet", label: "Link wallet" },
];

export default function Home() {
  const mint = process.env.NEXT_PUBLIC_TOKEN_MINT;
  const telegram = process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/";
  const xUrl = process.env.NEXT_PUBLIC_X_URL || "https://x.com/";

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
          <a href="#vibe">Features</a>
          <a href="#join">Join</a>
          <a href="#transparency">Transparency</a>
        </div>
        <div className="nav-right">
          <a className="nav-cta" href={telegram} target="_blank" rel="noreferrer">
            Join movement
          </a>
        </div>
      </nav>

      <section className="hero shell">
        <div className="hero-banner">
          <img src="/community-banner.jpg" alt="COMMUNITY COIN — the crew" />
        </div>

        <div className="hero-badge">
          <i /> Community-powered · Solana-native
        </div>

        <h1>
          One Community.
          <br />
          <span className="muted">One Billion-Dollar Vision.</span>
        </h1>

        <p className="hero-sub">
          More than a coin — a community-powered journey. Cooperation, belief,
          and collective effort. Build something bigger than yourself.
        </p>

        <div className="hero-actions">
          <a className="btn btn-primary" href={telegram} target="_blank" rel="noreferrer">
            Join the movement →
          </a>
          <a className="btn btn-secondary" href="#vision">
            See the vision
          </a>
        </div>
      </section>

      <div className="ticker">
        <div className="ticker-track">
          {Array.from({ length: 2 }, (_, i) => (
            <span key={i}>
              Together We Grow <b>✦</b> Together We Make History <b>✦</b> One
              Community <b>✦</b> One Goal <b>✦</b> $1B Vision <b>✦</b>
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
          A journey we build together. Every person has a part to play.
        </p>

        <div className="vision-row">
          <div className="mc-box">
            <div className="mc-label">Shared target</div>
            <div className="mc-num">$1B</div>
            <div className="mc-unit">Market Cap</div>
            <p className="mc-note">
              A vision for the future — not a guaranteed financial outcome.
            </p>
          </div>
          <div className="vision-copy">
            <p>
              Growth comes from cooperation, belief, and collective effort —
              not from any single founder or early holder. Everyone matters.
            </p>
            <p>
              The aim is simple: build a community people will remember being
              part of. Let’s make history together.
            </p>
            <div style={{ marginTop: 20 }}>
              <a className="btn btn-primary" href={telegram} target="_blank" rel="noreferrer">
                Join the movement →
              </a>
            </div>
          </div>
        </div>

        <div className="pillars">
          <article className="pillar">
            <div className="pillar-num">01</div>
            <h3>Togetherness</h3>
            <p>Everyone matters — not just founders or early holders.</p>
          </article>
          <article className="pillar">
            <div className="pillar-num">02</div>
            <h3>Cooperation</h3>
            <p>Contribute, create, and spread the vision together.</p>
          </article>
          <article className="pillar">
            <div className="pillar-num">03</div>
            <h3>Ambition</h3>
            <p>$1B is the shared target, not a promise. We aim high.</p>
          </article>
          <article className="pillar">
            <div className="pillar-num">04</div>
            <h3>History</h3>
            <p>Build something people will remember being part of.</p>
          </article>
        </div>
      </section>

      <section className="section shell" id="vibe">
        <div className="section-label">Why it matters</div>
        <h2>
          Built for people,
          <br />
          <span className="muted">not just charts.</span>
        </h2>
        <p className="section-lead">
          Memes, makers, and open books. The best communities make room for both
          the silly and the serious.
        </p>

        <div className="feat-grid">
          <article className="feat">
            <div className="feat-num">01</div>
            <h3>Memes bring us together</h3>
            <p>
              Come for the fun. Stay for the people, ideas, and things we make
              along the way.
            </p>
            <span style={{ fontSize: 12, color: "var(--dim)" }}>Good energy only</span>
          </article>
          <article className="feat">
            <div className="feat-num">02</div>
            <h3>Everyone gets a voice</h3>
            <p>
              Share ideas, explore community polls, and help shape what comes
              next.
            </p>
            <Link href="/governance">Visit governance →</Link>
          </article>
          <article className="feat">
            <div className="feat-num">03</div>
            <h3>Open books, always</h3>
            <p>
              Verified on-chain data when connected. No made-up numbers. Ever.
            </p>
            <Link href="/treasury">See the treasury →</Link>
          </article>
        </div>
      </section>

      <section className="section shell" id="join">
        <div className="section-label">Get started</div>
        <h2>
          Three steps.
          <br />
          <span className="muted">No rush.</span>
        </h2>
        <p className="section-lead">
          New to Solana? Start with the community. Take your time. Always
          double-check links and addresses.
        </p>

        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <h3>Get a wallet</h3>
            <p>
              Phantom, Solflare, or any wallet you trust. Recovery phrase stays
              private.
            </p>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <h3>Say hi</h3>
            <p>
              Join the community. Meet the people. Get a feel for the project.
            </p>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <h3>Explore</h3>
            <p>
              Check token details and on-chain data before making any decisions.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <a className="btn btn-primary" href={telegram} target="_blank" rel="noreferrer">
            Join Telegram →
          </a>
        </div>
      </section>

      <section className="section shell" id="transparency">
        <div className="section-label">Transparency</div>
        <div className="trans-grid">
          <div>
            <h2>
              Trust the crew.
              <br />
              <span className="muted">Verify the facts.</span>
            </h2>
            <p className="section-lead" style={{ marginTop: 12, marginBottom: 24 }}>
              No mystery numbers. No made-up stats. Explore on-chain records and
              check addresses yourself.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/dashboard" className="btn btn-primary">
                Token data →
              </Link>
              <Link href="/treasury" className="btn btn-secondary">
                Treasury
              </Link>
            </div>
          </div>

          <div className="addr-card">
            <div className="addr-head">
              <span>Token</span>
              <span className="live">
                {mint ? "Configured" : "Not configured"}
              </span>
            </div>
            <div className="addr-body">
              <span>Solana mint</span>
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
                    style={{ display: "block", marginBottom: 6, fontSize: 14 }}
                  >
                    Keeping it honest.
                  </strong>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--muted)" }}>
                    Official mint address appears here once configured and
                    verified.
                  </p>
                </>
              )}
            </div>
            <div className="addr-foot">On-chain data · not vibes alone</div>
          </div>
        </div>
      </section>

      <section className="final shell">
        <h2>
          Together, We Grow.
          <br />
          Together, We Make History.
        </h2>
        <p>Room for one more. Let’s build it.</p>
        <div className="final-actions">
          <a className="btn btn-primary" href={telegram} target="_blank" rel="noreferrer">
            Join the movement →
          </a>
          <a className="btn btn-secondary" href={xUrl} target="_blank" rel="noreferrer">
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
          Crypto is risky. No promises of returns. The $1B market-cap figure is
          a shared vision, not a guarantee.
        </p>
        <span>© {new Date().getFullYear()} COMMUNITY Coin</span>
      </footer>
    </main>
  );
}
