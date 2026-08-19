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
import { deleteAcount } from "@/lib/actions/account.action";

type GoalActionsProps = {
  acountId: string;
  acountName: string;
};

export function AcountActions({ acountId, acountName }: GoalActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);

    try {
      const result = await deleteAcount(acountId);

      if (!result.success) {
        toast.error("Failed to delete account", {
          description: result.error,
        });

        return;
      }

      toast.success("Account deleted", {
        description: `${acountName} has been deleted.`,
      });

      setDeleteOpen(false);
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong", {
        description: "Failed to delete the account.",
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
          <DropdownMenuItem>Edit acount</DropdownMenuItem>

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
        title={`Delete "${acountName}"?`}
        description="This action cannot be undone. This will permanently delete this savings goal."
        confirmText="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  );
}



