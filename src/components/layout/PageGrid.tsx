import type { CSSProperties, ElementType, ReactNode } from "react";
import { grid } from "@/content/grid";

type PageGridProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

/**
 * Responsive layout grid from design tokens (`src/content/grid.ts`):
 * - Mobile: 12 columns, 12px margin, 4px gutter
 * - Desktop (768px+): 24 columns, 20px margin, 8px gutter
 */
export function PageGrid({ children, className = "", as: Tag = "div" }: PageGridProps) {
  return <Tag className={`page-grid ${className}`.trim()}>{children}</Tag>;
}

type GridCellProps = {
  children: ReactNode;
  /** Columns to span on desktop (1–24). Default: full width (24). */
  span?: number;
  /** Columns to span on mobile (1–12). Default: full width (12), or proportional to `span`. */
  spanMobile?: number;
  className?: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Maps desktop span (24-col) to proportional mobile span (12-col) when spanMobile omitted */
function defaultMobileSpan(desktopSpan: number): number {
  return clamp(Math.round((desktopSpan / grid.desktop.columns) * grid.mobile.columns), 1, 12);
}

export function GridCell({ children, span = 24, spanMobile, className = "" }: GridCellProps) {
  const desktopSpan = clamp(span, 1, grid.desktop.columns);
  const mobileSpan = clamp(spanMobile ?? defaultMobileSpan(desktopSpan), 1, grid.mobile.columns);

  return (
    <div
      className={`grid-cell min-w-0 ${className}`.trim()}
      style={
        {
          "--grid-span-mobile": mobileSpan,
          "--grid-span-desktop": desktopSpan,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
