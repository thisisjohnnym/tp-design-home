import { teamLayout } from "@/content/grid";
import { GridCell, PageGrid } from "@/components/layout/PageGrid";

type ValueCardProps = {
  index: number;
  title: string;
  description: string;
};

export function ValueCard({ index, title, description }: ValueCardProps) {
  const label = String(index).padStart(2, "0");

  return (
    <PageGrid className="items-start">
      <GridCell
        span={teamLayout.indexOffset}
        className="max-md:hidden"
        aria-hidden
      >
        {null}
      </GridCell>
      <GridCell span={teamLayout.indexSpan} spanMobile={12}>
        <p
          className="font-sans text-[clamp(3rem,8.33vw,7.5rem)] font-bold uppercase leading-none text-ink-100 dark:text-ink-800"
          aria-hidden
        >
          {label}
        </p>
      </GridCell>
      <GridCell span={teamLayout.contentSpan} spanMobile={12}>
        <h3 className="font-sans text-[clamp(1.25rem,2.22vw,2rem)] font-bold leading-none tracking-[0.0125em]">
          {title}
        </h3>
        <p className="mt-[clamp(0.75rem,1.5vw,1.625rem)] max-w-[32.5rem] font-sans text-[clamp(1.25rem,2.22vw,2rem)] font-normal leading-[1.3] tracking-[0.0125em] text-[var(--foreground)]">
          {description}
        </p>
      </GridCell>
    </PageGrid>
  );
}
