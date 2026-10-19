
"use client";

import { useState } from "react";

export default function PasswordInput({ id, label, ...inputProps }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mt-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-300"
      >
        {label}
      </label>

      <div className="relative mt-2">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className="w-full rounded-xl border border-white/10 bg-[#09090f] px-4 py-3 pr-16 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/10"
          {...inputProps}
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 rounded-r-xl px-4 text-xs font-semibold text-violet-300 transition hover:text-violet-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-400/50"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
