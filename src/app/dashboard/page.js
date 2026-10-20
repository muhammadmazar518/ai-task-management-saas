import Link from "next/link";
import { redirect } from "next/navigation";
import AiSummary from "@/components/AiSummary";
import AiRecommendations from "@/components/AiRecommendations";
import DashboardHeader from "@/components/DashboardHeader";
import { UserProvider } from "@/components/UserContext";
import { SectionHeading } from "@/components/ui";
import StatCard from "@/components/StatCard";
import Icon from "@/components/Icon";
import { buttonClasses } from "@/lib/ui";
import { siteConfig } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";
import { fromRow, getToday } from "@/lib/tasks";
import { buildNotifications } from "@/lib/notifications";

export const metadata = {
  title: `Dashboard | ${siteConfig.name}`,
};

export default async function DashboardPage() {
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
  const today = getToday();
  const greetingName =
    user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "";

  const openTasks = tasks.filter((task) => task.status !== "done");
  const completedTasks = tasks.filter((task) => task.status === "done");
  const dueToday = openTasks.filter((task) => task.dueDate === today);
  const overdue = tasks.filter(
    (task) => task.status !== "done" && task.dueDate && task.dueDate < today
  );

  const sections = [
    {
      href: "/dashboard/tasks",
      icon: "tasks",
      title: "Tasks",
      description: "Create, edit, filter, and organize everything you need to do.",
    },
    {
      href: "/dashboard/calendar",
      icon: "calendar",
      title: "Calendar",
      description: "See your work mapped across the month by due date.",
    },
    {
      href: "/dashboard/analytics",
      icon: "analytics",
      title: "Analytics",
      description: "Track completion rates and how your work is distributed.",
    },
    {
      href: "/dashboard/notifications",
      icon: "bell",
      title: "Notifications",
      description: "Review due, overdue, and recently completed tasks.",
    },
    {
      href: "/dashboard/settings",
      icon: "settings",
      title: "Settings",
      description: "Manage your account details and session.",
    },
  ];

  return (
    <UserProvider user={user}>
      <div className="min-h-screen text-[var(--foreground)]">
        <DashboardHeader
          crumb="Overview"
          notificationItems={buildNotifications(tasks)}
          notificationUserId={user.id}
        />

        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <section className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
                Overview
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                {greetingName ? `Welcome back, ${greetingName}` : "Welcome back"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                A clear view of your work — tasks, progress, priorities, and
                what the AI suggests you do next.
              </p>
            </div>

            <Link
              href="/dashboard/tasks"
              className={`${buttonClasses({ variant: "primary", size: "lg" })} w-fit`}
            >
              <Icon name="plus" size={16} />
              Create task
            </Link>
          </section>

          <section className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Open tasks" value={openTasks.length} tone="indigo" />
            <StatCard label="Due today" value={dueToday.length} tone="amber" />
            <StatCard label="Overdue" value={overdue.length} tone="red" />
            <StatCard
              label="Completed"
              value={completedTasks.length}
              tone="green"
            />
          </section>

          <section className="mb-8">
            <SectionHeading
              eyebrow="Explore"
              title="Your workspace"
              description="Each area of your workspace has its own page."
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {sections.map((section) => (
                <Link
                  key={section.href}
                  href={section.href}
                  className="group flex items-start gap-3 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition hover:border-[var(--border-strong)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted-strong)] transition group-hover:bg-[var(--primary-soft)] group-hover:text-[var(--primary)]">
                    <Icon name={section.icon} size={16} />
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{section.title}</p>
                    <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                      {section.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section
            id="ai-recommendations"
            className="mb-8 scroll-mt-20 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5"
          >
            <SectionHeading
              eyebrow="Smart priorities"
              title="AI task recommendations"
              description="What to work on next, what is coming up, and how to split bigger tasks into steps — built only from your open tasks."
            />

            <AiRecommendations
              tasks={tasks}
              today={today}
              loadError={
                loadError
                  ? "Could not load your tasks, so suggestions may be incomplete. Please refresh the page."
                  : ""
              }
            />
          </section>

          <section
            id="ai-assistant"
            className="scroll-mt-20 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5"
          >
            <SectionHeading
              eyebrow="Powered by AI"
              title="Your AI assistant"
              description="Turn your task list into clear priorities and practical next steps."
            />

            <AiSummary />
          </section>

          <footer className="py-8 text-center text-xs text-[var(--muted)]">
            {siteConfig.name} · Make every day count.
          </footer>
        </main>
      </div>
    </UserProvider>
  );
}
