# One Login (Site VIP / Angus Shield)

> **One login. One screen. One obvious action.**  
> Built for sole-trader trade contractors who need to know their financial standing in one glance and record completed work in under 30 seconds without friction.

[![Tests](https://img.shields.io/badge/tests-passing-emerald)](https://github.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Drizzle](https://img.shields.io/badge/Drizzle%20ORM-PostgreSQL-green)](https://orm.drizzle.team)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20RLS-3ecf8e)](https://supabase.com)
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
- [ADR 0002: Dual-Mode Persistence Architecture](file:///docs/adr/0002-dual-mode-persistence.md) — Connects directly to Supabase with PostgreSQL and RLS when credentials exist, with a seamless zero-config fallback if reviewing offline or locally before database provisioning.
- [Ubiquitous Language](file:///CONTEXT.md) — Canonical glossary defining Job, Customer, Financial Position, Money In, Money Out, Profit, In the Black, and In the Red.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript 5
- **Database & ORM**: Supabase (PostgreSQL) + Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- **Styling**: Tailwind CSS v4 (Mobile-first obsidian dark theme with glowing emerald/crimson accents)
- **Icons**: Lucide Icons
- **Testing**: Vitest automated suite for financial arithmetic and month-boundary calculations
- **Deployment**: Vercel ready

---

## Database Schema & Row Level Security

The complete database schema with Row Level Security (RLS) is located at [`supabase/schema.sql`](file:///supabase/schema.sql):

- **`jobs`**: `id`, `user_id`, `customer`, `description`, `amount`, `completed_at`, `created_at`
- **`expenses`**: `id`, `user_id`, `category`, `description`, `amount`, `incurred_at`, `created_at`
- **Row Level Security**: Both tables enforce strict user-scoped policies (`auth.uid() = user_id`) for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.

To apply this to your Supabase project:
1. Open your Supabase project's **SQL Editor**.
2. Paste and run the contents of [`supabase/schema.sql`](file:///supabase/schema.sql).

---

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

> **Note**: Even if environment variables are not provided during local evaluation, the app automatically runs in resilient demo mode with zero errors.

---

## Local Development & Testing

```bash
# Install dependencies
npm install

# Run automated tests
npm test

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your desktop or mobile browser.

---

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. (Optional) Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel Environment Variables.
4. Deploy!
