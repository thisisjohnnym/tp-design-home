import type { ReactNode } from "react";
import { GridCell, PageGrid } from "./PageGrid";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description?: string;
  sectionIndex?: string;
  children: ReactNode;
};

export function PageShell({
  eyebrow,
  title,
  description,
  sectionIndex,
  children,
}: PageShellProps) {
  return (
    <PageGrid className="py-16 md:py-24">
      <GridCell>
        <header className="max-w-[52rem]">
          <div className="flex items-baseline justify-between gap-6">
            <p className="eyebrow text-ink-500">{eyebrow}</p>
            {sectionIndex ? (
              <p className="eyebrow shrink-0 text-ink-300" aria-hidden>
                {sectionIndex}
              </p>
            ) : null}
          </div>
          <div className="editorial-rule editorial-rule--accent editorial-rule--full mt-5" />
          <h2 className="editorial-display mt-7 text-foreground">{title}</h2>
          {description ? (
            <p className="editorial-deck mt-8 border-l-0 pl-0 text-ink-700 dark:text-ink-200">
              {description}
            </p>
          ) : null}
        </header>
        <div className="editorial-rule editorial-rule--full mt-section" />
        <div className="mt-section section-stack">{children}</div>
      </GridCell>
    </PageGrid>
  );
}
