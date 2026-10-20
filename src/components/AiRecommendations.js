"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { buttonClasses } from "@/lib/ui";
import { getToday, isOverdue, PRIORITY_LABELS } from "@/lib/tasks";
import { formatMonthDay } from "@/lib/analytics";
import {
  buildFallbackRecommendations,
  RECOMMENDATION_LABELS,
  sanitizeRecommendations,
  sanitizeTaskRefs,
  sortPendingTasks,
} from "@/lib/recommendations";

const KIND_STYLES = {
  next_task: {
    icon: "sparkles",
    style: "border-[var(--primary)]/30 bg-[var(--primary-soft)] text-[var(--primary)]",
  },
  urgent: {
    icon: "alert",
    style: "border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400",
  },
  order: {
    icon: "layers",
    style: "border-sky-500/25 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  upcoming: {
    icon: "clock",
    style: "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  breakdown: {
    icon: "list",
    style:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
};

const FALLBACK_KIND = KIND_STYLES.order;

function dueChip(task, today) {
  if (!task.dueDate) return null;

  if (isOverdue(task, today)) {
    return {
      text: `Overdue · ${formatMonthDay(task.dueDate)}`,
      className: "border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400",
    };
  }

  if (task.dueDate === today) {
    return {
      text: "Due today",
      className: "border-[var(--primary)]/30 bg-[var(--primary-soft)] text-[var(--primary)]",
    };
  }

  return {
    text: `Due ${formatMonthDay(task.dueDate)}`,
    className: "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)]",
  };
}

export default function AiRecommendations({
  tasks = [],
  today = getToday(),
  loadError = "",
}) {
  const [error, setError] = useState(loadError);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [source, setSource] = useState("rules");
  const [generatedAt, setGeneratedAt] = useState("");
  const [apiTasks, setApiTasks] = useState([]);
  const [recommendations, setRecommendations] = useState(() =>
    sanitizeRecommendations(buildFallbackRecommendations(tasks, today))
  );

  const taskMap = useMemo(() => {
    const map = new Map();

    [...tasks, ...apiTasks].forEach((task) => {
      if (task && task.id) map.set(task.id, task);
    });

    return map;
  }, [tasks, apiTasks]);

  const openTaskCount = useMemo(
    () => sortPendingTasks([...taskMap.values()], today).length,
    [taskMap, today]
  );

  async function handleRefresh() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data) {
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }

      setRecommendations(sanitizeRecommendations(data.recommendations));
      setApiTasks(sanitizeTaskRefs(data.tasks));
      setSource(data.source === "ai" ? "ai" : "rules");
      setNotice(typeof data.notice === "string" ? data.notice : "");
      setGeneratedAt(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch {
      setError(
        "Could not reach the server. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const showEmpty = !loading && !error && recommendations.length === 0;
  const isAi = source === "ai";

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2" aria-live="polite">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${
              isAi
                ? "border-[var(--primary)]/30 bg-[var(--primary-soft)] text-[var(--primary)]"
                : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted-strong)]"
            }`}
          >
            <Icon name={isAi ? "sparkles" : "circle"} size={12} />
            {isAi ? "AI-generated" : "Rule-based preview"}
          </span>

          <span className="text-xs text-[var(--muted)]">
            {generatedAt
              ? `Refreshed at ${generatedAt}`
              : "From your open tasks — refresh to generate with AI."}
          </span>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className={`${buttonClasses({ variant: "primary", size: "md" })} shrink-0`}
        >
          <Icon name="refresh" size={15} />
          {loading ? "Refreshing…" : "Refresh recommendations"}
        </button>
      </div>

      {notice && !error && (
        <p className="mb-4 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3.5 py-2.5 text-xs leading-5 text-[var(--muted)]">
          {notice}
        </p>
      )}

      <div aria-live="polite" aria-busy={loading}>
        {error && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-3 rounded-lg border border-red-500/25 bg-red-500/[0.07] p-3.5 text-sm text-red-700 dark:text-red-300"
          >
            <Icon name="alert" size={16} className="mt-0.5" />

            <div className="min-w-0 flex-1">
              <p className="font-medium">Could not refresh recommendations</p>
              <p className="mt-1 leading-6">{error}</p>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                className="mt-2 font-semibold underline underline-offset-4 hover:text-red-800 disabled:opacity-50 dark:hover:text-red-200"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2" aria-hidden="true">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className={`h-40 animate-pulse rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-muted)] ${
                  item === 0 ? "sm:col-span-2" : ""
                }`}
              />
            ))}
          </div>
        )}

        {!loading && showEmpty && openTaskCount === 0 && (
          <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-5 py-10 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--primary)]">
              <Icon name="sparkles" size={20} />
            </div>

            <h3 className="mt-3.5 text-sm font-semibold">
              Nothing to recommend yet
            </h3>

            <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-[var(--muted)]">
              Add a task and the assistant will suggest what to work on next,
              what is coming up, and how to break big work into steps.
            </p>

            <Link
              href="/dashboard/tasks"
              className={`${buttonClasses({ variant: "primary", size: "lg" })} mt-4`}
            >
              <Icon name="plus" size={15} />
              Create a task
            </Link>
          </div>
        )}

        {!loading && showEmpty && openTaskCount > 0 && (
          <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-5 py-8 text-center">
            <p className="text-sm font-medium">No suggestions right now</p>
            <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-[var(--muted)]">
              Refresh to ask again based on your {openTaskCount} open{" "}
              {openTaskCount === 1 ? "task" : "tasks"}.
            </p>
          </div>
        )}

        {!loading && recommendations.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {recommendations.map((rec) => {
              const chips = rec.taskIds
                .map((id) => taskMap.get(id))
                .filter((task) => task && task.status !== "done");

              const kind = KIND_STYLES[rec.kind] ?? FALLBACK_KIND;

              return (
                <article
                  key={rec.id}
                  className={`flex flex-col gap-4 rounded-[var(--radius-card)] border p-4 sm:p-5 ${
                    rec.kind === "next_task"
                      ? "border-[var(--primary)]/30 bg-[var(--primary-soft)]/50 sm:col-span-2"
                      : "border-[var(--border)] bg-[var(--surface)]"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${kind.style}`}
                      >
                        <Icon name={kind.icon} size={17} />
                      </span>

                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                          Suggestion
                        </p>
                        <h3 className="mt-0.5 text-sm font-semibold">
                          {RECOMMENDATION_LABELS[rec.kind]}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium ${
                        rec.source === "ai"
                          ? "border-[var(--primary)]/30 bg-[var(--primary-soft)] text-[var(--primary)]"
                          : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted-strong)]"
                      }`}
                    >
                      {rec.source === "ai" ? "AI suggestion" : "Rule-based"}
                    </span>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                      Your tasks
                    </p>

                    {chips.length > 0 ? (
                      <ul className="mt-2 space-y-2">
                        {chips.map((task, index) => {
                          const due = dueChip(task, today);

                          return (
                            <li
                              key={task.id}
                              className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-xs"
                            >
                              {rec.kind === "order" && (
                                <span
                                  aria-hidden="true"
                                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--primary-soft)] text-[10px] font-bold text-[var(--primary)]"
                                >
                                  {index + 1}
                                </span>
                              )}

                              <span className="min-w-0 break-words font-medium text-[var(--foreground)]">
                                {task.title}
                              </span>

                              {due && (
                                <span
                                  className={`shrink-0 rounded-md border px-1.5 py-0.5 ${due.className}`}
                                >
                                  {due.text}
                                </span>
                              )}

                              <span className="shrink-0 text-[var(--muted)]">
                                {PRIORITY_LABELS[task.priority] || task.priority}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        This recommendation points at a task that is no longer in
                        your list.
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                      Why this helps
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--foreground)]">
                      {rec.why}
                    </p>
                  </div>

                  {rec.steps.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                        Suggested steps
                      </p>

                      <ol className="mt-2 space-y-2">
                        {rec.steps.map((step, index) => (
                          <li
                            key={`${rec.id}-step-${index}`}
                            className="flex items-start gap-2.5 text-sm"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-emerald-500/25 bg-emerald-500/10 text-[10px] font-bold text-emerald-600 dark:text-emerald-400"
                            >
                              {index + 1}
                            </span>

                            <span className="leading-6 text-[var(--foreground)]">
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {!loading && recommendations.length > 0 && (
          <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
            {isAi
              ? "Suggestions are generated by AI from your open tasks. "
              : "Suggestions are calculated locally from your open tasks. "}
            Your tasks, priorities, statuses, and due dates are never changed
            automatically.
          </p>
        )}
      </div>
    </div>
  );
}
