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
  Sparkles,
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

  const activePlan = calculateInvestmentPlan(selectedUnits);
  const selectedIndex = ALL_COMPUTED_PLANS.findIndex((p) => p.evUnits === selectedUnits);
  const railProgressPct = (selectedIndex / (ALL_COMPUTED_PLANS.length - 1)) * 100;

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
  const chartPlotHeight = 136;
  const chartBaseY = 158;
  const capitalLineY = Math.round(chartBaseY - (capitalLineHeightPct / 100) * chartPlotHeight);
  const xCoords = [32, 148, 264, 380, 496] as const;
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

        {/* PART 3 — LIVE INVESTMENT CALCULATOR & VISUALIZATION */}
        <RevealOnScroll delayMs={110}>
          <div className="relative overflow-hidden rounded-[34px] border border-[#0B1F3A]/10 bg-gradient-to-br from-[#F8FAFC] via-white to-[#FAF7F0]/65 p-5 shadow-[0_24px_64px_rgba(11,31,58,0.07),inset_0_1px_0_rgba(255,255,255,1)] sm:p-8 lg:p-10">
            {/* Subtle ambient gold-emerald optical corner glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(5,150,105,0.09),transparent_68%)] blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(198,154,67,0.10),transparent_68%)] blur-2xl"
            />

            {/* Top Command Deck */}
            <div className="relative z-10 flex flex-col justify-between gap-5 border-b border-[#0B1F3A]/10 pb-6 lg:flex-row lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#059669]/25 bg-[#ECFDF5] px-3 py-1">
                  <Sparkles className="h-3 w-3 text-[#047857]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#047857]">
                    INTERACTIVE SCHEDULE SIMULATOR
                  </span>
                </div>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.025em] text-[#0B1F3A] sm:text-3xl">
                  Live Investment Calculator
                </h3>
                <p className="mt-1 text-sm text-[#475569]">
                  Switch between the five defined EV tiers for instant 48-month projections.
                </p>
              </div>

              {/* Tactile Tier Pills + Reset */}
              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#0B1F3A]/10 bg-white/90 p-1.5 shadow-[0_6px_20px_rgba(11,31,58,0.04)] backdrop-blur-md">
                {ALL_COMPUTED_PLANS.map((plan) => {
                  const active = selectedUnits === plan.evUnits;
                  return (
                    <button
                      key={plan.evUnits}
                      type="button"
                      aria-pressed={active}
                      onClick={() => selectPlanAndScroll(plan.evUnits)}
                      className={`relative rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-300 sm:px-4 sm:text-sm ${
                        active
                          ? "scale-[1.03] bg-gradient-to-r from-[#0B1F3A] to-[#13355F] text-white shadow-[0_8px_20px_rgba(11,31,58,0.24)]"
                          : "text-[#475569] hover:bg-[#ECFDF5]/80 hover:text-[#047857]"
                      }`}
                    >
                      {plan.evUnits} EVs
                    </button>
                  );
                })}

                <div className="mx-0.5 hidden h-5 w-px bg-[#0B1F3A]/10 sm:block" aria-hidden="true" />

                <button
                  type="button"
                  onClick={() => selectPlanAndScroll(2)}
                  aria-label="Reset calculator to 2 EVs"
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#64748B] transition-all duration-200 hover:bg-[#FAF7F0] hover:text-[#9E7524] active:scale-95"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Kinetic Fleet Tier Progress Scrubber Track */}
            <div className="relative z-10 mt-6 px-2 sm:px-4">
              <div className="relative flex items-center justify-between">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-3 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#E2E8F0]"
                />
                <div
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#059669] via-[#0B1F3A] to-[#C69A43] transition-all duration-500 ease-out"
                  style={{ width: `calc(${railProgressPct}% * 0.96)` }}
                />

                {ALL_COMPUTED_PLANS.map((plan, idx) => {
                  const isActive = selectedUnits === plan.evUnits;
                  const isReached = idx <= selectedIndex;
                  return (
                    <button
                      key={plan.evUnits}
                      type="button"
                      onClick={() => selectPlanAndScroll(plan.evUnits)}
                      className="group relative z-10 flex flex-col items-center focus-visible:outline-none"
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                          isActive
                            ? "scale-125 border-white bg-[#059669] shadow-[0_0_0_4px_rgba(5,150,105,0.22),0_4px_12px_rgba(5,150,105,0.3)]"
                            : isReached
                              ? "border-white bg-[#0B1F3A] group-hover:scale-110"
                              : "border-[#CBD5E1] bg-white group-hover:border-[#059669]"
                        }`}
                      >
                        {isActive && <span className="h-1.5 w-1.5 animate-ping rounded-full bg-white" />}
                      </span>
                      <span
                        className={`mt-1.5 text-[10px] font-semibold tabular-nums transition-colors ${
                          isActive ? "text-[#0B1F3A]" : "text-[#64748B]"
                        }`}
                      >
                        {plan.evUnits} EVs
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Symmetric Equal-Height Two-Column Bento Simulator */}
            <div className="relative z-10 mt-7 grid gap-6 lg:grid-cols-12 lg:items-stretch">
              {/* LEFT COLUMN — Hero Surplus Spotlight + Clean 2x2 Metrics */}
              <div className="flex flex-col justify-between gap-4 lg:col-span-5">
                {/* Featured Emerald Surplus Hero Card */}
                <div className="group relative overflow-hidden rounded-3xl border border-[#059669]/35 bg-gradient-to-br from-[#ECFDF5] via-white to-[#F0FDF4] p-6 shadow-[0_14px_38px_rgba(5,150,105,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_46px_rgba(5,150,105,0.16)]">
                  {/* Subtle animated shimmer sweep */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-[heroShimmer_5s_ease-in-out_infinite]"
                  />

                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#047857]">
                      <span className="h-2 w-2 rounded-full bg-[#059669] shadow-[0_0_8px_rgba(5,150,105,0.7)]" />
                      Projected Rental Surplus
                    </span>
                    <span className="rounded-full border border-[#059669]/25 bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-[#047857] tabular-nums">
                      48M Net Above Capital
                    </span>
                  </div>

                  <div className="relative z-10 mt-3 flex flex-wrap items-baseline gap-3">
                    <AnimatedINR
                      testId="calc-surplus"
                      value={activePlan.projectedRentalSurplus}
                      className="font-display text-3xl font-bold tracking-[-0.03em] text-[#047857] tabular-nums sm:text-[40px]"
                    />
                    <span className="rounded-full bg-[#047857]/10 px-2.5 py-0.5 text-xs font-bold text-[#047857] tabular-nums">
                      {formatIndianCompact(activePlan.projectedRentalSurplus)}
                    </span>
                  </div>

                  <p className="relative z-10 mt-2 text-xs font-medium text-[#475569] tabular-nums">
                    Scheduled 48-month rental minus {formatINR(activePlan.totalInvestment)} initial investment
                  </p>
                </div>

                {/* Equal 2x2 Breakdown Grid */}
                <div className="grid flex-1 gap-3.5 sm:grid-cols-2">
                  {/* Total Investment */}
                  <div className="flex flex-col justify-between rounded-2xl border border-[#0B1F3A]/10 bg-white/95 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0B1F3A]/25 hover:shadow-md sm:p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                      Total Investment
                    </p>
                    <AnimatedINR
                      testId="calc-total-investment"
                      value={activePlan.totalInvestment}
                      className="mt-2 font-display text-xl font-bold text-[#0B1F3A] tabular-nums sm:text-2xl"
                    />
                    <p className="mt-1.5 text-[11px] text-[#64748B] tabular-nums">
                      {formatINR(activePlan.investment)} + {formatINR(activePlan.gst)} GST (5%)
                    </p>
                  </div>

                  {/* Plan Rate */}
                  <div className="flex flex-col justify-between rounded-2xl border border-[#C69A43]/35 bg-[#FAF7F0]/80 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C69A43] hover:shadow-md sm:p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9E7524]">
                      Plan Rate ({activePlan.evUnits} EVs)
                    </p>
                    <p
                      data-testid="calc-rate-per-ev"
                      className="mt-2 font-display text-xl font-bold text-[#0B1F3A] tabular-nums sm:text-2xl"
                    >
                      <AnimatedINR value={activePlan.rentalPerEvMonthly} />
                      <span className="ml-1 text-[11px] font-medium text-[#64748B]">/ EV / mo</span>
                    </p>
                    <p className="mt-1.5 text-[11px] text-[#64748B]">
                      {INVESTMENT_MODEL_CONSTANTS.agreementMonths}-Month fixed rate tier
                    </p>
                  </div>

                  {/* Monthly Scheduled Rental */}
                  <div className="flex flex-col justify-between rounded-2xl border border-[#0B1F3A]/10 bg-white/95 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#059669]/35 hover:shadow-md sm:p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                      Monthly Scheduled Rental
                    </p>
                    <AnimatedINR
                      testId="calc-monthly-rental"
                      value={activePlan.monthlyRental}
                      className="mt-2 font-display text-xl font-bold text-[#0B1F3A] tabular-nums sm:text-2xl"
                    />
                    <p className="mt-1.5 text-[11px] font-medium text-[#64748B] tabular-nums">
                      {formatIndianCompact(activePlan.monthlyRental)} / month
                    </p>
                  </div>

                  {/* Annual Scheduled Rental */}
                  <div className="flex flex-col justify-between rounded-2xl border border-[#0B1F3A]/10 bg-white/95 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#059669]/35 hover:shadow-md sm:p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                      Annual Scheduled Rental
                    </p>
                    <AnimatedINR
                      testId="calc-annual-rental"
                      value={activePlan.annualRental}
                      className="mt-2 font-display text-xl font-bold text-[#0B1F3A] tabular-nums sm:text-2xl"
                    />
                    <p className="mt-1.5 text-[11px] font-medium text-[#64748B] tabular-nums">
                      {formatIndianCompact(activePlan.annualRental)} / 12 months
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN — Interactive 48-Month Cumulative Visualizer Card */}
              <div className="flex flex-col justify-between rounded-3xl border border-[#0B1F3A]/10 bg-white/95 p-5 shadow-[0_14px_40px_rgba(11,31,58,0.05)] backdrop-blur-xl sm:p-7 lg:col-span-7">
                <div>
                  {/* 48M Total Scheduled Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#0B1F3A]/[0.07] pb-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">
                        48-Month Scheduled Rental
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-baseline gap-2.5">
                        <AnimatedINR
                          testId="calc-total-rental"
                          value={activePlan.totalRental48Months}
                          className="font-display text-2xl font-bold tracking-[-0.025em] text-[#0B1F3A] tabular-nums sm:text-[34px]"
                        />
                        <span className="rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-xs font-bold text-[#0B1F3A] tabular-nums">
                          {formatIndianCompact(activePlan.totalRental48Months)}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Active Year Readout Pill */}
                    <div className="rounded-2xl border border-[#0B1F3A]/10 bg-[#F8FAFC] px-3.5 py-2 text-right tabular-nums">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
                        Year {activeMilestone.year} ({activeMilestone.months}M Cumulative)
                      </p>
                      <p className="mt-0.5 font-display text-sm font-bold text-[#047857] sm:text-base">
                        {formatINR(activeMilestone.cumulative)} ·{" "}
                        {formatIndianCompact(activeMilestone.cumulative)}
                      </p>
                    </div>
                  </div>

                  {/* Responsive Animated SVG Curve + Milestone Bars */}
                  <div className="relative mt-5 rounded-2xl border border-[#0B1F3A]/[0.07] bg-[#F8FAFC]/80 p-3 sm:p-4">
                    <div className="mb-1 flex items-center justify-between px-1 text-[10px] font-semibold tabular-nums">
                      <span className="text-[#64748B]">Hover or tap a milestone year</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C69A43]/35 bg-[#FAF7F0] px-2.5 py-0.5 text-[#9E7524]">
                        <span className="h-0.5 w-3 border-t border-dashed border-[#C69A43]" />
                        Initial Capital {formatIndianCompact(activePlan.totalInvestment)}
                      </span>
                    </div>

                    <svg
                      viewBox="0 0 520 185"
                      className="h-44 w-full overflow-visible sm:h-48"
                      role="img"
                      aria-label={`48-month cumulative scheduled rental curve for ${activePlan.evUnits} EVs`}
                    >
                      <defs>
                        <linearGradient id="aurumAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#059669" stopOpacity="0.26" />
                          <stop offset="65%" stopColor="#0B1F3A" stopOpacity="0.08" />
                          <stop offset="100%" stopColor="#0B1F3A" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="aurumLineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#0B1F3A" />
                          <stop offset="55%" stopColor="#059669" />
                          <stop offset="100%" stopColor="#C69A43" />
                        </linearGradient>
                      </defs>

                      {/* Subtle baseline horizontal guides */}
                      {[52, 92, 130, 158].map((yPos) => (
                        <line
                          key={yPos}
                          x1="20"
                          y1={yPos}
                          x2="508"
                          y2={yPos}
                          stroke="#CBD5E1"
                          strokeOpacity="0.45"
                          strokeWidth="1"
                        />
                      ))}

                      {/* Initial Capital Dashed Gold Benchmark Line */}
                      <line
                        x1="20"
                        y1={capitalLineY}
                        x2="508"
                        y2={capitalLineY}
                        stroke="#C69A43"
                        strokeDasharray="5 4"
                        strokeWidth="1.5"
                      />

                      {/* Filled Trajectory Area */}
                      <path
                        d={areaPath}
                        fill="url(#aurumAreaGrad)"
                        className="transition-all duration-500 ease-out"
                      />

                      {/* Trajectory Stroke Line */}
                      <polyline
                        fill="none"
                        stroke="url(#aurumLineGrad)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={linePoints}
                        className="transition-all duration-500 ease-out"
                      />

                      {/* Interactive Milestone Nodes + Labels */}
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
                            {/* Vertical guide bar on active node */}
                            <line
                              x1={cx}
                              y1={cy}
                              x2={cx}
                              y2={chartBaseY}
                              stroke={isNodeActive ? "#059669" : "#94A3B8"}
                              strokeOpacity={isNodeActive ? "0.45" : "0.18"}
                              strokeWidth={isNodeActive ? "2" : "1"}
                              strokeDasharray="3 3"
                            />
                            {/* Outer glowing halo on focused node */}
                            {isNodeActive && (
                              <circle
                                cx={cx}
                                cy={cy}
                                r="12"
                                fill="#059669"
                                fillOpacity="0.16"
                              />
                            )}
                            <circle
                              cx={cx}
                              cy={cy}
                              r={isNodeActive ? 6.5 : 4.5}
                              fill={isNodeActive ? "#059669" : "#0B1F3A"}
                              stroke="#FFFFFF"
                              strokeWidth="2.5"
                              className="transition-all duration-300"
                            />
                            <text
                              x={cx}
                              y={Math.max(18, cy - 12)}
                              textAnchor="middle"
                              className="fill-[#0B1F3A] text-[10px] font-semibold"
                            >
                              {formatIndianCompact(m.cumulative)}
                            </text>
                            <text
                              x={cx}
                              y="176"
                              textAnchor="middle"
                              className={`text-[11px] font-semibold ${
                                isNodeActive ? "fill-[#047857]" : "fill-[#64748B]"
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

                {/* Capital vs Surplus Ratio Meter + Direct Invest CTA */}
                <div className="mt-5 border-t border-[#0B1F3A]/[0.08] pt-4">
                  <div className="flex items-center justify-between text-xs font-semibold tabular-nums">
                    <span className="inline-flex items-center gap-1.5 text-[#0B1F3A]">
                      <span className="h-2 w-2 rounded-full bg-[#0B1F3A]" />
                      Initial Capital ({capitalSharePct}%)
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[#047857]">
                      <span className="h-2 w-2 rounded-full bg-[#059669]" />
                      Projected Surplus ({surplusSharePct}%)
                    </span>
                  </div>

                  <div className="mt-2 flex h-3 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                    <div
                      className="h-full bg-[#0B1F3A] transition-all duration-500 ease-out"
                      style={{ width: `${capitalSharePct}%` }}
                    />
                    <div
                      className="relative h-full overflow-hidden bg-gradient-to-r from-[#059669] to-[#10B981] transition-all duration-500 ease-out"
                      style={{ width: `${surplusSharePct}%` }}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[heroShimmer_3.8s_ease-in-out_infinite]"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-[#64748B]">
                      Selected configuration:{" "}
                      <strong className="text-[#0B1F3A]">{activePlan.evUnits} EVs</strong> ·{" "}
                      {INVESTMENT_MODEL_CONSTANTS.agreementMonths}-Month tenure
                    </p>
                    <Link
                      href={`/invest?units=${activePlan.evUnits}`}
                      className="group inline-flex items-center gap-2 rounded-full bg-[#0B1F3A] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#047857]"
                    >
                      <span>Invest Now</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
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
