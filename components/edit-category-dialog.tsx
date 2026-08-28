"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  Briefcase,
  Car,
  Check,
  GraduationCap,
  Heart,
  Home,
  Plane,
  Receipt,
  ShoppingBag,
  Tags,
  Utensils,
  Wallet,
} from "lucide-react";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

const icons = [
  {
    name: "Utensils",
    icon: Utensils,
  },
  {
    name: "Car",
    icon: Car,
  },
  {
    name: "ShoppingBag",
    icon: ShoppingBag,
  },
  {
    name: "Receipt",
    icon: Receipt,
  },
  {
    name: "Wallet",
    icon: Wallet,
  },
  {
    name: "Briefcase",
    icon: Briefcase,
  },
  {
    name: "Heart",
    icon: Heart,
  },
  {
    name: "Home",
    icon: Home,
  },
  {
    name: "Plane",
    icon: Plane,
  },
  {
    name: "GraduationCap",
    icon: GraduationCap,
  },
];

const colors = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

import { CategoryActionState } from "@/lib/types/action.type";
import { editCategory } from "@/lib/actions/category.action";

type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense";
  user_id: string;
  created_at: string;
};

type EditConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm?: () => void;
  category: Category;
};

const initialState: CategoryActionState = {
  success: false,
  error: "",
};

export function EditConfirmDialog({
  open,
  onOpenChange,
  category,
}: EditConfirmDialogProps) {
  const [state, formAction, pending] = useActionState(
    editCategory,
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);

  const [icon, setIcon] = useState(category.icon);
  const [color, setColor] = useState(category.color);

  useEffect(() => {
    if (state.success && state.data) {
      toast.success("Category created", {
        description: `"${state.data.name}" has been added to your categories.`,
      });

      formRef.current?.reset();
      onOpenChange(false)
    }

    if (state.error) {
      toast.error("Failed to create category", {
        description: state.error,
      });
    }
  }, [state.success, state.error, state.data, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>

          <DialogDescription>
            Make changes to the category below. Categories are used to organize
            your transactions.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-5">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Category name</Label>
            <input type="hidden" name="id" value={category.id} />

            <Input
              id="name"
              defaultValue={category.name}
              name="name"
              placeholder="e.g. Food"
              required
            />

            <p className="text-xs text-muted-foreground">
              Choose a short and recognizable name.
            </p>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Category type</Label>

            <Select name="type" defaultValue={category.type} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>

                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>

            {/* Important: Select value for Server Action */}
            <input type="hidden" name="type" value={category.type} />

            <p className="text-xs text-muted-foreground">
              Expenses are money going out. Income is money coming in.
            </p>
          </div>

          {/* Icon */}
          <div className="space-y-2">
            <Label>Icon</Label>

            <div className="grid grid-cols-5 gap-2">
              {icons.map((item) => {
                const Icon = item.icon;
                const selected = icon === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIcon(item.name)}
                    className={cn(
                      "relative flex h-11 items-center justify-center rounded-lg border transition",
                      "hover:bg-muted",
                      selected && "border-primary bg-primary/10",
                    )}
                  >
                    <Icon className="h-5 w-5" />

                    {selected && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                    )}

                    <span className="sr-only">{item.name}</span>
                  </button>
                );
              })}
            </div>

            <input type="hidden" name="icon" value={icon} />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label>Color</Label>

            <div className="flex flex-wrap gap-2">
              {colors.map((item) => {
                const selected = color === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setColor(item)}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border-2 transition",
                      selected ? "border-foreground" : "border-transparent",
                    )}
                    style={{
                      backgroundColor: item,
                    }}
                    aria-label={`Select color ${item}`}
                  >
                    {selected && <Check className="h-4 w-4 text-white" />}
                  </button>
                );
              })}
            </div>

            <input type="hidden" name="color" value={color} />
          </div>

          {/* Preview */}
          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="mb-3 text-xs font-medium text-muted-foreground">
              Preview
            </p>

            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${color}20`,
                  color,
                }}
              >
                <Tags className="h-5 w-5" />
              </div>

              <div>
                <p className="font-medium">{category.name}</p>

                <p className="text-xs text-muted-foreground">
                  {category.type === "income"
                    ? "Income"
                    : category.type === "expense"
                      ? "Expense"
                      : "Category type"}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating..." : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
