import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4">
        {/* Main footer */}
        <div className="grid gap-10 py-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex w-fit items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                ₱
              </div>

              <span className="text-xl font-bold tracking-tight">Ipon</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              A simple personal finance app that helps you track your money,
              manage expenses, and reach your financial goals.
            </p>

            <Button className="mt-5" asChild>
              <Link href="/sign-up">Get started</Link>
            </Button>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold">Product</h3>

            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Features
                </Link>
              </li>

              <li>
                <Link
                  href="#how-it-works"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  How it works
                </Link>
              </li>

              <li>
                <Link
                  href="/sign-up"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Get started
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold">Account</h3>

            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/sign-in"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign in
                </Link>
              </li>

              <li>
                <Link
                  href="/sign-up"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Create account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-border" />

        {/* Bottom */}
        <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Ipon. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>

            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
