"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown, Info } from "lucide-react";
import { RevealOnScroll } from "@/components/MotionPrimitives";
import {
  ALL_COMPUTED_PLANS,
  formatINR,
  type DefinedEvPlanUnits,
} from "@/data/investment-plans";

export function FleetTiersSchedule() {
  const [expandedMobilePlan, setExpandedMobilePlan] = useState<DefinedEvPlanUnits | null>(2);

  return (
    <div className="space-y-8">
      <RevealOnScroll delayMs={60}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9E7524]">
              INVESTMENT PLANS &amp; SCHEDULE
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.025em] text-[#0F0F0F] sm:text-3xl">
              Five Defined Fleet Tiers (2 to 50 EVs)
            </h2>
          </div>
          <a
            href="#investment-calculator"
            className="aurum-pill-dark group self-start px-5 py-2.5 text-xs sm:self-auto"
          >
            <span>Calculate Returns Below</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Desktop & Tablet Chrome Table Card */}
        <div className="mt-6 hidden rounded-[2rem] bg-[linear-gradient(135deg,#FFFFFF_0%,#94A3B8_22%,#F8FAFC_50%,#FCAA30_75%,#CBD5E1_100%)] p-[1.5px] shadow-[0_24px_65px_rgba(15,15,15,0.08)] md:block">
          <div className="overflow-hidden rounded-[calc(2rem-1.5px)] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#0F0F0F]/10 bg-[linear-gradient(180deg,#F8FAFC_0%,#EFF2F6_100%)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#475569]">
                    <th className="px-5 py-4">EV Units</th>
                    <th className="px-4 py-4">
                      Investment
                      <span className="mt-0.5 block text-[9px] font-medium normal-case tracking-normal text-[#666666]">
                        ₹66,500 per EV
                      </span>
                    </th>
                    <th className="px-4 py-4">
                      GST 5%
                      <span className="mt-0.5 block text-[9px] font-medium normal-case tracking-normal text-[#666666]">
                        ₹3,500 per EV
                      </span>
                    </th>
                    <th className="px-4 py-4">
                      Total Investment
                      <span className="mt-0.5 block text-[9px] font-medium normal-case tracking-normal text-[#666666]">
                        ₹70,000 per EV
                      </span>
                    </th>
                    <th className="px-4 py-4">Per EV Rental</th>
                    <th className="px-4 py-4">
                      Monthly Rental
                      <span className="mt-0.5 block text-[9px] font-medium normal-case tracking-normal text-[#666666]">
                        Scheduled Payout
                      </span>
                    </th>
                    <th className="px-4 py-4">
                      Total Rental
                      <span className="mt-0.5 block text-[9px] font-medium normal-case tracking-normal text-[#666666]">
                        48 Months
                      </span>
                    </th>
                    <th className="px-5 py-4 text-right">
                      Projected Rental Surplus
                      <span className="mt-0.5 block text-[9px] font-medium normal-case tracking-normal text-[#666666]">
                        Rental − Investment
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0F0F0F]/[0.07] text-sm tabular-nums">
                  {ALL_COMPUTED_PLANS.map((plan) => {
                    const isEntry = plan.evUnits === 2;
                    const isFlagship = plan.evUnits === 50;

                    return (
                      <tr
                        key={plan.evUnits}
                        className={`transition-colors duration-200 ${
                          isEntry
                            ? "bg-[#F8FAFC] hover:bg-[#F1F5F9]"
                            : isFlagship
                              ? "bg-[#FAF6EC]/85 hover:bg-[#FAF3E0]"
                              : "bg-white hover:bg-[#F8FAFC]"
                        }`}
                      >
                        <td className="px-5 py-4 font-display font-bold text-[#0F0F0F]">
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{plan.evUnits}</span>
                            {plan.highlightBadge && (
                              <span
                                className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                                  isFlagship
                                    ? "border border-[#C69A43]/40 bg-[#C69A43]/15 text-[#8E671D]"
                                    : "border border-[#0F0F0F]/15 bg-white text-[#0F0F0F]"
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
                        <td className="px-4 py-4 text-[#666666]">{formatINR(plan.gst)}</td>
                        <td className="px-4 py-4 font-semibold text-[#0F0F0F]">
                          {formatINR(plan.totalInvestment)}
                        </td>
                        <td className="px-4 py-4 font-semibold text-[#0F0F0F]">
                          {formatINR(plan.rentalPerEvMonthly)}
                        </td>
                        <td className="px-4 py-4 font-semibold text-[#0F0F0F]">
                          {formatINR(plan.monthlyRental)}
                        </td>
                        <td className="px-4 py-4 font-semibold text-[#0F0F0F]">
                          {formatINR(plan.totalRental48Months)}
                        </td>
                        <td className="px-5 py-4 text-right font-display text-base font-bold text-[#9E7524]">
                          {formatINR(plan.projectedRentalSurplus)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mobile Expandable Brushed-Chrome Cards (< md) */}
        <div className="mt-6 space-y-3 md:hidden">
          {ALL_COMPUTED_PLANS.map((plan) => {
            const isExpanded = expandedMobilePlan === plan.evUnits;
            const isFlagship = plan.evUnits === 50;

            return (
              <div
                key={plan.evUnits}
                className={`rounded-2xl p-[1.5px] transition-all duration-200 ${
                  isFlagship
                    ? "bg-[linear-gradient(135deg,#FFFFFF_0%,#FCAA30_45%,#C69A43_100%)] shadow-[0_10px_28px_rgba(198,154,67,0.12)]"
                    : "bg-[linear-gradient(135deg,#FFFFFF_0%,#CBD5E1_50%,#E2E8F0_100%)] shadow-[0_6px_20px_rgba(15,15,15,0.05)]"
                }`}
              >
                <div
                  className={`overflow-hidden rounded-[calc(1rem-1.5px)] ${
                    isFlagship
                      ? "bg-[linear-gradient(155deg,#FFFFFF_0%,#FAF6EC_100%)]"
                      : "bg-[linear-gradient(155deg,#FFFFFF_0%,#F6F7F9_100%)]"
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() =>
                      setExpandedMobilePlan((prev) =>
                        prev === plan.evUnits ? null : plan.evUnits
                      )
                    }
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg font-bold text-[#0F0F0F]">
                          {plan.evUnits} EVs
                        </span>
                        {plan.highlightBadge && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] ${
                              isFlagship
                                ? "bg-[#C69A43]/20 text-[#8E671D]"
                                : "border border-[#0F0F0F]/15 bg-white text-[#0F0F0F]"
                            }`}
                          >
                            {plan.highlightBadge}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs font-medium text-[#666666] tabular-nums">
                        Total Investment: {formatINR(plan.totalInvestment)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#666666]">
                          Surplus
                        </p>
                        <p className="font-display text-base font-bold text-[#9E7524] tabular-nums">
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
                    <div className="border-t border-[#0F0F0F]/10 bg-white/90 px-4 py-3.5 text-xs tabular-nums">
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                        <div>
                          <dt className="text-[#666666]">Base Investment</dt>
                          <dd className="mt-0.5 font-semibold text-[#0F0F0F]">
                            {formatINR(plan.investment)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#666666]">GST (5%)</dt>
                          <dd className="mt-0.5 font-semibold text-[#0F0F0F]">
                            {formatINR(plan.gst)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#666666]">Rental / EV / Month</dt>
                          <dd className="mt-0.5 font-semibold text-[#0F0F0F]">
                            {formatINR(plan.rentalPerEvMonthly)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#666666]">Monthly Rental</dt>
                          <dd className="mt-0.5 font-semibold text-[#0F0F0F]">
                            {formatINR(plan.monthlyRental)}
                          </dd>
                        </div>
                        <div className="col-span-2 flex items-center justify-between border-t border-[#0F0F0F]/[0.08] pt-2.5">
                          <span className="text-[#666666]">Total Rental (48 Months)</span>
                          <span className="font-bold text-[#0F0F0F]">
                            {formatINR(plan.totalRental48Months)}
                          </span>
                        </div>
                      </dl>
                      <Link
                        href={`/invest?units=${plan.evUnits}#investment-calculator`}
                        className="mt-3 block w-full rounded-xl bg-[#0F0F0F] py-2.5 text-center text-xs font-semibold text-white transition hover:bg-[#262626]"
                      >
                        Calculate {plan.evUnits} EVs
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </RevealOnScroll>

      {/* Important Investment Disclaimer */}
      <RevealOnScroll delayMs={100}>
        <div className="rounded-2xl border border-[#CBD5E1]/70 border-l-4 border-l-[#FCAA30] bg-white px-5 py-4 shadow-sm sm:px-7 sm:py-5">
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
              <p className="mt-1.5 text-xs leading-relaxed text-[#666666] sm:text-[13px]">
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
  );
}
