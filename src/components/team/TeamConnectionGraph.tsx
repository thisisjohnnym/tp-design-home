"use client";

import { useMotionValue, useMotionValueEvent, type MotionValue } from "framer-motion";
import { useEffect, useRef, type RefObject } from "react";

type TeamConnectionGraphProps = {
  cardsRef: RefObject<HTMLElement | null>;
  itemSelector?: string;
  spreadProgress?: MotionValue<number>;
  inkRgb?: string;
  dashed?: boolean;
  neighborCount?: number;
};

type Point = { x: number; y: number };
type Edge = { from: number; to: number };

const DEFAULT_INK_RGB = "21, 21, 21";
const DEFAULT_ITEM_SELECTOR = ".team-cluster__item";

function distance(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function getNodePoints(container: HTMLElement, itemSelector: string): Point[] {
  const containerRect = container.getBoundingClientRect();
  const items = container.querySelectorAll<HTMLElement>(itemSelector);

  return Array.from(items).map((item) => {
    const rect = item.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top,
    };
  });
}

function buildEdges(nodes: Point[], neighborCount: number): Edge[] {
  const edgeKeys = new Set<string>();
  const edges: Edge[] = [];

  const addEdge = (from: number, to: number) => {
    if (from === to) return;
    const key = from < to ? `${from}-${to}` : `${to}-${from}`;
    if (edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push({ from, to });
  };

  const count = Math.min(neighborCount, Math.max(nodes.length - 1, 0));

  nodes.forEach((node, index) => {
    const nearest = nodes
      .map((other, otherIndex) => ({
        otherIndex,
        dist: distance(node, other),
      }))
      .filter((entry) => entry.otherIndex !== index)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, count);

    nearest.forEach((entry) => addEdge(index, entry.otherIndex));
  });

  return edges;
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  alpha: number,
  inkRgb: string,
  emphasis = false,
  dashed = false,
) {
  ctx.beginPath();
  ctx.setLineDash(dashed ? [3, 5] : []);
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = `rgba(${inkRgb}, ${emphasis ? Math.min(alpha + 0.24, 0.78) : alpha})`;
  ctx.lineWidth = emphasis ? 1.4 : 1;
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawTraveler(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  progress: number,
  alpha: number,
  inkRgb: string,
) {
  const x = from.x + (to.x - from.x) * progress;
  const y = from.y + (to.y - from.y) * progress;

  ctx.beginPath();
  ctx.arc(x, y, 2.1, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${inkRgb}, ${alpha})`;
  ctx.fill();
}

function drawNode(
  ctx: CanvasRenderingContext2D,
  point: Point,
  radius: number,
  alpha: number,
  inkRgb: string,
  pulse = 1,
) {
  const r = radius * pulse;

  ctx.beginPath();
  ctx.arc(point.x, point.y, r + 3.5, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${inkRgb}, ${alpha * 0.1})`;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(point.x, point.y, r, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${inkRgb}, ${alpha})`;
  ctx.fill();
}

export function TeamConnectionGraph({
  cardsRef,
  itemSelector = DEFAULT_ITEM_SELECTOR,
  spreadProgress,
  inkRgb = DEFAULT_INK_RGB,
  dashed = false,
  neighborCount = 2,
}: TeamConnectionGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackSpread = useMotionValue(1);
  const progress = spreadProgress ?? fallbackSpread;
  const spreadRef = useRef(progress.get());
  const hoveredRef = useRef<number | null>(null);
  const frameRef = useRef(0);

  useMotionValueEvent(progress, "change", (value) => {
    spreadRef.current = value;
  });

  useEffect(() => {
    spreadRef.current = progress.get();
  }, [progress]);

  useEffect(() => {
    const container = cardsRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handlePointerOver = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const item = target?.closest<HTMLElement>(itemSelector);
      if (!item || !container.contains(item)) {
        hoveredRef.current = null;
        return;
      }

      const items = container.querySelectorAll(itemSelector);
      hoveredRef.current = Array.from(items).indexOf(item);
    };

    const handlePointerLeave = () => {
      hoveredRef.current = null;
    };

    const draw = (time: number) => {
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) {
        frameRef.current = window.requestAnimationFrame(draw);
        return;
      }

      const spread = spreadRef.current;
      const nodes = getNodePoints(container, itemSelector);
      const hovered = hoveredRef.current;
      const edges = buildEdges(nodes, neighborCount);

      ctx.clearRect(0, 0, width, height);

      if (nodes.length < 2) {
        frameRef.current = window.requestAnimationFrame(draw);
        return;
      }

      const lineAlpha = 0.1 + spread * 0.22;
      const nodeAlpha = 0.34 + spread * 0.46;

      edges.forEach((edge, edgeIndex) => {
        const from = nodes[edge.from];
        const to = nodes[edge.to];
        const emphasis = hovered === edge.from || hovered === edge.to;

        drawLine(ctx, from, to, lineAlpha, inkRgb, emphasis, dashed);

        const travelerProgress = (time * 0.00018 + edgeIndex * 0.09) % 1;
        drawTraveler(ctx, from, to, travelerProgress, 0.16 + spread * 0.34, inkRgb);
      });

      nodes.forEach((node, index) => {
        const pulse = 1 + Math.sin(time * 0.0026 + index * 0.65) * 0.1;
        const emphasis = hovered === index;
        drawNode(ctx, node, emphasis ? 4 : 3.2, emphasis ? 0.9 : nodeAlpha, inkRgb, pulse);
      });

      frameRef.current = window.requestAnimationFrame(draw);
    };

    resize();
    frameRef.current = window.requestAnimationFrame(draw);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    container.addEventListener("pointerover", handlePointerOver);
    container.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
      container.removeEventListener("pointerover", handlePointerOver);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [cardsRef, itemSelector, inkRgb, dashed, neighborCount]);

  return <canvas ref={canvasRef} className="team-cluster__graph" aria-hidden />;
}
