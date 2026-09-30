import * as THREE from "three";

export type TeamCardMember = {
  id: string;
  name: string;
  given: string;
  family: string;
  role: string;
  roleAside: string;
  place: string;
  email: string;
  linkedin: string;
  bio: string;
  portrait: string;
};

/** A clickable region on the card, in card pixels (origin top-left). */
export type CardLink = {
  kind: "email" | "linkedin";
  href: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

/*
 * Our glass member card (324×513) drawn at 1.73× for the texture. Everything
 * below is laid out in `cq` units — 1% of the card width — so it matches the
 * cqi values the DOM card used.
 */
export const CARD_PX = { w: 560, h: Math.round((560 * 513) / 324) };
/** Transparent margin around the card so depth blur can bleed past its silhouette. */
export const CARD_BLEED = 72;
export const TEX_PX = {
  w: CARD_PX.w + CARD_BLEED * 2,
  h: CARD_PX.h + CARD_BLEED * 2,
};

const cq = CARD_PX.w / 100;
/** Extra slop around each link so a bent card still lands the click. */
const LINK_PAD = 2.5 * cq;

const imageCache = new Map<string, Promise<HTMLImageElement | null>>();

function loadImage(src: string) {
  let pending = imageCache.get(src);
  if (!pending) {
    pending = new Promise((resolve) => {
      const img = new Image();
      /* Portraits are cross-origin; without CORS the canvas is tainted and
         WebGL refuses the upload. */
      img.crossOrigin = "anonymous";
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
    imageCache.set(src, pending);
  }
  return pending;
}

/** The next/font family behind --font-hs-sans (Helvetica Now). */
function sansFamily() {
  const family = getComputedStyle(document.body)
    .getPropertyValue("--font-hs-sans")
    .trim();
  return family || "Helvetica Neue, Helvetica, Arial, sans-serif";
}

let fontsReady: Promise<unknown> | null = null;
function loadFonts() {
  fontsReady ??= document.fonts.ready.catch(() => null);
  return fontsReady;
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function draw(
  canvas: HTMLCanvasElement,
  member: TeamCardMember,
  img: HTMLImageElement | null,
): CardLink[] {
  const { w, h } = CARD_PX;
  const family = sansFamily();
  const font = (weight: number, size: number) =>
    `${weight} ${size}px ${family}`;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, TEX_PX.w, TEX_PX.h);
  ctx.save();
  ctx.translate(CARD_BLEED, CARD_BLEED);

  /* Glass face: 10% gray fill, 14% white hairline, 16px radius at 1×. */
  const radius = (16 / 324) * w;
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, radius);
  ctx.fillStyle = "rgb(177 177 177 / 10%)";
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(1, 1, w - 2, h - 2, radius - 1);
  ctx.strokeStyle = "rgb(255 255 255 / 14%)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const pad = 3.7 * cq;
  const inner = w - pad * 2;

  /* Bio sits under the portrait; measure it first so the portrait fills the rest. */
  const bioSize = 4.32 * cq;
  ctx.font = font(400, bioSize);
  ctx.letterSpacing = `${-0.04 * bioSize}px`;
  const bioLines = wrapLines(ctx, member.bio, inner);
  const bioHeight = bioLines.length * bioSize;
  const portraitH = h - pad * 3 - bioHeight;

  /* Portrait: photo, 30% black wash, type on top. */
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(pad, pad, inner, portraitH, 1.85 * cq);
  ctx.clip();
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(pad, pad, inner, portraitH);
  if (img) {
    const scale = Math.max(inner / img.width, portraitH / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    ctx.drawImage(
      img,
      pad + (inner - dw) / 2,
      pad + (portraitH - dh) / 2,
      dw,
      dh,
    );
  }
  ctx.fillStyle = "rgb(0 0 0 / 30%)";
  ctx.fillRect(pad, pad, inner, portraitH);
  ctx.restore();

  ctx.fillStyle = "#fff";
  const left = pad * 2;
  const right = w - pad * 2;
  const labelSize = 2.47 * cq;
  const label = (weight = 500) => {
    ctx.font = font(weight, labelSize);
    ctx.letterSpacing = `${0.1 * labelSize}px`;
  };

  /* Meta row: role left, team label right. */
  ctx.textBaseline = "top";
  label();
  ctx.textAlign = "left";
  ctx.fillText(member.role.toUpperCase(), left, pad * 2);
  ctx.textAlign = "right";
  ctx.fillText(member.roleAside.toUpperCase(), right, pad * 2);

  /* Name: given on the left, family flush right. */
  const nameSize = 14.81 * cq;
  const nameLine = nameSize * 0.9;
  const nameTop = pad * 2 + labelSize * 0.9 + 3.7 * cq;
  ctx.font = font(400, nameSize);
  ctx.letterSpacing = `${-0.04 * nameSize}px`;
  ctx.textAlign = "left";
  ctx.fillText(`${member.given}—`, left, nameTop);
  ctx.textAlign = "right";
  ctx.fillText(member.family, right, nameTop + nameLine);

  /* Links row, pinned to the portrait's bottom edge:
     Email · LinkedIn · place, spread like the DOM's space-between. */
  label();
  const rowY = pad + portraitH - pad - labelSize * 0.9;
  const texts = ["EMAIL", "LINKEDIN", member.place.toUpperCase()];
  const widths = texts.map((text) => ctx.measureText(text).width);
  const gap = (right - left - widths.reduce((a, b) => a + b, 0)) / 2;
  const xs = [left, left + widths[0] + gap, right - widths[2]];
  ctx.textAlign = "left";
  texts.forEach((text, i) => ctx.fillText(text, xs[i], rowY));
  ctx.fillRect(xs[0], rowY + labelSize + 2, widths[0], 1.5);
  ctx.fillRect(xs[1], rowY + labelSize + 2, widths[1], 1.5);

  /* Bio. */
  ctx.font = font(400, bioSize);
  ctx.letterSpacing = `${-0.04 * bioSize}px`;
  const bioTop = pad * 2 + portraitH;
  bioLines.forEach((line, i) => ctx.fillText(line, pad, bioTop + i * bioSize));

  ctx.restore();

  const hit = (i: number) => ({
    x: xs[i] - LINK_PAD,
    y: rowY - LINK_PAD,
    w: widths[i] + LINK_PAD * 2,
    h: labelSize + LINK_PAD * 2,
  });
  return [
    { kind: "email", href: `mailto:${member.email}`, ...hit(0) },
    { kind: "linkedin", href: member.linkedin, ...hit(1) },
  ];
}

/** Returns a texture immediately; it is redrawn once fonts and the photo resolve. */
export function createCardTexture(member: TeamCardMember) {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_PX.w;
  canvas.height = TEX_PX.h;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  // Premultiplied so mips and the shader's blur don't grow dark fringes at the rounded corners.
  texture.premultiplyAlpha = true;

  const state = { links: draw(canvas, member, null) };
  texture.needsUpdate = true;

  let disposed = false;
  Promise.all([loadFonts(), loadImage(member.portrait)]).then(([, img]) => {
    if (disposed) return;
    state.links = draw(canvas, member, img);
    texture.needsUpdate = true;
  });

  const dispose = () => {
    disposed = true;
    texture.dispose();
  };
  return { texture, state, dispose };
}
