-- 011_create_rls_policies.sql
-- Purpose: enforce, at the database level, that a user can only ever
--   read or write their own data - even if application code has a bug,
--   or a request bypasses the Next.js layer entirely (direct API call,
--   Supabase client used from an unexpected context, etc). RLS is the
--   final, non-bypassable layer in the auth chain covered earlier:
--   middleware -> layout getUser() -> Server Action re-check -> RLS.
-- Security note: RLS was already enabled per-table in each table's own
--   migration (enable row level security). A table with RLS enabled and
--   NO policies denies all access by default - so these policies are
--   what makes the tables usable again, scoped correctly.
-- Performance note: every auth.uid() call below is wrapped in
--   (select auth.uid()) rather than called bare. Per Supabase's current
--   guidance, wrapping it lets Postgres evaluate it once per statement
--   as a cached subquery result, instead of re-invoking the function for
--   every row scanned - this matters most on transactions, the
--   highest-traffic table here.

-- =========================================================
-- profiles: row's own PK IS the owner ((select auth.uid()) = id)
-- =========================================================
create policy "profiles_select_own" on public.profiles
  for select using ( (select auth.uid()) = id );
create policy "profiles_update_own" on public.profiles
  for update using ( (select auth.uid()) = id );
-- no insert policy: the profile row is created by a trigger/server
-- action at signup time using the service role or an explicit insert
-- immediately after auth.uid() is known to equal the new user's id.
-- no delete policy: profile deletion cascades from auth.users deletion,
-- handled by Supabase Auth, not by direct user-facing deletes.

-- =========================================================
-- accounts, transactions, goals, budgets, transfers,
-- recurring_transactions: all directly owned via user_id
-- =========================================================
create policy "accounts_select_own" on public.accounts
  for select using ( (select auth.uid()) = user_id );
create policy "accounts_insert_own" on public.accounts
  for insert with check ( (select auth.uid()) = user_id );
create policy "accounts_update_own" on public.accounts
  for update using ( (select auth.uid()) = user_id );
create policy "accounts_delete_own" on public.accounts
  for delete using ( (select auth.uid()) = user_id );

create policy "transactions_select_own" on public.transactions
  for select using ( (select auth.uid()) = user_id );
create policy "transactions_insert_own" on public.transactions
  for insert with check ( (select auth.uid()) = user_id );
create policy "transactions_update_own" on public.transactions
  for update using ( (select auth.uid()) = user_id );
create policy "transactions_delete_own" on public.transactions
  for delete using ( (select auth.uid()) = user_id );

create policy "goals_select_own" on public.goals
  for select using ( (select auth.uid()) = user_id );
create policy "goals_insert_own" on public.goals
  for insert with check ( (select auth.uid()) = user_id );
create policy "goals_update_own" on public.goals
  for update using ( (select auth.uid()) = user_id );
create policy "goals_delete_own" on public.goals
  for delete using ( (select auth.uid()) = user_id );

create policy "budgets_select_own" on public.budgets
  for select using ( (select auth.uid()) = user_id );
create policy "budgets_insert_own" on public.budgets
  for insert with check ( (select auth.uid()) = user_id );
create policy "budgets_update_own" on public.budgets
  for update using ( (select auth.uid()) = user_id );
create policy "budgets_delete_own" on public.budgets
  for delete using ( (select auth.uid()) = user_id );

create policy "transfers_select_own" on public.transfers
  for select using ( (select auth.uid()) = user_id );
create policy "transfers_insert_own" on public.transfers
  for insert with check ( (select auth.uid()) = user_id );
create policy "transfers_update_own" on public.transfers
  for update using ( (select auth.uid()) = user_id );
create policy "transfers_delete_own" on public.transfers
  for delete using ( (select auth.uid()) = user_id );

create policy "recurring_transactions_select_own" on public.recurring_transactions
  for select using ( (select auth.uid()) = user_id );
create policy "recurring_transactions_insert_own" on public.recurring_transactions
  for insert with check ( (select auth.uid()) = user_id );
create policy "recurring_transactions_update_own" on public.recurring_transactions
  for update using ( (select auth.uid()) = user_id );
create policy "recurring_transactions_delete_own" on public.recurring_transactions
  for delete using ( (select auth.uid()) = user_id );

-- =========================================================
-- categories: DUAL policy. user_id null = system category (readable by
-- everyone, writable by no one through this policy set). user_id set =
-- private to that user (readable and writable by them only).
-- Note the SELECT and write policies are NOT symmetric on purpose: if
-- SELECT and INSERT/UPDATE/DELETE used the same "user_id is null OR
-- (select auth.uid()) = user_id" condition, a user could edit or delete
-- a system category (user_id is null makes that half of the OR true for
-- anyone). Only the owning user_id branch is allowed to write.
-- =========================================================
create policy "categories_select_system_or_own" on public.categories
  for select using ( user_id is null or (select auth.uid()) = user_id );
create policy "categories_insert_own" on public.categories
  for insert with check ( (select auth.uid()) = user_id );
create policy "categories_update_own" on public.categories
  for update using ( (select auth.uid()) = user_id );
create policy "categories_delete_own" on public.categories
  for delete using ( (select auth.uid()) = user_id );

-- =========================================================
-- goal_contributions: INDIRECT ownership. This table has no user_id
-- column, so (select auth.uid()) = user_id is not possible to write -
-- it would fail to compile since the column doesn't exist. Instead, the
-- policy proves ownership by checking that a row exists in goals where
-- goals.id = goal_contributions.goal_id AND goals.user_id = auth.uid().
-- This is slightly more expensive than a direct column check (it's a
-- join per row evaluated), which is an acceptable tradeoff here because
-- goal_contributions is low-volume compared to transactions - the table
-- that WOULD get a denormalized user_id if this pattern needed to scale.
-- The (select auth.uid()) wrapping still helps here too: it caches the
-- caller's UID once rather than re-resolving it inside every row's
-- subquery evaluation.
-- =========================================================
create policy "goal_contributions_select_own" on public.goal_contributions
  for select using (
    exists (
      select 1 from public.goals
      where goals.id = goal_contributions.goal_id
      and goals.user_id = (select auth.uid())
    )
  );
create policy "goal_contributions_insert_own" on public.goal_contributions
  for insert with check (
    exists (
      select 1 from public.goals
      where goals.id = goal_contributions.goal_id
      and goals.user_id = (select auth.uid())
    )
  );
create policy "goal_contributions_update_own" on public.goal_contributions
  for update using (
    exists (
      select 1 from public.goals
      where goals.id = goal_contributions.goal_id
      and goals.user_id = (select auth.uid())
    )
  );
create policy "goal_contributions_delete_own" on public.goal_contributions
  for delete using (
    exists (
      select 1 from public.goals
      where goals.id = goal_contributions.goal_id
      and goals.user_id = (select auth.uid())
    )
  );
