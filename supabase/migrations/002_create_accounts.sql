-- 002_create_accounts.sql
-- Purpose: a user's money containers (cash, bank, e-wallet, credit card, etc)
-- Tables/objects created: public.accounts
-- Relationships: accounts.user_id -> profiles.id (many accounts per user)
-- Constraints: PK, FK, NOT NULL, CHECK on account type
-- Indexes: added in 010_create_indexes.sql
-- RLS: enabled here, policies added in 011_create_rls_policies.sql
-- Security: user_id is required and will be checked by RLS on every query
-- Design rationale: an account is a container with its own lifecycle
--   (created, renamed, archived) independent of the transactions that flow
--   through it. current_amount is intentionally NOT stored here - the
--   balance is always derived as initial_balance + sum(transactions) at
--   query time, so there is never a stored number that can drift out of
--   sync with the transaction history.

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type text not null check (type in ('cash', 'bank', 'e_wallet', 'credit_card', 'investment', 'other')),
  initial_balance numeric(14,2) not null default 0,
  currency text not null default 'PHP',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.accounts is
  'A user''s money containers. Current balance is derived from initial_balance + transaction history, never stored.';

create trigger set_accounts_updated_at
  before update on public.accounts
  for each row
  execute function public.set_updated_at();

alter table public.accounts enable row level security;
