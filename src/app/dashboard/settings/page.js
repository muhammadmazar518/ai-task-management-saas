import { redirect } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import { UserProvider } from "@/components/UserContext";
import { PageHeader, SectionHeading } from "@/components/ui";
import Icon from "@/components/Icon";
import { buttonClasses } from "@/lib/ui";
import { logout } from "@/app/actions";
import { siteConfig } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";
import { fromRow } from "@/lib/tasks";
import { buildNotifications } from "@/lib/notifications";

export const metadata = {
  title: `Settings | ${siteConfig.name}`,
};

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: rows } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const tasks = (rows ?? []).map(fromRow);

  const displayName = user.user_metadata?.full_name || "Signed in";
  const initial = (user.user_metadata?.full_name || user.email || "A")
    .charAt(0)
    .toUpperCase();

  return (
    <UserProvider user={user}>
      <div className="min-h-screen text-[var(--foreground)]">
        <DashboardHeader
          crumb="Settings"
          notificationItems={buildNotifications(tasks)}
          notificationUserId={user.id}
        />

        <main className="mx-auto w-full max-w-[900px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <PageHeader
            eyebrow="Account"
            title="Settings"
            description="Your signed-in account and session controls."
          />

          <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5">
            <SectionHeading
              eyebrow="Profile"
              title="Account details"
              description="This information comes from your authentication provider."
            />

            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-sm font-semibold text-[var(--primary)]">
                {initial}
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{displayName}</p>
                <p className="truncate text-xs text-[var(--muted)]">
                  {user.email}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5">
            <SectionHeading
              eyebrow="Session"
              title="Sign out"
              description="End your session on this device."
            />

            <form action={logout}>
              <button
                type="submit"
                className={buttonClasses({ variant: "secondary", size: "lg" })}
              >
                <Icon name="logout" size={15} />
                Log out
              </button>
            </form>
          </section>

          <footer className="py-8 text-center text-xs text-[var(--muted)]">
            {siteConfig.name} · Make every day count.
          </footer>
        </main>
      </div>
    </UserProvider>
  );
}
