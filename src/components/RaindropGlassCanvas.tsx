"use client";

import { useEffect, useRef } from "react";

interface Droplet {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  sliding: boolean;
  wobblePhase: number;
  sparkle: number;
  trail: Array<{ x: number; y: number; r: number }>;
}

interface RaindropGlassCanvasProps {
  imageSrc: string;
  pointerRef: React.MutableRefObject<{
    x: number;
    y: number;
    inside: boolean;
  }>;
}

export function RaindropGlassCanvas({ imageSrc, pointerRef }: RaindropGlassCanvasProps) {
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
      const staticCount = w < 640 ? 48 : 88;
      const slidingCount = w < 640 ? 7 : 14;

      // Static condensation beads framing outer areas more heavily than dead center
      for (let i = 0; i < staticCount; i++) {
        let x = Math.random() * w;
        const y = Math.random() * h;
        // Gently bias larger drops outside the central headline focal band
        const inCenter =
          x > w * 0.28 && x < w * 0.72 && y > h * 0.22 && y < h * 0.65;
        if (inCenter && Math.random() < 0.65) {
          x = Math.random() < 0.5 ? Math.random() * w * 0.28 : w * 0.72 + Math.random() * w * 0.28;
        }
        const r = inCenter ? 1.8 + Math.random() * 2.8 : 2.2 + Math.random() * 6.5;
        list.push({
          x,
          y,
          r,
          vx: 0,
          vy: 0,
          sliding: false,
          wobblePhase: Math.random() * Math.PI * 2,
          sparkle: 0,
          trail: [],
        });
      }

      // Dynamic gravity-sliding teardrops
      for (let i = 0; i < slidingCount; i++) {
        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 4.5 + Math.random() * 4.5,
          vx: 0,
          vy: 0.35 + Math.random() * 0.55,
          sliding: true,
          wobblePhase: Math.random() * Math.PI * 2,
          sparkle: 0,
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
      const rx = d.r;
      const ry = d.sliding ? d.r * 1.28 : d.r * 1.06;

      // Subtle trailing micro-beads behind sliding drops
      if (d.sliding && d.trail.length > 0) {
        for (let t = 0; t < d.trail.length; t++) {
          const pt = d.trail[t];
          const alpha = ((t + 1) / d.trail.length) * 0.38;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
          ctx.fill();
        }
      }

      // Soft drop shadow on the glass surface
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(d.x + 1.2, d.y + 2.2, rx * 1.04, ry * 1.04, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.34)";
      ctx.fill();
      ctx.restore();

      // Optical refraction clip inside droplet lens
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(d.x, d.y, rx, ry, 0, 0, Math.PI * 2);
      ctx.clip();

      if (img && imgReadyRef.current && img.naturalWidth > 0) {
        // Map canvas coords to cover-fitted source image with curved-lens inverted refraction
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
        const sampleHalfW = Math.max(12, rx * 5.5 * scaleX);
        const sampleHalfH = Math.max(12, ry * 5.5 * scaleY);

        ctx.translate(d.x, d.y);
        // Flip vertically inside water bead for realistic convex droplet refraction
        ctx.scale(1, -1);
        ctx.drawImage(
          img,
          Math.max(0, srcCenterX - sampleHalfW),
          Math.max(0, srcCenterY - sampleHalfH),
          sampleHalfW * 2,
          sampleHalfH * 2,
          -rx,
          -ry,
          rx * 2,
          ry * 2
        );
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fillRect(d.x - rx, d.y - ry, rx * 2, ry * 2);
      }

      // Inner wet rim shading & bottom caustic bounce
      const grad = ctx.createRadialGradient(
        d.x - rx * 0.25,
        d.y - ry * 0.3,
        rx * 0.1,
        d.x,
        d.y,
        ry * 1.1
      );
      grad.addColorStop(0, "rgba(255,255,255,0.06)");
      grad.addColorStop(0.65, "rgba(0,0,0,0.08)");
      grad.addColorStop(1, "rgba(255,255,255,0.38)");
      ctx.fillStyle = grad;
      ctx.fillRect(d.x - rx, d.y - ry, rx * 2, ry * 2);
      ctx.restore();

      // Delicate crystalline rim & cursor sparkle
      ctx.beginPath();
      ctx.ellipse(d.x, d.y, rx, ry, 0, 0, Math.PI * 2);
      const rimAlpha = Math.min(0.85, 0.28 + d.sparkle * 0.55);
      ctx.strokeStyle =
        d.sparkle > 0.15
          ? `rgba(252, 170, 48, ${rimAlpha.toFixed(2)})`
          : `rgba(255, 255, 255, ${rimAlpha.toFixed(2)})`;
      ctx.lineWidth = 0.8 + d.sparkle * 0.6;
      ctx.stroke();

      // Crisp specular highlight on upper-left lens curve
      if (rx >= 2.2) {
        ctx.beginPath();
        ctx.ellipse(
          d.x - rx * 0.34,
          d.y - ry * 0.34,
          Math.max(0.8, rx * 0.24),
          Math.max(0.6, ry * 0.16),
          -Math.PI / 5,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.95, 0.7 + d.sparkle * 0.25).toFixed(2)})`;
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
          d.wobblePhase += 0.03;

          if (d.sliding) {
            // Subtle meandering down glass pane
            d.y += d.vy;
            d.x += Math.sin(d.wobblePhase) * 0.16;

            if (Math.random() < 0.28) {
              d.trail.push({ x: d.x, y: d.y - d.r * 1.1, r: Math.max(0.9, d.r * 0.22) });
              if (d.trail.length > 7) d.trail.shift();
            }

            if (d.y - d.r * 2 > height) {
              d.y = -d.r * 2;
              d.x = Math.random() * width;
              d.trail = [];
            }
          }

          // Mouse optical wake & gentle surface push
          if (ptr.inside) {
            const dx = d.x - mx;
            const dy = d.y - my;
            const dist = Math.hypot(dx, dy);
            const radius = 125;
            if (dist < radius && dist > 1) {
              const force = (1 - dist / radius) * 0.65;
              d.sparkle = Math.min(1, d.sparkle + force * 0.45);
              if (d.sliding) {
                d.x += (dx / dist) * force * 0.9;
                d.y += (dy / dist) * force * 0.45;
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
      // Wait briefly for image load then draw static crisp beads
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
      className="pointer-events-none absolute inset-0 z-[6] h-full w-full"
    />
  );
}
