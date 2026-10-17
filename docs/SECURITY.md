# Security model and production gates

## Non-negotiable
- Never collect seed phrases or private keys.
- Browser wallet signatures must be scoped, human-readable, nonce-based, short-lived, and verified server-side.
- Do not bind a Telegram account to a wallet based only on a username. Telegram identity must be verified server-side using Telegram's signed Web App init data or a bot-issued one-time linking challenge.
- Never mark a transfer successful from a client callback. Parse the confirmed on-chain transaction and verify mint, destination, amount, signer, and confirmation status.
- Make signature processing idempotent and protect all write endpoints with authentication, rate limits, and replay protection.
- A public governance poll is not authorization to spend treasury assets. Treasury spending requires explicit multisig approvals.
- Never expose secrets in NEXT_PUBLIC environment variables or logs.

## Before enabling tipping or donations
1. Configure PostgreSQL and apply the Prisma schema.
2. Implement and test Telegram identity verification and one-time wallet linking.
3. Add a transaction builder that fixes the verified destination, mint, and amount on the server.
4. Verify signatures and confirmed transactions on the server, with idempotent processing.
5. Add rate limits, abuse controls, audit logs, monitoring, and recovery procedures.
6. Use a multisig treasury and publish the verified treasury address.
7. Test on Solana devnet and have the transaction flow independently reviewed before mainnet.
