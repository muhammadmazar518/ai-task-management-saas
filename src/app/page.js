import Link from "next/link";

const features = [
  {
    title: "Organize your tasks",
    description:
      "Create tasks with priorities, statuses and due dates. Search and filter to find what matters.",
  },
  {
    title: "AI summaries",
    description:
      "Get a short AI-written summary of your workload and clear suggestions for what to do next.",
  },
  {
    title: "Private and secure",
    description:
      "Your tasks belong only to you. Every account is protected by secure login.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-xl font-bold text-indigo-600">TaskFlow AI</span>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:py-24">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Manage tasks smarter with AI
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Plan your work, track your progress, and let AI tell you what to
            focus on next.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700"
            >
              Open dashboard
            </Link>
            <a
              href="#features"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-100"
            >
              See features
            </a>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16">
            <h2 className="text-center text-2xl font-bold text-slate-900">
              Everything you need
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-6"
                >
                  <h3 className="font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        © 2026 TaskFlow AI. Built with Next.js.
      </footer>
    </div>
  );
}