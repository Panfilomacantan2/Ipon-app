"use client";

import { useActionState, useEffect } from "react";
import { Wallet } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { addContributionGoal } from "@/lib/actions/goal.action";

type Goal = {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
};

type Account = {
  id: string;
  name: string;
  balance: number;
};

type ActionState = {
  success: boolean;
  error?: string;
  message?: string;
};

const initialState: ActionState = { success: false };

export function ContributeGoalDialog({
  open,
  onOpenChange,
  goal,
  account,
  contributeAction,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal;
  account: Account | null;
  contributeAction: (
    previousState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(
    addContributionGoal,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message ?? "Contribution added successfully.");
      onOpenChange(false);
    }

    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  const remaining = Math.max(goal.target_amount - goal.current_amount, 0);
  const progress =
    goal.target_amount > 0
      ? Math.min((goal.current_amount / goal.target_amount) * 100, 100)
      : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contribute to {goal.name}</DialogTitle>
          <DialogDescription>
            Add money to this savings goal from one of your accounts.
          </DialogDescription>
        </DialogHeader>

        {/* Goal Progress */}
        <div className="rounded-xl border bg-muted/40 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{goal.name}</p>
              <p className="text-sm text-muted-foreground">
                ₱{0} of ₱{goal.target_amount.toLocaleString()}
              </p>
            </div>
            <span className="text-sm font-semibold">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="mt-3" />
          <p className="mt-2 text-xs text-muted-foreground">
            ₱{remaining.toLocaleString()} remaining
          </p>
        </div>

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="goal_id" value={goal.id} />
          <input type="hidden" name="account_id" value={account?.id ?? ""} />

          {/* Source Account */}
          {account && (
            <div className="flex items-center gap-2 rounded-lg border p-3 text-sm">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{account.name}</span>
              <span className="ml-auto text-muted-foreground">
                ₱{account.balance.toLocaleString()}
              </span>
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Contribution Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                ₱
              </span>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="0.00"
                className="pl-8"
                required
              />
            </div>
          </div>

          {/* Target Date */}
          <div className="space-y-2">
            <Label htmlFor="contribution_date">Target date</Label>

            <Input id="contribution_date" name="contribution_date" type="date" required />

            <p className="text-xs text-muted-foreground">
              When do you want to reach this goal?
            </p>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">
              Note <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input id="note" name="note" placeholder="e.g. Monthly savings" />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={pending}
              className="w-full sm:w-auto"
            >
              {pending ? "Adding..." : "Add Contribution"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
