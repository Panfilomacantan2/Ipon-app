"use client";

import { Plus } from "lucide-react";

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
import { SubmitButton } from "./submit-button";
import { AccountActionState } from "@/lib/types/action.type";
import { editAccount } from "@/lib/actions/account.action";
import { useActionState, useEffect } from "react";

type Account = {
  id: string;
  name: string;
  type: string;
  currency: string;
  initial_balance: number;
  description: string;
};

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm?: () => void;
  account: Account;
};

const initialState: AccountActionState = {
  success: false,
  error: "",
};

export function EditConfirmDialog({
  open,
  onOpenChange,
  account,
}: ConfirmDialogProps) {
  const [state, formAction, pending] = useActionState(
    editAccount,
    initialState,
  );

  useEffect(() => {
    if (state && state.success) {
      onOpenChange(false);
    }
  }, [state, state?.success, onOpenChange]);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>

          <DialogDescription>
            Edit your account details below.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" action={formAction}>
          <input type="hidden" name="id" defaultValue={account.id} />
          {/* Account Name */}

          <div className="space-y-2">
            <Label htmlFor="name">Account name</Label>

            <Input
              id="name"
              placeholder="e.g. GCash"
              defaultValue={account.name}
              name="name"
              required
            />

            <p className="text-xs text-muted-foreground">
              Give your account a recognizable name.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Account Type */}
            <div className="space-y-2">
              <Label>Account type</Label>

              <Select name="type" defaultValue={account.type} required>
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

              <Select name="currency" defaultValue={account.currency} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="PHP">Philippine Peso (₱)</SelectItem>

                  <SelectItem value="USD">US Dollar ($)</SelectItem>

                  <SelectItem value="EUR">Euro (€)</SelectItem>

                  <SelectItem value="GBP">British Pound (£)</SelectItem>
                </SelectContent>
              </Select>
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
                defaultValue={account.initial_balance}
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
              defaultValue={account.description}
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
