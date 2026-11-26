"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics";

interface HeroSlide {
  id: string;
  eyebrow: string;
  headline: string;
  subtitle: string;
  captionLabel: string;
  captionValue: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image: string;
  alt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "commuter",
    eyebrow: "AURUM EV · URBAN ELECTRIC MOBILITY",
    headline: "EMPOWERING RIDERS.\nDRIVING THE FUTURE.",
    subtitle:
      "Flexible zero-fuel electric two-wheeler rentals for daily commuters, delivery partners, and structured fleet partnerships.",
    captionLabel: "AURUM COMMUTER SERIES",
    captionValue: "Zero Fuel · Fixed Transparent Rent",
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
    captionLabel: "QUICK-COMMERCE READY",
    captionValue: "High Uptime · Hub Service Support",
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
    captionLabel: "DOORSTEP MOBILITY",
    captionValue: "All-In Preventive Maintenance",
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
    captionLabel: "CORPORATE SOLUTIONS",
    captionValue: "Bulk Deployments · Fleet SLA",
    primaryCta: { label: "Business Solutions", href: "/business#proposal" },
    secondaryCta: { label: "Explore Fleet", href: "/fleet" },
    image: "/images/aurum-instamart-hero.jpg",
    alt: "Swiggy Instamart doorstep delivery with an Aurum EV fleet scooter",
  },
];

const TRUST_POINTS = ["Fixed Rent", "Scheduled Maintenance", "No Hidden Charges"];

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
  const copyParallaxRef = useRef<HTMLDivElement>(null);
  const stage3dRef = useRef<HTMLDivElement>(null);
  const stageRimRef = useRef<HTMLDivElement>(null);
  const stageInnerPhotoRef = useRef<HTMLDivElement>(null);
  const stageSheenRef = useRef<HTMLDivElement>(null);
  const stageCaptionRef = useRef<HTMLDivElement>(null);

  const pointer = useRef({
    targetX: 0.66,
    targetY: 0.48,
    curX: 0.66,
    curY: 0.48,
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

      const idleNx = Math.sin(clock * 0.65) * 0.18;
      const idleNy = Math.cos(clock * 0.5) * 0.12;

      const destNx = p.inside ? p.targetNx : idleNx;
      const destNy = p.inside ? p.targetNy : idleNy;
      const destX = p.inside ? p.targetX : 0.68 + Math.sin(clock * 0.4) * 0.05;
      const destY = p.inside ? p.targetY : 0.46 + Math.cos(clock * 0.35) * 0.04;
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

      // Warm champagne-gold optical spotlight across soft blurred scene (zero blue tint)
      if (ambientLightRef.current) {
        const pulseBoost = p.pressPulse * 0.24;
        const a1 = (0.18 * p.intensity + pulseBoost).toFixed(3);
        const a2 = (0.07 * p.intensity + pulseBoost * 0.5).toFixed(3);
        ambientLightRef.current.style.background = `radial-gradient(${640 + p.pressPulse * 140}px circle at ${pctX}% ${pctY}%, rgba(252,170,48,${a1}), rgba(255,244,225,${a2}) 42%, transparent 72%)`;
      }

      // Layer -1: Deep blurred backdrop counter-parallax
      if (bgParallaxRef.current) {
        const px = (-p.nx * 16).toFixed(2);
        const py = (-p.ny * 12).toFixed(2);
        bgParallaxRef.current.style.transform = `scale(1.06) translate3d(${px}px, ${py}px, 0)`;
      }

      // Layer 0: Subtle editorial copy parallax
      if (copyParallaxRef.current) {
        const cx = (p.nx * 5).toFixed(2);
        const cy = (p.ny * 4).toFixed(2);
        copyParallaxRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      }

      // Layer +1: Main 3D glass window tilt + dynamic shadow offset + click recoil
      if (stage3dRef.current) {
        const floatY = Math.sin(clock * 1.1) * 6;
        const rotY = (p.nx * 13).toFixed(2);
        const rotX = (-p.ny * 10).toFixed(2);
        const tx = (p.nx * 9).toFixed(2);
        const ty = (p.ny * 6 + floatY).toFixed(2);
        const pressZ = (-p.pressPulse * 16).toFixed(2);
        const pressScale = (1 - p.pressPulse * 0.025).toFixed(4);
        stage3dRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translate3d(${tx}px, ${ty}px, ${pressZ}px) scale(${pressScale})`;

        const shX = (-p.nx * 24).toFixed(1);
        const shY = (28 - p.ny * 18).toFixed(1);
        stage3dRef.current.style.filter = `drop-shadow(${shX}px ${shY}px 42px rgba(0,0,0,0.48))`;
      }

      // Cursor-angled champagne metallic rim reflection
      if (stageRimRef.current) {
        const angle = Math.atan2(p.ny, p.nx) * (180 / Math.PI) + 90;
        stageRimRef.current.style.background = `linear-gradient(${angle.toFixed(1)}deg, rgba(252,170,48,0.85), rgba(255,255,255,0.45) 45%, rgba(252,170,48,0.18) 80%, rgba(255,255,255,0.55))`;
      }

      // Layer +2: Internal 3D window depth shift (creates real parallax portal effect)
      if (stageInnerPhotoRef.current) {
        const ix = (p.nx * 8).toFixed(2);
        const iy = (p.ny * 6).toFixed(2);
        stageInnerPhotoRef.current.style.transform = `translateZ(30px) scale(1.07) translate3d(${ix}px, ${iy}px, 0)`;
      }

      // Layer +3: Floating minimalist caption depth
      if (stageCaptionRef.current) {
        const fx = (p.nx * 14).toFixed(2);
        const fy = (p.ny * 10).toFixed(2);
        stageCaptionRef.current.style.transform = `translateZ(68px) translate3d(${fx}px, ${fy}px, 0)`;
      }

      // Specular glass sheen following pointer
      if (stageSheenRef.current) {
        const sx = 50 + p.nx * 40;
        const sy = 50 + p.ny * 40;
        const sa = p.inside ? 0.24 : 0.11;
        stageSheenRef.current.style.background = `radial-gradient(360px circle at ${sx.toFixed(1)}% ${sy.toFixed(1)}%, rgba(255,255,255,${sa}), rgba(252,170,48,0.08) 40%, transparent 68%)`;
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
  }

  function handlePointerDown() {
    pointer.current.pressPulse = 1;
  }

  function handlePointerLeave() {
    pointer.current.inside = false;
  }

  function stepSlide(dir: -1 | 1) {
    setActiveIdx((prev) => (prev + dir + HERO_SLIDES.length) % HERO_SLIDES.length);
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
      className="relative w-full overflow-hidden bg-[#141414]"
    >
      {/* Warm Champagne Optical Studio Glow */}
      <div
        ref={ambientLightRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] hidden md:block"
      />

      {/* Desktop Minimalist 3D Hero (md+) */}
      <div className="relative hidden min-h-[86vh] w-full md:flex md:items-center">
        {/* Softly Blurred Full-Bleed User Photo Backdrop (zero dark-blue cast) */}
        <div
          ref={bgParallaxRef}
          className="pointer-events-none absolute inset-0 will-change-transform"
          style={{ transform: "scale(1.06)" }}
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
                className="scale-105 object-cover object-center blur-[5px]"
                sizes="100vw"
              />
              {/* Neutral warm-obsidian editorial gradient for crisp text contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/48 to-black/22" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/28" />
            </div>
          ))}
        </div>

        {/* Hero Foreground Grid */}
        <div className="aurum-container relative z-10 grid w-full items-center gap-12 pb-16 pt-20 lg:grid-cols-12">
          {/* Left Minimalist Editorial Column */}
          <div
            ref={copyParallaxRef}
            className="text-white will-change-transform lg:col-span-6"
          >
            <div key={current.id} className="animate-[fadeIn_0.5s_ease-out]">
              <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.32em] text-[#FCAA30]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FCAA30]" />
                {current.eyebrow}
              </p>

              <h1 className="mt-4 whitespace-pre-line font-display text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] lg:text-[72px]">
                {current.headline}
              </h1>

              <p className="mt-5 max-w-lg text-lg font-normal leading-relaxed text-white/88 lg:text-[20px]">
                {current.subtitle}
              </p>

              {/* Minimalist Trust Line */}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium tracking-wide text-white/80">
                {TRUST_POINTS.map((item, i) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    {i > 0 && <span className="h-1 w-1 rounded-full bg-[#FCAA30]/75" />}
                    {item}
                  </span>
                ))}
              </div>

              {/* Premium Interactive Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
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

            {/* Minimalist Slide Controls */}
            <div className="mt-11 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => stepSlide(-1)}
                  aria-label="Previous slide"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition duration-200 hover:border-[#FCAA30] hover:bg-[#FCAA30] hover:text-[#0F0F0F]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => stepSlide(1)}
                  aria-label="Next slide"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition duration-200 hover:border-[#FCAA30] hover:bg-[#FCAA30] hover:text-[#0F0F0F]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {HERO_SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`View slide ${idx + 1}: ${s.eyebrow}`}
                    onClick={() => setActiveIdx(idx)}
                    className="relative h-1 w-12 overflow-hidden rounded-full bg-white/30 transition-all hover:bg-white/55"
                  >
                    {idx === activeIdx && (
                      <span
                        key={`prog-${activeIdx}-${paused ? "p" : "r"}`}
                        className={`absolute inset-y-0 left-0 rounded-full bg-[#FCAA30] ${
                          paused ? "w-full" : "animate-slide-progress"
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Minimalist 3D Portal Frame (Crisp Unblurred Aurum EV Photo) */}
          <div className="hero-perspective hidden lg:col-span-6 lg:block">
            <div
              ref={stage3dRef}
              className="preserve-3d relative mx-auto aspect-[16/11] w-full max-w-[580px] will-change-transform"
            >
              {/* Metallic Champagne Hairline Frame */}
              <div
                ref={stageRimRef}
                className="preserve-3d relative h-full w-full rounded-[30px] p-[1.5px]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(252,170,48,0.75), rgba(255,255,255,0.4) 50%, rgba(252,170,48,0.3))",
                }}
              >
                <div className="preserve-3d relative h-full w-full overflow-hidden rounded-[29px] bg-[#141414]/65 p-2 backdrop-blur-xl">
                  {/* Specular Glass Sheen */}
                  <div
                    ref={stageSheenRef}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-20 rounded-[29px]"
                  />

                  {/* Layer +2: Crisp Unblurred Photo Shifting Inside 3D Frame */}
                  <div className="preserve-3d relative h-full w-full overflow-hidden rounded-[22px]">
                    <div
                      ref={stageInnerPhotoRef}
                      className="relative h-full w-full will-change-transform"
                      style={{ transform: "translateZ(30px) scale(1.07)" }}
                    >
                      <Image
                        key={current.image}
                        src={current.image}
                        alt={current.alt}
                        fill
                        priority
                        className="object-cover object-center transition-opacity duration-700"
                        sizes="580px"
                      />
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  </div>

                  {/* Layer +3: Single Minimalist Floating Glass Caption */}
                  <div
                    ref={stageCaptionRef}
                    className="absolute inset-x-6 bottom-6 z-30 flex items-center justify-between gap-4 rounded-2xl border border-white/25 bg-black/50 px-5 py-3.5 text-white backdrop-blur-2xl will-change-transform"
                    style={{ transform: "translateZ(68px)" }}
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#FCAA30]">
                        {current.captionLabel}
                      </p>
                      <p className="mt-0.5 font-display text-sm font-medium tracking-tight text-white">
                        {current.captionValue}
                      </p>
                    </div>
                    <Link
                      href="/fleet"
                      aria-label="Explore AURUM EV Fleet"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FCAA30] text-[#0F0F0F] transition-transform duration-300 hover:scale-110"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Minimalist 3D Hero (< md) */}
      <div className="relative flex flex-col overflow-hidden bg-[#141414] text-white md:hidden">
        {/* Soft Blurred Mobile Backdrop */}
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={current.image}
            alt={current.alt}
            fill
            priority
            className="scale-105 object-cover opacity-50 blur-[4px]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/85" />
        </div>

        <div className="relative z-10 px-5 pb-6 pt-9 text-center">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.26em] text-[#FCAA30]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FCAA30]" />
            {current.eyebrow}
          </p>

          <h1 className="mt-3 whitespace-pre-line font-display text-[36px] font-semibold leading-[0.98] tracking-[-0.04em] text-white">
            {current.headline}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/85">
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
        </div>

        {/* Mobile 3D Floating Crisp Photo Window */}
        <div className="hero-perspective relative z-10 px-4 pb-8">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
                {HERO_SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Slide ${idx + 1}`}
                    onClick={() => setActiveIdx(idx)}
                    className={`h-1 rounded-full transition-all ${
                      idx === activeIdx ? "w-9 bg-[#FCAA30]" : "w-4 bg-white/55"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
