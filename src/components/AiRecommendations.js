"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getToday, isOverdue, PRIORITY_LABELS } from "@/lib/tasks";
import { formatMonthDay } from "@/lib/analytics";
import {
  buildFallbackRecommendations,
  RECOMMENDATION_ICONS,
  RECOMMENDATION_LABELS,
  sanitizeRecommendations,
  sanitizeTaskRefs,
  sortPendingTasks,
} from "@/lib/recommendations";

const KIND_STYLES = {
  next_task:
    "border-violet-400/30 bg-violet-500/10 text-violet-600 dark:text-violet-300",
  urgent:
    "border-red-400/30 bg-red-400/10 text-red-600 dark:text-red-300",
  order: "border-sky-400/30 bg-sky-400/10 text-sky-600 dark:text-sky-300",
  upcoming:
    "border-amber-400/30 bg-amber-400/10 text-amber-600 dark:text-amber-300",
  breakdown:
    "border-emerald-400/30 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300",
};

function dueChip(task, today) {
  if (!task.dueDate) return null;

  if (isOverdue(task, today)) {
    return {
      text: `Overdue · ${formatMonthDay(task.dueDate)}`,
      className:
        "border-red-400/30 bg-red-400/10 text-red-600 dark:text-red-300",
    };
  }

  if (task.dueDate === today) {
    return {
      text: "Due today",
      className:
        "border-violet-400/30 bg-violet-500/10 text-violet-600 dark:text-violet-300",
    };
  }

  return {
    text: `Due ${formatMonthDay(task.dueDate)}`,
    className:
      "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)]",
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

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2" aria-live="polite">
          <span
            className={
              source === "ai"
                ? "inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-600 dark:text-violet-300"
                : "inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-semibold text-[var(--muted)]"
            }
          >
            <span aria-hidden="true">{source === "ai" ? "✧" : "◈"}</span>
            {source === "ai" ? "AI-generated" : "Rule-based preview"}
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
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:bg-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="animate-pulse" aria-hidden="true">
                ✧
              </span>
              Refreshing…
            </>
          ) : (
            <>
              <span aria-hidden="true">↻</span>
              Refresh recommendations
            </>
          )}
        </button>
      </div>

      {notice && !error && (
        <p className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-xs leading-5 text-[var(--muted)]">
          {notice}
        </p>
      )}

      <div aria-live="polite" aria-busy={loading}>
        {error && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/[0.08] p-4"
          >
            <span
              className="text-lg text-red-600 dark:text-red-300"
              aria-hidden="true"
            >
              !
            </span>

            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-200">
                Could not refresh recommendations
              </p>
              <p className="mt-1 text-sm leading-5 text-red-600 dark:text-red-300">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                className="mt-3 text-sm font-semibold text-red-700 underline underline-offset-4 hover:text-red-800 disabled:opacity-50 dark:text-red-200 dark:hover:text-white"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className={`h-40 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] ${
                  item === 0 ? "sm:col-span-2" : ""
                }`}
              />
            ))}
          </div>
        )}

        {!loading && showEmpty && openTaskCount === 0 && (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-4 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-2xl text-violet-600 dark:text-violet-300">
              ✧
            </div>

            <h3 className="mt-4 font-semibold">Nothing to recommend yet</h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
              Add a task and the assistant will suggest what to work on next,
              what is coming up, and how to break big work into steps.
            </p>

            <Link
              href="/dashboard#tasks"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:bg-violet-500"
            >
              <span aria-hidden="true" className="text-lg">
                +
              </span>
              Create a task
            </Link>
          </div>
        )}

        {!loading && showEmpty && openTaskCount > 0 && (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-4 py-8 text-center">
            <p className="text-sm font-medium">No suggestions right now</p>
            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[var(--muted)]">
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

              return (
                <article
                  key={rec.id}
                  className={`flex flex-col gap-4 rounded-xl border p-4 sm:p-5 ${
                    rec.kind === "next_task"
                      ? "border-violet-400/40 bg-violet-500/[0.06] sm:col-span-2"
                      : "border-[var(--border)] bg-[var(--background)]"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-base ${KIND_STYLES[rec.kind]}`}
                      >
                        {RECOMMENDATION_ICONS[rec.kind]}
                      </span>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                          Suggestion
                        </p>
                        <h3 className="mt-0.5 text-sm font-semibold">
                          {RECOMMENDATION_LABELS[rec.kind]}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                        rec.source === "ai"
                          ? "border-violet-400/30 bg-violet-500/10 text-violet-600 dark:text-violet-300"
                          : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)]"
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
                              className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs"
                            >
                              {rec.kind === "order" && (
                                <span
                                  aria-hidden="true"
                                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-violet-500/10 text-[10px] font-bold text-violet-600 dark:text-violet-300"
                                >
                                  {index + 1}
                                </span>
                              )}

                              <span className="min-w-0 break-words font-medium text-[var(--foreground)]">
                                {task.title}
                              </span>

                              {due && (
                                <span
                                  className={`shrink-0 rounded-full border px-2 py-0.5 ${due.className}`}
                                >
                                  {due.text}
                                </span>
                              )}

                              <span className="shrink-0 text-[var(--muted)]">
                                {PRIORITY_LABELS[task.priority] ||
                                  task.priority}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        This recommendation points at a task that is no longer
                        in your list.
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
                              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-emerald-400/30 bg-emerald-400/10 text-[10px] font-bold text-emerald-600 dark:text-emerald-300"
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
            {source === "ai"
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
