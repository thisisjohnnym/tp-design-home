import Image from "next/image";
import { heroSequenceFan } from "./content";
import "./hero-fan.css";

type Slide = (typeof heroSequenceFan.slides)[number];

type FanCard = {
  key: string;
  slide: Slide;
  /** Resting angle around the spine, 0–360°. */
  angle: number;
  /** The slide the loader camera starts in; its front carries the real drum. */
  lead: boolean;
  /** Yellow slide carrying the wordmark (the lead and its twin). */
  marked: boolean;
};

/**
 * Each authored slide has a duplicate directly opposite it on the ring (180°
 * apart), so the two halves of the fan carry the same content however the
 * ring is turned. Slide `j` sits at -90° + step/2 + j·step.
 */
function buildCards(): FanCard[] {
  const slides = heroSequenceFan.slides;
  const step = 180 / slides.length;
  const norm = (deg: number) => ((deg % 360) + 360) % 360;

  return slides.flatMap((slide, index) => {
    const angle = -90 + step / 2 + index * step;
    const lead = "lead" in slide;
    return [
      { key: slide.id, slide, angle: norm(angle), lead, marked: lead },
      {
        key: `${slide.id}-twin`,
        slide,
        angle: norm(angle + 180),
        lead: false,
        marked: lead,
      },
    ];
  });
}

/**
 * Spinning fan of slides (Paper I8-0). Decorative; the loader camera starts
 * zoomed into the lead slide and pulls back to reveal the rest (hero-fan.ts).
 */
export function HeroFan() {
  const cards = buildCards();

  /* Open book: while the fan is "open" (intro) every non-lead slide hinges
     back to an angle in 20°–180°, which keeps it entirely behind the lead
     slide's plane (in resting order). Closing swings each one round to its
     resting angle. */
  const others = cards
    .filter((card) => !card.lead)
    .sort((a, b) => a.angle - b.angle);
  const openDelta = new Map(
    others.map((card, rank) => [
      card.key,
      20 + (rank * 160) / (others.length - 1) - card.angle,
    ]),
  );

  return (
    <div className="hs-fan" aria-hidden="true">
      <div className="hs-fan__scroll">
        <div className="hs-fan__stage">
          <div className="hs-fan__scrolltilt">
            <div className="hs-fan__tilt">
              <div className="hs-fan__spin">
                {cards.map((card) => (
                  <FanCardView
                    card={card}
                    delta={openDelta.get(card.key)}
                    key={card.key}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FanCardView({ card, delta = 0 }: { card: FanCard; delta?: number }) {
  const { slide } = card;

  return (
    <div
      className={[
        "hs-fan__card",
        card.lead && "hs-fan__card--lead",
        card.marked && "hs-fan__card--marked",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--fan-angle": `${card.angle.toFixed(2)}deg`,
          "--fan-delta": `${delta.toFixed(2)}deg`,
        } as React.CSSProperties
      }
    >
      <div
        className="hs-fan__face"
        style={{
          backgroundColor: "bg" in slide ? slide.bg : undefined,
          backgroundImage: "image" in slide ? `url(${slide.image})` : undefined,
          backgroundPosition: "pos" in slide ? slide.pos : undefined,
        }}
      />
      {/* The lead's front carries the real loader drum (hero-fan.ts); every
          other yellow face gets a flat render of the same wordmark. */}
      {card.marked && !card.lead && <FanMark side="front" />}
      {card.marked && <FanMark side="back" />}
    </div>
  );
}

/** Flat wordmark for a slide face. Sized like the loader mark, then scaled in CSS. */
function FanMark({ side }: { side: "front" | "back" }) {
  return (
    <div className={`hs-fan__mark hs-fan__mark--${side}`} aria-hidden="true">
      <span className="hs-fan__mark-logo">
        <Image src="/brand/tapestry-logo.svg" alt="" width={282} height={62} />
      </span>
      <span className="hs-fan__mark-suffix">.design</span>
    </div>
  );
}
