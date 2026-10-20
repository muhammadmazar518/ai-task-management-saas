"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const mainLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard", exact: true },
  { href: "/dashboard/tasks", label: "Tasks", icon: "tasks", exact: true },
  { href: "/dashboard/calendar", label: "Calendar", icon: "calendar", exact: true },
  { href: "/dashboard/analytics", label: "Analytics", icon: "analytics", exact: true },
  { href: "/dashboard/notifications", label: "Notifications", icon: "bell", exact: true },
  { href: "/dashboard/settings", label: "Settings", icon: "settings", exact: true },
];

function isActive(pathname, link) {
  if (link.exact) return pathname === link.href;

  const [base] = link.href.split("#");

  return pathname === base;
}

function NavLink({ link, pathname, onNavigate }) {
  const active = isActive(pathname, link);

  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
        active
          ? "bg-[var(--primary-soft)] text-[var(--primary)]"
          : "text-[var(--muted-strong)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
      }`}
    >
      <Icon name={link.icon} size={17} />
      <span className="truncate">{link.label}</span>
    </Link>
  );
}

export default function AppSidebar({ open, onClose, user = null }) {
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

  const displayName = user?.user_metadata?.full_name || user?.email || "Account";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="app-sidebar"
        aria-label="Application navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-transform duration-200 lg:w-64 lg:translate-x-0 lg:transition-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] px-4">
          <Logo size="sm" href="/dashboard" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] lg:hidden"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {mainLinks.map((link) => (
              <li key={link.href}>
                <NavLink link={link} pathname={pathname} onNavigate={onClose} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-[var(--border)] p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs font-semibold text-[var(--muted-strong)]">
              {initial}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{displayName}</p>
              <p className="truncate text-[11px] text-[var(--muted)]">
                {user?.email || "Signed in"}
              </p>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
