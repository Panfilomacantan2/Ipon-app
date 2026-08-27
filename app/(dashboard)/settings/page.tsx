import {
  User,
  Bell,
  Palette,
  Shield,
  LogOut,
  Trash2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account, preferences, and application settings.
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>

            <div>
              <CardTitle>Profile</CardTitle>

              <CardDescription>
                Manage your personal information.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                value={user.email ?? ""}
                disabled
              />

              <p className="text-xs text-muted-foreground">
                Your email is managed by your authentication provider.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>

              <Input
                id="name"
                placeholder="Your name"
              />
            </div>
          </div>

          <Button>
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Palette className="h-5 w-5 text-primary" />
            </div>

            <div>
              <CardTitle>Preferences</CardTitle>

              <CardDescription>
                Customize how Ipon works for you.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Currency */}
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="font-medium">Currency</p>

              <p className="text-sm text-muted-foreground">
                Choose the currency used throughout your account.
              </p>
            </div>

            <Select defaultValue="PHP">
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="PHP">PHP (₱)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-start gap-3">
              <Bell className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="font-medium">Notifications</p>

                <p className="text-sm text-muted-foreground">
                  Receive reminders and updates about your finances.
                </p>
              </div>
            </div>

            <Switch />
          </div>

          <Separator />

          {/* Monthly summary */}
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="font-medium">Monthly Summary</p>

              <p className="text-sm text-muted-foreground">
                Receive a summary of your income and expenses.
              </p>
            </div>

            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>

            <div>
              <CardTitle>Security</CardTitle>

              <CardDescription>
                Manage your account security.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button variant="outline">
            Change Password
          </Button>

          <p className="text-sm text-muted-foreground">
            You will be redirected to the password management page.
          </p>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">
            Danger Zone
          </CardTitle>

          <CardDescription>
            Actions here can permanently affect your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Sign out</p>

              <p className="text-sm text-muted-foreground">
                Sign out of your Ipon account on this device.
              </p>
            </div>

            <Button variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <Separator />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Delete Account</p>

              <p className="text-sm text-muted-foreground">
                Permanently delete your account and financial data.
              </p>
            </div>

            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}