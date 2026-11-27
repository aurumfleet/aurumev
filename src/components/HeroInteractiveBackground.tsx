"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

interface HeroPointerState {
  curX: number;
  curY: number;
  inside: boolean;
  pressPulse: number;
}

interface FlowParticle {
  x: number;
  y: number;
  speed: number;
  size: number;
  isGold: boolean;
  phase: number;
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

interface ShockWave {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

export function HeroInteractiveBackground({
  pointerRef,
}: {
  pointerRef: MutableRefObject<HeroPointerState>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = true;
    let rafId = 0;
    let prevPress = 0;

    const particles: FlowParticle[] = [];
    const trail: TrailPoint[] = [];
    const waves: ShockWave[] = [];

    const seed = () => {
      particles.length = 0;
      const count = width < 768 ? 24 : 44;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: (i * 173.3) % Math.max(width, 1),
          y: height * (0.12 + ((i * 0.071) % 0.78)),
          speed: 0.45 + (i % 5) * 0.18,
          size: i % 4 === 0 ? 2.2 : 1.35,
          isGold: i % 3 !== 0,
          phase: i * 0.65,
        });
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent?.clientWidth || window.innerWidth;
      height = parent?.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    resize();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    observer.observe(canvas);

    let clock = 0;

    const render = () => {
      if (isVisible && width > 0 && height > 0) {
        clock += 0.015;
        ctx.clearRect(0, 0, width, height);

        const p = pointerRef.current;
        const mx = p.curX * width;
        const my = p.curY * height;

        // Detect click pulse edge to spawn electromagnetic wave
        if (p.pressPulse > 0.85 && prevPress <= 0.85 && p.inside) {
          waves.push({ x: mx, y: my, radius: 10, alpha: 0.75 });
          if (waves.length > 4) waves.shift();
        }
        prevPress = p.pressPulse;

        // Record cursor trail
        if (p.inside) {
          trail.push({ x: mx, y: my, age: 0 });
          if (trail.length > 22) trail.shift();
        }

        // 1. Sculpted Aerodynamic Magnetic Ribbons (bend toward/around cursor)
        const ribbonCount = 5;
        const step = width < 768 ? 28 : 22;

        for (let r = 0; r < ribbonCount; r++) {
          const baseY = height * (0.24 + r * 0.14);
          const isGoldRibbon = r % 2 === 0;
          const grad = ctx.createLinearGradient(0, baseY - 40, width, baseY + 40);
          if (isGoldRibbon) {
            grad.addColorStop(0, "rgba(252,170,48,0)");
            grad.addColorStop(0.25, "rgba(252,170,48,0.16)");
            grad.addColorStop(0.55, "rgba(253,230,182,0.26)");
            grad.addColorStop(0.85, "rgba(252,170,48,0.14)");
            grad.addColorStop(1, "rgba(252,170,48,0)");
          } else {
            grad.addColorStop(0, "rgba(203,213,225,0)");
            grad.addColorStop(0.3, "rgba(203,213,225,0.14)");
            grad.addColorStop(0.6, "rgba(255,255,255,0.2)");
            grad.addColorStop(1, "rgba(203,213,225,0)");
          }

          ctx.strokeStyle = grad;
          ctx.lineWidth = r === 2 ? 1.8 : 1.1;
          ctx.beginPath();

          for (let x = 0; x <= width + step; x += step) {
            const wave1 = Math.sin(x * 0.0045 + clock * (1.05 + r * 0.14) + r * 1.3) * 26;
            const wave2 = Math.cos(x * 0.009 - clock * 0.7 + r) * 12;
            let y = baseY + wave1 + wave2;

            // Cursor magnetic field deflection
            if (p.inside) {
              const dx = x - mx;
              const dy = y - my;
              const dist = Math.hypot(dx, dy);
              const influenceRadius = 220;
              if (dist < influenceRadius) {
                const factor = Math.pow(1 - dist / influenceRadius, 2);
                const pushDir = dy >= 0 ? 1 : -1;
                y += pushDir * factor * (48 + p.pressPulse * 34);
              }
            }

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // 2. Flowing Charge Particles riding the field + cursor filaments
        const cursorRadius = width < 768 ? 140 : 200;
        for (const pt of particles) {
          pt.x += pt.speed;
          if (pt.x > width + 16) pt.x = -16;

          const driftY = Math.sin(pt.x * 0.006 + clock + pt.phase) * 0.35;
          pt.y += driftY;

          let drawX = pt.x;
          let drawY = pt.y;
          let near = false;

          if (p.inside) {
            const dx = pt.x - mx;
            const dy = pt.y - my;
            const dist = Math.hypot(dx, dy);
            if (dist < cursorRadius && dist > 1) {
              near = true;
              const pull = (1 - dist / cursorRadius) * 18;
              drawX -= (dx / dist) * pull;
              drawY -= (dy / dist) * pull;

              const lineAlpha = (1 - dist / cursorRadius) * 0.36;
              ctx.strokeStyle = `rgba(252,170,48,${lineAlpha.toFixed(3)})`;
              ctx.lineWidth = 0.85;
              ctx.beginPath();
              ctx.moveTo(mx, my);
              ctx.lineTo(drawX, drawY);
              ctx.stroke();
            }
          }

          const twinkle = 0.45 + 0.55 * Math.sin(clock * 2.5 + pt.phase);
          const alpha = near ? 0.95 : 0.3 + twinkle * 0.4;
          ctx.fillStyle = pt.isGold
            ? `rgba(252,170,48,${alpha.toFixed(3)})`
            : `rgba(226,232,240,${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(drawX, drawY, near ? pt.size * 1.6 : pt.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3. Silky Liquid-Gold Cursor Comet Trail
        for (let i = trail.length - 1; i >= 0; i--) {
          trail[i].age += 1;
          if (trail[i].age > 20) {
            trail.splice(i, 1);
            continue;
          }
          if (i > 0) {
            const prev = trail[i - 1];
            const cur = trail[i];
            const life = 1 - cur.age / 20;
            ctx.strokeStyle = `rgba(252,170,48,${(life * 0.42).toFixed(3)})`;
            ctx.lineWidth = Math.max(0.5, life * 2.6);
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(cur.x, cur.y);
            ctx.stroke();
          }
        }

        // 4. Expanding Electromagnetic Click Shockwaves
        for (let i = waves.length - 1; i >= 0; i--) {
          const w = waves[i];
          w.radius += 6.5;
          w.alpha *= 0.93;
          if (w.alpha < 0.02) {
            waves.splice(i, 1);
            continue;
          }
          ctx.strokeStyle = `rgba(252,170,48,${w.alpha.toFixed(3)})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [pointerRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[6]"
    />
  );
}
