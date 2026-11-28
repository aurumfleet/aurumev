"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  CalendarClock,
  Headset,
  MessageSquareHeart,
  Play,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { RevealOnScroll } from "@/components/MotionPrimitives";
import {
  RIDER_EXPERIENCE_HIGHLIGHTS,
  RIDER_SECTION_COPY,
  VERIFIED_RIDER_VIDEOS,
  type RiderVideoEntry,
} from "@/data/rider-stories";

const HIGHLIGHT_ICON_MAP = {
  "convenient-rental": ShieldCheck,
  "maintenance-support": Wrench,
  "flexible-plans": CalendarClock,
  "dedicated-assistance": Headset,
} as const;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * PART 1 — Wide cinematic urban EV banner with scroll parallax & word-by-word reveal.
 */
export function CinematicIntroBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setRevealed(true);
      return;
    }
    const el = bannerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    let rafId = 0;

    const updateParallax = () => {
      const wrap = bannerRef.current;
      const bg = bgRef.current;
      if (wrap && bg) {
        const rect = wrap.getBoundingClientRect();
        const vh = window.innerHeight || 900;
        const progress = Math.max(-1, Math.min(1, (vh / 2 - (rect.top + rect.height / 2)) / vh));
        const shiftY = progress * 16;
        bg.style.transform = `translate3d(0, ${shiftY.toFixed(1)}px, 0) scale(1.08)`;
      }
      rafId = 0;
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateParallax);
      }
    };

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion]);

  const headlineWords = RIDER_SECTION_COPY.cinematicBannerHeadline.split(" ");

  return (
    <div
      ref={bannerRef}
      className="relative overflow-hidden rounded-[2rem] border border-[#0F0F0F]/10 bg-[#0F0F0F] shadow-[0_28px_80px_rgba(15,15,15,0.16)]"
    >
      {/* Parallax Urban Banner Backdrop */}
      <div className="relative h-[460px] w-full overflow-hidden sm:h-[510px] lg:h-[540px]">
        <div
          ref={bgRef}
          className="pointer-events-none absolute -inset-y-10 inset-x-0"
          style={{ transform: "translate3d(0, 0, 0) scale(1.08)" }}
        >
          <Image
            src={RIDER_SECTION_COPY.cinematicBannerImage}
            alt={RIDER_SECTION_COPY.cinematicBannerAlt}
            fill
            sizes="(max-width: 768px) 100vw, 1360px"
            className="object-cover object-center sm:object-[64%_35%]"
          />
        </div>

        {/* Directional Website-Aligned Obsidian Scrims */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(15, 15, 15, 0.90) 0%, rgba(15, 15, 15, 0.58) 46%, rgba(15, 15, 15, 0.14) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(0deg, rgba(15, 15, 15, 0.86) 0%, rgba(15, 15, 15, 0.10) 48%, rgba(15, 15, 15, 0.36) 100%)",
          }}
        />

        {/* Banner Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-10 lg:p-14">
          {/* Top Glass Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#0F0F0F]/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FCAA30]" />
              Delhi &amp; Noida Rider Chronicles
            </span>
            <span className="hidden rounded-full border border-[#FCAA30]/40 bg-[#0F0F0F]/65 px-3.5 py-1 text-[11px] font-medium tracking-wide text-[#FCD38D] backdrop-blur-xl sm:inline-flex">
              Authentic Urban Journeys
            </span>
          </div>

          {/* Center-Left Editorial Quote Headline (Word-by-Word Reveal) */}
          <div className="my-6 max-w-2xl">
            <h3 className="font-display text-2xl font-semibold leading-[1.14] tracking-[-0.03em] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)] sm:text-4xl lg:text-[2.75rem]">
              {headlineWords.map((word, idx) => (
                <span
                  key={`${word}-${idx}`}
                  style={{
                    transitionDelay: revealed && !reducedMotion ? `${idx * 45}ms` : "0ms",
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                  className={`mr-[0.26em] inline-block transition-all duration-700 ${
                    revealed
                      ? "translate-y-0 opacity-100 blur-0"
                      : "translate-y-4 opacity-0 blur-[3px]"
                  } ${
                    word.toLowerCase().startsWith("journey")
                      ? "bg-gradient-to-r from-[#FCAA30] via-[#FFE0A3] to-[#FCAA30] bg-clip-text text-transparent"
                      : ""
                  }`}
                >
                  {word}
                </span>
              ))}
            </h3>
            <div className="mt-5 flex items-center gap-3">
              <span className="h-[2px] w-14 rounded-full bg-gradient-to-r from-[#FCAA30] to-white/60" />
              <p className="text-xs font-medium tracking-wide text-white/75 sm:text-sm">
                Aurum Fleet Solutions Pvt. Ltd. · Delhi &amp; Noida EV Mobility
              </p>
            </div>
          </div>

          {/* Bottom Scroll Indicator */}
          <div className="flex items-center justify-between gap-4">
            <a
              href="#rider-story-carousel"
              className="group inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-xl transition-all duration-300 hover:border-[#FCAA30]/70 hover:bg-white/15"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FCAA30] text-[#0F0F0F]">
                <ArrowDown className="h-3.5 w-3.5 motion-safe:animate-bounce" />
              </span>
              <span>Scroll to Explore Reviews</span>
            </a>

            <div className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/60 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FCAA30]" />
              <span>Swipe · Hover · Read</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PART 4 — Video Testimonial Gallery + Accessible Modal Video Player.
 * Shows genuine customer videos when configured; otherwise displays a tasteful "Coming Soon" showcase.
 */
export function VideoStoriesShowcase({
  verifiedVideos = VERIFIED_RIDER_VIDEOS,
}: {
  verifiedVideos?: RiderVideoEntry[];
}) {
  const [selectedVideo, setSelectedVideo] = useState<RiderVideoEntry | null>(null);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const hasVerifiedVideos = verifiedVideos.length > 0;
  const activePreview = hasVerifiedVideos ? verifiedVideos[0] : null;

  useEffect(() => {
    if (!selectedVideo && !showComingSoonModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedVideo(null);
        setShowComingSoonModal(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedVideo, showComingSoonModal]);

  return (
    <RevealOnScroll className="mt-20">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#9E7524]">
            Video Testimonial Experience
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-[#0F0F0F] sm:text-4xl">
            Rider Stories in Motion
          </h3>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-[#666666] sm:text-sm">
          {hasVerifiedVideos
            ? "Watch verified Aurum EV riders share first-hand experiences across Delhi & Noida routes."
            : "Only genuine customer-submitted and approved rider videos are published here."}
        </p>
      </div>

      {/* Large Cinematic Video Showcase Frame */}
      <div className="group relative mt-7 overflow-hidden rounded-[2rem] border border-[#0F0F0F]/10 bg-[#0F0F0F] shadow-[0_24px_70px_rgba(15,15,15,0.16)]">
        <div className="relative min-h-[360px] w-full sm:min-h-[420px] lg:aspect-[16/7.5] lg:min-h-[460px]">
          <Image
            src={activePreview?.thumbnailUrl || RIDER_SECTION_COPY.videoShowcasePoster}
            alt={
              activePreview
                ? `${activePreview.riderName} — ${activePreview.title}`
                : RIDER_SECTION_COPY.videoShowcaseAlt
            }
            fill
            sizes="(max-width: 768px) 100vw, 1360px"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />

          {/* Dark Translucent Overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(0deg, rgba(7, 17, 30, 0.92) 0%, rgba(7, 17, 30, 0.58) 52%, rgba(7, 17, 30, 0.42) 100%)",
            }}
          />

          {/* Center Glowing Circular Play Trigger */}
          <div className="relative z-10 flex min-h-[360px] flex-col items-center justify-center px-5 py-8 text-center sm:min-h-[420px] sm:p-8 lg:h-full">
            <button
              type="button"
              onClick={() => {
                if (activePreview) {
                  setSelectedVideo(activePreview);
                } else {
                  setShowComingSoonModal(true);
                }
              }}
              aria-label={
                activePreview
                  ? `Play video testimonial: ${activePreview.title}`
                  : "Open Rider Video Stories Coming Soon details"
              }
              className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:border-[#FCAA30] hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCAA30] sm:h-24 sm:w-24"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 rounded-full border border-[#FCAA30]/40 motion-safe:animate-ping"
                style={{ animationDuration: "2.8s" }}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-1.5 rounded-full border border-[#13B75E]/45"
              />
              <Play className="ml-1 h-8 w-8 fill-white text-white sm:h-9 sm:w-9" />
            </button>

            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#FCAA30]/35 bg-[#07111E]/75 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FCD38D] backdrop-blur-xl">
              <Sparkles className="h-3 w-3 text-[#FCAA30]" />
              {hasVerifiedVideos ? "Verified Rider Video" : "Rider Stories Coming Soon"}
            </span>

            <h4 className="mt-3 max-w-xl font-display text-xl font-semibold tracking-tight text-white sm:text-3xl">
              {activePreview
                ? activePreview.title
                : "Authentic Video Testimonials, Straight From Real Riders"}
            </h4>

            <p className="mt-2 max-w-lg text-xs leading-relaxed text-white/75 sm:text-sm">
              {activePreview
                ? `${activePreview.riderName} · ${activePreview.riderRole}${
                    activePreview.city ? ` · ${activePreview.city}` : ""
                  }`
                : "We publish unscripted customer video stories only with genuine rider consent. Click play to view submission guidelines or contribute yours."}
            </p>
          </div>
        </div>

        {/* Multi-video Selector Strip (Only shown if multiple real verified videos exist) */}
        {verifiedVideos.length > 1 && (
          <div className="grid gap-3 border-t border-white/10 bg-[#07111E]/95 p-4 sm:grid-cols-3 sm:p-5">
            {verifiedVideos.map((vid) => (
              <button
                key={vid.id}
                type="button"
                onClick={() => setSelectedVideo(vid)}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left transition hover:border-[#FCAA30]/60 hover:bg-white/[0.08]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FCAA30]/20 text-[#FCAA30]">
                  <Play className="ml-0.5 h-4 w-4 fill-current" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white">{vid.title}</p>
                  <p className="truncate text-[11px] text-white/60">
                    {vid.riderName}
                    {vid.city ? ` · ${vid.city}` : ""}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal Player for Verified Video */}
      {selectedVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedVideo.title}
          onClick={() => setSelectedVideo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-[#0A1422] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 text-white">
              <div>
                <p className="text-sm font-semibold">{selectedVideo.title}</p>
                <p className="text-xs text-white/65">
                  {selectedVideo.riderName} · {selectedVideo.riderRole}
                  {selectedVideo.city ? ` · ${selectedVideo.city}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                aria-label="Close video modal"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <video
                src={selectedVideo.videoUrl}
                poster={selectedVideo.thumbnailUrl}
                controls
                autoPlay
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Respectful Coming Soon Dialog (when no real customer videos exist yet) */}
      {showComingSoonModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-coming-soon-title"
          onClick={() => setShowComingSoonModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-[2rem] border border-white/25 bg-[#0B1624] p-7 text-white shadow-[0_32px_90px_rgba(0,0,0,0.65)]"
          >
            <button
              type="button"
              onClick={() => setShowComingSoonModal(false)}
              aria-label="Close notice"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="inline-flex items-center gap-2 rounded-full border border-[#13B75E]/40 bg-[#13B75E]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6EE7B7]">
              Rider Stories Coming Soon
            </span>
            <h4
              id="video-coming-soon-title"
              className="mt-4 font-display text-2xl font-semibold tracking-tight text-white"
            >
              Verified Rider Video Gallery
            </h4>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              Aurum Fleet Solutions Pvt. Ltd. does not publish scripted or synthetic video
              testimonials. Real video journeys recorded with active Aurum riders will appear here
              once reviewed and approved for publication.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact?topic=share-story"
                onClick={() => setShowComingSoonModal(false)}
                className="aurum-btn-premium-mango px-5 py-2.5 text-xs"
              >
                Share Your Video Experience <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setShowComingSoonModal(false)}
                className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-white/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </RevealOnScroll>
  );
}

/**
 * PART 5 — 4 Rider Experience Highlight Cards with Emerald & Gold Hairline Accents.
 */
export function RiderHighlightsStrip() {
  return (
    <RevealOnScroll className="mt-20">
      <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#9E7524]">
            Rider Experience Highlights
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-[#0F0F0F] sm:text-3xl">
            Built Around Practical Everyday Riding
          </h3>
        </div>
        <p className="max-w-md text-xs text-[#666666] sm:text-sm">
          Operational pillars structured to keep Delhi &amp; Noida riders supported under clear
          written rental agreements.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {RIDER_EXPERIENCE_HIGHLIGHTS.map((item, idx) => {
          const Icon = HIGHLIGHT_ICON_MAP[item.id as keyof typeof HIGHLIGHT_ICON_MAP] || ShieldCheck;
          const isGold = item.accent === "gold";
          return (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-3xl border border-[#CBD5E1]/70 bg-gradient-to-br from-white via-[#F8F9FB] to-[#ECEFF4] p-6 shadow-[0_14px_38px_rgba(15,15,15,0.06),inset_0_1px_1px_rgba(255,255,255,1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,15,15,0.11)]"
            >
              {/* Animated Chrome / Gold Top Accent Line */}
              <div
                aria-hidden="true"
                className={`absolute inset-x-0 top-0 h-[2px] origin-left scale-x-50 transition-transform duration-500 group-hover:scale-x-100 ${
                  isGold
                    ? "bg-gradient-to-r from-[#FCAA30] to-[#0F0F0F]"
                    : "bg-gradient-to-r from-[#0F0F0F] via-[#94A3B8] to-[#FCAA30]"
                }`}
              />

              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-105 ${
                    isGold
                      ? "border-[#FCAA30]/40 bg-[#FCAA30]/15 text-[#9E7524]"
                      : "border-[#0F0F0F]/15 bg-[#0F0F0F]/5 text-[#0F0F0F]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold tracking-[0.2em] text-[#828587]">
                  0{idx + 1}
                </span>
              </div>

              <h4 className="mt-5 font-display text-lg font-semibold tracking-tight text-[#0F0F0F]">
                {item.title}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-[#666666] sm:text-[13px]">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </RevealOnScroll>
  );
}

/**
 * PART 6 — Full-Width "Share Your Story" Campaign CTA Banner aligned to Website Obsidian + Gold Theme.
 */
export function ShareStoryCtaBanner() {
  return (
    <RevealOnScroll className="mt-20">
      <div className="relative overflow-hidden rounded-[2.25rem] border border-white/15 bg-gradient-to-br from-[#0B0C0E] via-[#121417] to-[#1B1813] p-8 text-white shadow-[0_28px_80px_rgba(0,0,0,0.28)] sm:p-12 lg:p-14">
        {/* Ambient Decorative Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#FCAA30]/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-white/[0.06] blur-3xl"
        />

        {/* Animated Chrome-Gold Top Accent Hairline */}
        <div
          aria-hidden="true"
          className="mb-7 h-[2px] w-24 rounded-full bg-gradient-to-r from-[#FCAA30] via-[#FFE0A3] to-white/70"
        />

        <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FCD38D] backdrop-blur-xl">
              <MessageSquareHeart className="h-3.5 w-3.5 text-[#FCAA30]" />
              Rider Community
            </span>

            <h3 className="mt-4 font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl lg:text-[2.6rem]">
              {RIDER_SECTION_COPY.shareCtaHeadline}
            </h3>

            <p className="mt-3.5 text-sm leading-relaxed text-white/75 sm:text-base">
              {RIDER_SECTION_COPY.shareCtaDescription}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 lg:shrink-0">
            <Link
              href="/contact?topic=share-story"
              className="aurum-btn-premium-mango px-7 py-3.5 text-sm"
            >
              Share Your Experience <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="aurum-btn-premium-glass px-7 py-3.5 text-sm"
            >
              Contact Aurum
            </Link>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}
