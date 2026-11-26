"use client";

import { useState } from "react";
import { Lock, Info } from "lucide-react";

interface SimulatorProps {
  financialModelApproved: boolean;
  demoCalculatorEnabled: boolean;
  publicStatusMessage: string;
}

export function InvestorPreviewSimulator({
  financialModelApproved,
  demoCalculatorEnabled,
  publicStatusMessage,
}: SimulatorProps) {
  const [fleetCount, setFleetCount] = useState(5);

  const isInteractive = financialModelApproved && demoCalculatorEnabled;

  return (
    <div className="rounded-3xl bg-white p-7 shadow-card sm:p-9">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EBEBEB] pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0667F4]">
            Fleet Participation Simulator
          </p>
          <h3 className="mt-1 font-display text-2xl font-medium tracking-[-0.02em] text-[#0F0F0F]">
            Fleet Scale & Financial Structure Preview
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F4F4] px-3.5 py-1.5 text-xs font-semibold text-[#0F0F0F]">
          <Lock className="h-3.5 w-3.5 text-[#FCAA30]" />
          {isInteractive ? "Approved Model" : "Locked Until Model Approval"}
        </span>
      </div>

      <div className="mt-5 rounded-2xl bg-[#F4F4F4] p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
            Indicative Fleet Units
          </span>
          <span className="rounded-full bg-[#0F0F0F] px-3 py-1 text-xs font-semibold text-[#FCAA30]">
            {fleetCount} EVs
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={100}
          step={5}
          disabled={!isInteractive}
          value={fleetCount}
          onChange={(e) => setFleetCount(Number(e.target.value))}
          className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-[#D8DEE6] accent-[#0F0F0F] disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="mt-2 flex justify-between text-[11px] text-[#828587]">
          <span>5 EVs</span>
          <span>50 EVs</span>
          <span>100 EVs</span>
        </div>
      </div>

      {/* Distinct Financial Metrics (Never invent ROI/returns until approved) */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Projected Revenue", value: "Pending Official Model" },
          { label: "Operating Expenses", value: "Pending Official Model" },
          { label: "Projected Net Income", value: "Pending Official Model" },
          { label: "Actual Received Income", value: "Tracked Per Contract" },
          { label: "Investor Distributions", value: "Per Executed Agreement" },
          { label: "Tenure & Terms", value: "Shared Upon Review" },
        ].map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-[#EBEBEB] p-3.5">
            <p className="text-[11px] font-medium text-[#666666]">{metric.label}</p>
            <p className="mt-1 text-xs font-semibold text-[#0F0F0F]">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-[#F4F4F4] p-4 text-xs text-[#666666]">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#0667F4]" />
        <p>{publicStatusMessage}</p>
      </div>
    </div>
  );
}
