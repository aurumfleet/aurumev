"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  direction?: "up" | "left" | "right" | "none";
}

export function RevealOnScroll({
  children,
  className = "",
  delayMs = 0,
  direction = "up",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.02, rootMargin: "0px 0px 60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenTransform =
    direction === "up"
      ? "translate-y-7"
      : direction === "left"
      ? "-translate-x-7"
      : direction === "right"
      ? "translate-x-7"
      : "";

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delayMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
      }}
      className={`transition-all duration-700 ${
        visible ? "translate-x-0 translate-y-0 opacity-100" : `${hiddenTransform} opacity-0`
      } ${className}`}
    >
      {children}
    </div>
  );
}
