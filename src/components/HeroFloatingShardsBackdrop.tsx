"use client";

import { useEffect, useRef } from "react";

interface FloatingShard {
  phase: number;
  speed: number;
  size: number;
  spreadX: number;
  spreadY: number;
  rotSpeed: number;
  tiltSpeed: number;
  goldRim: boolean;
}

const SHARDS: FloatingShard[] = Array.from({ length: 14 }, (_, i) => {
  const s1 = Math.abs(Math.sin(i * 19.7 + 1.3));
  const s2 = Math.abs(Math.cos(i * 31.1 + 2.7));
  return {
    phase: (i / 14) + s1 * 0.06,
    speed: 0.055 + s2 * 0.035,
    size: 22 + s1 * 24,
    spreadX: (s1 - 0.5) * 140,
    spreadY: (s2 - 0.5) * 120,
    rotSpeed: (s1 > 0.5 ? 1 : -1) * (0.45 + s2 * 0.65),
    tiltSpeed: 0.7 + s1 * 0.9,
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
 * Ambient 3D beveled triangular prism shards drifting along a bottom-right to center-right
 * trajectory behind the hero card stack, echoing HyperFrames' obsidian prism aesthetic.
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

      // Focus stream on right half: bottom-right -> converging toward hero card stack
      const originX = width * 0.98;
      const originY = height * 0.95;
      const targetX = width * 0.62;
      const targetY = height * 0.42;

      for (let i = 0; i < SHARDS.length; i++) {
        const s = SHARDS[i];
        const life = (s.phase + t * s.speed) % 1;
        const ease = life;

        const cx = originX + (targetX - originX) * ease + s.spreadX * (1 - ease * 0.45);
        const cy =
          originY +
          (targetY - originY) * ease +
          s.spreadY * (1 - ease * 0.45) -
          Math.sin(life * Math.PI) * 38;

        const alpha =
          life < 0.15
            ? life / 0.15
            : life > 0.78
              ? Math.max(0, (1 - life) / 0.22)
              : 1;
        if (alpha <= 0.01) continue;

        const rot = t * s.rotSpeed + i;
        const tilt = Math.cos(t * s.tiltSpeed + i * 1.4);
        const scaleX = Math.max(0.22, Math.abs(tilt));
        const scale = 0.72 + ease * 0.45;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.scale(scaleX * scale, scale);

        // Extruded dark rim thickness
        ctx.save();
        ctx.translate(3.2, 4.2);
        drawRoundedEquilateral(ctx, s.size, 4);
        ctx.fillStyle = `rgba(6, 7, 10, ${(0.85 * alpha).toFixed(3)})`;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = s.goldRim
          ? `rgba(252, 170, 48, ${(0.34 * alpha).toFixed(3)})`
          : `rgba(226, 232, 240, ${(0.25 * alpha).toFixed(3)})`;
        ctx.stroke();
        ctx.restore();

        // Glass obsidian prism face
        drawRoundedEquilateral(ctx, s.size, 4);
        const grad = ctx.createLinearGradient(-s.size / 2, -s.size / 2, s.size / 2, s.size / 2);
        grad.addColorStop(0, `rgba(28, 30, 38, ${(0.9 * alpha).toFixed(3)})`);
        grad.addColorStop(0.55, `rgba(12, 13, 18, ${(0.95 * alpha).toFixed(3)})`);
        grad.addColorStop(1, `rgba(4, 5, 7, ${(0.95 * alpha).toFixed(3)})`);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.lineWidth = 1.1;
        ctx.strokeStyle = s.goldRim
          ? `rgba(252, 170, 48, ${(0.52 * alpha).toFixed(3)})`
          : `rgba(255, 255, 255, ${(0.32 * alpha).toFixed(3)})`;
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
