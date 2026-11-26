"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { RaindropGlassCanvas } from "./RaindropGlassCanvas";

interface HeroSlide {
  id: string;
  eyebrow: string;
  headline: string;
  subtitle: string;
  thumbLabel: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image: string;
  alt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "commuter",
    eyebrow: "THROUGH THE GLASS · AURUM EV",
    headline: "EMPOWERING RIDERS.\nDRIVING THE FUTURE.",
    subtitle:
      "Flexible zero-fuel electric two-wheeler rentals for urban commuters, delivery fleets, and structured partners.",
    thumbLabel: "Urban Commuter",
    primaryCta: { label: "Rent Today", href: "/rentals#book" },
    secondaryCta: { label: "Invest Now", href: "/invest" },
    image: "/images/aurum-commuter-hero.jpg",
    alt: "Riders on an Aurum Fleet Solutions silver electric two-wheeler outside an urban corporate building",
  },
  {
    id: "blinkit",
    eyebrow: "DELIVERY PARTNER ECOSYSTEM",
    headline: "BUILT FOR INDIA'S\nDELIVERY FLEETS.",
    subtitle:
      "Weekly and monthly EV rental plans engineered for quick-commerce riders with scheduled hub maintenance.",
    thumbLabel: "Quick Commerce",
    primaryCta: { label: "For Delivery Riders", href: "/riders" },
    secondaryCta: { label: "Calculate Savings", href: "/#calculator" },
    image: "/images/aurum-blinkit-hero.jpg",
    alt: "Blinkit delivery partner riding an Aurum EV branded electric scooter",
  },
  {
    id: "zepto",
    eyebrow: "LAST-MILE LOGISTICS",
    headline: "LAST-MILE EV.\nZERO FUEL WORRY.",
    subtitle:
      "Consistent doorstep reliability with transparent rental agreements and predictable daily operating economics.",
    thumbLabel: "Last-Mile EV",
    primaryCta: { label: "Book Your EV", href: "/rentals#book" },
    secondaryCta: { label: "Explore Fleet", href: "/fleet" },
    image: "/images/aurum-zepto-hero.jpg",
    alt: "Zepto delivery handover beside a parked Aurum EV silver electric scooter",
  },
  {
    id: "instamart",
    eyebrow: "ENTERPRISE & B2B FLEETS",
    headline: "SCALE YOUR\nELECTRIC FLEET.",
    subtitle:
      "Bulk B2B electric two-wheeler deployments, preventive servicing, and consolidated GST-compliant billing.",
    thumbLabel: "B2B Enterprise",
    primaryCta: { label: "Business Solutions", href: "/business#proposal" },
    secondaryCta: { label: "Explore Fleet", href: "/fleet" },
    image: "/images/aurum-instamart-hero.jpg",
    alt: "Swiggy Instamart doorstep delivery with an Aurum EV fleet scooter",
  },
];

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

export function HeroShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);

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
    if (paused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HERO_SLIDES.length);
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

      // Warm champagne glass illumination behind droplets
      if (ambientLightRef.current) {
        const pulseBoost = p.pressPulse * 0.24;
        const a1 = (0.18 * p.intensity + pulseBoost).toFixed(3);
        const a2 = (0.06 * p.intensity + pulseBoost * 0.5).toFixed(3);
        ambientLightRef.current.style.background = `radial-gradient(${620 + p.pressPulse * 140}px circle at ${pctX}% ${pctY}%, rgba(252,170,48,${a1}), rgba(255,244,225,${a2}) 44%, transparent 74%)`;
      }

      // Layer -1: Deep blurred backdrop counter-parallax
      if (bgParallaxRef.current) {
        const px = (-p.nx * 14).toFixed(2);
        const py = (-p.ny * 10).toFixed(2);
        bgParallaxRef.current.style.transform = `scale(1.08) translate3d(${px}px, ${py}px, 0)`;
      }

      // Layer +1: Centered 3D perspective typography tilt + click press depth
      if (centerStage3dRef.current) {
        const rotY = (p.nx * 4.5).toFixed(2);
        const rotX = (-p.ny * 3.5).toFixed(2);
        const tx = (p.nx * 8).toFixed(2);
        const ty = (p.ny * 6).toFixed(2);
        const pressZ = (-p.pressPulse * 16).toFixed(2);
        centerStage3dRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translate3d(${tx}px, ${ty}px, ${pressZ}px)`;
      }

      // Layer +2: Bottom 3D Thumbnail Filmstrip perspective float
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

  const current = HERO_SLIDES[activeIdx];

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
      {/* Full-Bleed Softly Blurred User Photo Scene */}
      <div
        ref={bgParallaxRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
        style={{ transform: "scale(1.08)" }}
      >
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              idx === activeIdx ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={idx === 0}
              className="scale-105 object-cover object-center blur-[8px] brightness-90"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80" />
          </div>
        ))}
      </div>

      {/* Refractive Water Drops on Glass Simulation */}
      <RaindropGlassCanvas imageSrc={current.image} pointerRef={rainPointerRef} />

      {/* Warm Champagne Optical Studio Glow */}
      <div
        ref={ambientLightRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[7] hidden md:block"
      />

      {/* Desktop Centered Through-The-Glass 3D Layout (md+) */}
      <div className="hero-perspective relative z-10 hidden min-h-[88vh] flex-col justify-between pb-10 pt-20 md:flex">
        {/* Centered Floating 3D Headline & Dual Buttons */}
        <div className="aurum-container my-auto flex w-full flex-col items-center text-center">
          <div
            ref={centerStage3dRef}
            className="preserve-3d max-w-4xl will-change-transform"
          >
            <div key={current.id} className="animate-[fadeIn_0.5s_ease-out]">
              <p className="text-[11px] font-bold uppercase tracking-[0.38em] text-[#FCAA30]">
                {current.eyebrow}
              </p>

              <h1 className="mt-4 whitespace-pre-line font-display text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-white drop-shadow-[0_12px_36px_rgba(0,0,0,0.45)] lg:text-[76px]">
                {current.headline}
              </h1>

              {/* Minimalist Center Hairline Rule */}
              <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-[#FCAA30] to-transparent" />

              <p className="mx-auto mt-5 max-w-xl text-base font-normal leading-relaxed text-white/90 lg:text-[19px]">
                {current.subtitle}
              </p>

              {/* Centered Premium Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <PremiumHeroButton
                  href={current.primaryCta.href}
                  variant="mango"
                  onClick={() => trackAnalyticsEvent("rent_cta_click", { source: "hero" })}
                >
                  <span>{current.primaryCta.label}</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F0F0F] text-[#FCAA30] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-rotate-12">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </PremiumHeroButton>

                <PremiumHeroButton href={current.secondaryCta.href} variant="glass">
                  <span>{current.secondaryCta.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-[#FCAA30] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </PremiumHeroButton>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom 3D Interactive Glass Thumbnail Filmstrip */}
        <div className="aurum-container hero-perspective mt-6 w-full">
          <div
            ref={dockRef}
            className="preserve-3d mx-auto grid w-full max-w-4xl grid-cols-4 gap-3.5 will-change-transform"
          >
            {HERO_SLIDES.map((s, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`Select scene ${idx + 1}: ${s.thumbLabel}`}
                  className={`group relative w-full overflow-hidden rounded-2xl border p-1.5 text-left backdrop-blur-xl transition-all duration-300 ${
                    isActive
                      ? "border-[#FCAA30] bg-white/15 shadow-[0_14px_34px_rgba(0,0,0,0.45),0_0_20px_rgba(252,170,48,0.22)] -translate-y-1"
                      : "border-white/20 bg-black/40 opacity-80 hover:-translate-y-0.5 hover:border-white/40 hover:opacity-100"
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

      {/* Mobile Centered Through-The-Glass Hero (< md) */}
      <div className="relative z-10 flex flex-col px-5 pb-8 pt-10 text-center text-white md:hidden">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FCAA30]">
          {current.eyebrow}
        </p>

        <h1 className="mt-3 whitespace-pre-line font-display text-[36px] font-semibold leading-[0.98] tracking-[-0.04em] text-white">
          {current.headline}
        </h1>
        <div className="mx-auto mt-4 h-px w-14 bg-gradient-to-r from-transparent via-[#FCAA30] to-transparent" />
        <p className="mx-auto mt-3.5 max-w-sm text-sm leading-relaxed text-white/90">
          {current.subtitle}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <PremiumHeroButton
            href={current.primaryCta.href}
            variant="mango"
            fullWidth
            onClick={() => trackAnalyticsEvent("rent_cta_click", { source: "hero_mobile" })}
          >
            <span>{current.primaryCta.label}</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0F0F0F] text-[#FCAA30]">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </PremiumHeroButton>
          <PremiumHeroButton href={current.secondaryCta.href} variant="glass" fullWidth>
            <span>{current.secondaryCta.label}</span>
            <ArrowUpRight className="h-4 w-4 text-[#FCAA30]" />
          </PremiumHeroButton>
        </div>

        {/* Mobile Crisp Unblurred 3D Card Window + Scene Pills */}
        <div className="hero-perspective mt-7">
          <div className="preserve-3d relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-white/25 bg-black/40 p-1.5 shadow-elevated backdrop-blur-xl animate-[heroFloat3d_6.5s_ease-in-out_infinite]">
            <div className="relative h-full w-full overflow-hidden rounded-[20px]">
              <Image
                src={current.image}
                alt={current.alt}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
                <span className="rounded-full bg-black/65 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                  {current.thumbLabel}
                </span>
                <div className="flex gap-1.5">
                  {HERO_SLIDES.map((s, idx) => (
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
