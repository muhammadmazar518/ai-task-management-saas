import Link from "next/link";
import Logo from "@/components/Logo";
import Icon from "@/components/Icon";
import { siteConfig } from "@/lib/content";

const footerLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/contact", label: "Contact" },
];

const headerLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
];

export default function LegalLayout({ eyebrow, title, intro, updated, children }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          <div className="flex items-center gap-1.5">
            <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
              {headerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted-strong)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted-strong)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <Icon name="arrowLeft" size={15} />
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-3 text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-7">
              {intro}
            </p>
          )}
          {updated && (
            <p className="mt-3 text-xs text-[var(--muted)]">{updated}</p>
          )}
        </div>

        <div className="mt-8 max-w-3xl space-y-8">{children}</div>
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Logo size="sm" />

            <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[var(--muted-strong)] transition hover:text-[var(--foreground)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-6 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted)]">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function LegalSection({ title, children }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6">
      <h2 className="text-base font-semibold tracking-tight sm:text-lg">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-6 text-[var(--muted-strong)]">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span
            aria-hidden="true"
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--border-strong)]"
          />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}
