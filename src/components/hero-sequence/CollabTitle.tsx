import { BrandSwitcher } from "./BrandSwitcher";
import { heroSequenceCollab } from "./content";

/**
 * Two-line collab title. Full copy stays in the DOM; GSAP only transforms
 * the lines — stair-step while centered, then both flush left on band lock.
 */
export function CollabTitle() {
  return (
    <div className="hs-layer hs-layer--collab">
      <h2 className="hs-collab" aria-label={heroSequenceCollab.label}>
        <span className="hs-collab__line" data-line="1">
          <span className="hs-collab__keep">How we collab</span>
          <span className="hs-collab__keep hs-collab__amp">&amp;</span>
        </span>

        <span className="hs-collab__line hs-collab__line--share" data-line="2">
          <span className="hs-collab__keep">share</span>
          <span className="hs-collab__on" aria-hidden="true">
            &nbsp;on
          </span>
          <span className="hs-collab__brand">
            <BrandSwitcher />
          </span>
        </span>
      </h2>
    </div>
  );
}
