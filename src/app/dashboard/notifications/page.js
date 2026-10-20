
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import NotificationCenter from "@/components/NotificationCenter";
import { siteConfig } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";
import { fromRow, getToday } from "@/lib/tasks";
import {
  buildNotifications,
  countCompletedTasks,
  COMPLETED_NOTIFICATION_LIMIT,
} from "@/lib/notifications";

export const metadata = {
  title: `Notifications | ${siteConfig.name}`,
};

export default async function NotificationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: rows, error: loadError } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const tasks = (rows ?? []).map(fromRow);

  const items = buildNotifications(tasks);
  const today = getToday();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      <div className="min-w-0">
        <DashboardHeader
          user={user}
          crumb="Notifications"
          notificationItems={items}
          notificationUserId={user.id}
        />

        <main className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-8">
          <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-sm font-medium text-violet-600 dark:text-violet-400">
                STAY ON TOP OF IT
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Your notifications, in one place.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base">
                Due-today reminders, overdue warnings, and completion confirmations
                — generated from your tasks.
              </p>
            </div>

            <a
              href="/dashboard"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold transition hover:bg-[var(--surface-muted)]"
            >
              ← Back to dashboard
            </a>
          </section>

          <NotificationCenter
            items={items}
            today={today}
            userId={user.id}
            completedTasks={countCompletedTasks(tasks)}
            completedLimit={COMPLETED_NOTIFICATION_LIMIT}
            loadError={
              loadError
                ? "Could not load your tasks, so notifications may be incomplete. Please refresh the page."
                : ""
            }
          />

          <footer className="py-8 text-center text-xs text-[var(--muted)]">
            {siteConfig.name} · Make every day count.
          </footer>
        </main>
      </div>
    </div>
  );
}
