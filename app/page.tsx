import Link from "next/link";
import { VAULT_SPENDS } from "../lib/vault-spends";
import { getVaultBalance, treasuryAddress } from "../lib/get-vault-balance";

const TELEGRAM =
  process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/communitycoinchatt";
const X_URL =
  process.env.NEXT_PUBLIC_X_URL || "https://x.com/communitycoin14";

const BANNER =
  "https://cdn.phototourl.com/member/2026-10-17-1a5f940e-5861-4ed4-a043-b066d11a5d98.jpg";

export default async function Home() {
  const TREASURY = treasuryAddress();
  const mint = process.env.NEXT_PUBLIC_TOKEN_MINT;
  const recentSpends = VAULT_SPENDS.slice(0, 3);
  const vault = await getVaultBalance();

  return (
    <main>
      <nav className="nav wrap">
        <Link className="logo" href="/">
          community<span>coin</span>
        </Link>
        <div className="nav-links">
          <a href="#how">How</a>
          <a href="#vault">Vault</a>
          <a href="#telegram">Telegram</a>
          <a href="#transparency">On-chain</a>
        </div>
        <div className="nav-right">
          <a
            className="nav-social"
            href={X_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="X"
          >
            X
          </a>
          <a className="nav-cta" href={TELEGRAM} target="_blank" rel="noreferrer">
            Join
          </a>
        </div>
      </nav>

      <div className="live-strip wrap">
        <div className="live-item">
          <span className="live-dot" aria-hidden />
          <span className="live-label">Vault</span>
          <strong>
            {vault.ok ? `${vault.solFormatted} SOL` : "— SOL"}
          </strong>
        </div>
        <div className="live-sep" aria-hidden />
        <div className="live-item">
          <span className="live-label">Network</span>
          <strong>Solana</strong>
        </div>
        <div className="live-sep" aria-hidden />
        <div className="live-item">
          <span className="live-label">Status</span>
          <strong>Community-owned</strong>
        </div>
      </div>

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
          airdrops only. No CEO. No private allocation.
        </p>
        <div className="hero-actions">
          <a className="btn btn-fill" href={TELEGRAM} target="_blank" rel="noreferrer">
            Join Telegram
          </a>
          <a className="btn btn-line" href="#vault">
            Fuel the vault
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

      <section className="block wrap" id="pillars">
        <p className="block-label">The message</p>
        <h2>
          Four words. <em>One movement.</em>
        </h2>
        <div className="pillars">
          <article className="pillar">
            <span className="pillar-num">01</span>
            <h3>Togetherness</h3>
            <p>Everyone matters — not just founders or early holders.</p>
          </article>
          <article className="pillar">
            <span className="pillar-num">02</span>
            <h3>Cooperation</h3>
            <p>Growth comes from people creating and spreading the vision.</p>
          </article>
          <article className="pillar">
            <span className="pillar-num">03</span>
            <h3>Ambition</h3>
            <p>A $1B market cap is the shared target — not a promise.</p>
          </article>
          <article className="pillar">
            <span className="pillar-num">04</span>
            <h3>History</h3>
            <p>Build a community people remember being part of.</p>
          </article>
        </div>
      </section>

      <hr className="rule" />

      <section className="block wrap" id="how">
        <p className="block-label">How it works</p>
        <h2>Simple by design.</h2>
        <p className="block-text">
          Four moves that keep the community honest and active.
        </p>
        <div className="rows">
          <div className="row">
            <span className="row-num">01</span>
            <div>
              <h3>Join the chat</h3>
              <p>
                Telegram is home base. New members pass a short maths check or
                get removed — keeps bots out.
              </p>
            </div>
          </div>
          <div className="row">
            <span className="row-num">02</span>
            <div>
              <h3>Show up</h3>
              <p>
                Daily check-ins, tips, rains, quizzes, meme battles. Activity
                builds the culture and the leaderboard.
              </p>
            </div>
          </div>
          <div className="row">
            <span className="row-num">03</span>
            <div>
              <h3>Fuel the vault</h3>
              <p>
                Optional. Send to the public treasury to fund marketing and
                airdrops. Not a deposit product — no yield.
              </p>
            </div>
          </div>
          <div className="row">
            <span className="row-num">04</span>
            <div>
              <h3>Verify on-chain</h3>
              <p>
                Mint, treasury, and spends are public. Trust the links you can
                check yourself.
              </p>
            </div>
          </div>
        </div>
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
            <div className="vault-panel-top">
              <p className="label">Vault balance</p>
              <span className="live-badge">
                <span className="live-dot" aria-hidden />
                Live
              </span>
            </div>
            <p className="vault-balance">
              {vault.ok ? (
                <>
                  <span className="vault-sol">{vault.solFormatted}</span>
                  <span className="vault-unit"> SOL</span>
                </>
              ) : (
                <span className="vault-sol">—</span>
              )}
            </p>
            <p className="label" style={{ marginTop: 24 }}>
              Treasury wallet
            </p>
            <p className="addr">{TREASURY}</p>
            <p className="note">
              Live on-chain balance. Marketing &amp; airdrops only. Voluntary.
              No yield. No guaranteed returns.
            </p>
            <div className="vault-actions">
              <Link className="btn btn-fill" href="/donate">
                Support the vault
              </Link>
              <a
                className="btn btn-line"
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
            <p className="empty-note">
              No spends logged yet. When the vault pays for marketing or an
              airdrop, it will be listed here and on the{" "}
              <Link href="/spends">spends page</Link>.
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
              <Link href="/spends" className="text-link">
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
          Chat is where the culture lives. Daily habits beat empty feature lists.
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
            <p>Live balance + treasury address.</p>
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
          Submit in Telegram. Upvote the best. Weekly winners get the site, a
          role, an X shoutout, and points.
        </p>
        <div className="meme-grid">
          <div className="meme-slot">
            <span>01</span>
            <p>Submit</p>
          </div>
          <div className="meme-slot">
            <span>02</span>
            <p>Battle</p>
          </div>
          <div className="meme-slot">
            <span>03</span>
            <p>Feature</p>
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
                  <code className="muted-code">Not configured yet</code>
                  <p className="addr-hint">
                    Official mint appears here once set and verified.
                  </p>
                </>
              )}
            </div>
            <div className="addr-item">
              <p className="lbl">Vault · marketing &amp; airdrops</p>
              <p className="addr-balance">
                {vault.ok ? `${vault.solFormatted} SOL` : "— SOL"}
              </p>
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
          <div className="side-actions">
            <Link href="/dashboard" className="btn btn-fill">
              Token data
            </Link>
            <Link href="/treasury" className="btn btn-line">
              Treasury activity
            </Link>
            <Link href="/spends" className="btn btn-line">
              Spends log
            </Link>
          </div>
        </div>
      </section>

      <hr className="rule" />

      <section className="block wrap" id="faq">
        <p className="block-label">FAQ</p>
        <h2>Straight answers.</h2>
        <div className="rows" style={{ marginTop: 32 }}>
          <div className="row">
            <span className="row-num">?</span>
            <div>
              <h3>Is depositing into the vault an investment?</h3>
              <p>
                No. Support is voluntary. Funds are for marketing and airdrops.
                There is no yield and no guaranteed return.
              </p>
            </div>
          </div>
          <div className="row">
            <span className="row-num">?</span>
            <div>
              <h3>Who controls the culture?</h3>
              <p>
                Holders. There is no CEO narrative and no private allocation
                story. Memes, raids, and energy come from the community.
              </p>
            </div>
          </div>
          <div className="row">
            <span className="row-num">?</span>
            <div>
              <h3>What are bot points?</h3>
              <p>
                Activity scores for tips, dailies, quizzes, and battles. Points
                are not tokens and are not a promise of airdrop size.
              </p>
            </div>
          </div>
          <div className="row">
            <span className="row-num">?</span>
            <div>
              <h3>What does the $1B figure mean?</h3>
              <p>
                A shared long-term ambition — not a forecast, not financial
                advice, not a guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      <section className="final wrap">
        <p className="hero-kicker">Together</p>
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
          <Link href="/donate">Support</Link>
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
