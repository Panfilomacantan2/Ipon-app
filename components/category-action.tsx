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

import { deleteCategory } from "@/lib/actions/category.action";
import { ConfirmDialog } from "./confirm-dialog";

type GoalActionsProps = {
  categoryId: string;
  categoryName: string;
};

export function CategoryActions({ categoryId, categoryName }: GoalActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);

    try {
      const result = await deleteCategory(categoryId);

      if (!result.success) {
        toast.error("Failed to delete category", {
          description: result.error,
        });

        return;
      }
      toast.success("Category deleted", {
        description: `${categoryName} has been deleted.`,
      });

      setDeleteOpen(false);
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong", {
        description: "Failed to delete the category.",
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

            <span className="sr-only">Category actions</span>
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
            Delete category
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${categoryName}"?`}
        description="This action cannot be undone. This will permanently delete this savings goal."
        confirmText="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  );
}



