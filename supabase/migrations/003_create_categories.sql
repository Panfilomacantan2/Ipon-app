-- 003_create_categories.sql
-- Purpose: transaction categories, shared between system defaults and
--   user-created custom categories
-- Tables/objects created: public.categories
-- Relationships: categories.user_id -> profiles.id (nullable)
-- Constraints: PK, FK (nullable), NOT NULL, CHECK on type
-- Indexes: added in 010_create_indexes.sql
-- RLS: enabled here, requires a DUAL policy in 011 (see note below)
-- Security: user_id = null means a system category visible to everyone;
--   a real UUID means it is private to that user. RLS must allow
--   SELECT on both cases but only allow INSERT/UPDATE/DELETE on rows
--   the user actually owns - otherwise a user could edit or delete a
--   system category that every other user depends on.
-- Design rationale: a nullable owner column lets one table serve both
--   "system category" and "user category" without a second table and
--   without a UNION at query time. The tradeoff is that every RLS policy
--   on this table needs two branches instead of one - documented in
--   011_create_rls_policies.sql.

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  icon text,
  color text,
  created_at timestamptz not null default now()
);

comment on table public.categories is
  'System categories have user_id = null (visible to all). User categories have user_id set (private to that user).';

alter table public.categories enable row level security;
