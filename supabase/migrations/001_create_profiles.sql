-- 001_create_profiles.sql
-- Purpose: application-level user data, separate from Supabase's auth.users
-- Tables/objects created: public.set_updated_at() trigger function, public.profiles
-- Relationships: profiles.id -> auth.users.id (1:1, same UUID)
-- Constraints: PK, FK to auth.users, NOT NULL on required fields
-- Indexes: none beyond the PK (PK already indexes id)
-- RLS: enabled here, policies added in 011_create_rls_policies.sql
-- Security: id is never generated independently - it is always the
--   authenticated user's own auth.users.id, so there is no separate
--   "who owns this row" column to protect - the row's own PK is the owner.
-- Design rationale: auth.users is a Supabase-managed system table. We do not
--   add application columns to it, and we never copy authentication secrets
--   (password hashes, auth provider tokens) into profiles. profiles only
--   holds data our application needs to render the UI and personalize
--   behavior (display name, currency, timezone).

-- Shared trigger function used by every table with an updated_at column.
-- Created once here since profiles is the first migration; referenced by
-- every later migration instead of being redefined per table.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  currency text not null default 'PHP',
  timezone text not null default 'Asia/Manila',
  has_completed_onboarding boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Application-specific data for each authenticated user. id mirrors auth.users.id.';

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

alter table public.profiles enable row level security;
