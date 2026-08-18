import {
  Wallet,
  Landmark,
  CreditCard,
  Banknote,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AddAccountDialog } from "@/components/add-account-dialog";
import { createClient } from "@/lib/supabase/server";

const account = [
  {
    id: "1",
    name: "GCash",
    type: "E-wallet",
    balance: 1000,
    icon: Wallet,
  },
  {
    id: "2",
    name: "BPI Savings",
    type: "Bank Account",
    balance: 15000,
    icon: Landmark,
  },
  {
    id: "3",
    name: "Cash Wallet",
    type: "Cash",
    balance: 2500,
    icon: Banknote,
  },
  {
    id: "4",
    name: "BDO Credit Card",
    type: "Credit Card",
    balance: -3500,
    icon: CreditCard,
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}

export default async function AccountsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Get only this user's accounts
  const { data: accounts, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.log(error);
  }

  const accountList = accounts ?? [];

  console.log(accounts);

  const totalBalance = accountList.reduce(
    (total, account) => total + account.initial_balance,
    0,
  );
  const activeAccounts = accountList.filter(
    (account) => account.initial_balance > 0,
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your bank accounts, e-wallets, cash, and credit cards.
          </p>
        </div>

        <AddAccountDialog />
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>

            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Across all accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Accounts
            </CardTitle>

            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{activeAccounts}</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Accounts with available funds
            </p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Number of Accounts
            </CardTitle>

            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{accountList.length}</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Bank, e-wallet, cash, and credit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Your Accounts</h2>

            <p className="text-sm text-muted-foreground">
              Your connected financial accounts.
            </p>
          </div>
        </div>

        {/* Account Grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {accountList.map((account) => {
            const Icon = account.icon;
            const isNegative = account.initail_balance < 0;

            return (
              <Card
                key={account.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex items-center gap-3">
                    {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                      <Icon className="h-5 w-5" />
                    </div> */}

                    <div>
                      <CardTitle className="text-base">
                        {account.name}
                      </CardTitle>

                      <Badge variant="secondary" className="mt-1 font-normal">
                        {account.type}
                      </Badge>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />

                        <span className="sr-only">Account actions</span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit account</DropdownMenuItem>

                      <DropdownMenuItem>View transactions</DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem className="text-destructive">
                        Delete account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Current balance
                  </p>

                  <p
                    className={`mt-1 text-2xl font-bold ${
                      isNegative ? "text-destructive" : ""
                    }`}
                  >
                    {formatCurrency(account.initial_balance)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Empty-state friendly action */}
      {accountList.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Wallet className="h-6 w-6" />
            </div>

            <h3 className="mt-4 font-semibold">No accounts yet</h3>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Add your first bank account, e-wallet, or cash wallet to start
              tracking your finances.
            </p>

            <div className="mt-5">
              <AddAccountDialog />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
