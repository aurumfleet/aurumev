"use client";

import { useEffect, useRef } from "react";

interface Spark {
  angle: number;
  speed: number;
  radius: number;
  color: string;
  length: number;
}

interface ClickBurst {
  x: number;
  y: number;
  start: number;
  duration: number;
  sparks: Spark[];
}

const SPARK_COLORS = ["#FCAA30", "#F5CF7E", "#FFFFFF", "#CBD5E1", "#FCAA30"];

export function ClickPulseEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const bursts: ClickBurst[] = [];
    let rafId = 0;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        const elapsed = now - b.start;
        const progress = Math.min(1, elapsed / b.duration);

        if (progress >= 1) {
          bursts.splice(i, 1);
          continue;
        }

        const eased = easeOutCubic(progress);
        const alpha = 1 - progress;

        // 1. Central warm champagne-gold flash
        if (progress < 0.45) {
          const flashAlpha = (1 - progress / 0.45) * 0.55;
          const flashRadius = 6 + eased * 18;
          const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, flashRadius);
          grad.addColorStop(0, `rgba(255, 255, 255, ${flashAlpha})`);
          grad.addColorStop(0.45, `rgba(252, 170, 48, ${flashAlpha * 0.85})`);
          grad.addColorStop(1, "rgba(252, 170, 48, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(b.x, b.y, flashRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. Primary expanding Aurum Gold shockwave ring
        const goldRadius = 6 + eased * 44;
        ctx.save();
        ctx.strokeStyle = `rgba(252, 170, 48, ${(alpha * 0.9).toFixed(3)})`;
        ctx.lineWidth = Math.max(0.75, 2.2 * (1 - progress * 0.7));
        ctx.beginPath();
        ctx.arc(b.x, b.y, goldRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 3. Secondary Chrome-Silver inner ripple (slightly delayed)
        if (progress > 0.08) {
          const p2 = Math.min(1, (progress - 0.08) / 0.92);
          const e2 = easeOutCubic(p2);
          const chromeRadius = 4 + e2 * 30;
          ctx.save();
          ctx.strokeStyle = `rgba(203, 213, 225, ${((1 - p2) * 0.85).toFixed(3)})`;
          ctx.lineWidth = Math.max(0.6, 1.5 * (1 - p2 * 0.6));
          ctx.beginPath();
          ctx.arc(b.x, b.y, chromeRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // 4. Radial Chrome & Gold micro-spark streaks
        for (const s of b.sparks) {
          const dist = 6 + eased * s.speed;
          const tailDist = Math.max(4, dist - s.length * (1 - progress * 0.65));
          const x1 = b.x + Math.cos(s.angle) * tailDist;
          const y1 = b.y + Math.sin(s.angle) * tailDist;
          const x2 = b.x + Math.cos(s.angle) * dist;
          const y2 = b.y + Math.sin(s.angle) * dist;

          ctx.save();
          ctx.globalAlpha = Math.max(0, alpha * 0.95);
          ctx.strokeStyle = s.color;
          ctx.lineWidth = s.radius;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.restore();
        }
      }

      if (bursts.length > 0) {
        rafId = window.requestAnimationFrame(draw);
      } else {
        rafId = 0;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;

      const sparkCount = 10;
      const baseAngle = (bursts.length * 0.4) % (Math.PI * 2);
      const sparks: Spark[] = Array.from({ length: sparkCount }, (_, idx) => {
        const angle = baseAngle + (idx * (Math.PI * 2)) / sparkCount + (idx % 2 === 0 ? 0.08 : -0.06);
        return {
          angle,
          speed: 32 + (idx % 3) * 11,
          radius: idx % 2 === 0 ? 2 : 1.4,
          color: SPARK_COLORS[idx % SPARK_COLORS.length],
          length: 8 + (idx % 3) * 3,
        };
      });

      if (bursts.length >= 8) {
        bursts.shift();
      }

      bursts.push({
        x: e.clientX,
        y: e.clientY,
        start: performance.now(),
        duration: 560,
        sparks,
      });

      if (!rafId) {
        rafId = window.requestAnimationFrame(draw);
      }
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", handlePointerDown);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
    />
  );
}
