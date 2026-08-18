-- 008_create_transfers.sql
-- Purpose: moving money between two of a user's own accounts
-- Tables/objects created: public.transfers
-- Relationships: transfers.user_id -> profiles.id
--   transfers.from_account_id -> accounts.id
--   transfers.to_account_id -> accounts.id
-- Constraints: PK, 3 FKs, NOT NULL, CHECK amount > 0,
--   CHECK from_account_id <> to_account_id
-- Indexes: added in 010_create_indexes.sql
-- RLS: enabled here, policies added in 011_create_rls_policies.sql
-- Design rationale: a transfer is deliberately its own table rather than
--   two rows in transactions. GCash -> BDO for PHP 5,000 does not
--   increase or decrease net worth - it just moves money between
--   containers. Modeling it as an expense-from and income-to pair inside
--   transactions would double-count it in every income/expense aggregate
--   (dashboard totals, category reports) unless every one of those
--   queries remembered to filter transfers back out. Keeping transfers
--   separate means income/expense aggregates over the transactions table
--   are correct by construction, with no special-casing required.

create table public.transfers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  from_account_id uuid not null references public.accounts(id) on delete cascade,
  to_account_id uuid not null references public.accounts(id) on delete cascade,
  amount numeric(14,2) not null check (amount > 0),
  transfer_date date not null default current_date,
  note text,
  created_at timestamptz not null default now(),
  constraint transfers_distinct_accounts check (from_account_id <> to_account_id)
);

comment on table public.transfers is
  'Movement of money between a user''s own accounts. Not income or expense - excluded from those aggregates by construction.';

alter table public.transfers enable row level security;
