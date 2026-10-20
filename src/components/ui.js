import Icon from "@/components/Icon";

export function PageHeader({ eyebrow, title, description, actions = null }) {
  return (
    <section className="mb-6 flex flex-col gap-4 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">{eyebrow}</p>}
        <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-[28px]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </section>
  );
}

export function SectionHeading({ eyebrow, title, description, actions = null }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{eyebrow}</p>}
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description}</p>
        )}
      </div>

      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Alert({ children, tone = "error", onDismiss = null, className = "" }) {
  const tones = {
    error: "border-red-500/25 bg-red-500/[0.07] text-red-700 dark:text-red-300",
    info: "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted-strong)]",
    success:
      "border-emerald-500/25 bg-emerald-500/[0.07] text-emerald-700 dark:text-emerald-300",
  };

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-lg border p-3 text-sm leading-6 ${tones[tone]} ${className}`}
    >
      <Icon
        name={tone === "error" ? "alert" : tone === "success" ? "circleCheck" : "inbox"}
        size={16}
        className="mt-0.5"
      />

      <div className="min-w-0 flex-1">{children}</div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss message"
          className="shrink-0 rounded-md p-1 opacity-70 transition hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          <Icon name="close" size={14} />
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action = null,
  className = "",
}) {
  return (
    <div
      className={`rounded-[var(--radius-card)] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-5 py-10 text-center ${className}`}
    >
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]">
        <Icon name={icon} size={20} />
      </div>

      <h3 className="mt-3.5 text-sm font-semibold">{title}</h3>

      {description && (
        <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-[var(--muted)]">
          {description}
        </p>
      )}

      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-[var(--surface-muted)] ${className}`}
    />
  );
}

export function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium leading-5 whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}

export function MetaRow({ items = [] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {items.filter(Boolean).map((item, index) => (
        <Badge key={`${item.text}-${index}`} className={item.className}>
          {item.icon && <Icon name={item.icon} size={12} />}
          {item.text}
        </Badge>
      ))}
    </div>
  );
}
