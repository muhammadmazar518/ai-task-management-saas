"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { buttonClasses } from "@/lib/ui";

export default function AiSummary() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleGenerate() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/summary", { method: "POST" });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data) {
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }

      setResult({
        summary: data.summary,
        nextSteps: data.nextSteps,
        generatedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } catch {
      setError(
        "Could not reach the server. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <Icon name="sparkles" size={14} className="text-[var(--primary)]" />
          {result
            ? `Generated at ${result.generatedAt}`
            : "Generate a summary of your workload"}
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className={buttonClasses({ variant: "primary", size: "md" })}
        >
          <Icon name={result ? "refresh" : "sparkles"} size={15} />
          {loading ? "Generating…" : result ? "Regenerate" : "Generate summary"}
        </button>
      </div>

      <div aria-live="polite" aria-busy={loading}>
        {!loading && !error && !result && (
          <div className="rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-8 text-center">
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--primary)]">
              <Icon name="sparkles" size={18} />
            </span>

            <h3 className="mt-3 text-sm font-semibold">
              Ready to see the bigger picture?
            </h3>

            <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-[var(--muted)]">
              Generate a written summary of your tasks with practical next steps
              to help you decide what to focus on.
            </p>
          </div>
        )}

        {loading && (
          <div className="space-y-3" aria-hidden="true">
            <div className="h-24 animate-pulse rounded-xl bg-[var(--surface-muted)]" />
            <div className="h-16 animate-pulse rounded-xl bg-[var(--surface-muted)]" />
            <div className="h-16 animate-pulse rounded-xl bg-[var(--surface-muted)]" />
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-red-500/25 bg-red-500/[0.07] p-3.5 text-sm text-red-700 dark:text-red-300"
          >
            <Icon name="alert" size={16} className="mt-0.5" />

            <div className="min-w-0 flex-1">
              <p className="font-medium">Could not generate insights</p>
              <p className="mt-1 leading-6">{error}</p>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="mt-2 font-semibold underline underline-offset-4 hover:text-red-800 disabled:opacity-50 dark:hover:text-red-200"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <div className="mb-2 flex items-center gap-2">
                <Icon name="inbox" size={14} className="text-[var(--primary)]" />
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Workload summary
                </h3>
              </div>

              <p className="whitespace-pre-wrap text-sm leading-7">
                {result.summary}
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Icon
                  name="trending"
                  size={14}
                  className="text-emerald-600 dark:text-emerald-400"
                />
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Suggested next steps
                </h3>
              </div>

              <ol className="space-y-2">
                {result.nextSteps.map((step, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-3"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--primary-soft)] text-[10px] font-bold text-[var(--primary)]">
                      {index + 1}
                    </span>

                    <p className="text-sm leading-6">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
