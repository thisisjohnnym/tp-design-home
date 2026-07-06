"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";

const floatingNavItems = site.nav.map((item) => ({
  ...item,
  shortLabel:
    item.href === "/what-we-manage"
      ? "Manage"
      : item.href === "/how-we-work"
        ? "Process"
        : item.href === "/capabilities"
          ? "Caps"
          : item.label,
}));

export function FloatingNav() {
  const pathname = usePathname();

  return (
    <div
      className="floating-nav pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-5"
      style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
    >
      <nav
        aria-label="Primary"
        className="pointer-events-auto max-w-full overflow-x-auto rounded-full border border-[var(--rule)] bg-[var(--background)]/88 shadow-[0_12px_40px_rgba(0,0,0,0.14)] backdrop-blur-xl [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex items-center gap-0.5 p-1.5">
          {floatingNavItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  className={`block whitespace-nowrap rounded-full px-3.5 py-2 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.12em] transition md:px-4 md:text-[0.75rem] ${
                    active
                      ? "bg-[var(--foreground)] text-[var(--background)]"
                      : "text-[var(--foreground-muted)] hover:bg-[var(--ink-100)] hover:text-[var(--foreground)] dark:hover:bg-[var(--ink-800)]"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="md:hidden">{item.shortLabel}</span>
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
