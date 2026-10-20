import Link from "next/link";
import { siteConfig } from "@/lib/content";

export default function Logo({ size = "md", href = "/" }) {
  const dimensions =
    size === "sm"
      ? { box: "h-7 w-7", glyph: 15, text: "text-[15px]" }
      : size === "lg"
        ? { box: "h-10 w-10", glyph: 20, text: "text-lg" }
        : { box: "h-8 w-8", glyph: 17, text: "text-[16px]" };

  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} home`}
      className="flex min-w-0 items-center gap-2.5 rounded-lg font-semibold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
    >
      <span
        className={`flex ${dimensions.box} shrink-0 items-center justify-center rounded-[10px] bg-[var(--primary)] text-[var(--primary-contrast)] shadow-sm`}
      >
        <svg
          aria-hidden="true"
          width={dimensions.glyph}
          height={dimensions.glyph}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 12.5 4.5 4.5L19 7" />
        </svg>
      </span>

      <span className={`truncate ${dimensions.text}`}>
        TaskFlow
        <span className="text-[var(--muted)]"> AI</span>
      </span>
    </Link>
  );
}
