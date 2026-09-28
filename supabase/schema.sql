-- Supabase Schema for "One Login"
-- Run this in the Supabase SQL Editor to set up tables, RLS, and indexes.

-- 1. Create tables
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  customer text not null,
  description text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  category text not null default 'General',
  description text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  incurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- 2. Indexes for fast monthly queries
create index if not exists idx_jobs_user_completed on public.jobs (user_id, completed_at desc);
create index if not exists idx_expenses_user_incurred on public.expenses (user_id, incurred_at desc);

-- 3. Enable Row Level Security (RLS)
alter table public.jobs enable row level security;
alter table public.expenses enable row level security;

-- 4. RLS Policies for jobs
create policy "Users can view their own jobs"
  on public.jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own jobs"
  on public.jobs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own jobs"
  on public.jobs for update
  using (auth.uid() = user_id);

create policy "Users can delete their own jobs"
  on public.jobs for delete
  using (auth.uid() = user_id);

-- 5. RLS Policies for expenses
create policy "Users can view their own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);

create policy "Users can delete their own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);
