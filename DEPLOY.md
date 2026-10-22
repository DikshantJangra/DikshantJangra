# dikshantjangra.com

Astro (static) on a Cloudflare Worker with static assets. `functions/` uses Pages-style routing and is compiled to `.worker/index.js` by `npm run build`; Cloudflare builds with `npm run build` and deploys with `npx wrangler deploy`. Everything reads `src/data.ts`: page, `/llms.txt`, JSON-LD, `/mcp`, Ask DJ.

```
npm i
npm run dev        # page only (no /api, /mcp)
npm test           # Telegram command parsing + Ask DJ quota caps
npm run preview    # build + wrangler dev (functions; AI needs `wrangler login`)
npm run deploy
npm run resume     # after editing src/data.ts: regenerates public/resume.pdf, then commit it
```

## Fill in first
`grep -n "TODO\|\[" src/data.ts` — avatar (`public/avatar.jpg`), NewtonClaw line, prices, years, WhatsApp, resume, X/Instagram, Dhivio URL.
After changing the avatar, regenerate `public/og.png` (1200×630).

## One-time Cloudflare setup
1. `wrangler login`
2. `wrangler kv namespace create STATUS` and `wrangler d1 create guestbook` → paste the ids into `wrangler.toml` and uncomment those blocks (until then status uses defaults, Ask DJ/demo are off, guestbook is empty)
3. `npm run deploy` (or push to main; Workers Builds deploys it)
4. Worker → Settings → Domains → `dikshantjangra.com`; Email Routing for `hello@`; Web Analytics on.
5. Workers AI is bound as `AI` in `wrangler.toml` (free tier; Ask DJ caps itself at 10/IP and 80/day).

## Telegram status bot
1. Make a bot with @BotFather, get your chat id (message @userinfobot).
2. `wrangler secret put TELEGRAM_SECRET` (any random string) and `TELEGRAM_CHAT_ID`.
3. Point the bot at the site:
   `curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://dikshantjangra.com/api/telegram&secret_token=<TELEGRAM_SECRET>"`
4. Commands: `/status open [text]`, `/status booked <month>`, `/now <text>`, `/show`.

## MCP
`https://dikshantjangra.com/mcp` — read-only tools: `get_profile`, `list_projects`, `get_services`, `get_experience`, `how_to_hire`.
Serves MCP 2026-07-28 and falls back to stateless legacy (`initialize`) for older clients.

## Monthly
Update `site.pill`/`updated` and `now` in `src/data.ts` (or just use the bot).
