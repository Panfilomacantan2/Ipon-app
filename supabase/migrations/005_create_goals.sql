-- 005_create_goals.sql
-- Purpose: savings goals a user is working toward
-- Tables/objects created: public.goals
-- Relationships: goals.user_id -> profiles.id
-- Constraints: PK, FK, NOT NULL, CHECK on status, CHECK target_amount > 0
-- Indexes: added in 010_create_indexes.sql
-- RLS: enabled here, policies added in 011_create_rls_policies.sql
-- Design rationale: this table deliberately has no current_amount column.
--   Progress is derived by summing goal_contributions for this goal at
--   query time (see 006_create_goal_contributions.sql). A mutable
--   "current_amount" field would be a second source of truth that could
--   drift from the actual contribution history through a missed update,
--   a race condition, or a bug - and would lose the "how did I get here"
--   record entirely.

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  target_amount numeric(14,2) not null check (target_amount > 0),
  target_date date,
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.goals is
  'Savings targets. Progress is derived by summing goal_contributions, never stored directly.';

create trigger set_goals_updated_at
  before update on public.goals
  for each row
  execute function public.set_updated_at();

alter table public.goals enable row level security;
