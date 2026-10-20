export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]" aria-busy="true">
      <p className="sr-only">Loading analytics…</p>

      <main className="mx-auto w-full max-w-[1500px] animate-pulse px-4 py-8 sm:px-8">
        <div className="h-4 w-32 rounded-lg bg-[var(--surface-muted)]" />
        <div className="mt-4 h-9 w-72 max-w-full rounded-lg bg-[var(--surface-muted)]" />
        <div className="mt-3 h-4 w-96 max-w-full rounded-lg bg-[var(--surface-muted)]" />

        <div className="mb-8 mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {[0, 1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 rounded-2xl bg-[var(--surface-muted)]"
            />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-56 rounded-2xl bg-[var(--surface-muted)]" />
          <div className="h-56 rounded-2xl bg-[var(--surface-muted)]" />
        </div>

        <div className="mt-6 h-80 rounded-2xl bg-[var(--surface-muted)]" />
        <div className="mt-6 h-64 rounded-2xl bg-[var(--surface-muted)]" />
      </main>
    </div>
  );
}
