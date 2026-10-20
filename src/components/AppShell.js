
"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import { siteConfig } from "@/lib/content";

const AUTHENTICATED_ROUTE_PREFIXES = ["/dashboard"];

function isAuthenticatedRoute(pathname) {
  return AUTHENTICATED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export default function AppShell({ children }) {
  const pathname = usePathname();
  const showAppChrome = isAuthenticatedRoute(pathname);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setSidebarOpen(false);
  }

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  if (!showAppChrome) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen">
      <AppSidebar open={sidebarOpen} onClose={closeSidebar} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex min-h-14 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--background)]/90 px-4 backdrop-blur-xl lg:hidden">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg font-bold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white"
            >
              T
            </span>
            <span>{siteConfig.name}</span>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            aria-controls="app-sidebar"
            aria-expanded={sidebarOpen}
            className="rounded-lg border border-[var(--border)] p-2 text-[var(--foreground)] transition hover:bg-[var(--surface-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
          >
            <span aria-hidden="true">☰</span>
          </button>
        </header>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
