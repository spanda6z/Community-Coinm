import Link from "next/link";

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

      {/* HERO */}
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
          No CEO. No private allocation. Holders create the memes, run the
          raids, and shape the movement.
        </p>
        <div className="hero-actions">
          <a className="btn btn-fill" href={TELEGRAM} target="_blank" rel="noreferrer">
            Join the movement
          </a>
          <a className="btn btn-line" href="#vault">
            Feed the vault
          </a>
        </div>
      </section>

      <hr className="rule" />

      {/* STATEMENT */}
      <section className="statement wrap">
        <p>
          This belongs to the community. There is no central team controlling
          the culture — only people building it together.
        </p>
        <span>Community owned · Public by design</span>
      </section>

      <hr className="rule" />

      {/* VAULT */}
      <section className="block wrap" id="vault">
        <p className="block-label">Community vault</p>
        <h2>
          Feed the community vault.
        </h2>
        <p className="block-text">
          Support memes, events, raids, and community rewards. Voluntary only.
          Not an investment product — deposits do not generate yield.
        </p>

        <div className="split-wide">
          <div>
            <div className="rows">
              <div className="row">
                <span className="row-num">01</span>
                <div>
                  <h3>Voluntary support</h3>
                  <p>
                    Send SOL or tokens to the public treasury when you want to
                    contribute. No obligation.
                  </p>
                </div>
              </div>
              <div className="row">
                <span className="row-num">02</span>
                <div>
                  <h3>Fully public</h3>
                  <p>
                    Balance and transactions stay visible on-chain for anyone to
                    verify.
                  </p>
                </div>
              </div>
              <div className="row">
                <span className="row-num">03</span>
                <div>
                  <h3>Community direction</h3>
                  <p>
                    Spending is discussed in Telegram. Movements remain open on
                    Explorer.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="vault-panel">
            <p className="label">Treasury wallet</p>
            <p className="addr">{TREASURY}</p>
            <p className="note">
              Voluntary contributions only. No yield. No guaranteed returns.
            </p>
            <a
              className="btn btn-fill"
              href={`https://explorer.solana.com/address/${TREASURY}`}
              target="_blank"
              rel="noreferrer"
            >
              View on Explorer
            </a>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* TELEGRAM */}
      <section className="block wrap" id="telegram">
        <p className="block-label">Telegram</p>
        <h2>
          Tip, play, <em>and stay active.</em>
        </h2>
        <p className="block-text">
          Chat is where the culture lives. Commands below power community
          activity — starting simple, expanding carefully.
        </p>

        <div className="cmds">
          <div className="cmd">
            <code>/tip @user 100</code>
            <p>Recognize people who add value in the room.</p>
          </div>
          <div className="cmd">
            <code>/rain</code>
            <p>Drop energy into an active chat session.</p>
          </div>
          <div className="cmd">
            <code>/daily</code>
            <p>Simple check-in to keep the community present.</p>
          </div>
          <div className="cmd">
            <code>/quiz</code>
            <p>Light games that reward attention and knowledge.</p>
          </div>
          <div className="cmd">
            <code>/memebattle</code>
            <p>Compete in chat — best memes feed the wall.</p>
          </div>
          <div className="cmd">
            <code>/leaderboard</code>
            <p>Track contribution and standing over time.</p>
          </div>
        </div>

        <p className="block-text" style={{ marginTop: 36, marginBottom: 24 }}>
          Real token tipping only after secure wallet handling and moderation
          are in place.
        </p>
        <a className="btn btn-fill" href={TELEGRAM} target="_blank" rel="noreferrer">
          Open Telegram
        </a>
      </section>

      <hr className="rule" />

      {/* MEMES */}
      <section className="block wrap" id="memes">
        <p className="block-label">Culture</p>
        <h2>
          The meme wall.
        </h2>
        <p className="block-text">
          Submit through Telegram. Upvote the best. Weekly winners get featured
          on the site, a Telegram role, an X shoutout, and leaderboard points.
        </p>

        <div className="rows" style={{ marginBottom: 40 }}>
          <div className="row">
            <span className="row-num">01</span>
            <div>
              <h3>Submit</h3>
              <p>Drop memes in Telegram. The wall is built by holders.</p>
            </div>
          </div>
          <div className="row">
            <span className="row-num">02</span>
            <div>
              <h3>Upvote</h3>
              <p>Creator handle, reaction count, and community signal.</p>
            </div>
          </div>
          <div className="row">
            <span className="row-num">03</span>
            <div>
              <h3>Feature</h3>
              <p>Meme of the Week takes the spotlight across the project.</p>
            </div>
          </div>
        </div>

        <div className="meme-teaser">
          <h3>Gallery opening soon</h3>
          <p>First submissions from Telegram will appear here.</p>
          <a className="btn btn-fill" href={TELEGRAM} target="_blank" rel="noreferrer">
            Submit a meme
          </a>
        </div>
      </section>

      <hr className="rule" />

      {/* TRANSPARENCY */}
      <section className="block wrap" id="transparency">
        <p className="block-label">On-chain</p>
        <h2>
          Trust, then <em>verify.</em>
        </h2>
        <p className="block-text">
          No mystery numbers. Confirm addresses and activity yourself.
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
              <p className="lbl">Community vault</p>
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

          <div style={{ display: "flex", flexDirection: "column", gap: 12, justifyContent: "center" }}>
            <Link href="/dashboard" className="btn btn-fill" style={{ alignSelf: "flex-start" }}>
              Token data
            </Link>
            <Link href="/treasury" className="btn btn-line" style={{ alignSelf: "flex-start" }}>
              Treasury activity
            </Link>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* FINAL */}
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
          <Link href="/governance">Governance</Link>
          <a href={TELEGRAM} target="_blank" rel="noreferrer">
            Telegram
          </a>
          <a href={X_URL} target="_blank" rel="noreferrer">
            X
          </a>
        </div>
        <p className="disclaimer">
          Crypto involves risk. Not financial advice. Vault deposits are
          voluntary and do not generate yield. The $1B figure is a shared
          vision, not a guarantee.
        </p>
        <span>© {new Date().getFullYear()} COMMUNITY Coin</span>
      </footer>
    </main>
  );
}
