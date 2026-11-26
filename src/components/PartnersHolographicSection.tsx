"use client";

import { useEffect, useRef, useState } from "react";
import { ECOSYSTEM_PARTNERS, type EcosystemPartner } from "@/data/partners";
import { RevealOnScroll } from "@/components/MotionPrimitives";

interface AmbientParticle {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
}

const HOLO_PARTICLES: readonly AmbientParticle[] = [
  { id: 1, left: "8%", top: "18%", size: 2.5, delay: "0s", duration: "6.4s" },
  { id: 2, left: "16%", top: "74%", size: 2, delay: "1.2s", duration: "7.2s" },
  { id: 3, left: "24%", top: "30%", size: 3, delay: "0.7s", duration: "5.8s" },
  { id: 4, left: "34%", top: "82%", size: 2, delay: "2.1s", duration: "6.9s" },
  { id: 5, left: "43%", top: "16%", size: 2.5, delay: "1.5s", duration: "6.2s" },
  { id: 6, left: "51%", top: "86%", size: 2, delay: "0.4s", duration: "7.4s" },
  { id: 7, left: "60%", top: "22%", size: 3, delay: "1.9s", duration: "5.9s" },
  { id: 8, left: "69%", top: "78%", size: 2, delay: "0.9s", duration: "6.7s" },
  { id: 9, left: "78%", top: "26%", size: 2.5, delay: "2.4s", duration: "7.1s" },
  { id: 10, left: "87%", top: "68%", size: 2, delay: "1.1s", duration: "6.0s" },
  { id: 11, left: "93%", top: "34%", size: 2.5, delay: "0.3s", duration: "6.5s" },
  { id: 12, left: "12%", top: "50%", size: 1.5, delay: "1.7s", duration: "7.6s" },
];

function sizeHintClasses(sizeHint: EcosystemPartner["sizeHint"]) {
  if (sizeHint === "square") {
    return "h-16 w-16 sm:h-[72px] sm:w-[72px]";
  }
  if (sizeHint === "wide") {
    return "h-full w-full";
  }
  return "max-h-14 max-w-[82%] sm:max-h-16";
}

export function PartnersHolographicSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const chamberRef = useRef<HTMLDivElement>(null);
  const cardInnerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isPaused, setIsPaused] = useState(false);
  const [touchOffset, setTouchOffset] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const baseTouchOffsetRef = useRef(0);
  const isTouchActiveRef = useRef(false);

  // Smooth 60fps curved 3D holographic perspective & center-focus modulation
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      cardInnerRefs.current.forEach((card) => {
        if (!card) return;
        card.style.transform = "perspective(1200px) translateZ(0px) rotateY(0deg) scale(1)";
        card.style.opacity = "1";
      });
      return;
    }

    let rafId = 0;

    const updateCurveDepth = () => {
      const stage = stageRef.current;
      if (stage) {
        const stageRect = stage.getBoundingClientRect();
        const stageCenter = stageRect.left + stageRect.width / 2;
        const halfWidth = Math.max(stageRect.width / 2, 160);

        for (const card of cardInnerRefs.current) {
          if (!card) continue;
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const rawNorm = (cardCenter - stageCenter) / halfWidth;
          const norm = Math.max(-1.25, Math.min(1.25, rawNorm));
          const absNorm = Math.min(1, Math.abs(norm));

          // Center logos stand slightly taller and closer; flank panels arc cleanly backward in 3D space
          const scale = 1.07 - absNorm * 0.17;
          const translateZ = 34 - absNorm * 72;
          const rotateY = -norm * 19;
          const opacity = 1 - absNorm * 0.28;
          const goldGlow = Math.max(0, 1 - absNorm * 1.45);

          card.style.transform = `perspective(1200px) translate3d(0, 0, ${translateZ.toFixed(
            1,
          )}px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
          card.style.opacity = opacity.toFixed(3);
          card.style.setProperty("--holo-focus", goldGlow.toFixed(3));
        }
      }

      rafId = window.requestAnimationFrame(updateCurveDepth);
    };

    rafId = window.requestAnimationFrame(updateCurveDepth);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  // Gentle desktop cursor 3D chamber tilt + optical reflection tracking
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !stageRef.current || !chamberRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    const rotY = Math.max(-4.5, Math.min(4.5, nx * 4.5));
    const rotX = Math.max(-3, Math.min(3, -ny * 3));

    chamberRef.current.style.transform = `perspective(1600px) rotateX(${rotX.toFixed(
      2,
    )}deg) rotateY(${rotY.toFixed(2)}deg)`;
    chamberRef.current.style.setProperty("--mx", `${((nx + 1) * 50).toFixed(1)}%`);
    chamberRef.current.style.setProperty("--my", `${((ny + 1) * 50).toFixed(1)}%`);
  };

  const handlePointerLeave = () => {
    setIsPaused(false);
    if (chamberRef.current) {
      chamberRef.current.style.transform = "perspective(1600px) rotateX(0deg) rotateY(0deg)";
      chamberRef.current.style.setProperty("--mx", "50%");
      chamberRef.current.style.setProperty("--my", "50%");
    }
  };

  // Horizontal touch scrubbing for mobile devices
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    isTouchActiveRef.current = true;
    touchStartXRef.current = e.touches[0].clientX;
    baseTouchOffsetRef.current = touchOffset;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isTouchActiveRef.current || touchStartXRef.current === null || e.touches.length !== 1) {
      return;
    }
    const deltaX = e.touches[0].clientX - touchStartXRef.current;
    const clamped = Math.max(-220, Math.min(220, baseTouchOffsetRef.current + deltaX));
    setTouchOffset(clamped);
  };

  const handleTouchEnd = () => {
    isTouchActiveRef.current = false;
    touchStartXRef.current = null;
    setTouchOffset(0);
    setIsPaused(false);
  };

  // Duplicate partner sequence twice for zero-gap seamless infinite right-to-left looping
  const loopedPartners = [...ECOSYSTEM_PARTNERS, ...ECOSYSTEM_PARTNERS];

  return (
    <section
      id="ecosystem-partners"
      aria-labelledby="partners-heading"
      className="relative overflow-hidden bg-white py-20 text-[#0F0F0F] sm:py-28 lg:py-32"
    >
      {/* Subtle architectural ambient wash keeping pure white background airy */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-0 h-[520px] -translate-y-1/2 bg-[radial-gradient(ellipse_62%_50%_at_50%_50%,rgba(198,154,67,0.08),transparent_72%)]"
      />

      <div className="aurum-container relative z-10">
        {/* 1. Section Header */}
        <RevealOnScroll className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#C69A43]/30 bg-[#FAF7F0] px-4 py-1.5 shadow-[0_2px_12px_rgba(198,154,67,0.08)]">
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

        {/* 2. Main Experience – 3D Holographic Logo Showcase */}
        <RevealOnScroll delayMs={100} className="mt-12 sm:mt-16">
          <div
            ref={stageRef}
            data-paused={isPaused ? "true" : "false"}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") setIsPaused(true);
            }}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            className="partner-holo-stage partner-perspective relative mx-auto select-none"
            role="region"
            aria-roledescription="carousel"
            aria-label="Electric mobility ecosystem showcase"
          >
            {/* Floating dark charcoal & metallic gold holographic glass chamber */}
            <div
              ref={chamberRef}
              style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
              className="preserve-3d relative overflow-hidden rounded-[32px] border border-[#C69A43]/35 bg-gradient-to-b from-[#17171A] via-[#0D0D10] to-[#141418] py-12 shadow-[0_34px_90px_rgba(15,15,15,0.24),0_12px_36px_rgba(198,154,67,0.12),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(198,154,67,0.28)] transition-transform duration-200 ease-out sm:rounded-[40px] sm:py-16"
            >
              {/* Frosted glass cursor-reactive holographic reflection */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-75 transition-opacity duration-300"
                style={{
                  background:
                    "radial-gradient(620px circle at var(--mx) var(--my), rgba(252,170,48,0.13), rgba(255,255,255,0.04) 36%, transparent 70%)",
                }}
              />

              {/* Curved holographic metallic gold refraction arcs & top glass rim highlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-12 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FCAA30]/60 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 left-1/2 h-44 w-[78%] -translate-x-1/2 rounded-[100%] border border-[#C69A43]/20 bg-[radial-gradient(ellipse_at_center,rgba(252,170,48,0.12),transparent_70%)] blur-xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 left-1/2 h-44 w-[82%] -translate-x-1/2 rounded-[100%] border-t border-[#C69A43]/25 bg-[radial-gradient(ellipse_at_center,rgba(198,154,67,0.16),transparent_68%)] blur-xl"
              />

              {/* Subtle swept gold light trails behind moving panels */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 inset-x-0 overflow-hidden"
              >
                <div className="absolute left-0 top-[42%] h-[2px] w-full bg-gradient-to-r from-transparent via-[#C69A43]/25 to-transparent" />
                <div className="absolute left-0 top-[58%] h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div
                  className="absolute top-[40%] h-8 w-64 rounded-full bg-gradient-to-r from-transparent via-[#FCAA30]/20 to-transparent blur-md"
                  style={{ animation: "partnerGoldSweep 7.5s ease-in-out infinite" }}
                />
                <div
                  className="absolute top-[54%] h-6 w-52 rounded-full bg-gradient-to-r from-transparent via-[#E5C37A]/15 to-transparent blur-md"
                  style={{ animation: "partnerGoldSweep 9.5s ease-in-out 2.5s infinite" }}
                />
              </div>

              {/* Subtle floating metallic gold micro particles */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                {HOLO_PARTICLES.map((p) => (
                  <span
                    key={p.id}
                    className="absolute rounded-full bg-[#F5CF7E]"
                    style={{
                      left: p.left,
                      top: p.top,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      boxShadow: "0 0 8px rgba(252,170,48,0.55)",
                      animation: `partnerHoloFloat ${p.duration} ease-in-out ${p.delay} infinite`,
                    }}
                  />
                ))}
              </div>

              {/* Precision optical HUD calibration corners */}
              <div
                aria-hidden="true"
                className="pointer-events-none relative z-10 mb-6 flex items-center justify-between px-6 sm:px-10"
              >
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D7B365]/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FCAA30]" />
                  <span>HOLOGRAPHIC FLEET SHOWCASE</span>
                </div>
                <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-white/45 sm:inline">
                  {isPaused ? "PAUSED ON INSPECT" : "CONTINUOUS STREAM"}
                </span>
              </div>

              {/* Edge glass fade masks */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 z-20 w-10 bg-gradient-to-r from-[#0F0F12] via-[#0F0F12]/70 to-transparent sm:w-28"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-gradient-to-l from-[#0F0F12] via-[#0F0F12]/70 to-transparent sm:w-28"
              />

              {/* Continuous RIGHT-TO-LEFT 3D floating glass panel stream */}
              <div
                className="relative z-10 overflow-hidden py-4 transition-transform duration-200 ease-out"
                style={{ transform: `translate3d(${touchOffset}px, 0, 0)` }}
              >
                <div className="partner-marquee-track flex w-max items-center">
                  {loopedPartners.map((partner, idx) => {
                    const isDuplicate = idx >= ECOSYSTEM_PARTNERS.length;
                    return (
                      <div
                        key={`${partner.id}-${idx}`}
                        aria-hidden={isDuplicate ? "true" : undefined}
                        className="w-[235px] shrink-0 px-2.5 sm:w-[270px] sm:px-3.5"
                      >
                        <div
                          ref={(el) => {
                            cardInnerRefs.current[idx] = el;
                          }}
                          style={{ "--holo-focus": "0" } as React.CSSProperties}
                          className="group relative overflow-hidden rounded-[26px] border border-white/15 bg-gradient-to-b from-white/[0.13] via-white/[0.06] to-white/[0.03] p-3.5 backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:border-[#FCAA30]/60 sm:p-4"
                        >
                          {/* Dynamic center-spotlight gold rim illumination */}
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 rounded-[26px] border border-[#FCAA30]/60 transition-opacity duration-150"
                            style={{ opacity: "calc(var(--holo-focus) * 0.85)" }}
                          />

                          {/* Diagonal glass specular refraction sheen */}
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -left-1/2 -top-1/2 h-[200%] w-1/2 rotate-[24deg] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
                          />

                          {/* Authentic Brand Logo Glass Plate */}
                          <div
                            className="relative flex h-[96px] w-full items-center justify-center overflow-hidden rounded-[18px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_10px_28px_rgba(0,0,0,0.28)] sm:h-[108px]"
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
                              className={`object-contain select-none transition-transform duration-300 group-hover:scale-[1.03] ${sizeHintClasses(
                                partner.sizeHint,
                              )}`}
                            />
                          </div>

                          {/* Minimal Holographic Specimen Caption */}
                          <div className="mt-3.5 flex items-center justify-between gap-2 px-1">
                            <div>
                              <p className="text-sm font-semibold tracking-[-0.01em] text-white">
                                {partner.name}
                              </p>
                              <p className="text-[11px] font-medium tracking-[0.04em] text-[#DFBE76]">
                                {partner.sector}
                              </p>
                            </div>
                            <span
                              aria-hidden="true"
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#C69A43]/35 bg-[#C69A43]/10"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-[#FCAA30]" />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lower reflected horizon bar */}
              <div
                aria-hidden="true"
                className="pointer-events-none relative z-10 mt-6 flex items-center justify-center px-6"
              >
                <div className="h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-[#C69A43]/50 to-transparent" />
              </div>
            </div>

            {/* Subtle soft ambient projection shadow underneath floating holographic display */}
            <div
              aria-hidden="true"
              className="mx-auto mt-3 h-5 w-[82%] rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(15,15,15,0.16),transparent_70%)] blur-md"
            />
          </div>
        </RevealOnScroll>

        {/* 6. Section Bottom Statement & Subtle Metallic Gold Divider */}
        <RevealOnScroll delayMs={160} className="mt-10 text-center sm:mt-14">
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
