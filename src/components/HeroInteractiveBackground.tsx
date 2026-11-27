"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

interface HeroPointerState {
  curX: number;
  curY: number;
  inside: boolean;
  pressPulse: number;
}

interface NodeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isGold: boolean;
  phase: number;
}

interface LightStreak {
  x: number;
  y: number;
  length: number;
  speed: number;
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

    const nodes: NodeParticle[] = [];
    const streaks: LightStreak[] = [];

    const seedScene = () => {
      nodes.length = 0;
      streaks.length = 0;

      const count = width < 768 ? 28 : 54;
      for (let i = 0; i < count; i++) {
        const angle = (i * 2.39996) % (Math.PI * 2);
        const speed = 0.18 + (i % 5) * 0.06;
        nodes.push({
          x: ((i * 137.5) % Math.max(width, 1)),
          y: ((i * 89.3) % Math.max(height, 1)),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: i % 4 === 0 ? 2.1 : 1.35,
          isGold: i % 3 !== 0,
          phase: i * 0.7,
        });
      }

      const streakCount = width < 768 ? 3 : 6;
      for (let i = 0; i < streakCount; i++) {
        streaks.push({
          x: ((i * 290) % Math.max(width, 1)),
          y: height * (0.18 + ((i * 0.17) % 0.68)),
          length: 90 + (i % 3) * 65,
          speed: 0.75 + (i % 4) * 0.35,
          alpha: 0.08 + (i % 3) * 0.04,
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

      seedScene();
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
        clock += 0.016;
        ctx.clearRect(0, 0, width, height);

        const p = pointerRef.current;
        const mx = p.curX * width;
        const my = p.curY * height;
        const linkDist = width < 768 ? 110 : 145;
        const cursorRadius = width < 768 ? 140 : 210;

        // 1. Subtle horizontal electric speed-light streaks
        for (const s of streaks) {
          s.x += s.speed;
          if (s.x - s.length > width) {
            s.x = -s.length;
          }
          const grad = ctx.createLinearGradient(s.x - s.length, s.y, s.x, s.y);
          grad.addColorStop(0, "rgba(252,170,48,0)");
          grad.addColorStop(0.6, `rgba(203,213,225,${(s.alpha * 0.65).toFixed(3)})`);
          grad.addColorStop(1, `rgba(252,170,48,${s.alpha.toFixed(3)})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(s.x - s.length, s.y);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();
        }

        // 2. Update particles + cursor magnetic wave
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;

          if (n.x < -10) n.x = width + 10;
          if (n.x > width + 10) n.x = -10;
          if (n.y < -10) n.y = height + 10;
          if (n.y > height + 10) n.y = -10;

          if (p.inside) {
            const dx = n.x - mx;
            const dy = n.y - my;
            const dist = Math.hypot(dx, dy);
            if (dist > 1 && dist < cursorRadius) {
              const force = (1 - dist / cursorRadius) * (0.45 + p.pressPulse * 1.4);
              n.x += (dx / dist) * force * 1.4;
              n.y += (dy / dist) * force * 1.4;
            }
          }
        }

        // 3. Connect nearby nodes with fine gold/chrome filaments
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.hypot(dx, dy);
            if (dist < linkDist) {
              const alpha = (1 - dist / linkDist) * 0.22;
              ctx.strokeStyle =
                a.isGold || b.isGold
                  ? `rgba(252,170,48,${alpha.toFixed(3)})`
                  : `rgba(203,213,225,${alpha.toFixed(3)})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }

          // 4. Cursor-reactive luminous filaments + node glow
          const dxM = a.x - mx;
          const dyM = a.y - my;
          const distM = Math.hypot(dxM, dyM);
          const nearCursor = p.inside && distM < cursorRadius;

          if (nearCursor) {
            const cAlpha = (1 - distM / cursorRadius) * 0.42;
            ctx.strokeStyle = `rgba(252,170,48,${cAlpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(a.x, a.y);
            ctx.stroke();
          }

          const twinkle = 0.55 + 0.45 * Math.sin(clock * 2.2 + a.phase);
          const nodeAlpha = nearCursor ? 0.95 : 0.35 + twinkle * 0.35;
          const nodeSize = nearCursor ? a.radius * 1.55 : a.radius;

          ctx.fillStyle = a.isGold
            ? `rgba(252,170,48,${nodeAlpha.toFixed(3)})`
            : `rgba(226,232,240,${nodeAlpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(a.x, a.y, nodeSize, 0, Math.PI * 2);
          ctx.fill();
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
