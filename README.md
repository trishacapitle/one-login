# One Login (Site VIP / Angus Shield)

> **One login. One screen. One obvious action.**  
> Built for sole-trader trade contractors who need to know their financial standing in one glance and record completed work in under 30 seconds without friction.

[![Tests](https://img.shields.io/badge/tests-passing-emerald)](https://github.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Drizzle](https://img.shields.io/badge/Drizzle%20ORM-PostgreSQL-green)](https://orm.drizzle.team)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8)](https://tailwindcss.com)

---

## The 30-Second Evaluator Experience

1. **One-Tap Demo Login**: Open the app and tap **"1-Tap Demo Login"**. No registration or mobile typing hurdles.
2. **One Screen**: The dashboard answers *"How are we doing this month?"* with three large metrics:
   - **PROFIT** (hero card styled luminous emerald for **"In the black"** or crimson for **"In the red"**)
   - **$ IN** (gross income received this month)
   - **$ OUT** (operational expenses incurred this month)
3. **One Obvious Action**: The dominant sticky bottom button: **[ JOB DONE ]**.
4. **Instant Flow**: Tap "Job Done", fill Customer, Job, and Price (or tap the one-tap brief preset sample), tap **[ DONE ]**.
5. **Immediate Feedback**: The bottom sheet glides closed instantly, the income and profit counters increment optimistically, and the job appears at the top of the recent jobs feed.

---

## Architecture & Design Decisions

See our architectural decision records:
- [ADR 0001: Direct Jobs & Expenses Data Model](file:///docs/adr/0001-direct-jobs-and-expenses-model.md) — Explains why direct `jobs` (income) and `expenses` (money out) tables were chosen over an unnecessary dual-write accounting ledger.
- [ADR 0002: Dual-Mode Persistence Architecture](file:///docs/adr/0002-dual-mode-persistence.md) — *(Superseded)*
- [ADR 0003: Direct Drizzle ORM and Native Next.js 16 API Persistence](file:///docs/adr/0003-direct-drizzle-orm-and-local-persistence.md) — Standard Drizzle ORM database client with PostgreSQL connection pooling and native Next.js API routes with zero-config local persistence fallback.
- [Ubiquitous Language](file:///CONTEXT.md) — Canonical glossary defining Job, Customer, Financial Position, Money In, Money Out, Profit, In the Black, and In the Red.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript 5
- **Database & ORM**: Drizzle ORM (`drizzle-orm`, `drizzle-kit`) with PostgreSQL driver (`postgres`)
- **Styling**: Tailwind CSS v4 (Mobile-first obsidian dark theme with glowing emerald/crimson accents)
- **Icons**: Lucide Icons
- **Testing**: Vitest automated suite for financial arithmetic and month-boundary calculations
- **Deployment**: Vercel ready

---

## Database Schema (Drizzle ORM)

The relational schema is defined in [`src/db/schema.ts`](file:///src/db/schema.ts):

- **`jobs`**: `id`, `user_id`, `customer`, `description`, `amount`, `completed_at`, `created_at`
- **`expenses`**: `id`, `user_id`, `category`, `description`, `amount`, `incurred_at`, `created_at`

Drizzle Kit migrations are managed via:
```bash
npm run db:generate
npm run db:push
```

---

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/one_login
```

> **Note**: Even if `DATABASE_URL` is omitted during local evaluation, the app automatically runs in resilient demo mode with zero setup.

---

## Local Development & Testing

```bash
# Install dependencies
npm install

# Run automated tests
npm test

# Run linter
npm run lint

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your desktop or mobile browser.

---

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. (Optional) Provide `DATABASE_URL` (e.g., from Vercel Postgres, Neon, or any PostgreSQL provider).
4. Deploy!
