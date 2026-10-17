# COMMUNITY Coin

A community-first Solana project: public website, read-only on-chain data, Telegram bot foundation, and groundwork for secure community governance.

## Run locally
1. Install Node.js 20+.
2. Copy `.env.example` to `.env.local` and configure only verified values.
3. Install dependencies: `npm install`.
4. Generate the database client: `npm run db:generate`.
5. Run the website: `npm run dev`.

## Features in this repository
- Responsive public landing page.
- Read-only token supply and largest-account data from Solana RPC at `/api/token`.
- Token dashboard at `/dashboard`.
- Treasury transparency status at `/treasury`.
- Governance proposal list at `/governance`.
- Telegram bot foundation with `/start`, `/help`, `/price`, and a deliberately disabled `/tip` flow until on-chain transfer verification is complete.
- Server-side Telegram Web App `initData` verification and a short-lived, single-use Solana wallet-link flow at `/link-wallet` (message signature only; no funds move).
- Prisma/PostgreSQL schema for users, wallet links, tips, proposals, votes, treasury transactions, and idempotent signature processing.

## Database
Set `DATABASE_URL`, then run `npm run db:generate` and `npm run db:push`. For production, use reviewed migrations and backups rather than ad-hoc schema pushes.

## Telegram bot
Set `TELEGRAM_BOT_TOKEN` in the server environment and run `npm run bot`.

## Configuration is not verification
A configured mint, RPC URL, Telegram token, or treasury address does not prove the integration is healthy or the address is official. Verify all addresses independently. Market pricing needs a trusted market-data source. Largest token accounts are not unique-holder counts.

## Security
- Never request or store seed phrases/private keys.
- Wallet signing happens in the user's own wallet through a secure HTTPS flow.
- Do not accept a browser-supplied user ID as identity. Telegram Web App init data is HMAC-verified server-side; wallet linking uses a five-minute, single-use challenge signed by the wallet.
- Verify mint, destination, amount, signature, and on-chain confirmation before recording transfers.
- Use idempotency, replay protection, rate limits, audit logs, and multisig treasury control.
- Governance polls do not authorize treasury transfers.
- Do not display fabricated balances, prices, votes, or treasury activity.

Wallet-linking code is implemented but still requires deployment configuration and end-to-end security testing. Voting, tip execution, donation execution, and treasury indexing remain disabled/fail-closed until their identity, eligibility, and on-chain transaction verification paths are implemented and tested.
