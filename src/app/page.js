
import Link from "next/link";
import { siteConfig } from "@/lib/content";

const features = [
  {
    number: "01",
    icon: "◈",
    title: "Organize your tasks",
    description:
      "Create tasks, set priorities, manage due dates, and filter your workload from one clean workspace.",
    color: "text-violet-600 dark:text-violet-300",
    iconBg: "border-violet-400/20 bg-violet-500/10",
  },
  {
    number: "02",
    icon: "✧",
    title: "AI-powered insights",
    description:
      "Get an AI-generated workload summary and practical next steps to help you decide what to focus on.",
    color: "text-fuchsia-600 dark:text-fuchsia-300",
    iconBg: "border-fuchsia-400/20 bg-fuchsia-500/10",
  },
  {
    number: "03",
    icon: "✓",
    title: "Track your progress",
    description:
      "Monitor completed, pending, and overdue tasks so you can stay organized and make steady progress.",
    color: "text-emerald-600 dark:text-emerald-300",
    iconBg: "border-emerald-400/20 bg-emerald-500/10",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your workspace",
    description: "Sign up and bring your tasks into one organized place.",
  },
  {
    number: "02",
    title: "Plan your priorities",
    description: "Set task statuses, due dates, and priorities that work for you.",
  },
  {
    number: "03",
    title: "Let AI guide your next step",
    description: "Generate workload insights and choose what deserves attention.",
  },
];

function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div
        aria-hidden="true"
        className="absolute -inset-5 rounded-[2rem] bg-violet-600/[0.12] blur-3xl"
      />

      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-lg text-white">
              ✦
            </div>
            <div>
              <p className="text-sm font-semibold">My workspace</p>
              <p className="text-xs text-[var(--muted)]">
                Your productivity overview
              </p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1 text-xs text-emerald-600 dark:text-emerald-300">
            ● Workspace
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: "Total tasks", value: "12", color: "" },
              {
                label: "Completed",
                value: "08",
                color: "text-emerald-600 dark:text-emerald-300",
              },
              {
                label: "Pending",
                value: "04",
                color: "text-amber-600 dark:text-amber-300",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 sm:p-4"
              >
                <p className="text-[10px] leading-4 text-[var(--muted)] sm:text-xs">
                  {stat.label}
                </p>
                <p className={`mt-2 text-xl font-bold sm:text-2xl ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Recent tasks</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">
                A preview of your workspace
              </p>
            </div>
            <span className="rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--muted)]">
              Overview
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {[
              {
                title: "Finish project proposal",
                detail: "High priority",
                status: "In progress",
                dot: "bg-orange-400",
                badge:
                  "border-violet-400/20 bg-violet-500/10 text-violet-600 dark:text-violet-300",
              },
              {
                title: "Review weekly goals",
                detail: "Medium priority",
                status: "Completed",
                dot: "bg-emerald-400",
                badge:
                  "border-emerald-400/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
              },
              {
                title: "Plan tomorrow's tasks",
                detail: "Low priority",
                status: "To do",
                dot: "bg-sky-400",
                badge:
                  "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)]",
              },
            ].map((task) => (
              <div
                key={task.title}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${task.dot}`} />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium sm:text-sm">
                      {task.title}
                    </p>
                    <p className="mt-1 text-[10px] text-[var(--muted)] sm:text-xs">
                      {task.detail}
                    </p>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-lg border px-2 py-1 text-[9px] sm:text-[10px] ${task.badge}`}
                >
                  {task.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-violet-400/15 bg-gradient-to-r from-violet-500/[0.10] to-fuchsia-500/[0.04] p-4">
            <div className="flex items-center gap-2">
              <span className="text-lg text-violet-600 dark:text-violet-300">
                ✧
              </span>
              <p className="text-xs font-semibold">AI productivity insight</p>
            </div>
            <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
              Review your highest-priority tasks first and break larger work into
              manageable steps.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-5 -left-3 hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-xl sm:block">
        <p className="text-xs text-[var(--muted)]">Built for focus</p>
        <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
          Small steps. Real progress.
        </p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg font-bold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
          >
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-lg text-white shadow-lg shadow-violet-950/30"
            >
              T
            </span>
            <span className="text-lg">{siteConfig.name}</span>
          </Link>

          <nav aria-label="Account" className="flex items-center gap-2 text-sm sm:gap-3">
            <Link
              href="/login"
              className="rounded-xl px-3 py-2 font-medium text-[var(--muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 sm:px-4"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-violet-600 px-4 py-2.5 font-semibold text-white transition hover:bg-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/[0.09] blur-[120px]"
          />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-28">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-3.5 py-2 text-xs font-medium text-violet-700 dark:text-violet-200">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500 dark:bg-violet-300" />
                A smarter way to manage your work
              </div>

              <h1 className="mx-auto mt-7 max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:mx-0 lg:text-6xl">
                Make time for
                <span className="block bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 bg-clip-text pb-2 text-transparent dark:from-violet-300 dark:via-fuchsia-300 dark:to-indigo-300">
                  meaningful work.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8 lg:mx-0">
                Organize your tasks, stay on top of priorities, and use AI-powered
                insights to figure out what deserves your attention next.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <Link
                  href="/signup"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-950/30 transition hover:-translate-y-0.5 hover:bg-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 sm:w-auto"
                >
                  Start organizing <span aria-hidden="true">→</span>
                </Link>
                <a
                  href="#features"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-violet-400/40 hover:bg-[var(--surface-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 sm:w-auto"
                >
                  Explore features
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[var(--muted)] lg:justify-start">
                <span className="flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-emerald-300">
                    ✓
                  </span>{" "}
                  Simple task management
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-emerald-300">
                    ✓
                  </span>{" "}
                  AI-generated insights
                </span>
              </div>
            </div>

            <DashboardPreview />
          </div>
        </section>

        <section className="border-y border-[var(--border)] bg-[var(--surface-muted)]">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
            {[
              {
                title: "One clear workspace",
                text: "Keep your tasks and priorities organized.",
              },
              {
                title: "Actionable AI insights",
                text: "Turn your workload into practical next steps.",
              },
              {
                title: "Progress you can see",
                text: "Track completed, pending, and overdue work.",
              },
            ].map((item) => (
              <div key={item.title} className="px-2 py-2 text-center sm:text-left">
                <h2 className="text-sm font-semibold">{item.title}</h2>
                <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300">
                Everything in one place
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Your work, under control.
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--muted)]">
                Less time organizing your workflow. More time making meaningful
                progress.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-400/25 hover:bg-[var(--surface-muted)] sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border text-xl ${feature.iconBg} ${feature.color}`}
                    >
                      {feature.icon}
                    </span>
                    <span className="text-xs font-medium tracking-widest text-[var(--muted)]">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-24 border-y border-[var(--border)] bg-[var(--surface-muted)] px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300">
                A simpler workflow
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                From busy to focused.
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--muted)]">
                A straightforward way to get your work organized and keep moving.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {steps.map((step) => (
                <article
                  key={step.number}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7"
                >
                  <p className="text-sm font-semibold tracking-widest text-violet-600 dark:text-violet-300">
                    STEP {step.number}
                  </p>
                  <h3 className="mt-5 text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-violet-400/20 bg-[var(--surface)] px-6 py-12 text-center sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-600/[0.16] via-transparent to-fuchsia-500/[0.08]"
            />

            <div className="relative">
              <span className="text-3xl text-violet-600 dark:text-violet-300">
                ✧
              </span>
              <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to work with more focus?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Bring your tasks together, make a plan, and take the next step
                toward your goals.
              </p>

              <Link
                href="/signup"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
              >
                Create your account <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-7 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <Link
            href="/"
            className="rounded-lg text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
          >
            {siteConfig.name.split(" ")[0]}{" "}
            <span className="text-violet-600 dark:text-violet-300">
              {siteConfig.name.split(" ").slice(1).join(" ")}
            </span>
          </Link>
          <p className="text-xs text-[var(--muted)]">
            © 2026 {siteConfig.name}. Built for focused work.
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
            <Link href="/login" className="transition hover:text-[var(--foreground)]">
              Log in
            </Link>
            <Link href="/signup" className="transition hover:text-[var(--foreground)]">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
