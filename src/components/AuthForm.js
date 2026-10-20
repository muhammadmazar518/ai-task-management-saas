"use client";

import { useActionState } from "react";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";
import Logo from "@/components/Logo";
import Icon from "@/components/Icon";
import { Alert } from "@/components/ui";
import { buttonClasses, inputClass, labelClass } from "@/lib/ui";

export default function AuthForm({
  action,
  title,
  submitLabel,
  altText,
  altHref,
  altLabel,
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const isLogin = title === "Log in";

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
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">
              {isLogin
                ? "Sign in to continue managing your tasks."
                : "Create your account and start organizing your work."}
            </p>
          </div>

          <form action={formAction}>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
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
              autoComplete={isLogin ? "current-password" : "new-password"}
            />

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
              disabled={pending}
              className={`${buttonClasses({ variant: "primary", size: "lg" })} mt-5 w-full`}
            >
              {pending ? "Please wait…" : submitLabel}
              {!pending && <Icon name="arrowRight" size={15} />}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[var(--muted)]">
            {altText}{" "}
            <Link
              href={altHref}
              className="font-semibold text-[var(--primary)] underline-offset-4 hover:underline"
            >
              {altLabel}
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
