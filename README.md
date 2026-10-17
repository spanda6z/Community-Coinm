# COMMUNITY Coin

A community-first Solana project website and Telegram bot foundation.

## Run locally
1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env.local` and configure only values you have verified.
3. Run `npm install`.
4. Run `npm run dev` and open http://localhost:3000.

## Telegram bot
Set `TELEGRAM_BOT_TOKEN` in your environment and run `npm run bot`. The initial bot exposes `/start`, `/help`, `/price`, and `/tip`. Transfer execution is intentionally disabled until the secure wallet-linking, database, and transaction-verification layers are implemented.

## API
- `GET /api/health`: reports whether required integration settings exist.
- `GET /api/token`: when `NEXT_PUBLIC_TOKEN_MINT` and `SOLANA_RPC_URL` are configured, fetches verified token supply and largest token accounts from Solana RPC. It does not fabricate market prices or claim largest accounts are unique holders.

## Security principles
- Never request or store seed phrases or private keys.
- Wallet transfers must be signed in the user's own wallet through a secure HTTPS web flow.
- Verify the mint, destination, amount, signature, and on-chain confirmation before recording a transfer as complete.
- Use idempotency protection for transaction processing and rate limits for bot commands.
- Use a multisig treasury; governance polls are not a substitute for signer approvals.
- Do not publish fake market prices, balances, holder counts, or treasury activity.
- Keep secrets out of source control and out of all `NEXT_PUBLIC_*` variables.

## Current status
The public landing page and initial read-only Solana API route are implemented. Token mint, RPC, Telegram bot token, database, official social links, and market-data source are not assumed or invented. Wallet linking, tipping, donation execution, governance persistence, and treasury indexing remain to be implemented before production use.
