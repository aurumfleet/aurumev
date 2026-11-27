"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, RotateCcw } from "lucide-react";
import {
  ALL_COMPUTED_PLANS,
  INVESTMENT_MODEL_CONSTANTS,
  calculateInvestmentPlan,
  formatINR,
  formatIndianCompact,
  type DefinedEvPlanUnits,
} from "@/data/investment-plans";

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

export function InvestmentCalculatorGlass({
  initialUnits = 2,
  ctaMode = "enquiry",
}: {
  initialUnits?: DefinedEvPlanUnits;
  ctaMode?: "enquiry" | "invest";
}) {
  const [selectedUnits, setSelectedUnits] = useState<DefinedEvPlanUnits>(initialUnits);
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

  // Clean SVG trajectory coordinates across 0M -> 12M -> 24M -> 36M -> 48M
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

  function selectPlan(units: DefinedEvPlanUnits) {
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
    <div id="investment-calculator" className="relative py-2 scroll-mt-24">
      {/* Subtle Ambient Depth Behind Liquid Glass Slab */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 -z-0 rounded-[48px] bg-[radial-gradient(ellipse_75%_65%_at_25%_20%,rgba(5,150,105,0.065),transparent_60%),radial-gradient(ellipse_70%_60%_at_80%_80%,rgba(198,154,67,0.075),transparent_62%)] blur-xl"
      />

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
        className="relative z-10 overflow-hidden rounded-[34px] border border-white/95 bg-white/[0.78] p-6 shadow-[0_24px_70px_rgba(11,31,58,0.08),inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(11,31,58,0.03)] ring-1 ring-black/[0.06] backdrop-blur-2xl backdrop-saturate-[185%] sm:p-9 lg:p-11"
      >
        {/* Top Specular Edge Glint */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
        />

        {/* Cursor-Tracking Optical Glass Reflection */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: "var(--g-active)",
            background:
              "radial-gradient(420px circle at var(--gx) var(--gy), rgba(255,255,255,0.7), rgba(252,170,48,0.045) 46%, transparent 72%)",
          }}
        />

        {/* Minimalist Header + Apple Segmented Frosted Tier Selector */}
        <div className="relative z-10 flex flex-col justify-between gap-5 border-b border-black/[0.06] pb-7 lg:flex-row lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#047857]">
              INTERACTIVE SCHEDULE SIMULATOR
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-[-0.03em] text-[#0F0F0F] sm:text-[32px]">
              Live Investment Calculator
            </h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Pick how many EVs you want to own to see the exact monthly payout and 48-month total.
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
                    onClick={() => selectPlan(plan.evUnits)}
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
              onClick={() => selectPlan(2)}
              aria-label="Reset calculator to 2 EVs"
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white/80 px-3.5 py-2 text-xs font-medium text-[#64748B] shadow-sm backdrop-blur-md transition hover:bg-white hover:text-[#0F0F0F] active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Clean Two-Column Liquid Glass Split */}
        <div className="relative z-10 mt-8 grid gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* LEFT COLUMN — Clear Plain-English Surplus & Step-by-Step Formula Ledger */}
          <div className="flex flex-col justify-between gap-6 lg:col-span-6">
            <div className="px-1">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#64748B]">
                Net Surplus After Investment · 48 Months
              </p>
              <div className="mt-2.5 flex flex-wrap items-baseline gap-3">
                <AnimatedINR
                  testId="calc-surplus"
                  value={activePlan.projectedRentalSurplus}
                  className="font-display text-4xl font-semibold tracking-[-0.04em] text-[#047857] tabular-nums sm:text-[50px]"
                />
                <span className="rounded-full border border-[#059669]/20 bg-[#ECFDF5]/95 px-3 py-1 text-xs font-semibold text-[#047857] tabular-nums">
                  {formatIndianCompact(activePlan.projectedRentalSurplus)}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#64748B] tabular-nums">
                Calculated as{" "}
                <strong className="text-[#0F0F0F]">
                  {formatINR(activePlan.totalRental48Months)}
                </strong>{" "}
                total 48-month rental minus{" "}
                <strong className="text-[#0F0F0F]">
                  {formatINR(activePlan.totalInvestment)}
                </strong>{" "}
                initial investment.
              </p>
            </div>

            {/* Ultra-Clear Plain-Language Hairline Ledger */}
            <div className="divide-y divide-black/[0.06] rounded-3xl border border-white/95 bg-white/[0.66] px-5 py-1 shadow-[0_8px_28px_rgba(11,31,58,0.035),inset_0_1px_0_rgba(255,255,255,1)] ring-1 ring-black/[0.04] backdrop-blur-xl sm:px-6">
              <div className="flex items-center justify-between gap-4 py-3.5">
                <div>
                  <p className="text-sm font-medium text-[#0F0F0F]">Total Investment</p>
                  <p className="text-[11px] text-[#64748B] tabular-nums">
                    {activePlan.evUnits} EVs × (
                    {formatINR(INVESTMENT_MODEL_CONSTANTS.investmentPerEv)} +{" "}
                    {formatINR(INVESTMENT_MODEL_CONSTANTS.gstPerEv)} GST)
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
                    Monthly Rental Rate ({activePlan.evUnits} EVs)
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    Fixed per-EV scheduled rate for this tier
                  </p>
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
                    {formatINR(activePlan.rentalPerEvMonthly)} × {activePlan.evUnits} EVs every month
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
                    {formatINR(activePlan.monthlyRental)} × 12 months ·{" "}
                    {formatIndianCompact(activePlan.annualRental)}
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
                  <p className="text-sm font-medium text-[#0F0F0F]">48-Month Total Rental</p>
                  <p className="text-[11px] text-[#64748B] tabular-nums">
                    {formatINR(activePlan.monthlyRental)} × 48 months ·{" "}
                    {formatIndianCompact(activePlan.totalRental48Months)}
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

          {/* RIGHT COLUMN — Interactive 48-Month Liquid Glass Trajectory Pane */}
          <div className="flex flex-col justify-between rounded-3xl border border-white/95 bg-gradient-to-b from-white/[0.82] to-white/[0.5] p-6 shadow-[0_12px_36px_rgba(11,31,58,0.04),inset_0_1px_1px_rgba(255,255,255,1)] ring-1 ring-black/[0.045] backdrop-blur-xl sm:p-7 lg:col-span-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-[#64748B] tabular-nums">
                    By Year {activeMilestone.year} ({activeMilestone.months} Months Cumulative)
                  </p>
                  <p className="mt-0.5 font-display text-xl font-semibold tracking-[-0.02em] text-[#0F0F0F] tabular-nums sm:text-2xl">
                    {formatINR(activeMilestone.cumulative)}{" "}
                    <span className="text-sm font-medium text-[#047857]">
                      · {formatIndianCompact(activeMilestone.cumulative)}
                    </span>
                  </p>
                </div>

                {/* Year Pill Toggle */}
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

              {/* Clean Minimalist SVG Curve */}
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-[11px]">
                  <span className="text-[#64748B]">Tap a year to inspect cumulative rental</span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-[#8E671D] tabular-nums">
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

            {/* Clean Split Progress Meter & Action */}
            <div className="mt-6 border-t border-black/[0.06] pt-5">
              <div className="flex items-center justify-between text-xs font-medium tabular-nums">
                <span className="inline-flex items-center gap-1.5 text-[#0F0F0F]">
                  <span className="h-2 w-2 rounded-full bg-[#0F0F0F]" />
                  Initial Capital ({capitalSharePct}%)
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#047857]">
                  <span className="h-2 w-2 rounded-full bg-[#059669]" />
                  Net Surplus ({surplusSharePct}%)
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

                {ctaMode === "enquiry" ? (
                  <a
                    href="#enquiry"
                    className="group inline-flex items-center gap-2 rounded-full bg-[#0B1F3A] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#047857]"
                  >
                    <span>Proceed With {activePlan.evUnits} EVs</span>
                    <ArrowDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-y-0.5" />
                  </a>
                ) : (
                  <Link
                    href={`/invest?units=${activePlan.evUnits}#investment-calculator`}
                    className="group inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/90 px-4 py-2 text-xs font-semibold text-[#0F0F0F] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C69A43]/60 hover:bg-white"
                  >
                    <span>Open in Calculator</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
