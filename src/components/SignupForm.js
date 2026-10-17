"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";
import { signup } from "@/app/actions";
import { getPasswordStrength } from "@/lib/password";

const barColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const strength = getPasswordStrength(password);
  const mismatch = confirmPassword !== "" && confirmPassword !== password;

  const fieldClass =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none";
  const labelClass = "block text-sm font-medium text-slate-700";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6"
      >
        <Link href="/" className="text-lg font-bold text-indigo-600">
          TaskFlow AI
        </Link>
        <h1 className="mt-4 text-xl font-bold text-slate-900">
          Create your account
        </h1>

        <label htmlFor="name" className={`mt-4 ${labelClass}`}>
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
          className={fieldClass}
        />

        <label htmlFor="email" className={`mt-4 ${labelClass}`}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
        />

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
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((segment) => (
                <div
                  key={segment}
                  className={`h-1.5 flex-1 rounded ${
                    strength.score >= segment
                      ? barColors[strength.score - 1]
                      : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Strength: <span className="font-medium">{strength.label}</span>
            </p>
          </div>
        )}
        <p className="mt-1 text-xs text-slate-500">
          Use 8+ characters with letters and numbers. Capitals and symbols make
          it stronger.
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
          <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>
        )}

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
          disabled={pending || mismatch}
          className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {pending ? "Please wait..." : "Sign up"}
        </button>

        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-indigo-600">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}