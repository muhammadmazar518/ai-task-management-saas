"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
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
      className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-strong)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
    >
      <Icon name="bell" size={16} />

      {hasUnread && (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white"
        >
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}
