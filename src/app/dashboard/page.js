import Link from "next/link";
import StatCard from "@/components/StatCard";
import { siteConfig } from "@/lib/content";
import { dashboardStats } from "@/lib/placeholder-data";

export const metadata = {
  title: `Dashboard | ${siteConfig.name}`,
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            {siteConfig.name}
          </Link>
          <span className="text-sm text-slate-500">Dashboard</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Your tasks</h1>
            <p className="text-sm text-slate-600">
              A quick overview of your work.
            </p>
          </div>
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-lg bg-indigo-300 px-4 py-2 text-sm font-medium text-white"
          >
            New task (coming soon)
          </button>
        </div>

        {/* Stats */}
        <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {dashboardStats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              tone={stat.tone}
            />
          ))}
        </section>

        {/* AI summary */}
        <section className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 p-5">
          <h2 className="font-semibold text-indigo-900">AI summary</h2>
          <p className="mt-1 text-sm text-indigo-800">
            Add some tasks and your AI summary and suggested next steps will
            appear here.
          </p>
        </section>

        {/* Task list (empty state) */}
        <section className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="font-semibold text-slate-900">No tasks yet</h2>
          <p className="mt-1 text-sm text-slate-600">
            Your tasks will show up here once you create them.
          </p>
        </section>
      </main>
    </div>
  );
}