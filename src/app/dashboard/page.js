import Link from "next/link";
import TaskManager from "@/components/TaskManager";
import { siteConfig } from "@/lib/content";

export const metadata = {
  title: `Dashboard | ${siteConfig.name}`,
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            {siteConfig.name}
          </Link>
          <span className="text-sm text-slate-500">Dashboard</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900">Your tasks</h1>
        <p className="text-sm text-slate-600">A quick overview of your work.</p>

        <TaskManager />

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