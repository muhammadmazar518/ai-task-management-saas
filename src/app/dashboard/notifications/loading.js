import { Skeleton } from "@/components/ui";

export default function NotificationsLoading() {
  return (
    <div className="min-h-screen text-[var(--foreground)]" aria-busy="true">
      <p className="sr-only">Loading notifications…</p>

      <main className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 border-b border-[var(--border)] pb-6">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-8 w-56 max-w-full" />
          <Skeleton className="mt-3 h-4 w-80 max-w-full" />
        </div>

        <Skeleton className="h-16 rounded-[var(--radius-card)]" />

        <div className="mt-5 space-y-2">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-20 rounded-xl" />
          ))}
        </div>
      </main>
    </div>
  );
}
