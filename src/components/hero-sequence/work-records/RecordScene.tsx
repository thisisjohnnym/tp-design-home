"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { HeroSequenceWork } from "../content";
import { arrivalIndex, recordsMotion, type RecordsConfig } from "./tuning";

/* The scene is 2 units tall, so sizes given as a percentage of the screen
   height convert with PCT, and px at a 900px-tall viewport with PX. */
const PCT = 0.02;
const PX = 2 / 900;
const DEG = Math.PI / 180;
/* Card textures are composed at 16:9, the shape of an opened slab. */
const CARD_W = 1280;
const CARD_H = Math.round(CARD_W / recordsMotion.cardAspect);

/** Wheel position lives outside React; the section writes `target`. */
export type RecordsMotionState = {
  target: number;
  /** 0 while the section is below the fold, 1 once it reaches the top. */
  intro: number;
  /** How far the centre line sits below the middle of the screen, in slabs. */
  drop: number;
};

export type RecordSceneProps = {
  works: readonly HeroSequenceWork[];
  config: RecordsConfig;
  motion: RefObject<RecordsMotionState>;
  openIndex: number | null;
  reducedMotion: boolean;
  /** Set by the scene so scroll handlers can ask for a redraw. */
  kick: RefObject<() => void>;
  labels: RefObject<(HTMLElement | null)[]>;
  title: RefObject<HTMLElement | null>;
  onSelect: (index: number) => void;
  onMiss: () => void;
};

type Sim = { pos: number; intro: number; drop: number; opens: number[] };
type RGB = [number, number, number];

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const damp = (from: number, to: number, rate: number, dt: number) =>
  lerp(from, to, 1 - Math.exp(-rate * dt));

function openedSize(c: RecordsConfig, viewAspect: number) {
  const w = Math.min(
    c.panelSize * 2 * viewAspect,
    recordsMotion.maxOpenHeight * 2 * recordsMotion.cardAspect,
  );
  return { w, h: w / recordsMotion.cardAspect };
}

/*
 * Each slab hangs from its outer edge, which sits at a fixed width on the
 * screen plane and moves in an even line as the wheel turns. It runs from
 * there back and in towards the centre line: edge-on at the centre, opening
 * up to show more of its face further out, and flipping from below the line
 * to above it as it crosses. An opened slab instead lies flat to the screen
 * at the centre, and its neighbours move aside to make room.
 *
 * `position` is the wheel position in slabs; `u` is how far above the centre
 * a slab is, in slabs (negative = below, still to come).
 */
function place(
  index: number,
  position: number,
  c: RecordsConfig,
  viewAspect: number,
  opens: number[],
  intro: number,
  drop: number,
) {
  const t = opens[index] ?? 0;
  /* The opened slab sits flat at the centre, so its neighbours have to be
     spaced from it, not from wherever the wheel happens to be (it may still
     be travelling there, or rest between slabs). Blend the wheel onto it. */
  let openAt = -1;
  let openAmount = 0;
  for (let i = 0; i < opens.length; i++) {
    if (opens[i] > openAmount) {
      openAmount = opens[i];
      openAt = i;
    }
  }
  if (openAt >= 0) position = lerp(position, openAt, openAmount);
  /* Neighbours of an opened slab are spaced from it, not from the lowered line. */
  const lift = drop * (1 - openAmount);
  /* Scrolling in, the fan unfurls: it starts lower and squeezed, then rises
     and spreads to its resting spacing. */
  const spread = lerp(recordsMotion.introSqueeze, 1, intro);
  const u = position - (1 - intro) * recordsMotion.introTravel - index;
  const a = Math.abs(u);
  const length = c.length * PCT;
  const closedCos = clamp(0.05 + c.open * Math.pow(a, 0.8), 0, 0.94);
  const panel = openedSize(c, viewAspect);

  /* How far the neighbours of an opened slab move aside: enough for the
     nearest one's inner edge to clear the panel. */
  const nearestInner = c.spacing * PCT - length * (0.05 + c.open);
  const shiftBy = Math.max(
    0,
    panel.h / 2 + recordsMotion.openClearance - nearestInner,
  );
  let shift = 0;
  for (let i = 0; i < opens.length; i++) {
    shift += opens[i] * clamp(i - index, -1, 1) * shiftBy;
  }

  /* Which side of the centre the slab hangs on eases to "above" as it opens. */
  const side = lerp(u >= 0 ? 1 : -1, 1, t);
  const cosB = lerp(closedCos, 1, t);
  const sinB = Math.sqrt(Math.max(0, 1 - cosB * cosB));
  return {
    dy: -side * cosB,
    dz: -sinB,
    outerY: lerp((u - lift) * c.spacing * PCT * spread, panel.h / 2, t) + shift,
    length: lerp(length, panel.h, t),
    width: lerp(2 * viewAspect * c.width, panel.w, t),
    vis:
      clamp(1 - (a - recordsMotion.fadeFrom) / recordsMotion.fadeOver) *
      clamp(intro * 2),
    open: t,
    any: openAmount,
    /* Slabs above the lowered centre line keep their labels longer (9L3-0). */
    a: Math.max(0, a - (u > 0 ? 0.5 * lift : 0)),
  };
}

/* Slab centre as a fraction of the width: neighbours slide a touch left while
   one is open, the opened slab goes to its panel. */
function slabCentre(c: RecordsConfig, p: { open: number; any: number }) {
  const rest = c.offsetX + c.openShiftX * p.any;
  return lerp(rest, c.panelOffsetX, p.open);
}

/* Labels dim with distance from the centre; with a slab open the ring of
   neighbours is one step dimmer (Paper 9UQ-0 vs 9RA-0). */
function labelOpacity(a: number, anyOpen: number) {
  const closed =
    a <= 1
      ? 1
      : a <= 2
        ? lerp(1, 0.5, a - 1)
        : a <= 3
          ? lerp(0.5, 0.2, a - 2)
          : lerp(0.2, 0, a - 3);
  const opened =
    a <= 1 ? lerp(1, 0.5, a) : a <= 2 ? lerp(0.5, 0.2, a - 1) : lerp(0.2, 0, a - 2);
  return clamp(lerp(closed, opened, anyOpen));
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/* vUv.y runs 0 at the outer edge to 1 at the inner edge. uMode: 0 artwork on
   the front face, 1 on the back (upright, unmirrored), 2 flat colour, 3 spine
   caption. Artwork is cover-cropped and falls away to dark at the inner edge.
   Faded slabs go transparent so the page's plate shows through. */
const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uMode;
  uniform vec3 uColor;
  uniform vec2 uScale;
  uniform float uVis;
  uniform float uShade;
  varying vec2 vUv;
  void main() {
    vec3 col;
    if (uMode < 1.5) {
      vec2 p = uMode < 0.5 ? vUv : vec2(1.0 - vUv.x, 1.0 - vUv.y);
      vec2 uv = (p - 0.5) * uScale + 0.5;
      col = texture2D(uMap, uv).rgb;
      col *= 1.0 - uShade * smoothstep(0.06, 1.0, vUv.y);
    } else if (uMode < 2.5) {
      col = uColor;
    } else {
      col = texture2D(uMap, vUv).rgb;
    }
    gl_FragColor = vec4(col, uVis);
    #include <colorspace_fragment>
  }
`;

type Shared = {
  uVis: { value: number };
  uShade: { value: number };
  uScale: { value: THREE.Vector2 };
};

function makeMaterial(
  shared: Shared,
  mode: 0 | 1 | 2 | 3,
  map: THREE.Texture,
  color?: THREE.Color,
) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    /* Uniform objects are shared between a slab's materials, so they are
       updated once per frame. */
    uniforms: {
      ...shared,
      uMap: { value: map },
      uMode: { value: mode },
      uColor: { value: color ?? new THREE.Color() },
    },
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/* Composes a work's artwork into a 16:9 card. */
async function composeCard(work: HeroSequenceWork) {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = work.bg;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  try {
    const img = await loadImage(work.art);
    const ratio = img.naturalWidth / img.naturalHeight;
    const fill = work.fit === "cover";
    /* Screens sit at 88% of the card's height; photos fill it. */
    let w = fill ? Math.max(CARD_W, CARD_H * ratio) : CARD_H * 0.88 * ratio;
    let h = w / ratio;
    if (fill && h < CARD_H) {
      h = CARD_H;
      w = h * ratio;
    }
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, (CARD_W - w) / 2, (CARD_H - h) / 2, w, h);
  } catch {
    /* A missing image leaves the flat colour. */
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/* The artwork's average colour, used to tint the spine and edges. */
function averageColor(canvas: HTMLCanvasElement): RGB {
  try {
    const probe = document.createElement("canvas");
    probe.width = probe.height = 16;
    const ctx = probe.getContext("2d")!;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(canvas, 0, 0, 16, 16);
    const { data } = ctx.getImageData(0, 0, 16, 16);
    let r = 0;
    let g = 0;
    let b = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    const n = data.length / 4;
    return [r / n, g / n, b / n];
  } catch {
    return [24, 24, 24];
  }
}

const srgb = ([r, g, b]: RGB) =>
  new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);

/* The band along a slab's outer edge: title in bold, tags after it. */
function spineTexture(
  work: HeroSequenceWork,
  bg: RGB,
  ratio: number,
  showText: boolean,
  family: string,
) {
  const width = 2400;
  const height = Math.max(24, Math.round(width / ratio));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = `rgb(${bg[0]}, ${bg[1]}, ${bg[2]})`;
  ctx.fillRect(0, 0, width, height);
  if (showText) {
    const luminance = (0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]) / 255;
    ctx.fillStyle = luminance > 0.55 ? "#0b0b0b" : "#ffffff";
    ctx.textBaseline = "middle";
    const size = height * 0.6;
    const rest = `  ${work.tags.join(" · ")} — ${work.year}`;
    ctx.font = `700 ${size}px ${family}`;
    const titleWidth = ctx.measureText(work.title).width;
    ctx.font = `400 ${size}px ${family}`;
    const restWidth = ctx.measureText(rest).width;
    const x = (width - titleWidth - restWidth) / 2;
    ctx.textAlign = "left";
    ctx.font = `700 ${size}px ${family}`;
    ctx.fillText(work.title, x, height / 2);
    ctx.font = `400 ${size}px ${family}`;
    ctx.fillText(rest, x + titleWidth, height / 2);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function RecordScene(props: RecordSceneProps) {
  const [cards, setCards] = useState<THREE.Texture[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    let made: THREE.Texture[] = [];
    Promise.all(props.works.map(composeCard)).then((textures) => {
      if (cancelled) return textures.forEach((t) => t.dispose());
      made = textures;
      setCards(textures);
    });
    return () => {
      cancelled = true;
      made.forEach((t) => t.dispose());
    };
  }, [props.works]);

  if (!cards) return null;

  return (
    <Canvas
      className="hs-records__canvas"
      flat
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ near: 0.1, far: 200 }}
      onPointerMissed={props.onMiss}
    >
      <Wheel {...props} cards={cards} />
    </Canvas>
  );
}

function Wheel({
  works,
  cards,
  config,
  motion,
  openIndex,
  reducedMotion,
  kick,
  labels,
  title,
  onSelect,
}: RecordSceneProps & { cards: THREE.Texture[] }) {
  const { camera, invalidate } = useThree();
  const sim = useRef<Sim>({
    pos: motion.current.target,
    intro: reducedMotion ? 1 : motion.current.intro,
    drop: motion.current.drop,
    opens: [],
  });
  const openRef = useRef(openIndex);
  openRef.current = openIndex;

  useEffect(() => {
    kick.current = invalidate;
    return () => {
      kick.current = () => {};
    };
  }, [kick, invalidate]);

  /* Camera: a point on the screen plane (z = 0) that is 2 units tall
     exactly fills the screen. */
  const distance = config.perspective * PX;
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = (2 * Math.atan(1 / distance)) / DEG;
    cam.position.set(0, 0, distance);
    cam.updateProjectionMatrix();
    invalidate();
  }, [camera, distance, invalidate]);

  useEffect(() => invalidate(), [invalidate, config, openIndex]);

  /* Runs before the slabs so they all read this frame's position. */
  useFrame((state, delta) => {
    const s = sim.current;
    const dt = Math.min(delta, 0.05);
    const target = motion.current.target;
    let moving = false;

    s.pos = reducedMotion
      ? target
      : damp(s.pos, target, recordsMotion.scrollDamp, dt);
    if (Math.abs(s.pos - target) > 5e-4) moving = true;

    const introGoal = reducedMotion ? 1 : motion.current.intro;
    s.intro = reducedMotion
      ? 1
      : damp(s.intro, introGoal, recordsMotion.scrollDamp, dt);
    if (Math.abs(s.intro - introGoal) > 5e-4) moving = true;

    const dropGoal = motion.current.drop;
    s.drop = reducedMotion
      ? dropGoal
      : damp(s.drop, dropGoal, recordsMotion.scrollDamp, dt);
    if (Math.abs(s.drop - dropGoal) > 5e-4) moving = true;

    for (let i = 0; i < works.length; i++) {
      const goal = i === openRef.current ? 1 : 0;
      const prev = s.opens[i] ?? 0;
      const next = reducedMotion
        ? goal
        : damp(prev, goal, recordsMotion.openDamp, dt);
      s.opens[i] = Math.abs(next - goal) < 1e-3 ? goal : next;
      if (s.opens[i] !== goal) moving = true;
    }

    /* The headline rides up with the first slab and fades out. */
    const el = title.current;
    if (el) {
      const spacingPx = config.spacing * PCT * (state.size.height / 2);
      /* Follows the wheel, including its blend onto an opened slab. */
      const openAmount = s.opens.reduce((max, o) => Math.max(max, o), 0);
      const openAt = s.opens.indexOf(openAmount);
      const shown = openAmount > 0 ? lerp(s.pos, openAt, openAmount) : s.pos;
      const lifted = s.drop * (1 - openAmount);
      const travelled =
        recordsMotion.arrivalDrop - lifted + (shown - arrivalIndex(works.length));
      el.style.transform = `translate3d(0, ${-travelled * spacingPx}px, 0)`;
      el.style.opacity = String(clamp(1 - travelled * 1.25));
    }

    if (moving) state.invalidate();
  }, -1);

  return (
    <>
      {cards.map((map, i) => (
        <Slab
          key={works[i].id}
          index={i}
          work={works[i]}
          map={map}
          sim={sim}
          config={config}
          labels={labels}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

function Slab({
  index,
  work,
  map,
  sim,
  config,
  labels,
  onSelect,
}: {
  index: number;
  work: HeroSequenceWork;
  map: THREE.Texture;
  sim: RefObject<Sim>;
  config: RecordsConfig;
  labels: RefObject<(HTMLElement | null)[]>;
  onSelect: (index: number) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const gl = useThree((s) => s.gl);
  const viewAspect = useThree((s) => s.size.width / s.size.height);

  const shared = useMemo<Shared>(
    () => ({
      uVis: { value: 1 },
      uShade: { value: 0 },
      uScale: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );

  const tint = useMemo(
    () => averageColor(map.image as HTMLCanvasElement),
    [map],
  );
  const spineRgb = useMemo<RGB>(
    () =>
      tint.map((v) => Math.min(255, v * 0.85 + 18)) as RGB,
    [tint],
  );
  /* The caption is redrawn when the band's proportions change noticeably. */
  const ratio = Math.max(
    2,
    Math.round(
      (2 * viewAspect * config.width) /
        Math.max(config.thickness * PCT, 1e-3) /
        4,
    ) * 4,
  );

  const faces = useMemo(() => {
    const edge = srgb(spineRgb.map((v) => v * 0.6) as RGB);
    return {
      front: makeMaterial(shared, 0, map),
      back: makeMaterial(shared, 1, map),
      edge: makeMaterial(shared, 2, map, edge),
    };
  }, [shared, map, spineRgb]);

  const spineTex = useMemo(
    () =>
      spineTexture(
        work,
        spineRgb,
        ratio,
        config.spineText,
        getComputedStyle(gl.domElement).fontFamily || "system-ui, sans-serif",
      ),
    [work, spineRgb, ratio, config.spineText, gl.domElement],
  );
  const spine = useMemo(
    () => makeMaterial(shared, 3, spineTex),
    [shared, spineTex],
  );
  useEffect(
    () => () => Object.values(faces).forEach((m) => m.dispose()),
    [faces],
  );
  useEffect(
    () => () => {
      spineTex.dispose();
      spine.dispose();
    },
    [spineTex, spine],
  );

  useFrame((state) => {
    const m = mesh.current;
    const s = sim.current;
    if (!m) return;
    const { width: W, height: H } = state.size;
    const p = place(index, s.pos, config, W / H, s.opens, s.intro, s.drop);
    const label = labels.current[index];
    m.visible = p.vis > 0.004;

    if (label) {
      /* The label's leader meets the slab's outer edge (the panel's middle
         once opened) just past its right end. */
      const half = H / 2;
      const yScene = lerp(p.outerY, p.outerY + (p.dy * p.length) / 2, p.open);
      const centre = slabCentre(config, p);
      const right = W / 2 + centre * W + p.width * half * 0.5;
      /* 31px closed, 11px for a neighbour, 49px from an opened panel (9RA-0). */
      const gap = lerp(lerp(31, 11, p.any), 49, p.open) * Math.min(1, W / 1512);
      const anyOpen = p.any;
      label.style.transform = `translate3d(${right + gap}px, ${half - yScene * half - 49}px, 0)`;
      label.style.opacity = String(
        m.visible ? labelOpacity(p.a, anyOpen) * Math.max(p.vis, p.open) : 0,
      );
    }
    if (!m.visible) return;

    const depth = Math.max(config.thickness * PCT, 1e-4);
    /* The box's local +y axis runs from the outer edge inwards, along
       (0, dy, dz). */
    m.rotation.x = Math.atan2(p.dz, p.dy);
    /* The stack runs off the left edge; an opened slab slides to its panel. */
    m.position.set(
      slabCentre(config, p) * 2 * (W / H),
      p.outerY + (p.dy * p.length) / 2,
      (p.dz * p.length) / 2,
    );
    m.scale.set(p.width, p.length, depth);

    const image = map.image as { width: number; height: number };
    const imageAspect = image.width / image.height;
    const planeAspect = p.width / p.length;
    shared.uScale.value.set(
      planeAspect > imageAspect ? 1 : planeAspect / imageAspect,
      planeAspect > imageAspect ? imageAspect / planeAspect : 1,
    );
    shared.uVis.value = p.vis;
    shared.uShade.value = config.shade * (1 - p.open);
  });

  const hover = (on: boolean) => (e: ThreeEvent<PointerEvent>) => {
    if (!mesh.current?.visible) return;
    e.stopPropagation();
    gl.domElement.style.cursor = on ? "pointer" : "";
  };

  /* Box face order: +x, -x, +y (inner end), -y (outer end: the spine), +z, -z. */
  const materials = [
    faces.edge,
    faces.edge,
    faces.edge,
    spine,
    faces.front,
    faces.back,
  ];
  return (
    <mesh
      ref={mesh}
      material={materials}
      frustumCulled={false}
      onClick={(e) => {
        if (!mesh.current?.visible) return;
        e.stopPropagation();
        onSelect(index);
      }}
      onPointerOver={hover(true)}
      onPointerOut={hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
}
