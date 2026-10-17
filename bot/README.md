# COMMUNITY Coin Telegram bot

## Required env

```
TELEGRAM_BOT_TOKEN=from_BotFather
NEXT_PUBLIC_SITE_URL=https://community-coinm.vercel.app
NEXT_PUBLIC_TREASURY_ADDRESS=21fsnH5cGMoKdN49psbw1dcbD16VW64ziu1nnKPy4NAP
```

Optional: `BOT_DATA_DIR` for persistent points storage path.

## Local

```bash
npm install
TELEGRAM_BOT_TOKEN=xxx npm run bot
```

## Railway (recommended)

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub → `spanda6z/Community-Coinm`
2. Variables → add `TELEGRAM_BOT_TOKEN` (and site/treasury URLs)
3. Settings → Start command: `npm run bot`
4. Deploy

## Group setup

1. Add bot to https://t.me/communitycoinchatt
2. Promote to **admin** with: Restrict members, Ban users
3. BotFather → Bot Settings → Group Privacy → **Turn off** (for /rain activity)

## Commands

`/start` `/help` `/daily` `/tip` `/rain` `/balance` `/leaderboard` `/quiz` `/memebattle` `/meme` `/vault` `/price` `/wallet` `/treasury`

New members: maths captcha within 3 minutes or kicked.
