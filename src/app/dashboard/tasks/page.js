import { redirect } from "next/navigation";
import TaskManager from "@/components/TaskManager";
import DashboardHeader from "@/components/DashboardHeader";
import { UserProvider } from "@/components/UserContext";
import { PageHeader } from "@/components/ui";
import { siteConfig } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";
import { fromRow } from "@/lib/tasks";
import { buildNotifications } from "@/lib/notifications";

export const metadata = {
  title: `Tasks | ${siteConfig.name}`,
};

export default async function TasksPage() {
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
          crumb="Tasks"
          notificationItems={buildNotifications(tasks)}
          notificationUserId={user.id}
        />

        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <PageHeader
            eyebrow="Your work"
            title="Tasks"
            description="Create tasks, set priorities and due dates, then track progress in list or board view."
          />

          <TaskManager
            initialTasks={tasks}
            initialView="list"
            loadError={
              loadError
                ? "Could not load your tasks. Please refresh the page."
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
