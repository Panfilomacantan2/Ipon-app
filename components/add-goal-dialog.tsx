"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createGoal } from "@/lib/actions/goal.action";
import { toast } from "sonner";

const initialState = {
  success: false,
  error: "",
};

const MAX_LENGTH = 100;

export function AddGoalDialog() {
  const [open, setOpen] = useState(false);

  const [state, formAction, pending] = useActionState(createGoal, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (state.success && state.data) {
      toast.success("Category created", {
        description: `"${state.data.name}" has been added to your categories.`,
      });

      formRef.current?.reset();

      setOpen(false);
    }

    if (state.error) {
      toast.error("Failed to create category", {
        description: state.error,
      });
    }
  }, [state.success, state.error, state.data]);
  console.log(state);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />Add Goal
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Create a savings goal</DialogTitle>

          <DialogDescription>
            Set a target and deadline for something you want to save for.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Goal name</Label>

            <Input
              id="name"
              name="name"
              placeholder="e.g. Emergency Fund"
              required
            />

            <p className="text-xs text-muted-foreground">
              Give your goal a recognizable name.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">
                Description
                <span className="ml-1 text-muted-foreground">(optional)</span>
              </Label>

              <span className="text-xs text-muted-foreground">
                {value.length}/{MAX_LENGTH}
              </span>
            </div>

            <Textarea
              id="description"
              name="description"
              placeholder="e.g. Save money for unexpected expenses"
              className="resize-none h-24 overflow-y-auto field-sizing-fixed"
              rows={3}
              maxLength={MAX_LENGTH}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          {/* Target Amount */}
          <div className="space-y-2">
            <Label htmlFor="target_amount">Target amount</Label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                ₱
              </span>

              <Input
                id="target_amount"
                name="target_amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="50,000.00"
                className="pl-8"
                required
              />
            </div>

            <p className="text-xs text-muted-foreground">
              How much do you want to save?
            </p>
          </div>

          {/* Target Date */}
          <div className="space-y-2">
            <Label htmlFor="target_date">Target date</Label>

            <Input id="target_date" name="target_date" type="date" required />

            <p className="text-xs text-muted-foreground">
              When do you want to reach this goal?
            </p>
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={pending}>
              {pending ? "Creating..." : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
