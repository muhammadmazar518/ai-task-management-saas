export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-55";

export const buttonSizes = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-3.5 py-2 text-sm",
  lg: "px-4 py-2.5 text-sm",
};

export const buttonVariants = {
  primary:
    "bg-[var(--primary)] text-[var(--primary-contrast)] shadow-sm hover:bg-[var(--primary-hover)] active:translate-y-px",
  secondary:
    "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-muted)]",
  ghost:
    "text-[var(--muted-strong)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
  subtle:
    "border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] hover:border-[var(--border-strong)]",
  success:
    "border border-emerald-500/25 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/18 dark:text-emerald-300",
  danger:
    "border border-red-500/25 bg-red-500/10 text-red-700 hover:bg-red-500/18 dark:text-red-300",
};

export function buttonClasses({
  variant = "secondary",
  size = "md",
  className = "",
} = {}) {
  return `${buttonBase} ${buttonSizes[size]} ${buttonVariants[variant]} ${className}`;
}

export const cardClass =
  "rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_2px_rgba(16,24,40,0.04)]";

export const panelClass = `${cardClass} p-4 sm:p-5`;

export const inputClass =
  "w-full min-w-0 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-60";

export const labelClass = "text-sm font-medium text-[var(--foreground)]";

export const eyebrowClass =
  "text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]";

export const badgeBase =
  "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium leading-5 whitespace-nowrap";

export const statusStyles = {
  todo: "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  in_progress:
    "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  done: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

export const priorityStyles = {
  low: "border-slate-500/20 bg-slate-500/10 text-[var(--muted-strong)]",
  medium: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  high: "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300",
};

export const priorityDots = {
  low: "bg-sky-400",
  medium: "bg-amber-400",
  high: "bg-red-400",
};

export const statusDots = {
  todo: "bg-sky-400",
  in_progress: "bg-amber-400",
  done: "bg-emerald-400",
};

export const alertStyles = {
  error:
    "border-red-500/25 bg-red-500/[0.07] text-red-700 dark:text-red-300",
  info: "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted-strong)]",
  success:
    "border-emerald-500/25 bg-emerald-500/[0.07] text-emerald-700 dark:text-emerald-300",
};
