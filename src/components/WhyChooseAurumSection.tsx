"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarRange,
  ChevronDown,
  IndianRupee,
  Info,
  Layers,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { RevealOnScroll } from "@/components/MotionPrimitives";
import {
  ALL_COMPUTED_PLANS,
  INVESTMENT_MODEL_CONSTANTS,
  calculateInvestmentPlan,
  formatINR,
  formatIndianCompact,
  type DefinedEvPlanUnits,
} from "@/data/investment-plans";

const WHY_AURUM_BENEFITS = [
  {
    title: "Transparent Investment Structure",
    detail: "Clear itemization of base EV capital (₹66,500) and applicable 5% GST (₹3,500) per unit.",
    Icon: ShieldCheck,
  },
  {
    title: "48-Month Agreement Tenure",
    detail: "Defined four-year structured deployment horizon aligned with commercial EV asset life.",
    Icon: CalendarRange,
  },
  {
    title: "Multiple EV Investment Plans",
    detail: "Scalable fleet tiers spanning 2 EVs, 5 EVs, 10 EVs, 25 EVs, and 50 EVs.",
    Icon: Layers,
  },
  {
    title: "Defined Monthly Rental Structure",
    detail: "Pre-specified monthly per-EV rental schedule from ₹4,300 to ₹5,500 based on plan tier.",
    Icon: IndianRupee,
  },
  {
    title: "Flexible End-of-Agreement Options",
    detail: "Structured end-of-term pathways established transparently under the executed agreement.",
    Icon: SlidersHorizontal,
  },
] as const;

const OVERVIEW_PANELS = [
  {
    index: "01",
    label: "Total Investment Per EV",
    headline: "₹70,000",
    lines: ["Investment: ₹66,500", "GST (5%): ₹3,500"],
    accent: "navy",
  },
  {
    index: "02",
    label: "Agreement Tenure",
    headline: "48 Months",
    lines: ["Structured 4-year agreement framework"],
    accent: "emerald",
  },
  {
    index: "03",
    label: "Monthly Rental Per EV",
    headline: "₹4,300 – ₹5,500",
    lines: ["As per applicable investment plan."],
    accent: "gold",
  },
  {
    index: "04",
    label: "Investment Scale",
    headline: "Starting from 2 EVs",
    lines: ["Plans illustrated up to 50 EVs."],
    accent: "navy",
  },
] as const;

function AnimatedINR({
  value,
  className = "",
  testId,
}: {
  value: number;
  className?: string;
  testId?: string;
}) {
  const [display, setDisplay] = useState(value);
  const currentRef = useRef(value);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      currentRef.current = value;
      setDisplay(value);
      return;
    }

    const from = currentRef.current;
    const to = value;
    if (from === to) return;

    const duration = 420;
    const start = performance.now();
    let rafId = 0;

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.round(from + (to - from) * eased);
      currentRef.current = next;
      setDisplay(next);
      if (t < 1) {
        rafId = window.requestAnimationFrame(step);
      } else {
        currentRef.current = to;
        setDisplay(to);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [value]);

  return (
    <span data-testid={testId} className={className}>
      {formatINR(display)}
    </span>
  );
}

export function WhyChooseAurumSection() {
  const [selectedUnits, setSelectedUnits] = useState<DefinedEvPlanUnits>(2);
  const [expandedMobilePlan, setExpandedMobilePlan] = useState<DefinedEvPlanUnits | null>(2);
  const [activeYear, setActiveYear] = useState<1 | 2 | 3 | 4>(4);
  const glassPaneRef = useRef<HTMLDivElement>(null);

  const activePlan = calculateInvestmentPlan(selectedUnits);

  const capitalSharePct = Number(
    ((activePlan.totalInvestment / activePlan.totalRental48Months) * 100).toFixed(1),
  );
  const surplusSharePct = Number((100 - capitalSharePct).toFixed(1));

  const annualMilestones = ([1, 2, 3, 4] as const).map((year) => {
    const cumulative = activePlan.annualRental * year;
    const heightPct = Math.round((cumulative / activePlan.totalRental48Months) * 100);
    return {
      year,
      months: year * 12,
      cumulative,
      heightPct,
    };
  });

  const activeMilestone =
    annualMilestones.find((m) => m.year === activeYear) ?? annualMilestones[3];

  const capitalLineHeightPct = Math.round(
    (activePlan.totalInvestment / activePlan.totalRental48Months) * 100,
  );

  // Dynamic SVG points across 48M trajectory (0M -> 12M -> 24M -> 36M -> 48M)
  const chartPlotHeight = 122;
  const chartBaseY = 146;
  const capitalLineY = Math.round(chartBaseY - (capitalLineHeightPct / 100) * chartPlotHeight);
  const xCoords = [28, 145, 262, 379, 496] as const;
  const yCoords = [
    chartBaseY,
    ...annualMilestones.map((m) =>
      Math.round(chartBaseY - (m.heightPct / 100) * chartPlotHeight),
    ),
  ];
  const linePoints = xCoords.map((x, idx) => `${x},${yCoords[idx]}`).join(" ");
  const areaPath = `M ${xCoords[0]},${chartBaseY} ${xCoords
    .map((x, idx) => `L ${x},${yCoords[idx]}`)
    .join(" ")} L ${xCoords[4]},${chartBaseY} Z`;

  function selectPlanAndScroll(units: DefinedEvPlanUnits) {
    setSelectedUnits(units);
    setActiveYear(4);
  }

  function handleGlassPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !glassPaneRef.current) return;
    const rect = glassPaneRef.current.getBoundingClientRect();
    glassPaneRef.current.style.setProperty("--gx", `${(e.clientX - rect.left).toFixed(1)}px`);
    glassPaneRef.current.style.setProperty("--gy", `${(e.clientY - rect.top).toFixed(1)}px`);
    glassPaneRef.current.style.setProperty("--g-active", "1");
  }

  function handleGlassPointerLeave() {
    if (!glassPaneRef.current) return;
    glassPaneRef.current.style.setProperty("--g-active", "0");
  }

  return (
    <section
      id="why-choose-aurum"
      aria-labelledby="why-aurum-heading"
      className="relative overflow-hidden bg-white py-20 text-[#0B1F3A] sm:py-28"
    >
      {/* Subtle institutional ambient backdrop wash keeping crisp white canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_68%_50%_at_50%_0%,rgba(5,150,105,0.045),rgba(11,31,58,0.025)_45%,transparent_75%)]"
      />

      <div className="aurum-container relative z-10 space-y-16 sm:space-y-20">
        {/* SECTION HEADER */}
        <RevealOnScroll className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#059669]/25 bg-[#ECFDF5]/80 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" aria-hidden="true" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#047857]">
              TRANSPARENT INVESTMENT MODEL
            </span>
          </div>

          <h2
            id="why-aurum-heading"
            className="mt-5 font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-[#0B1F3A] sm:text-5xl lg:text-[54px]"
          >
            Why Choose{" "}
            <span className="bg-gradient-to-r from-[#0B1F3A] via-[#047857] to-[#9E7524] bg-clip-text text-transparent">
              Aurum?
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#475569] sm:text-lg">
            A Transparent EV Investment Model Built Around Long-Term Rental Opportunities.
          </p>
        </RevealOnScroll>

        {/* PART 1 — INVESTMENT MODEL OVERVIEW (4 Refined Glass Panels) */}
        <RevealOnScroll delayMs={60}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OVERVIEW_PANELS.map((panel) => (
              <div
                key={panel.index}
                className="group relative overflow-hidden rounded-3xl border border-[#0B1F3A]/10 bg-white/90 p-6 shadow-[0_12px_36px_rgba(11,31,58,0.05),inset_0_1px_0_rgba(255,255,255,1)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#C69A43]/45 hover:shadow-[0_18px_44px_rgba(11,31,58,0.08)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">
                    {panel.label}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] ${
                      panel.accent === "emerald"
                        ? "bg-[#ECFDF5] text-[#047857]"
                        : panel.accent === "gold"
                          ? "bg-[#FAF7F0] text-[#9E7524]"
                          : "bg-[#F1F5F9] text-[#0B1F3A]"
                    }`}
                  >
                    {panel.index}
                  </span>
                </div>

                <p className="mt-4 font-display text-2xl font-bold tracking-[-0.025em] text-[#0B1F3A] tabular-nums sm:text-[28px]">
                  {panel.headline}
                </p>

                <div className="mt-4 space-y-1 border-t border-[#0B1F3A]/[0.07] pt-3.5">
                  {panel.lines.map((line) => (
                    <p key={line} className="text-xs font-medium text-[#475569] tabular-nums">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* PART 2 — INVESTMENT PLANS & PROJECTED RENTAL RETURNS */}
        <RevealOnScroll delayMs={90}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9E7524]">
                INVESTMENT PLANS &amp; SCHEDULE
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.025em] text-[#0B1F3A] sm:text-3xl">
                Projected Rental Returns Across Five Defined Tiers
              </h3>
            </div>
            <p className="text-xs font-medium text-[#64748B] sm:text-right">
              All rates reflect fixed 48-month illustrative schedules · Select a plan to inspect
            </p>
          </div>

          {/* Desktop & Tablet Institutional Table */}
          <div className="mt-6 hidden overflow-hidden rounded-3xl border border-[#0B1F3A]/10 bg-white/95 shadow-[0_18px_50px_rgba(11,31,58,0.06)] backdrop-blur-xl md:block">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#0B1F3A]/10 bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#475569]">
                    <th className="px-5 py-4">EV Units</th>
                    <th className="px-4 py-4">
                      Investment
                      <span className="mt-0.5 block text-[9px] font-medium normal-case tracking-normal text-[#64748B]">
                        ₹66,500 per EV
                      </span>
                    </th>
                    <th className="px-4 py-4">
                      GST 5%
                      <span className="mt-0.5 block text-[9px] font-medium normal-case tracking-normal text-[#64748B]">
                        ₹3,500 per EV
                      </span>
                    </th>
                    <th className="px-4 py-4">
                      Total Investment
                      <span className="mt-0.5 block text-[9px] font-medium normal-case tracking-normal text-[#64748B]">
                        ₹70,000 per EV
                      </span>
                    </th>
                    <th className="px-4 py-4">Per EV Rental</th>
                    <th className="px-4 py-4">
                      Monthly Payout
                      <span className="mt-0.5 block text-[9px] font-medium normal-case tracking-normal text-[#64748B]">
                        Investor Cut
                      </span>
                    </th>
                    <th className="px-4 py-4">
                      Total Rental
                      <span className="mt-0.5 block text-[9px] font-medium normal-case tracking-normal text-[#64748B]">
                        48 Months
                      </span>
                    </th>
                    <th className="px-5 py-4 text-right">
                      Projected Rental Surplus
                      <span className="mt-0.5 block text-[9px] font-medium normal-case tracking-normal text-[#64748B]">
                        Rental − Investment
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B1F3A]/[0.07] text-sm tabular-nums">
                  {ALL_COMPUTED_PLANS.map((plan) => {
                    const isEntry = plan.evUnits === 2;
                    const isFlagship = plan.evUnits === 50;
                    const isSelected = selectedUnits === plan.evUnits;

                    return (
                      <tr
                        key={plan.evUnits}
                        onClick={() => selectPlanAndScroll(plan.evUnits)}
                        className={`cursor-pointer transition-colors duration-200 ${
                          isEntry
                            ? "bg-[#ECFDF5]/60 hover:bg-[#ECFDF5]"
                            : isFlagship
                              ? "bg-[#FAF6EC]/85 hover:bg-[#FAF3E0]"
                              : "bg-white hover:bg-[#F8FAFC]"
                        } ${isSelected ? "ring-1 ring-inset ring-[#059669]/40" : ""}`}
                      >
                        <td className="px-5 py-4 font-display font-bold text-[#0B1F3A]">
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{plan.evUnits}</span>
                            {plan.highlightBadge && (
                              <span
                                className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                                  plan.highlightTone === "emerald"
                                    ? "border border-[#059669]/30 bg-[#059669]/10 text-[#047857]"
                                    : "border border-[#C69A43]/40 bg-[#C69A43]/15 text-[#8E671D]"
                                }`}
                              >
                                {plan.highlightBadge}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 font-medium text-[#334155]">
                          {formatINR(plan.investment)}
                        </td>
                        <td className="px-4 py-4 text-[#64748B]">{formatINR(plan.gst)}</td>
                        <td className="px-4 py-4 font-semibold text-[#0B1F3A]">
                          {formatINR(plan.totalInvestment)}
                        </td>
                        <td className="px-4 py-4 font-semibold text-[#0B1F3A]">
                          {formatINR(plan.rentalPerEvMonthly)}
                        </td>
                        <td className="px-4 py-4 font-semibold text-[#0B1F3A]">
                          {formatINR(plan.monthlyRental)}
                        </td>
                        <td className="px-4 py-4 font-semibold text-[#0B1F3A]">
                          {formatINR(plan.totalRental48Months)}
                        </td>
                        <td className="px-5 py-4 text-right font-display text-base font-bold text-[#047857]">
                          {formatINR(plan.projectedRentalSurplus)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Expandable Plan Cards (< md) */}
          <div className="mt-6 space-y-3 md:hidden">
            {ALL_COMPUTED_PLANS.map((plan) => {
              const isExpanded = expandedMobilePlan === plan.evUnits;
              const isEntry = plan.evUnits === 2;
              const isFlagship = plan.evUnits === 50;

              return (
                <div
                  key={plan.evUnits}
                  className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                    isEntry
                      ? "border-[#059669]/35 bg-[#ECFDF5]/50 shadow-[0_8px_24px_rgba(5,150,105,0.07)]"
                      : isFlagship
                        ? "border-[#C69A43]/45 bg-[#FAF6EC]/75 shadow-[0_8px_24px_rgba(198,154,67,0.09)]"
                        : "border-[#0B1F3A]/10 bg-white shadow-[0_6px_18px_rgba(11,31,58,0.04)]"
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() =>
                      setExpandedMobilePlan((prev) =>
                        prev === plan.evUnits ? null : plan.evUnits,
                      )
                    }
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg font-bold text-[#0B1F3A]">
                          {plan.evUnits} EVs
                        </span>
                        {plan.highlightBadge && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] ${
                              plan.highlightTone === "emerald"
                                ? "bg-[#059669]/15 text-[#047857]"
                                : "bg-[#C69A43]/20 text-[#8E671D]"
                            }`}
                          >
                            {plan.highlightBadge}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs font-medium text-[#475569] tabular-nums">
                        Total Investment: {formatINR(plan.totalInvestment)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">
                          Surplus
                        </p>
                        <p className="font-display text-base font-bold text-[#047857] tabular-nums">
                          {formatINR(plan.projectedRentalSurplus)}
                        </p>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-[#475569] transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-[#0B1F3A]/10 bg-white/85 px-4 py-3.5 text-xs tabular-nums">
                      <dl className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                        <div>
                          <dt className="text-[#64748B]">Base Investment</dt>
                          <dd className="mt-0.5 font-semibold text-[#0B1F3A]">
                            {formatINR(plan.investment)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#64748B]">GST (5%)</dt>
                          <dd className="mt-0.5 font-semibold text-[#0B1F3A]">
                            {formatINR(plan.gst)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#64748B]">Rental / EV / Month</dt>
                          <dd className="mt-0.5 font-semibold text-[#0B1F3A]">
                            {formatINR(plan.rentalPerEvMonthly)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#64748B]">Monthly Rental</dt>
                          <dd className="mt-0.5 font-semibold text-[#0B1F3A]">
                            {formatINR(plan.monthlyRental)}
                          </dd>
                        </div>
                        <div className="col-span-2 flex items-center justify-between border-t border-[#0B1F3A]/[0.07] pt-2.5">
                          <span className="text-[#64748B]">Total Rental (48 Months)</span>
                          <span className="font-bold text-[#0B1F3A]">
                            {formatINR(plan.totalRental48Months)}
                          </span>
                        </div>
                      </dl>
                      <button
                        type="button"
                        onClick={() => selectPlanAndScroll(plan.evUnits)}
                        className="mt-3 w-full rounded-xl border border-[#0B1F3A]/15 bg-[#F8FAFC] py-2 text-xs font-semibold text-[#0B1F3A] transition hover:border-[#059669]/40 hover:bg-[#ECFDF5]"
                      >
                        Load {plan.evUnits} EVs in Live Calculator
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </RevealOnScroll>

        {/* PART 3 — APPLE LIQUID GLASS INVESTMENT CALCULATOR */}
        <RevealOnScroll delayMs={110}>
          <div className="relative py-2">
            {/* Soft Ambient Depth Wash Behind Liquid Glass Slab */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-4 -z-0 rounded-[48px] bg-[radial-gradient(ellipse_75%_65%_at_25%_20%,rgba(5,150,105,0.06),transparent_60%),radial-gradient(ellipse_70%_60%_at_80%_80%,rgba(198,154,67,0.07),transparent_62%)] blur-xl"
            />

            {/* Main Liquid Glass Container */}
            <div
              ref={glassPaneRef}
              onPointerMove={handleGlassPointerMove}
              onPointerLeave={handleGlassPointerLeave}
              style={
                {
                  "--gx": "50%",
                  "--gy": "50%",
                  "--g-active": "0",
                } as React.CSSProperties
              }
              className="relative z-10 overflow-hidden rounded-[34px] border border-white/90 bg-white/[0.76] p-6 shadow-[0_24px_70px_rgba(11,31,58,0.08),inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(11,31,58,0.03)] ring-1 ring-black/[0.06] backdrop-blur-2xl backdrop-saturate-[180%] sm:p-9 lg:p-11"
            >
              {/* Top Specular Edge Glint */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
              />

              {/* Subtle Mouse-Tracking Optical Glass Refraction */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  opacity: "var(--g-active)",
                  background:
                    "radial-gradient(420px circle at var(--gx) var(--gy), rgba(255,255,255,0.68), rgba(252,170,48,0.04) 46%, transparent 72%)",
                }}
              />

              {/* Minimalist Header + Apple Segmented Frosted Selector */}
              <div className="relative z-10 flex flex-col justify-between gap-5 border-b border-black/[0.06] pb-7 lg:flex-row lg:items-center">
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[#0F0F0F] sm:text-[30px]">
                    Live Investment Calculator
                  </h3>
                  <p className="mt-1 text-sm text-[#64748B]">
                    Select a fleet plan for 48-month scheduled rental projections.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div
                    role="group"
                    aria-label="Select EV plan tier"
                    className="inline-flex flex-wrap items-center gap-1 rounded-full border border-black/[0.05] bg-[#0F0F0F]/[0.045] p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-md"
                  >
                    {ALL_COMPUTED_PLANS.map((plan) => {
                      const active = selectedUnits === plan.evUnits;
                      return (
                        <button
                          key={plan.evUnits}
                          type="button"
                          aria-pressed={active}
                          onClick={() => selectPlanAndScroll(plan.evUnits)}
                          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 sm:px-4 sm:text-[13px] ${
                            active
                              ? "bg-white text-[#0F0F0F] shadow-[0_3px_12px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)]"
                              : "text-[#64748B] hover:text-[#0F0F0F]"
                          }`}
                        >
                          {plan.evUnits} EVs
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => selectPlanAndScroll(2)}
                    aria-label="Reset calculator to 2 EVs"
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white/75 px-3.5 py-2 text-xs font-medium text-[#64748B] shadow-sm backdrop-blur-md transition hover:bg-white hover:text-[#0F0F0F] active:scale-95"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Clean Asymmetric Two-Column Bento Split */}
              <div className="relative z-10 mt-8 grid gap-8 lg:grid-cols-12 lg:items-stretch">
                {/* LEFT COLUMN — Typographic Surplus Hero + Minimalist Glass Ledger */}
                <div className="flex flex-col justify-between gap-6 lg:col-span-6">
                  <div className="px-1">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#64748B]">
                      Projected Rental Surplus · 48 Months
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-baseline gap-3">
                      <AnimatedINR
                        testId="calc-surplus"
                        value={activePlan.projectedRentalSurplus}
                        className="font-display text-4xl font-semibold tracking-[-0.04em] text-[#047857] tabular-nums sm:text-[50px]"
                      />
                      <span className="rounded-full border border-[#059669]/20 bg-[#ECFDF5]/90 px-3 py-1 text-xs font-semibold text-[#047857] tabular-nums">
                        {formatIndianCompact(activePlan.projectedRentalSurplus)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-[#64748B] tabular-nums">
                      Total 48-month rental minus {formatINR(activePlan.totalInvestment)} initial investment
                    </p>
                  </div>

                  {/* Clean Apple-style Translucent Hairline Ledger */}
                  <div className="divide-y divide-black/[0.06] rounded-3xl border border-white/95 bg-white/[0.62] px-5 py-1 shadow-[0_8px_28px_rgba(11,31,58,0.035),inset_0_1px_0_rgba(255,255,255,1)] ring-1 ring-black/[0.04] backdrop-blur-xl sm:px-6">
                    <div className="flex items-center justify-between gap-4 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-[#0F0F0F]">Total Investment</p>
                        <p className="text-[11px] text-[#64748B] tabular-nums">
                          {formatINR(activePlan.investment)} + {formatINR(activePlan.gst)} GST (5%)
                        </p>
                      </div>
                      <AnimatedINR
                        testId="calc-total-investment"
                        value={activePlan.totalInvestment}
                        className="font-display text-lg font-semibold text-[#0F0F0F] tabular-nums sm:text-xl"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-[#0F0F0F]">
                          Monthly Per-EV Rate ({activePlan.evUnits} EVs)
                        </p>
                        <p className="text-[11px] text-[#64748B]">48-month scheduled rate</p>
                      </div>
                      <p
                        data-testid="calc-rate-per-ev"
                        className="font-display text-lg font-semibold text-[#0F0F0F] tabular-nums sm:text-xl"
                      >
                        <AnimatedINR value={activePlan.rentalPerEvMonthly} />
                        <span className="ml-1 text-xs font-normal text-[#64748B]">/ EV</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-[#0F0F0F]">Monthly Scheduled Rental</p>
                        <p className="text-[11px] text-[#64748B] tabular-nums">
                          Investor Cut · {formatIndianCompact(activePlan.monthlyRental)} / mo
                        </p>
                      </div>
                      <AnimatedINR
                        testId="calc-monthly-rental"
                        value={activePlan.monthlyRental}
                        className="font-display text-lg font-semibold text-[#0F0F0F] tabular-nums sm:text-xl"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-[#0F0F0F]">Annual Scheduled Rental</p>
                        <p className="text-[11px] text-[#64748B] tabular-nums">
                          12-month schedule · {formatIndianCompact(activePlan.annualRental)}
                        </p>
                      </div>
                      <AnimatedINR
                        testId="calc-annual-rental"
                        value={activePlan.annualRental}
                        className="font-display text-lg font-semibold text-[#0F0F0F] tabular-nums sm:text-xl"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-[#0F0F0F]">48-Month Scheduled Rental</p>
                        <p className="text-[11px] text-[#64748B] tabular-nums">
                          Full term · {formatIndianCompact(activePlan.totalRental48Months)}
                        </p>
                      </div>
                      <AnimatedINR
                        testId="calc-total-rental"
                        value={activePlan.totalRental48Months}
                        className="font-display text-lg font-semibold text-[#0F0F0F] tabular-nums sm:text-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN — Minimalist Liquid Glass Curve Visualizer */}
                <div className="flex flex-col justify-between rounded-3xl border border-white/95 bg-gradient-to-b from-white/[0.78] to-white/[0.45] p-6 shadow-[0_12px_36px_rgba(11,31,58,0.04),inset_0_1px_1px_rgba(255,255,255,1)] ring-1 ring-black/[0.045] backdrop-blur-xl sm:p-7 lg:col-span-6">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-[#64748B] tabular-nums">
                          Year {activeMilestone.year} ({activeMilestone.months}M Cumulative)
                        </p>
                        <p className="mt-0.5 font-display text-xl font-semibold tracking-[-0.02em] text-[#0F0F0F] tabular-nums sm:text-2xl">
                          {formatINR(activeMilestone.cumulative)}{" "}
                          <span className="text-sm font-medium text-[#047857]">
                            · {formatIndianCompact(activeMilestone.cumulative)}
                          </span>
                        </p>
                      </div>

                      {/* Subtle Apple 1Y-4Y Pills */}
                      <div className="inline-flex rounded-full border border-black/[0.05] bg-[#0F0F0F]/[0.045] p-0.5">
                        {annualMilestones.map((m) => (
                          <button
                            key={m.year}
                            type="button"
                            onClick={() => setActiveYear(m.year)}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all duration-200 ${
                              activeYear === m.year
                                ? "bg-white text-[#0F0F0F] shadow-sm"
                                : "text-[#64748B] hover:text-[#0F0F0F]"
                            }`}
                          >
                            {m.year}Y
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ultra-Clean Minimalist SVG Curve */}
                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-end">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#8E671D] tabular-nums">
                          <span className="h-0.5 w-3 border-t border-dashed border-[#C69A43]" />
                          Initial Capital: {formatIndianCompact(activePlan.totalInvestment)}
                        </span>
                      </div>

                      <svg
                        viewBox="0 0 520 170"
                        className="h-44 w-full overflow-visible sm:h-48"
                        role="img"
                        aria-label={`48-month cumulative scheduled rental curve for ${activePlan.evUnits} EVs`}
                      >
                        <defs>
                          <linearGradient id="appleGlassArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#059669" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="appleGlassStroke" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#0F0F0F" />
                            <stop offset="100%" stopColor="#059669" />
                          </linearGradient>
                        </defs>

                        {/* Faint horizontal reference hairlines */}
                        {[42, 94, 146].map((yPos) => (
                          <line
                            key={yPos}
                            x1="20"
                            y1={yPos}
                            x2="508"
                            y2={yPos}
                            stroke="#0F0F0F"
                            strokeOpacity="0.06"
                            strokeWidth="1"
                          />
                        ))}

                        {/* Dashed Gold Capital Baseline */}
                        <line
                          x1="20"
                          y1={capitalLineY}
                          x2="508"
                          y2={capitalLineY}
                          stroke="#C69A43"
                          strokeDasharray="4 4"
                          strokeOpacity="0.75"
                          strokeWidth="1.25"
                        />

                        {/* Mist Fill + Smooth Line */}
                        <path
                          d={areaPath}
                          fill="url(#appleGlassArea)"
                          className="transition-all duration-500 ease-out"
                        />
                        <polyline
                          fill="none"
                          stroke="url(#appleGlassStroke)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={linePoints}
                          className="transition-all duration-500 ease-out"
                        />

                        {/* Minimalist Interactive Year Nodes */}
                        {annualMilestones.map((m, idx) => {
                          const cx = xCoords[idx + 1];
                          const cy = yCoords[idx + 1];
                          const isNodeActive = activeYear === m.year;
                          return (
                            <g
                              key={m.year}
                              className="cursor-pointer"
                              onMouseEnter={() => setActiveYear(m.year)}
                              onClick={() => setActiveYear(m.year)}
                            >
                              <line
                                x1={cx}
                                y1={cy}
                                x2={cx}
                                y2={chartBaseY}
                                stroke={isNodeActive ? "#059669" : "#0F0F0F"}
                                strokeOpacity={isNodeActive ? "0.35" : "0.08"}
                                strokeWidth="1"
                                strokeDasharray="2 3"
                              />
                              {isNodeActive && (
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r="11"
                                  fill="#059669"
                                  fillOpacity="0.14"
                                />
                              )}
                              <circle
                                cx={cx}
                                cy={cy}
                                r={isNodeActive ? 5.5 : 3.5}
                                fill={isNodeActive ? "#059669" : "#FFFFFF"}
                                stroke={isNodeActive ? "#FFFFFF" : "#0F0F0F"}
                                strokeWidth="2"
                                className="transition-all duration-300"
                              />
                              <text
                                x={cx}
                                y="164"
                                textAnchor="middle"
                                className={`text-[11px] font-medium ${
                                  isNodeActive ? "fill-[#0F0F0F]" : "fill-[#64748B]"
                                }`}
                              >
                                {m.months}M
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>

                  {/* Clean Apple Storage-Style Split Meter & CTA */}
                  <div className="mt-6 border-t border-black/[0.06] pt-5">
                    <div className="flex items-center justify-between text-xs font-medium tabular-nums">
                      <span className="inline-flex items-center gap-1.5 text-[#0F0F0F]">
                        <span className="h-2 w-2 rounded-full bg-[#0F0F0F]" />
                        Capital ({capitalSharePct}%)
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[#047857]">
                        <span className="h-2 w-2 rounded-full bg-[#059669]" />
                        Surplus ({surplusSharePct}%)
                      </span>
                    </div>

                    <div className="mt-2.5 flex h-2 w-full overflow-hidden rounded-full bg-black/[0.06]">
                      <div
                        className="h-full bg-[#0F0F0F] transition-all duration-500 ease-out"
                        style={{ width: `${capitalSharePct}%` }}
                      />
                      <div
                        className="h-full bg-[#059669] transition-all duration-500 ease-out"
                        style={{ width: `${surplusSharePct}%` }}
                      />
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-[#64748B]">
                        {activePlan.evUnits} EVs · {INVESTMENT_MODEL_CONSTANTS.agreementMonths}-Month Schedule
                      </p>
                      <Link
                        href={`/invest?units=${activePlan.evUnits}`}
                        className="group inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/90 px-4 py-2 text-xs font-semibold text-[#0F0F0F] shadow-[0_4px_14px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C69A43]/60 hover:bg-white"
                      >
                        <span>Invest Now</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* PART 4 — WHY AURUM (5 Benefit Highlights) */}
        <RevealOnScroll delayMs={130}>
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9E7524]">
              STRUCTURAL ADVANTAGES
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.025em] text-[#0B1F3A] sm:text-3xl">
              Why Aurum
            </h3>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {WHY_AURUM_BENEFITS.map(({ title, detail, Icon }) => (
              <div
                key={title}
                className="group rounded-3xl border border-[#0B1F3A]/10 bg-white p-6 shadow-[0_8px_24px_rgba(11,31,58,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#059669]/40 hover:shadow-[0_16px_36px_rgba(11,31,58,0.07)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#0B1F3A]/10 bg-[#F8FAFC] text-[#0B1F3A] transition-colors duration-300 group-hover:border-[#059669]/30 group-hover:bg-[#ECFDF5] group-hover:text-[#047857]">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <h4 className="mt-4 font-display text-base font-semibold leading-snug text-[#0B1F3A]">
                  {title}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[#475569]">{detail}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* PART 5 — IMPORTANT INVESTMENT DISCLAIMER */}
        <RevealOnScroll delayMs={150}>
          <div className="rounded-2xl border border-[#C69A43]/30 border-l-4 border-l-[#C69A43] bg-[#FAF9F6] px-5 py-4 sm:px-7 sm:py-5">
            <div className="flex items-start gap-3.5">
              <Info
                className="mt-0.5 h-4 w-4 shrink-0 text-[#9E7524]"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9E7524]">
                  Important Investment Disclaimer
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-[#475569] sm:text-[13px]">
                  Figures shown are illustrative projections based on the investment plans and rental
                  rates displayed. Actual rental payouts are subject to the executed agreement,
                  applicable conditions, operational arrangements, taxes and other applicable
                  charges. Projected rental surplus is calculated as total scheduled rental minus
                  initial investment and should not be interpreted as guaranteed profit or assured
                  returns.
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
