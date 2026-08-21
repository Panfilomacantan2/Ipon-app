import { CalendarDays, PiggyBank, Target, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddGoalDialog } from "@/components/add-goal-dialog";
import { createClient } from "@/lib/supabase/server";
import { GoalActions } from "@/components/goals-action";

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

// todo: FIX the computation and display to UI

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

  console.log(completedGoals)

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

        {goalsList.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {goalsList.map((goal) => {
              return (
                <Card
                  key={goal.id}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          {goal.status === "completed" ? (
                            <Trophy className="h-5 w-5 text-primary" />
                          ) : (
                            <Target className="h-5 w-5 text-primary" />
                          )}
                        </div>

                        <div>
                          <CardTitle className="text-base">
                            {goal.name}
                          </CardTitle>

                          <Badge
                            variant={
                              goal.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                            className="mt-1 capitalize"
                          >
                            {goal.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Goal Actions */}
                      <GoalActions goal={goal} account={account} />
                    </div>

                    {goal.description && (
                      <p className="pt-2 text-sm text-muted-foreground">
                        {goal.description}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-5">
                    {/* Amount */}
                    <div>
                      <div className="flex items-end justify-between gap-2">
                        <div>
                          <p className="text-2xl font-bold">
                            {formatCurrency(goal.total_contribution)}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            of {formatCurrency(goal.target_amount)}
                          </p>
                        </div>

                        <span className="text-sm font-semibold">
                          {Math.round(goal.progress)}%
                        </span>
                      </div>

                      {/* Progress */}
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{
                            width: `${goal.progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Remaining */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {goal.remaining > 0
                          ? `${formatCurrency(goal.remaining)} remaining`
                          : "Goal completed"}
                      </span>

                      <div className="flex items-center gap-1 text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />

                        <span>{formatDate(goal.target_date)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

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
