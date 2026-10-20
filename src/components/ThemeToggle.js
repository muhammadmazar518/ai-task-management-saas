
"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

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
      <button
        type="button"
        disabled
        aria-label="Change theme"
        className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2"
      >
        <span className="block h-5 w-5" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--foreground)] transition hover:bg-[var(--surface-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
