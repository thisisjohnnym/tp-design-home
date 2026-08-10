import { heroSequenceCards } from "./content";

export function ResourceCards() {
  return (
    <section className="hs-cards" id="resources" aria-label="Design resources">
      <ul className="hs-cards__grid">
        {heroSequenceCards.map((card) => (
          <li className="hs-cards__item" key={card.title}>
            <a className="hs-card" href={card.href}>
              {/* Placeholder well: animated SVG art lands here once the illustrations are chosen. */}
              <span className="hs-card__media" aria-hidden="true" />
              <span className="hs-card__text">
                <span className="hs-card__title">{card.title}</span>
                <span className="hs-card__link">Open Figma File</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
