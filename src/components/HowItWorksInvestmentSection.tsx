"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  FileSignature,
  IndianRupee,
  Layers,
  Wallet,
} from "lucide-react";
import { RevealOnScroll } from "@/components/MotionPrimitives";
import {
  ALL_COMPUTED_PLANS,
  INVESTMENT_MODEL_CONSTANTS,
  formatINR,
  type DefinedEvPlanUnits,
} from "@/data/investment-plans";

interface JourneyStepMeta {
  step: number;
  code: string;
  title: string;
  shortLabel: string;
  description: string;
  Icon: typeof Layers;
}

const JOURNEY_STEPS: readonly JourneyStepMeta[] = [
  {
    step: 1,
    code: "STEP 01",
    title: "Choose Your Investment Plan",
    shortLabel: "Select Plan",
    description:
      "Select an available EV investment plan according to your investment capacity.",
    Icon: Layers,
  },
  {
    step: 2,
    code: "STEP 02",
    title: "Understand Your Investment",
    shortLabel: "Per-EV Breakdown",
    description:
      "Review the transparent per-unit EV investment and applicable 5% GST structure.",
    Icon: IndianRupee,
  },
  {
    step: 3,
    code: "STEP 03",
    title: "Complete Documentation",
    shortLabel: "Documentation",
    description:
      "Proceed with the required documentation and agreement formalities with Aurum Fleet Solutions.",
    Icon: FileSignature,
  },
  {
    step: 4,
    code: "STEP 04",
    title: "Begin the 48-Month Agreement",
    shortLabel: "48M Tenure",
    description:
      "The investment agreement begins for the agreed 48-month tenure.",
    Icon: CalendarClock,
  },
  {
    step: 5,
    code: "STEP 05",
    title: "Scheduled Monthly Rental",
    shortLabel: "Monthly Rental",
    description:
      "Scheduled monthly rentals apply per EV tier, subject to the executed agreement and applicable conditions.",
    Icon: Wallet,
  },
  {
    step: 6,
    code: "STEP 06",
    title: "Choose Your 4-Year Exit Option",
    shortLabel: "4-Year Exit",
    description:
      "At the completion of the 48-month agreement, investors can choose from the three available exit options.",
    Icon: Compass,
  },
] as const;

export function HowItWorksInvestmentSection() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedPlanUnits, setSelectedPlanUnits] = useState<DefinedEvPlanUnits>(2);

  // Percentage along desktop 6-milestone horizontal journey line (0% -> 100%)
  const scooterProgressPct = ((activeStep - 1) / (JOURNEY_STEPS.length - 1)) * 100;

  return (
    <section
      id="how-it-works-journey"
      aria-labelledby="how-it-works-heading"
      className="relative overflow-hidden bg-white py-20 text-[#0B1F3A] sm:py-28"
    >
      {/* Subtle architectural ambient wash keeping pure white canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(11,31,58,0.03),rgba(198,154,67,0.04)_45%,transparent_75%)]"
      />

      <div className="aurum-container relative z-10">
        {/* SECTION HEADER */}
        <RevealOnScroll className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#059669]/25 bg-[#ECFDF5]/85 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" aria-hidden="true" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#047857]">
              HOW IT WORKS
            </span>
          </div>

          <h2
            id="how-it-works-heading"
            className="mt-5 font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-[#0B1F3A] sm:text-5xl lg:text-[52px]"
          >
            Your Investment Journey,{" "}
            <span className="bg-gradient-to-r from-[#047857] via-[#0B1F3A] to-[#9E7524] bg-clip-text text-transparent">
              Made Simple
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#475569] sm:text-lg">
            From choosing your EV investment plan to receiving scheduled monthly rentals,
            understand every step of the Aurum investment journey.
          </p>
        </RevealOnScroll>

        {/* DESKTOP INTERACTIVE HORIZONTAL JOURNEY LINE + MOVING EV SCOOTER ILLUSTRATION (lg+) */}
        <RevealOnScroll delayMs={70} className="mt-14 hidden lg:block">
          <div className="rounded-[32px] border border-[#0B1F3A]/10 bg-white/85 px-8 pb-8 pt-10 shadow-[0_18px_50px_rgba(11,31,58,0.05),inset_0_1px_0_rgba(255,255,255,1)] ring-1 ring-black/[0.03] backdrop-blur-xl">
            {/* Scooter Journey Track */}
            <div className="relative mx-8 mb-6 h-14">
              {/* Background Track */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-3 h-1 rounded-full bg-[#E2E8F0]"
              />
              {/* Active Emerald -> Gold Progress Line */}
              <div
                aria-hidden="true"
                className="absolute bottom-3 left-0 h-1 rounded-full bg-gradient-to-r from-[#059669] via-[#0B1F3A] to-[#C69A43] transition-all duration-500 ease-out"
                style={{ width: `${scooterProgressPct}%` }}
              />

              {/* Moving Subtle EV Scooter Badge Gliding Along Timeline */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 -translate-x-1/2 transition-all duration-500 ease-out"
                style={{ left: `${scooterProgressPct}%` }}
              >
                <div className="flex items-center gap-1.5 rounded-full border border-[#C69A43]/40 bg-white px-2.5 py-1 shadow-[0_8px_20px_rgba(11,31,58,0.12)]">
                  <Image
                    src="/images/aurum-ev-studio.png"
                    alt=""
                    width={36}
                    height={30}
                    className="h-6 w-7 object-contain"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0B1F3A] tabular-nums">
                    0{activeStep}
                  </span>
                </div>
              </div>
            </div>

            {/* 6 Horizontal Milestone Nodes */}
            <div className="grid grid-cols-6 gap-3">
              {JOURNEY_STEPS.map((s) => {
                const Icon = s.Icon;
                const isActive = activeStep === s.step;
                const isPassed = s.step <= activeStep;

                return (
                  <button
                    key={s.step}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveStep(s.step)}
                    onMouseEnter={() => setActiveStep(s.step)}
                    className="group flex flex-col items-center text-center focus-visible:outline-none"
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-300 ${
                        isActive
                          ? "scale-110 border-[#059669] bg-[#0B1F3A] text-white shadow-[0_10px_24px_rgba(11,31,58,0.22)]"
                          : isPassed
                            ? "border-[#059669]/40 bg-[#ECFDF5] text-[#047857]"
                            : "border-[#0B1F3A]/15 bg-[#F8FAFC] text-[#475569] group-hover:border-[#C69A43]/60 group-hover:bg-white"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
                    </span>
                    <span
                      className={`mt-2.5 text-[10px] font-bold uppercase tracking-[0.16em] ${
                        isActive ? "text-[#047857]" : "text-[#9E7524]"
                      }`}
                    >
                      {s.code}
                    </span>
                    <span
                      className={`mt-0.5 text-xs font-semibold transition-colors ${
                        isActive ? "text-[#0B1F3A]" : "text-[#64748B]"
                      }`}
                    >
                      {s.shortLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>

        {/* 6 DETAILED STEP CARDS (3x2 Grid on Desktop, Vertical Connected Timeline on Mobile/Tablet) */}
        <div className="relative mt-10 lg:mt-8">
          {/* Mobile / Tablet Vertical Timeline Spine (< lg) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-8 left-5 top-8 w-px bg-gradient-to-b from-[#059669] via-[#0B1F3A]/35 to-[#C69A43] lg:hidden"
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {/* STEP 01 — Choose Your Investment Plan */}
            <RevealOnScroll delayMs={40}>
              <article
                onMouseEnter={() => setActiveStep(1)}
                onClick={() => setActiveStep(1)}
                className={`relative ml-12 flex h-full flex-col justify-between rounded-3xl border bg-white/95 p-6 shadow-[0_12px_34px_rgba(11,31,58,0.045)] transition-all duration-300 hover:-translate-y-1 lg:ml-0 ${
                  activeStep === 1
                    ? "border-[#059669]/50 ring-1 ring-[#059669]/20"
                    : "border-[#0B1F3A]/10 hover:border-[#C69A43]/50"
                }`}
              >
                {/* Mobile Node */}
                <span
                  aria-hidden="true"
                  className="absolute -left-12 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#059669]/40 bg-[#ECFDF5] font-display text-xs font-bold text-[#047857] shadow-sm lg:hidden"
                >
                  01
                </span>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#047857]">
                      STEP 01
                    </span>
                    <Layers className="h-5 w-5 text-[#0B1F3A]/70" strokeWidth={1.6} />
                  </div>

                  <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.02em] text-[#0B1F3A]">
                    Choose Your Investment Plan
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                    Select an available EV investment plan according to your investment capacity.
                  </p>
                </div>

                <div className="mt-5 border-t border-[#0B1F3A]/[0.07] pt-4">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                    Available Plans
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_COMPUTED_PLANS.map((plan) => {
                      const active = selectedPlanUnits === plan.evUnits;
                      return (
                        <button
                          key={plan.evUnits}
                          type="button"
                          aria-pressed={active}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPlanUnits(plan.evUnits);
                            setActiveStep(1);
                          }}
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums transition-all ${
                            active
                              ? "bg-[#0B1F3A] text-white shadow-sm"
                              : "border border-[#0B1F3A]/15 bg-[#F8FAFC] text-[#0B1F3A] hover:border-[#059669]/45 hover:bg-[#ECFDF5]"
                          }`}
                        >
                          {plan.evUnits} EVs
                        </button>
                      );
                    })}
                  </div>
                </div>
              </article>
            </RevealOnScroll>

            {/* STEP 02 — Understand Your Investment */}
            <RevealOnScroll delayMs={80}>
              <article
                onMouseEnter={() => setActiveStep(2)}
                onClick={() => setActiveStep(2)}
                className={`relative ml-12 flex h-full flex-col justify-between rounded-3xl border bg-white/95 p-6 shadow-[0_12px_34px_rgba(11,31,58,0.045)] transition-all duration-300 hover:-translate-y-1 lg:ml-0 ${
                  activeStep === 2
                    ? "border-[#059669]/50 ring-1 ring-[#059669]/20"
                    : "border-[#0B1F3A]/10 hover:border-[#C69A43]/50"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-12 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#059669]/40 bg-[#ECFDF5] font-display text-xs font-bold text-[#047857] shadow-sm lg:hidden"
                >
                  02
                </span>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#F1F5F9] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0B1F3A]">
                      STEP 02
                    </span>
                    <IndianRupee className="h-5 w-5 text-[#0B1F3A]/70" strokeWidth={1.6} />
                  </div>

                  <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.02em] text-[#0B1F3A]">
                    Understand Your Investment
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                    Transparent per-EV capital allocation including applicable 5% GST.
                  </p>
                </div>

                <div className="mt-5 space-y-2 rounded-2xl border border-[#0B1F3A]/[0.07] bg-[#F8FAFC] p-4 text-xs tabular-nums">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Investment</span>
                    <span className="font-semibold text-[#0B1F3A]">
                      {formatINR(INVESTMENT_MODEL_CONSTANTS.investmentPerEv)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">GST (5%)</span>
                    <span className="font-semibold text-[#0B1F3A]">
                      {formatINR(INVESTMENT_MODEL_CONSTANTS.gstPerEv)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#0B1F3A]/10 pt-2">
                    <span className="font-semibold text-[#0B1F3A]">Total Investment</span>
                    <span className="font-display text-sm font-bold text-[#047857]">
                      {formatINR(INVESTMENT_MODEL_CONSTANTS.totalInvestmentPerEv)} per EV
                    </span>
                  </div>
                </div>
              </article>
            </RevealOnScroll>

            {/* STEP 03 — Complete Documentation */}
            <RevealOnScroll delayMs={120}>
              <article
                onMouseEnter={() => setActiveStep(3)}
                onClick={() => setActiveStep(3)}
                className={`relative ml-12 flex h-full flex-col justify-between rounded-3xl border bg-white/95 p-6 shadow-[0_12px_34px_rgba(11,31,58,0.045)] transition-all duration-300 hover:-translate-y-1 lg:ml-0 ${
                  activeStep === 3
                    ? "border-[#059669]/50 ring-1 ring-[#059669]/20"
                    : "border-[#0B1F3A]/10 hover:border-[#C69A43]/50"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-12 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#0B1F3A]/20 bg-[#F8FAFC] font-display text-xs font-bold text-[#0B1F3A] shadow-sm lg:hidden"
                >
                  03
                </span>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#FAF7F0] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9E7524]">
                      STEP 03
                    </span>
                    <FileSignature className="h-5 w-5 text-[#9E7524]" strokeWidth={1.6} />
                  </div>

                  <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.02em] text-[#0B1F3A]">
                    Complete Documentation
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                    Proceed with the required documentation and agreement formalities with Aurum
                    Fleet Solutions.
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#C69A43]/25 bg-[#FAF7F0]/70 px-4 py-3">
                  <ClipboardCheck className="h-4 w-4 shrink-0 text-[#9E7524]" />
                  <p className="text-xs font-medium text-[#475569]">
                    Formal agreement execution precedes fleet deployment commencement.
                  </p>
                </div>
              </article>
            </RevealOnScroll>

            {/* STEP 04 — Begin the 48-Month Agreement */}
            <RevealOnScroll delayMs={160}>
              <article
                onMouseEnter={() => setActiveStep(4)}
                onClick={() => setActiveStep(4)}
                className={`relative ml-12 flex h-full flex-col justify-between rounded-3xl border bg-white/95 p-6 shadow-[0_12px_34px_rgba(11,31,58,0.045)] transition-all duration-300 hover:-translate-y-1 lg:ml-0 ${
                  activeStep === 4
                    ? "border-[#059669]/50 ring-1 ring-[#059669]/20"
                    : "border-[#0B1F3A]/10 hover:border-[#C69A43]/50"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-12 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#0B1F3A]/20 bg-[#F8FAFC] font-display text-xs font-bold text-[#0B1F3A] shadow-sm lg:hidden"
                >
                  04
                </span>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#047857]">
                      STEP 04
                    </span>
                    <CalendarClock className="h-5 w-5 text-[#047857]" strokeWidth={1.6} />
                  </div>

                  <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.02em] text-[#0B1F3A]">
                    Begin the 48-Month Agreement
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                    The investment agreement begins for the agreed 48-month tenure.
                  </p>
                </div>

                {/* Visual 4-Year / 48-Month Agreement Timeline */}
                <div className="mt-5 rounded-2xl border border-[#0B1F3A]/[0.07] bg-[#F8FAFC] p-3.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#0B1F3A] tabular-nums">
                    <span>4-Year Agreement Period</span>
                    <span className="text-[#047857]">48 Months</span>
                  </div>
                  <div className="mt-2.5 grid grid-cols-4 gap-1.5">
                    {["Year 1", "Year 2", "Year 3", "Year 4"].map((yr, idx) => (
                      <div key={yr} className="text-center">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-[#0B1F3A] to-[#059669]"
                          style={{ opacity: 0.45 + idx * 0.18 }}
                        />
                        <span className="mt-1 block text-[10px] font-medium text-[#64748B]">
                          {yr}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </RevealOnScroll>

            {/* STEP 05 — Scheduled Monthly Rental */}
            <RevealOnScroll delayMs={200}>
              <article
                onMouseEnter={() => setActiveStep(5)}
                onClick={() => setActiveStep(5)}
                className={`relative ml-12 flex h-full flex-col justify-between rounded-3xl border bg-white/95 p-6 shadow-[0_12px_34px_rgba(11,31,58,0.045)] transition-all duration-300 hover:-translate-y-1 lg:ml-0 ${
                  activeStep === 5
                    ? "border-[#059669]/50 ring-1 ring-[#059669]/20"
                    : "border-[#0B1F3A]/10 hover:border-[#C69A43]/50"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-12 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#059669]/40 bg-[#ECFDF5] font-display text-xs font-bold text-[#047857] shadow-sm lg:hidden"
                >
                  05
                </span>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#047857]">
                      STEP 05
                    </span>
                    <Wallet className="h-5 w-5 text-[#047857]" strokeWidth={1.6} />
                  </div>

                  <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.02em] text-[#0B1F3A]">
                    Scheduled Monthly Rental
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#475569]">
                    Applicable scheduled monthly rentals per plan (subject to executed agreement
                    and conditions):
                  </p>
                </div>

                {/* Exact Per-Plan Rates & Monthly Scheduled Rentals */}
                <div className="mt-4 divide-y divide-[#0B1F3A]/[0.07] rounded-2xl border border-[#0B1F3A]/[0.07] bg-[#F8FAFC] px-3.5 py-1 text-xs tabular-nums">
                  {ALL_COMPUTED_PLANS.map((plan) => {
                    const isFocused = selectedPlanUnits === plan.evUnits;
                    return (
                      <div
                        key={plan.evUnits}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlanUnits(plan.evUnits);
                          setActiveStep(5);
                        }}
                        className={`flex cursor-pointer items-center justify-between gap-2 py-2 transition-colors ${
                          isFocused ? "font-semibold text-[#047857]" : "text-[#334155]"
                        }`}
                      >
                        <span>
                          {plan.evUnits} EVs:{" "}
                          <span className="text-[#64748B]">
                            {formatINR(plan.rentalPerEvMonthly)}/EV
                          </span>
                        </span>
                        <span className="font-bold text-[#0B1F3A]">
                          {formatINR(plan.monthlyRental)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </article>
            </RevealOnScroll>

            {/* STEP 06 — Choose Your 4-Year Exit Option */}
            <RevealOnScroll delayMs={240}>
              <article
                onMouseEnter={() => setActiveStep(6)}
                onClick={() => setActiveStep(6)}
                className={`relative ml-12 flex h-full flex-col justify-between rounded-3xl border bg-gradient-to-br from-white via-white to-[#FAF7F0] p-6 shadow-[0_12px_34px_rgba(11,31,58,0.045)] transition-all duration-300 hover:-translate-y-1 lg:ml-0 ${
                  activeStep === 6
                    ? "border-[#C69A43] ring-1 ring-[#C69A43]/30"
                    : "border-[#C69A43]/35 hover:border-[#C69A43]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-12 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#C69A43]/50 bg-[#FAF7F0] font-display text-xs font-bold text-[#9E7524] shadow-sm lg:hidden"
                >
                  06
                </span>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#FAF7F0] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9E7524]">
                      STEP 06
                    </span>
                    <Compass className="h-5 w-5 text-[#9E7524]" strokeWidth={1.6} />
                  </div>

                  <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.02em] text-[#0B1F3A]">
                    Choose Your 4-Year Exit Option
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                    At the completion of the 48-month agreement, investors can choose from the three
                    available exit options.
                  </p>
                </div>

                {/* Visual Bridge Connecting to Next Section: "Your Investment. Your Choice." */}
                <div className="mt-5 rounded-2xl border border-[#C69A43]/35 bg-white/90 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9E7524]">
                      At 48-Month Completion
                    </span>
                    <CheckCircle2 className="h-4 w-4 text-[#059669]" />
                  </div>
                  <p className="mt-1.5 font-display text-sm font-semibold text-[#0B1F3A]">
                    3 Available Exit Options
                  </p>
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-[#047857]">
                    <span>Next Section: &ldquo;Your Investment. Your Choice.&rdquo;</span>
                    <ArrowDown className="h-3.5 w-3.5 shrink-0" />
                  </div>
                </div>
              </article>
            </RevealOnScroll>
          </div>
        </div>

        {/* BOTTOM REALISTIC FLEET STRIP + EXPLORE INVESTMENT PLANS CTA + BRIDGE */}
        <RevealOnScroll delayMs={140} className="mt-12">
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-[#0B1F3A]/10 bg-[#F8FAFC] p-6 shadow-[0_14px_40px_rgba(11,31,58,0.04)] sm:flex-row sm:p-8">
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border border-[#0B1F3A]/10 bg-white shadow-sm">
                <Image
                  src="/images/aurum-rapido.jpg"
                  alt="Aurum EV commercial fleet scooter deployed on road"
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
              <div className="max-w-xl">
                <p className="font-display text-lg font-semibold text-[#0B1F3A] sm:text-xl">
                  Ready to compare all five EV investment plans?
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                  Scheduled monthly rentals are subject to the executed agreement, operational
                  arrangements, and applicable conditions. Projections do not constitute guaranteed
                  returns.
                </p>
              </div>
            </div>

            <Link
              href="#why-choose-aurum"
              className="group inline-flex shrink-0 items-center gap-2.5 rounded-full bg-[#0B1F3A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(11,31,58,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#047857]"
            >
              <span>Explore Investment Plans</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Subtle Bridge Lead-in to Section 06: "Your Investment. Your Choice." */}
          <div className="mt-8 flex flex-col items-center text-center">
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#9E7524]">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#C69A43]" />
              <span>Your Investment. Your Choice.</span>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#C69A43]" />
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
