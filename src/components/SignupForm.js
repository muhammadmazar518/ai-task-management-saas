"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";
import Logo from "@/components/Logo";
import Icon from "@/components/Icon";
import { Alert } from "@/components/ui";
import { buttonClasses, inputClass, labelClass } from "@/lib/ui";
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
  const mismatch = confirmPassword !== "" && confirmPassword !== password;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 py-10 text-[var(--foreground)]">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo size="lg" />
          <p className="mt-3 text-sm text-[var(--muted)]">
            Your workspace for smarter productivity.
          </p>
        </div>

        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-12px_rgba(16,24,40,0.12)]">
          <div className="mb-5">
            <h1 className="text-xl font-semibold tracking-tight">
              Create your account
            </h1>
            <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">
              Set up your workspace and start organizing your tasks.
            </p>
          </div>

          <form action={formAction}>
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
                className={`${inputClass} mt-1.5`}
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
                className={`${inputClass} mt-1.5`}
              />
            </div>

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

            {mismatch && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400" role="alert">
                Passwords do not match.
              </p>
            )}

            {state?.error && (
              <div className="mt-4">
                <Alert tone="error">{state.error}</Alert>
              </div>
            )}

            {state?.message && (
              <div className="mt-4">
                <Alert tone="success">{state.message}</Alert>
              </div>
            )}

            <button
              type="submit"
              disabled={pending || mismatch}
              className={`${buttonClasses({ variant: "primary", size: "lg" })} mt-5 w-full`}
            >
              {pending ? "Please wait…" : "Create account"}
              {!pending && <Icon name="arrowRight" size={15} />}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[var(--primary)] underline-offset-4 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-[var(--muted)]">
          Stay focused. Make progress. Get things done.
        </p>

        <p className="mt-3 text-center text-sm">
          <Link
            href="/"
            className="font-medium text-[var(--muted-strong)] transition hover:text-[var(--foreground)]"
          >
            &larr; Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
