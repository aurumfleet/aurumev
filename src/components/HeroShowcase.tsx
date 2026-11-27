"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { RaindropGlassCanvas } from "./RaindropGlassCanvas";

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
  const centerStage3dRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
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
    intensity: 0.45,
    pressPulse: 0,
  });

  useEffect(() => {
    if (introPhase === "done") return;
    introPlayedThisVisit = true;
    const fadeTimer = window.setTimeout(() => {
      setIntroPhase("fading");
    }, 4400);
    const doneTimer = window.setTimeout(() => {
      setIntroPhase("done");
    }, 5500);
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

      const idleNx = Math.sin(clock * 0.6) * 0.14;
      const idleNy = Math.cos(clock * 0.45) * 0.1;

      const destNx = p.inside ? p.targetNx : idleNx;
      const destNy = p.inside ? p.targetNy : idleNy;
      const destX = p.inside ? p.targetX : 0.5 + Math.sin(clock * 0.35) * 0.08;
      const destY = p.inside ? p.targetY : 0.42 + Math.cos(clock * 0.3) * 0.05;
      const destIntensity = p.inside ? 1 : 0.45;

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
        const a1 = (0.18 * p.intensity + pulseBoost).toFixed(3);
        const a2 = (0.06 * p.intensity + pulseBoost * 0.5).toFixed(3);
        ambientLightRef.current.style.background = `radial-gradient(${620 + p.pressPulse * 140}px circle at ${pctX}% ${pctY}%, rgba(252,170,48,${a1}), rgba(255,244,225,${a2}) 44%, transparent 74%)`;
      }

      if (bgParallaxRef.current) {
        const px = (-p.nx * 14).toFixed(2);
        const py = (-p.ny * 10).toFixed(2);
        bgParallaxRef.current.style.transform = `scale(1.08) translate3d(${px}px, ${py}px, 0)`;
      }

      if (centerStage3dRef.current) {
        const rotY = (p.nx * 4.5).toFixed(2);
        const rotX = (-p.ny * 3.5).toFixed(2);
        const tx = (p.nx * 8).toFixed(2);
        const ty = (p.ny * 6).toFixed(2);
        const pressZ = (-p.pressPulse * 16).toFixed(2);
        centerStage3dRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translate3d(${tx}px, ${ty}px, ${pressZ}px)`;
      }

      if (dockRef.current) {
        const dx = (p.nx * 10).toFixed(2);
        const dy = (p.ny * 5).toFixed(2);
        const dRotX = (4 - p.ny * 3).toFixed(2);
        const dRotY = (p.nx * 3.5).toFixed(2);
        dockRef.current.style.transform = `rotateX(${dRotX}deg) rotateY(${dRotY}deg) translate3d(${dx}px, ${dy}px, 16px)`;
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

  const current = HERO_SCENES[activeIdx];

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative w-full overflow-hidden bg-[#121212]"
    >
      {/* Full-Bleed Softly Blurred Background with Unique 3D Depth Flip Transitions */}
      <div
        ref={bgParallaxRef}
        className="hero-perspective pointer-events-none absolute inset-0 will-change-transform"
        style={{ transform: "scale(1.08)" }}
      >
        {HERO_SCENES.map((scene, idx) => {
          const isActive = idx === activeIdx;
          const isPrev = idx === (activeIdx - 1 + HERO_SCENES.length) % HERO_SCENES.length;
          return (
            <div
              key={scene.id}
              style={{
                transform: isActive
                  ? "rotateY(0deg) translateZ(0px) scale(1.03)"
                  : isPrev
                    ? "rotateY(-12deg) translateZ(-120px) scale(1.14)"
                    : "rotateY(12deg) translateZ(-80px) scale(1.1)",
              }}
              className={`absolute inset-0 transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={scene.image}
                alt={scene.alt}
                fill
                priority={idx === 0}
                className={`scale-105 object-cover object-center transition-[filter] duration-1000 ease-out ${
                  introPhase === "active"
                    ? "blur-[9px] brightness-90"
                    : introPhase === "fading"
                      ? "blur-[5px] brightness-95"
                      : "blur-[3px] brightness-100"
                }`}
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80" />
            </div>
          );
        })}
      </div>

      {/* Subtle 3D Orbital Champagne Ring Halo */}
      <div
        aria-hidden="true"
        className="hero-perspective pointer-events-none absolute inset-0 z-[5] hidden items-center justify-center md:flex"
      >
        <div className="h-[640px] w-[640px] rounded-full border border-[#FCAA30]/20 animate-[heroOrbit_24s_linear_infinite]" />
      </div>

      {/* Intro-Only Fast 3D Rain + Crystal Water Drops on Glass */}
      {introPhase !== "done" && (
        <RaindropGlassCanvas
          imageSrc={current.image}
          fadingOut={introPhase === "fading"}
          pointerRef={rainPointerRef}
        />
      )}

      {/* Warm Champagne Optical Studio Glow */}
      <div
        ref={ambientLightRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[7] hidden md:block"
      />

      {/* Desktop Centered Unified Copy + 3D Coverflow Filmstrip (md+) */}
      <div className="hero-perspective relative z-10 hidden min-h-[92vh] flex-col justify-between pb-10 pt-24 md:flex">
        {/* Static Rock-Solid Unified Headline, Subheadline & Two CTAs */}
        <div className="aurum-container my-auto flex w-full flex-col items-center text-center">
          <div
            ref={centerStage3dRef}
            className="preserve-3d max-w-4xl will-change-transform"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.36em] text-[#FCAA30]">
              {HERO_CONTENT.eyebrow}
            </p>

            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white drop-shadow-[0_12px_36px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-[64px]">
              {HERO_CONTENT.headline}
            </h1>

            <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-[#FCAA30] to-transparent" />

            <p className="mx-auto mt-5 max-w-2xl text-base font-normal leading-relaxed text-white/90 lg:text-[19px]">
              {HERO_CONTENT.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
        </div>

        {/* Bottom 3D Coverflow Glass Thumbnail Dock */}
        <div className="aurum-container hero-perspective mt-6 w-full">
          <div
            ref={dockRef}
            className="preserve-3d mx-auto grid w-full max-w-5xl grid-cols-5 gap-3 will-change-transform"
          >
            {HERO_SCENES.map((s, idx) => {
              const isActive = idx === activeIdx;
              const offset = idx - activeIdx;
              const coverflowTransform = isActive
                ? "translateZ(26px) translateY(-6px) scale(1.04) rotateY(0deg)"
                : `translateZ(${-Math.abs(offset) * 14}px) rotateY(${Math.max(-10, Math.min(10, -offset * 5))}deg) scale(0.97)`;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`Select scene ${idx + 1}: ${s.thumbLabel}`}
                  style={{ transform: coverflowTransform }}
                  className={`group relative w-full overflow-hidden rounded-2xl border p-1.5 text-left backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive
                      ? "border-[#FCAA30] bg-white/15 shadow-[0_18px_38px_rgba(0,0,0,0.5),0_0_24px_rgba(252,170,48,0.28)]"
                      : "border-white/20 bg-black/40 opacity-75 hover:border-white/50 hover:opacity-100"
                  }`}
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
                    <Image
                      src={s.image}
                      alt={s.thumbLabel}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="220px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2.5 text-[11px] font-semibold tracking-tight text-white">
                      {s.thumbLabel}
                    </span>
                  </div>
                  <div className="mt-1.5 h-0.5 w-full overflow-hidden rounded-full bg-white/20">
                    {isActive && (
                      <span
                        key={`dock-${activeIdx}-${paused ? "p" : "r"}`}
                        className={`block h-full rounded-full bg-[#FCAA30] ${
                          paused ? "w-full" : "animate-slide-progress"
                        }`}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Centered Unified Copy + 3D Floating Card (< md) */}
      <div className="relative z-10 flex flex-col px-5 pb-8 pt-24 text-center text-white md:hidden">
        <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#FCAA30]">
          {HERO_CONTENT.eyebrow}
        </p>

        <h1 className="mt-3 font-display text-[32px] font-semibold leading-[1.06] tracking-[-0.03em] text-white">
          {HERO_CONTENT.headline}
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
            onClick={() => trackAnalyticsEvent("invest_cta_click", { source: "hero_mobile_secondary" })}
          >
            <span>{HERO_CONTENT.secondaryCta.label}</span>
            <ArrowUpRight className="h-4 w-4 text-[#FCAA30]" />
          </PremiumHeroButton>
        </div>

        {/* Mobile 3D Rotating Scene Frame */}
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
