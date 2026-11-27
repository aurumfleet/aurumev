"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], select, summary, label[for], input[type="checkbox"], input[type="radio"], input[type="range"], [data-cursor="pointer"]';
const TEXT_INPUT_SELECTOR =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"]), textarea, [contenteditable="true"]';

export function AurumCustomCursor() {
  const arrowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const arrow = arrowRef.current;
    const ring = ringRef.current;
    if (!arrow || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let ringScale = 1;
    let targetScale = 1;
    let isVisible = false;
    let isPointerHover = false;
    let isTextHover = false;
    let isPressed = false;
    let rafId = 0;

    const enableCursorClass = () => {
      document.documentElement.classList.add("aurum-custom-cursor");
    };

    const disableCursorClass = () => {
      document.documentElement.classList.remove("aurum-custom-cursor");
    };

    const updateRingVisuals = () => {
      if (isPressed) {
        targetScale = 0.78;
      } else if (isPointerHover) {
        targetScale = 1.45;
      } else if (isTextHover) {
        targetScale = 0.65;
      } else {
        targetScale = 1;
      }

      ring.style.borderColor = isPointerHover
        ? "rgba(252, 170, 48, 0.92)"
        : "rgba(203, 213, 225, 0.75)";
      ring.style.backgroundColor = isPointerHover
        ? "rgba(252, 170, 48, 0.10)"
        : "transparent";
      arrow.style.opacity = isVisible ? (isTextHover ? "0.45" : "1") : "0";
      ring.style.opacity = isVisible ? "1" : "0";
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      ringScale += (targetScale - ringScale) * 0.22;

      arrow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(${
        isPressed ? 0.88 : 1
      })`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale.toFixed(
        3
      )})`;

      if (isVisible) {
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
        updateRingVisuals();
        return;
      }

      if (!isVisible) {
        isVisible = true;
        ringX = e.clientX;
        ringY = e.clientY;
        enableCursorClass();
      }

      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target as Element | null;
      isPointerHover = Boolean(target?.closest(INTERACTIVE_SELECTOR));
      isTextHover = !isPointerHover && Boolean(target?.closest(TEXT_INPUT_SELECTOR));
      updateRingVisuals();
      startLoop();
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      isPressed = true;
      updateRingVisuals();
      startLoop();
    };

    const handlePointerUp = () => {
      isPressed = false;
      updateRingVisuals();
      startLoop();
    };

    const handleMouseLeave = () => {
      isVisible = false;
      isPressed = false;
      updateRingVisuals();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      disableCursorClass();
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
      {/* Trailing Brushed-Chrome & Gold Halo Ring */}
      <div
        ref={ringRef}
        style={{ opacity: 0 }}
        className="fixed left-0 top-0 h-8 w-8 rounded-full border-[1.5px] border-[#CBD5E1]/75 shadow-[0_0_16px_rgba(252,170,48,0.18)] transition-colors duration-150 will-change-transform"
      />

      {/* Precision Obsidian & Gold Pointer Arrow */}
      <div
        ref={arrowRef}
        style={{ opacity: 0 }}
        className="fixed left-0 top-0 origin-top-left drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] will-change-transform"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.5 2.5L19.5 11.2L12.2 13.1L9.6 20.2L3.5 2.5Z"
            fill="#0F0F0F"
            stroke="#FCAA30"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="7.4" cy="7.6" r="1.15" fill="#FFFFFF" />
        </svg>
      </div>
    </div>
  );
}
