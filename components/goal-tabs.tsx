import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "./ui/badge";
import { CalendarDays, Target, Trophy } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AddGoalDialog } from "./add-goal-dialog";
import { GoalActions } from "./goals-action";
import { GoalSummary } from "@/lib/types/goal.types";

type GoalActionProps = {
  goals: GoalSummary[];
  account: any[];
};

export function GoalTabs({ goals, account }: GoalActionProps) {
  const activeGoals = goals.filter((goal) => goal.status === "active");
  const completedGoals = goals.filter((goal) => goal.status === "completed");
  const cancelledGoals = goals.filter((goal) => goal.status === "cancelled");

  console.log(" from goal tabs", account);

  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList>
        <TabsTrigger value="active">
          Active
          <Badge variant="secondary" className="ml-2">
            {activeGoals.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed
          <Badge variant="secondary" className="ml-2">
            {completedGoals.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="cancelled">
          Cancelled
          <Badge variant="secondary" className="ml-2">
            {cancelledGoals.length}
          </Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <GoalGrid categories={activeGoals} account={account} />
      </TabsContent>
      <TabsContent value="completed">
        <GoalGrid categories={completedGoals} account={account} />
      </TabsContent>
      <TabsContent value="cancelled">
        <GoalGrid categories={cancelledGoals} account={account} />
      </TabsContent>
    </Tabs>
  );
}

function GoalGrid({
  categories,
  account,
}: {
  categories: GoalSummary[];
  account: any;
}) {
  if (categories.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((goal) => {
        return (
          <Card key={goal.id} className="transition-shadow hover:shadow-md">
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
                    <CardTitle className="text-base">{goal.name}</CardTitle>

                    <Badge
                      variant={
                        goal.status === "completed" ? "default" : "secondary"
                      }
                      className="mt-1 capitalize"
                    >
                      {goal.status}
                    </Badge>
                  </div>
                </div>

                {/* Goal Actions */}
                {goal.status !== "completed" && (
                  <GoalActions goal={goal} account={account} />
                )}
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
  );
}
