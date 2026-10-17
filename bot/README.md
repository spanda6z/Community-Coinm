# COMMUNITY Coin Telegram bot

## Vercel (recommended for this project)

1. Vercel project → **Settings → Environment Variables**

| Name | Value |
|------|--------|
| `TELEGRAM_BOT_TOKEN` | from @BotFather |
| `NEXT_PUBLIC_SITE_URL` | `https://community-coinm.vercel.app` |
| `NEXT_PUBLIC_TREASURY_ADDRESS` | `21fsnH5cGMoKdN49psbw1dcbD16VW64ziu1nnKPy4NAP` |

2. Redeploy the site.

3. **Set the webhook** (run once in terminal):

```bash
curl "https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook?url=https://community-coinm.vercel.app/api/telegram&allowed_updates=%5B%22message%22%2C%22callback_query%22%2C%22chat_member%22%2C%22my_chat_member%22%5D"
```

4. Check:

```bash
curl https://community-coinm.vercel.app/api/telegram
curl "https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo"
```

5. Add bot to the group as **admin** (restrict + ban members).

## Local polling (optional)

```bash
npm install
TELEGRAM_BOT_TOKEN=xxx npm run bot
```

Do not run polling and webhook at the same time.

## Note on points storage

On Vercel, points live in memory/`/tmp` and may reset on cold starts. Fine for launch; add Postgres later for permanence.
