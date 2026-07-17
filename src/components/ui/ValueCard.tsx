import { GridCell, PageGrid } from "@/components/layout/PageGrid";
import { Reveal } from "@/components/Reveal";
import { teamLayout } from "@/content/grid";

type ValueCardProps = {
  index: number;
  title: string;
  description: string;
};

export function ValueCard({ index, title, description }: ValueCardProps) {
  const label = String(index).padStart(2, "0");

  return (
    <Reveal delay={(index - 1) * 0.12}>
      <article className={index > 1 ? "border-t border-[var(--rule)] pt-section" : undefined}>
        <PageGrid className="items-start">
          <GridCell span={teamLayout.indexSpan} spanMobile={12}>
            <p className="editorial-sidenote" aria-hidden>
              {label}
            </p>
          </GridCell>
          <GridCell span={teamLayout.contentSpan} spanMobile={12}>
            <div className="editorial-value__body">
              <h3 className="font-sans text-[clamp(1.375rem,2.4vw,2.125rem)] font-bold leading-[1.05] tracking-[-0.01em]">
                {title}
              </h3>
              <p className="mt-[clamp(1rem,2vw,1.75rem)] max-w-[36rem] font-sans text-[clamp(1.0625rem,1.8vw,1.5rem)] font-normal leading-[1.45] text-[var(--foreground)]">
                {description}
              </p>
            </div>
          </GridCell>
        </PageGrid>
      </article>
    </Reveal>
  );
}
