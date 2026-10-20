import Link from "next/link";
import Logo from "@/components/Logo";
import Icon from "@/components/Icon";
import { siteConfig } from "@/lib/content";

const headerLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
];

const features = [
  {
    icon: "tasks",
    title: "Organize every task",
    description:
      "Capture work with priorities, statuses, and due dates, then find anything instantly with search and filters.",
  },
  {
    icon: "sparkles",
    title: "AI that plans with you",
    description:
      "Get a written workload summary, a recommended next task, and clear steps for breaking down big work.",
  },
  {
    icon: "calendarCheck",
    title: "See your whole month",
    description:
      "Switch between list, kanban, and calendar views to understand your week at a glance — on any device.",
  },
  {
    icon: "analytics",
    title: "Track real progress",
    description:
      "Completion rates, priority breakdowns, trends, and due-date pressure computed from your actual tasks.",
  },
  {
    icon: "bell",
    title: "Never miss a deadline",
    description:
      "A focused notification center surfaces what is due today, what is overdue, and what you just finished.",
  },
  {
    icon: "shield",
    title: "Private by default",
    description:
      "Your tasks belong only to you, protected by secure authentication and per-user access rules.",
  },
];

const steps = [
  {
    title: "Create your workspace",
    description: "Sign up in seconds and bring your tasks into one calm place.",
  },
  {
    title: "Plan your priorities",
    description: "Set statuses, priorities, and due dates that match how you work.",
  },
  {
    title: "Let AI guide the next step",
    description: "Refresh recommendations and start with the task that matters most.",
  },
];

function DashboardPreview() {
  const statCards = [
    { label: "Total tasks", value: "24", tone: "text-[var(--foreground)]" },
    { label: "Completed", value: "15", tone: "text-emerald-600 dark:text-emerald-400" },
    { label: "In progress", value: "5", tone: "text-amber-600 dark:text-amber-400" },
    { label: "Overdue", value: "2", tone: "text-red-600 dark:text-red-400" },
  ];

  const previewTasks = [
    {
      title: "Finalize Q3 product proposal",
      status: "In progress",
      statusClass:
        "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
      due: "Due today",
      dueClass:
        "border-[var(--primary)]/30 bg-[var(--primary-soft)] text-[var(--primary)]",
    },
    {
      title: "Review weekly team goals",
      status: "Completed",
      statusClass:
        "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      due: "Yesterday",
      dueClass: "border-[var(--border)] text-[var(--muted)]",
    },
    {
      title: "Plan tomorrow's deep work",
      status: "To do",
      statusClass:
        "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
      due: "Tomorrow",
      dueClass: "border-[var(--border)] text-[var(--muted)]",
    },
  ];

  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl shadow-slate-900/10">
        <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          </span>
          <span className="ml-2 truncate text-xs text-[var(--muted)]">
            taskflow.ai/dashboard
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Your tasks, in focus</p>
              <p className="mt-0.5 text-xs text-[var(--muted)]">
                Monday · 24 open items
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-contrast)]">
              <Icon name="plus" size={13} />
              Create task
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-2.5"
              >
                <p className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
                  {stat.label}
                </p>
                <p className={`mt-1.5 text-lg font-semibold ${stat.tone}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            {previewTasks.map((task) => (
              <div
                key={task.title}
                className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 rounded-[5px] border border-[var(--border-strong)]"
                  />
                  <span className="truncate text-xs font-medium">{task.title}</span>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <span
                    className={`hidden rounded-md border px-1.5 py-0.5 text-[10px] font-medium sm:inline-block ${task.dueClass}`}
                  >
                    {task.due}
                  </span>
                  <span
                    className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${task.statusClass}`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-3">
            <div className="flex items-center gap-2">
              <Icon name="sparkles" size={14} className="text-[var(--primary)]" />
              <p className="text-xs font-semibold">AI recommendation</p>
            </div>
            <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">
              Start with the overdue proposal, then move to your highest-priority
              review while your focus is fresh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo size="sm" />

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {headerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--muted-strong)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <nav aria-label="Account" className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--muted-strong)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-[var(--primary)] px-3.5 py-1.5 text-sm font-semibold text-[var(--primary-contrast)] shadow-sm transition hover:bg-[var(--primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--muted-strong)]">
                <Icon name="sparkles" size={13} className="text-[var(--primary)]" />
                AI-powered task management
              </div>

              <h1 className="mt-4 text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl lg:text-[44px]">
                Plan less. Finish more with AI.
              </h1>

              <p className="mt-3.5 text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
                TaskFlow AI organizes your work, tracks your progress, and tells
                you exactly what to focus on next — so you spend your energy doing
                the work instead of planning it.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-contrast)] shadow-sm transition hover:bg-[var(--primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  Get started free
                  <Icon name="arrowRight" size={16} />
                </Link>

                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold transition hover:bg-[var(--surface-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  Explore features
                </a>
              </div>

              <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--muted)]">
                {["Free to start", "No credit card", "Your data stays private"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-1.5">
                      <Icon
                        name="check"
                        size={13}
                        className="text-emerald-600 dark:text-emerald-400"
                      />
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>

            <DashboardPreview />
          </div>
        </section>

        <section id="features" className="scroll-mt-16 border-t border-[var(--border)] bg-[var(--surface)] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
                Everything you need
              </p>

              <h2 className="mt-2.5 text-2xl font-semibold tracking-tight sm:text-3xl">
                A complete workspace for focused work
              </h2>

              <p className="mt-3 text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-7">
                Every feature is built around one goal: helping you decide what to
                do next and actually finish it.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition hover:border-[var(--border-strong)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--primary)]">
                      <Icon name={feature.icon} size={16} />
                    </span>

                    <h3 className="min-w-0 text-sm font-semibold">
                      {feature.title}
                    </h3>
                  </div>

                  <p className="mt-2.5 text-sm leading-6 text-[var(--muted)]">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: "list", title: "List view", text: "Scan and act quickly." },
                { icon: "board", title: "Kanban board", text: "Drag work across stages." },
                { icon: "calendar", title: "Calendar", text: "Map work across the month." },
                { icon: "analytics", title: "Analytics", text: "Measure real progress." },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5"
                >
                  <Icon
                    name={item.icon}
                    size={16}
                    className="shrink-0 text-[var(--primary)]"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">{item.title}</p>
                    <p className="truncate text-[11px] text-[var(--muted)]">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-16 border-t border-[var(--border)] px-4 py-12 sm:px-6 sm:py-14 lg:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
                How it works
              </p>

              <h2 className="mt-2.5 text-2xl font-semibold tracking-tight sm:text-3xl">
                From overwhelmed to organized in three steps
              </h2>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {steps.map((step, index) => (
                <article key={step.title} className="relative">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-sm font-semibold text-[var(--primary)]">
                      {index + 1}
                    </span>

                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-[var(--border)]"
                    />
                  </div>

                  <h3 className="mt-3 text-sm font-semibold">{step.title}</h3>

                  <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-8 text-center sm:px-10 sm:py-10">
            <h2 className="mx-auto max-w-2xl text-xl font-semibold tracking-tight sm:text-2xl">
              Ready to work with more focus?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-7">
              Bring your tasks together, make a plan, and let AI point you at the
              next step.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-contrast)] shadow-sm transition hover:bg-[var(--primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                Create your free account
                <Icon name="arrowRight" size={16} />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold transition hover:bg-[var(--surface-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                Log in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-sm">
              <Logo size="sm" />
              <p className="mt-2.5 text-sm leading-6 text-[var(--muted)]">
                {siteConfig.description}
              </p>
            </div>

            <div className="flex gap-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Product
                </p>
                <ul className="mt-2.5 space-y-1.5 text-sm">
                  <li>
                    <a
                      href="#features"
                      className="text-[var(--muted-strong)] transition hover:text-[var(--foreground)]"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#how-it-works"
                      className="text-[var(--muted-strong)] transition hover:text-[var(--foreground)]"
                    >
                      How it works
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Company
                </p>
                <ul className="mt-2.5 space-y-1.5 text-sm">
                  <li>
                    <Link
                      href="/privacy"
                      className="text-[var(--muted-strong)] transition hover:text-[var(--foreground)]"
                    >
                      Privacy policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-[var(--muted-strong)] transition hover:text-[var(--foreground)]"
                    >
                      Terms of service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-[var(--muted-strong)] transition hover:text-[var(--foreground)]"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 border-t border-[var(--border)] pt-5 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <p>Built for focused work.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
