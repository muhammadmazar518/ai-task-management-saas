"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { Alert, EmptyState, Skeleton } from "@/components/ui";
import { buttonClasses } from "@/lib/ui";
import {
  countUnread,
  COMPLETED_NOTIFICATION_LIMIT,
} from "@/lib/notifications";
import { useReadIds, saveReadIds } from "@/lib/notification-store";
import { parseDateKey } from "@/lib/analytics";

const TYPE_ACCENTS = {
  overdue: {
    icon: "alert",
    iconStyle: "border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400",
  },
  due_today: {
    icon: "clock",
    iconStyle:
      "border-[var(--border)] bg-[var(--primary-soft)] text-[var(--primary)]",
  },
  completed: {
    icon: "circleCheck",
    iconStyle:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
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

  const groups = [
    {
      key: "unread",
      label: "Unread",
      items: items.filter((item) => !activeReadIds.has(item.id)),
    },
    {
      key: "read",
      label: "Earlier",
      items: items.filter((item) => activeReadIds.has(item.id)),
    },
  ].filter((group) => group.items.length > 0);

  return (
    <div className="space-y-5">
      {error && (
        <Alert onDismiss={() => setError("")}>{error}</Alert>
      )}

      <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div className="flex flex-col gap-3 border-b border-[var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted-strong)]">
              <Icon name="inbox" size={17} />
            </span>

            <div>
              <h2 className="text-sm font-semibold">All activity</h2>
              <p className="mt-0.5 text-xs text-[var(--muted)]" aria-live="polite">
                {hydrated
                  ? unread === 0
                    ? "You are all caught up."
                    : `${unread} unread ${unread === 1 ? "notification" : "notifications"}`
                  : "Loading your notifications…"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={markAllRead}
            disabled={!hydrated || unread === 0}
            className={buttonClasses({ variant: "secondary", size: "md" })}
          >
            <Icon name="check" size={15} />
            Mark all as read
          </button>
        </div>

        <div className="p-3 sm:p-4">
          {!hydrated ? (
            <div className="space-y-2" aria-busy="true">
              {[0, 1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-20 rounded-xl" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon="bell"
              title="You are all caught up"
              description="Notifications appear here when a task is due today, becomes overdue, or gets completed."
              action={
                <Link
                  href="/dashboard/tasks"
                  className={buttonClasses({ variant: "primary", size: "lg" })}
                >
                  <Icon name="plus" size={15} />
                  Create a task
                </Link>
              }
            />
          ) : (
            <div className="space-y-5">
              {groups.map((group) => (
                <div key={group.key}>
                  <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    {group.label} · {group.items.length}
                  </p>

                  <ul className="space-y-2">
                    {group.items.map((item) => {
                      const accent = TYPE_ACCENTS[item.type] ?? DEFAULT_ACCENT;
                      const isUnread = !activeReadIds.has(item.id);

                      return (
                        <li
                          key={item.id}
                          className={`flex flex-col gap-3 rounded-xl border p-3.5 transition sm:flex-row sm:items-center sm:justify-between ${
                            isUnread
                              ? "border-[var(--border-strong)] bg-[var(--surface)]"
                              : "border-[var(--border)] bg-[var(--surface-muted)]/60"
                          }`}
                        >
                          <div className="flex min-w-0 items-start gap-3">
                            <span
                              aria-hidden="true"
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${accent.iconStyle}`}
                            >
                              <Icon name={accent.icon} size={15} />
                            </span>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p
                                  className={`text-sm font-medium ${
                                    isUnread
                                      ? "text-[var(--foreground)]"
                                      : "text-[var(--muted-strong)]"
                                  }`}
                                >
                                  {item.title}
                                </p>

                                {isUnread && (
                                  <span
                                    aria-label="Unread"
                                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]"
                                  />
                                )}
                              </div>

                              <p className="mt-1 break-words text-sm leading-6 text-[var(--muted)]">
                                {item.message}
                              </p>

                              <p
                                className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--muted)]"
                                title={parseDateKey(item.occurredOn).toLocaleString()}
                              >
                                <Icon name="clock" size={12} />
                                {formatWhen(item.occurredOn, today)}
                              </p>
                            </div>
                          </div>

                          {isUnread && (
                            <button
                              type="button"
                              onClick={() => markRead(item.id)}
                              className={`${buttonClasses({
                                variant: "secondary",
                                size: "sm",
                              })} shrink-0 self-start sm:self-auto`}
                              aria-label={`Mark "${item.title}" notification as read`}
                            >
                              Mark as read
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {completedNoteVisible && (
          <p className="border-t border-[var(--border)] px-4 py-3 text-xs leading-5 text-[var(--muted)] sm:px-5">
            Showing the {completedLimit} most recently created completed tasks out
            of {completedTasks}. Completion times are not tracked by the app, so
            older completions are not listed.
          </p>
        )}
      </section>
    </div>
  );
}
