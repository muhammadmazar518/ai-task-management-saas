import Icon from "@/components/Icon";

const tones = {
  slate: {
    icon: "tasks",
    iconStyle: "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted-strong)]",
    valueStyle: "text-[var(--foreground)]",
  },
  green: {
    icon: "circleCheck",
    iconStyle: "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    valueStyle: "text-emerald-600 dark:text-emerald-400",
  },
  amber: {
    icon: "clock",
    iconStyle: "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    valueStyle: "text-amber-600 dark:text-amber-400",
  },
  red: {
    icon: "alert",
    iconStyle: "border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400",
    valueStyle: "text-red-600 dark:text-red-400",
  },
  indigo: {
    icon: "circleDot",
    iconStyle: "border-[var(--border)] bg-[var(--primary-soft)] text-[var(--primary)]",
    valueStyle: "text-[var(--foreground)]",
  },
};

export default function StatCard({ label, value, tone = "slate", hint = "" }) {
  const style = tones[tone] || tones.slate;

  return (
    <article className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition hover:border-[var(--border-strong)]">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          {label}
        </p>

        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${style.iconStyle}`}
          aria-hidden="true"
        >
          <Icon name={style.icon} size={14} />
        </span>
      </div>

      <p className={`mt-3 text-2xl font-semibold tracking-tight ${style.valueStyle}`}>
        {value}
      </p>

      {hint && <p className="mt-1 truncate text-xs text-[var(--muted)]">{hint}</p>}
    </article>
  );
}
