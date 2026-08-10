import Image from "next/image";
import { heroSequenceContact, heroSequenceResources } from "./content";

export function SequenceNav() {
  return (
    <header className="hs-nav">
      {/* The loader mark flies onto this box, then hands off to the static
          lockup so the wordmark scrolls with the page like everything else. */}
      <div className="hs-nav__logo-target">
        <span className="hs-nav__logo">
          <span className="hs-nav__logo-img">
            <Image
              src="/brand/tapestry-logo.svg"
              alt="Tapestry Design"
              width={282}
              height={62}
              priority
            />
          </span>
          <span className="hs-nav__logo-suffix" aria-hidden="true">
            .design
          </span>
        </span>
      </div>

      <div className="hs-nav__links">
        <div className="hs-nav__group">
          <p className="hs-nav__group-title">Resources</p>
          <ul className="hs-nav__list">
            {heroSequenceResources.map((resource) => (
              <li key={resource}>
                <a href="#resources">{resource}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="hs-nav__group">
          <p className="hs-nav__group-title">Contact</p>
          <address className="hs-nav__list hs-nav__list--contact">
            <a href={`mailto:${heroSequenceContact.email}`}>
              {heroSequenceContact.email}
            </a>
            <a href={heroSequenceContact.phoneHref}>
              {heroSequenceContact.phoneLabel}
            </a>
          </address>
        </div>
      </div>
    </header>
  );
}
