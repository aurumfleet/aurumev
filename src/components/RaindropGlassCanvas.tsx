"use client";

import { useEffect, useRef } from "react";

interface OrganicPoint {
  angle: number;
  radialScale: number;
}

interface Droplet {
  x: number;
  y: number;
  r: number;
  vy: number;
  sliding: boolean;
  wobblePhase: number;
  sparkle: number;
  shape: OrganicPoint[];
  trail: Array<{ x: number; y: number; r: number }>;
}

interface RaindropGlassCanvasProps {
  imageSrc: string;
  fadingOut: boolean;
  pointerRef: React.MutableRefObject<{
    x: number;
    y: number;
    inside: boolean;
  }>;
}

function buildOrganicShape(seed: number, isTeardrop: boolean): OrganicPoint[] {
  const count = 10;
  const pts: OrganicPoint[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const gravitySag =
      Math.sin(angle) > 0
        ? 1 + Math.sin(angle) * (isTeardrop ? 0.22 : 0.08)
        : 1 - (isTeardrop ? 0.07 : 0);
    const jitter = 0.93 + Math.abs(Math.sin(seed * 17.3 + i * 3.7)) * 0.13;
    pts.push({ angle, radialScale: gravitySag * jitter });
  }
  return pts;
}

function traceOrganicPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  pts: OrganicPoint[],
  yStretch = 1
) {
  const coords = pts.map((p) => ({
    x: cx + Math.cos(p.angle) * r * p.radialScale,
    y: cy + Math.sin(p.angle) * r * p.radialScale * yStretch,
  }));

  ctx.beginPath();
  const last = coords[coords.length - 1];
  const first = coords[0];
  ctx.moveTo((last.x + first.x) / 2, (last.y + first.y) / 2);

  for (let i = 0; i < coords.length; i++) {
    const curr = coords[i];
    const next = coords[(i + 1) % coords.length];
    ctx.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) / 2, (curr.y + next.y) / 2);
  }
  ctx.closePath();
}

export function RaindropGlassCanvas({
  imageSrc,
  fadingOut,
  pointerRef,
}: RaindropGlassCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const imgReadyRef = useRef(false);

  useEffect(() => {
    imgReadyRef.current = false;
    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
      imgReadyRef.current = true;
    };
  }, [imageSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let drops: Droplet[] = [];
    let rafId = 0;

    const createDrops = (w: number, h: number): Droplet[] => {
      const list: Droplet[] = [];
      const mistCount = w < 640 ? 110 : 210;
      const beadCount = w < 640 ? 36 : 72;
      const slidingCount = w < 640 ? 6 : 11;

      // 1. Razor-crisp micro-beads (crystal clear, zero milky fill)
      for (let i = 0; i < mistCount; i++) {
        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.75 + Math.random() * 1.4,
          vy: 0,
          sliding: false,
          wobblePhase: Math.random() * Math.PI * 2,
          sparkle: 0,
          shape: buildOrganicShape(i + 1, false),
          trail: [],
        });
      }

      // 2. Medium & large crystal surface-tension lenses
      for (let i = 0; i < beadCount; i++) {
        let x = Math.random() * w;
        const y = Math.random() * h;
        const inCenter =
          x > w * 0.28 && x < w * 0.72 && y > h * 0.22 && y < h * 0.65;
        if (inCenter && Math.random() < 0.72) {
          x =
            Math.random() < 0.5
              ? Math.random() * w * 0.28
              : w * 0.72 + Math.random() * w * 0.28;
        }
        const r = inCenter ? 2.2 + Math.random() * 2.2 : 3.0 + Math.random() * 7.2;
        list.push({
          x,
          y,
          r,
          vy: 0,
          sliding: false,
          wobblePhase: Math.random() * Math.PI * 2,
          sparkle: 0,
          shape: buildOrganicShape(i * 3.1, r > 5.5),
          trail: [],
        });
      }

      // 3. Slow sliding crystal teardrops leaving ultra-fine clear trails
      for (let i = 0; i < slidingCount; i++) {
        const r = 4.8 + Math.random() * 4.5;
        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          vy: 0.42 + Math.random() * 0.7,
          sliding: true,
          wobblePhase: Math.random() * Math.PI * 2,
          sparkle: 0,
          shape: buildOrganicShape(i * 7.9, true),
          trail: [],
        });
      }

      return list;
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      drops = createDrops(width, height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const drawDroplet = (d: Droplet, img: HTMLImageElement | null) => {
      const yStretch = d.sliding ? 1.24 : 1.05;

      // Micro condensation specks: pure tiny shadow + crisp specular pinhole (no cloudy fill)
      if (d.r < 2.2) {
        ctx.beginPath();
        ctx.arc(d.x + 0.5, d.y + 0.8, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.32)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(d.x - d.r * 0.32, d.y - d.r * 0.32, Math.max(0.45, d.r * 0.38), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
        ctx.fill();
        return;
      }

      // Ultra-fine trailing micro-droplets behind sliding teardrops
      if (d.sliding && d.trail.length > 0) {
        for (let t = 0; t < d.trail.length; t++) {
          const pt = d.trail[t];
          const alpha = ((t + 1) / d.trail.length) * 0.45;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
          ctx.fill();
        }
      }

      // 1. Soft external contact shadow + subtle exterior caustic glow beneath drop
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.62)";
      ctx.shadowBlur = Math.max(2.5, d.r * 0.65);
      ctx.shadowOffsetX = 1.1;
      ctx.shadowOffsetY = 2.6;
      traceOrganicPath(ctx, d.x, d.y, d.r, d.shape, yStretch);
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fill();
      ctx.restore();

      // Faint caustic light transmission cast onto glass just below the droplet
      if (d.r >= 3.6) {
        const causticGrad = ctx.createRadialGradient(
          d.x + d.r * 0.15,
          d.y + d.r * 1.18 * yStretch,
          0.5,
          d.x + d.r * 0.15,
          d.y + d.r * 1.18 * yStretch,
          d.r * 0.9
        );
        causticGrad.addColorStop(
          0,
          d.sparkle > 0.15 ? "rgba(252, 196, 92, 0.34)" : "rgba(255, 255, 255, 0.24)"
        );
        causticGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = causticGrad;
        ctx.beginPath();
        ctx.arc(d.x + d.r * 0.15, d.y + d.r * 1.18 * yStretch, d.r * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Pure Crystal-Clear Optical Lens Inside Droplet
      ctx.save();
      traceOrganicPath(ctx, d.x, d.y, d.r, d.shape, yStretch);
      ctx.clip();

      if (img && imgReadyRef.current && img.naturalWidth > 0) {
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const viewAspect = width / height;
        let drawW = width;
        let drawH = height;
        let offX = 0;
        let offY = 0;
        if (imgAspect > viewAspect) {
          drawW = height * imgAspect;
          offX = (width - drawW) / 2;
        } else {
          drawH = width / imgAspect;
          offY = (height - drawH) / 2;
        }

        const scaleX = img.naturalWidth / drawW;
        const scaleY = img.naturalHeight / drawH;
        const srcCenterX = (d.x - offX) * scaleX;
        const srcCenterY = (d.y - offY) * scaleY;
        const sampleHalfW = Math.max(8, d.r * 4.2 * scaleX);
        const sampleHalfH = Math.max(8, d.r * 4.2 * yStretch * scaleY);

        ctx.translate(d.x, d.y);
        // Magnify and invert vertically to simulate genuine optical convex water lens
        ctx.scale(1.18, -1.18);
        ctx.filter = "brightness(1.25) contrast(1.16) saturate(1.15)";
        ctx.drawImage(
          img,
          Math.max(0, srcCenterX - sampleHalfW),
          Math.max(0, srcCenterY - sampleHalfH),
          sampleHalfW * 2,
          sampleHalfH * 2,
          -d.r * 1.12,
          -d.r * yStretch * 1.12,
          d.r * 2.24,
          d.r * yStretch * 2.24
        );
        ctx.filter = "none";
      }

      // Reset matrix before rim optics
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 3. Crystal-Clear Rim Only (100% transparent center, sharp refraction only at perimeter!)
      const crystalRim = ctx.createRadialGradient(
        d.x - d.r * 0.08,
        d.y - d.r * 0.1,
        d.r * 0.52,
        d.x,
        d.y,
        d.r * yStretch * 1.04
      );
      crystalRim.addColorStop(0, "rgba(255, 255, 255, 0)");
      crystalRim.addColorStop(0.76, "rgba(255, 255, 255, 0.02)");
      crystalRim.addColorStop(0.9, "rgba(230, 245, 255, 0.22)");
      crystalRim.addColorStop(1, "rgba(0, 0, 0, 0.52)");
      ctx.fillStyle = crystalRim;
      ctx.fillRect(d.x - d.r * 1.3, d.y - d.r * 1.6, d.r * 2.6, d.r * 3.2);

      // Upper dark total-internal-reflection sliver + bottom bright focal arc
      const meniscusGrad = ctx.createLinearGradient(
        d.x,
        d.y - d.r * yStretch,
        d.x,
        d.y + d.r * yStretch
      );
      meniscusGrad.addColorStop(0, "rgba(0, 0, 0, 0.58)");
      meniscusGrad.addColorStop(0.16, "rgba(0, 0, 0, 0)");
      meniscusGrad.addColorStop(0.8, "rgba(255, 255, 255, 0)");
      meniscusGrad.addColorStop(
        1,
        d.sparkle > 0.15 ? "rgba(252, 200, 96, 0.72)" : "rgba(255, 255, 255, 0.65)"
      );
      ctx.fillStyle = meniscusGrad;
      ctx.fillRect(d.x - d.r * 1.3, d.y - d.r * 1.6, d.r * 2.6, d.r * 3.2);

      ctx.restore();

      // 4. Razor-sharp twin specular reflections (gives wet crystal surface look)
      ctx.beginPath();
      ctx.ellipse(
        d.x - d.r * 0.33,
        d.y - d.r * 0.36 * yStretch,
        Math.max(0.65, d.r * 0.16),
        Math.max(0.45, d.r * 0.09),
        -Math.PI / 4,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.98, 0.88 + d.sparkle * 0.12).toFixed(2)})`;
      ctx.fill();

      // Micro pinpoint gleam inside specular highlight
      if (d.r >= 3.2) {
        ctx.beginPath();
        ctx.arc(
          d.x - d.r * 0.36,
          d.y - d.r * 0.39 * yStretch,
          Math.max(0.45, d.r * 0.07),
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();

        // Bottom-right micro caustic glint
        ctx.beginPath();
        ctx.arc(
          d.x + d.r * 0.24,
          d.y + d.r * 0.65 * yStretch,
          Math.max(0.45, d.r * 0.08),
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "rgba(255, 250, 235, 0.86)";
        ctx.fill();
      }
    };

    const renderFrame = (animate: boolean) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const ptr = pointerRef.current;
      const mx = ptr.x * width;
      const my = ptr.y * height;

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];

        if (animate) {
          d.wobblePhase += 0.035;

          if (d.sliding) {
            d.y += d.vy;
            d.x += Math.sin(d.wobblePhase) * 0.18;

            if (Math.random() < 0.32) {
              d.trail.push({ x: d.x, y: d.y - d.r * 1.15, r: Math.max(0.6, d.r * 0.15) });
              if (d.trail.length > 9) d.trail.shift();
            }

            if (d.y - d.r * 2 > height) {
              d.y = -d.r * 2;
              d.x = Math.random() * width;
              d.trail = [];
            }
          }

          if (ptr.inside) {
            const dx = d.x - mx;
            const dy = d.y - my;
            const dist = Math.hypot(dx, dy);
            const radius = 120;
            if (dist < radius && dist > 1) {
              const force = (1 - dist / radius) * 0.7;
              d.sparkle = Math.min(1, d.sparkle + force * 0.45);
              if (d.sliding) {
                d.x += (dx / dist) * force;
                d.y += (dy / dist) * force * 0.5;
              }
            }
          }
          d.sparkle *= 0.92;
        }

        drawDroplet(d, imgRef.current);
      }

      if (animate) {
        rafId = window.requestAnimationFrame(() => renderFrame(true));
      }
    };

    if (prefersReduced) {
      const t = window.setTimeout(() => renderFrame(false), 180);
      return () => {
        window.clearTimeout(t);
        ro.disconnect();
      };
    }

    rafId = window.requestAnimationFrame(() => renderFrame(true));
    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [pointerRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-[6] h-full w-full transition-opacity duration-1000 ease-out ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    />
  );
}
