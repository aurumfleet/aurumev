"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowRight,
  CalendarClock,
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
  calculateInvestmentPlan,
  formatINR,
  type DefinedEvPlanUnits,
} from "@/data/investment-plans";

const TIMELINE_LABELS = [
  { step: 1, label: "Choose Plan", Icon: Layers },
  { step: 2, label: "₹70,000 / EV", Icon: IndianRupee },
  { step: 3, label: "Agreement", Icon: FileSignature },
  { step: 4, label: "48 Months", Icon: CalendarClock },
  { step: 5, label: "Monthly Rental", Icon: Wallet },
  { step: 6, label: "Exit Choice", Icon: Compass },
] as const;

export function HowItWorksInvestmentSection() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedUnits, setSelectedUnits] = useState<DefinedEvPlanUnits>(2);
  const glassRef = useRef<HTMLDivElement>(null);

  const activePlan = calculateInvestmentPlan(selectedUnits);
  const progressPct = ((activeStep - 1) / (TIMELINE_LABELS.length - 1)) * 100;

  function handleGlassMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !glassRef.current) return;
    const rect = glassRef.current.getBoundingClientRect();
    glassRef.current.style.setProperty("--hx", `${(e.clientX - rect.left).toFixed(1)}px`);
    glassRef.current.style.setProperty("--hy", `${(e.clientY - rect.top).toFixed(1)}px`);
    glassRef.current.style.setProperty("--h-on", "1");
  }

  function handleGlassLeave() {
    if (!glassRef.current) return;
    glassRef.current.style.setProperty("--h-on", "0");
  }

  return (
    <section
      id="how-it-works-journey"
      aria-labelledby="how-it-works-heading"
      className="relative overflow-hidden bg-white py-20 text-[#0B1F3A] sm:py-28"
    >
      <div className="aurum-container relative z-10">
        {/* CLEAN SECTION HEADER */}
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9E7524]">
            HOW IT WORKS
          </p>
          <h2
            id="how-it-works-heading"
            className="mt-3 font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-[#0F0F0F] sm:text-5xl"
          >
            Your Investment Journey,{" "}
            <span className="bg-gradient-to-r from-[#0B1F3A] via-[#047857] to-[#9E7524] bg-clip-text text-transparent">
              Made Simple
            </span>
          </h2>
          <p className="mt-3.5 text-sm leading-relaxed text-[#475569] sm:text-base">
            From choosing your EV investment plan to receiving scheduled monthly rentals,
            understand every step of the Aurum investment journey.
          </p>
        </RevealOnScroll>

        {/* UNIFIED APPLE LIQUID GLASS JOURNEY CONTAINER */}
        <RevealOnScroll delayMs={60} className="mt-10 sm:mt-12">
          <div className="relative">
            {/* Soft pearl-emerald ambient depth behind glass slab */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-4 -z-0 rounded-[48px] bg-[radial-gradient(ellipse_75%_55%_at_20%_25%,rgba(5,150,105,0.06),transparent_60%),radial-gradient(ellipse_70%_55%_at_80%_75%,rgba(198,154,67,0.07),transparent_62%)] blur-xl"
            />

            <div
              ref={glassRef}
              onPointerMove={handleGlassMove}
              onPointerLeave={handleGlassLeave}
              style={{ "--hx": "50%", "--hy": "50%", "--h-on": "0" } as React.CSSProperties}
              className="relative z-10 overflow-hidden rounded-[34px] border border-white/95 bg-white/[0.74] p-5 shadow-[0_24px_70px_rgba(11,31,58,0.08),inset_0_1.5px_1.5px_rgba(255,255,255,1)] ring-1 ring-black/[0.06] backdrop-blur-2xl backdrop-saturate-[180%] sm:p-8 lg:p-10"
            >
              {/* Top Specular Glass Bevel */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
              />

              {/* Subtle Cursor-Reactive Optical Reflection */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  opacity: "var(--h-on)",
                  background:
                    "radial-gradient(420px circle at var(--hx) var(--hy), rgba(255,255,255,0.68), rgba(252,170,48,0.045) 48%, transparent 72%)",
                }}
              />

              {/* DESKTOP HORIZONTAL JOURNEY PROGRESS TRACK + GLIDING EV SCOOTER (lg+) */}
              <div className="relative z-10 mb-8 hidden border-b border-black/[0.06] pb-7 lg:block">
                <div className="relative mx-10 h-12">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-2.5 h-1 rounded-full bg-black/[0.07]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute bottom-2.5 left-0 h-1 rounded-full bg-gradient-to-r from-[#059669] via-[#0B1F3A] to-[#C69A43] transition-all duration-500 ease-out"
                    style={{ width: `${progressPct}%` }}
                  />
                  {/* Moving Subtle EV Scooter */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-3.5 -translate-x-1/2 transition-all duration-500 ease-out"
                    style={{ left: `${progressPct}%` }}
                  >
                    <div className="flex items-center gap-1 rounded-full border border-white bg-white/95 px-2 py-0.5 shadow-[0_6px_16px_rgba(11,31,58,0.12)] ring-1 ring-black/[0.05]">
                      <Image
                        src="/images/aurum-ev-studio.png"
                        alt=""
                        width={32}
                        height={26}
                        className="h-5 w-6 object-contain"
                      />
                      <span className="text-[10px] font-semibold text-[#0B1F3A] tabular-nums">
                        0{activeStep}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-1 grid grid-cols-6 gap-2 text-center">
                  {TIMELINE_LABELS.map((item) => {
                    const active = activeStep === item.step;
                    return (
                      <button
                        key={item.step}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setActiveStep(item.step)}
                        onMouseEnter={() => setActiveStep(item.step)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                          active
                            ? "bg-white font-semibold text-[#0F0F0F] shadow-[0_3px_12px_rgba(0,0,0,0.08)]"
                            : "text-[#64748B] hover:text-[#0F0F0F]"
                        }`}
                      >
                        <span className="mr-1.5 font-semibold text-[#047857]">0{item.step}</span>
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6 SIMPLE LIQUID GLASS STEP TILES (Desktop 3x2, Mobile Vertical Connected Timeline) */}
              <div className="relative z-10">
                {/* Mobile Vertical Connected Line */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-6 left-4 top-6 w-px bg-gradient-to-b from-[#059669] via-[#0B1F3A]/30 to-[#C69A43] lg:hidden"
                />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* STEP 01 */}
                  <article
                    onMouseEnter={() => setActiveStep(1)}
                    onClick={() => setActiveStep(1)}
                    className={`relative ml-10 flex flex-col justify-between rounded-3xl border p-5 backdrop-blur-xl transition-all duration-300 sm:p-6 lg:ml-0 ${
                      activeStep === 1
                        ? "border-[#059669]/35 bg-white/95 shadow-[0_14px_34px_rgba(11,31,58,0.07)]"
                        : "border-white/90 bg-white/[0.62] ring-1 ring-black/[0.045] hover:bg-white/85"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -left-10 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-[#059669]/40 bg-white text-[11px] font-bold text-[#047857] shadow-sm lg:hidden"
                    >
                      01
                    </span>
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
                        <span>STEP 01</span>
                        <Layers className="h-4 w-4 text-[#047857]" strokeWidth={1.6} />
                      </div>
                      <h3 className="mt-3 font-display text-lg font-semibold text-[#0F0F0F]">
                        Choose Your Investment Plan
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                        Select an EV plan that fits your investment budget.
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5 pt-2">
                      {ALL_COMPUTED_PLANS.map((plan) => (
                        <button
                          key={plan.evUnits}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUnits(plan.evUnits);
                            setActiveStep(1);
                          }}
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums transition-all ${
                            selectedUnits === plan.evUnits
                              ? "bg-[#0F0F0F] text-white shadow-sm"
                              : "bg-black/[0.05] text-[#475569] hover:bg-black/[0.09] hover:text-[#0F0F0F]"
                          }`}
                        >
                          {plan.evUnits} EVs
                        </button>
                      ))}
                    </div>
                  </article>

                  {/* STEP 02 */}
                  <article
                    onMouseEnter={() => setActiveStep(2)}
                    onClick={() => setActiveStep(2)}
                    className={`relative ml-10 flex flex-col justify-between rounded-3xl border p-5 backdrop-blur-xl transition-all duration-300 sm:p-6 lg:ml-0 ${
                      activeStep === 2
                        ? "border-[#059669]/35 bg-white/95 shadow-[0_14px_34px_rgba(11,31,58,0.07)]"
                        : "border-white/90 bg-white/[0.62] ring-1 ring-black/[0.045] hover:bg-white/85"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -left-10 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-[#059669]/40 bg-white text-[11px] font-bold text-[#047857] shadow-sm lg:hidden"
                    >
                      02
                    </span>
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
                        <span>STEP 02</span>
                        <IndianRupee className="h-4 w-4 text-[#0B1F3A]" strokeWidth={1.6} />
                      </div>
                      <h3 className="mt-3 font-display text-lg font-semibold text-[#0F0F0F]">
                        Understand Your Investment
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                        Simple, fixed per-EV pricing with clear GST split.
                      </p>
                    </div>
                    <p className="mt-4 border-t border-black/[0.06] pt-3 text-xs font-medium text-[#334155] tabular-nums">
                      Investment {formatINR(INVESTMENT_MODEL_CONSTANTS.investmentPerEv)} + GST (5%){" "}
                      {formatINR(INVESTMENT_MODEL_CONSTANTS.gstPerEv)} ={" "}
                      <strong className="text-[#047857]">
                        {formatINR(INVESTMENT_MODEL_CONSTANTS.totalInvestmentPerEv)} / EV
                      </strong>
                    </p>
                  </article>

                  {/* STEP 03 */}
                  <article
                    onMouseEnter={() => setActiveStep(3)}
                    onClick={() => setActiveStep(3)}
                    className={`relative ml-10 flex flex-col justify-between rounded-3xl border p-5 backdrop-blur-xl transition-all duration-300 sm:p-6 lg:ml-0 ${
                      activeStep === 3
                        ? "border-[#059669]/35 bg-white/95 shadow-[0_14px_34px_rgba(11,31,58,0.07)]"
                        : "border-white/90 bg-white/[0.62] ring-1 ring-black/[0.045] hover:bg-white/85"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -left-10 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-[#0B1F3A]/25 bg-white text-[11px] font-bold text-[#0B1F3A] shadow-sm lg:hidden"
                    >
                      03
                    </span>
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
                        <span>STEP 03</span>
                        <FileSignature className="h-4 w-4 text-[#9E7524]" strokeWidth={1.6} />
                      </div>
                      <h3 className="mt-3 font-display text-lg font-semibold text-[#0F0F0F]">
                        Complete Documentation
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                        Complete the required documentation and agreement formalities with Aurum
                        Fleet Solutions.
                      </p>
                    </div>
                    <p className="mt-4 border-t border-black/[0.06] pt-3 text-xs font-medium text-[#64748B]">
                      Formal agreement executed before tenure starts.
                    </p>
                  </article>

                  {/* STEP 04 */}
                  <article
                    onMouseEnter={() => setActiveStep(4)}
                    onClick={() => setActiveStep(4)}
                    className={`relative ml-10 flex flex-col justify-between rounded-3xl border p-5 backdrop-blur-xl transition-all duration-300 sm:p-6 lg:ml-0 ${
                      activeStep === 4
                        ? "border-[#059669]/35 bg-white/95 shadow-[0_14px_34px_rgba(11,31,58,0.07)]"
                        : "border-white/90 bg-white/[0.62] ring-1 ring-black/[0.045] hover:bg-white/85"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -left-10 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-[#0B1F3A]/25 bg-white text-[11px] font-bold text-[#0B1F3A] shadow-sm lg:hidden"
                    >
                      04
                    </span>
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
                        <span>STEP 04</span>
                        <CalendarClock className="h-4 w-4 text-[#047857]" strokeWidth={1.6} />
                      </div>
                      <h3 className="mt-3 font-display text-lg font-semibold text-[#0F0F0F]">
                        Begin the 48-Month Agreement
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                        Your investment agreement runs for an agreed 48-month (4-year) tenure.
                      </p>
                    </div>
                    <div className="mt-4 border-t border-black/[0.06] pt-3">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#0F0F0F]">
                        <span>Year 1</span>
                        <span>Year 2</span>
                        <span>Year 3</span>
                        <span className="text-[#047857]">Year 4 (48M)</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/[0.07]">
                        <div className="h-full w-full rounded-full bg-gradient-to-r from-[#0B1F3A] via-[#059669] to-[#C69A43]" />
                      </div>
                    </div>
                  </article>

                  {/* STEP 05 */}
                  <article
                    onMouseEnter={() => setActiveStep(5)}
                    onClick={() => setActiveStep(5)}
                    className={`relative ml-10 flex flex-col justify-between rounded-3xl border p-5 backdrop-blur-xl transition-all duration-300 sm:p-6 lg:ml-0 ${
                      activeStep === 5
                        ? "border-[#059669]/35 bg-white/95 shadow-[0_14px_34px_rgba(11,31,58,0.07)]"
                        : "border-white/90 bg-white/[0.62] ring-1 ring-black/[0.045] hover:bg-white/85"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -left-10 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-[#059669]/40 bg-white text-[11px] font-bold text-[#047857] shadow-sm lg:hidden"
                    >
                      05
                    </span>
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
                        <span>STEP 05</span>
                        <Wallet className="h-4 w-4 text-[#047857]" strokeWidth={1.6} />
                      </div>
                      <h3 className="mt-3 font-display text-lg font-semibold text-[#0F0F0F]">
                        Scheduled Monthly Rental
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                        Monthly rentals apply as per your selected plan, subject to agreement terms:
                      </p>
                    </div>
                    <p className="mt-4 border-t border-black/[0.06] pt-3 text-xs font-semibold text-[#0B1F3A] tabular-nums">
                      Selected ({activePlan.evUnits} EVs):{" "}
                      <span className="text-[#64748B]">
                        {formatINR(activePlan.rentalPerEvMonthly)}/EV
                      </span>{" "}
                      →{" "}
                      <span className="text-[#047857]">
                        {formatINR(activePlan.monthlyRental)} / month
                      </span>
                    </p>
                  </article>

                  {/* STEP 06 */}
                  <article
                    onMouseEnter={() => setActiveStep(6)}
                    onClick={() => setActiveStep(6)}
                    className={`relative ml-10 flex flex-col justify-between rounded-3xl border p-5 backdrop-blur-xl transition-all duration-300 sm:p-6 lg:ml-0 ${
                      activeStep === 6
                        ? "border-[#C69A43]/60 bg-white/95 shadow-[0_14px_34px_rgba(198,154,67,0.10)]"
                        : "border-white/90 bg-white/[0.62] ring-1 ring-black/[0.045] hover:bg-white/85"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -left-10 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-[#C69A43]/50 bg-white text-[11px] font-bold text-[#9E7524] shadow-sm lg:hidden"
                    >
                      06
                    </span>
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
                        <span>STEP 06</span>
                        <Compass className="h-4 w-4 text-[#9E7524]" strokeWidth={1.6} />
                      </div>
                      <h3 className="mt-3 font-display text-lg font-semibold text-[#0F0F0F]">
                        Choose Your 4-Year Exit Option
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                        After completing 48 months, choose from three available exit options.
                      </p>
                    </div>
                    <p className="mt-4 border-t border-black/[0.06] pt-3 text-xs font-semibold text-[#9E7524]">
                      Your Investment. Your Choice. ↓
                    </p>
                  </article>
                </div>
              </div>

              {/* CLEAN ALL-PLANS SCHEDULE STRIP + EXPLORE CTA */}
              <div className="relative z-10 mt-6 flex flex-col justify-between gap-5 border-t border-black/[0.06] pt-6 lg:flex-row lg:items-center">
                {/* Minimal single-line view of all 5 plan monthly schedules */}
                <div className="flex flex-wrap items-center gap-2 text-xs tabular-nums">
                  <span className="mr-1 font-medium text-[#64748B]">Monthly Schedule:</span>
                  {ALL_COMPUTED_PLANS.map((p) => {
                    const active = selectedUnits === p.evUnits;
                    return (
                      <button
                        key={p.evUnits}
                        type="button"
                        onClick={() => setSelectedUnits(p.evUnits)}
                        className={`rounded-full border px-3 py-1 transition-all ${
                          active
                            ? "border-[#059669]/40 bg-[#ECFDF5] font-semibold text-[#047857]"
                            : "border-black/[0.06] bg-white/75 text-[#334155] hover:bg-white"
                        }`}
                      >
                        {p.evUnits} EVs · {formatINR(p.rentalPerEvMonthly)}/EV →{" "}
                        <strong>{formatINR(p.monthlyRental)}</strong>
                      </button>
                    );
                  })}
                </div>

                <Link
                  href="#why-choose-aurum"
                  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#0F0F0F] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#047857] sm:text-sm"
                >
                  <span>Explore Investment Plans</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-[11px] text-[#64748B]">
            Scheduled monthly rentals are subject to the executed agreement and applicable
            conditions. Figures do not guarantee fixed profits or risk-free returns.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
