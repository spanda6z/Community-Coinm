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
- Telegram bot commands `/start`, `/help`, `/price`, and `/tip`.
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
- Do not accept a browser-supplied user ID as identity. Verify Telegram Web App init data or a server-issued one-time linking challenge.
- Verify mint, destination, amount, signature, and on-chain confirmation before recording transfers.
- Use idempotency, replay protection, rate limits, audit logs, and multisig treasury control.
- Governance polls do not authorize treasury transfers.
- Do not display fabricated balances, prices, votes, or treasury activity.

Wallet linking, voting, tip execution, donation execution, and treasury indexing remain fail-closed until identity verification and transaction verification are implemented and tested.
