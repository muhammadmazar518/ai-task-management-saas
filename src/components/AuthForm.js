
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
    "mt-2 w-full rounded-xl border border-white/10 bg-[#09090f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/10";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090f] px-4 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/[0.12] blur-[100px]"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-xl font-bold tracking-tight text-white"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-xl text-white shadow-lg shadow-violet-950/30">
              ✦
            </span>
            TaskFlow <span className="text-violet-300">AI</span>
          </Link>

          <p className="mt-4 text-sm text-slate-400">
            Your workspace for smarter productivity.
          </p>
        </div>

        <form
          action={formAction}
          className="rounded-2xl border border-white/10 bg-[#101019]/95 p-6 shadow-2xl shadow-black/20 sm:p-8"
        >
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
              Welcome to TaskFlow
            </p>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white">
              {title}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {title === "Log in"
                ? "Sign in to continue managing your tasks."
                : "Create your account and start organizing your work."}
            </p>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300"
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

          <div className="mt-5">
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
              className="mt-4 rounded-xl border border-red-400/20 bg-red-500/[0.08] px-4 py-3 text-sm leading-5 text-red-300"
            >
              {state.error}
            </p>
          )}

          {state?.message && (
            <p
              role="status"
              className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.08] px-4 py-3 text-sm leading-5 text-emerald-300"
            >
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Please wait..." : submitLabel}
            {!pending && <span aria-hidden="true">→</span>}
          </button>

          <p className="mt-6 text-center text-sm text-slate-400">
            {altText}{" "}
            <Link
              href={altHref}
              className="font-semibold text-violet-300 underline-offset-4 hover:text-violet-200 hover:underline"
            >
              {altLabel}
            </Link>
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-slate-600">
          Stay focused. Make progress. Get things done.
        </p>
      </div>
    </main>
  );
}
