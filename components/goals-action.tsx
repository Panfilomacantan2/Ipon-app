"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { deleteGoal, contributeGoal } from "@/lib/actions/goal.action";
import { ConfirmDialog } from "./confirm-dialog";
import { ContributeGoalDialog } from "./contribution-goal-dialog";

type GoalActionsProps = {
  goal: {
    id: string;
    name: string;
    target_amount: number;
    current_amount: number;
    status: "active" | "completed";
    created_at: string;
    user_id: string;
  };
  account: {
    id: string;
    name: string;
    balance: number;
    user_id: string;
  } | null;
};

export function GoalActions({ goal, account }: GoalActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [contributionOpen, setContributionOpen] = useState(false);

  async function handleDelete() {
    setDeleting(true);

    try {
      const result = await deleteGoal(goal.id);

      if (!result.success) {
        toast.error("Failed to delete goal", {
          description: result.error,
        });

        return;
      }

      toast.success("Goal deleted", {
        description: `${goal.name} has been deleted.`,
      });

      setDeleteOpen(false);
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong", {
        description: "Failed to delete the goal.",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />

            <span className="sr-only">Goal actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit goal</DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => {
              setContributionOpen(true);
              console.log("hello world");
            }}
          >
            Add savings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive"
            onSelect={() => {
              setDeleteOpen(true);
            }}
          >
            Delete goal
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Contribute Dialog />*/}
      <ContributeGoalDialog
        open={contributionOpen}
        onOpenChange={setContributionOpen}
        goal={goal}
        account={account}
        contributeAction={contributeGoal}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${goal.name}"?`}
        description="This action cannot be undone. This will permanently delete this savings goal."
        confirmText="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
