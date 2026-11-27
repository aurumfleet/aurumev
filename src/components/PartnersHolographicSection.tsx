"use client";

import { useEffect, useRef, useState } from "react";
import { ECOSYSTEM_PARTNERS, type EcosystemPartner } from "@/data/partners";
import { RevealOnScroll } from "@/components/MotionPrimitives";

// -------------------------------------------------
// Logo inner frame sizing
// -------------------------------------------------
function logoImgClasses(sizeHint: EcosystemPartner["sizeHint"]) {
  if (sizeHint === "square") return "h-10 w-10 sm:h-11 sm:w-11";
  if (sizeHint === "wide") return "h-9 w-[108px] sm:h-10 sm:w-[120px]";
  return "max-h-9 max-w-[130px] sm:max-h-10 sm:max-w-[150px]";
}

// -------------------------------------------------
// Main Section
// -------------------------------------------------
export function PartnersHolographicSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isPaused, setIsPaused] = useState(false);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [touchOffset, setTouchOffset] = useState(0);

  const touchStartXRef = useRef<number | null>(null);
  const baseTouchOffsetRef = useRef(0);
  const touchMovedRef = useRef(false);
  const lastPointerTypeRef = useRef<string>("mouse");

  // ---- RAF-based curved 3-D depth arc (no re-renders) ----
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      cardRefs.current.forEach((card) => {
        if (!card) return;
        card.style.transform = "perspective(1100px) translate3d(0,0,0) rotateY(0deg) scale(1)";
        card.style.opacity = "1";
      });
      return;
    }

    let rafId = 0;
    const updateCurve = () => {
      const stage = stageRef.current;
      if (stage) {
        const rect = stage.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const halfWidth = Math.max(rect.width / 2, 180);

        for (const card of cardRefs.current) {
          if (!card) continue;
          const isFocused = card.dataset.focused === "true";
          const isDimmed = card.dataset.dimmed === "true";
          const cRect = card.getBoundingClientRect();
          const rawNorm = (cRect.left + cRect.width / 2 - centerX) / halfWidth;
          const norm = Math.max(-1.2, Math.min(1.2, rawNorm));
          const absNorm = Math.min(1, Math.abs(norm));

          const tiltX = isFocused ? Number(card.dataset.tiltX || 0) : 0;
          const tiltY = isFocused ? Number(card.dataset.tiltY || 0) : -norm * 10;
          const scale = isFocused ? 1.07 : 1.01 - absNorm * 0.1;
          const tz = isFocused ? 28 : 10 - absNorm * 32;
          const ty = isFocused ? -4 : 0;

          card.style.transform = `perspective(1100px) translate3d(0,${ty}px,${tz.toFixed(1)}px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
          card.style.opacity = isFocused ? "1" : isDimmed ? "0.55" : (1 - absNorm * 0.2).toFixed(3);
        }
      }
      rafId = window.requestAnimationFrame(updateCurve);
    };
    rafId = window.requestAnimationFrame(updateCurve);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  // ---- Stage pointer ----
  const handleStagePointerLeave = () => {
    setIsPaused(false);
    setFocusedKey(null);
  };

  // ---- Card 3-D tilt + chrome glint ----
  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    el.dataset.tiltX = (-(ny - 0.5) * 12).toFixed(2);
    el.dataset.tiltY = ((nx - 0.5) * 14).toFixed(2);
    el.style.setProperty("--mx", `${(nx * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(ny * 100).toFixed(1)}%`);
  };

  // ---- Mobile swipe ----
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    touchStartXRef.current = e.touches[0].clientX;
    baseTouchOffsetRef.current = touchOffset;
    touchMovedRef.current = false;
    setIsPaused(true);
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return;
    touchMovedRef.current = true;
    const delta = e.touches[0].clientX - touchStartXRef.current;
    setTouchOffset(baseTouchOffsetRef.current + delta);
  };
  const handleTouchEnd = () => {
    touchStartXRef.current = null;
    if (!touchMovedRef.current) return;
    setTimeout(() => setIsPaused(false), 1800);
  };

  // Duplicate partners for seamless marquee
  const partners = [...ECOSYSTEM_PARTNERS, ...ECOSYSTEM_PARTNERS];

  return (
    <section
      aria-labelledby="partners-heading"
      className="relative overflow-hidden bg-[#060608] py-16 sm:py-20"
    >
      {/* ── Subtle obsidian chrome background texture ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(252,170,48,0.055) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(148,163,184,0.04) 0%, transparent 70%)",
        }}
      />

      {/* ── Top chrome edge line ── */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
      />

      <div className="aurum-container">
        {/* ── 1. Section Header ── */}
        <RevealOnScroll className="mb-10 text-center sm:mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#FCAA30]">
            Ecosystem Partners
          </p>
          <h2
            id="partners-heading"
            className="mt-3 font-display text-2xl font-semibold leading-tight tracking-[-0.025em] text-white sm:text-3xl"
          >
            Partners Who Believed In Us
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#94A3B8]">
            Aurum EV riders serve India&apos;s leading delivery and mobility platforms
            across Delhi-NCR.
          </p>

          {/* Gold-chrome divider */}
          <div
            aria-hidden="true"
            className="mx-auto mt-5 flex max-w-[200px] items-center gap-3"
          >
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C69A43]/50" />
            <span className="h-1.5 w-1.5 rotate-45 border border-[#C69A43]/60 bg-[#FCAA30]/30" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C69A43]/50" />
          </div>
        </RevealOnScroll>

        {/* ── 2. Chrome Card Marquee Ribbon ── */}
        <RevealOnScroll delayMs={60}>
          <div
            ref={stageRef}
            role="list"
            aria-label="Ecosystem partner logos"
            className="partner-holo-stage relative overflow-hidden"
            data-paused={isPaused ? "true" : undefined}
            onPointerLeave={handleStagePointerLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Edge fade masks */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#060608] to-transparent sm:w-24"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#060608] to-transparent sm:w-24"
            />

            {/* Scrolling track */}
            <div
              className="partner-marquee-track flex gap-4 pb-4 pt-2"
              data-paused={isPaused ? "true" : undefined}
              style={
                touchOffset !== 0
                  ? { transform: `translateX(${touchOffset}px)`, animationPlayState: "paused" }
                  : isPaused
                    ? { animationPlayState: "paused" }
                    : undefined
              }
            >
              {partners.map((partner, idx) => {
                const key = `${partner.id}-${idx}`;
                const isDuplicate = idx >= ECOSYSTEM_PARTNERS.length;
                const isCardFocused = focusedKey === key;
                const isCardDimmed = focusedKey !== null && !isCardFocused;

                return (
                  <div
                    role="listitem"
                    key={key}
                    ref={(el) => {
                      cardRefs.current[idx] = el;
                    }}
                    data-focused={isCardFocused ? "true" : "false"}
                    data-dimmed={isCardDimmed ? "true" : "false"}
                    style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
                    className="shrink-0 cursor-pointer"
                    onPointerEnter={() => {
                      lastPointerTypeRef.current = "mouse";
                    }}
                    onPointerMove={(e) => {
                      if (e.pointerType !== "mouse") return;
                      handleCardPointerMove(e);
                      if (!isCardFocused) {
                        setFocusedKey(key);
                        setIsPaused(true);
                      }
                    }}
                    onPointerLeave={() => {
                      cardRefs.current[idx]!.dataset.tiltX = "0";
                      cardRefs.current[idx]!.dataset.tiltY = "0";
                    }}
                    onClick={() => {
                      if (lastPointerTypeRef.current === "mouse") return;
                      setFocusedKey((prev) => {
                        const next = prev === key ? null : key;
                        setIsPaused(next !== null);
                        return next;
                      });
                    }}
                  >
                    {/* ── Dark anodized chrome card ── */}
                    <div
                      className={`relative flex h-[82px] min-w-[148px] items-center justify-center overflow-hidden rounded-2xl border p-[1.5px] transition-all duration-300 sm:h-[90px] sm:min-w-[164px] ${
                        isCardFocused
                          ? "border-transparent shadow-[0_20px_48px_rgba(252,170,48,0.22),0_6px_18px_rgba(0,0,0,0.5)]"
                          : "border-transparent shadow-[0_6px_20px_rgba(0,0,0,0.38)]"
                      }`}
                      style={{
                        background: isCardFocused
                          ? "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(148,163,184,0.22) 25%, rgba(255,255,255,0.72) 48%, rgba(252,170,48,0.42) 72%, rgba(203,213,225,0.32) 100%)"
                          : "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(148,163,184,0.06) 30%, rgba(255,255,255,0.18) 55%, rgba(252,170,48,0.1) 78%, rgba(148,163,184,0.08) 100%)",
                      }}
                    >
                      {/* Inner obsidian surface */}
                      <div
                        className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[calc(1rem-1.5px)]"
                        style={{
                          background:
                            "linear-gradient(145deg, #1E2126 0%, #12141A 42%, #0A0B0E 76%, #181B20 100%)",
                        }}
                      >
                        {/* Top specular chrome horizon */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/[0.09] to-transparent"
                        />

                        {/* Cursor-reactive gold shimmer */}
                        {isCardFocused && (
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0"
                            style={{
                              background:
                                "radial-gradient(110px circle at var(--mx) var(--my), rgba(252,170,48,0.22), rgba(198,154,67,0.06) 55%, transparent 78%)",
                            }}
                          />
                        )}

                        {/* Diagonal chrome sweep */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 overflow-hidden"
                        >
                          <div
                            className="h-full w-1/2 motion-safe:animate-[partnerGoldSweep_5s_ease-in-out_infinite]"
                            style={{
                              background:
                                "linear-gradient(110deg, transparent 15%, rgba(255,255,255,0.1) 48%, rgba(252,170,48,0.09) 55%, transparent 85%)",
                            }}
                          />
                        </div>

                        {/* Logo image */}
                        <div className="relative z-10 flex items-center justify-center px-5">
                          <img
                            src={partner.logoUrl}
                            alt={isDuplicate ? "" : partner.alt}
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                            className={`select-none object-contain transition-all duration-300 ${logoImgClasses(partner.sizeHint)} ${isCardFocused ? "scale-105 brightness-110" : "opacity-90 brightness-100"}`}
                            style={
                              partner.tileBackdrop
                                ? {
                                    borderRadius: "6px",
                                    backgroundColor: partner.tileBackdrop,
                                    padding: "4px 8px",
                                  }
                                : undefined
                            }
                          />
                        </div>

                        {/* Partner name micro-tag revealed on focus */}
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none absolute bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.14em] transition-all duration-200 ${
                            isCardFocused
                              ? "opacity-100 text-[#F5CF7E]"
                              : "opacity-0 text-transparent"
                          }`}
                        >
                          {partner.name}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>

        {/* ── 3. Bottom statement ── */}
        <RevealOnScroll delayMs={120} className="mt-8 text-center sm:mt-10">
          <p className="font-display text-sm font-medium tracking-[-0.01em] text-[#94A3B8] sm:text-base">
            Together, moving towards a smarter electric future.
          </p>
          <div
            aria-hidden="true"
            className="mx-auto mt-4 flex max-w-md items-center gap-3"
          >
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C69A43]/40" />
            <span className="h-1.5 w-1.5 rotate-45 border border-[#C69A43]/50 bg-[#FCAA30]/25" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C69A43]/40" />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
