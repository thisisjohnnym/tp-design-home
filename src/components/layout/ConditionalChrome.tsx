"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "./SiteHeader";

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSiteHeader = pathname === "/";

  useLayoutEffect(() => {
    const root = document.documentElement;

    if (pathname === "/") {
      root.style.setProperty("--site-header-height", "0px");
    } else {
      root.style.removeProperty("--site-header-height");
    }
  }, [pathname]);

  return (
    <>
      {!hideSiteHeader ? <SiteHeader /> : null}
      {children}
    </>
  );
}
