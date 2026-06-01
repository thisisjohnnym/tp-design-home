import { cn } from "@/lib/utils";

interface GridProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

interface ColProps {
  children: React.ReactNode;
  /**
   * How many of the 24 columns this cell spans.
   * Accepts a number (applied at all breakpoints) or a responsive object.
   * Examples:
   *   span={24}              → full width
   *   span={12}              → half width
   *   span={{ base: 24, lg: 12 }} → full on mobile, half on desktop
   */
  span?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  /**
   * Column start position (1-indexed). Optional.
   */
  start?: number;
  className?: string;
  as?: React.ElementType;
}

const spanClass: Record<number, string> = {
  1:  "col-span-1",
  2:  "col-span-2",
  3:  "col-span-3",
  4:  "col-span-4",
  5:  "col-span-5",
  6:  "col-span-6",
  7:  "col-span-7",
  8:  "col-span-8",
  9:  "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
  13: "col-span-13",
  14: "col-span-14",
  15: "col-span-15",
  16: "col-span-16",
  17: "col-span-17",
  18: "col-span-18",
  19: "col-span-19",
  20: "col-span-20",
  21: "col-span-21",
  22: "col-span-22",
  23: "col-span-23",
  24: "col-span-24",
};

const startClass: Record<number, string> = {
  1:  "col-start-1",
  2:  "col-start-2",
  3:  "col-start-3",
  4:  "col-start-4",
  5:  "col-start-5",
  6:  "col-start-6",
  7:  "col-start-7",
  8:  "col-start-8",
  9:  "col-start-9",
  10: "col-start-10",
  11: "col-start-11",
  12: "col-start-12",
  13: "col-start-13",
};

function resolveSpan(span: ColProps["span"]): string {
  if (!span) return "";
  if (typeof span === "number") return spanClass[span] ?? "";

  return [
    span.base !== undefined ? spanClass[span.base] : "",
    span.sm  !== undefined ? `sm:${spanClass[span.sm]}`  : "",
    span.md  !== undefined ? `md:${spanClass[span.md]}`  : "",
    span.lg  !== undefined ? `lg:${spanClass[span.lg]}`  : "",
    span.xl  !== undefined ? `xl:${spanClass[span.xl]}`  : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * 24-column CSS grid.
 * Gutter: 8px (gap-2). Wrap in <Container> for the 20px page margin.
 *
 * Usage:
 *   <Container>
 *     <Grid>
 *       <Col span={12}>left half</Col>
 *       <Col span={12}>right half</Col>
 *     </Grid>
 *   </Container>
 */
export function Grid({ children, className, as: Tag = "div" }: GridProps) {
  return (
    <Tag
      className={cn(
        "grid grid-cols-24 gap-[8px]",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function Col({ children, span, start, className, as: Tag = "div" }: ColProps) {
  return (
    <Tag
      className={cn(
        resolveSpan(span),
        start !== undefined ? startClass[start] : "",
        className
      )}
    >
      {children}
    </Tag>
  );
}
