import { Skeleton } from "@/components/ui";

export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen text-[var(--foreground)]" aria-busy="true">
      <p className="sr-only">Loading analytics…</p>

      <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 border-b border-[var(--border)] pb-6">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-8 w-72 max-w-full" />
          <Skeleton className="mt-3 h-4 w-96 max-w-full" />
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {[0, 1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-[104px] rounded-[var(--radius-card)]" />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-56 rounded-[var(--radius-card)]" />
          <Skeleton className="h-56 rounded-[var(--radius-card)]" />
        </div>

        <Skeleton className="mt-6 h-80 rounded-[var(--radius-card)]" />
        <Skeleton className="mt-6 h-64 rounded-[var(--radius-card)]" />
      </main>
    </div>
  );
}
