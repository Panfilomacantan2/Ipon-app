"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

const steps = [
  {
    title: "Welcome to Ipon 👋",
    description:
      "Let's set up your personal finance space. It will only take a minute.",
  },
  {
    title: "What's your main goal?",
    description: "Choose what you want to focus on with Ipon.",
  },
  {
    title: "You're ready to start!",
    description:
      "Your Ipon account is ready. You can now start managing your money.",
  },
];

const goals = [
  {
    value: "save-money",
    label: "Save more money",
    description: "Build better saving habits.",
  },
  {
    value: "track-expenses",
    label: "Track my expenses",
    description: "Understand where my money goes.",
  },
  {
    value: "emergency-fund",
    label: "Build an emergency fund",
    description: "Prepare for unexpected expenses.",
  },
  {
    value: "savings-goal",
    label: "Reach a savings goal",
    description: "Save for something important to me.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLastStep = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;

  async function completeOnboarding() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profiles", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          has_completed_onboarding: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError(
        "Couldn't reach the server. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    if (isLastStep) {
      completeOnboarding();
      return;
    }

    setStep((current) => current + 1);
  }

  function handleBack() {
    if (step === 0) return;

    setStep((current) => current - 1);
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 px-4 py-8">
      <div className="w-full max-w-xl">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            ₱
          </div>

          <h1 className="text-xl font-semibold tracking-tight">Ipon</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Your personal finance companion
          </p>
        </div>

        {/* Progress */}
        <div className="mb-4 flex items-center justify-between">
          <Badge variant="secondary">
            Step {step + 1} of {steps.length}
          </Badge>

          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% complete
          </span>
        </div>

        <Progress value={progress} className="mb-6 h-2" />

        {/* Inline error banner - replaces alert() */}
        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        {/* Card */}
        <Card className="overflow-hidden shadow-sm">
          {/* STEP 1 */}
          {step === 0 && (
            <>
              <CardHeader className="px-6 pt-8 text-center sm:px-10 sm:pt-10">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-4xl">
                  ₱
                </div>

                <CardTitle className="text-3xl tracking-tight">
                  {steps[step].title}
                </CardTitle>

                <CardDescription className="mx-auto mt-2 max-w-md text-base leading-6">
                  {steps[step].description}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 pb-8 sm:px-10">
                <div className="mt-4 rounded-xl border bg-muted/30 p-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm">
                        ✓
                      </div>

                      <div>
                        <p className="text-sm font-medium">Track your money</p>

                        <p className="text-xs text-muted-foreground">
                          Keep your income and expenses organized.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm">
                        ✓
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          Set financial goals
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Turn your goals into achievable plans.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm">
                        ✓
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          Understand your spending
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Make better decisions with your money.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <>
              <CardHeader className="px-6 pt-8 sm:px-10 sm:pt-10">
                <CardTitle className="text-3xl tracking-tight">
                  {steps[step].title}
                </CardTitle>

                <CardDescription className="mt-2 text-base">
                  {steps[step].description}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 pb-8 sm:px-10">
                <RadioGroup
                  value={goal}
                  onValueChange={setGoal}
                  className="mt-2 space-y-3"
                >
                  {goals.map((item) => {
                    const selected = goal === item.value;

                    return (
                      <label
                        key={item.value}
                        htmlFor={item.value}
                        className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all hover:bg-muted/50 ${
                          selected
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : ""
                        }`}
                      >
                        <RadioGroupItem id={item.value} value={item.value} />

                        <div className="flex-1">
                          <p className="font-medium">{item.label}</p>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <>
              <CardHeader className="px-6 pt-8 text-center sm:px-10 sm:pt-10">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-3xl text-primary">
                  ✓
                </div>

                <CardTitle className="text-3xl tracking-tight">
                  {steps[step].title}
                </CardTitle>

                <CardDescription className="mx-auto mt-2 max-w-md text-base leading-6">
                  {steps[step].description}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 pb-8 sm:px-10">
                {goal && (
                  <div className="rounded-xl border bg-muted/30 p-5">
                    <p className="text-sm text-muted-foreground">
                      Your financial focus
                    </p>

                    <p className="mt-1 font-semibold">
                      {goals.find((item) => item.value === goal)?.label}
                    </p>
                  </div>
                )}
              </CardContent>
            </>
          )}

          <Separator />

          {/* Footer */}
          <CardFooter className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:px-10">
            <div className="flex w-full gap-3">
              {step > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={loading}
                  className="flex-1"
                >
                  Back
                </Button>
              )}

              <Button
                type="button"
                onClick={handleNext}
                disabled={(step === 1 && !goal) || loading}
                className="flex-1"
              >
                {loading
                  ? "Completing..."
                  : isLastStep
                    ? "Go to Dashboard"
                    : "Continue"}
              </Button>
            </div>

            {!isLastStep && (
              <Button
                type="button"
                variant="ghost"
                onClick={completeOnboarding}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Skip for now
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Bottom text */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          You can change your preferences later in Settings.
        </p>
      </div>
    </main>
  );
}
