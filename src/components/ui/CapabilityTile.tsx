type CapabilityTileProps = {
  title: string;
  description: string;
};

export function CapabilityTile({ title, description }: CapabilityTileProps) {
  return (
    <article className="rule border-t pt-6">
      <h3 className="font-coach text-headline font-bold">{title}</h3>
      <p className="mt-3 font-coachtopia text-body text-ink-700 dark:text-ink-200">
        {description}
      </p>
    </article>
  );
}
