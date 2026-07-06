type OwnershipItemProps = {
  category: string;
  label: string;
  status?: "placeholder";
};

export function OwnershipItem({ category, label, status }: OwnershipItemProps) {
  return (
    <article className="rule border-t pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="eyebrow text-ink-500">{category}</p>
        {status === "placeholder" ? (
          <span className="font-coachtopia text-caption text-ink-500">Details coming soon</span>
        ) : null}
      </div>
      <h3 className="mt-3 font-coach text-headline font-bold">{label}</h3>
    </article>
  );
}
