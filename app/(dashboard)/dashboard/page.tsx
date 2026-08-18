import { ArrowDownRight, ArrowUpRight, Wallet, PiggyBank } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  // const { data } = await supabase.auth.getUser();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>

        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your money.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>

            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">₱25,500.00</div>

            <p className="mt-1 text-xs text-muted-foreground">
              Across all accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>

            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">₱30,000.00</div>

            <p className="mt-1 text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>

            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">₱8,500.00</div>

            <p className="mt-1 text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Savings</CardTitle>

            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">₱21,500.00</div>

            <p className="mt-1 text-xs text-muted-foreground">
              Available after expenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Spending Overview */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <p className="font-medium">Chart goes here</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Connect your transaction data to display your spending.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Savings Goal */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Savings Goal</CardTitle>

              <Badge>68%</Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Emergency Fund</span>

                  <span className="font-medium">₱34,000 / ₱50,000</span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: "68%" }}
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                ₱16,000 remaining to reach your goal.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <Transaction
              name="Salary"
              category="Income"
              amount="+₱25,000"
              positive
            />

            <Transaction name="Groceries" category="Food" amount="-₱1,250" />

            <Transaction
              name="Electric Bill"
              category="Utilities"
              amount="-₱1,800"
            />

            <Transaction
              name="Transportation"
              category="Transport"
              amount="-₱500"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Transaction({
  name,
  category,
  amount,
  positive = false,
}: {
  name: string;
  category: string;
  amount: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{name}</p>

        <p className="text-sm text-muted-foreground">{category}</p>
      </div>

      <p className={`font-medium ${positive ? "text-green-600" : ""}`}>
        {amount}
      </p>
    </div>
  );
}
