import Link from "next/link";

function FrogMascot({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 360 330" role="img" aria-label="Friendly green frog mascot illustration">
    <g stroke="#183b29" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M62 201 Q36 165 48 128 Q57 100 83 111 Q107 120 106 154" fill="#72d66e"/>
      <path d="M296 201 Q324 165 312 128 Q303 100 277 111 Q253 120 254 154" fill="#72d66e"/>
      <ellipse cx="180" cy="194" rx="119" ry="104" fill="#68d866"/>
      <ellipse cx="128" cy="105" rx="49" ry="53" fill="#8aeb78"/>
      <ellipse cx="232" cy="105" rx="49" ry="53" fill="#8aeb78"/>
      <ellipse cx="129" cy="108" rx="24" ry="29" fill="#fffdf0"/>
      <ellipse cx="231" cy="108" rx="24" ry="29" fill="#fffdf0"/>
      <ellipse cx="134" cy="113" rx="11" ry="16" fill="#183b29" strokeWidth="4"/>
      <ellipse cx="226" cy="113" rx="11" ry="16" fill="#183b29" strokeWidth="4"/>
      <path d="M112 194 Q180 250 248 194 Q241 266 180 268 Q119 266 112 194Z" fill="#f8f3d9"/>
      <path d="M119 194 Q180 218 241 194" fill="none" strokeWidth="5"/>
      <path d="M93 260 Q72 280 55 270 M267 260 Q288 280 305 270" fill="none"/>
      <path d="M92 293 Q75 311 59 302 M268 293 Q285 311 301 302" fill="none"/>
    </g>
    <circle cx="89" cy="173" r="13" fill="#ff9b90" opacity=".9"/><circle cx="271" cy="173" r="13" fill="#ff9b90" opacity=".9"/>
    <path d="M47 57 l7 16 16 7 -16 7 -7 16 -7 -16 -16 -7 16 -7Z" fill="#ffcb54" stroke="#183b29" strokeWidth="3"/>
    <path d="M307 52 l5 12 12 5 -12 5 -5 12 -5 -12 -12 -5 12 -5Z" fill="#ffcb54" stroke="#183b29" strokeWidth="3"/>
  </svg>;
}

const COIN_LOGO_URL = "https://cdn.phototourl.com/member/2026-10-17-1a5f940e-5861-4ed4-a043-b066d11a5d98.jpg";

const links = [
  { href: "/dashboard", label: "On-chain data" },
  { href: "/governance", label: "Governance" },
  { href: "/treasury", label: "Treasury" },
  { href: "/link-wallet", label: "Link wallet" },
];

export default function Home() {
  const mint = process.env.NEXT_PUBLIC_TOKEN_MINT;
  return <main className="pond">
    <div className="pond-topline"><span><i /> COMMUNITY-POWERED. SOLANA-NATIVE.</span><span>GOOD PEOPLE. GOOD MEMES. OPEN BOOKS.</span></div>
    <nav className="pond-nav shell">
      <Link className="pond-brand" href="/"><img className="pond-brand-logo" src={COIN_LOGO_URL} alt="COMMUNITY Coin logo" /><span>community<span className="pond-brand-light">coin</span></span></Link>
      <div className="pond-nav-links"><a href="#the-vibe">The vibe</a><a href="#how-to-join">How to join</a><a href="#transparency">Transparency</a></div>
      <a className="pond-nav-cta" href={process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/"} target="_blank" rel="noreferrer">Come hang <span>↗</span></a>
    </nav>

    <section className="pond-hero shell">
      <div className="pond-hero-copy">
        <div className="pond-pill"><span>✳</span> THE PEOPLE'S LITTLE CORNER OF SOLANA</div>
        <h1>Making<br/>community<br/><em>great again.</em></h1>
        <p className="pond-subtitle">A little coin. A lot of community. We're here for the memes, the makers, and the magic that happens when good people build things together.</p>
        <div className="pond-hero-actions">
          <a className="pond-button pond-button-dark" href={process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/"} target="_blank" rel="noreferrer">Join the community <span>↗</span></a>
          <a className="pond-text-link" href="#the-vibe">Meet the pond ↓</a>
        </div>
        <div className="pond-small-note"><span>☻</span><p><strong>No suits. No sermons.</strong><br/>Just a community figuring it out together.</p></div>
      </div>
      <div className="pond-hero-visual">
        <div className="pond-sun"></div><div className="pond-ripple ripple-a"></div><div className="pond-ripple ripple-b"></div>
        <div className="pond-sticker sticker-hi">THE OFFICIAL COIN <span>✦</span></div>
        <img className="pond-hero-logo" src={COIN_LOGO_URL} alt="Official COMMUNITY Coin logo" />
        <div className="pond-sticker sticker-good">COMMUNITY • CULTURE • COIN</div>
        <span className="pond-star star-a">✦</span><span className="pond-star star-b">✦</span>
      </div>
      <div className="pond-hero-bottom"><span>COMMUNITY FIRST, ALWAYS.</span><span>SCROLL A LITTLE ↓</span></div>
    </section>

    <div className="pond-ticker"><div className="pond-ticker-track">{Array.from({length:2},(_,i)=><span key={i}>MEMES WITH MEANING <b>✳</b> COMMUNITY OVER CLOUT <b>✳</b> BUILT IN THE OPEN <b>✳</b> ONE POND, MANY FROGS <b>✳</b> SOLANA GOODNESS <b>✳</b></span>)}</div></div>

    <section className="pond-intro shell" id="the-vibe">
      <div className="pond-section-label"><span>01 / THE VIBE</span><span>A COIN WITH A COMMUNITY AROUND IT</span></div>
      <div className="pond-intro-grid">
        <div><span className="pond-hand-note">psst… you're invited</span><h2>Crypto can be<br/>a little more <em>human.</em></h2></div>
        <div className="pond-intro-copy"><p className="pond-lead">We like the silly stuff. We believe in the serious stuff. And we think the best communities make room for both.</p><p>COMMUNITY Coin is a community-first Solana project built around shared ideas, transparent on-chain information, and making space for people to participate. No magic promises. Just a pond we're building together.</p><a className="pond-under-link" href="/dashboard">Peek at the on-chain data <span>↗</span></a></div>
      </div>
      <div className="pond-card-grid">
        <article className="pond-card pond-card-lime"><span className="pond-card-num">01</span><div className="pond-doodle">☻</div><h3>Memes bring us together.</h3><p>Come for the fun. Stay for the people, ideas, and things we make along the way.</p><span className="pond-card-bottom">GOOD ENERGY ONLY ↗</span></article>
        <article className="pond-card pond-card-pink"><span className="pond-card-num">02</span><div className="pond-doodle">♡</div><h3>Everyone gets a voice.</h3><p>Share an idea, explore community polls, and help shape what comes next.</p><a className="pond-card-bottom" href="/governance">VISIT GOVERNANCE ↗</a></article>
        <article className="pond-card pond-card-blue"><span className="pond-card-num">03</span><div className="pond-doodle">◎</div><h3>Open books, always.</h3><p>We show verified on-chain information when it's connected. No made-up numbers, ever.</p><a className="pond-card-bottom" href="/treasury">SEE THE TREASURY ↗</a></article>
      </div>
    </section>

    <section className="pond-green-section" id="how-to-join"><div className="shell pond-join-grid">
      <div className="pond-join-art"><div className="pond-join-orbit"></div><FrogMascot className="pond-frog-small"/><span className="pond-join-bubble">YOU, US,<br/>THE POND.</span></div>
      <div className="pond-join-copy"><div className="pond-section-label pond-label-light"><span>02 / GET IN HERE</span><span>THREE EASY STEPS</span></div><h2>Find your people.<br/><em>Hop on in.</em></h2><p>New to Solana? No stress. Start with the community, take your time, and always double-check links and addresses.</p>
        <div className="pond-steps"><div><span>01</span><section><h3>Get yourself a wallet</h3><p>Use a wallet you trust, like Phantom. Your recovery phrase stays private. Always.</p></section></div><div><span>02</span><section><h3>Come say hi</h3><p>Join the community and get to know the people and the project.</p></section></div><div><span>03</span><section><h3>Explore, don't rush</h3><p>Check token details and verified on-chain data before making any decisions.</p></section></div></div>
        <a className="pond-button pond-button-cream" href={process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/"} target="_blank" rel="noreferrer">Hop into Telegram <span>↗</span></a>
      </div>
    </div></section>

    <section className="pond-transparency shell" id="transparency">
      <div className="pond-section-label"><span>03 / THE OPEN BOOK</span><span>VERIFY IT YOURSELF</span></div>
      <div className="pond-transparency-grid"><div><h2>Trust the pond.<br/><em>Verify the facts.</em></h2><p>We don't do mystery numbers or made-up market stats. Explore the on-chain records and check the addresses yourself before you interact.</p><div className="pond-transparency-links"><Link href="/dashboard" className="pond-button pond-button-dark">Explore token data ↗</Link><Link href="/treasury" className="pond-text-link">Treasury activity ↗</Link></div></div>
      <div className="pond-address-card"><div className="pond-address-head"><span>THE TOKEN</span><span className="pond-live-dot">{mint ? "MINT CONFIGURED" : "MINT NOT CONFIGURED"}</span></div><div className="pond-address-body"><span>Solana mint address</span>{mint ? <><code>{mint}</code><a href={"https://explorer.solana.com/address/" + mint} target="_blank" rel="noreferrer">View on Solana Explorer ↗</a></> : <><strong>We're keeping it honest.</strong><p>The official mint address will appear here once it's configured and verified.</p></>} </div><div className="pond-address-foot">ON-CHAIN DATA, NOT VIBES ALONE ✳</div></div></div>
    </section>

    <section className="pond-final"><div className="shell pond-final-inner"><div className="pond-final-frog"><FrogMascot className="pond-frog-end"/></div><div><span className="pond-final-kicker">THE POND IS BETTER WITH YOU</span><h2>Come for the memes.<br/><em>Stay for the people.</em></h2><p>Pull up a lily pad. There's room for one more.</p><div className="pond-final-actions"><a className="pond-button pond-button-dark" href={process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/"} target="_blank" rel="noreferrer">Join Telegram ↗</a><a className="pond-button pond-button-outline" href={process.env.NEXT_PUBLIC_X_URL || "https://x.com/"} target="_blank" rel="noreferrer">Follow on X ↗</a></div></div></div></section>

    <footer className="pond-footer shell"><Link className="pond-brand" href="/"><img className="pond-brand-logo" src={COIN_LOGO_URL} alt="COMMUNITY Coin logo" /><span>community<span className="pond-brand-light">coin</span></span></Link><div className="pond-footer-links">{links.map(link=><Link href={link.href} key={link.href}>{link.label}</Link>)}<Link href="/donate">Donate</Link></div><span className="pond-disclaimer">Memes are fun. Crypto is risky. No promises of returns.</span><span className="pond-copyright">© {new Date().getFullYear()} COMMUNITY Coin</span></footer>
  </main>;
}
