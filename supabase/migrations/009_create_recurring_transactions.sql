-- 009_create_recurring_transactions.sql
-- Purpose: a template describing a transaction that repeats on a schedule
--   (e.g. PHP 25,000 salary, monthly) - not a scheduler itself
-- Tables/objects created: public.recurring_transactions
-- Relationships: recurring_transactions.user_id -> profiles.id
--   recurring_transactions.account_id -> accounts.id
--   recurring_transactions.category_id -> categories.id
-- Constraints: PK, 3 FKs, NOT NULL, CHECK on type, CHECK on frequency,
--   CHECK amount > 0
-- Indexes: added in 010_create_indexes.sql
-- RLS: enabled here, policies added in 011_create_rls_policies.sql
-- Design rationale: this table intentionally stores only WHAT should
--   happen and WHEN it's next due (next_run_date) - it does not create
--   transaction rows itself and there is no cron job in this migration
--   set. Keeping the schema this simple means automated processing can
--   be added later (e.g. a scheduled job that reads rows where
--   next_run_date <= today, inserts a matching row into transactions,
--   and advances next_run_date) without any schema redesign - the job
--   just needs to read this table and write to transactions.

create table public.recurring_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  type text not null check (type in ('income', 'expense')),
  amount numeric(14,2) not null check (amount > 0),
  description text,
  frequency text not null check (frequency in ('daily', 'weekly', 'monthly', 'yearly')),
  next_run_date date not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.recurring_transactions is
  'Template for a repeating transaction. Describes what/when only - no automated processing happens from this migration set alone.';

create trigger set_recurring_transactions_updated_at
  before update on public.recurring_transactions
  for each row
  execute function public.set_updated_at();

alter table public.recurring_transactions enable row level security;
