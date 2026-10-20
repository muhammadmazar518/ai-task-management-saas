"use client";

import Link from "next/link";
import { useState } from "react";
import StatCard from "@/components/StatCard";
import Icon from "@/components/Icon";
import { Alert, EmptyState, SectionHeading } from "@/components/ui";
import { buttonClasses } from "@/lib/ui";
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
      tone: "border-[var(--primary)]/25 bg-[var(--primary-soft)] text-[var(--primary)]",
    },
    {
      key: "next-7-days",
      label: "Next 7 days",
      items: due.next7Days,
      tone: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    },
    {
      key: "overdue",
      label: "Overdue",
      items: due.overdue,
      tone: "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300",
    },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <Alert tone="error" onDismiss={() => setError("")}>
          {error}
        </Alert>
      )}

      <section>
        <SectionHeading eyebrow="Overview" title="Task statistics" />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          <StatCard label="Total tasks" value={stats.total} tone="slate" />
          <StatCard label="Completed" value={stats.completed} tone="green" />
          <StatCard label="Pending" value={stats.pending} tone="amber" />
          <StatCard label="In progress" value={inProgress} tone="indigo" />
          <StatCard label="Overdue" value={stats.overdue} tone="red" />
        </div>
      </section>

      {stats.total === 0 && !error && (
        <EmptyState
          icon="analytics"
          title="No tasks yet"
          description="Create your first task to start seeing completion, priority, and due-date analytics here."
          action={
            <Link
              href="/dashboard/tasks"
              className={buttonClasses({ variant: "primary", size: "lg" })}
            >
              <Icon name="plus" size={15} />
              Add your first task
            </Link>
          }
        />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5">
          <SectionHeading eyebrow="Progress" title="Completion progress" />

          <div className="flex items-end justify-between gap-3">
            <p className="text-3xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">
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
            className="mt-4 h-2.5 overflow-hidden rounded-full bg-[var(--border)]"
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

        <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5">
          <SectionHeading eyebrow="Distribution" title="Priority breakdown" />

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

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--border)]">
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

      <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5">
        <SectionHeading eyebrow="Over time" title="Task trends" />

        {hasTrendData ? (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]">
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-sm bg-[var(--primary)]/50"
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
              className="flex h-44 items-stretch gap-1.5 sm:gap-3"
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
                  <div key={bucket.start} className="flex min-w-0 flex-1 flex-col">
                    <div className="flex flex-1 flex-col justify-end">
                      {bucket.total > 0 && (
                        <div
                          title={`${bucket.label}: ${bucket.total} added · ${bucket.completed} completed`}
                          className="overflow-hidden rounded-md"
                          style={{ height: `${barHeight}%` }}
                        >
                          <div
                            className="bg-[var(--primary)]/50"
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

            <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
              Grouped by the week each task was created (weeks start on Monday).
            </p>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-8 text-center">
            <p className="text-sm font-medium">No recent activity</p>
            <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-[var(--muted)]">
              No tasks were added in the last {TREND_WEEKS} weeks. Tasks created
              before that are not shown here.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5">
        <SectionHeading
          eyebrow="Deadlines"
          title="Due date overview"
          description="Outstanding tasks only — completed tasks are counted above."
        />

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
                  className={`flex h-7 min-w-7 items-center justify-center rounded-lg border px-2 text-sm font-semibold ${group.tone}`}
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
