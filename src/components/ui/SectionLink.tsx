import Link from "next/link";
import type { ReactNode } from "react";

export function SectionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 font-coachtopia text-body-sm font-bold text-ink-900 underline-offset-4 transition hover:underline dark:text-ink-50"
    >
      {children}
      <span aria-hidden>→</span>
    </Link>
  );
}
