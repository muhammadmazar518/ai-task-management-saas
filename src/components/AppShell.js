"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import Logo from "@/components/Logo";
import Icon from "@/components/Icon";
import { useSessionUser } from "@/components/UserContext";

const AUTHENTICATED_ROUTE_PREFIXES = ["/dashboard"];

function isAuthenticatedRoute(pathname) {
  return AUTHENTICATED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export default function AppShell({ children }) {
  const pathname = usePathname();
  const user = useSessionUser();
  const showAppChrome = isAuthenticatedRoute(pathname);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  if (!showAppChrome) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen">
      <AppSidebar open={sidebarOpen} onClose={closeSidebar} user={user} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--background)]/85 px-4 backdrop-blur-xl lg:hidden">
          <Logo size="sm" href="/dashboard" />

          <div className="flex items-center gap-1.5">
            <Link
              href="/dashboard/notifications"
              aria-label="Notifications"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-strong)] transition hover:bg-[var(--surface-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <Icon name="bell" size={16} />
            </Link>

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              aria-controls="app-sidebar"
              aria-expanded={sidebarOpen}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-strong)] transition hover:bg-[var(--surface-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <Icon name="menu" size={16} />
            </button>
          </div>
        </header>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
