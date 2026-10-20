import LegalLayout, { LegalList, LegalSection } from "@/components/LegalLayout";
import { siteConfig } from "@/lib/content";

export const metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description:
    "How TaskFlow AI collects, uses, stores, and handles your account and task data.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Privacy Policy"
      intro="This policy explains what information TaskFlow AI handles, why it is used, and how you can ask for it to be removed. It describes the app as it is actually built today."
    >
      <LegalSection title="1. Information we handle">
        <p>
          TaskFlow AI works with the minimum information needed to run the
          service. We do not ask for or collect more than the features require.
        </p>
        <LegalList
          items={[
            "Account information: your email address and password credentials, plus the display name you provide at sign-up. Passwords are handled by our authentication provider and are never stored by the app itself.",
            "Task data: the content you create, such as task titles, priorities, statuses, and due dates.",
            "Notification read state: which notifications you have marked as read is stored only in your own browser's local storage, tied to your account identifier.",
          ]}
        />
      </LegalSection>

      <LegalSection title="2. Why we use it">
        <LegalList
          items={[
            "To authenticate you and keep your session active.",
            "To store and display your tasks and calculate statistics such as completion rates, priorities, and due-date pressure.",
            "To generate AI summaries and recommendations from your task data, when you request them.",
          ]}
        />
        <p>
          We do not use your task content for advertising, and we do not sell
          your information.
        </p>
      </LegalSection>

      <LegalSection title="3. Where your data is stored">
        <p>
          Account records and task data are stored using Supabase, which
          provides the authentication and database layer for this app. Data is
          accessed through authenticated requests, and per-user access rules are
          applied so that one account cannot read or modify another account&apos;s
          tasks. Your browser also stores a small amount of local data for
          preferences such as theme and notification read state.
        </p>
      </LegalSection>

      <LegalSection title="4. AI features">
        <p>
          When you ask for an AI summary or recommendation, the app sends a
          limited set of your task details to Google&apos;s Gemini API to generate
          the response. That request includes task titles, priorities, statuses,
          and due dates, along with basic counts. It does not include your
          password.
        </p>
        <p>
          AI output can be inaccurate or incomplete, so treat it as a suggestion
          rather than a factual statement about your work. Because the AI
          features depend on a third-party service, its own terms and policies
          also apply to the data it processes.
        </p>
      </LegalSection>

      <LegalSection title="5. Data security">
        <LegalList
          items={[
            "Access to your tasks requires an authenticated session.",
            "Database access rules restrict each account to its own data.",
            "Server-side secrets, such as the AI service key, are kept on the server and are not exposed to the browser.",
          ]}
        />
        <p>
          No online service can promise perfect security. We describe the
          protections that are in place rather than guaranteeing that a breach
          can never happen.
        </p>
      </LegalSection>

      <LegalSection title="6. Your choices and deletion requests">
        <p>
          You control the tasks you create and can edit or delete them at any
          time. If you would like your account and associated task data deleted,
          you can request it using the options on our{" "}
          <a
            href="/contact"
            className="font-medium text-[var(--primary)] underline-offset-4 hover:underline"
          >
            Contact page
          </a>
          . We will confirm what will be removed and follow up through the
          contact method you used.
        </p>
      </LegalSection>

      <LegalSection title="7. Changes to this policy">
        <p>
          If our data practices change, we will update this page so it continues
          to describe how the app actually works.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
