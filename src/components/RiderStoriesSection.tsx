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
 * Features Part 1 Cinematic Urban Banner, Part 2 Compact Text-Only 3D Kinetic Review Deck
 * (Hindi & English stories, zero images inside review cards), Part 3 Split-Screen Spotlight
 * (with user-provided Aurum photography), Part 4 Video Showcase, Part 5 Highlights, Part 6 CTA.
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

  const activeStory: RiderStoryItem = stories[activeIndex] ?? stories[0];

  // Auto-advance gently unless visitor interacted or reduced motion is active
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
    }, 4800);

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

  // Unique pointer-driven 3D magnetic tilt + specular Liquid Glass spotlight per card
  function handleCardPointerMove(e: React.PointerEvent<HTMLDivElement>, isActive: boolean) {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;

    el.style.setProperty("--mx", `${(rx * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(ry * 100).toFixed(1)}%`);
    el.style.setProperty("--glow-on", "1");

    if (isActive) {
      const tiltY = ((rx - 0.5) * 12).toFixed(2);
      const tiltX = (-(ry - 0.5) * 9).toFixed(2);
      el.style.setProperty("--tilt-x", `${tiltX}deg`);
      el.style.setProperty("--tilt-y", `${tiltY}deg`);
    }
  }

  function handleCardPointerLeave(e: React.PointerEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    el.style.setProperty("--glow-on", "0");
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }

  // Mobile & desktop pointer drag / swipe
  function handleStagePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    setUserInteracted(true);
    pointerStartXRef.current = e.clientX;
    dragDeltaRef.current = 0;
  }

  function handleStagePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (pointerStartXRef.current === null) return;
    const delta = e.clientX - pointerStartXRef.current;
    dragDeltaRef.current = delta;
    setDragOffsetPx(Math.max(-85, Math.min(85, delta * 0.45)));
  }

  function handleStagePointerEnd() {
    if (pointerStartXRef.current === null) return;
    const delta = dragDeltaRef.current;
    pointerStartXRef.current = null;
    dragDeltaRef.current = 0;
    setDragOffsetPx(0);
    if (Math.abs(delta) > 42) {
      stepStory(delta < 0 ? 1 : -1);
    }
  }

  return (
    <section
      id="rider-stories"
      aria-labelledby="rider-stories-heading"
      className="relative overflow-hidden border-t border-[#EBEBEB] bg-gradient-to-b from-white via-[#F9FAFB] to-white py-20 text-[#0B1F3A] sm:py-28"
    >
      {/* Subtle Ambient Background Halo */}
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

        {/* PART 2 — COMPACT ZERO-IMAGE 3D KINETIC RIDER REVIEW DECK */}
        <div id="rider-story-carousel" className="mt-20">
          <RevealOnScroll>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#9E7524]">
                  Rider Voices · हिंदी &amp; English
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-[#0B1F3A] sm:text-4xl">
                  Voices Moving Through the City
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setUserInteracted((p) => !p)}
                  aria-label={
                    userInteracted
                      ? "Resume automatic review deck"
                      : "Pause automatic review deck"
                  }
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#0F0F0F]/15 bg-white px-3.5 py-2 text-xs font-medium text-[#0B1F3A] shadow-sm transition hover:border-[#0B1F3A]/30"
                >
                  {userInteracted ? (
                    <Play className="h-3.5 w-3.5" />
                  ) : (
                    <Pause className="h-3.5 w-3.5" />
                  )}
                  <span>{userInteracted ? "Paused" : "Auto-Play"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => stepStory(-1)}
                  aria-label="Previous rider review"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0F0F0F]/15 bg-white text-[#0B1F3A] shadow-sm transition hover:border-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => stepStory(1)}
                  aria-label="Next rider review"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0F0F0F]/15 bg-white text-[#0B1F3A] shadow-sm transition hover:border-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 3D Compact Orbital Kinetic Deck (Zero Images Inside Review Cards) */}
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
              aria-label="Rider reviews carousel"
              className="partner-perspective relative mt-8 touch-pan-y select-none overflow-hidden py-4 focus:outline-none"
            >
              {/* Soft Horizontal Energy Orbit Behind Cards */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#C69A43]/35 to-transparent"
              />

              <div className="relative mx-auto flex min-h-[300px] items-center justify-center sm:min-h-[315px]">
                {stories.map((story, idx) => {
                  const dist = getCircularDistance(idx, activeIndex, count);
                  const absDist = Math.abs(dist);
                  const isActive = dist === 0;
                  const isVisible = absDist <= 1;

                  // Unique fanned 3D orbital curve across compact cards
                  const translateX = dist * 92;
                  const translateY = isActive ? -6 : absDist === 1 ? 10 : 22;
                  const rotateY = isActive ? 0 : dist * -14;
                  const rotateZ = isActive ? 0 : dist * 1.8;
                  const scale = isActive ? 1.03 : absDist === 1 ? 0.91 : 0.8;
                  const opacity = isActive ? 1 : absDist === 1 ? 0.72 : 0;
                  const zIndex = isActive ? 30 : absDist === 1 ? 20 : 10;

                  return (
                    <div
                      key={story.id}
                      onClick={() => {
                        if (!isActive) selectStory(idx, true);
                      }}
                      onPointerMove={(e) => handleCardPointerMove(e, isActive)}
                      onPointerLeave={handleCardPointerLeave}
                      style={{
                        transform: `translate3d(calc(${translateX}% + ${dragOffsetPx}px), ${translateY}px, ${
                          isActive ? 36 : -30
                        }px) rotateX(var(--tilt-x, 0deg)) rotateY(calc(${rotateY}deg + var(--tilt-y, 0deg))) rotateZ(${rotateZ}deg) scale(${scale})`,
                        opacity,
                        zIndex,
                        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                        pointerEvents: isVisible ? "auto" : "none",
                      }}
                      className={`group absolute w-[295px] rounded-[1.75rem] p-[1.5px] transition-all duration-700 sm:w-[345px] ${
                        isActive
                          ? "bg-gradient-to-br from-[#FCAA30]/65 via-white to-[#13B75E]/60 shadow-[0_24px_60px_rgba(11,31,58,0.14),0_0_28px_rgba(252,170,48,0.16)]"
                          : "cursor-pointer bg-gradient-to-br from-[#CBD5E1]/60 via-white to-[#CBD5E1]/60 shadow-[0_12px_30px_rgba(11,31,58,0.06)]"
                      }`}
                    >
                      {/* Compact Inner Liquid Glass Card (Strictly Text-Only, Zero Images) */}
                      <div
                        className={`relative flex h-full flex-col justify-between overflow-hidden rounded-[calc(1.75rem-1.5px)] px-5 py-5 backdrop-blur-2xl sm:px-6 sm:py-5 ${
                          isActive
                            ? "bg-white/[0.92] motion-safe:animate-float-subtle"
                            : "bg-white/80 hover:bg-white/90"
                        }`}
                      >
                        {/* Cursor Optical Specular Sheen */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                          style={{
                            opacity: "var(--glow-on, 0)",
                            background:
                              "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(252,170,48,0.16), rgba(19,183,94,0.06) 45%, transparent 72%)",
                          }}
                        />

                        {/* Active Card Sweeping Gold Prismatic Shimmer */}
                        {isActive && (
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 overflow-hidden"
                          >
                            <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#FCAA30]/20 to-transparent motion-safe:animate-[partnerGoldSweep_4.8s_ease-in-out_infinite]" />
                          </div>
                        )}

                        <div className="relative z-10">
                          {/* Top Meta Row */}
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                                story.language === "Hindi"
                                  ? "border border-[#FCAA30]/40 bg-[#FFF8EB] text-[#9E7524]"
                                  : "border border-[#13B75E]/30 bg-[#ECFDF5] text-[#047857]"
                              }`}
                            >
                              <Sparkles className="h-2.5 w-2.5" />
                              {story.language === "Hindi" ? "हिंदी रिव्यू" : "English"}
                            </span>

                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#64748B]">
                              <Quote className="h-3.5 w-3.5 text-[#C69A43]" />
                              {story.slotCode}
                            </span>
                          </div>

                          {/* Story Headline + Quote */}
                          <h4 className="mt-3 font-display text-base font-semibold leading-snug tracking-tight text-[#0B1F3A]">
                            {story.storyTitle}
                          </h4>

                          <blockquote className="mt-2 line-clamp-4 text-[13px] leading-relaxed text-[#334155]">
                            “{story.quote}”
                          </blockquote>
                        </div>

                        {/* Compact Monogram Footer (No Photo Needed) */}
                        <div className="relative z-10 mt-4 flex items-center justify-between gap-3 border-t border-[#0F0F0F]/10 pt-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold tracking-wider shadow-inner ${
                                isActive
                                  ? "bg-gradient-to-br from-[#0B1F3A] to-[#047857] text-[#FCD38D]"
                                  : "bg-[#F1F5F9] text-[#0B1F3A]"
                              }`}
                            >
                              {story.initials}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-display text-xs font-semibold text-[#0B1F3A] sm:text-sm">
                                {story.name}
                              </p>
                              <p className="truncate text-[11px] text-[#64748B]">{story.role}</p>
                            </div>
                          </div>

                          {story.city && (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#F8FAFC] px-2 py-0.5 text-[10px] font-semibold text-[#047857] ring-1 ring-[#0F0F0F]/5">
                              <MapPin className="h-2.5 w-2.5" />
                              {story.city}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Indicators */}
              <div className="mt-4 flex items-center justify-center gap-2">
                {stories.map((story, idx) => {
                  const selected = idx === activeIndex;
                  return (
                    <button
                      key={story.id}
                      type="button"
                      aria-label={`View review ${idx + 1}: ${story.name}`}
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

        {/* PART 3 — SPLIT-SCREEN IMMERSIVE "MEET THE RIDER" EXPERIENCE (User-Provided Aurum Photos) */}
        <RevealOnScroll className="mt-20">
          <div className="overflow-hidden rounded-[2.25rem] border border-white/90 bg-white/85 shadow-[0_24px_70px_rgba(11,31,58,0.08),inset_0_1px_1px_rgba(255,255,255,1)] ring-1 ring-[#0F0F0F]/[0.05] backdrop-blur-2xl">
            <div
              key={activeStory.id}
              className="grid items-stretch motion-safe:animate-[fadeIn_0.55s_ease-out] lg:grid-cols-12"
            >
              {/* LEFT SIDE: User-Provided Aurum EV Portrait Frame */}
              <div className="relative min-h-[340px] overflow-hidden bg-[#07111E] sm:min-h-[430px] lg:col-span-5">
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
                      RIDER SPOTLIGHT · {activeStory.slotCode}
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
                    {activeStory.city ? ` · ${activeStory.city}` : ""}
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
                      {activeStory.language === "Hindi"
                        ? "Aurum Rider Experience · Hindi"
                        : "Aurum Rider Experience · English"}
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
                        {s.slotCode}
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
