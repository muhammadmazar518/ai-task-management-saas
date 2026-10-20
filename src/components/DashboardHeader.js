"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { logout } from "@/app/actions";
import NotificationBell from "@/components/NotificationBell";
import Icon from "@/components/Icon";
import { useSessionUser } from "@/components/UserContext";

export default function DashboardHeader({
  crumb = "Overview",
  notificationItems = [],
  notificationUserId = "",
}) {
  const user = useSessionUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const name = user?.user_metadata?.full_name || "";
  const email = user?.email || "";
  const displayName = name || email || "Account";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="z-20 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-xl lg:sticky lg:top-0">
      <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="min-w-0">
          <ol className="flex items-center gap-1.5 text-sm">
            <li className="shrink-0 text-[var(--muted)]">Workspace</li>
            <li aria-hidden="true" className="text-[var(--border-strong)]">
              /
            </li>
            <li className="truncate font-medium">{crumb}</li>
          </ol>
        </nav>

        <div className="flex items-center gap-2">
          <NotificationBell
            items={notificationItems}
            userId={notificationUserId}
          />

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Account menu"
              className="flex items-center gap-2 rounded-lg border border-transparent py-1 pl-1 pr-2 transition hover:border-[var(--border)] hover:bg-[var(--surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary-soft)] text-xs font-semibold text-[var(--primary)]">
                {initial}
              </span>

              <span className="hidden max-w-32 truncate text-sm font-medium sm:block">
                {displayName}
              </span>

              <Icon
                name="chevronDown"
                size={14}
                className="hidden text-[var(--muted)] sm:block"
              />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="ui-fade-up absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-lg shadow-slate-900/10"
              >
                <div className="border-b border-[var(--border)] px-4 py-3">
                  <p className="truncate text-sm font-medium">
                    {name || "Signed in"}
                  </p>
                  {email && (
                    <p className="truncate text-xs text-[var(--muted)]">
                      {email}
                    </p>
                  )}
                </div>

                <div className="p-1.5">
                  <Link
                    href="/dashboard"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[var(--muted-strong)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  >
                    <Icon name="dashboard" size={16} />
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/settings"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[var(--muted-strong)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  >
                    <Icon name="settings" size={16} />
                    Settings
                  </Link>
                </div>

                <form action={logout} className="border-t border-[var(--border)] p-1.5">
                  <button
                    type="submit"
                    role="menuitem"
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[var(--muted-strong)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  >
                    <Icon name="logout" size={16} />
                    Log out
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
