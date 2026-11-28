"use client";

import { useEffect, useRef, useState } from "react";
import { ECOSYSTEM_PARTNERS, type EcosystemPartner } from "@/data/partners";
import { RevealOnScroll } from "@/components/MotionPrimitives";

interface CardPhysics {
  tx: number;
  ty: number;
  tz: number;
  rx: number;
  ry: number;
  scale: number;
  opacity: number;
}

export function PartnersHolographicSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const logoRefs = useRef<(HTMLImageElement | null)[]>([]);
  const physicsRef = useRef<Record<number, CardPhysics>>({});
  const focusedTargetRef = useRef<{ row: "r1" | "r2"; idx: number } | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [touchOffset, setTouchOffset] = useState(0);

  const touchStartXRef = useRef<number | null>(null);
  const baseTouchOffsetRef = useRef(0);
  const touchMovedRef = useRef(false);
  const lastPointerTypeRef = useRef<string>("mouse");

  // Smooth spring-damped 3D depth arc + magnetic neighbor repulsion + 3D parallax logo lift
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
        const activeFocus = focusedTargetRef.current;

        for (let i = 0; i < cardRefs.current.length; i++) {
          const card = cardRefs.current[i];
          if (!card) continue;

          const isFocused = card.dataset.focused === "true";
          const isDimmed = card.dataset.dimmed === "true";
          const row = card.dataset.row as "r1" | "r2" | undefined;
          const rowIdx = Number(card.dataset.idx ?? -1);

          const cRect = card.getBoundingClientRect();
          const rawNorm = (cRect.left + cRect.width / 2 - centerX) / halfWidth;
          const norm = Math.max(-1.2, Math.min(1.2, rawNorm));
          const absNorm = Math.min(1, Math.abs(norm));

          // Magnetic repulsion ripple along the active row when a card levitates
          let repelX = 0;
          let repelTiltY = 0;
          if (activeFocus && row === activeFocus.row && !isFocused && rowIdx >= 0) {
            const delta = rowIdx - activeFocus.idx;
            if (Math.abs(delta) === 1) {
              repelX = delta * 12;
              repelTiltY = -delta * 5;
            } else if (Math.abs(delta) === 2) {
              repelX = Math.sign(delta) * 5;
              repelTiltY = -Math.sign(delta) * 2;
            }
          }

          const targetRx = isFocused ? Number(card.dataset.tiltX || 0) : 0;
          const targetRy = isFocused
            ? Number(card.dataset.tiltY || 0)
            : -norm * 8 + repelTiltY;
          const targetScale = isFocused
            ? 1.13
            : isDimmed
              ? 0.955 - absNorm * 0.04
              : 1.01 - absNorm * 0.07;
          const targetTz = isFocused ? 46 : isDimmed ? -8 : 10 - absNorm * 24;
          const targetTy = isFocused ? -9 : 0;
          const targetTx = repelX;
          const targetOpacity = isFocused
            ? 1
            : isDimmed
              ? 0.52
              : 1 - absNorm * 0.14;

          const prev =
            physicsRef.current[i] ??
            (physicsRef.current[i] = {
              tx: targetTx,
              ty: targetTy,
              tz: targetTz,
              rx: targetRx,
              ry: targetRy,
              scale: targetScale,
              opacity: targetOpacity,
            });

          const lerp = isFocused ? 0.22 : 0.14;
          prev.tx += (targetTx - prev.tx) * lerp;
          prev.ty += (targetTy - prev.ty) * lerp;
          prev.tz += (targetTz - prev.tz) * lerp;
          prev.rx += (targetRx - prev.rx) * lerp;
          prev.ry += (targetRy - prev.ry) * lerp;
          prev.scale += (targetScale - prev.scale) * lerp;
          prev.opacity += (targetOpacity - prev.opacity) * 0.16;

          card.style.transform = `perspective(1200px) translate3d(${prev.tx.toFixed(
            2
          )}px,${prev.ty.toFixed(2)}px,${prev.tz.toFixed(1)}px) rotateX(${prev.rx.toFixed(
            2
          )}deg) rotateY(${prev.ry.toFixed(2)}deg) scale(${prev.scale.toFixed(3)})`;
          card.style.opacity = prev.opacity.toFixed(3);
          card.style.zIndex = isFocused ? "40" : isDimmed ? "5" : "10";

          // Inner 3D logo depth parallax pop
          const logoEl = logoRefs.current[i];
          if (logoEl) {
            if (isFocused) {
              const lpx = Number(card.dataset.logoPx || 0);
              const lpy = Number(card.dataset.logoPy || 0);
              logoEl.style.transform = `translate3d(${lpx.toFixed(1)}px, ${lpy.toFixed(
                1
              )}px, 0) scale(1.09)`;
            } else {
              logoEl.style.transform = "translate3d(0px, 0px, 0) scale(1)";
            }
          }
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
    focusedTargetRef.current = null;
  };

  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    el.dataset.tiltX = (-(ny - 0.5) * 18).toFixed(2);
    el.dataset.tiltY = ((nx - 0.5) * 20).toFixed(2);
    el.dataset.logoPx = ((nx - 0.5) * 7).toFixed(2);
    el.dataset.logoPy = ((ny - 0.5) * 5).toFixed(2);
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
        data-row={rowTag}
        data-idx={idx}
        data-focused={isCardFocused ? "true" : "false"}
        data-dimmed={isCardDimmed ? "true" : "false"}
        style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
        className="relative shrink-0 cursor-pointer will-change-transform"
        onPointerEnter={() => {
          lastPointerTypeRef.current = "mouse";
        }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          handleCardPointerMove(e);
          if (!isCardFocused) {
            focusedTargetRef.current = { row: rowTag, idx };
            setFocusedKey(key);
            setIsPaused(true);
          }
        }}
        onPointerLeave={() => {
          const card = cardRefs.current[refIndex];
          if (card) {
            card.dataset.tiltX = "0";
            card.dataset.tiltY = "0";
            card.dataset.logoPx = "0";
            card.dataset.logoPy = "0";
          }
          if (
            focusedTargetRef.current?.row === rowTag &&
            focusedTargetRef.current?.idx === idx
          ) {
            focusedTargetRef.current = null;
          }
        }}
        onClick={() => {
          if (lastPointerTypeRef.current === "mouse") return;
          setFocusedKey((prev) => {
            const next = prev === key ? null : key;
            focusedTargetRef.current = next ? { row: rowTag, idx } : null;
            setIsPaused(next !== null);
            return next;
          });
        }}
      >
        {/* Ambient Holographic Gold Aura Glow Underneath on Focus */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -inset-2 -z-10 rounded-3xl transition-all duration-300 ${
            isCardFocused ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
          style={{
            background:
              "radial-gradient(ellipse at 50% 55%, rgba(252,170,48,0.42), rgba(6,103,244,0.16) 55%, transparent 75%)",
            filter: "blur(12px)",
          }}
        />

        {/* Precision Magnetic Gold Corner Target Brackets */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -inset-1.5 z-30 transition-all duration-300 ${
            isCardFocused ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <span className="absolute left-0 top-0 h-3 w-3 rounded-tl-md border-l-2 border-t-2 border-[#FCAA30]" />
          <span className="absolute right-0 top-0 h-3 w-3 rounded-tr-md border-r-2 border-t-2 border-[#FCAA30]" />
          <span className="absolute bottom-0 left-0 h-3 w-3 rounded-bl-md border-b-2 border-l-2 border-[#FCAA30]" />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-br-md border-b-2 border-r-2 border-[#FCAA30]" />
        </div>

        {/* 2px Revolving Conic Holographic Foil + Brushed Chrome Frame */}
        <div
          className={`relative h-[88px] w-[176px] overflow-hidden rounded-2xl p-[2px] transition-shadow duration-300 sm:h-[96px] sm:w-[192px] ${
            isCardFocused
              ? "shadow-[0_24px_50px_rgba(198,154,67,0.34),0_10px_22px_rgba(15,15,15,0.14)]"
              : "shadow-[0_10px_28px_rgba(15,15,15,0.07),0_2px_6px_rgba(15,15,15,0.04)]"
          }`}
          style={{
            background:
              "linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 30%, #F8FAFC 55%, #94A3B8 82%, #E2E8F0 100%)",
          }}
        >
          {/* Animated Orbiting Conic Prism Border Ring on Hover */}
          {isCardFocused && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[260px] -translate-x-1/2 -translate-y-1/2 motion-safe:animate-[spin_2.8s_linear_infinite]"
              style={{
                background:
                  "conic-gradient(from 0deg, #FCAA30 0deg, #FFFFFF 55deg, #0667F4 125deg, #F5CF7E 200deg, #94A3B8 270deg, #FCAA30 360deg)",
              }}
            />
          )}

          {/* Inner Brand Tile */}
          <div
            className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden rounded-[calc(1rem-2px)]"
            style={{
              backgroundColor: partner.tileBackdrop ?? "#FFFFFF",
            }}
          >
            <img
              ref={(el) => {
                logoRefs.current[refIndex] = el;
              }}
              src={partner.logoUrl}
              alt={isDuplicate ? "" : partner.alt}
              loading="lazy"
              decoding="async"
              draggable={false}
              className={`select-none transition-transform duration-200 ease-out will-change-transform ${
                partner.fit === "cover"
                  ? "h-full w-full object-cover"
                  : "h-full w-full object-contain px-5 py-3"
              }`}
            />

            {/* Subtle Top Chrome Glass Specular Sheen */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/25 to-transparent"
            />

            {/* Interactive Holographic Micro-Lattice + Iridescent Prism Foil Revealed Around Cursor */}
            {isCardFocused && (
              <>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(60deg, rgba(252,170,48,0.22) 0 1px, transparent 1px 11px), repeating-linear-gradient(-60deg, rgba(255,255,255,0.28) 0 1px, transparent 1px 11px), radial-gradient(125px circle at var(--mx) var(--my), rgba(255,255,255,0.42), rgba(252,170,48,0.2) 48%, rgba(6,103,244,0.12) 72%, transparent 86%)",
                    maskImage:
                      "radial-gradient(135px circle at var(--mx) var(--my), rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.45) 55%, transparent 90%)",
                    WebkitMaskImage:
                      "radial-gradient(135px circle at var(--mx) var(--my), rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.45) 55%, transparent 90%)",
                    mixBlendMode: "screen",
                  }}
                />
                {/* Instant Glass Enter Flash Sweep */}
                <div
                  key={`flash-${key}`}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 motion-safe:animate-[partnerEnterFlash_680ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 10%, rgba(255,255,255,0.68) 48%, rgba(252,170,48,0.35) 60%, transparent 90%)",
                  }}
                />
              </>
            )}

            {/* Ambient Diagonal Chrome Sweep */}
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

        {/* Floating Obsidian & Gold Partner + Sector Pill on Focus */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -bottom-3.5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#FCAA30]/60 bg-[#0A0A0D]/95 px-3 py-[3px] text-[9px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur-md transition-all duration-250 ${
            isCardFocused
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-1.5 scale-90 opacity-0"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#FCAA30]" />
          <span>{partner.name}</span>
          <span className="text-white/35">·</span>
          <span className="text-[#F5CF7E]">{partner.sector}</span>
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
            className="partner-holo-stage partner-perspective relative overflow-hidden py-5"
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
              className="partner-marquee-track flex w-max gap-5 pb-6 pt-3"
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
              className="partner-marquee-track-reverse flex w-max gap-5 pb-7 pt-3"
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
