
const tones = {
  slate: {
    icon: "▤",
    iconStyle: "border-violet-400/20 bg-violet-400/10 text-violet-300",
    valueStyle: "text-white",
    accent: "bg-violet-400",
  },
  green: {
    icon: "✓",
    iconStyle: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    valueStyle: "text-emerald-300",
    accent: "bg-emerald-400",
  },
  amber: {
    icon: "◷",
    iconStyle: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    valueStyle: "text-amber-200",
    accent: "bg-amber-400",
  },
  red: {
    icon: "!",
    iconStyle: "border-red-400/20 bg-red-400/10 text-red-300",
    valueStyle: "text-red-300",
    accent: "bg-red-400",
  },
};

export default function StatCard({ label, value, tone = "slate" }) {
  const style = tones[tone] || tones.slate;

  return (
    <article className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-4 transition hover:border-violet-400/20 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-slate-400">{label}</p>

        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl border text-base ${style.iconStyle}`}
          aria-hidden="true"
        >
          {style.icon}
        </span>
      </div>

      <p className={`mt-5 text-3xl font-bold tracking-tight ${style.valueStyle}`}>
        {value}
      </p>

      <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div className={`h-full w-1/3 rounded-full ${style.accent}`} />
      </div>
    </article>
  );
}
