"use client";

import { useEffect, useRef, useState } from "react";
import { ECOSYSTEM_PARTNERS, type EcosystemPartner } from "@/data/partners";
import { RevealOnScroll } from "@/components/MotionPrimitives";

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

  // Subtle curved 3D depth arc + cursor-driven 3D magnetic card tilt
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      cardRefs.current.forEach((card) => {
        if (!card) return;
        card.style.transform =
          "perspective(1100px) translate3d(0,0,0) rotateY(0deg) scale(1)";
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
          const tiltY = isFocused ? Number(card.dataset.tiltY || 0) : -norm * 9;
          const scale = isFocused ? 1.07 : 1.01 - absNorm * 0.08;
          const tz = isFocused ? 28 : 10 - absNorm * 28;
          const ty = isFocused ? -5 : 0;

          card.style.transform = `perspective(1100px) translate3d(0,${ty}px,${tz.toFixed(
            1
          )}px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(
            2
          )}deg) scale(${scale.toFixed(3)})`;
          card.style.opacity = isFocused
            ? "1"
            : isDimmed
              ? "0.62"
              : (1 - absNorm * 0.14).toFixed(3);
        }
      }
      rafId = window.requestAnimationFrame(updateCurve);
    };

    rafId = window.requestAnimationFrame(updateCurve);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const handleStagePointerLeave = () => {
    setIsPaused(false);
    setFocusedKey(null);
  };

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

  const midpoint = Math.ceil(ECOSYSTEM_PARTNERS.length / 2);
  const rowOneBase = ECOSYSTEM_PARTNERS.slice(0, midpoint);
  const rowTwoBase = ECOSYSTEM_PARTNERS.slice(midpoint);
  const rowOnePartners = [...rowOneBase, ...rowOneBase, ...rowOneBase, ...rowOneBase];
  const rowTwoPartners = [...rowTwoBase, ...rowTwoBase, ...rowTwoBase, ...rowTwoBase];

  const renderPartnerCard = (
    partner: EcosystemPartner,
    idx: number,
    rowTag: "r1" | "r2",
    baseLen: number
  ) => {
    const refIndex = rowTag === "r1" ? idx : rowOnePartners.length + idx;
    const key = `${rowTag}-${partner.id}-${idx}`;
    const isDuplicate = idx >= baseLen;
    const isCardFocused = focusedKey === key;
    const isCardDimmed = focusedKey !== null && !isCardFocused;

    return (
      <div
        role="listitem"
        key={key}
        ref={(el) => {
          cardRefs.current[refIndex] = el;
        }}
        data-focused={isCardFocused ? "true" : "false"}
        data-dimmed={isCardDimmed ? "true" : "false"}
        style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
        className="relative shrink-0 cursor-pointer"
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
          const card = cardRefs.current[refIndex];
          if (card) {
            card.dataset.tiltX = "0";
            card.dataset.tiltY = "0";
          }
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
        {/* 2px Brushed-Chrome Metallic Bevel Frame */}
        <div
          className={`relative h-[88px] w-[176px] rounded-2xl p-[2px] transition-shadow duration-300 sm:h-[96px] sm:w-[192px] ${
            isCardFocused
              ? "shadow-[0_20px_44px_rgba(198,154,67,0.28),0_8px_18px_rgba(15,15,15,0.08)]"
              : "shadow-[0_10px_28px_rgba(15,15,15,0.07),0_2px_6px_rgba(15,15,15,0.04)]"
          }`}
          style={{
            background: isCardFocused
              ? "linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 24%, #FFFFFF 48%, #FCAA30 74%, #9E7524 100%)"
              : "linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 30%, #F8FAFC 55%, #94A3B8 82%, #E2E8F0 100%)",
          }}
        >
          {/* Inner Brand Tile */}
          <div
            className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[calc(1rem-2px)]"
            style={{
              backgroundColor: partner.tileBackdrop ?? "#FFFFFF",
            }}
          >
            <img
              src={partner.logoUrl}
              alt={isDuplicate ? "" : partner.alt}
              loading="lazy"
              decoding="async"
              draggable={false}
              className={`select-none transition-transform duration-300 ${
                partner.fit === "cover"
                  ? "h-full w-full object-cover"
                  : "h-full w-full object-contain px-5 py-3"
              } ${isCardFocused ? "scale-[1.05]" : ""}`}
            />

            {/* Subtle Top Chrome Glass Specular Sheen */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/25 to-transparent"
            />

            {/* Pointer-Tracked Liquid Chrome Highlight */}
            {isCardFocused && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(130px circle at var(--mx) var(--my), rgba(255,255,255,0.34), rgba(252,170,48,0.12) 55%, transparent 80%)",
                }}
              />
            )}

            {/* Diagonal Chrome Sweep */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <div
                className="h-full w-1/2 motion-safe:animate-[partnerGoldSweep_5.5s_ease-in-out_infinite]"
                style={{
                  background:
                    "linear-gradient(110deg, transparent 15%, rgba(255,255,255,0.38) 48%, rgba(252,170,48,0.14) 55%, transparent 85%)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Floating Partner Name Micro-Tag on Focus */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -bottom-3 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#C69A43]/50 bg-[#0F0F0F] px-2.5 py-[2px] text-[9px] font-semibold uppercase tracking-[0.14em] text-[#F5CF7E] shadow-md transition-all duration-200 ${
            isCardFocused
              ? "translate-y-0 opacity-100"
              : "translate-y-1 opacity-0"
          }`}
        >
          {partner.name}
        </span>
      </div>
    );
  };

  return (
    <section
      id="ecosystem-partners"
      aria-labelledby="partners-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#F8F9FB] via-white to-[#F4F6F9] py-16 sm:py-20"
    >
      {/* Subtle brushed-chrome ambient radial sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% 0%, rgba(252,170,48,0.06) 0%, transparent 65%), radial-gradient(ellipse 65% 45% at 50% 100%, rgba(148,163,184,0.09) 0%, transparent 70%)",
        }}
      />

      {/* Top & bottom hairline metallic dividers */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#CBD5E1] to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#CBD5E1] to-transparent"
      />

      <div className="aurum-container relative z-10">
        {/* 1. Section Header */}
        <RevealOnScroll className="mb-10 text-center sm:mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#9E7524]">
            Ecosystem Partners
          </p>
          <h2
            id="partners-heading"
            className="mt-2.5 font-display text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#0F0F0F] sm:text-3xl"
          >
            Partners Who Believed In Us
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#52525B]">
            Aurum EV riders serve India&apos;s leading delivery and mobility
            platforms across Delhi-NCR.
          </p>

          {/* Gold-chrome accent divider */}
          <div
            aria-hidden="true"
            className="mx-auto mt-5 flex max-w-[200px] items-center gap-3"
          >
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C69A43]/60" />
            <span className="h-1.5 w-1.5 rotate-45 border border-[#C69A43] bg-[#FCAA30]/40" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C69A43]/60" />
          </div>
        </RevealOnScroll>

        {/* 2. Light Brushed-Chrome 3D Marquee Ribbon */}
        <RevealOnScroll delayMs={60}>
          <div
            ref={stageRef}
            role="list"
            aria-label="Ecosystem partner logos"
            className="partner-holo-stage partner-perspective relative overflow-hidden py-3"
            data-paused={isPaused ? "true" : undefined}
            onPointerLeave={handleStagePointerLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Soft light-chrome edge fade masks */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-[#FAFBFD] to-transparent sm:w-24"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-[#FAFBFD] to-transparent sm:w-24"
            />

            {/* Row 1: Slides Left (RTL) */}
            <div
              className="partner-marquee-track flex w-max gap-5 pb-4 pt-2"
              data-paused={isPaused ? "true" : undefined}
              style={
                touchOffset !== 0
                  ? {
                      transform: `translateX(${touchOffset}px)`,
                      animationPlayState: "paused",
                    }
                  : isPaused
                    ? { animationPlayState: "paused" }
                    : undefined
              }
            >
              {rowOnePartners.map((partner, idx) =>
                renderPartnerCard(partner, idx, "r1", rowOneBase.length)
              )}
            </div>

            {/* Row 2: Slides Opposite Right (LTR) */}
            <div
              className="partner-marquee-track-reverse flex w-max gap-5 pb-5 pt-2"
              data-paused={isPaused ? "true" : undefined}
              style={
                touchOffset !== 0
                  ? {
                      transform: `translateX(${-touchOffset}px)`,
                      animationPlayState: "paused",
                    }
                  : isPaused
                    ? { animationPlayState: "paused" }
                    : undefined
              }
            >
              {rowTwoPartners.map((partner, idx) =>
                renderPartnerCard(partner, idx, "r2", rowTwoBase.length)
              )}
            </div>
          </div>
        </RevealOnScroll>

        {/* 3. Bottom Statement */}
        <RevealOnScroll delayMs={120} className="mt-6 text-center sm:mt-8">
          <p className="font-display text-sm font-medium tracking-[-0.01em] text-[#1A1A1A] sm:text-base">
            Together, moving towards a smarter electric future.
          </p>
          <div
            aria-hidden="true"
            className="mx-auto mt-3.5 flex max-w-md items-center gap-3"
          >
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C69A43]/60" />
            <span className="h-1.5 w-1.5 rotate-45 border border-[#C69A43] bg-[#FCAA30]/40" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C69A43]/60" />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
