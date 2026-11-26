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
  const count = 8;
  const pts: OrganicPoint[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    // Slight bottom sag for gravity + subtle organic irregularity
    const gravitySag = Math.sin(angle) > 0 ? 1 + Math.sin(angle) * (isTeardrop ? 0.24 : 0.09) : 1 - (isTeardrop ? 0.08 : 0);
    const jitter = 0.9 + Math.abs(Math.sin(seed * 13.7 + i * 4.3)) * 0.18;
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
    const midX = (curr.x + next.x) / 2;
    const midY = (curr.y + next.y) / 2;
    ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
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
      const mistCount = w < 640 ? 95 : 190;
      const beadCount = w < 640 ? 38 : 74;
      const slidingCount = w < 640 ? 6 : 12;

      // 1. Fine condensation micro-beads across the entire glass pane
      for (let i = 0; i < mistCount; i++) {
        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.9 + Math.random() * 1.6,
          vy: 0,
          sliding: false,
          wobblePhase: Math.random() * Math.PI * 2,
          sparkle: 0,
          shape: buildOrganicShape(i + 1, false),
          trail: [],
        });
      }

      // 2. Medium & large organic surface-tension droplets
      for (let i = 0; i < beadCount; i++) {
        let x = Math.random() * w;
        const y = Math.random() * h;
        const inCenter =
          x > w * 0.27 && x < w * 0.73 && y > h * 0.2 && y < h * 0.66;
        if (inCenter && Math.random() < 0.7) {
          x =
            Math.random() < 0.5
              ? Math.random() * w * 0.27
              : w * 0.73 + Math.random() * w * 0.27;
        }
        const r = inCenter ? 2.1 + Math.random() * 2.4 : 2.8 + Math.random() * 6.8;
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

      // 3. Slow gravity-sliding heavy droplets leaving micro-bead trails
      for (let i = 0; i < slidingCount; i++) {
        const r = 4.6 + Math.random() * 4.4;
        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          vy: 0.45 + Math.random() * 0.75,
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

      // Tiny mist droplets: subtle translucent glass highlights without heavy fill
      if (d.r < 2.2) {
        ctx.beginPath();
        ctx.arc(d.x + 0.5, d.y + 0.8, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(d.x - d.r * 0.3, d.y - d.r * 0.3, Math.max(0.45, d.r * 0.35), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
        ctx.fill();
        return;
      }

      // Sliding wake trail
      if (d.sliding && d.trail.length > 0) {
        for (let t = 0; t < d.trail.length; t++) {
          const pt = d.trail[t];
          const alpha = ((t + 1) / d.trail.length) * 0.32;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
          ctx.fill();
        }
      }

      // 1. Soft blurred contact shadow beneath drop
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
      ctx.shadowBlur = Math.max(2, d.r * 0.55);
      ctx.shadowOffsetX = 0.8;
      ctx.shadowOffsetY = 2.2;
      traceOrganicPath(ctx, d.x, d.y, d.r, d.shape, yStretch);
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fill();
      ctx.restore();

      // 2. Optical Fresnel refraction inside the organic droplet lens
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
        const sampleHalfW = Math.max(10, d.r * 4.8 * scaleX);
        const sampleHalfH = Math.max(10, d.r * 4.8 * yStretch * scaleY);

        ctx.translate(d.x, d.y);
        // Flip vertically + slight horizontal zoom for convex lens optics
        ctx.scale(1.06, -1.06);
        ctx.drawImage(
          img,
          Math.max(0, srcCenterX - sampleHalfW),
          Math.max(0, srcCenterY - sampleHalfH),
          sampleHalfW * 2,
          sampleHalfH * 2,
          -d.r * 1.15,
          -d.r * yStretch * 1.15,
          d.r * 2.3,
          d.r * yStretch * 2.3
        );
      }

      // Reset transform before shading inside clip
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 3. Real water internal light shading:
      //    Dark upper meniscus shadow (light refracting down) + bright bottom caustic glow
      const depthGrad = ctx.createLinearGradient(
        d.x,
        d.y - d.r * yStretch,
        d.x,
        d.y + d.r * yStretch
      );
      depthGrad.addColorStop(0, "rgba(0, 0, 0, 0.58)");
      depthGrad.addColorStop(0.28, "rgba(0, 0, 0, 0.12)");
      depthGrad.addColorStop(0.72, "rgba(255, 255, 255, 0.04)");
      depthGrad.addColorStop(1, d.sparkle > 0.15 ? "rgba(252, 190, 80, 0.55)" : "rgba(255, 255, 255, 0.48)");
      ctx.fillStyle = depthGrad;
      ctx.fillRect(d.x - d.r * 1.3, d.y - d.r * 1.6, d.r * 2.6, d.r * 3.2);

      // Subtle inner rim vignette (NO thick cartoon white outline)
      const rimGrad = ctx.createRadialGradient(
        d.x,
        d.y + d.r * 0.15,
        d.r * 0.35,
        d.x,
        d.y,
        d.r * yStretch * 1.1
      );
      rimGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      rimGrad.addColorStop(0.82, "rgba(0, 0, 0, 0.08)");
      rimGrad.addColorStop(1, "rgba(0, 0, 0, 0.45)");
      ctx.fillStyle = rimGrad;
      ctx.fillRect(d.x - d.r * 1.3, d.y - d.r * 1.6, d.r * 2.6, d.r * 3.2);

      ctx.restore();

      // 4. Pinpoint sharp specular highlight on upper-left lens surface
      ctx.beginPath();
      ctx.ellipse(
        d.x - d.r * 0.32,
        d.y - d.r * 0.36 * yStretch,
        Math.max(0.7, d.r * 0.17),
        Math.max(0.55, d.r * 0.11),
        -Math.PI / 4,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.95, 0.78 + d.sparkle * 0.2).toFixed(2)})`;
      ctx.fill();

      // Tiny secondary lower-right caustic pinpoint on larger beads
      if (d.r >= 4) {
        ctx.beginPath();
        ctx.arc(
          d.x + d.r * 0.22,
          d.y + d.r * 0.62 * yStretch,
          Math.max(0.5, d.r * 0.09),
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "rgba(255, 245, 220, 0.72)";
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

            if (Math.random() < 0.3) {
              d.trail.push({ x: d.x, y: d.y - d.r * 1.15, r: Math.max(0.7, d.r * 0.18) });
              if (d.trail.length > 8) d.trail.shift();
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
