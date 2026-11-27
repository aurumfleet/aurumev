"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Pause, Play, Quote } from "lucide-react";
import { RevealOnScroll } from "@/components/MotionPrimitives";
import {
  CinematicIntroBanner,
  RiderHighlightsStrip,
  ShareStoryCtaBanner,
} from "@/components/RiderStoriesParts";
import {
  RIDER_SECTION_COPY,
  resolveRiderStories,
  type DatabaseVerifiedTestimonial,
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
 * Minimalist Brushed-Chrome 3D Review Deck (Delhi & Noida, Hindi & English, zero duplicate preview card),
 * paired with Cinematic Intro Banner, Video Showcase, Highlights, and Share Story CTA.
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
    }, 4500);

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

  // Real-time 60fps Chrome Specular Reflection + Magnetic 3D Tilt
  function handleCardPointerMove(e: React.PointerEvent<HTMLDivElement>, isActive: boolean) {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;

    el.style.setProperty("--mx", `${(rx * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(ry * 100).toFixed(1)}%`);
    el.style.setProperty("--chrome-glow", "1");

    if (isActive) {
      const tiltY = ((rx - 0.5) * 14).toFixed(2);
      const tiltX = (-(ry - 0.5) * 10).toFixed(2);
      el.style.setProperty("--tilt-x", `${tiltX}deg`);
      el.style.setProperty("--tilt-y", `${tiltY}deg`);
    }
  }

  function handleCardPointerLeave(e: React.PointerEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    el.style.setProperty("--chrome-glow", "0");
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }

  // Touch & drag navigation
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
    if (Math.abs(delta) > 40) {
      stepStory(delta < 0 ? 1 : -1);
    }
  }

  return (
    <section
      id="rider-stories"
      aria-labelledby="rider-stories-heading"
      className="relative overflow-hidden border-t border-[#EBEBEB] bg-white py-20 text-[#0F0F0F] sm:py-28"
    >
      {/* Subtle Ambient Gold/Chrome Mist */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[780px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(252,170,48,0.06),rgba(148,163,184,0.07),transparent_70%)] blur-3xl"
      />

      <div className="aurum-container relative z-10">
        {/* SECTION HEADER (Aligned to Website Obsidian + Metallic Gold Typography) */}
        <RevealOnScroll className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C69A43]/30 bg-[#FAF7F0] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9E7524]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FCAA30]" />
            {RIDER_SECTION_COPY.eyebrow}
          </span>

          <h2
            id="rider-stories-heading"
            className="mt-4 font-display text-3xl font-semibold leading-[1.06] tracking-[-0.035em] text-[#0F0F0F] sm:text-5xl lg:text-[3.4rem]"
          >
            {RIDER_SECTION_COPY.headingLead}{" "}
            <span className="bg-gradient-to-r from-[#8E671D] via-[#FCAA30] to-[#8E671D] bg-clip-text text-transparent">
              {RIDER_SECTION_COPY.headingAccent}
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#666666] sm:text-base">
            {RIDER_SECTION_COPY.supportingHeadline}
          </p>
        </RevealOnScroll>

        {/* PART 1 — CINEMATIC INTRODUCTION */}
        <div className="mt-12">
          <CinematicIntroBanner />
        </div>

        {/* PART 2 — MINIMALIST BRUSHED-CHROME 3D REVIEW DECK (No Redundant Preview Below) */}
        <div id="rider-story-carousel" className="mt-20">
          <RevealOnScroll>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#9E7524]">
                  Delhi &amp; Noida Riders · हिंदी &amp; English
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-[#0F0F0F] sm:text-4xl">
                  Voices Moving Through the City
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setUserInteracted((p) => !p)}
                  aria-label={
                    userInteracted
                      ? "Resume automatic chrome deck"
                      : "Pause automatic chrome deck"
                  }
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#0F0F0F]/15 bg-[#F4F4F4] px-3.5 py-2 text-xs font-medium text-[#0F0F0F] transition hover:bg-[#EBEBEB]"
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0F0F0F]/15 bg-white text-[#0F0F0F] shadow-sm transition hover:border-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => stepStory(1)}
                  aria-label="Next rider review"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0F0F0F]/15 bg-white text-[#0F0F0F] shadow-sm transition hover:border-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 3D Precision Brushed-Chrome Orbital Stage */}
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
              aria-label="Delhi and Noida rider reviews carousel"
              className="partner-perspective relative mt-8 touch-pan-y select-none overflow-hidden py-6 focus:outline-none"
            >
              {/* Hairline Chrome Rail */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#94A3B8]/40 to-transparent"
              />

              <div className="relative mx-auto flex min-h-[268px] items-center justify-center sm:min-h-[280px]">
                {stories.map((story, idx) => {
                  const dist = getCircularDistance(idx, activeIndex, count);
                  const absDist = Math.abs(dist);
                  const isActive = dist === 0;
                  const isSide = absDist === 1;
                  const isVisible = absDist <= 1;

                  // Smooth spatial depth: active rises forward; flanking cards recede cleanly in 3D
                  const translateX = dist * 98;
                  const translateY = isActive ? -6 : isSide ? 8 : 18;
                  const rotateY = isActive ? 0 : dist * -18;
                  const rotateZ = isActive ? 0 : dist * 1.4;
                  const scale = isActive ? 1.03 : isSide ? 0.9 : 0.78;
                  const opacity = isActive ? 1 : isSide ? 0.65 : 0;
                  const zIndex = isActive ? 30 : isSide ? 20 : 10;

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
                          isActive ? 48 : -36
                        }px) rotateX(var(--tilt-x, 0deg)) rotateY(calc(${rotateY}deg + var(--tilt-y, 0deg))) rotateZ(${rotateZ}deg) scale(${scale})`,
                        opacity,
                        zIndex,
                        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                        pointerEvents: isVisible ? "auto" : "none",
                      }}
                      /* Brushed Metallic Chrome Outer Bevel Ring */
                      className={`group absolute w-[295px] rounded-[1.65rem] p-[1.5px] transition-all duration-[780ms] sm:w-[340px] ${
                        isActive
                          ? "bg-[linear-gradient(135deg,#FFFFFF_0%,#94A3B8_22%,#F8FAFC_48%,#FCAA30_74%,#CBD5E1_100%)] shadow-[0_26px_65px_rgba(15,15,15,0.14),0_2px_18px_rgba(148,163,184,0.28)]"
                          : "cursor-pointer bg-[linear-gradient(135deg,#E2E8F0_0%,#CBD5E1_50%,#F1F5F9_100%)] shadow-[0_12px_28px_rgba(15,15,15,0.06)]"
                      }`}
                    >
                      {/* Inner Anodized Polished Chrome Card Surface */}
                      <div
                        className={`relative flex h-full min-h-[228px] flex-col justify-between overflow-hidden rounded-[calc(1.65rem-1.5px)] px-5 py-5 backdrop-blur-2xl sm:min-h-[238px] sm:px-6 ${
                          isActive
                            ? "bg-[linear-gradient(155deg,#FFFFFF_0%,#F3F4F6_46%,#E5E7EB_100%)] motion-safe:animate-float-subtle"
                            : "bg-[linear-gradient(155deg,#FAFAFA_0%,#EFEFEF_100%)] hover:bg-white"
                        }`}
                      >
                        {/* Top Specular Chrome Horizon Reflection */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/95 to-transparent"
                        />

                        {/* Pointer-Tracked Mirror Chrome Reflection */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                          style={{
                            opacity: "var(--chrome-glow, 0)",
                            background:
                              "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.95), rgba(252,170,48,0.16) 38%, transparent 72%)",
                          }}
                        />

                        {/* Diagonal Brushed-Chrome Light Sweep on Active Card */}
                        {isActive && (
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 overflow-hidden"
                          >
                            <div
                              className="h-full w-1/2 motion-safe:animate-[partnerGoldSweep_4.4s_ease-in-out_infinite]"
                              style={{
                                background:
                                  "linear-gradient(110deg, transparent 15%, rgba(255,255,255,0.75) 45%, rgba(252,170,48,0.18) 54%, transparent 80%)",
                              }}
                            />
                          </div>
                        )}

                        <div className="relative z-10">
                          {/* Minimalist Top Bar: Language Tag + Gold Quote Icon */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0F0F0F]/10 bg-white/85 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0F0F0F] shadow-sm">
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  story.language === "Hindi" ? "bg-[#FCAA30]" : "bg-[#0F0F0F]"
                                }`}
                              />
                              {story.language === "Hindi" ? "हिंदी" : "English"}
                            </span>

                            <Quote className="h-4 w-4 text-[#C69A43]" />
                          </div>

                          {/* Crisp Single-Statement Review Quote */}
                          <blockquote className="mt-4 text-[13.5px] font-medium leading-[1.6] text-[#1F1F1F] sm:text-sm">
                            “{story.quote}”
                          </blockquote>
                        </div>

                        {/* Minimalist Brushed-Chrome Author Footer */}
                        <div className="relative z-10 mt-5 flex items-center justify-between gap-3 border-t border-[#0F0F0F]/10 pt-3.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold tracking-wider ${
                                isActive
                                  ? "border-white/70 bg-gradient-to-br from-[#1F1F1F] via-[#3A3D42] to-[#0F0F0F] text-[#FCAA30] shadow-md"
                                  : "border-[#CBD5E1] bg-gradient-to-br from-white to-[#E2E8F0] text-[#0F0F0F]"
                              }`}
                            >
                              {story.initials}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-display text-xs font-semibold text-[#0F0F0F] sm:text-[13px]">
                                {story.name}
                              </p>
                              <p className="truncate text-[11px] text-[#666666]">{story.role}</p>
                            </div>
                          </div>

                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#0F0F0F]/10 bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold text-[#0F0F0F]">
                            <MapPin className="h-2.5 w-2.5 text-[#FCAA30]" />
                            {story.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Minimalist Pagination Track */}
              <div className="mt-5 flex items-center justify-center gap-2">
                {stories.map((story, idx) => {
                  const selected = idx === activeIndex;
                  return (
                    <button
                      key={story.id}
                      type="button"
                      aria-label={`View review ${idx + 1}: ${story.name} (${story.city})`}
                      aria-current={selected ? "true" : undefined}
                      onClick={() => selectStory(idx, true)}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        selected
                          ? "w-8 bg-gradient-to-r from-[#0F0F0F] via-[#666666] to-[#FCAA30]"
                          : "w-2 bg-[#D4D4D8] hover:bg-[#A1A1AA]"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* PART 5 — RIDER EXPERIENCE HIGHLIGHTS */}
        <RiderHighlightsStrip />

        {/* PART 6 — SHARE YOUR STORY FULL-WIDTH CTA */}
        <ShareStoryCtaBanner />
      </div>
    </section>
  );
}
