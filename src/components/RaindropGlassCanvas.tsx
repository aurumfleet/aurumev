"use client";

import { useEffect, useRef } from "react";

interface OrganicPoint {
  angle: number;
  radialScale: number;
}

interface GlassDrop {
  x: number;
  y: number;
  r: number;
  vy: number;
  baseVy: number;
  depth: number; // 0.35 .. 1.35 for 3D Z parallax
  sliding: boolean;
  wobblePhase: number;
  burstTimer: number;
  sparkle: number;
  shape: OrganicPoint[];
  trail: Array<{ x: number; y: number; r: number }>;
}

interface AirRainStreak {
  x: number;
  y: number;
  z: number; // 0.25 (far) .. 1.45 (near)
  len: number;
  vy: number;
  vx: number;
  alpha: number;
}

interface ImpactSplash {
  x: number;
  y: number;
  r: number;
  maxR: number;
  life: number;
  depth: number;
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
        ? 1 + Math.sin(angle) * (isTeardrop ? 0.26 : 0.08)
        : 1 - (isTeardrop ? 0.08 : 0);
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
    let drops: GlassDrop[] = [];
    let streaks: AirRainStreak[] = [];
    let splashes: ImpactSplash[] = [];
    let rafId = 0;
    let smoothPx = 0;
    let smoothPy = 0;

    const createScene = (w: number, h: number) => {
      const glassList: GlassDrop[] = [];
      const mistCount = w < 640 ? 90 : 165;
      const beadCount = w < 640 ? 30 : 56;
      const rivuletCount = w < 640 ? 15 : 28;
      const streakCount = w < 640 ? 65 : 135;

      // 1. Fine condensation micro-beads across 3D Z depth
      for (let i = 0; i < mistCount; i++) {
        glassList.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.8 + Math.random() * 1.4,
          vy: 0,
          baseVy: 0,
          depth: 0.4 + Math.random() * 0.5,
          sliding: false,
          wobblePhase: Math.random() * Math.PI * 2,
          burstTimer: 0,
          sparkle: 0,
          shape: buildOrganicShape(i + 1, false),
          trail: [],
        });
      }

      // 2. Medium & large crystal glass droplets (higher Z depth pop)
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
        const r = inCenter ? 2.2 + Math.random() * 2.2 : 3.2 + Math.random() * 6.8;
        glassList.push({
          x,
          y,
          r,
          vy: 0,
          baseVy: 0,
          depth: 0.75 + Math.random() * 0.65,
          sliding: false,
          wobblePhase: Math.random() * Math.PI * 2,
          burstTimer: 0,
          sparkle: 0,
          shape: buildOrganicShape(i * 3.1, r > 5.5),
          trail: [],
        });
      }

      // 3. Brisk, lively 3D streaming rivulets racing down the glass
      for (let i = 0; i < rivuletCount; i++) {
        const r = 4.6 + Math.random() * 4.6;
        const baseVy = 3.2 + Math.random() * 4.2;
        glassList.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          vy: baseVy,
          baseVy,
          depth: 0.95 + Math.random() * 0.5,
          sliding: true,
          wobblePhase: Math.random() * Math.PI * 2,
          burstTimer: Math.random() * 40,
          sparkle: 0,
          shape: buildOrganicShape(i * 7.9, true),
          trail: [],
        });
      }

      // 4. Multi-depth 3D falling rain streaks (far, mid, near windshield)
      const streakList: AirRainStreak[] = [];
      for (let i = 0; i < streakCount; i++) {
        const z = 0.25 + Math.random() * 1.25;
        streakList.push({
          x: Math.random() * (w + 160) - 80,
          y: Math.random() * h,
          z,
          len: 16 + z * 28,
          vy: 14 + z * 16,
          vx: -(1.4 + z * 1.6),
          alpha: 0.14 + z * 0.24,
        });
      }

      drops = glassList;
      streaks = streakList;
      splashes = [];
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
      createScene(width, height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const drawDroplet = (
      d: GlassDrop,
      pxShiftX: number,
      pxShiftY: number,
      img: HTMLImageElement | null
    ) => {
      const dx = d.x + pxShiftX * d.depth;
      const dy = d.y + pxShiftY * d.depth;
      const yStretch = d.sliding ? 1.28 : 1.05;

      // Tiny micro-beads
      if (d.r < 2.2) {
        ctx.beginPath();
        ctx.arc(dx + 0.5, dy + 0.8, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(dx, dy, d.r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(dx - d.r * 0.32, dy - d.r * 0.32, Math.max(0.45, d.r * 0.38), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
        ctx.fill();
        return;
      }

      // Glistening trail left by fast sliding drops
      if (d.sliding && d.trail.length > 0) {
        for (let t = 0; t < d.trail.length; t++) {
          const pt = d.trail[t];
          const alpha = ((t + 1) / d.trail.length) * 0.52;
          ctx.beginPath();
          ctx.arc(
            pt.x + pxShiftX * d.depth,
            pt.y + pxShiftY * d.depth,
            pt.r,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
          ctx.fill();
        }
      }

      // 1. 3D Contact Shadow beneath crystal bead
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
      ctx.shadowBlur = Math.max(3, d.r * 0.72 * d.depth);
      ctx.shadowOffsetX = 1.2 * d.depth;
      ctx.shadowOffsetY = 2.8 * d.depth;
      traceOrganicPath(ctx, dx, dy, d.r, d.shape, yStretch);
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fill();
      ctx.restore();

      // Exterior caustic light cast onto glass below bead
      if (d.r >= 3.6) {
        const causticGrad = ctx.createRadialGradient(
          dx + d.r * 0.15,
          dy + d.r * 1.18 * yStretch,
          0.5,
          dx + d.r * 0.15,
          dy + d.r * 1.18 * yStretch,
          d.r * 0.92
        );
        causticGrad.addColorStop(
          0,
          d.sparkle > 0.15 ? "rgba(252, 196, 92, 0.38)" : "rgba(255, 255, 255, 0.26)"
        );
        causticGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = causticGrad;
        ctx.beginPath();
        ctx.arc(dx + d.r * 0.15, dy + d.r * 1.18 * yStretch, d.r * 0.92, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Crystal-Clear Convex Lens Photo Refraction
      ctx.save();
      traceOrganicPath(ctx, dx, dy, d.r, d.shape, yStretch);
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
        const srcCenterX = (dx - offX) * scaleX;
        const srcCenterY = (dy - offY) * scaleY;
        const sampleHalfW = Math.max(8, d.r * 4.2 * scaleX);
        const sampleHalfH = Math.max(8, d.r * 4.2 * yStretch * scaleY);

        ctx.translate(dx, dy);
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

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 3. Perimeter Refraction Only (100% clear transparent middle)
      const crystalRim = ctx.createRadialGradient(
        dx - d.r * 0.08,
        dy - d.r * 0.1,
        d.r * 0.52,
        dx,
        dy,
        d.r * yStretch * 1.04
      );
      crystalRim.addColorStop(0, "rgba(255, 255, 255, 0)");
      crystalRim.addColorStop(0.76, "rgba(255, 255, 255, 0.02)");
      crystalRim.addColorStop(0.9, "rgba(230, 245, 255, 0.24)");
      crystalRim.addColorStop(1, "rgba(0, 0, 0, 0.52)");
      ctx.fillStyle = crystalRim;
      ctx.fillRect(dx - d.r * 1.3, dy - d.r * 1.6, d.r * 2.6, d.r * 3.2);

      const meniscusGrad = ctx.createLinearGradient(
        dx,
        dy - d.r * yStretch,
        dx,
        dy + d.r * yStretch
      );
      meniscusGrad.addColorStop(0, "rgba(0, 0, 0, 0.56)");
      meniscusGrad.addColorStop(0.16, "rgba(0, 0, 0, 0)");
      meniscusGrad.addColorStop(0.8, "rgba(255, 255, 255, 0)");
      meniscusGrad.addColorStop(
        1,
        d.sparkle > 0.15 ? "rgba(252, 200, 96, 0.74)" : "rgba(255, 255, 255, 0.68)"
      );
      ctx.fillStyle = meniscusGrad;
      ctx.fillRect(dx - d.r * 1.3, dy - d.r * 1.6, d.r * 2.6, d.r * 3.2);

      ctx.restore();

      // 4. Twin Specular Reflections
      ctx.beginPath();
      ctx.ellipse(
        dx - d.r * 0.33,
        dy - d.r * 0.36 * yStretch,
        Math.max(0.65, d.r * 0.16),
        Math.max(0.45, d.r * 0.09),
        -Math.PI / 4,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.98, 0.88 + d.sparkle * 0.12).toFixed(2)})`;
      ctx.fill();

      if (d.r >= 3.2) {
        ctx.beginPath();
        ctx.arc(
          dx - d.r * 0.36,
          dy - d.r * 0.39 * yStretch,
          Math.max(0.45, d.r * 0.07),
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(
          dx + d.r * 0.24,
          dy + d.r * 0.65 * yStretch,
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
      const targetPx = ptr.inside ? (ptr.x - 0.5) * 26 : 0;
      const targetPy = ptr.inside ? (ptr.y - 0.5) * 18 : 0;
      smoothPx += (targetPx - smoothPx) * 0.1;
      smoothPy += (targetPy - smoothPy) * 0.1;

      const mx = ptr.x * width;
      const my = ptr.y * height;

      // A. Draw 3D Falling Rain Streaks Across Depth Planes
      if (animate) {
        ctx.lineCap = "round";
        for (let i = 0; i < streaks.length; i++) {
          const s = streaks[i];
          s.x += s.vx;
          s.y += s.vy;

          // Occasional 3D raindrop strike on glass plane
          if (s.z > 0.85 && Math.random() < 0.012 && splashes.length < 18) {
            splashes.push({
              x: s.x,
              y: s.y,
              r: 1.5,
              maxR: 8 + s.z * 9,
              life: 1,
              depth: s.z,
            });
          }

          if (s.y - s.len > height || s.x < -80) {
            s.y = -s.len - Math.random() * 80;
            s.x = Math.random() * (width + 160);
          }

          const sx = s.x + smoothPx * s.z * 0.8;
          const sy = s.y + smoothPy * s.z * 0.8;
          const grad = ctx.createLinearGradient(sx, sy - s.len, sx + s.vx * 1.4, sy);
          grad.addColorStop(0, "rgba(255, 255, 255, 0)");
          grad.addColorStop(0.65, `rgba(255, 255, 255, ${(s.alpha * 0.65).toFixed(2)})`);
          grad.addColorStop(1, `rgba(255, 248, 225, ${s.alpha.toFixed(2)})`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.7 + s.z * 1.1;
          ctx.beginPath();
          ctx.moveTo(sx, sy - s.len);
          ctx.lineTo(sx + s.vx * 1.4, sy);
          ctx.stroke();
        }
      }

      // B. Draw Impact Splash Ripples on Glass
      if (animate) {
        for (let i = splashes.length - 1; i >= 0; i--) {
          const sp = splashes[i];
          sp.r += 1.45;
          sp.life -= 0.075;
          if (sp.life <= 0 || sp.r >= sp.maxR) {
            splashes.splice(i, 1);
            continue;
          }
          const rx = sp.x + smoothPx * sp.depth;
          const ry = sp.y + smoothPy * sp.depth;
          ctx.beginPath();
          ctx.ellipse(rx, ry, sp.r, sp.r * 0.82, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${(sp.life * 0.42).toFixed(2)})`;
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }
      }

      // C. Update & Draw Crystal Water Drops + Fast Streaming Rivulets
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];

        if (animate) {
          d.wobblePhase += 0.08;

          if (d.sliding) {
            // Stick-slip gravity surges so drops race down realistically like active rain
            d.burstTimer += 0.1;
            const surge = Math.sin(d.burstTimer) > 0.35 ? 1.65 : 0.78;
            d.y += d.baseVy * surge;
            d.x += Math.sin(d.wobblePhase) * 0.48 - 0.15;

            if (Math.random() < 0.65) {
              d.trail.push({ x: d.x, y: d.y - d.r * 1.1, r: Math.max(0.65, d.r * 0.16) });
              if (d.trail.length > 14) d.trail.shift();
            }

            if (d.y - d.r * 2 > height) {
              d.y = -d.r * 2 - Math.random() * 60;
              d.x = Math.random() * width;
              d.trail = [];
            }
          } else if (d.r > 2.5) {
            // Subtle windshield rain vibration on resting drops
            d.x += Math.sin(d.wobblePhase * 1.5) * 0.04;
          }

          if (ptr.inside) {
            const dx = d.x - mx;
            const dy = d.y - my;
            const dist = Math.hypot(dx, dy);
            const radius = 135;
            if (dist < radius && dist > 1) {
              const force = (1 - dist / radius) * 0.85;
              d.sparkle = Math.min(1, d.sparkle + force * 0.5);
              if (d.sliding) {
                d.x += (dx / dist) * force * 1.25;
                d.y += (dy / dist) * force * 0.65;
              }
            }
          }
          d.sparkle *= 0.9;
        }

        drawDroplet(d, smoothPx, smoothPy, imgRef.current);
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
