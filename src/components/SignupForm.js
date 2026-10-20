
"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";
import { signup } from "@/app/actions";
import { getPasswordStrength } from "@/lib/password";

const barColors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
];

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const strength = getPasswordStrength(password);
  const mismatch =
    confirmPassword !== "" && confirmPassword !== password;

  const fieldClass =
    "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/10";

  const labelClass = "block text-sm font-medium text-[var(--foreground)]";

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
              Get started for free
            </p>

            <h1 className="mt-3 text-2xl font-bold tracking-tight">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Set up your workspace and start organizing your tasks.
            </p>
          </div>

          <div>
            <label htmlFor="name" className={labelClass}>
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={50}
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className={fieldClass}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="email" className={labelClass}>
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {password && (
            <div className="mt-2" aria-live="polite">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((segment) => (
                  <div
                    key={segment}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      strength.score >= segment
                        ? barColors[strength.score - 1]
                        : "bg-[var(--border)]"
                    }`}
                  />
                ))}
              </div>

              <p className="mt-2 text-xs text-[var(--muted)]">
                Password strength:{" "}
                <span className="font-medium text-[var(--foreground)]">
                  {strength.label}
                </span>
              </p>
            </div>
          )}

          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            Use at least 8 characters with letters and numbers. Capitals and
            symbols can make it stronger.
          </p>

          <div className="mt-4">
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {mismatch && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-300" role="alert">
              Passwords do not match.
            </p>
          )}

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
            disabled={pending || mismatch}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Please wait..." : "Create account"}
            {!pending && <span aria-hidden="true">→</span>}
          </button>

          <p className="mt-5 text-center text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-violet-600 underline-offset-4 hover:underline dark:text-violet-300 dark:hover:text-violet-200"
            >
              Log in
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
