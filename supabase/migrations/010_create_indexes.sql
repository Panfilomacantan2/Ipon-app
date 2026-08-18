-- 010_create_indexes.sql
-- Purpose: speed up the queries the app actually runs, without indexing
--   columns nobody filters or sorts on
-- Tables/objects created: btree indexes listed below
-- Design rationale (per index):
--   Every foreign key used in a WHERE clause gets an index, because
--   Postgres does NOT automatically index foreign key columns (it only
--   auto-indexes the referenced primary key on the other side).
--   transactions is the highest-traffic table, so it gets the most
--   deliberate indexing, including a composite index for the single most
--   common query shape in the app: "this user's transactions in date
--   order" (dashboard, transaction list, monthly reports).

-- accounts: "give me this user's accounts" (onboarding, account switcher)
create index idx_accounts_user_id on public.accounts (user_id);

-- categories: "give me this user's custom categories" (system categories
-- with user_id = null are comparatively few and full-scanned fine)
create index idx_categories_user_id on public.categories (user_id);

-- transactions: filtering by user, by account, by category, and by date
-- are all real query shapes (dashboard totals, per-account ledger,
-- per-category reports, date-range reports)
create index idx_transactions_user_id on public.transactions (user_id);
create index idx_transactions_account_id on public.transactions (account_id);
create index idx_transactions_category_id on public.transactions (category_id);
create index idx_transactions_transaction_date on public.transactions (transaction_date);

-- composite index: the actual shape of the dashboard/list query is
-- "this user's transactions, most recent first" - a composite index on
-- (user_id, transaction_date) serves that directly, better than Postgres
-- combining two single-column indexes at query time
create index idx_transactions_user_date on public.transactions (user_id, transaction_date desc);

-- goals: "give me this user's goals"
create index idx_goals_user_id on public.goals (user_id);

-- goal_contributions: "give me this goal's contribution history" -
-- this is the join column used by the indirect-ownership RLS policy too
create index idx_goal_contributions_goal_id on public.goal_contributions (goal_id);

-- budgets: "give me this user's budgets" (the UNIQUE constraint from
-- migration 007 already indexes (user_id, category_id, month) together,
-- so a plain user_id lookup is also covered efficiently)
create index idx_budgets_user_id on public.budgets (user_id);

-- transfers: "give me this user's transfer history"
create index idx_transfers_user_id on public.transfers (user_id);

-- recurring_transactions: "give me this user's active recurring items",
-- and "give me everything due to run" for the future scheduled job
create index idx_recurring_transactions_user_id on public.recurring_transactions (user_id);
create index idx_recurring_transactions_next_run_date on public.recurring_transactions (next_run_date) where is_active = true;
