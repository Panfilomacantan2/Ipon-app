-- 006_create_goal_contributions.sql
-- Purpose: individual deposits toward a goal - the ledger that goals.target
--   progress is computed from
-- Tables/objects created: public.goal_contributions
-- Relationships: goal_contributions.goal_id -> goals.id (many contributions
--   per goal). NOTE: this table has NO user_id column - ownership is
--   indirect, through goals.user_id.
-- Constraints: PK, FK, NOT NULL, CHECK amount > 0
-- Indexes: added in 010_create_indexes.sql
-- RLS: enabled here. Because there is no user_id on this table, the
--   policy in 011_create_rls_policies.sql cannot use auth.uid() = user_id
--   directly - it uses an EXISTS subquery that joins to goals and checks
--   goals.user_id instead. This is the "indirect ownership" case flagged
--   in the spec: a policy that assumed user_id existed here would fail to
--   even parse, since the column doesn't exist.
-- Design rationale: contributions are an append-only ledger, not a
--   mutable field, for full auditability - a user can see exactly when
--   and how much they added toward a goal, not just the current total.
--   This table is low-volume (a handful of contributions per goal,
--   compared to potentially thousands of transactions), so the extra
--   join cost of the indirect-ownership RLS check is an acceptable
--   tradeoff for not denormalizing user_id onto every child table.

create table public.goal_contributions (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  amount numeric(14,2) not null check (amount > 0),
  contribution_date date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

comment on table public.goal_contributions is
  'Append-only ledger of deposits toward a goal. No user_id - ownership is indirect via goals.user_id.';

alter table public.goal_contributions enable row level security;
