# ADR 0001: Direct Jobs and Expenses Data Model

## Context
The application requirements suggest a possible schema with `jobs` and a separate `transactions` table (`type: 'income' | 'expense'`, `job_id`), or a simplified structure. In a sole-trader contractor workflow centered on "Job Done", every completed job represents direct earned income for the current month, and overhead consists of operational expenses.

## Decision
We chose direct `jobs` and `expenses` tables rather than an intermediate dual-write `transactions` ledger.

## Rationale & Trade-offs
- Eliminates synchronization drift between `jobs` and `transactions`.
- Queries for Monthly In (`SUM(amount) FROM jobs WHERE completed_at in current_month`) and Monthly Out (`SUM(amount) FROM expenses WHERE incurred_at in current_month`) are atomic, fast, and simple to secure with Row Level Security (RLS).
- While a generic double-entry ledger would be necessary for complex accounting (installments, split payments, invoice aging), Site VIP / Angus Shield intentionally optimizes for sole traders recording completed jobs in under 30 seconds.
