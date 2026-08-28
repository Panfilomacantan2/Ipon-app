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

import { ConfirmDialog } from "./delete-confirm-dialog";
import { deleteAcount } from "@/lib/actions/account.action";
import { EditConfirmDialog } from "./edit-account-dialog";

type Account = {
  id: string;
  name: string;
  type: string;
  currency: string;
  initial_balance: number;
  description: string;
};

type GoalActionsProps = {
  acountId: string;
  acountName: string;
  account: Account;
};

export function AcountActions({
  acountId,
  acountName,
  account,
}: GoalActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

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
          <DropdownMenuItem
            className=""
            onSelect={() => {
              setEditOpen(true);
            }}
          >
            Edit account
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${acountName}"?`}
        description="This action cannot be undone. This will permanently delete this account."
        confirmText="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />

      {/* Edit Confirmation Dialog */}
      <EditConfirmDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title={`Edit "${acountName}"?`}
        description="This action cannot be undone. This will permanently delete this account."
        confirmText="Delete"
        loading={deleting}
        // onConfirm={handleEdit}
        account={account}
      />
    </>
  );
}
