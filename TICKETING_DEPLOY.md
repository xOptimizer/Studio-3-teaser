# Studio 3 Ticketing — Frontend deployment

This repo is the **marketing site + ticketing UI** only. The API (Finix, database, email, PDF tickets) runs in a **separate backend repository**.

The frontend talks to the API via `VITE_API_URL` — no backend code lives in this project.

---

## Environment variables (this repo)

Copy `.env.example` to `.env` for local dev, or set the same keys on Vercel for production.

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base URL of the ticketing API (no trailing slash) |
| `VITE_FINIX_APPLICATION_ID` | Finix Application ID (public — used by Finix.js in the browser) |
| `VITE_FINIX_ENV` | `sandbox` or `prod` |
| `VITE_GOOGLE_PAY_MERCHANT_ID` | Google Pay merchant ID (production only) |

**Local example:**

```bash
VITE_API_URL=http://localhost:3001
VITE_FINIX_APPLICATION_ID=your-application-id
VITE_FINIX_ENV=sandbox
```

**Production example:**

```bash
VITE_API_URL=https://your-api.railway.app
VITE_FINIX_APPLICATION_ID=your-application-id
VITE_FINIX_ENV=prod
```

Finix API username/password and merchant identity stay on the **backend** only — never put them in this repo.

---

## Deploy frontend (Vercel)

1. Connect this repository to Vercel (existing setup).
2. Add the three `VITE_*` environment variables in the Vercel project settings.
3. Deploy. No API routes or serverless functions are required in this repo.

---

## Local development

1. Start the **backend API** from its own repo (default port `3001`).
2. In this repo:

```bash
cp .env.example .env
# Set VITE_API_URL to match your running API

npm install
npm run dev
```

3. Open `http://localhost:5173` — event checkout, login, My Tickets, and admin UI all call the external API.

---

## CORS (backend configuration)

The backend must allow this site’s origin. In the **backend** `.env`, set:

```bash
FRONTEND_URL=http://localhost:5173   # local
# FRONTEND_URL=https://your-teaser-site.vercel.app   # production
```

Ticket PDF QR codes also use `FRONTEND_URL` for verify links (`/admin/verify?t=...`).

---

## Frontend routes (ticketing)

| Path | Purpose |
|------|---------|
| `/event` | Event page |
| `/event/checkout` | Checkout — card, Apple Pay, Google Pay |
| `/tickets` | Logged-in user’s tickets + PDF download |
| `/admin` | Admin orders dashboard |
| `/admin/scanner` | QR scanner + check-in |
| `/admin/verify?t=...` | Deep link from ticket QR |

Auth token is stored in `localStorage` under `studio3_token`.

---

## Backend setup (separate repo)

Database, Prisma, Finix charges, webhooks, Nodemailer, and ticket PDF generation are documented in the **backend repository** (`README.md` and `docs/ARCHITECTURE.md` there).

Backend checklist (not in this repo):

- PostgreSQL + `DATABASE_URL`
- `JWT_SECRET`, Finix API credentials, `FINIX_MERCHANT_IDENTITY_ID`
- SMTP for ticket emails (optional for dev — emails log to console if unset)
- Finix webhook URL: `https://YOUR_API_URL/webhooks/finix`
- `npx prisma db push` and `npm run db:seed` for event + admin user

---

## Quick connectivity check

With the API running:

```bash
curl http://localhost:3001/health
```

Should return `{"status":"ok",...}`. If that works and `VITE_API_URL` matches, the frontend can reach the API.
