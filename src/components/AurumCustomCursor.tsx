"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], select, summary, label[for], input[type="checkbox"], input[type="radio"], input[type="range"], [data-cursor="pointer"]';
const TEXT_INPUT_SELECTOR =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"]), textarea, [contenteditable="true"]';

interface TrailDot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  isGold: boolean;
}

export function AurumCustomCursor() {
  const arrowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const arrow = arrowRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    const canvas = canvasRef.current;
    if (!arrow || !ring || !glow || !canvas) return;
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

    let mouseX = -100;
    let mouseY = -100;
    let prevX = -100;
    let prevY = -100;
    let ringX = -100;
    let ringY = -100;
    let ringScale = 1;
    let targetScale = 1;
    let bezelAngle = 0;
    let isVisible = false;
    let isPointerHover = false;
    let isTextHover = false;
    let isPressed = false;
    let rafId = 0;

    const trail: TrailDot[] = [];

    const enableCursorClass = () => {
      document.documentElement.classList.add("aurum-custom-cursor");
    };

    const disableCursorClass = () => {
      document.documentElement.classList.remove("aurum-custom-cursor");
    };

    const updateVisualState = () => {
      if (isPressed) {
        targetScale = 0.72;
      } else if (isPointerHover) {
        targetScale = 1.48;
      } else if (isTextHover) {
        targetScale = 0.55;
      } else {
        targetScale = 1;
      }

      arrow.style.opacity = isVisible ? (isTextHover ? "0.35" : "1") : "0";
      ring.style.opacity = isVisible ? "1" : "0";
      glow.style.opacity = isVisible ? (isPointerHover ? "1" : "0.55") : "0";
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.24;
      ringY += (mouseY - ringY) * 0.24;
      ringScale += (targetScale - ringScale) * 0.22;
      bezelAngle = (bezelAngle + (isPointerHover ? 2.4 : 0.75)) % 360;

      arrow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(${
        isPressed ? 0.82 : 1
      })`;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale.toFixed(
        3
      )}) rotate(${bezelAngle.toFixed(1)}deg)`;

      glow.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${
        isPointerHover ? 1.35 : 1
      })`;

      // Draw silky velocity-reactive gold & chrome micro-trail
      ctx.clearRect(0, 0, width, height);
      for (let i = trail.length - 1; i >= 0; i--) {
        const d = trail[i];
        d.x += d.vx;
        d.y += d.vy;
        d.alpha *= 0.86;
        d.size *= 0.96;

        if (d.alpha < 0.03) {
          trail.splice(i, 1);
          continue;
        }

        ctx.fillStyle = d.isGold
          ? `rgba(252,170,48,${d.alpha.toFixed(3)})`
          : `rgba(226,232,240,${d.alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (isVisible || trail.length > 0) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    const startLoop = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") {
        isVisible = false;
        disableCursorClass();
        updateVisualState();
        return;
      }

      if (!isVisible) {
        isVisible = true;
        ringX = e.clientX;
        ringY = e.clientY;
        prevX = e.clientX;
        prevY = e.clientY;
        enableCursorClass();
      }

      mouseX = e.clientX;
      mouseY = e.clientY;

      const dx = mouseX - prevX;
      const dy = mouseY - prevY;
      const speed = Math.hypot(dx, dy);

      if (speed > 2.5) {
        const count = speed > 18 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          trail.push({
            x: mouseX + (i === 1 ? -dx * 0.35 : 0),
            y: mouseY + (i === 1 ? -dy * 0.35 : 0),
            vx: -dx * 0.04 + (trail.length % 2 === 0 ? 0.25 : -0.25),
            vy: -dy * 0.04 + (trail.length % 3 === 0 ? 0.25 : -0.25),
            alpha: Math.min(0.75, 0.25 + speed * 0.015),
            size: isPointerHover ? 2.1 : 1.5,
            isGold: trail.length % 3 !== 0,
          });
        }
        if (trail.length > 28) trail.splice(0, trail.length - 28);
      }

      prevX = mouseX;
      prevY = mouseY;

      const target = e.target as Element | null;
      isPointerHover = Boolean(target?.closest(INTERACTIVE_SELECTOR));
      isTextHover = !isPointerHover && Boolean(target?.closest(TEXT_INPUT_SELECTOR));
      updateVisualState();
      startLoop();
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      isPressed = true;
      updateVisualState();
      startLoop();
    };

    const handlePointerUp = () => {
      isPressed = false;
      updateVisualState();
      startLoop();
    };

    const handleMouseLeave = () => {
      isVisible = false;
      isPressed = false;
      updateVisualState();
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      disableCursorClass();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[10000] hidden overflow-hidden md:block"
    >
      {/* Micro Gold & Chrome Velocity Trail Canvas */}
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0" />

      {/* Soft Ambient Champagne-Gold Halo */}
      <div
        ref={glowRef}
        style={{ opacity: 0 }}
        className="fixed left-0 top-0 h-14 w-14 rounded-full bg-[radial-gradient(circle,rgba(252,170,48,0.22)_0%,rgba(255,255,255,0.08)_45%,transparent_72%)] transition-opacity duration-200 will-change-transform"
      />

      {/* Rotating Segmented Chrome-Gold Precision Bezel */}
      <div
        ref={ringRef}
        style={{ opacity: 0 }}
        className="fixed left-0 top-0 h-10 w-10 will-change-transform"
      >
        <svg viewBox="0 0 44 44" className="h-full w-full" fill="none">
          <circle
            cx="22"
            cy="22"
            r="19"
            stroke="rgba(203, 213, 225, 0.55)"
            strokeWidth="1.15"
            strokeDasharray="18 8 6 8"
            strokeLinecap="round"
          />
          <circle
            cx="22"
            cy="22"
            r="15.5"
            stroke="rgba(252, 170, 48, 0.78)"
            strokeWidth="1.2"
            strokeDasharray="10 14"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Precision Obsidian & Gold Pointer Arrow */}
      <div
        ref={arrowRef}
        style={{ opacity: 0 }}
        className="fixed left-0 top-0 origin-top-left drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] will-change-transform"
      >
        <svg
          width="23"
          height="23"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.5 2.5L19.8 11.1L12.3 13.1L9.6 20.4L3.5 2.5Z"
            fill="#0F0F0F"
            stroke="#FCAA30"
            strokeWidth="1.65"
            strokeLinejoin="round"
          />
          <circle cx="7.4" cy="7.6" r="1.2" fill="#FFFFFF" />
        </svg>
      </div>
    </div>
  );
}
