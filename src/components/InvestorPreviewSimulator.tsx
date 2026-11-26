"use client";

import { useState } from "react";
import { Info, Layers } from "lucide-react";
import {
  ALL_COMPUTED_PLANS,
  INVESTMENT_MODEL_CONSTANTS,
  calculateInvestmentPlan,
  formatINR,
  formatIndianCompact,
  type DefinedEvPlanUnits,
} from "@/data/investment-plans";

interface SimulatorProps {
  initialUnits?: DefinedEvPlanUnits;
  publicStatusMessage?: string;
}

export function InvestorPreviewSimulator({
  initialUnits = 2,
  publicStatusMessage,
}: SimulatorProps) {
  const [selectedUnits, setSelectedUnits] = useState<DefinedEvPlanUnits>(initialUnits);
  const plan = calculateInvestmentPlan(selectedUnits);

  return (
    <div className="rounded-3xl border border-[#0B1F3A]/10 bg-white p-7 shadow-card sm:p-9">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EBEBEB] pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#047857]">
            Investment Plan Breakdown
          </p>
          <h3 className="mt-1 font-display text-2xl font-medium tracking-[-0.02em] text-[#0F0F0F]">
            {plan.evUnits} EVs · 48-Month Schedule
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#059669]/25 bg-[#ECFDF5] px-3.5 py-1.5 text-xs font-semibold text-[#047857]">
          <Layers className="h-3.5 w-3.5" />
          {formatINR(plan.rentalPerEvMonthly)} / EV / mo
        </span>
      </div>

      {/* Exact 5-Tier Plan Selector matching Official Chart */}
      <div className="mt-5 rounded-2xl bg-[#F8FAFC] p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#475569]">
            Select Fleet Plan (2 to 50 EVs)
          </span>
          <span className="rounded-full bg-[#0B1F3A] px-3 py-1 text-xs font-semibold text-[#FCAA30] tabular-nums">
            {plan.evUnits} EVs
          </span>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-2">
          {ALL_COMPUTED_PLANS.map((tier) => {
            const active = tier.evUnits === selectedUnits;
            return (
              <button
                key={tier.evUnits}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedUnits(tier.evUnits)}
                className={`rounded-xl py-2.5 text-xs font-semibold transition-all sm:text-sm ${
                  active
                    ? "bg-[#0B1F3A] text-white shadow-sm"
                    : "border border-[#0B1F3A]/15 bg-white text-[#0B1F3A] hover:border-[#059669]/50 hover:bg-[#ECFDF5]/60"
                }`}
              >
                {tier.evUnits} EVs
              </button>
            );
          })}
        </div>
      </div>

      {/* Exact Figures from Investment Chart */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3 tabular-nums">
        <div className="rounded-2xl border border-[#EBEBEB] p-3.5">
          <p className="text-[11px] font-medium text-[#64748B]">
            Investment ({formatINR(INVESTMENT_MODEL_CONSTANTS.investmentPerEv)}/EV)
          </p>
          <p className="mt-1 font-display text-base font-bold text-[#0F0F0F]">
            {formatINR(plan.investment)}
          </p>
        </div>
        <div className="rounded-2xl border border-[#EBEBEB] p-3.5">
          <p className="text-[11px] font-medium text-[#64748B]">
            GST 5% ({formatINR(INVESTMENT_MODEL_CONSTANTS.gstPerEv)}/EV)
          </p>
          <p className="mt-1 font-display text-base font-bold text-[#0F0F0F]">
            {formatINR(plan.gst)}
          </p>
        </div>
        <div className="rounded-2xl border border-[#0B1F3A]/15 bg-[#F8FAFC] p-3.5">
          <p className="text-[11px] font-medium text-[#475569]">Total Investment</p>
          <p className="mt-1 font-display text-base font-bold text-[#0B1F3A]">
            {formatINR(plan.totalInvestment)}
          </p>
        </div>
        <div className="rounded-2xl border border-[#EBEBEB] p-3.5">
          <p className="text-[11px] font-medium text-[#64748B]">Investor Cut / Month</p>
          <p className="mt-1 font-display text-base font-bold text-[#0F0F0F]">
            {formatINR(plan.monthlyRental)}
          </p>
        </div>
        <div className="rounded-2xl border border-[#EBEBEB] p-3.5">
          <p className="text-[11px] font-medium text-[#64748B]">Total Rental (48 Months)</p>
          <p className="mt-1 font-display text-base font-bold text-[#0F0F0F]">
            {formatINR(plan.totalRental48Months)}
          </p>
          <p className="text-[10px] text-[#64748B]">{formatIndianCompact(plan.totalRental48Months)}</p>
        </div>
        <div className="rounded-2xl border border-[#059669]/35 bg-[#ECFDF5]/80 p-3.5">
          <p className="text-[11px] font-semibold text-[#047857]">Net Surplus (Rental − Inv)</p>
          <p className="mt-1 font-display text-base font-bold text-[#047857]">
            {formatINR(plan.projectedRentalSurplus)}
          </p>
          <p className="text-[10px] font-semibold text-[#047857]">
            {formatIndianCompact(plan.projectedRentalSurplus)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-[#F4F4F4] p-4 text-xs text-[#475569]">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#059669]" />
        <p>
          {publicStatusMessage ||
            "Figures shown are illustrative projections based on the investment plans and rental rates displayed, subject to formal agreement execution and applicable terms."}
        </p>
      </div>
    </div>
  );
}
