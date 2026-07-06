"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { CustomCursor } from "@/components/cursor/CustomCursor";

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAlternativeHome = pathname === "/";

  return (
    <>
      {!isAlternativeHome ? <CustomCursor /> : null}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[var(--foreground)] focus:px-4 focus:py-2 focus:text-[var(--background)]"
      >
        Skip to content
      </a>
      {!isAlternativeHome ? <SiteHeader /> : null}
      <main id="main">{children}</main>
      {!isAlternativeHome ? <SiteFooter /> : null}
    </>
  );
}
