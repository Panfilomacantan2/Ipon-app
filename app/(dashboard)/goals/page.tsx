import { PiggyBank, Target, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddGoalDialog } from "@/components/add-goal-dialog";
import { createClient } from "@/lib/supabase/server";
import { GoalTabs } from "@/components/goal-tabs";
import { formatCurrency } from "@/lib/utils";


export default async function GoalsPage() {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Get current user's account
  const { data: account } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Get the goal summary for the current user
  const { data: goals, error } = await supabase
    .from("goal_summary")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  console.log(goals);

  if (error) {
    console.error("Failed to fetch goals:", error);
  }

  // Prevent null error
  const goalsList = goals ?? [];

  // Total target
  const totalTarget = goalsList.reduce(
    (total, goal) => total + Number(goal.target_amount),
    0,
  );

  //  Get all the total saved
  const totalSaved = goalsList.reduce(
    (total, goal) => total + Number(goal.total_contribution),
    0,
  );
  // Get all the completed goals
  const completedGoals = goalsList.filter(
    (goal) => goal.status === "completed",
  ).length;

  console.log(completedGoals);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Savings Goals</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Set targets, track your progress, and achieve your financial goals.
          </p>
        </div>

        <AddGoalDialog />
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Saved */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Saved</CardTitle>

            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalSaved)}</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Across all savings goals
            </p>
          </CardContent>
        </Card>

        {/* Total Target */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Target</CardTitle>

            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalTarget)}</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Combined target amount
            </p>
          </CardContent>
        </Card>

        {/* Completed Goals */}
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Goals
            </CardTitle>

            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{completedGoals}</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Goals you&apos;ve achieved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goals */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Your Goals</h2>

          <p className="text-sm text-muted-foreground">
            Track your progress toward each financial goal.
          </p>
        </div>

        {/* Goal tabs  */}
        <GoalTabs goals={goalsList} account={account} />

        {/* Empty State */}
        {goalsList.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Target className="h-6 w-6" />
              </div>

              <h3 className="mt-4 font-semibold">No savings goals yet</h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Create your first savings goal and start working toward it.
              </p>

              <div className="mt-5">
                <AddGoalDialog />
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
