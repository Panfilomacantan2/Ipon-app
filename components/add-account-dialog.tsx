"use client";

import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAccount } from "@/lib/actions/account.action";
import { SubmitButton } from "./submit-button";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { AccountActionState } from "@/lib/types/action.type";

const initialState: AccountActionState = {
  success: false,
  error: "",
};

export function AddAccountDialog() {
  const [state, formAction, pending] = useActionState(
    createAccount,
    initialState,
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!state.data) return;

    toast.success("Account created", {
      description: "Your account has been successfully created.",
    });

    console.log("action state: ", state.data);
    setOpen(false);
  }, [state.data, state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Add a new account</DialogTitle>

          <DialogDescription>
            Add a bank account, e-wallet, cash wallet, or another account you
            use to manage your money.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-5">
          {/* Account Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Account name</Label>

            <Input id="name" placeholder="e.g. GCash" name="name" required />

            <p className="text-xs text-muted-foreground">
              Give your account a recognizable name.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Account Type */}
            <div className="space-y-2">
              <Label>Account type</Label>

              <Select name="type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>

                  <SelectItem value="bank">Bank Account</SelectItem>

                  <SelectItem value="e_wallet">E-wallet</SelectItem>

                  <SelectItem value="credit_card">Credit Card</SelectItem>

                  <SelectItem value="investment">Investment</SelectItem>

                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* currency */}
            <div className="space-y-2">
              <Label>Account currency</Label>

              <Select defaultValue="PHP" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="PHP">Philippine Peso (₱)</SelectItem>
                </SelectContent>
              </Select>

              <input type="hidden" name="currency" value="PHP" />
            </div>
          </div>

          {/* Initial Balance */}
          <div className="space-y-2">
            <Label htmlFor="balance">Current balance</Label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                ₱
              </span>

              <Input
                id="balance"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="pl-8"
                name="balance"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Enter the current amount available in this account.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description
              <span className="ml-1 text-muted-foreground">(optional)</span>
            </Label>

            <Input
              id="description"
              placeholder="e.g. Main savings account"
              name="description"
            />
          </div>

          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
