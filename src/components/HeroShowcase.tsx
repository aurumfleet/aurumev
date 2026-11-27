"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { RaindropGlassCanvas } from "./RaindropGlassCanvas";
import { HeroInteractiveBackground } from "./HeroInteractiveBackground";

interface HeroScene {
  id: string;
  thumbLabel: string;
  image: string;
  alt: string;
}

const HERO_SCENES: HeroScene[] = [
  {
    id: "rapido",
    thumbLabel: "Urban Riders",
    image: "/images/aurum-rapido.jpg",
    alt: "Delivery rider seated beside the white-and-gold Aurum EV electric scooter in an urban business district",
  },
  {
    id: "blinkit",
    thumbLabel: "Quick Commerce",
    image: "/images/aurum-blinkit.jpg",
    alt: "Blinkit partner riding a white-and-gold Aurum EV electric scooter",
  },
  {
    id: "swiggy",
    thumbLabel: "Hyperlocal EV",
    image: "/images/aurum-swiggy.jpg",
    alt: "Swiggy Instamart doorstep delivery with an Aurum EV fleet scooter",
  },
  {
    id: "zomato",
    thumbLabel: "City Delivery",
    image: "/images/aurum-zomato.jpg",
    alt: "Zomato rider delivering an order beside an Aurum EV scooter",
  },
  {
    id: "porter",
    thumbLabel: "B2B Logistics",
    image: "/images/aurum-porter.jpg",
    alt: "Porter B2B logistics partner loading packages beside a blue-accented Aurum EV scooter",
  },
];

const HERO_CONTENT = {
  eyebrow: "AURUM FLEET SOLUTIONS · ELECTRIC MOBILITY",
  headline: "Powering India's Delivery Future with Electric Mobility.",
  subtitle:
    "Aurum Fleet Solutions brings together EV rentals, delivery fleet operations and structured EV investment opportunities.",
  primaryCta: { label: "Explore Investment Plans", href: "#why-choose-aurum" },
  secondaryCta: { label: "Invest Now", href: "/invest" },
};

function PremiumHeroButton({
  href,
  variant,
  children,
  onClick,
  fullWidth = false,
}: {
  href: string;
  variant: "mango" | "glass";
  children: ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
}) {
  const glowRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = btnRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.08;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.1;

    el.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
    glow.style.opacity = "1";
    glow.style.background =
      variant === "mango"
        ? `radial-gradient(120px circle at ${x}px ${y}px, rgba(255,255,255,0.65), transparent 72%)`
        : `radial-gradient(140px circle at ${x}px ${y}px, rgba(252,170,48,0.34), transparent 72%)`;
  }

  function handlePointerDown(e: React.PointerEvent<HTMLAnchorElement>) {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples((prev) => [
      ...prev.slice(-2),
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 520);
  }

  function handleMouseLeave() {
    if (btnRef.current) {
      btnRef.current.style.transform = "translate3d(0px, 0px, 0)";
    }
    if (glowRef.current) {
      glowRef.current.style.opacity = "0";
    }
  }

  return (
    <Link
      ref={btnRef}
      href={href}
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group ${
        variant === "mango" ? "aurum-btn-premium-mango" : "aurum-btn-premium-glass"
      } ${fullWidth ? "w-full" : ""}`}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          style={{ left: r.x, top: r.y }}
          className={`pointer-events-none absolute h-56 w-56 rounded-full animate-[btnRipple_500ms_cubic-bezier(0.22,1,0.36,1)_forwards] ${
            variant === "mango" ? "bg-white/55" : "bg-[#FCAA30]/40"
          }`}
        />
      ))}
      <span
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent ${
          variant === "mango" ? "via-white/50" : "via-white/20"
        } to-transparent animate-[heroShimmer_4.5s_ease-in-out_infinite]`}
      />
      <span className="relative z-10 inline-flex items-center gap-2.5">{children}</span>
    </Link>
  );
}

let introPlayedThisVisit = false;

export function HeroShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [introPhase, setIntroPhase] = useState<"active" | "fading" | "done">(() =>
    introPlayedThisVisit ? "done" : "active"
  );

  const sectionRef = useRef<HTMLElement>(null);
  const ambientLightRef = useRef<HTMLDivElement>(null);
  const bgParallaxRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const copyColRef = useRef<HTMLDivElement>(null);
  const rainPointerRef = useRef({ x: 0.5, y: 0.5, inside: false });

  const pointer = useRef({
    targetX: 0.5,
    targetY: 0.45,
    curX: 0.5,
    curY: 0.45,
    nx: 0,
    ny: 0,
    targetNx: 0,
    targetNy: 0,
    inside: false,
    intensity: 0.5,
    pressPulse: 0,
  });

  useEffect(() => {
    if (introPhase === "done") return;
    introPlayedThisVisit = true;
    const fadeTimer = window.setTimeout(() => setIntroPhase("fading"), 4400);
    const doneTimer = window.setTimeout(() => setIntroPhase("done"), 5500);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, [introPhase]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HERO_SCENES.length);
    }, 5200);
    return () => clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isFinePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;

    if (prefersReduced || !isFinePointer) return;

    let rafId = 0;
    let clock = 0;

    const tick = () => {
      clock += 0.016;
      const p = pointer.current;

      const idleNx = Math.sin(clock * 0.65) * 0.16;
      const idleNy = Math.cos(clock * 0.45) * 0.1;

      const destNx = p.inside ? p.targetNx : idleNx;
      const destNy = p.inside ? p.targetNy : idleNy;
      const destX = p.inside ? p.targetX : 0.64 + Math.sin(clock * 0.35) * 0.08;
      const destY = p.inside ? p.targetY : 0.45 + Math.cos(clock * 0.3) * 0.05;
      const destIntensity = p.inside ? 1 : 0.52;

      const ease = p.inside ? 0.09 : 0.045;
      p.nx += (destNx - p.nx) * ease;
      p.ny += (destNy - p.ny) * ease;
      p.curX += (destX - p.curX) * 0.09;
      p.curY += (destY - p.curY) * 0.09;
      p.intensity += (destIntensity - p.intensity) * 0.06;
      p.pressPulse *= 0.86;

      const pctX = (p.curX * 100).toFixed(2);
      const pctY = (p.curY * 100).toFixed(2);

      if (ambientLightRef.current) {
        const pulseBoost = p.pressPulse * 0.24;
        const a1 = (0.22 * p.intensity + pulseBoost).toFixed(3);
        const a2 = (0.08 * p.intensity + pulseBoost * 0.5).toFixed(3);
        ambientLightRef.current.style.background = `radial-gradient(${660 + p.pressPulse * 140}px circle at ${pctX}% ${pctY}%, rgba(252,170,48,${a1}), rgba(255,244,225,${a2}) 44%, transparent 74%)`;
      }

      if (bgParallaxRef.current) {
        const px = (-p.nx * 16).toFixed(2);
        const py = (-p.ny * 12).toFixed(2);
        bgParallaxRef.current.style.transform = `scale(1.1) translate3d(${px}px, ${py}px, 0)`;
      }

      if (copyColRef.current) {
        const tx = (p.nx * 4).toFixed(2);
        const ty = (p.ny * 3).toFixed(2);
        copyColRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      }

      if (stackRef.current) {
        const rotY = (p.nx * 6 - 3).toFixed(2);
        const rotX = (-p.ny * 5 + 1.5).toFixed(2);
        const tx = (p.nx * 10).toFixed(2);
        const ty = (p.ny * 7 + Math.sin(clock * 1.4) * 4).toFixed(2);
        const pressZ = (-p.pressPulse * 14).toFixed(2);
        stackRef.current.style.transform = `perspective(1300px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate3d(${tx}px, ${ty}px, ${pressZ}px)`;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  function handlePointerMove(e: React.PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse" || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const rx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const ry = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    pointer.current.targetX = rx;
    pointer.current.targetY = ry;
    pointer.current.targetNx = (rx - 0.5) * 2;
    pointer.current.targetNy = (ry - 0.5) * 2;
    pointer.current.inside = true;
    rainPointerRef.current = { x: rx, y: ry, inside: true };
  }

  function handlePointerDown() {
    pointer.current.pressPulse = 1;
  }

  function handlePointerLeave() {
    pointer.current.inside = false;
    rainPointerRef.current.inside = false;
  }

  function goPrev() {
    setActiveIdx((prev) => (prev - 1 + HERO_SCENES.length) % HERO_SCENES.length);
  }

  function goNext() {
    setActiveIdx((prev) => (prev + 1) % HERO_SCENES.length);
  }

  const current = HERO_SCENES[activeIdx];
  const total = HERO_SCENES.length;

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative w-full overflow-hidden bg-[#09090C]"
    >
      {/* Ambient Blurred Background Wash Synced to Active Scene */}
      <div
        ref={bgParallaxRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
        style={{ transform: "scale(1.1)" }}
      >
        {HERO_SCENES.map((scene, idx) => (
          <div
            key={scene.id}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
              idx === activeIdx ? "opacity-50" : "opacity-0"
            }`}
          >
            <Image
              src={scene.image}
              alt=""
              fill
              priority={idx === 0}
              className="scale-110 object-cover object-center blur-2xl brightness-75"
              sizes="100vw"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_68%_45%,rgba(9,9,12,0.42)_0%,rgba(9,9,12,0.9)_70%,#09090C_100%)]" />
      </div>

      {/* Subtle Architectural Perspective Grid Floor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-48 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(252,170,48,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "52px 36px",
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
          transform: "perspective(500px) rotateX(62deg) scale(1.4)",
          transformOrigin: "bottom center",
        }}
      />

      {/* Dual Orbital Chrome + Gold Halo Behind Stage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-1/2 z-[4] hidden -translate-y-1/2 items-center justify-center lg:flex"
      >
        <div className="relative flex items-center justify-center">
          <div className="h-[700px] w-[700px] rounded-full border border-white/[0.07] animate-[heroOrbit_38s_linear_infinite_reverse]" />
          <div className="absolute h-[520px] w-[520px] rounded-full border border-[#FCAA30]/20 animate-[heroOrbit_24s_linear_infinite]" />
        </div>
      </div>

      {/* Intro-Only 3D Rain + Crystal Water Drops */}
      {introPhase !== "done" && (
        <RaindropGlassCanvas
          imageSrc={current.image}
          fadingOut={introPhase === "fading"}
          pointerRef={rainPointerRef}
        />
      )}

      {/* Live Cursor-Reactive Aurum Gold & Chrome Energy Constellation */}
      <HeroInteractiveBackground pointerRef={pointer} />

      {/* Pointer-Tracked Champagne Optical Glow */}
      <div
        ref={ambientLightRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[7] hidden md:block"
      />

      {/* DESKTOP: Split Editorial Layout + 3D Cascading Depth Card-Stack (md+) */}
      <div className="aurum-container relative z-10 hidden min-h-[90vh] flex-col justify-between pb-8 pt-28 md:flex">
        <div className="my-auto grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column — Editorial Copy (Exact Original Copy) */}
          <div ref={copyColRef} className="lg:col-span-6 will-change-transform">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.05] px-4 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FCAA30] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FCAA30]" />
              </span>
              <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#F5CF7E]">
                {HERO_CONTENT.eyebrow}
              </p>
            </div>

            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.03] tracking-[-0.04em] text-white drop-shadow-[0_14px_34px_rgba(0,0,0,0.5)] xl:text-[58px]">
              Powering India&apos;s Delivery Future{" "}
              <span className="bg-gradient-to-r from-white via-[#FBE3B4] to-[#FCAA30] bg-clip-text text-transparent">
                with Electric Mobility.
              </span>
            </h1>

            <div className="mt-6 flex max-w-[180px] items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-[#FCAA30] to-transparent" />
              <span className="h-1.5 w-1.5 rotate-45 border border-[#FCAA30] bg-[#FCAA30]/40" />
              <span className="h-px flex-1 bg-gradient-to-l from-[#FCAA30]/50 to-transparent" />
            </div>

            <p className="mt-5 max-w-xl text-base font-normal leading-relaxed text-[#CBD5E1] lg:text-[18px]">
              {HERO_CONTENT.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <PremiumHeroButton
                href={HERO_CONTENT.primaryCta.href}
                variant="mango"
                onClick={() => trackAnalyticsEvent("invest_cta_click", { source: "hero" })}
              >
                <span>{HERO_CONTENT.primaryCta.label}</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F0F0F] text-[#FCAA30] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-rotate-12">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </PremiumHeroButton>

              <PremiumHeroButton
                href={HERO_CONTENT.secondaryCta.href}
                variant="glass"
                onClick={() => trackAnalyticsEvent("invest_cta_click", { source: "hero_secondary" })}
              >
                <span>{HERO_CONTENT.secondaryCta.label}</span>
                <ArrowUpRight className="h-4 w-4 text-[#FCAA30] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </PremiumHeroButton>
            </div>
          </div>

          {/* Right Column — 3D Cascading Depth Card-Stack Deck */}
          <div className="lg:col-span-6 lg:pr-8">
            <div
              ref={stackRef}
              className="preserve-3d relative aspect-[16/11] w-full will-change-transform"
            >
              {HERO_SCENES.map((scene, idx) => {
                const rel = (idx - activeIdx + total) % total;
                const isFront = rel === 0;
                const isNext1 = rel === 1;
                const isNext2 = rel === 2;
                const isPrev = rel === total - 1;

                let transform = "translate3d(-36px, 0, -140px) scale(0.86) rotateY(10deg)";
                let opacity = 0;
                let zIndex = 1;

                if (isFront) {
                  transform = "translate3d(0, 0, 20px) scale(1) rotateY(0deg)";
                  opacity = 1;
                  zIndex = 30;
                } else if (isNext1) {
                  transform = "translate3d(26px, 10px, -45px) scale(0.94) rotateY(-6deg)";
                  opacity = 0.72;
                  zIndex = 20;
                } else if (isNext2) {
                  transform = "translate3d(48px, 18px, -95px) scale(0.88) rotateY(-10deg)";
                  opacity = 0.42;
                  zIndex = 10;
                } else if (isPrev) {
                  transform = "translate3d(-44px, -6px, -60px) scale(0.92) rotateY(8deg)";
                  opacity = 0;
                  zIndex = 5;
                }

                return (
                  <div
                    key={scene.id}
                    onClick={!isFront ? () => setActiveIdx(idx) : undefined}
                    style={{ transform, opacity, zIndex }}
                    className={`absolute inset-0 rounded-[2rem] p-[1.5px] transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isFront
                        ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.68)_0%,rgba(148,163,184,0.25)_26%,rgba(255,255,255,0.8)_50%,rgba(252,170,48,0.62)_76%,rgba(203,213,225,0.4)_100%)] shadow-[0_32px_90px_rgba(0,0,0,0.75)]"
                        : "cursor-pointer bg-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                    }`}
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-[calc(2rem-1.5px)] bg-[#111216]">
                      <Image
                        src={scene.image}
                        alt={scene.alt}
                        fill
                        priority={idx === 0}
                        className={`object-cover object-center transition-transform duration-[5200ms] ease-out ${
                          isFront ? "scale-105" : "scale-100 brightness-75"
                        }`}
                        sizes="(max-width: 1024px) 90vw, 48vw"
                      />

                      {/* Diagonal Chrome Light Sweep on Active Card */}
                      {isFront && (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 overflow-hidden"
                        >
                          <div
                            className="h-full w-1/3 motion-safe:animate-[partnerGoldSweep_5.5s_ease-in-out_infinite]"
                            style={{
                              background:
                                "linear-gradient(110deg, transparent 15%, rgba(255,255,255,0.18) 48%, rgba(252,170,48,0.16) 55%, transparent 85%)",
                            }}
                          />
                        </div>
                      )}

                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20"
                      />

                      {isFront && (
                        <>
                          {/* Stage Prev / Next Chrome Controls */}
                          <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                goPrev();
                              }}
                              aria-label="Previous scene"
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-xl transition hover:border-[#FCAA30] hover:bg-black/80 hover:text-[#FCAA30]"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                goNext();
                              }}
                              aria-label="Next scene"
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-xl transition hover:border-[#FCAA30] hover:bg-black/80 hover:text-[#FCAA30]"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Live Animated Slide Progress Bar */}
                          <div className="absolute bottom-5 left-4 right-28 z-30 h-1 overflow-hidden rounded-full bg-white/20">
                            <span
                              key={`stage-${activeIdx}-${paused ? "p" : "r"}`}
                              className={`block h-full rounded-full bg-gradient-to-r from-[#FCAA30] via-[#FDE6B6] to-[#FCAA30] ${
                                paused ? "w-full" : "animate-slide-progress"
                              }`}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Animated Kinetic Scroll Cue */}
        <div className="mt-6 flex justify-center">
          <a
            href="#ecosystem-partners"
            aria-label="Scroll to explore"
            className="group inline-flex flex-col items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55 transition-colors hover:text-[#FCAA30]"
          >
            <span>Scroll</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] transition-colors group-hover:border-[#FCAA30]/60">
              <ChevronDown className="h-3.5 w-3.5 animate-bounce text-[#FCAA30]" />
            </span>
          </a>
        </div>
      </div>

      {/* MOBILE: Centered Unified Copy + 3D Floating Card (< md) */}
      <div className="relative z-10 flex flex-col px-5 pb-8 pt-24 text-center text-white md:hidden">
        <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#FCAA30]">
          {HERO_CONTENT.eyebrow}
        </p>

        <h1 className="mt-3 font-display text-[32px] font-semibold leading-[1.06] tracking-[-0.03em] text-white">
          Powering India&apos;s Delivery Future{" "}
          <span className="bg-gradient-to-r from-white via-[#FBE3B4] to-[#FCAA30] bg-clip-text text-transparent">
            with Electric Mobility.
          </span>
        </h1>
        <div className="mx-auto mt-4 h-px w-14 bg-gradient-to-r from-transparent via-[#FCAA30] to-transparent" />
        <p className="mx-auto mt-3.5 max-w-sm text-sm leading-relaxed text-white/90">
          {HERO_CONTENT.subtitle}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <PremiumHeroButton
            href={HERO_CONTENT.primaryCta.href}
            variant="mango"
            fullWidth
            onClick={() => trackAnalyticsEvent("invest_cta_click", { source: "hero_mobile" })}
          >
            <span>{HERO_CONTENT.primaryCta.label}</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0F0F0F] text-[#FCAA30]">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </PremiumHeroButton>
          <PremiumHeroButton
            href={HERO_CONTENT.secondaryCta.href}
            variant="glass"
            fullWidth
            onClick={() =>
              trackAnalyticsEvent("invest_cta_click", { source: "hero_mobile_secondary" })
            }
          >
            <span>{HERO_CONTENT.secondaryCta.label}</span>
            <ArrowUpRight className="h-4 w-4 text-[#FCAA30]" />
          </PremiumHeroButton>
        </div>

        {/* Mobile 3D Floating Scene Frame */}
        <div className="hero-perspective mt-7">
          <div className="preserve-3d relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-white/25 bg-black/40 p-1.5 shadow-elevated backdrop-blur-xl animate-[heroFloat3d_6.5s_ease-in-out_infinite]">
            <div className="relative h-full w-full overflow-hidden rounded-[20px]">
              {HERO_SCENES.map((scene, idx) => (
                <Image
                  key={scene.id}
                  src={scene.image}
                  alt={scene.alt}
                  fill
                  priority={idx === 0}
                  className={`object-cover transition-all duration-700 ${
                    idx === activeIdx ? "scale-100 opacity-100" : "scale-110 opacity-0"
                  }`}
                  sizes="100vw"
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
                <span className="rounded-full bg-black/65 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                  {current.thumbLabel}
                </span>
                <div className="flex gap-1.5">
                  {HERO_SCENES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-label={`Slide ${idx + 1}`}
                      onClick={() => setActiveIdx(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === activeIdx ? "w-7 bg-[#FCAA30]" : "w-3 bg-white/55"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
