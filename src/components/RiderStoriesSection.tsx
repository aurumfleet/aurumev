"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pause,
  Play,
  Quote,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { RevealOnScroll } from "@/components/MotionPrimitives";
import {
  CinematicIntroBanner,
  RiderHighlightsStrip,
  ShareStoryCtaBanner,
  VideoStoriesShowcase,
} from "@/components/RiderStoriesParts";
import {
  RIDER_SECTION_COPY,
  resolveRiderStories,
  type DatabaseVerifiedTestimonial,
  type RiderStoryItem,
} from "@/data/rider-stories";

interface RiderStoriesSectionProps {
  verifiedTestimonials?: DatabaseVerifiedTestimonial[];
}

function getCircularDistance(index: number, active: number, length: number): number {
  if (length <= 1) return 0;
  let diff = index - active;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  return diff;
}

/**
 * SECTION 13 — "Rider Experiences & Testimonials"
 * Immersive editorial storytelling combining cinematic banner, interactive 3D carousel,
 * split-screen rider spotlight, video showcase, 4 highlights, and Share Your Story CTA.
 */
export function RiderStoriesSection({
  verifiedTestimonials = [],
}: RiderStoriesSectionProps) {
  const stories = resolveRiderStories(verifiedTestimonials);
  const count = stories.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);

  const pointerStartXRef = useRef<number | null>(null);
  const dragDeltaRef = useRef(0);
  const activeCardRef = useRef<HTMLDivElement>(null);

  const activeStory: RiderStoryItem = stories[activeIndex] ?? stories[0];

  // Auto-advance gently unless the visitor has interacted or prefers reduced motion
  useEffect(() => {
    if (userInteracted || count <= 1) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [userInteracted, count]);

  function selectStory(index: number, pauseAuto = true) {
    if (pauseAuto) setUserInteracted(true);
    const normalized = ((index % count) + count) % count;
    setActiveIndex(normalized);
  }

  function stepStory(delta: number) {
    selectStory(activeIndex + delta, true);
  }

  // 3D perspective tilt on hover for active panel
  function handleActiveCardMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !activeCardRef.current) return;
    const rect = activeCardRef.current.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;
    const rotY = ((rx - 0.5) * 9).toFixed(2);
    const rotX = (-(ry - 0.5) * 7).toFixed(2);
    activeCardRef.current.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.01, 1.01, 1.01)`;
  }

  function handleActiveCardLeave() {
    if (!activeCardRef.current) return;
    activeCardRef.current.style.transform =
      "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }

  // Touch / pointer swipe across carousel stage
  function handleStagePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    setUserInteracted(true);
    pointerStartXRef.current = e.clientX;
    dragDeltaRef.current = 0;
  }

  function handleStagePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (pointerStartXRef.current === null) return;
    const delta = e.clientX - pointerStartXRef.current;
    dragDeltaRef.current = delta;
    setDragOffsetPx(Math.max(-90, Math.min(90, delta * 0.45)));
  }

  function handleStagePointerEnd() {
    if (pointerStartXRef.current === null) return;
    const delta = dragDeltaRef.current;
    pointerStartXRef.current = null;
    dragDeltaRef.current = 0;
    setDragOffsetPx(0);
    if (Math.abs(delta) > 48) {
      stepStory(delta < 0 ? 1 : -1);
    }
  }

  return (
    <section
      id="rider-stories"
      aria-labelledby="rider-stories-heading"
      className="relative overflow-hidden border-t border-[#EBEBEB] bg-gradient-to-b from-white via-[#F9FAFB] to-white py-20 text-[#0B1F3A] sm:py-28"
    >
      {/* Subtle Background Halo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(19,183,94,0.06),rgba(252,170,48,0.05),transparent_70%)] blur-3xl"
      />

      <div className="aurum-container relative z-10">
        {/* SECTION HEADER */}
        <RevealOnScroll className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#0B1F3A]/10 bg-white/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#047857] shadow-[0_6px_22px_rgba(11,31,58,0.06)] backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-[#13B75E]" />
            {RIDER_SECTION_COPY.eyebrow}
          </span>

          <h2
            id="rider-stories-heading"
            className="mt-4 font-display text-3xl font-semibold leading-[1.06] tracking-[-0.035em] text-[#0B1F3A] sm:text-5xl lg:text-[3.4rem]"
          >
            {RIDER_SECTION_COPY.headingLead}{" "}
            <span className="bg-gradient-to-r from-[#047857] via-[#13B75E] to-[#C69A43] bg-clip-text text-transparent">
              {RIDER_SECTION_COPY.headingAccent}
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#475569] sm:text-base">
            {RIDER_SECTION_COPY.supportingHeadline}
          </p>
        </RevealOnScroll>

        {/* PART 1 — CINEMATIC INTRODUCTION */}
        <div className="mt-12">
          <CinematicIntroBanner />
        </div>

        {/* PART 2 — INTERACTIVE 3D RIDER STORY CAROUSEL */}
        <div id="rider-story-carousel" className="mt-20">
        <RevealOnScroll>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#9E7524]">
                Interactive Rider Carousel
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-[#0B1F3A] sm:text-4xl">
                Voices Moving Through the City
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setUserInteracted((p) => !p)}
                aria-label={userInteracted ? "Resume automatic story carousel" : "Pause automatic story carousel"}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#0F0F0F]/15 bg-white px-3.5 py-2 text-xs font-medium text-[#0B1F3A] shadow-sm transition hover:border-[#0B1F3A]/30"
              >
                {userInteracted ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                <span>{userInteracted ? "Paused" : "Auto-Play"}</span>
              </button>

              <button
                type="button"
                onClick={() => stepStory(-1)}
                aria-label="Previous rider story"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0F0F0F]/15 bg-white text-[#0B1F3A] shadow-sm transition hover:border-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => stepStory(1)}
                aria-label="Next rider story"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0F0F0F]/15 bg-white text-[#0B1F3A] shadow-sm transition hover:border-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 3D Interactive Horizontal Stage (swipe/drag enabled, zero page horizontal scroll) */}
          <div
            onPointerEnter={() => setUserInteracted(true)}
            onPointerDown={handleStagePointerDown}
            onPointerMove={handleStagePointerMove}
            onPointerUp={handleStagePointerEnd}
            onPointerCancel={handleStagePointerEnd}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") stepStory(-1);
              if (e.key === "ArrowRight") stepStory(1);
            }}
            tabIndex={0}
            aria-roledescription="carousel"
            aria-label="Rider stories carousel"
            className="partner-perspective relative mt-8 touch-pan-y select-none overflow-hidden py-4 focus:outline-none"
          >
            <div className="relative mx-auto flex min-h-[430px] items-center justify-center sm:min-h-[460px]">
              {stories.map((story, idx) => {
                const dist = getCircularDistance(idx, activeIndex, count);
                const isActive = dist === 0;
                const isVisibleSide = Math.abs(dist) === 1;

                // Hide distant items smoothly while keeping smooth enter/exit around active center
                const translateXPercent = dist * 76;
                const scale = isActive ? 1 : isVisibleSide ? 0.88 : 0.76;
                const opacity = isActive ? 1 : isVisibleSide ? 0.6 : 0;
                const zIndex = isActive ? 30 : isVisibleSide ? 20 : 10;

                return (
                  <div
                    key={story.id}
                    ref={isActive ? activeCardRef : undefined}
                    onClick={() => {
                      if (!isActive) selectStory(idx, true);
                    }}
                    onPointerMove={isActive ? handleActiveCardMove : undefined}
                    onPointerLeave={isActive ? handleActiveCardLeave : undefined}
                    style={{
                      transform: `translate3d(calc(${translateXPercent}% + ${dragOffsetPx}px), 0, ${
                        isActive ? 24 : -40
                      }px) scale(${scale})`,
                      opacity,
                      zIndex,
                      transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                      pointerEvents: isActive || isVisibleSide ? "auto" : "none",
                    }}
                    className={`group absolute w-full max-w-[340px] rounded-[2rem] border p-3.5 transition-all duration-700 sm:max-w-[540px] md:max-w-[660px] lg:max-w-[720px] ${
                      isActive
                        ? "border-white/95 bg-white/90 shadow-[0_28px_70px_rgba(11,31,58,0.14),inset_0_1px_1px_rgba(255,255,255,1)] ring-1 ring-[#C69A43]/25 backdrop-blur-2xl"
                        : "cursor-pointer border-[#0F0F0F]/10 bg-white/70 shadow-md backdrop-blur-md"
                    }`}
                  >
                    {/* Soft Gold Light Sweep across Active Panel */}
                    {isActive && (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]"
                      >
                        <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#FCAA30]/14 to-transparent motion-safe:animate-[partnerGoldSweep_5.5s_ease-in-out_infinite]" />
                      </div>
                    )}

                    <div className="relative z-10 grid items-center gap-5 sm:grid-cols-12">
                      {/* Rider Image Frame with Zoom on Hover */}
                      <div className="relative aspect-[16/11] overflow-hidden rounded-[1.5rem] bg-[#0B1F3A] sm:col-span-5 sm:aspect-[4/4.6]">
                        <Image
                          src={story.photoUrl}
                          alt={story.photoAlt}
                          fill
                          sizes="(max-width: 640px) 320px, 280px"
                          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-[#07111E]/75 via-transparent to-transparent"
                        />

                        {/* Slot / Verified Tag */}
                        <div className="absolute left-3 top-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-xl ${
                              story.isVerified
                                ? "border border-[#13B75E]/40 bg-[#07111E]/75 text-[#6EE7B7]"
                                : "border border-[#FCAA30]/45 bg-[#07111E]/75 text-[#FCD38D]"
                            }`}
                          >
                            {story.isVerified ? (
                              <>
                                <UserCheck className="h-3 w-3" /> Verified Story
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-3 w-3" /> Editable Slot
                              </>
                            )}
                          </span>
                        </div>

                        {/* Optional Video Button ONLY if real customer video exists */}
                        {story.videoUrl && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectStory(idx, true);
                            }}
                            aria-label={`Play video testimonial by ${story.name}`}
                            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-xl transition hover:scale-110 hover:bg-[#FCAA30] hover:text-[#0F0F0F]"
                          >
                            <Play className="ml-0.5 h-4 w-4 fill-current" />
                          </button>
                        )}
                      </div>

                      {/* Editorial Story Copy */}
                      <div className="flex flex-col justify-between p-1.5 sm:col-span-7 sm:p-3">
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9E7524]">
                            <span>{story.slotCode}</span>
                            {story.city ? (
                              <span className="inline-flex items-center gap-1 text-[#047857]">
                                <MapPin className="h-3 w-3" /> {story.city}
                              </span>
                            ) : (
                              <span className="text-[#64748B]">City · Verified upon publishing</span>
                            )}
                          </div>

                          <h4 className="mt-2.5 font-display text-xl font-semibold leading-snug tracking-tight text-[#0B1F3A] sm:text-2xl">
                            {story.storyTitle}
                          </h4>

                          <blockquote className="mt-3 text-xs leading-relaxed text-[#334155] sm:text-sm">
                            “{story.quote}”
                          </blockquote>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-[#0F0F0F]/10 pt-3.5">
                          <div>
                            <p className="font-display text-sm font-semibold text-[#0B1F3A]">
                              {story.name}
                            </p>
                            <p className="text-xs text-[#64748B]">{story.role}</p>
                          </div>
                          {story.isPlaceholder && (
                            <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#475569]">
                              Awaiting Real Review
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Dots */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {stories.map((story, idx) => {
                const selected = idx === activeIndex;
                return (
                  <button
                    key={story.id}
                    type="button"
                    aria-label={`View story ${idx + 1}: ${story.name}`}
                    aria-current={selected ? "true" : undefined}
                    onClick={() => selectStory(idx, true)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      selected
                        ? "w-8 bg-gradient-to-r from-[#047857] to-[#C69A43]"
                        : "w-2.5 bg-[#CBD5E1] hover:bg-[#94A3B8]"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </RevealOnScroll>
        </div>

        {/* PART 3 — SPLIT-SCREEN IMMERSIVE "MEET THE RIDER" EXPERIENCE */}
        <RevealOnScroll className="mt-20">
          <div className="overflow-hidden rounded-[2.25rem] border border-white/90 bg-white/85 shadow-[0_24px_70px_rgba(11,31,58,0.08),inset_0_1px_1px_rgba(255,255,255,1)] ring-1 ring-[#0F0F0F]/[0.05] backdrop-blur-2xl">
            <div
              key={activeStory.id}
              className="grid items-stretch motion-safe:animate-[fadeIn_0.55s_ease-out] lg:grid-cols-12"
            >
              {/* LEFT SIDE: Large Portrait Frame */}
              <div className="relative min-h-[340px] overflow-hidden bg-[#07111E] sm:min-h-[440px] lg:col-span-5">
                <Image
                  src={activeStory.photoUrl}
                  alt={activeStory.photoAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover object-center transition-transform duration-700"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#07111E]/90 via-[#07111E]/25 to-transparent"
                />

                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 rounded-2xl border border-white/25 bg-[#07111E]/80 p-4 text-white shadow-[0_12px_32px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:inset-x-5 sm:bottom-5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FCD38D]">
                      {activeStory.slotCode}
                    </p>
                    <p className="mt-0.5 font-display text-lg font-semibold">{activeStory.name}</p>
                    <p className="text-xs text-white/80">{activeStory.role}</p>
                  </div>
                  {activeStory.city && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#13B75E]/25 px-2.5 py-1 text-[11px] font-medium text-[#6EE7B7]">
                      <MapPin className="h-3 w-3" /> {activeStory.city}
                    </span>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE: Editorial "Meet the Rider" Narrative Panel */}
              <div className="flex flex-col justify-between p-7 sm:p-10 lg:col-span-7 lg:p-12">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#047857]/20 bg-[#ECFDF5] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#047857]">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Meet the Rider
                    </span>
                    <span className="font-display text-xs font-semibold tracking-[0.2em] text-[#64748B]">
                      {String(activeIndex + 1).padStart(2, "0")} /{" "}
                      {String(count).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-[#0B1F3A] sm:text-4xl">
                    {activeStory.storyTitle}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-[#9E7524]">
                    {activeStory.name} · {activeStory.role}
                  </p>

                  <p className="mt-5 text-sm leading-relaxed text-[#475569] sm:text-base">
                    {activeStory.experienceSummary}
                  </p>

                  {/* Pull Quote Card */}
                  <div className="relative mt-7 rounded-2xl border border-[#0F0F0F]/10 bg-[#F8FAFC] p-5 sm:p-6">
                    <Quote className="h-6 w-6 text-[#C69A43]/60" />
                    <p className="mt-2 font-display text-base font-medium leading-relaxed text-[#0B1F3A] sm:text-lg">
                      “{activeStory.quote}”
                    </p>
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">
                      {activeStory.isVerified
                        ? "Verified Aurum Rider Feedback"
                        : "Editable Template · Will display real verified rider quote once published"}
                    </p>
                  </div>
                </div>

                {/* Story Switch Controls */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#0F0F0F]/10 pt-5">
                  <div className="flex flex-wrap gap-2">
                    {stories.map((s, idx) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => selectStory(idx, true)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                          idx === activeIndex
                            ? "bg-[#0B1F3A] text-white shadow-sm"
                            : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] hover:text-[#0B1F3A]"
                        }`}
                      >
                        0{idx + 1}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => stepStory(-1)}
                      className="inline-flex items-center gap-1 rounded-full border border-[#0F0F0F]/15 px-4 py-2 text-xs font-semibold text-[#0B1F3A] transition hover:bg-[#0B1F3A] hover:text-white"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" /> Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => stepStory(1)}
                      className="inline-flex items-center gap-1 rounded-full border border-[#0F0F0F]/15 px-4 py-2 text-xs font-semibold text-[#0B1F3A] transition hover:bg-[#0B1F3A] hover:text-white"
                    >
                      Next <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* PART 4 — VIDEO TESTIMONIAL EXPERIENCE */}
        <VideoStoriesShowcase />

        {/* PART 5 — RIDER EXPERIENCE HIGHLIGHTS */}
        <RiderHighlightsStrip />

        {/* PART 6 — SHARE YOUR STORY FULL-WIDTH CTA */}
        <ShareStoryCtaBanner />
      </div>
    </section>
  );
}
