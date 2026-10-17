"use client";

import { useState } from "react";

export default function PasswordInput({ id, label, ...inputProps }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mt-4">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-16 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-indigo-600 hover:text-indigo-800"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}