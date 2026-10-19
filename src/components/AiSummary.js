"use client";

import { useState } from "react";

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
    <section className="overflow-hidden rounded-2xl border border-violet-400/20 bg-[#0c0c14]">
      <div className="border-b border-white/[0.08] bg-gradient-to-r from-violet-500/[0.12] via-fuchsia-500/[0.05] to-transparent p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-2xl text-violet-300">
              ✧
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
                AI-powered insights
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                Your AI assistant
              </h2>

              <p className="mt-1 text-sm leading-5 text-slate-400">
                Understand your workload and discover your next best move.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="animate-pulse" aria-hidden="true">
                  ✧
                </span>
                Generating...
              </>
            ) : (
              <>
                <span aria-hidden="true">✧</span>
                {result ? "Regenerate insights" : "Generate summary"}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6" aria-live="polite" aria-busy={loading}>
        {!loading && !error && !result && (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-2xl text-violet-300">
              ✧
            </div>

            <h3 className="mt-4 font-medium text-slate-200">
              Ready to make your day more productive?
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Generate a summary of your tasks with practical next steps to
              help you decide what to focus on.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-3 rounded-xl border border-violet-400/15 bg-violet-500/[0.05] p-4">
            <div className="flex h-10 w-10 shrink-0 animate-pulse items-center justify-center rounded-xl bg-violet-500/15 text-xl text-violet-300">
              ✧
            </div>

            <div>
              <p className="text-sm font-medium text-slate-200">
                Analyzing your workload...
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Preparing your summary and suggested next steps.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/[0.08] p-4"
          >
            <span className="text-lg text-red-300" aria-hidden="true">
              !
            </span>

            <div>
              <p className="text-sm font-medium text-red-200">
                Could not generate insights
              </p>
              <p className="mt-1 text-sm leading-5 text-red-300">{error}</p>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="mt-3 text-sm font-semibold text-red-200 underline underline-offset-4 hover:text-white disabled:opacity-50"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-5">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-violet-300" aria-hidden="true">
                  ◈
                </span>
                <h3 className="text-sm font-semibold text-slate-200">
                  Workload summary
                </h3>
              </div>

              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                {result.summary}
              </p>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-emerald-300" aria-hidden="true">
                  ↗
                </span>
                <h3 className="text-sm font-semibold text-white">
                  Suggested next steps
                </h3>
              </div>

              <ol className="space-y-3">
                {result.nextSteps.map((step, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-500/10 text-xs font-semibold text-violet-300">
                      {index + 1}
                    </span>

                    <p className="pt-1 text-sm leading-6 text-slate-300">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <p className="text-xs text-slate-500">
              Generated at {result.generatedAt}. Based on your tasks at that
              time.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
