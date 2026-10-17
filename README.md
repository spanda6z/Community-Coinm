# COMMUNITY Coin

> Not a one-man coin. A community movement.

A community-first Solana token project. This repository starts with the website foundation and a secure architecture for the Telegram community bot.

## Planned modules
- Community website: live token data, tokenomics, treasury transparency, governance, and community links.
- Telegram bot: price snapshots, moderation, member tips, wallet linking, donations, and polls.
- Backend: verified Solana transaction status, PostgreSQL persistence, rate limiting, and audit metadata.

## Security
- Never ask for or store seed phrases/private keys.
- Wallet transfers must be signed by users in their own wallet through a secure HTTPS web flow.
- Never claim a transfer succeeded before verifying its signature and on-chain confirmation.
- Use a multisig treasury and publish the verified address.
- Market data, balances, and holder counts must come from configured, trusted sources—not mock values presented as real.

## Getting started

This initial scaffold is a static Next.js foundation. Install dependencies with `npm install` and run `npm run dev`. Solana and Telegram integrations require environment configuration and will be added in subsequent implementation steps.
