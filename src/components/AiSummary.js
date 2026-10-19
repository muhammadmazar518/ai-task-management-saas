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
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-semibold text-indigo-900">AI summary</h2>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading
            ? "Generating..."
            : result
              ? "Regenerate"
              : "Generate summary"}
        </button>
      </div>

      <div aria-live="polite">
        {!loading && !error && !result && (
          <p className="mt-2 text-sm text-indigo-800">
            Get a short summary of your workload and suggested next steps.
          </p>
        )}

        {loading && (
          <p className="mt-3 text-sm text-indigo-800">
            Reading your tasks and thinking...
          </p>
        )}

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {result && !loading && (
          <div className="mt-3">
            <p className="text-sm text-indigo-950">{result.summary}</p>
            <h3 className="mt-3 text-sm font-semibold text-indigo-900">
              Suggested next steps
            </h3>
            <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-indigo-950">
              {result.nextSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-indigo-700">
              Generated at {result.generatedAt}. Based on your tasks at that
              time.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}