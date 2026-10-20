import Link from "next/link";
import LegalLayout, { LegalSection } from "@/components/LegalLayout";
import Icon from "@/components/Icon";
import { buttonClasses } from "@/lib/ui";
import { siteConfig } from "@/lib/content";

export const metadata = {
  title: `Contact | ${siteConfig.name}`,
  description:
    "How to reach the TaskFlow AI team about support, privacy, or account questions.",
};

const topics = [
  {
    icon: "shield",
    title: "Privacy and data deletion",
    description:
      "Ask for your account and task data to be removed, or ask how your information is handled.",
  },
  {
    icon: "sparkles",
    title: "AI features",
    description:
      "Report an inaccurate summary or a problem with the AI recommendations.",
  },
  {
    icon: "alert",
    title: "Bugs and account access",
    description:
      "Report a broken feature or an issue signing in to your account.",
  },
];

export default function ContactPage() {
  return (
    <LegalLayout
      eyebrow="Support"
      title="Contact"
      intro="Questions about your account, your data, or how the app works? Here is how to reach us and what to expect."
    >
      <LegalSection title="Email delivery is not configured yet">
        <p>
          This deployment of {siteConfig.name} does not currently have an email
          service connected, and no support inbox has been set up. Because of
          that, there is no contact form here — submitting a form that cannot
          deliver your message would be misleading.
        </p>
        <p>
          Once an email provider and a support address are configured, a contact
          form with validation and delivery confirmation can be added to this
          page.
        </p>
      </LegalSection>

      <LegalSection title="What you can do today">
        <p>
          Many requests can be handled directly in the app, without waiting on a
          reply:
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            <p className="text-sm font-semibold">Manage your tasks</p>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
              Edit or delete any task yourself at any time from your workspace.
            </p>
            <Link
              href="/dashboard/tasks"
              className={`${buttonClasses({ variant: "secondary", size: "sm" })} mt-3`}
            >
              Go to tasks
              <Icon name="arrowRight" size={14} />
            </Link>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            <p className="text-sm font-semibold">Review your account</p>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
              See your account details and end your session from Settings.
            </p>
            <Link
              href="/dashboard/settings"
              className={`${buttonClasses({ variant: "secondary", size: "sm" })} mt-3`}
            >
              Go to settings
              <Icon name="arrowRight" size={14} />
            </Link>
          </div>
        </div>
      </LegalSection>

      <LegalSection title="Common requests">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {topics.map((topic) => (
            <li
              key={topic.title}
              className="rounded-lg border border-[var(--border)] p-4"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted-strong)]">
                <Icon name={topic.icon} size={15} />
              </span>
              <p className="mt-3 text-sm font-semibold">{topic.title}</p>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                {topic.description}
              </p>
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="Related pages">
        <p>
          Our{" "}
          <Link
            href="/privacy"
            className="font-medium text-[var(--primary)] underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>{" "}
          explains how your account and task data are handled, and our{" "}
          <Link
            href="/terms"
            className="font-medium text-[var(--primary)] underline-offset-4 hover:underline"
          >
            Terms of Service
          </Link>{" "}
          explain the rules for using the app.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
