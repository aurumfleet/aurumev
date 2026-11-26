"use client";

import { useState } from "react";
import {
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

export function WhyChooseAurumSection() {
  const [selectedUnits, setSelectedUnits] = useState<DefinedEvPlanUnits>(2);
  const [expandedMobilePlan, setExpandedMobilePlan] = useState<DefinedEvPlanUnits | null>(2);

  const activePlan = calculateInvestmentPlan(selectedUnits);

  const capitalSharePct = Number(
    ((activePlan.totalInvestment / activePlan.totalRental48Months) * 100).toFixed(1),
  );
  const surplusSharePct = Number((100 - capitalSharePct).toFixed(1));

  const annualMilestones = [1, 2, 3, 4].map((year) => {
    const cumulative = activePlan.annualRental * year;
    const heightPct = Math.round((cumulative / activePlan.totalRental48Months) * 100);
    return {
      year,
      months: year * 12,
      cumulative,
      heightPct,
    };
  });

  const capitalLineHeightPct = Math.round(
    (activePlan.totalInvestment / activePlan.totalRental48Months) * 100,
  );

  function selectPlanAndScroll(units: DefinedEvPlanUnits) {
    setSelectedUnits(units);
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
                    <th className="px-4 py-4">Investment</th>
                    <th className="px-4 py-4">GST</th>
                    <th className="px-4 py-4">Total Investment</th>
                    <th className="px-4 py-4">Rental / EV / Month</th>
                    <th className="px-4 py-4">Monthly Rental</th>
                    <th className="px-4 py-4">Total Rental (48 Months)</th>
                    <th className="px-5 py-4 text-right">Projected Rental Surplus</th>
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
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
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
          <div className="rounded-[32px] border border-[#0B1F3A]/10 bg-gradient-to-b from-[#F8FAFC] to-white p-6 shadow-[0_20px_56px_rgba(11,31,58,0.06),inset_0_1px_0_rgba(255,255,255,1)] sm:p-10">
            <div className="flex flex-col justify-between gap-5 border-b border-[#0B1F3A]/10 pb-6 lg:flex-row lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#047857]">
                  INTERACTIVE SCHEDULE SIMULATOR
                </p>
                <h3 className="mt-1.5 font-display text-2xl font-semibold tracking-[-0.025em] text-[#0B1F3A] sm:text-3xl">
                  Live Investment Calculator
                </h3>
                <p className="mt-1 text-sm text-[#475569]">
                  Select one of the five defined EV investment plans for an exact 48-month calculation.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {ALL_COMPUTED_PLANS.map((plan) => {
                  const active = selectedUnits === plan.evUnits;
                  return (
                    <button
                      key={plan.evUnits}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedUnits(plan.evUnits)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm ${
                        active
                          ? "bg-[#0B1F3A] text-white shadow-[0_8px_20px_rgba(11,31,58,0.22)]"
                          : "border border-[#0B1F3A]/15 bg-white text-[#0B1F3A] hover:border-[#059669]/50 hover:bg-[#ECFDF5]/60"
                      }`}
                    >
                      {plan.evUnits} EVs
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setSelectedUnits(2)}
                  aria-label="Reset calculator to 2 EVs"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#0B1F3A]/15 bg-white px-3.5 py-2 text-xs font-semibold text-[#475569] transition hover:border-[#C69A43] hover:text-[#0B1F3A]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Calculator Output + Trajectory Chart */}
            <div className="mt-8 grid gap-8 lg:grid-cols-12">
              {/* Left Breakdown Metrics */}
              <div className="space-y-4 lg:col-span-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Total Investment */}
                  <div className="rounded-2xl border border-[#0B1F3A]/10 bg-white p-5 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                      Total Investment
                    </p>
                    <p
                      data-testid="calc-total-investment"
                      className="mt-2 font-display text-2xl font-bold text-[#0B1F3A] tabular-nums sm:text-[28px]"
                    >
                      {formatINR(activePlan.totalInvestment)}
                    </p>
                    <p className="mt-1.5 text-xs text-[#475569] tabular-nums">
                      {formatINR(activePlan.investment)} capital + {formatINR(activePlan.gst)} GST (5%)
                    </p>
                  </div>

                  {/* Applicable Rental Rate */}
                  <div className="rounded-2xl border border-[#C69A43]/30 bg-[#FAF7F0]/75 p-5 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9E7524]">
                      Plan Rate ({activePlan.evUnits} EVs)
                    </p>
                    <p
                      data-testid="calc-rate-per-ev"
                      className="mt-2 font-display text-2xl font-bold text-[#0B1F3A] tabular-nums sm:text-[28px]"
                    >
                      {formatINR(activePlan.rentalPerEvMonthly)}
                      <span className="ml-1 text-xs font-medium text-[#64748B]">/ EV / mo</span>
                    </p>
                    <p className="mt-1.5 text-xs text-[#64748B]">
                      {INVESTMENT_MODEL_CONSTANTS.agreementMonths}-Month scheduled tenure
                    </p>
                  </div>

                  {/* Monthly Scheduled Rental */}
                  <div className="rounded-2xl border border-[#0B1F3A]/10 bg-white p-5 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                      Monthly Scheduled Rental
                    </p>
                    <p
                      data-testid="calc-monthly-rental"
                      className="mt-2 font-display text-2xl font-bold text-[#0B1F3A] tabular-nums sm:text-[26px]"
                    >
                      {formatINR(activePlan.monthlyRental)}
                    </p>
                    <p className="mt-1 text-xs font-medium text-[#64748B] tabular-nums">
                      {formatIndianCompact(activePlan.monthlyRental)} per month
                    </p>
                  </div>

                  {/* Annual Scheduled Rental */}
                  <div className="rounded-2xl border border-[#0B1F3A]/10 bg-white p-5 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                      Annual Scheduled Rental
                    </p>
                    <p
                      data-testid="calc-annual-rental"
                      className="mt-2 font-display text-2xl font-bold text-[#0B1F3A] tabular-nums sm:text-[26px]"
                    >
                      {formatINR(activePlan.annualRental)}
                    </p>
                    <p className="mt-1 text-xs font-medium text-[#64748B] tabular-nums">
                      {formatIndianCompact(activePlan.annualRental)} per 12 months
                    </p>
                  </div>
                </div>

                {/* 48-Month Total & Projected Rental Surplus */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#0B1F3A]/15 bg-[#0B1F3A]/[0.03] p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#475569]">
                      48-Month Scheduled Rental
                    </p>
                    <p
                      data-testid="calc-total-rental"
                      className="mt-2 font-display text-2xl font-bold text-[#0B1F3A] tabular-nums sm:text-3xl"
                    >
                      {formatINR(activePlan.totalRental48Months)}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#475569] tabular-nums">
                      {formatIndianCompact(activePlan.totalRental48Months)} total cumulative payout
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#059669]/35 bg-[#ECFDF5]/85 p-5 shadow-[0_8px_24px_rgba(5,150,105,0.08)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#047857]">
                      Projected Rental Surplus
                    </p>
                    <p
                      data-testid="calc-surplus"
                      className="mt-2 font-display text-2xl font-bold text-[#047857] tabular-nums sm:text-3xl"
                    >
                      {formatINR(activePlan.projectedRentalSurplus)}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#047857] tabular-nums">
                      {formatIndianCompact(activePlan.projectedRentalSurplus)} above initial investment
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Institutional Data Visualization */}
              <div className="flex flex-col justify-between rounded-3xl border border-[#0B1F3A]/10 bg-white p-6 shadow-sm lg:col-span-5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0B1F3A]">
                      48-Month Cumulative Trajectory
                    </p>
                    <span className="rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-[11px] font-semibold text-[#0B1F3A] tabular-nums">
                      {activePlan.evUnits} EVs
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#64748B]">
                    Annualized cumulative scheduled rental relative to initial investment baseline.
                  </p>

                  {/* Cumulative Bar Visualization with Initial Capital Benchmark Line */}
                  <div className="relative mt-6 h-48 rounded-2xl border border-[#0B1F3A]/[0.07] bg-[#F8FAFC] px-4 pb-3 pt-8">
                    <div className="pointer-events-none absolute right-3 top-2 z-10 inline-flex items-center gap-1.5 rounded-full border border-[#C69A43]/30 bg-[#FAF7F0] px-2.5 py-0.5 text-[10px] font-semibold text-[#9E7524] tabular-nums">
                      <span className="h-0.5 w-3 border-t border-dashed border-[#C69A43]" />
                      <span>Initial Capital {formatIndianCompact(activePlan.totalInvestment)}</span>
                    </div>

                    {/* Capital Recovery Reference Line */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-3 z-10 border-t border-dashed border-[#C69A43]/80"
                      style={{ bottom: `calc(${capitalLineHeightPct}% * 0.68 + 28px)` }}
                    />

                    <div className="relative z-20 flex h-full items-end justify-between gap-3">
                      {annualMilestones.map((m) => (
                        <div key={m.year} className="flex h-full flex-1 flex-col items-center justify-end">
                          <span className="mb-1.5 text-[10px] font-semibold text-[#0B1F3A] tabular-nums">
                            {formatIndianCompact(m.cumulative)}
                          </span>
                          <div className="flex w-full max-w-[44px] flex-1 items-end">
                            <div
                              className="w-full rounded-t-xl bg-gradient-to-t from-[#0B1F3A] to-[#059669] transition-all duration-500"
                              style={{ height: `${Math.max(14, Math.round(m.heightPct * 0.78))}%` }}
                            />
                          </div>
                          <span className="mt-2 text-[11px] font-semibold text-[#64748B] tabular-nums">
                            {m.months}M
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Capital vs Surplus Ratio Composition Bar */}
                <div className="mt-6 border-t border-[#0B1F3A]/[0.08] pt-5">
                  <div className="flex items-center justify-between text-xs font-semibold tabular-nums">
                    <span className="text-[#0B1F3A]">
                      Initial Capital ({capitalSharePct}%)
                    </span>
                    <span className="text-[#047857]">
                      Projected Surplus ({surplusSharePct}%)
                    </span>
                  </div>
                  <div className="mt-2 flex h-3 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                    <div
                      className="h-full bg-[#0B1F3A] transition-all duration-500"
                      style={{ width: `${capitalSharePct}%` }}
                    />
                    <div
                      className="h-full bg-[#059669] transition-all duration-500"
                      style={{ width: `${surplusSharePct}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-[#64748B] tabular-nums">
                    48M Total Scheduled Rental: {formatINR(activePlan.totalRental48Months)} (
                    {formatIndianCompact(activePlan.totalRental48Months)})
                  </p>
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
