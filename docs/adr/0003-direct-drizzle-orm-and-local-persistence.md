---
status: accepted
---

# ADR 0003: Direct Drizzle ORM and Native Next.js 16 API Persistence

## Context
The project initially included Supabase SDKs (`@supabase/supabase-js`, `@supabase/ssr`) alongside Drizzle ORM. To simplify deployment, eliminate vendor lock-in, and provide a self-contained runtime on Vercel without third-party external auth/db dependencies, Supabase was removed.

## Decision
Use Drizzle ORM with standard PostgreSQL connection pooling (`postgres`) and native Next.js 16 API endpoints (`/api/jobs`, `/api/reset`, `/api/auth`), backed by persistent browser and server caching for zero-setup evaluation.

## Rationale & Trade-offs
- Eliminates Supabase client overhead and third-party dashboard configuration.
- Retains type-safe relational schema definitions with Drizzle ORM.
- Works with any PostgreSQL provider (Vercel Postgres, Neon, AWS RDS, Docker, local Postgres) via `DATABASE_URL`.
- Allows instant out-of-the-box 30-second evaluator demonstration without requiring database provisioning prior to testing.
