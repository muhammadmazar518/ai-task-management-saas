"use client";

import { useState } from "react";
import Link from "next/link";
import {
  countUnread,
  COMPLETED_NOTIFICATION_LIMIT,
} from "@/lib/notifications";
import { useReadIds, saveReadIds } from "@/lib/notification-store";
import { parseDateKey } from "@/lib/analytics";

const TYPE_ACCENTS = {
  overdue: {
    icon: "!",
    iconStyle:
      "border-red-400/20 bg-red-400/10 text-red-600 dark:text-red-300",
  },
  due_today: {
    icon: "◷",
    iconStyle:
      "border-violet-400/20 bg-violet-500/10 text-violet-600 dark:text-violet-300",
  },
  completed: {
    icon: "✓",
    iconStyle:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300",
  },
};

const DEFAULT_ACCENT = TYPE_ACCENTS.due_today;

function formatWhen(occurredOn, today) {
  const days = Math.round(
    (parseDateKey(today).getTime() - parseDateKey(occurredOn).getTime()) /
      86400000
  );

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return parseDateKey(occurredOn).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NotificationCenter({
  items = [],
  loadError = "",
  userId = "",
  today,
  completedTasks = 0,
  completedLimit = COMPLETED_NOTIFICATION_LIMIT,
}) {
  const readState = useReadIds(userId);
  const [error, setError] = useState(loadError);

  const hydrated = readState.hydrated;
  const activeReadIds = readState.ids;
  const unread = countUnread(items, activeReadIds);

  function markRead(id) {
    const next = new Set(activeReadIds);
    next.add(id);
    saveReadIds(userId, next);
  }

  function markAllRead() {
    saveReadIds(userId, new Set(items.map((item) => item.id)));
  }

  const completedNoteVisible =
    completedTasks > completedLimit && items.length > 0;

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

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
              Activity
            </p>
            <h2 className="mt-2 text-xl font-semibold">Your notifications</h2>
            <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">
              {hydrated
                ? unread === 0
                  ? "You are all caught up."
                  : `${unread} unread ${unread === 1 ? "notification" : "notifications"}.`
                : "Loading your notifications…"}
            </p>
          </div>

          <button
            type="button"
            onClick={markAllRead}
            disabled={!hydrated || unread === 0}
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--surface-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span aria-hidden="true">✓</span>
            Mark all as read
          </button>
        </div>

        {!hydrated ? (
          <ul className="space-y-3" aria-busy="true">
            {[0, 1, 2].map((item) => (
              <li
                key={item}
                className="h-20 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]"
              />
            ))}
          </ul>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-4 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-2xl text-violet-600 dark:text-violet-300">
              ✓
            </div>

            <h3 className="mt-4 font-semibold">You are all caught up</h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">
              You will see a notification here when a task is due today,
              becomes overdue, or gets completed.
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
        ) : (
          <ul className="space-y-3">
            {items.map((item) => {
              const accent = TYPE_ACCENTS[item.type] ?? DEFAULT_ACCENT;
              const isUnread = !activeReadIds.has(item.id);

              return (
                <li
                  key={item.id}
                  className={`flex flex-col gap-3 rounded-xl border p-4 transition sm:flex-row sm:items-center sm:justify-between ${
                    isUnread
                      ? "border-violet-400/40 bg-[var(--surface)]"
                      : "border-[var(--border)] bg-[var(--surface-muted)]/50"
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      aria-hidden="true"
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-base ${accent.iconStyle}`}
                    >
                      {accent.icon}
                    </span>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className={`text-sm font-semibold ${
                            isUnread
                              ? "text-[var(--foreground)]"
                              : "text-[var(--muted)]"
                          }`}
                        >
                          {item.title}
                        </p>

                        {isUnread && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-violet-500" aria-hidden="true" />
                        )}
                      </div>

                      <p className="mt-1 break-words text-sm leading-6 text-[var(--muted)]">
                        {item.message}
                      </p>

                      <p
                        className="mt-1 text-xs text-[var(--muted)]"
                        title={parseDateKey(item.occurredOn).toLocaleString()}
                      >
                        {formatWhen(item.occurredOn, today)}
                        {isUnread ? " · Unread" : " · Read"}
                      </p>
                    </div>
                  </div>

                  {isUnread && (
                    <button
                      type="button"
                      onClick={() => markRead(item.id)}
                      className="shrink-0 self-start rounded-xl border border-[var(--border)] px-3.5 py-2 text-sm font-medium transition hover:bg-[var(--surface-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 sm:self-auto"
                      aria-label={`Mark "${item.title}" notification as read`}
                    >
                      Mark as read
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {completedNoteVisible && (
          <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
            Showing the {completedLimit} most recently created completed tasks
            out of {completedTasks}. Completion times are not tracked by the
            app, so older completions are not listed.
          </p>
        )}
      </section>
    </div>
  );
}
