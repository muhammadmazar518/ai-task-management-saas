"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import Icon from "@/components/Icon";

const emptySubscribe = () => () => {};
const getIsMounted = () => true;
const getIsMountedOnServer = () => false;

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getIsMounted,
    getIsMountedOnServer
  );

  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className="block h-8 w-8 rounded-lg border border-[var(--border)] bg-[var(--surface)]"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-strong)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
    >
      <Icon name={isDark ? "sun" : "moon"} size={16} />
    </button>
  );
}
