import LegalLayout, { LegalList, LegalSection } from "@/components/LegalLayout";
import { siteConfig } from "@/lib/content";

export const metadata = {
  title: `Terms of Service | ${siteConfig.name}`,
  description:
    "The terms that apply when you create an account and use TaskFlow AI.",
};

export default function TermsPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Terms of Service"
      intro="These terms describe the rules for using TaskFlow AI. By creating an account or using the app, you agree to them."
    >
      <LegalSection title="1. Your account">
        <LegalList
          items={[
            "You are responsible for the accuracy of the information you provide and for keeping your login credentials private.",
            "You are responsible for activity carried out through your account.",
            "You must be legally able to enter into these terms to use the service.",
          ]}
        />
        <p>
          Please tell us through the{" "}
          <a
            href="/contact"
            className="font-medium text-[var(--primary)] underline-offset-4 hover:underline"
          >
            Contact page
          </a>{" "}
          if you believe your account has been accessed without your permission.
        </p>
      </LegalSection>

      <LegalSection title="2. Acceptable use">
        <p>You agree not to use TaskFlow AI to:</p>
        <LegalList
          items={[
            "Break any applicable law or infringe the rights of others.",
            "Attempt to access another user's data or interfere with the service, its servers, or its security features.",
            "Upload content that is unlawful, harmful, or designed to abuse the AI features.",
            "Automate requests in a way that places unreasonable load on the service or its third-party providers.",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Tasks and AI limitations">
        <LegalList
          items={[
            "You own the tasks and content you create. You are responsible for keeping copies of anything important to you.",
            "AI summaries and recommendations are generated automatically and may be inaccurate, incomplete, or unsuitable for your situation.",
            "The app is a productivity tool, not professional advice. Do not rely on it for legal, financial, medical, or safety decisions.",
            "AI features depend on a third-party service and may be unavailable or rate-limited at times.",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Service availability">
        <p>
          The service is provided on an &quot;as available&quot; basis. We aim to
          keep it running, but we do not guarantee uninterrupted or error-free
          operation, and we may change, suspend, or discontinue features.
        </p>
      </LegalSection>

      <LegalSection title="5. Subscription, cancellation, and refunds">
        <p>
          TaskFlow AI does not currently offer paid plans, subscriptions,
          billing, or in-app purchases. Because no payments are collected, no
          cancellation or refund terms apply. If paid features are introduced,
          this section will be updated to describe them before they take effect.
        </p>
      </LegalSection>

      <LegalSection title="6. Account termination">
        <LegalList
          items={[
            "You may stop using the service at any time and request deletion of your account and data through the Contact page.",
            "We may suspend or terminate access if these terms are breached or if the service must be protected from abuse.",
          ]}
        />
      </LegalSection>

      <LegalSection title="7. Changes to these terms">
        <p>
          We may update these terms as the service evolves. When we do, we will
          revise this page so it reflects the current terms.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
