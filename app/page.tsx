import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <header className="border-b">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold">
            Ipon
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/sign-in"
              className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100"
            >
              Sign in
            </Link>

            <Link
              href="/auth/sign-up"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex rounded-full border px-4 py-1 text-sm text-gray-600">
            Personal Finance, Made Simple
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Take control of your money.
            <span className="block text-gray-500">
              Start building your future.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Ipon helps you track your income, manage expenses, set savings
            goals, and understand where your money goes.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/auth/sign-up"
              className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
            >
              Start saving
            </Link>

            <Link
              href="/auth/sign-in"
              className="rounded-lg border px-6 py-3 font-medium hover:bg-gray-50"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">
              Everything you need to manage your finances
            </h2>

            <p className="mt-4 text-gray-600">
              Simple tools to help you understand your spending and reach your
              financial goals.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <FeatureCard
              title="Track Transactions"
              description="Record your income and expenses and keep your financial activity organized."
              icon="₱"
            />

            <FeatureCard
              title="Set Savings Goals"
              description="Create savings goals and track your progress toward the things that matter."
              icon="◎"
            />

            <FeatureCard
              title="Understand Your Spending"
              description="See where your money goes with clear summaries and useful financial insights."
              icon="↗"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="rounded-2xl bg-black px-8 py-16 text-center text-white">
          <h2 className="text-3xl font-bold">
            Ready to take control of your finances?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-300">
            Start tracking your money today and turn your financial goals into a
            plan.
          </p>

          <Link
            href="/auth/sign-up"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-medium text-black hover:bg-gray-200"
          >
            Create your account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Ipon</p>

          <p>Manage your money. Build your future.</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg font-bold">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold">{title}</h3>

      <p className="mt-2 leading-7 text-gray-600">{description}</p>
    </div>
  );
}
