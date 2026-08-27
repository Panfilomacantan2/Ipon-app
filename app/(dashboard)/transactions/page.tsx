import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowLeftRight,
  MoreHorizontal,
  Wallet,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// import { AddTransactionDialog } from "@/components/add-transaction-dialog";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default async function TransactionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Transactions
  const { data: transactions, error: transactionsError } = await supabase
    .from("transactions")
    .select(
      `
        *,
        accounts (
          id,
          name
        ),
        categories (
          id,
          name,
          type,
          icon,
          color
        )
      `,
    )
    .eq("user_id", user.id)
    .order("transaction_date", {
      ascending: false,
    });

  // Accounts
  const { data: accounts, error: accountsError } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)
    .order("name");

  // Categories
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("name");

  if (transactionsError) {
    console.error("Failed to fetch transactions:", transactionsError);
  }

  if (accountsError) {
    console.error("Failed to fetch accounts:", accountsError);
  }

  if (categoriesError) {
    console.error("Failed to fetch categories:", categoriesError);
  }

  const transactionList = transactions ?? [];
  const accountList = accounts ?? [];
  const categoryList = categories ?? [];

  // Summary
  const income = transactionList
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const expenses = transactionList
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const balance = income - expenses;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Track your income and expenses.
          </p>
        </div>

        {/* <AddTransactionDialog
          accounts={accountList}
          categories={categoryList}
        /> */}
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Income */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>

            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(income)}</p>

            <p className="mt-1 text-xs text-muted-foreground">Total income</p>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>

            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(expenses)}</p>

            <p className="mt-1 text-xs text-muted-foreground">Total expenses</p>
          </CardContent>
        </Card>

        {/* Net Balance */}
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>

            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <p
              className={`text-2xl font-bold ${
                balance < 0 ? "text-destructive" : ""
              }`}
            >
              {formatCurrency(balance)}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Income minus expenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                View and manage your transactions.
              </p>
            </div>

            <Badge variant="secondary">
              {transactionList.length} transactions
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {transactionList.length === 0 ? (
            <EmptyTransactions />
          ) : (
            <div className="divide-y">
              {transactionList.map((transaction) => {
                const isIncome = transaction.type === "income";

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    {/* Left */}
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isIncome ? "bg-green-500/10" : "bg-muted"
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {transaction.description || "Untitled transaction"}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>
                            {transaction.categories?.name ?? "Uncategorized"}
                          </span>

                          <span>•</span>

                          <span>
                            {transaction.accounts?.name ?? "Unknown account"}
                          </span>

                          <span>•</span>

                          <span>
                            {formatDate(transaction.transaction_date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex shrink-0 items-center gap-3">
                      <p
                        className={`font-semibold ${
                          isIncome ? "text-green-600" : "text-foreground"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {formatCurrency(Number(transaction.amount))}
                      </p>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />

                            <span className="sr-only">Transaction actions</span>
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit transaction</DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem className="text-destructive">
                            Delete transaction
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyTransactions() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <ArrowLeftRight className="h-6 w-6 text-muted-foreground" />
      </div>

      <h3 className="mt-4 font-semibold">No transactions yet</h3>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Add your first income or expense to start tracking your finances.
      </p>
    </div>
  );
}
