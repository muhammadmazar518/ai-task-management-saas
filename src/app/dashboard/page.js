import Link from "next/link";
import TaskManager from "@/components/TaskManager";
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
  } = await supabase.auth.getUser();

  const { data: rows, error: loadError } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            {siteConfig.name}
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:inline">
              {user?.user_metadata?.full_name || user?.email}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900">Your tasks</h1>
        <p className="text-sm text-slate-600">A quick overview of your work.</p>

        <TaskManager
          initialTasks={(rows ?? []).map(fromRow)}
          loadError={loadError ? "Could not load your tasks. Please refresh the page." : ""}
        />

        <section className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 p-5">
          <h2 className="font-semibold text-indigo-900">AI summary</h2>
          <p className="mt-1 text-sm text-indigo-800">
            Add some tasks and your AI summary and suggested next steps will
            appear here.
          </p>
        </section>
      </main>
    </div>
  );
}