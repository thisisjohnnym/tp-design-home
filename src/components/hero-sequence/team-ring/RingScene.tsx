"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import {
  CARD_PX,
  TEX_PX,
  createCardTexture,
  type CardLink,
  type TeamCardMember,
} from "./cardTexture";

export type RingMotion = {
  angle: number;
  vel: number;
  dir: 1 | -1;
  dragging: boolean;
  /** Card turned to the front and held there, or null for the free ring. */
  focus: number | null;
  /** Ring angle that puts the focused card front. */
  focusAngle: number;
};

/** Ring angle nearest `from` that puts card `index` of `total` at the front. */
export function frontAngleFor(index: number, total: number, from: number) {
  const tau = Math.PI * 2;
  const offset = -((index / total) * tau) - from;
  return from + offset - tau * Math.round(offset / tau);
}

/** Index of the card nearest the front at ring angle `angle`. */
export function frontIndexFor(angle: number, total: number) {
  const i = Math.round((-angle / (Math.PI * 2)) * total) % total;
  return i < 0 ? i + total : i;
}

export type MaterialFeel = {
  /** spring stiffness of the bend */
  stiffness: number;
  /** spring damping of the bend */
  damping: number;
  /** ripple amplitude multiplier */
  ripple: number;
  /** specular highlight strength */
  gloss: number;
};

export type IntroState = {
  /** 0 → section just entering the viewport, 1 → fully in place */
  progress: number;
};

export type RingSettings = {
  members: readonly TeamCardMember[];
  fog: string;
  feel: MaterialFeel;
  cardWidth: number;
  spacing: number;
  tilt: number;
  /** tilt (degrees) the camera starts from before the section scrolls into place */
  introFrom: number;
  scrollIntro: boolean;
  roll: number;
  autoSpeed: number;
  blur: number;
  depthFade: number;
  flex: number;
  /** camera drift toward the pointer; 0 turns it off */
  parallax: number;
  /** share of the view width the ring spans (landscape) */
  fitWidth: number;
};

const CARD_ASPECT = CARD_PX.h / CARD_PX.w;
// The plane is larger than the card by the texture's transparent bleed margin.
const PLANE_SCALE_X = TEX_PX.w / CARD_PX.w;
const PLANE_SCALE_Y = TEX_PX.h / CARD_PX.h;
const FOV = 34;
/** Pointer travel (px) under which a press still counts as a click. */
const CLICK_SLOP = 6;
/** How far the focused card comes forward, as a share of the ring radius. */
const FOCUS_LIFT = 0.05;
/** Where the focused card's centre sits on screen, in NDC y — level with the
    headline, which is centred at top: 40% (team-section.css). */
const FOCUS_SCREEN_Y = 1 - 2 * 0.4;
/** Spring rates (rad/s) for entering / leaving focus — lower is gentler. */
const FOCUS_TURN_RATE = 3.2;
const FOCUS_LEVEL_RATE = 2.6;

const vertexShader = /* glsl */ `
  uniform float uW;
  uniform float uH;
  uniform float uR;
  uniform float uBend;
  uniform float uTime;
  uniform float uRipple;
  uniform float uPhase;
  uniform float uPress;
  uniform vec2 uPressUv;
  uniform float uNear;
  uniform float uFar;

  varying vec2 vUv;
  varying float vDepth;
  varying vec3 vNormalW;
  varying vec3 vViewDir;

  // Card lives in local space: centre at origin, facing +z, wrapped onto
  // the ring's cylinder and deformed like a thin sheet.
  vec3 deform(vec2 p) {
    float nx = p.x / (uW * 0.5);
    float ny = p.y / (uH * 0.5);

    // Drag: edges trail behind the centre, like a sail.
    float s = p.x + uBend * (0.34 * nx * nx + 0.16 * ny * ny);
    float r = uR + abs(uBend) * nx * nx * 0.24;

    // Travelling ripple — always a little alive, stronger with speed.
    float wave = sin(nx * 3.2 - uTime * 2.6 + ny * 1.7 + uPhase) * 0.6
               + sin(ny * 4.1 + uTime * 1.9 + uPhase * 1.7 + nx * 1.3) * 0.4;
    r += wave * uRipple * (0.35 + 0.65 * abs(nx));

    // Pointer press dents the sheet.
    vec2 d = (vec2(nx, ny) * 0.5 + 0.5 - uPressUv) * vec2(uW / uH, 1.0);
    r -= uPress * 0.17 * exp(-dot(d, d) / 0.04);

    // Corners twist with velocity.
    float y = p.y + uBend * nx * ny * 0.14
            + sin(nx * 2.5 + uTime * 1.3 + uPhase) * uRipple * 0.35;

    float th = s / uR;
    return vec3(sin(th) * r, y, cos(th) * r - uR);
  }

  void main() {
    vUv = uv;
    vec3 p = deform(position.xy);
    float e = 0.02;
    vec3 t = deform(position.xy + vec2(e, 0.0)) - p;
    vec3 b = deform(position.xy + vec2(0.0, e)) - p;
    vNormalW = normalize(mat3(modelMatrix) * normalize(cross(t, b)));

    vec4 world = modelMatrix * vec4(p, 1.0);
    vec4 mv = viewMatrix * world;
    vViewDir = cameraPosition - world.xyz;
    vDepth = clamp((-mv.z - uNear) / (uFar - uNear), 0.0, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uBlur;
  uniform float uAspect;
  uniform float uFogAmt;
  uniform float uGloss;
  uniform vec3 uFog;
  uniform float uDim;

  varying vec2 vUv;
  varying float vDepth;
  varying vec3 vNormalW;
  varying vec3 vViewDir;

  void main() {
    vec2 uv = vUv;
    vec3 n = normalize(vNormalW);
    // Seen from behind, flip so the front reads through the card.
    if (!gl_FrontFacing) { uv.x = 1.0 - uv.x; n = -n; }

    // Depth-of-field: golden-angle disc blur + mip bias, growing with depth.
    // Cards stepped back while another is focused blur further.
    float b = smoothstep(0.1, 1.0, vDepth) * uBlur + uDim * 0.8;
    float radius = b * 0.034;
    float lod = b * 3.0;
    vec4 acc = vec4(0.0);
    for (int i = 0; i < 16; i++) {
      float fi = float(i);
      float r = sqrt((fi + 0.5) / 16.0) * radius;
      float a = fi * 2.39996323;
      acc += texture2D(uMap, uv + vec2(cos(a) * uAspect, sin(a)) * r, lod);
    }
    float alpha = acc.a / 16.0;
    if (alpha < 0.004) discard;
    vec3 col = acc.rgb / max(acc.a, 1e-4); // texture is premultiplied

    vec3 L = normalize(vec3(-0.4, 0.9, 0.6));
    vec3 V = normalize(vViewDir);
    float diff = dot(n, L) * 0.5 + 0.5;
    col *= mix(0.8, 1.05, diff);
    col += pow(max(dot(n, normalize(L + V)), 0.0), 60.0) * uGloss;

    col = mix(col, uFog, smoothstep(0.0, 1.0, vDepth) * uFogAmt);
    col = mix(col, uFog, uDim * 0.8);
    gl_FragColor = vec4(col, alpha * (1.0 - uDim * 0.5));
    #include <colorspace_fragment>
  }
`;

function hash(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Runs first each frame: integrates auto-rotation and fling inertia. */
function MotionDriver({
  motion,
  autoSpeed,
}: {
  motion: RefObject<RingMotion>;
  autoSpeed: number;
}) {
  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const m = motion.current;
    if (m.dragging) {
      // Angle is moved directly by the pointer; let measured velocity settle if it stops.
      m.vel *= Math.exp(-dt * 6);
    } else if (m.focus !== null) {
      // Turn the focused card to the front and hold it there. Velocity is
      // measured from the turn so the cards still bend as they travel.
      // A critically damped spring: picks up from the current speed and eases
      // in and out, so the cards don't get a sudden jolt of bend.
      const w = FOCUS_TURN_RATE;
      m.vel += (w * w * (m.focusAngle - m.angle) - 2 * w * m.vel) * dt;
      m.angle += m.vel * dt;
    } else {
      const target = m.dir * autoSpeed;
      m.vel += (target - m.vel) * (1 - Math.exp(-dt * 0.9));
      m.angle += m.vel * dt;
    }
  });
  return null;
}

type Rig = { D: number; t: number; focus: THREE.Vector3 };

const probe = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);

// Solve a camera distance that fits the whole ring, and a look direction
// that centres the gap between the front and back rows (where the headline sits).
function solveRig(
  tilt: number,
  aspect: number,
  radius: number,
  cardW: number,
  cardH: number,
  fitWidth: number,
  /** Keep this camera distance instead of solving one (only re-aim). */
  fixedD?: number,
): Rig {
  const t = THREE.MathUtils.degToRad(tilt);
  const vHalf = THREE.MathUtils.degToRad(FOV / 2);
  const hHalf = Math.atan(Math.tan(vHalf) * aspect);
  const frontTop = new THREE.Vector3(0, cardH / 2, radius);
  const frontBottom = new THREE.Vector3(0, -cardH / 2, radius);
  const backTop = new THREE.Vector3(0, cardH / 2, -radius);
  const backBottom = new THREE.Vector3(0, -cardH / 2, -radius);
  const pos = new THREE.Vector3();
  const dir = (p: THREE.Vector3) => p.clone().sub(pos).normalize();
  const look = new THREE.Vector3();
  probe.aspect = aspect;
  probe.updateProjectionMatrix();

  // Size the ring so its outer edges span `fitWidth` of the view. On portrait
  // screens let the sides run off-screen rather than shrinking it.
  const halfWidth =
    aspect < 1 ? radius * 0.5 : (radius + cardW * 0.25) / fitWidth;
  let D = fixedD ?? Math.max(radius * 2.2, halfWidth / Math.tan(hHalf));
  for (let i = 0; i < (fixedD ? 1 : 60); i++) {
    pos.set(0, Math.sin(t) * D, Math.cos(t) * D);
    look.copy(dir(frontTop)).add(dir(backBottom)).normalize();
    probe.position.copy(pos);
    probe.lookAt(pos.clone().add(look));
    probe.updateMatrixWorld();
    const bottom = frontBottom.clone().project(probe).y;
    const top = backTop.clone().project(probe).y;
    if (fixedD || (bottom > -0.97 && top < 0.97)) break;
    D *= 1.04;
  }
  // A fixed world point to aim at, so pointer parallax orbits around the framing.
  const focus = pos.clone().addScaledVector(look, D);
  return { D, t, focus };
}

function CameraRig({
  tilt,
  introFrom,
  scrollIntro,
  intro,
  roll,
  parallax,
  fitWidth,
  radius,
  cardW,
  cardH,
  camDist,
  motion,
}: {
  motion: RefObject<RingMotion>;
  fitWidth: number;
  tilt: number;
  introFrom: number;
  scrollIntro: boolean;
  intro: RefObject<IntroState>;
  roll: number;
  parallax: number;
  radius: number;
  cardW: number;
  cardH: number;
  camDist: RefObject<number>;
}) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));

  const target = useMemo(() => new THREE.Vector3(), []);
  const aim = useMemo(() => new THREE.Vector3(), []);
  const aimDir = useMemo(() => new THREE.Vector3(), []);
  const aimOffset = useRef<{ key: string; value: number } | null>(null);
  const settled = useRef(false);
  // Tilt is scrubbed by scroll position; it only moves while the page does.
  const currentTilt = useRef(scrollIntro ? introFrom : tilt);
  /* 0 → free ring, 1 → a card is focused and the camera levels out to read it. */
  const level = useRef(0);
  const levelVel = useRef(0);
  const solved = useRef<{ key: string; rig: Rig } | null>(null);
  const framed = useRef<{ key: string; rig: Rig } | null>(null);

  useEffect(() => {
    camera.fov = FOV;
    camera.near = 0.1;
    camera.far = 200;
    camera.updateProjectionMatrix();
  }, [camera]);

  useFrame((state, delta) => {
    const p = scrollIntro ? intro.current.progress : 1;
    const eased = 1 - Math.pow(1 - p, 3);
    const scrolled = introFrom + (tilt - introFrom) * eased;
    /* Focusing a card levels the camera (tilt → 0) so it reads straight on. */
    const focused = motion.current.focus !== null ? 1 : 0;
    /* Critically damped spring: starts from rest and settles without overshoot,
       so the tilt and the re-aim move together as one gentle motion. */
    const ldt = Math.min(delta, 0.05);
    const lw = FOCUS_LEVEL_RATE;
    levelVel.current += (lw * lw * (focused - level.current) - 2 * lw * levelVel.current) * ldt;
    level.current = THREE.MathUtils.clamp(level.current + levelVel.current * ldt, 0, 1);
    const shaped = level.current;
    const goal = scrolled * (1 - shaped);
    /* A short follow only to smooth scroll steps — not a timed animation. */
    currentTilt.current +=
      (goal - currentTilt.current) *
      (1 - Math.exp(-Math.min(delta, 0.05) * 16));

    /* Camera distance comes from the scroll tilt alone, so levelling out for
       a focused card re-aims the camera without pulling it closer. */
    const shape = `${aspect}|${radius}|${cardW}|${cardH}|${fitWidth}`;
    const scrollKey = `${Math.round(scrolled * 50) / 50}|${shape}`;
    if (framed.current?.key !== scrollKey) {
      framed.current = {
        key: scrollKey,
        rig: solveRig(Math.round(scrolled * 50) / 50, aspect, radius, cardW, cardH, fitWidth),
      };
    }
    const tiltKey = Math.round(currentTilt.current * 50) / 50;
    const key = `${tiltKey}|${framed.current.rig.D}|${shape}`;
    if (solved.current?.key !== key) {
      solved.current = {
        key,
        rig: solveRig(tiltKey, aspect, radius, cardW, cardH, fitWidth, framed.current.rig.D),
      };
    }
    const { D, t, focus } = solved.current.rig;

    const yaw = state.pointer.x * 0.035 * parallax;
    const pitch = t - state.pointer.y * 0.02 * parallax;
    target.set(
      Math.sin(yaw) * Math.cos(pitch) * D,
      Math.sin(pitch) * D,
      Math.cos(yaw) * Math.cos(pitch) * D,
    );
    if (settled.current) camera.position.lerp(target, 1 - Math.exp(-delta * 6));
    else camera.position.copy(target);
    settled.current = true;
    /* Focused: tip the look down by the fixed amount that, once level, puts
       the front card's centre at the headline's height. Scaling that angle by
       the same spring as the tilt keeps the motion one smooth arc — the view
       never swings ahead of the tilt. */
    aim.copy(focus);
    if (shaped > 0.001) {
      if (aimOffset.current?.key !== framed.current.key) {
        const level0 = solveRig(0, aspect, radius, cardW, cardH, fitWidth, framed.current.rig.D);
        const freePitch = Math.atan2(level0.focus.y, level0.D - level0.focus.z);
        const cardPitch = -Math.atan(
          FOCUS_SCREEN_Y * Math.tan(THREE.MathUtils.degToRad(FOV / 2)),
        );
        aimOffset.current = { key: framed.current.key, value: cardPitch - freePitch };
      }
      const cp = camera.position;
      aimDir.copy(focus).sub(cp).normalize();
      const horiz = Math.max(1e-4, Math.hypot(aimDir.x, aimDir.z));
      const pitch = Math.asin(aimDir.y) + aimOffset.current.value * shaped;
      aimDir.set(
        (aimDir.x / horiz) * Math.cos(pitch),
        Math.sin(pitch),
        (aimDir.z / horiz) * Math.cos(pitch),
      );
      aim.copy(cp).addScaledVector(aimDir, D);
    }
    camera.lookAt(aim);
    camera.rotateZ(THREE.MathUtils.degToRad(roll));
    camDist.current = camera.position.length();
  });

  return null;
}

/** Plane UV → card pixels (origin top-left); the plane includes the bleed margin. */
function cardPoint(uv: THREE.Vector2) {
  const u = (uv.x - 0.5) * PLANE_SCALE_X + 0.5;
  const v = (uv.y - 0.5) * PLANE_SCALE_Y + 0.5;
  return { x: u * CARD_PX.w, y: (1 - v) * CARD_PX.h };
}

/** True when a plane UV lands on the card itself rather than its blur margin. */
function onCard(uv?: THREE.Vector2) {
  if (!uv) return false;
  const { x, y } = cardPoint(uv);
  return x >= 0 && x <= CARD_PX.w && y >= 0 && y <= CARD_PX.h;
}

/** Which link, if any, sits under a plane UV. Only the front-facing side counts. */
function linkAt(links: CardLink[], uv?: THREE.Vector2) {
  if (!uv) return null;
  const { x, y } = cardPoint(uv);
  return (
    links.find(
      (link) =>
        x >= link.x && x <= link.x + link.w && y >= link.y && y <= link.y + link.h,
    ) ?? null
  );
}

function openLink(link: CardLink) {
  if (link.kind === "email") window.location.href = link.href;
  else window.open(link.href, "_blank", "noopener,noreferrer");
}

function Card({
  member,
  index,
  total,
  radius,
  cardW,
  cardH,
  settings,
  motion,
  camDist,
  onSelect,
}: {
  member: TeamCardMember;
  index: number;
  total: number;
  radius: number;
  cardW: number;
  cardH: number;
  settings: RingSettings;
  motion: RefObject<RingMotion>;
  camDist: RefObject<number>;
  onSelect: (index: number | null) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const gl = useThree((s) => s.gl);
  const { feel } = settings;

  const card = useMemo(() => createCardTexture(member), [member]);
  useEffect(() => card.dispose, [card]);

  // Own the material so per-frame uniform writes hit the object three actually uses.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uMap: { value: null as THREE.Texture | null },
          uW: { value: 1 },
          uH: { value: 1 },
          uR: { value: 1 },
          uBend: { value: 0 },
          uTime: { value: 0 },
          uRipple: { value: 0 },
          uPhase: { value: hash(index) * Math.PI * 2 },
          uPress: { value: 0 },
          uPressUv: { value: new THREE.Vector2(0.5, 0.5) },
          uNear: { value: 1 },
          uFar: { value: 2 },
          uBlur: { value: 1 },
          uAspect: { value: TEX_PX.h / TEX_PX.w },
          uFogAmt: { value: 0 },
          uGloss: { value: 0 },
          uFog: { value: new THREE.Color() },
          uDim: { value: 0 },
        },
      }),
    [index],
  );
  useEffect(() => () => material.dispose(), [material]);
  const uniforms = material.uniforms;

  useEffect(() => {
    uniforms.uMap.value = card.texture;
    uniforms.uFog.value.set(settings.fog);
  }, [uniforms, card, settings.fog]);

  const spring = useRef({ bend: 0, bendVel: 0, press: 0, pressTarget: 0 });
  /* Focus easing: `dim` steps a card back while another is focused, `lift`
     brings the focused card toward the camera. */
  const focusFx = useRef({ dim: 0, lift: 0 });
  /* Facing: cos of the card's angle to the camera, updated each frame. */
  const facing = useRef(0);
  const hoverPointer = useRef(false);
  const stiffnessJitter = 0.8 + hash(index + 7) * 0.4;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const m = motion.current;
    const s = spring.current;

    // Per-card spring toward a bend driven by ring velocity — gives the lag
    // and overshoot of a flexible sheet.
    const target = THREE.MathUtils.clamp(-m.vel * 0.42 * settings.flex, -1.5, 1.5);
    const k = feel.stiffness * stiffnessJitter;
    s.bendVel += (k * (target - s.bend) - feel.damping * s.bendVel) * dt;
    s.bend += s.bendVel * dt;
    if (!m.dragging && s.pressTarget > 1.4) s.pressTarget = 0;
    s.press += (s.pressTarget - s.press) * (1 - Math.exp(-dt * 10));

    const fx = focusFx.current;
    const focusEase = 1 - Math.exp(-dt * 3);
    fx.dim += ((m.focus !== null && m.focus !== index ? 1 : 0) - fx.dim) * focusEase;
    fx.lift += ((m.focus === index ? 1 : 0) - fx.lift) * focusEase;

    const a = (index / total) * Math.PI * 2 + m.angle;
    facing.current = Math.cos(a);
    const obj = mesh.current!;
    const reach = radius + fx.lift * radius * FOCUS_LIFT;
    obj.position.set(
      Math.sin(a) * reach,
      Math.sin(state.clock.elapsedTime * 0.7 + index) * 0.035,
      Math.cos(a) * reach,
    );
    obj.rotation.y = a;

    const speed = Math.min(Math.abs(m.vel), 4);
    const u = uniforms;
    u.uW.value = cardW;
    u.uH.value = cardH;
    u.uR.value = radius;
    u.uBend.value = s.bend;
    u.uTime.value = state.clock.elapsedTime;
    u.uRipple.value =
      feel.ripple *
      settings.flex *
      (0.014 + speed * 0.028 + Math.abs(s.bendVel) * 0.02);
    u.uPress.value = s.press;
    u.uNear.value = camDist.current - radius;
    u.uFar.value = camDist.current + radius;
    u.uBlur.value = settings.blur;
    u.uFogAmt.value = settings.depthFade;
    u.uGloss.value = feel.gloss;
    u.uDim.value = fx.dim;
  });

  const setPointer = (on: boolean) => {
    if (hoverPointer.current === on) return;
    hoverPointer.current = on;
    gl.domElement.style.cursor = on ? "pointer" : "";
  };

  // Plane UVs include the bleed margin; the shader wants card-space UVs.
  const setPressUv = (uv?: THREE.Vector2) => {
    if (!uv) return;
    uniforms.uPressUv.value.set(
      (uv.x - 0.5) * PLANE_SCALE_X + 0.5,
      (uv.y - 0.5) * PLANE_SCALE_Y + 0.5,
    );
  };
  const onMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setPressUv(e.uv);
    if (spring.current.pressTarget < 1.4) spring.current.pressTarget = 1;
    const m = motion.current;
    if (m.dragging || !onCard(e.uv)) {
      setPointer(false);
      return;
    }
    /* Links on a front-facing card, or any card while nothing is focused. */
    const onLink = facing.current > 0.6 && linkAt(card.state.links, e.uv) !== null;
    setPointer(onLink || m.focus === null);
  };
  const onOut = () => {
    spring.current.pressTarget = 0;
    setPointer(false);
  };
  const onDown = (e: ThreeEvent<PointerEvent>) => {
    setPressUv(e.uv);
    spring.current.pressTarget = 1.8;
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > CLICK_SLOP || !onCard(e.uv)) return;
    e.stopPropagation();
    const focus = motion.current.focus;
    /* While a card is focused, the stepped-back cards count as empty space:
       clicking them lets go rather than locking onto a card behind. */
    if (focus !== null && focus !== index) {
      onSelect(null);
      return;
    }
    const link = facing.current > 0.6 ? linkAt(card.state.links, e.uv) : null;
    if (link) openLink(link);
    else onSelect(index);
  };

  return (
    <mesh
      ref={mesh}
      material={material}
      frustumCulled={false}
      onPointerMove={onMove}
      onPointerOut={onOut}
      onPointerDown={onDown}
      onPointerUp={onOut}
      onClick={onClick}
    >
      <planeGeometry
        args={[cardW * PLANE_SCALE_X, cardH * PLANE_SCALE_Y, 44, 64]}
      />
    </mesh>
  );
}

export function RingScene({
  settings,
  motion,
  intro,
  onSelect,
}: {
  settings: RingSettings;
  motion: RefObject<RingMotion>;
  intro: RefObject<IntroState>;
  onSelect: (index: number | null) => void;
}) {
  const { members, cardWidth, spacing } = settings;
  const total = members.length;
  const cardW = cardWidth;
  const cardH = cardWidth * CARD_ASPECT;
  const radius = Math.max(
    (total * cardW * spacing) / (Math.PI * 2),
    cardW * 1.2,
  );
  const camDist = useRef(radius * 3);

  return (
    <>
      <MotionDriver motion={motion} autoSpeed={settings.autoSpeed} />
      <CameraRig
        motion={motion}
        tilt={settings.tilt}
        introFrom={settings.introFrom}
        scrollIntro={settings.scrollIntro}
        intro={intro}
        roll={settings.roll}
        parallax={settings.parallax}
        fitWidth={settings.fitWidth}
        radius={radius}
        cardW={cardW}
        cardH={cardH}
        camDist={camDist}
      />
      {members.map((m, i) => (
        <Card
          key={m.id}
          member={m}
          index={i}
          total={total}
          radius={radius}
          cardW={cardW}
          cardH={cardH}
          settings={settings}
          motion={motion}
          camDist={camDist}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}
