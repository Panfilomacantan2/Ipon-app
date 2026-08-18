-- 004_create_transactions.sql
-- Purpose: the core ledger - every income or expense entry
-- Tables/objects created: public.transactions
-- Relationships: transactions.user_id -> profiles.id
--   transactions.account_id -> accounts.id
--   transactions.category_id -> categories.id
-- Constraints: PK, 3 FKs, NOT NULL, CHECK on type, CHECK amount > 0
-- Indexes: added in 010_create_indexes.sql (this is the highest-traffic
--   table in the app, so indexing choices matter most here)
-- RLS: enabled here, policies added in 011_create_rls_policies.sql
-- Security: user_id is denormalized onto this table (rather than only
--   reachable through accounts.user_id) specifically so the RLS policy
--   can check auth.uid() = user_id directly with no join. Given this is
--   the table queried on every dashboard load, avoiding a join here
--   matters more than it does for the low-volume goal_contributions table.
-- Design rationale: amount is always stored positive; the sign is implied
--   by type (income/expense). Storing signed amounts would let a bug
--   flip a value's meaning silently (a negative "income" row would net
--   out like an expense with no error raised). Positive-only amounts plus
--   an explicit type column make every aggregate query self-documenting:
--   sum(amount) where type = 'expense' is unambiguous.

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  type text not null check (type in ('income', 'expense')),
  amount numeric(14,2) not null check (amount > 0),
  description text,
  transaction_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.transactions is
  'Every income/expense entry. amount is always positive; type determines its effect on balance. category_id is ON DELETE RESTRICT so a category in use cannot be silently removed.';

create trigger set_transactions_updated_at
  before update on public.transactions
  for each row
  execute function public.set_updated_at();

alter table public.transactions enable row level security;
