
import { redirect } from "next/navigation";
import TaskManager from "@/components/TaskManager";
import AiSummary from "@/components/AiSummary";
import AiRecommendations from "@/components/AiRecommendations";
import DashboardHeader from "@/components/DashboardHeader";
import { siteConfig } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";
import { fromRow, getToday } from "@/lib/tasks";
import { buildNotifications } from "@/lib/notifications";

export const metadata = {
  title: `Dashboard | ${siteConfig.name}`,
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: rows, error: loadError } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const tasks = (rows ?? []).map(fromRow);
  const today = getToday();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      <div className="min-w-0">
        <DashboardHeader
          user={user}
          crumb="Overview"
          notificationItems={buildNotifications(tasks)}
          notificationUserId={user.id}
        />

        <main className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-8">
          <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-sm font-medium text-violet-600 dark:text-violet-400">
                YOUR PRODUCTIVITY SPACE
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Your tasks, in focus.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base">
                Plan smarter, track your progress, and let AI help you find your
                next step.
              </p>
            </div>

            <a
              href="#tasks"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500"
            >
              <span className="text-lg">+</span>
              View my tasks
            </a>
          </section>

          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Stay organized",
                value: "01",
                description: "Keep every task in one place",
                symbol: "▤",
                color: "text-violet-600 dark:text-violet-400",
              },
              {
                label: "Work with focus",
                value: "02",
                description: "Prioritize what matters most",
                symbol: "◎",
                color: "text-cyan-500",
              },
              {
                label: "Use AI insights",
                value: "03",
                description: "Get summaries and next steps",
                symbol: "✧",
                color: "text-fuchsia-500",
              },
              {
                label: "Build momentum",
                value: "04",
                description: "Make progress one task at a time",
                symbol: "↗",
                color: "text-emerald-500",
              },
            ].map((item) => (
              <div
                key={item.value}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-violet-400/40"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xl ${item.color}`}>
                    {item.symbol}
                  </span>
                  <span className="text-xs font-medium text-[var(--muted)]">
                    {item.value}
                  </span>
                </div>

                <h2 className="mt-5 font-semibold">{item.label}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {item.description}
                </p>
              </div>
            ))}
          </section>

          <section
            id="tasks"
            className="mb-8 scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6"
          >
            <div className="mb-5">
              <h2 className="text-xl font-semibold">My tasks</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Create tasks, set priorities, and track your progress.
              </p>
            </div>

            <TaskManager
              initialTasks={tasks}
              loadError={
                loadError
                  ? "Could not load your tasks. Please refresh the page."
                  : ""
              }
            />
          </section>

          <section
            id="ai-recommendations"
            className="mb-8 scroll-mt-24 rounded-2xl border border-violet-400/20 bg-[var(--surface)] p-4 sm:p-6"
          >
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
                Smart priorities
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                AI task recommendations
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                What to work on next, what is coming up, and how to split
                bigger tasks into steps — built only from your open tasks.
              </p>
            </div>

            <AiRecommendations
              tasks={tasks}
              today={today}
              loadError={
                loadError
                  ? "Could not load your tasks, so suggestions may be incomplete. Please refresh the page."
                  : ""
              }
            />
          </section>

          <section
            id="ai-assistant"
            className="scroll-mt-24 rounded-2xl border border-violet-400/20 bg-[var(--surface)] p-4 sm:p-6"
          >
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
                Powered by AI
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                Your AI assistant
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Turn your task list into clear priorities and next steps.
              </p>
            </div>

            <AiSummary />
          </section>

          <footer className="py-8 text-center text-xs text-[var(--muted)]">
            {siteConfig.name} · Make every day count.
          </footer>
        </main>
      </div>
    </div>
  );
}
