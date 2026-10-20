import { logout } from "@/app/actions";
import NotificationBell from "@/components/NotificationBell";

export default function DashboardHeader({
  user,
  crumb = "Overview",
  notificationItems = [],
  notificationUserId = "",
}) {
  return (
    <header className="z-10 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl lg:sticky lg:top-0">
      <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-8">
        <div>
          <p className="text-xs text-[var(--muted)]">Workspace / {crumb}</p>
          <p className="mt-1 text-sm font-semibold">
            Welcome back
            {user?.user_metadata?.full_name
              ? `, ${user.user_metadata.full_name}`
              : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell
            items={notificationItems}
            userId={notificationUserId}
          />

          <div className="hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--muted)] sm:block">
            ✧ Your AI workspace
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/15 text-sm font-bold text-violet-600 dark:text-violet-300">
            {(user?.user_metadata?.full_name || user?.email || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:bg-[var(--surface-muted)]"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
