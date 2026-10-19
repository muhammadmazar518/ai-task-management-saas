
import { redirect } from "next/navigation";
import Link from "next/link";
import TaskManager from "@/components/TaskManager";
import AiSummary from "@/components/AiSummary";
import { siteConfig } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions";
import { fromRow } from "@/lib/tasks";

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

  return (
    <div className="min-h-screen bg-[#09090f] text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-white/[0.08] bg-[#0d0d15] p-5 lg:flex">
        <Link href="/" className="flex items-center gap-3 px-2 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-lg font-bold text-white">
            T
          </span>
          <span className="text-lg font-bold tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

        <p className="mb-3 mt-10 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Workspace
        </p>

        <nav className="space-y-2">
          <div className="flex items-center gap-3 rounded-xl border border-violet-400/20 bg-violet-500/10 px-3 py-3 text-sm font-medium text-violet-300">
            <span>▦</span>
            Overview
          </div>

          <a
            href="#tasks"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <span>☷</span>
            My tasks
          </a>

          <a
            href="#ai-assistant"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <span>✧</span>
            AI assistant
          </a>

          <a
            href="#analytics"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <span>▥</span>
            Analytics
          </a>

          <a
            href="#calendar"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <span>▦</span>
            Calendar
          </a>
        </nav>

        <div className="mt-auto rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-lg text-violet-300">
            ✦
          </div>
          <p className="text-sm font-semibold">Make work flow</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Organize your day and stay focused on what matters.
          </p>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-white/[0.08] bg-[#09090f]/90 backdrop-blur-xl">
          <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-8">
            <div>
              <p className="text-xs text-slate-500">
                Workspace / Overview
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-200">
                Welcome back
                {user.user_metadata?.full_name
                  ? `, ${user.user_metadata.full_name}`
                  : ""}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400 sm:block">
                ✧ Your AI workspace
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/15 text-sm font-bold text-violet-300">
                {(user.user_metadata?.full_name || user.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  Log out
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-8">
          <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-sm font-medium text-violet-300">
                YOUR PRODUCTIVITY SPACE
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Your tasks, in focus.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
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
                color: "text-violet-300",
              },
              {
                label: "Work with focus",
                value: "02",
                description: "Prioritize what matters most",
                symbol: "◎",
                color: "text-cyan-300",
              },
              {
                label: "Use AI insights",
                value: "03",
                description: "Get summaries and next steps",
                symbol: "✧",
                color: "text-fuchsia-300",
              },
              {
                label: "Build momentum",
                value: "04",
                description: "Make progress one task at a time",
                symbol: "↗",
                color: "text-emerald-300",
              },
            ].map((item) => (
              <div
                key={item.value}
                className="rounded-2xl border border-white/[0.08] bg-[#11111b] p-5 transition hover:border-violet-400/20"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xl ${item.color}`}>
                    {item.symbol}
                  </span>
                  <span className="text-xs font-medium text-slate-600">
                    {item.value}
                  </span>
                </div>

                <h2 className="mt-5 font-semibold text-slate-100">
                  {item.label}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </section>

          <section
            id="tasks"
            className="mb-8 scroll-mt-24 rounded-2xl border border-white/[0.08] bg-[#11111b] p-4 sm:p-6"
          >
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">My tasks</h2>
              <p className="mt-1 text-sm text-slate-400">
                Create tasks, set priorities, and track your progress.
              </p>
            </div>

            <TaskManager
              initialTasks={(rows ?? []).map(fromRow)}
              loadError={
                loadError
                  ? "Could not load your tasks. Please refresh the page."
                  : ""
              }
            />
          </section>

          <section
            id="ai-assistant"
            className="scroll-mt-24 rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[0.08] via-[#11111b] to-[#11111b] p-4 sm:p-6"
          >
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                Powered by AI
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white">
                Your AI assistant
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Turn your task list into clear priorities and next steps.
              </p>
            </div>

            <AiSummary />
          </section>

          <footer className="py-8 text-center text-xs text-slate-600">
            {siteConfig.name} · Make every day count.
          </footer>
        </main>
      </div>
    </div>
  );
}
