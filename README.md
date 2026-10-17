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

## Environment configuration

Configure variables in your deployment provider's encrypted environment-variable settings. Never commit real credentials or put server secrets in variables prefixed with `NEXT_PUBLIC_`.

| Variable | Required for | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Correct wallet-signature domain and Telegram bot links | Use the final HTTPS site URL, without a trailing slash. |
| `NEXT_PUBLIC_TELEGRAM_URL` | Telegram links on the website | Set to the official bot or community link after verifying it. |
| `NEXT_PUBLIC_X_URL` | X/social links on the website | Set to the official account after verifying it. |
| `NEXT_PUBLIC_TOKEN_MINT` | Live token supply and largest-account data | Public Solana mint address; independently verify it before setting. |
| `SOLANA_RPC_URL` | Token and treasury RPC reads | Server-only RPC endpoint. Keep provider API keys private. |
| `NEXT_PUBLIC_TREASURY_ADDRESS` | Treasury address and native-SOL activity | Set only after independently verifying the official treasury address. |
| `DATABASE_URL` | Wallet linking and database-backed governance/session features | PostgreSQL connection string; treat as a secret. Apply reviewed schema migrations and confirm backups before production use. |
| `TELEGRAM_BOT_TOKEN` | Running the Telegram bot process | Server-only BotFather token; never expose it in client code or logs. |

For a basic public site, set `NEXT_PUBLIC_SITE_URL` and verified official links. Live token data needs both `NEXT_PUBLIC_TOKEN_MINT` and `SOLANA_RPC_URL`. Treasury activity additionally needs `NEXT_PUBLIC_TREASURY_ADDRESS`. Database-backed wallet linking needs a working `DATABASE_URL` and a deployed schema. The bot is a separate process and requires `TELEGRAM_BOT_TOKEN`; configure and run it separately from the Next.js website.

After changing Vercel environment variables, redeploy the relevant environment so the build/runtime picks them up. Use distinct verified settings for production and previews; never point a preview at an unverified treasury or use real bot credentials in an untrusted preview.

## Database
Set `DATABASE_URL`, then run `npm run db:generate` and `npm run db:push`. For production, use reviewed migrations and backups rather than ad-hoc schema pushes.

## Telegram bot
Set `TELEGRAM_BOT_TOKEN` in the server environment and run `npm run bot`.

## Deployment checklist
- Confirm the production deployment is marked ready and can be reached by intended visitors. Vercel deployment protection/SSO may restrict hosted preview and `vercel.app` URLs; only change protection settings after deciding the intended access policy.
- Configure the environment variables above using independently verified addresses and secret values.
- Test `/api/health`, `/api/token`, and `/api/treasury` against the deployed site; expected missing-configuration responses are not successful integration tests.
- Test Telegram Web App authentication and wallet linking end to end over HTTPS with the database configured.
- Keep donation/tipping transfers disabled until transaction construction, wallet signatures, on-chain confirmation, replay protection, idempotency, and failure handling are implemented and audited.

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
