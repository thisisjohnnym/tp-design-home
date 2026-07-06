type ProcessStepProps = {
  step: number;
  title: string;
  description: string;
};

export function ProcessStep({ step, title, description }: ProcessStepProps) {
  return (
    <li className="rule relative border-t pt-6 md:grid md:grid-cols-[4rem_1fr] md:gap-6">
      <span className="eyebrow text-ink-500">0{step}</span>
      <div>
        <h3 className="font-coach text-headline font-bold">{title}</h3>
        <p className="mt-3 max-w-prose font-coachtopia text-body text-ink-700 dark:text-ink-200">
          {description}
        </p>
      </div>
    </li>
  );
}
