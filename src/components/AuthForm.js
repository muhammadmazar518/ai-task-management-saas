"use client";

import { useActionState } from "react";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";

export default function AuthForm({ action, title, submitLabel, altText, altHref, altLabel }) {
  const [state, formAction, pending] = useActionState(action, null);

  const fieldClass =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none";

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6"
      >
        <Link href="/" className="text-lg font-bold text-indigo-600">
          TaskFlow AI
        </Link>
        <h1 className="mt-4 text-xl font-bold text-slate-900">{title}</h1>

        <label htmlFor="email" className="mt-4 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className={fieldClass} />

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          required
          minLength={8}
          autoComplete="current-password"
        />

        {state?.error && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {state.error}
          </p>
        )}
        {state?.message && (
          <p role="status" className="mt-3 text-sm text-green-700">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {pending ? "Please wait..." : submitLabel}
        </button>

        <p className="mt-4 text-center text-sm text-slate-600">
          {altText}{" "}
          <Link href={altHref} className="font-medium text-indigo-600">
            {altLabel}
          </Link>
        </p>
      </form>
    </main>
  );
}