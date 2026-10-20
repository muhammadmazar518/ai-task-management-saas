import Link from "next/link";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { UserProvider } from "@/components/UserContext";
import { PageHeader } from "@/components/ui";
import Icon from "@/components/Icon";
import { buttonClasses } from "@/lib/ui";
import { siteConfig } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";
import { fromRow } from "@/lib/tasks";
import { buildNotifications } from "@/lib/notifications";

export const metadata = {
  title: `Analytics | ${siteConfig.name}`,
};

export default async function AnalyticsPage() {
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

  return (
    <UserProvider user={user}>
      <div className="min-h-screen text-[var(--foreground)]">
        <DashboardHeader
          crumb="Analytics"
          notificationItems={buildNotifications(tasks)}
          notificationUserId={user.id}
        />

        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <PageHeader
            eyebrow="Insights"
            title="Your productivity, measured"
            description="Completion, priorities, trends, and upcoming deadlines — computed entirely from your own tasks."
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

          <AnalyticsDashboard
            initialTasks={tasks}
            loadError={
              loadError
                ? "Could not load your analytics. Please refresh the page."
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
