const tones = {
  slate: "text-slate-900",
  green: "text-green-600",
  amber: "text-amber-600",
  red: "text-red-600",
};

export default function StatCard({ label, value, tone = "slate" }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tones[tone]}`}>{value}</p>
    </div>
  );
}