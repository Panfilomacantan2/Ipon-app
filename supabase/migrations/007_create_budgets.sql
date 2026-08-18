-- 007_create_budgets.sql
-- Purpose: a monthly spending limit set per category
-- Tables/objects created: public.budgets
-- Relationships: budgets.user_id -> profiles.id
--   budgets.category_id -> categories.id
-- Constraints: PK, 2 FKs, NOT NULL, CHECK amount > 0,
--   UNIQUE(user_id, category_id, month)
-- Indexes: added in 010_create_indexes.sql
-- RLS: enabled here, policies added in 011_create_rls_policies.sql
-- Design rationale: like goals, this table stores only the TARGET amount.
--   "Amount spent so far" is computed by summing transactions for that
--   category and month at query time - never stored, so it can't drift.
--   month is stored as a date normalized to the 1st of the month
--   (e.g. 2026-08-01) rather than as two separate integer columns for
--   year and month - this keeps the column directly comparable and
--   sortable, and works naturally with Postgres's date_trunc('month', ...)
--   when matching against transaction_date.

create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  amount numeric(14,2) not null check (amount > 0),
  month date not null,
  created_at timestamptz not null default now(),
  constraint budgets_unique_per_month unique (user_id, category_id, month),
  constraint budgets_month_is_first_of_month check (extract(day from month) = 1)
);

comment on table public.budgets is
  'Monthly spending limit per category. month is normalized to the 1st of the month. Amount spent is derived from transactions, never stored.';

alter table public.budgets enable row level security;
