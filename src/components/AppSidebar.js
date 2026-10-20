
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { siteConfig } from "@/lib/content";

const mainLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "▦", exact: true },
  { href: "/dashboard#tasks", label: "My tasks", icon: "☷" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "◔", exact: true },
  { href: "/dashboard/notifications", label: "Notifications", icon: "◉", exact: true },
  { href: "/dashboard#ai-assistant", label: "AI assistant", icon: "✧" },
];

function navLinkClasses(active) {
  if (active) {
    return "flex items-center gap-3 rounded-xl border border-violet-400/20 bg-violet-500/10 px-3 py-3 text-sm font-medium text-violet-600 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 dark:text-violet-300";
  }

  return "flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-sm text-[var(--muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60";
}

export default function AppSidebar({ open, onClose }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="app-sidebar"
        aria-label={`${siteConfig.name} sidebar`}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-transform duration-200 lg:w-64 lg:translate-x-0 lg:transition-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-5">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg font-bold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
          >
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-lg font-bold text-white shadow-lg shadow-violet-950/30"
            >
              T
            </span>
            <span>{siteConfig.name}</span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-lg border border-[var(--border)] p-2 text-[var(--muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 lg:hidden"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <nav aria-label="Main" className="px-3">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Navigation
          </p>

          <ul className="space-y-1">
            {mainLinks.map((link) => {
              const isActive = Boolean(link.exact) && pathname === link.href;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={navLinkClasses(isActive)}
                  >
                    <span aria-hidden="true">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto space-y-3 p-5">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            <div
              aria-hidden="true"
              className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-lg text-violet-600 dark:text-violet-300"
            >
              ✦
            </div>
            <p className="text-sm font-semibold">Make work flow</p>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
              Organize your day and stay focused on what matters.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] px-3 py-2">
            <span className="text-xs font-medium text-[var(--muted)]">
              Theme
            </span>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
