"use client";

import Link from "next/link";
import { countUnread } from "@/lib/notifications";
import { useReadIds } from "@/lib/notification-store";

export default function NotificationBell({ items = [], userId = "" }) {
  const readState = useReadIds(userId);

  const unread = countUnread(items, readState.ids);
  const hasUnread = readState.hydrated && unread > 0;

  return (
    <Link
      href="/dashboard/notifications"
      aria-label={
        hasUnread
          ? `Notifications, ${unread} unread`
          : "Notifications, none unread"
      }
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--foreground)] transition hover:bg-[var(--surface-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
    >
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
      </svg>

      {hasUnread && (
        <span
          aria-hidden="true"
          className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white"
        >
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}
