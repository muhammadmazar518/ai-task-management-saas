import Link from "next/link";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import NotificationCenter from "@/components/NotificationCenter";
import { UserProvider } from "@/components/UserContext";
import { PageHeader } from "@/components/ui";
import Icon from "@/components/Icon";
import { buttonClasses } from "@/lib/ui";
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
    <UserProvider user={user}>
      <div className="min-h-screen text-[var(--foreground)]">
        <DashboardHeader
          crumb="Notifications"
          notificationItems={items}
          notificationUserId={user.id}
        />

        <main className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <PageHeader
            eyebrow="Stay on top of it"
            title="Notifications"
            description="Due-today reminders, overdue warnings, and completion confirmations — all generated from your tasks."
            actions={
              <Link
                href="/dashboard"
                className={buttonClasses({ variant: "secondary", size: "lg" })}
              >
                <Icon name="arrowLeft" size={15} />
                Back to dashboard
              </Link>
            }
          />

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
    </UserProvider>
  );
}
