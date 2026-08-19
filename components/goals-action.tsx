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

import { deleteGoal } from "@/lib/actions/goal.action";
import { ConfirmDialog } from "./confirm-dialog";

type GoalActionsProps = {
  goalId: string;
  goalName: string;
};

export function GoalActions({ goalId, goalName }: GoalActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);

    try {
      const result = await deleteGoal(goalId);

      if (!result.success) {
        toast.error("Failed to delete goal", {
          description: result.error,
        });

        return;
      }

      toast.success("Goal deleted", {
        description: `${goalName} has been deleted.`,
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

          <DropdownMenuItem>Add savings</DropdownMenuItem>

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

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${goalName}"?`}
        description="This action cannot be undone. This will permanently delete this savings goal."
        confirmText="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
