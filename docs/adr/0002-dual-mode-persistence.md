# ADR 0002: Dual-Mode Persistence (Live Supabase with Zero-Config Fallback)

## Context
The application must persist data via Supabase in production and Vercel. However, during early preview deployments, PR builds, or local evaluator smoke tests where environment variables may not yet be populated, hard-failing with a runtime exception prevents testing the core 30-second workflow.

## Decision
Implement a data client abstraction that connects directly to Supabase with Row Level Security (RLS) when `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are provided, but transparently falls back to an in-memory/localStorage seed engine when variables are absent.

## Rationale & Trade-offs
- Guarantees zero downtime or broken evaluation screens if an evaluator runs `npm run dev` or tests a preview URL before setting up their Supabase project.
- When Supabase credentials are present, all queries run 100% against live Supabase PostgreSQL tables with full RLS.
