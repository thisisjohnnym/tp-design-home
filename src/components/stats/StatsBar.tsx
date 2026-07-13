import { statsItems } from "@/content/stats";

export function StatsBar() {
  return (
    <section className="stats-bar" aria-label="Team impact statistics">
      {statsItems.map((stat) => (
        <article
          key={stat.label}
          className={`stats-bar__item stats-bar__item--${stat.foreground}`}
          style={{ backgroundColor: stat.background }}
        >
          <p className="stats-bar__value">{stat.value}</p>
          <p className="stats-bar__label">{stat.label}</p>
        </article>
      ))}
    </section>
  );
}
