# COMMUNITY Coin build roadmap

## Shipped in the repository
- Responsive project landing page and navigation.
- Read-only Solana token supply / largest token accounts endpoint.
- On-chain dashboard page.
- Treasury and governance page foundations that avoid fabricated activity.
- Telegram bot command scaffold.
- PostgreSQL/Prisma models for user records, wallet links, tips, proposals, votes, treasury activity, and processed signatures.
- Initial CI workflow and baseline security headers.

## Next implementation gates
1. **CI validation:** confirm install, Prisma generation, TypeScript check, and production build all pass.
2. **Verified configuration:** independently verify official mint, treasury multisig, RPC endpoint, Telegram bot, and market-data source.
3. **Identity:** verify Telegram Web App init data server-side; issue single-use, expiring challenges; prevent username-only wallet claims.
4. **Wallet linking:** verify a wallet signature over a domain-bound, single-use nonce; consume nonce atomically.
5. **Tips:** resolve Telegram reply or registered username, build a transfer with fixed destination and mint, let sender sign in their own wallet, then verify confirmed transaction details server-side. Add idempotency and abuse controls.
6. **Donations:** explicit user-signed SOL/token transfers to the verified treasury multisig, with public indexed receipts.
7. **Governance:** authenticated proposal creation, one vote per eligible identity, clear proposal states, audit trail, and no automatic treasury execution.
8. **Market data and holder stats:** integrate a reputable provider and clearly label the meaning and freshness of each metric.
9. **Production operations:** database migrations/backups, rate limits, error monitoring, secret management, security review, and devnet test suite before mainnet.

## Safety boundary
No transfer, wallet-link success, vote result, or treasury receipt should be shown as complete until independently verified. Never ask for a seed phrase or private key.
