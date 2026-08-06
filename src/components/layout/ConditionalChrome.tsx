"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "./SiteHeader";

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ownsPageChrome = pathname === "/" || pathname === "/experiment";

  useLayoutEffect(() => {
    const root = document.documentElement;

    if (ownsPageChrome) {
      root.style.setProperty("--site-header-height", "0px");
    } else {
      root.style.removeProperty("--site-header-height");
    }
  }, [ownsPageChrome]);

  return (
    <>
      {!ownsPageChrome ? <SiteHeader /> : null}
      {children}
    </>
  );
}
