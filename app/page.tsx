import Link from "next/link";

const features = [
  { n: "01", title: "Built in the open", body: "Clear token details, verified links, and a treasury activity feed designed to make community funds easy to follow." },
  { n: "02", title: "Community has a voice", body: "Propose ideas, discuss priorities, and signal support. Governance stays transparent about what is a poll and what is binding." },
  { n: "03", title: "People over hype", body: "A home for holders, builders, creators, and curious newcomers. No guaranteed returns. No fake numbers." },
];
const steps = [
  { n: "01", title: "Connect your own wallet", body: "Use a supported Solana wallet. Your seed phrase never belongs on this site or in a Telegram chat." },
  { n: "02", title: "Explore the ecosystem", body: "Check the verified token address, understand the allocation, and join the community conversation." },
  { n: "03", title: "Take part", body: "Vote in community polls, contribute ideas, and support community-funded initiatives when the treasury is configured." },
];

export default function Home() {
  return <main>
    <nav className="nav shell">
      <Link className="brand" href="/"><span className="brand-mark">C</span><span>COMMUNITY<span className="brand-light">COIN</span></span></Link>
      <div className="nav-links"><a href="#mission">Mission</a><a href="#ecosystem">Ecosystem</a><a href="#transparency">Transparency</a><a href="/dashboard">On-chain data</a><a href="/link-wallet">Link wallet</a><a href="/governance">Governance</a><a href="/treasury">Treasury</a></div>
      <a className="nav-cta" href="#join">Join community <span>↗</span></a>
    </nav>
    <section className="hero shell">
      <div className="hero-copy">
        <div className="eyebrow"><span className="pulse" /> A community-powered Solana project</div>
        <h1>Not a one-man coin.<br/><em>A community</em><br/>movement.</h1>
        <p className="hero-text">A token is only the beginning. We’re building a place for people to connect, contribute, and shape what comes next — together.</p>
        <div className="hero-actions"><a className="button button-dark" href="#join">Find your people <span>↗</span></a><a className="text-link" href="#mission">Discover the mission <span>↓</span></a></div>
        <div className="hero-note"><span className="note-icon">↳</span><span>Early stage. Community first.<br/><b>Built in public, one step at a time.</b></span></div>
      </div>
      <div className="hero-art" aria-label="Abstract community coin artwork">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
        <div className="coin-shadow" /><div className="coin"><div className="coin-inner"><span className="coin-symbol">C</span><span className="coin-word">COMMUNITY</span><span className="coin-stars">✳ · ✳ · ✳</span></div></div>
        <span className="float-tag tag-one"><span className="tag-dot" /> BUILT TOGETHER</span><span className="float-tag tag-two">SOLANA ECOSYSTEM ↗</span><span className="spark spark-one">✳</span><span className="spark spark-two">✳</span>
      </div>
      <div className="hero-bottom"><span>INDEPENDENT MINDS. SHARED PURPOSE.</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>
    <section className="ticker" aria-label="Project values"><div className="ticker-track">{Array.from({length:2},(_,i)=><span key={i}>COMMUNITY FIRST <b>✳</b> TRANSPARENCY ALWAYS <b>✳</b> BUILD IN PUBLIC <b>✳</b> SOLANA NATIVE <b>✳</b> PEOPLE POWERED <b>✳</b></span>)}</div></section>
    <section className="section shell" id="mission">
      <div className="section-kicker"><span>01 / THE WHY</span><span>MORE THAN A TOKEN</span></div>
      <div className="mission-grid"><h2>Crypto moves<br/>fast. <em>Community</em><br/>moves things.</h2><div className="mission-copy"><p className="lead">COMMUNITY Coin is an experiment in what happens when the people are the point — not an afterthought.</p><p>We’re creating the foundations for a more open, useful, and welcoming ecosystem. That means sharing what we know, being honest about what’s still being built, and making room for the community to help shape the roadmap.</p><a className="under-link" href="#ecosystem">See what we’re building <span>↗</span></a></div></div>
      <div className="feature-grid" id="ecosystem">{features.map(f=><article className="feature" key={f.n}><span className="feature-n">{f.n}</span><div className="feature-icon">{f.n==="01"?"◈":f.n==="02"?"◎":"✳"}</div><h3>{f.title}</h3><p>{f.body}</p><span className="feature-arrow">↗</span></article>)}</div>
    </section>
    <section className="dark-section" id="transparency"><div className="shell transparency">
      <div><div className="section-kicker light"><span>02 / THE PROMISE</span><span>NO SMOKE. NO MIRRORS.</span></div><h2>Trust isn’t a slogan.<br/><em>Show the work.</em></h2><p className="dark-lead">We won’t dress placeholders up as facts. Token addresses, treasury movements, and market data will appear here once they’re connected to verified sources.</p><div className="transparency-actions"><a className="button button-lime" href="/dashboard">View on-chain data <span>↗</span></a><a className="transparency-explorer" href="https://explorer.solana.com/" target="_blank" rel="noreferrer">Open Solana Explorer ↗</a></div></div>
      <div className="ledger"><div className="ledger-head"><span>COMMUNITY LEDGER</span><span className="ledger-status"><i/> INTEGRATION PENDING</span></div><div className="ledger-row"><span>Token mint</span><b>Not configured</b></div><div className="ledger-row"><span>Treasury wallet</span><b>Not configured</b></div><div className="ledger-row"><span>Latest activity</span><b>Awaiting verified feed</b></div><div className="ledger-row"><span>Market data</span><b>Not connected</b></div><div className="ledger-foot">Live data will be sourced from verified on-chain records.<br/>No fabricated balances or transaction history.</div></div>
    </div></section>
    <section className="section shell how"><div className="section-kicker"><span>03 / GET INVOLVED</span><span>YOUR COMMUNITY, YOUR CALL</span></div><div className="how-heading"><h2>There’s room<br/>for <em>you here.</em></h2><p>Whether you’re here to learn, build, create, or contribute, start with the community and grow from there.</p></div><div className="steps">{steps.map(s=><article className="step" key={s.n}><span>{s.n}</span><h3>{s.title}</h3><p>{s.body}</p></article>)}</div></section>
    <section className="join-section" id="join"><div className="shell join-inner"><div className="join-stamp">C<span>✳</span></div><div><span className="join-kicker">THE NEXT CHAPTER IS OURS</span><h2>Good things happen<br/>when we <em>build together.</em></h2><p>Come meet the people behind the project. The best ideas don’t happen in a vacuum.</p><div className="join-actions"><a className="button button-dark" href={process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/"} target="_blank" rel="noreferrer">Join Telegram <span>↗</span></a><a className="button button-outline" href={process.env.NEXT_PUBLIC_X_URL || "https://x.com/"} target="_blank" rel="noreferrer">Follow on X <span>↗</span></a></div></div></div></section>
    <footer className="footer shell"><Link className="brand" href="/"><span className="brand-mark">C</span><span>COMMUNITY<span className="brand-light">COIN</span></span></Link><span>Community-powered. Transparency-led.</span><span>© {new Date().getFullYear()} COMMUNITY Coin</span></footer>
  </main>;
}
