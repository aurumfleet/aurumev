"use client";

import { useEffect, useRef } from "react";

interface RibbonShard {
  phase: number;
  speed: number;
  size: number;
  laneOffset: number;
  rotOffset: number;
  rotSpeed: number;
  tiltSpeed: number;
  clusterSlot: number;
  goldRim: boolean;
}

const RIBBON_SHARDS: RibbonShard[] = Array.from({ length: 26 }, (_, i) => {
  const s1 = Math.abs(Math.sin(i * 19.7 + 1.3));
  const s2 = Math.abs(Math.cos(i * 31.1 + 2.7));
  return {
    phase: i / 26 + s1 * 0.025,
    speed: 0.052 + s2 * 0.018,
    size: 24 + s1 * 22,
    laneOffset: (s1 - 0.5) * 165,
    rotOffset: s2 * Math.PI * 2,
    rotSpeed: (s1 > 0.5 ? 1 : -1) * (0.35 + s2 * 0.55),
    tiltSpeed: 0.65 + s1 * 0.85,
    clusterSlot: i % 6,
    goldRim: i % 3 !== 0,
  };
});

function drawRoundedEquilateral(
  ctx: CanvasRenderingContext2D,
  size: number,
  radius: number
) {
  const h = (size * Math.sqrt(3)) / 2;
  const pts: [number, number][] = [
    [0, (-2 * h) / 3],
    [size / 2, h / 3],
    [-size / 2, h / 3],
  ];
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const prev = pts[(i + 2) % 3];
    const curr = pts[i];
    const next = pts[(i + 1) % 3];
    const v1x = prev[0] - curr[0];
    const v1y = prev[1] - curr[1];
    const v2x = next[0] - curr[0];
    const v2y = next[1] - curr[1];
    const l1 = Math.hypot(v1x, v1y) || 1;
    const l2 = Math.hypot(v2x, v2y) || 1;
    const r = Math.min(radius, l1 * 0.28, l2 * 0.28);
    const sx = curr[0] + (v1x / l1) * r;
    const sy = curr[1] + (v1y / l1) * r;
    const ex = curr[0] + (v2x / l2) * r;
    const ey = curr[1] + (v2y / l2) * r;
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
    ctx.quadraticCurveTo(curr[0], curr[1], ex, ey);
  }
  ctx.closePath();
}

/**
 * Continuous 60fps HyperFrames-inspired diagonal ribbon of 3D beveled obsidian & gold
 * triangular shards flowing steadily across the Matte Black hero stage.
 */
export function HeroFloatingShardsBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let rafId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const start = performance.now();

    const tick = (now: number) => {
      if (!width || !height) {
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      const t = (now - start) / 1000;
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Subtle traveling gold & champagne caustic arc behind the triangle stream
      const arcShift = Math.sin(t * 0.28) * 45;
      const causticGrad = ctx.createLinearGradient(
        width * 0.45,
        height * 0.9,
        width * 1.0,
        height * 0.15 + arcShift
      );
      causticGrad.addColorStop(0, "rgba(252, 170, 48, 0)");
      causticGrad.addColorStop(0.45, "rgba(252, 170, 48, 0.045)");
      causticGrad.addColorStop(0.6, "rgba(255, 255, 255, 0.025)");
      causticGrad.addColorStop(1, "rgba(252, 170, 48, 0)");
      ctx.fillStyle = causticGrad;
      ctx.fillRect(width * 0.35, 0, width * 0.65, height);

      // Continuous curved conveyor path: bottom-right -> converging past card deck -> upper edge
      const p0x = width * 1.04;
      const p0y = height * 0.96;
      const p1x = width * 0.72;
      const p1y = height * 0.56;
      const p2x = width * 0.48;
      const p2y = -height * 0.06;

      for (let i = 0; i < RIBBON_SHARDS.length; i++) {
        const s = RIBBON_SHARDS[i];
        const u = (s.phase + t * s.speed) % 1;
        const inv = 1 - u;

        // Quadratic Bezier ribbon position
        const bx = inv * inv * p0x + 2 * inv * u * p1x + u * u * p2x;
        const by = inv * inv * p0y + 2 * inv * u * p1y + u * u * p2y;

        // Shards tighten into hexagonal cluster symmetry near middle of path (u ~ 0.45..0.65)
        const focalAlign = Math.exp(-Math.pow((u - 0.52) / 0.24, 2));
        const slotAngle = (s.clusterSlot / 6) * Math.PI * 2;
        const clusterRadius = s.size * 0.62;
        const cx =
          bx +
          s.laneOffset * (1 - focalAlign * 0.72) +
          Math.cos(slotAngle) * clusterRadius * focalAlign;
        const cy =
          by +
          s.laneOffset * 0.55 * (1 - focalAlign * 0.72) +
          Math.sin(slotAngle) * clusterRadius * focalAlign;

        const alpha =
          u < 0.12
            ? u / 0.12
            : u > 0.82
              ? Math.max(0, (1 - u) / 0.18)
              : 1;
        if (alpha <= 0.01) continue;

        // Smooth damping toward flat alignment in focal zone, tumbling on entry/exit
        const rot =
          (s.rotOffset + t * s.rotSpeed) * (1 - focalAlign * 0.75) +
          slotAngle * focalAlign * 0.75;
        const tilt = Math.cos(t * s.tiltSpeed + i * 1.4) * (1 - focalAlign * 0.75);
        const scaleX = Math.max(0.24, Math.abs(tilt));
        const scale = 0.72 + focalAlign * 0.36;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.scale(scaleX * scale, scale);

        // Extruded dark metallic bevel edge catching gold/silver rim light
        ctx.save();
        ctx.translate(3.4, 4.4);
        drawRoundedEquilateral(ctx, s.size, 4.5);
        ctx.fillStyle = `rgba(6, 7, 10, ${(0.88 * alpha).toFixed(3)})`;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = s.goldRim
          ? `rgba(252, 170, 48, ${(0.4 * alpha).toFixed(3)})`
          : `rgba(226, 232, 240, ${(0.28 * alpha).toFixed(3)})`;
        ctx.stroke();
        ctx.restore();

        // Dark obsidian prism surface
        drawRoundedEquilateral(ctx, s.size, 4.5);
        const grad = ctx.createLinearGradient(-s.size / 2, -s.size / 2, s.size / 2, s.size / 2);
        grad.addColorStop(0, `rgba(34, 37, 48, ${(0.92 * alpha).toFixed(3)})`);
        grad.addColorStop(0.55, `rgba(14, 15, 22, ${(0.95 * alpha).toFixed(3)})`);
        grad.addColorStop(1, `rgba(4, 5, 8, ${(0.96 * alpha).toFixed(3)})`);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.lineWidth = 1.15;
        ctx.strokeStyle = s.goldRim
          ? `rgba(252, 170, 48, ${(0.56 * alpha).toFixed(3)})`
          : `rgba(255, 255, 255, ${(0.36 * alpha).toFixed(3)})`;
        ctx.stroke();

        ctx.restore();
      }

      ctx.restore();
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5] hidden h-full w-full lg:block"
    />
  );
}
