"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { RevealOnScroll } from "./MotionPrimitives";

const SHOWCASE_VIEWS = [
  {
    id: "asset",
    label: "01 · EV Asset",
    caption: "White-Gold Aurum EV Flagship Scooter",
    image: "/images/aurum-ev-studio.png",
    alt: "Studio profile of the white and gold Aurum EV electric two-wheeler",
    isStudio: true,
  },
  {
    id: "fleet",
    label: "02 · Delivery Ops",
    caption: "Last-Mile Doorstep Fleet Operations",
    image: "/images/aurum-zepto.jpg",
    alt: "Aurum EV electric scooter supporting quick-commerce doorstep delivery",
    isStudio: false,
  },
  {
    id: "b2b",
    label: "03 · B2B Scale",
    caption: "Enterprise & Logistics Fleet Leasing",
    image: "/images/aurum-porter.jpg",
    alt: "Aurum EV electric fleet serving enterprise logistics operations",
    isStudio: false,
  },
];

const COMPANY_FACTS = [
  {
    code: "01",
    label: "COMPANY NAME",
    value: "Aurum Fleet Solutions Private Limited",
  },
  {
    code: "02",
    label: "INCORPORATION DATE",
    value: "21 May 2026",
  },
  {
    code: "03",
    label: "BUSINESS FOCUS",
    value: "Motor Vehicle Renting & Leasing",
  },
];

const STATEMENTS = [
  {
    num: "01",
    title: "OUR MISSION",
    body: "To make electric mobility accessible through reliable EV rental solutions and efficient fleet operations.",
    dark: false,
  },
  {
    num: "02",
    title: "OUR VISION",
    body: "To contribute to India's electric mobility transition by building a scalable and sustainable fleet ecosystem.",
    dark: true,
  },
];

export function AboutAurumSection() {
  const [activeView, setActiveView] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const registryGlowRef = useRef<HTMLDivElement>(null);

  function handleStageMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;
    const rotY = ((rx - 0.5) * 14).toFixed(2);
    const rotX = (-(ry - 0.5) * 10).toFixed(2);
    stageRef.current.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.015, 1.015, 1.015)`;
    if (sheenRef.current) {
      sheenRef.current.style.opacity = "1";
      sheenRef.current.style.background = `radial-gradient(420px circle at ${(rx * 100).toFixed(1)}% ${(ry * 100).toFixed(1)}%, rgba(252,170,48,0.22), rgba(255,255,255,0.2) 38%, transparent 70%)`;
    }
  }

  function handleStageLeave() {
    if (stageRef.current) {
      stageRef.current.style.transform =
        "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
    if (sheenRef.current) {
      sheenRef.current.style.opacity = "0";
    }
  }

  function handleRegistryMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !registryGlowRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    registryGlowRef.current.style.opacity = "1";
    registryGlowRef.current.style.background = `radial-gradient(360px circle at ${x}px ${y}px, rgba(198,154,67,0.22), transparent 70%)`;
  }

  function handleRegistryLeave() {
    if (registryGlowRef.current) {
      registryGlowRef.current.style.opacity = "0";
    }
  }

  const currentView = SHOWCASE_VIEWS[activeView];

  return (
    <section
      id="about-aurum"
      className="relative overflow-hidden border-b border-[#EBEBEB] bg-white py-20 text-[#0F0F0F] sm:py-28"
    >
      {/* Subtle architectural background glow (clean white, subtle gold halo) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-12 h-[420px] w-[420px] rounded-full bg-[#C69A43]/10 blur-[130px]"
      />

      <div className="aurum-container relative z-10">
        {/* Top Architectural Header Split */}
        <div className="grid items-end gap-8 border-b border-black/[0.08] pb-12 lg:grid-cols-12 lg:gap-12">
          <RevealOnScroll className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C69A43]/40 bg-[#FAF7F0] px-4 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C69A43]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#9E7623]">
                ABOUT AURUM
              </span>
            </div>

            <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-[#0F0F0F] sm:text-5xl lg:text-[54px]">
              Driving the Future of Electric Mobility.
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delayMs={90} className="space-y-4 text-base leading-[1.75] text-[#4A4F57] lg:col-span-6">
            <p>
              Aurum Fleet Solutions Private Limited is an Indian mobility company focused on
              renting and leasing motor vehicles. We are building an accessible and efficient
              electric mobility ecosystem by connecting EV assets, fleet operations and
              India&apos;s growing delivery economy.
            </p>
            <p>
              Our approach combines vehicle deployment, managed fleet operations and structured
              investment opportunities to support the evolving needs of India&apos;s delivery and
              mobility sector.
            </p>
          </RevealOnScroll>
        </div>

        {/* Main Interactive Bento Stage */}
        <div className="mt-12 grid items-stretch gap-7 lg:grid-cols-12">
          {/* LEFT SIDE – Interactive 3D Aurum EV Asset & Operations Stage */}
          <RevealOnScroll className="lg:col-span-6">
            <div
              ref={stageRef}
              onPointerMove={handleStageMove}
              onPointerLeave={handleStageLeave}
              className="group relative flex h-full min-h-[430px] flex-col justify-between overflow-hidden rounded-[32px] border border-black/[0.08] bg-gradient-to-br from-[#F7F8FA] via-[#FFFFFF] to-[#F1ECE2] p-5 shadow-[0_24px_64px_rgba(15,15,15,0.08)] transition-transform duration-300 ease-out sm:min-h-[480px] sm:p-7"
            >
              {/* Mouse-tracked gold optical sheen */}
              <div
                ref={sheenRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300"
              />

              {/* Subtle 3D orbital wireframe ring behind studio scooter */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                  currentView.isStudio ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="h-[310px] w-[310px] rounded-full border border-[#C69A43]/25 animate-[heroOrbit_22s_linear_infinite] sm:h-[360px] sm:w-[360px]" />
              </div>

              {/* Top Stage Bar */}
              <div className="relative z-10 flex items-center justify-between gap-3">
                <span className="rounded-full border border-black/10 bg-white/90 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#0F0F0F] shadow-sm backdrop-blur-md">
                  {currentView.caption}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C69A43]">
                  AURUM FLEET
                </span>
              </div>

              {/* Crisp Interactive Visual Window */}
              <div className="relative z-10 my-4 flex-1 overflow-hidden rounded-2xl">
                {SHOWCASE_VIEWS.map((view, idx) => {
                  const isActive = idx === activeView;
                  return (
                    <div
                      key={view.id}
                      className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive
                          ? "scale-100 opacity-100"
                          : "pointer-events-none scale-105 opacity-0"
                      }`}
                    >
                      <Image
                        src={view.image}
                        alt={view.alt}
                        fill
                        className={
                          view.isStudio
                            ? "object-contain p-2 drop-shadow-[0_24px_34px_rgba(15,15,15,0.16)] transition-transform duration-700 group-hover:scale-[1.04]"
                            : "rounded-2xl object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                        }
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Bottom Interactive View Tabs */}
              <div className="relative z-20 grid grid-cols-3 gap-2 rounded-2xl border border-black/[0.08] bg-white/85 p-1.5 shadow-sm backdrop-blur-xl">
                {SHOWCASE_VIEWS.map((view, idx) => {
                  const selected = idx === activeView;
                  return (
                    <button
                      key={view.id}
                      type="button"
                      onClick={() => setActiveView(idx)}
                      className={`rounded-xl px-2.5 py-2.5 text-[11px] font-semibold tracking-tight transition-all duration-300 sm:text-xs ${
                        selected
                          ? "bg-[#0F0F0F] text-[#FCAA30] shadow-sm"
                          : "text-[#5A606A] hover:bg-black/[0.04] hover:text-[#0F0F0F]"
                      }`}
                    >
                      {view.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </RevealOnScroll>

          {/* RIGHT SIDE – Corporate Registry Card + Mission & Vision */}
          <div className="flex flex-col justify-between gap-6 lg:col-span-6">
            {/* Obsidian Corporate Info Registry with Cursor Spotlight */}
            <RevealOnScroll delayMs={80}>
              <div
                onPointerMove={handleRegistryMove}
                onPointerLeave={handleRegistryLeave}
                className="relative overflow-hidden rounded-[32px] bg-[#0F0F0F] p-7 text-white shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:p-9"
              >
                <div
                  ref={registryGlowRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
                />

                {/* Top metallic gold bar */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#C69A43] via-[#FCAA30] to-transparent"
                />

                <div className="relative z-10 divide-y divide-white/10">
                  {COMPANY_FACTS.map((fact) => (
                    <div
                      key={fact.code}
                      className="group/row flex flex-col justify-between gap-1.5 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-4"
                    >
                      <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#C69A43] transition-colors group-hover/row:text-[#FCAA30]">
                        {fact.code} — {fact.label}
                      </span>
                      <span className="font-display text-base font-medium tracking-[-0.01em] text-white sm:text-right sm:text-lg">
                        {fact.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            {/* Mission & Vision Bento Cards */}
            <div className="grid flex-1 gap-6 sm:grid-cols-2">
              {STATEMENTS.map((item, idx) => (
                <RevealOnScroll key={item.title} delayMs={140 + idx * 70}>
                  <div
                    className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] border p-7 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 sm:p-8 ${
                      item.dark
                        ? "border-[#C69A43]/35 bg-[#15171C] text-white shadow-[0_18px_48px_rgba(0,0,0,0.16)] hover:border-[#FCAA30] hover:shadow-[0_24px_56px_rgba(0,0,0,0.28)]"
                        : "border-black/[0.08] bg-[#FAFAFB] text-[#0F0F0F] shadow-card hover:border-[#C69A43] hover:bg-white hover:shadow-elevated"
                    }`}
                  >
                    {/* Animated Metallic Gold Sweep Line on Hover */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-50 bg-gradient-to-r from-[#C69A43] via-[#FCAA30] to-transparent transition-transform duration-500 group-hover:scale-x-100"
                    />

                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#C69A43]">
                          {item.title}
                        </p>
                        <span
                          className={`font-display text-xs font-semibold ${
                            item.dark ? "text-white/30" : "text-black/25"
                          }`}
                        >
                          {item.num}
                        </span>
                      </div>

                      <p
                        className={`mt-5 font-display text-lg font-medium leading-[1.45] tracking-[-0.015em] sm:text-[19px] ${
                          item.dark ? "text-white/95" : "text-[#0F0F0F]"
                        }`}
                      >
                        “{item.body}”
                      </p>
                    </div>

                    <div className="mt-6 h-px w-10 bg-[#C69A43]/50 transition-all duration-500 group-hover:w-20 group-hover:bg-[#FCAA30]" />
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
