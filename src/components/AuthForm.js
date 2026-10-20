
"use client";

import { useActionState } from "react";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";

export default function AuthForm({
  action,
  title,
  submitLabel,
  altText,
  altHref,
  altLabel,
}) {
  const [state, formAction, pending] = useActionState(action, null);

  const fieldClass =
    "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/10";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-4 py-6 transition-colors duration-200">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/[0.12] blur-[100px]"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-5 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-lg text-xl font-bold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-xl text-white shadow-lg shadow-violet-950/30">
              ✦
            </span>
            TaskFlow <span className="text-violet-600 dark:text-violet-300">AI</span>
          </Link>

          <p className="mt-4 text-sm text-[var(--muted)]">
            Your workspace for smarter productivity.
          </p>
        </div>

        <form
          action={formAction}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl shadow-black/10"
        >
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
              Welcome to TaskFlow
            </p>

            <h1 className="mt-3 text-2xl font-bold tracking-tight">
              {title}
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {title === "Log in"
                ? "Sign in to continue managing your tasks."
                : "Create your account and start organizing your work."}
            </p>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={fieldClass}
            />
          </div>

          <div className="mt-4">
            <PasswordInput
              id="password"
              name="password"
              label="Password"
              required
              minLength={8}
              autoComplete={
                title === "Log in" ? "current-password" : "new-password"
              }
            />
          </div>

          {state?.error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-400/20 bg-red-500/[0.08] px-4 py-3 text-sm leading-5 text-red-600 dark:text-red-300"
            >
              {state.error}
            </p>
          )}

          {state?.message && (
            <p
              role="status"
              className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.08] px-4 py-3 text-sm leading-5 text-emerald-600 dark:text-emerald-300"
            >
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Please wait..." : submitLabel}
            {!pending && <span aria-hidden="true">→</span>}
          </button>

          <p className="mt-5 text-center text-sm text-[var(--muted)]">
            {altText}{" "}
            <Link
              href={altHref}
              className="font-semibold text-violet-600 underline-offset-4 hover:underline dark:text-violet-300 dark:hover:text-violet-200"
            >
              {altLabel}
            </Link>
          </p>
        </form>

        <p className="mt-5 text-center text-xs text-[var(--muted)]">
          Stay focused. Make progress. Get things done.
        </p>
      </div>
    </main>
  );
}
