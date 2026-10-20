export default function NotificationsLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]" aria-busy="true">
      <p className="sr-only">Loading notifications…</p>

      <main className="mx-auto w-full max-w-[1500px] animate-pulse px-4 py-8 sm:px-8">
        <div className="h-4 w-32 rounded-lg bg-[var(--surface-muted)]" />
        <div className="mt-4 h-9 w-96 max-w-full rounded-lg bg-[var(--surface-muted)]" />
        <div className="mt-3 h-4 w-72 max-w-full rounded-lg bg-[var(--surface-muted)]" />

        <div className="mb-8 mt-8 h-72 rounded-2xl bg-[var(--surface-muted)]" />

        <div className="space-y-3">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 rounded-xl bg-[var(--surface-muted)]"
            />
          ))}
        </div>
      </main>
    </div>
  );
}
