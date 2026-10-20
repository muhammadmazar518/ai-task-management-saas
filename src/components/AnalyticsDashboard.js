"use client";

import { useState } from "react";
import StatCard from "@/components/StatCard";
import {
  getTaskStats,
  getToday,
  PRIORITIES,
  PRIORITY_LABELS,
} from "@/lib/tasks";
import {
  getCompletionSummary,
  getCompletionTrend,
  getDueOverview,
  getInProgressCount,
  getPriorityCounts,
  describeDueDate,
} from "@/lib/analytics";

const PRIORITY_COLORS = {
  low: "bg-sky-400",
  medium: "bg-amber-400",
  high: "bg-red-400",
};

const TREND_WEEKS = 8;

function sectionHeading(eyebrow, title) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-semibold">{title}</h2>
    </div>
  );
}

export default function AnalyticsDashboard({
  initialTasks = [],
  loadError = "",
}) {
  const [error, setError] = useState(loadError);

  const tasks = initialTasks;
  const today = getToday();

  const stats = getTaskStats(tasks, today);
  const inProgress = getInProgressCount(tasks);
  const completion = getCompletionSummary(tasks);
  const priorities = getPriorityCounts(tasks);
  const due = getDueOverview(tasks, today);
  const trend = getCompletionTrend(tasks, TREND_WEEKS, today);

  const hasTrendData = trend.some((bucket) => bucket.total > 0);
  const maxBucket = Math.max(...trend.map((bucket) => bucket.total), 1);

  const dueGroups = [
    {
      key: "today",
      label: "Due today",
      items: due.dueToday,
      tone: "border-violet-400/30 bg-violet-500/15 text-violet-600 dark:text-violet-300",
    },
    {
      key: "next-7-days",
      label: "Next 7 days",
      items: due.next7Days,
      tone: "border-amber-400/30 bg-amber-400/10 text-amber-700 dark:text-amber-300",
    },
    {
      key: "overdue",
      label: "Overdue",
      items: due.overdue,
      tone: "border-red-400/30 bg-red-400/10 text-red-600 dark:text-red-300",
    },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-red-400/20 bg-red-500/[0.08] p-4 text-sm text-red-600 dark:text-red-300"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0 font-medium underline underline-offset-4 hover:text-red-700 dark:hover:text-red-200"
          >
            Dismiss
          </button>
        </div>
      )}

      <section>
        {sectionHeading("Overview", "Task statistics")}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          <StatCard label="Total tasks" value={stats.total} tone="slate" />
          <StatCard label="Completed" value={stats.completed} tone="green" />
          <StatCard label="Pending" value={stats.pending} tone="amber" />
          <StatCard label="In progress" value={inProgress} tone="slate" />
          <StatCard label="Overdue" value={stats.overdue} tone="red" />
        </div>
      </section>

      {stats.total === 0 && !error && (
        <section className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-5 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-2xl text-violet-600 dark:text-violet-300">
            +
          </div>

          <h2 className="mt-4 font-semibold">No tasks yet</h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">
            Create your first task to start seeing completion, priority, and
            due-date analytics here.
          </p>

          <a
            href="/dashboard#tasks"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:bg-violet-500"
          >
            <span aria-hidden="true" className="text-lg">
              +
            </span>
            Add your first task
          </a>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
          {sectionHeading("Progress", "Completion progress")}

          <div className="flex items-end justify-between gap-3">
            <p className="text-4xl font-bold tracking-tight text-emerald-600 dark:text-emerald-300">
              {completion.percent}%
            </p>

            <p className="text-sm text-[var(--muted)]">
              {completion.completed} of {completion.total}{" "}
              {completion.total === 1 ? "task" : "tasks"} completed
            </p>
          </div>

          <div
            role="progressbar"
            aria-label="Task completion progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={completion.percent}
            className="mt-4 h-3 overflow-hidden rounded-full bg-[var(--border)]"
          >
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${completion.percent}%` }}
            />
          </div>

          <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
            {completion.total === 0
              ? "No tasks yet — add a task to start tracking progress."
              : completion.remaining === 0
                ? "Every task is completed. Nice work!"
                : `${completion.remaining} ${
                    completion.remaining === 1 ? "task" : "tasks"
                  } left to complete.`}
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
          {sectionHeading("Distribution", "Priority breakdown")}

          <ul className="space-y-4">
            {PRIORITIES.map((priority) => {
              const count = priorities[priority];
              const share =
                completion.total === 0
                  ? 0
                  : Math.round((count / completion.total) * 100);

              return (
                <li key={priority}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 font-medium text-[var(--foreground)]">
                      <span
                        aria-hidden="true"
                        className={`h-2.5 w-2.5 rounded-full ${PRIORITY_COLORS[priority]}`}
                      />
                      {PRIORITY_LABELS[priority]}
                    </span>

                    <span className="text-[var(--muted)]">
                      {count} {count === 1 ? "task" : "tasks"} · {share}%
                    </span>
                  </div>

                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--border)]">
                    <div
                      className={`h-full rounded-full ${PRIORITY_COLORS[priority]}`}
                      style={{ width: `${share}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
        {sectionHeading("Over time", "Task trends")}

        {hasTrendData ? (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]">
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-sm bg-violet-400/60"
                />
                Added, still open
              </span>

              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-sm bg-emerald-500"
                />
                Completed
              </span>
            </div>

            <div
              role="img"
              aria-label={`Bar chart of tasks added over the last ${TREND_WEEKS} weeks, split by how many are completed`}
              className="flex h-48 items-stretch gap-1.5 sm:gap-3"
            >
              {trend.map((bucket) => {
                const doneShare =
                  bucket.total === 0
                    ? 0
                    : (bucket.completed / bucket.total) * 100;
                const openShare = 100 - doneShare;
                const barHeight = Math.max(
                  (bucket.total / maxBucket) * 100,
                  8
                );

                return (
                  <div
                    key={bucket.start}
                    className="flex min-w-0 flex-1 flex-col"
                  >
                    <div className="flex flex-1 flex-col justify-end">
                      {bucket.total > 0 && (
                        <div
                          title={`${bucket.label}: ${bucket.total} added · ${bucket.completed} completed`}
                          className="overflow-hidden rounded-md"
                          style={{ height: `${barHeight}%` }}
                        >
                          <div
                            className="bg-violet-400/60"
                            style={{ height: `${openShare}%` }}
                          />
                          <div
                            className="bg-emerald-500"
                            style={{ height: `${doneShare}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <span className="mt-2 truncate text-center text-[9px] text-[var(--muted)] sm:text-[10px]">
                      {bucket.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-4 py-8 text-center">
            <p className="text-sm font-medium">No recent activity</p>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[var(--muted)]">
              No tasks were added in the last {TREND_WEEKS} weeks. Tasks
              created before that are not shown here.
            </p>
          </div>
        )}

        <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
          Grouped by the week each task was created (weeks start on Monday).
        </p>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
        {sectionHeading("Deadlines", "Due date overview")}

        <p className="-mt-3 mb-5 text-sm text-[var(--muted)]">
          Outstanding tasks only — completed tasks are counted above.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {dueGroups.map((group) => (
            <div
              key={group.key}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {group.label}
                </span>

                <span
                  className={`flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-sm font-bold ${group.tone}`}
                >
                  {group.items.length}
                </span>
              </div>

              {group.items.length === 0 ? (
                <p className="mt-3 text-xs text-[var(--muted)]">Nothing here.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {group.items.slice(0, 5).map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <span className="min-w-0 truncate text-[var(--foreground)]">
                        {task.title}
                      </span>

                      <span className="shrink-0 text-xs text-[var(--muted)]">
                        {describeDueDate(task.dueDate, today)}
                      </span>
                    </li>
                  ))}

                  {group.items.length > 5 && (
                    <li className="text-xs text-[var(--muted)]">
                      +{group.items.length - 5} more
                    </li>
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
