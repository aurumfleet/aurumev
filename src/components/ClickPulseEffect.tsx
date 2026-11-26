"use client";

import { useEffect, useState } from "react";

interface ClickPulse {
  id: number;
  x: number;
  y: number;
}

export function ClickPulseEffect() {
  const [pulses, setPulses] = useState<ClickPulse[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let nextId = 1;

    const handlePointerDown = (e: PointerEvent) => {
      // Only respond to primary mouse button or touch tap
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const id = nextId++;
      const pulse: ClickPulse = { id, x: e.clientX, y: e.clientY };

      setPulses((prev) => [...prev.slice(-5), pulse]);
      window.setTimeout(() => {
        setPulses((prev) => prev.filter((p) => p.id !== id));
      }, 580);
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  if (pulses.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      {pulses.map((p) => (
        <div
          key={p.id}
          style={{ left: p.x, top: p.y }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
        >
          {/* Outer Expanding Champagne Ring */}
          <span className="block h-14 w-14 rounded-full border border-[#FCAA30]/85 animate-[clickRingExpand_560ms_cubic-bezier(0.22,1,0.36,1)_forwards]" />
          {/* Inner Warm Optical Flash */}
          <span className="absolute left-1/2 top-1/2 block h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(252,170,48,0.65)_0%,rgba(255,255,255,0.45)_45%,transparent_75%)] animate-[clickCoreBurst_420ms_cubic-bezier(0.22,1,0.36,1)_forwards]" />
        </div>
      ))}
    </div>
  );
}
