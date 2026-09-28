---
status: superseded by ADR-0003
---

# ADR 0002: Dual-Mode Persistence (Live Supabase with Zero-Config Fallback)

## Context
The application initially used Supabase for authentication and persistence. During early preview deployments, PR builds, or local evaluator smoke tests where environment variables may not yet be populated, hard-failing with a runtime exception prevented testing the core 30-second workflow.

## Decision
Implement a data client abstraction that connected to Supabase with Row Level Security (RLS) when keys were provided, with fallback to an in-memory/localStorage seed engine.

## Rationale & Trade-offs
- Superceded by ADR 0003 which replaced Supabase completely with direct Drizzle ORM and native Next.js API routes.
