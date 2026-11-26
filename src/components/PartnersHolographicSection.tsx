"use client";

import { useEffect, useRef, useState } from "react";
import { ECOSYSTEM_PARTNERS, type EcosystemPartner } from "@/data/partners";
import { RevealOnScroll } from "@/components/MotionPrimitives";

function logoFrameClasses(sizeHint: EcosystemPartner["sizeHint"]) {
  if (sizeHint === "square") {
    return "h-11 w-11 rounded-xl sm:h-12 sm:w-12";
  }
  if (sizeHint === "wide") {
    return "h-11 w-[112px] rounded-lg sm:h-12 sm:w-[126px]";
  }
  return "max-h-10 max-w-[144px] sm:max-h-11 sm:max-w-[162px]";
}

export function PartnersHolographicSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isPaused, setIsPaused] = useState(false);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [touchOffset, setTouchOffset] = useState(0);

  const touchStartXRef = useRef<number | null>(null);
  const baseTouchOffsetRef = useRef(0);
  const touchMovedRef = useRef(false);
  const lastPointerTypeRef = useRef<string>("mouse");

  // Subtle curved 3D depth arc + cursor-driven 3D magnetic card tilt (zero React re-renders)
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      cardRefs.current.forEach((card) => {
        if (!card) return;
        card.style.transform = "perspective(1100px) translate3d(0, 0, 0) rotateY(0deg) scale(1)";
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
          const isCardFocused = card.dataset.focused === "true";
          const isCardDimmed = card.dataset.dimmed === "true";
          const cRect = card.getBoundingClientRect();
          const cCenter = cRect.left + cRect.width / 2;
          const rawNorm = (cCenter - centerX) / halfWidth;
          const norm = Math.max(-1.2, Math.min(1.2, rawNorm));
          const absNorm = Math.min(1, Math.abs(norm));

          const tiltX = isCardFocused ? Number(card.dataset.tiltX || 0) : 0;
          const tiltY = isCardFocused ? Number(card.dataset.tiltY || 0) : -norm * 11;

          const scale = isCardFocused ? 1.08 : 1.02 - absNorm * 0.11;
          const tz = isCardFocused ? 30 : 12 - absNorm * 38;
          const ty = isCardFocused ? -5 : 0;

          card.style.transform = `perspective(1100px) translate3d(0, ${ty}px, ${tz.toFixed(
            1,
          )}px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale(${scale.toFixed(
            3,
          )})`;
          card.style.opacity = isCardFocused
            ? "1"
            : isCardDimmed
              ? "0.62"
              : (1 - absNorm * 0.18).toFixed(3);
        }
      }

      rafId = window.requestAnimationFrame(updateCurve);
    };

    rafId = window.requestAnimationFrame(updateCurve);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  // Liquid-gold aura follows mouse seamlessly across ribbon
  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!stageRef.current || !auraRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    auraRef.current.style.opacity = "1";
    auraRef.current.style.transform = `translate3d(${x - 160}px, ${y - 160}px, 0)`;
  };

  const handleStagePointerLeave = () => {
    setIsPaused(false);
    setFocusedKey(null);
    if (auraRef.current) {
      auraRef.current.style.opacity = "0";
    }
  };

  // Interactive 3D tilt + gold optical prism glint inside focused card
  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;

    const tiltY = (nx - 0.5) * 14;
    const tiltX = -(ny - 0.5) * 12;

    el.dataset.tiltX = tiltX.toFixed(2);
    el.dataset.tiltY = tiltY.toFixed(2);
    el.style.setProperty("--mx", `${(nx * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(ny * 100).toFixed(1)}%`);
  };

  // Mobile horizontal swipe & touch prism tracking
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    touchStartXRef.current = e.touches[0].clientX;
    baseTouchOffsetRef.current = touchOffset;
    touchMovedRef.current = false;
    setIsPaused(true);

    if (stageRef.current && auraRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      auraRef.current.style.opacity = "0.95";
      auraRef.current.style.transform = `translate3d(${x - 160}px, ${y - 160}px, 0)`;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 6) {
      touchMovedRef.current = true;
    }
    const clamped = Math.max(-220, Math.min(220, baseTouchOffsetRef.current + deltaX));
    setTouchOffset(clamped);

    if (stageRef.current && auraRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      auraRef.current.style.transform = `translate3d(${x - 160}px, ${y - 160}px, 0)`;
    }
  };

  const handleTouchEnd = () => {
    touchStartXRef.current = null;
    setTouchOffset(0);
    if (auraRef.current) {
      auraRef.current.style.opacity = "0";
    }
    if (touchMovedRef.current) {
      setIsPaused(false);
      setFocusedKey(null);
    }
  };

  const loopedPartners = [...ECOSYSTEM_PARTNERS, ...ECOSYSTEM_PARTNERS];

  return (
    <section
      id="ecosystem-partners"
      aria-labelledby="partners-heading"
      className="relative overflow-hidden bg-white py-20 text-[#0F0F0F] sm:py-28"
    >
      <div className="aurum-container relative z-10">
        {/* 1. Section Header */}
        <RevealOnScroll className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C69A43]/30 bg-[#FAF7F0] px-3.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C69A43]" aria-hidden="true" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9E7524]">
              OUR ECOSYSTEM
            </span>
          </div>

          <h2
            id="partners-heading"
            className="mt-5 font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-[#0F0F0F] sm:text-5xl lg:text-[54px]"
          >
            Partners Who{" "}
            <span className="bg-gradient-to-r from-[#8E671D] via-[#D4A64A] to-[#8E671D] bg-clip-text text-transparent">
              Believed In Us
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#4E5154] sm:text-lg">
            Building connections that move India&apos;s electric mobility ecosystem forward.
          </p>
        </RevealOnScroll>

        {/* 2. Minimalist Sleek 3D Ribbon Directly on Pure White Background */}
        <RevealOnScroll delayMs={80} className="mt-8 sm:mt-12">
          <div
            ref={stageRef}
            data-paused={isPaused ? "true" : "false"}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") setIsPaused(true);
            }}
            onPointerMove={handleStagePointerMove}
            onPointerLeave={handleStagePointerLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            className="partner-holo-stage partner-perspective relative mx-auto select-none py-6 sm:py-8"
            role="region"
            aria-roledescription="carousel"
            aria-label="Electric mobility ecosystem brands"
          >
            {/* Subtle metallic-gold light thread behind floating badges */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#C69A43]/30 to-transparent sm:inset-x-20"
            />

            {/* Liquid-gold pointer/touch aura tracking across pure white background */}
            <div
              ref={auraRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-0 h-[320px] w-[320px] rounded-full opacity-0 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(circle, rgba(252,170,48,0.2) 0%, rgba(198,154,67,0.08) 45%, transparent 72%)",
                filter: "blur(16px)",
              }}
            />

            {/* Seamless pure-white edge dissolve masks */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-20 w-10 bg-gradient-to-r from-white via-white/90 to-transparent sm:w-28"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-gradient-to-l from-white via-white/90 to-transparent sm:w-28"
            />

            {/* Infinite Right-to-Left Sleek Pearl-Glass Badges */}
            <div
              className="relative z-10 overflow-hidden py-7 transition-transform duration-200 ease-out"
              style={{ transform: `translate3d(${touchOffset}px, 0, 0)` }}
            >
              <div className="partner-marquee-track flex w-max items-center">
                {loopedPartners.map((partner, idx) => {
                  const key = `${partner.id}-${idx}`;
                  const isDuplicate = idx >= ECOSYSTEM_PARTNERS.length;
                  const isCardFocused = focusedKey === key;
                  const isDimmed = focusedKey !== null && !isCardFocused;

                  return (
                    <div
                      key={key}
                      aria-hidden={isDuplicate ? "true" : undefined}
                      className="w-[172px] shrink-0 px-2 sm:w-[198px] sm:px-2.5"
                    >
                      <div
                        ref={(el) => {
                          cardRefs.current[idx] = el;
                        }}
                        data-focused={isCardFocused ? "true" : "false"}
                        data-dimmed={isDimmed ? "true" : "false"}
                        data-tilt-x="0"
                        data-tilt-y="0"
                        onPointerDown={(e) => {
                          lastPointerTypeRef.current = e.pointerType;
                        }}
                        onPointerEnter={(e) => {
                          lastPointerTypeRef.current = e.pointerType;
                          if (e.pointerType === "mouse") {
                            setFocusedKey(key);
                            setIsPaused(true);
                          }
                        }}
                        onPointerMove={handleCardPointerMove}
                        onPointerLeave={(e) => {
                          if (e.pointerType === "mouse") {
                            e.currentTarget.dataset.tiltX = "0";
                            e.currentTarget.dataset.tiltY = "0";
                            setFocusedKey((prev) => (prev === key ? null : prev));
                          }
                        }}
                        onClick={() => {
                          if (lastPointerTypeRef.current === "mouse") {
                            setFocusedKey(key);
                            setIsPaused(true);
                            return;
                          }
                          setFocusedKey((prev) => {
                            const next = prev === key ? null : key;
                            setIsPaused(next !== null);
                            return next;
                          });
                        }}
                        style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
                        className="group relative cursor-pointer"
                      >
                        <div
                          className={`relative flex h-[76px] w-full items-center justify-center overflow-hidden rounded-2xl border bg-white/95 px-4 transition-[border-color,box-shadow] duration-300 sm:h-[84px] ${
                            isCardFocused
                              ? "border-[#C69A43] shadow-[0_18px_42px_rgba(198,154,67,0.24),0_6px_16px_rgba(15,15,15,0.06)]"
                              : "border-[#0F0F0F]/10 shadow-[0_8px_24px_rgba(15,15,15,0.045),inset_0_1px_0_rgba(255,255,255,1)]"
                          }`}
                        >
                          {/* Cursor-reactive champagne-gold refraction shimmer */}
                          <div
                            aria-hidden="true"
                            className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
                              isCardFocused ? "opacity-100" : "opacity-0"
                            }`}
                            style={{
                              background:
                                "radial-gradient(130px circle at var(--mx) var(--my), rgba(252,170,48,0.18), rgba(198,154,67,0.05) 55%, transparent 78%)",
                            }}
                          />

                          {/* Clean Framed Brand Logo */}
                          <div
                            className={`relative z-10 flex items-center justify-center overflow-hidden transition-transform duration-300 ${
                              isCardFocused ? "scale-[1.06]" : ""
                            } ${logoFrameClasses(partner.sizeHint)}`}
                            style={
                              partner.tileBackdrop
                                ? { backgroundColor: partner.tileBackdrop }
                                : undefined
                            }
                          >
                            <img
                              src={partner.logoUrl}
                              alt={isDuplicate ? "" : partner.alt}
                              loading="lazy"
                              decoding="async"
                              draggable={false}
                              className="h-full w-full object-contain select-none"
                            />
                          </div>
                        </div>

                        {/* Subtle floating micro-tag below glass pill revealed only on hover/tap */}
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none absolute -bottom-3 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#C69A43]/40 bg-[#0F0F0F] px-2.5 py-[2px] text-[9px] font-semibold uppercase tracking-[0.14em] text-[#F5CF7E] shadow-sm transition-all duration-200 ${
                            isCardFocused
                              ? "translate-y-0 opacity-100"
                              : "translate-y-1 opacity-0"
                          }`}
                        >
                          {partner.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* 3. Section Bottom Statement & Subtle Metallic Gold Divider */}
        <RevealOnScroll delayMs={120} className="mt-4 text-center sm:mt-6">
          <p className="font-display text-lg font-medium tracking-[-0.015em] text-[#1A1A1A] sm:text-xl">
            Together, Moving Towards a Smarter Electric Future.
          </p>

          <div
            aria-hidden="true"
            className="mx-auto mt-6 flex max-w-md items-center justify-center gap-3"
          >
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C69A43]/60" />
            <span className="h-2 w-2 rotate-45 border border-[#C69A43] bg-[#FCAA30]/40" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C69A43]/60" />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
