# Signalist

Real-time stock market app: live prices and charts (TradingView widgets), stock search (Finnhub, ⌘K), stock detail pages, watchlists, an AI-personalized welcome email, and a daily AI news summary email. Built with Next.js 15, Better Auth, MongoDB/Mongoose and Inngest (+ Gemini via `step.ai`), Nodemailer and Tailwind v4.

## Setup

```bash
npm install
cp .env.example .env   # fill in the keys
npm run dev            # http://localhost:3000
npx inngest-cli@latest dev   # Inngest dev server at http://localhost:8288
```

Keys you need: MongoDB Atlas URI, `BETTER_AUTH_SECRET` (any random string), Finnhub API key, Gemini API key, a Gmail address with an app password for Nodemailer, and Inngest keys for production.

## Features

| Area | Where |
| --- | --- |
| Dashboard (market overview, heatmap, top stories, quotes) | `app/(root)/page.tsx` |
| Sign up / sign in (Better Auth, email + password) | `app/(auth)`, `lib/actions/auth.actions.ts` |
| Route protection | `middleware.ts`, `app/(root)/layout.tsx` |
| Stock search (⌘K) | `components/SearchCommand.tsx`, `lib/actions/finnhub.actions.ts` |
| Stock details (charts, technicals, profile, financials) | `app/(root)/stocks/[symbol]/page.tsx` |
| Watchlist CRUD (the challenge) | `app/(root)/watchlist`, `lib/actions/watchlist.actions.ts` |
| Welcome email (AI intro) | `lib/inngest/functions.ts` → `sign-up-email` |
| Daily news summary (cron `0 12 * * *` UTC) | `lib/inngest/functions.ts` → `daily-news-summary` |

## Stopping the daily emails

Pause the `daily-news-summary` function in the Inngest dashboard, or remove the `{ cron: ... }` trigger in `lib/inngest/functions.ts` and redeploy.

## Deploy

Push to Vercel, add the same env vars (set `BETTER_AUTH_URL` / `NEXT_PUBLIC_BASE_URL` to your domain, drop `INNGEST_DEV`), then connect the app in Inngest (Vercel integration or sync `https://<domain>/api/inngest`).
