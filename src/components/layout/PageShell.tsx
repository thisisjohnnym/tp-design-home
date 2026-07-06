import type { ReactNode } from "react";
import { GridCell, PageGrid } from "./PageGrid";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function PageShell({ eyebrow, title, description, children }: PageShellProps) {
  return (
    <PageGrid className="py-12 md:py-16">
      <GridCell>
        <p className="eyebrow text-ink-500">{eyebrow}</p>
        <h1 className="display-tight mt-4 font-sans text-display-lg font-bold">{title}</h1>
        {description ? (
          <p className="mt-6 max-w-prose font-sans text-body-lg text-ink-700 dark:text-ink-200">
            {description}
          </p>
        ) : null}
        <div className="mt-section section-stack">{children}</div>
      </GridCell>
    </PageGrid>
  );
}
