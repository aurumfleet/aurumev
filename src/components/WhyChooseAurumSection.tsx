"use client";

import { RevealOnScroll } from "@/components/MotionPrimitives";

const OVERVIEW_PANELS = [
  {
    index: "01",
    label: "Total Investment Per EV",
    headline: "₹70,000",
    lines: ["Investment: ₹66,500", "GST (5%): ₹3,500"],
    tone: "chrome" as const,
  },
  {
    index: "02",
    label: "Agreement Tenure",
    headline: "48 Months",
    lines: ["Structured 4-year framework & exit options"],
    tone: "obsidian" as const,
  },
  {
    index: "03",
    label: "Monthly Rental Per EV",
    headline: "₹4,300 – ₹5,500",
    lines: ["Defined per-tier monthly schedule"],
    tone: "gold" as const,
  },
  {
    index: "04",
    label: "Investment Scale",
    headline: "2 to 50 EVs",
    lines: ["Five structured fleet deployment tiers"],
    tone: "chrome" as const,
  },
];

export function WhyChooseAurumSection() {
  return (
    <section
      id="why-choose-aurum"
      aria-labelledby="why-aurum-heading"
      className="relative overflow-hidden border-t border-[#EBEBEB] bg-white py-20 text-[#0F0F0F] sm:py-28"
    >
      {/* Subtle Architectural Chrome & Gold Halo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[440px] bg-[radial-gradient(ellipse_65%_50%_at_50%_0%,rgba(252,170,48,0.06),rgba(148,163,184,0.07)_45%,transparent_75%)]"
      />

      <div className="aurum-container relative z-10 space-y-14 sm:space-y-16">
        {/* SECTION HEADER */}
        <RevealOnScroll className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C69A43]/30 bg-[#FAF7F0] px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FCAA30]" aria-hidden="true" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9E7524]">
              TRANSPARENT INVESTMENT MODEL
            </span>
          </div>

          <h2
            id="why-aurum-heading"
            className="mt-4 font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-[#0F0F0F] sm:text-5xl lg:text-[54px]"
          >
            Why Choose{" "}
            <span className="bg-gradient-to-r from-[#8E671D] via-[#FCAA30] to-[#8E671D] bg-clip-text text-transparent">
              Aurum?
            </span>
          </h2>

          <p className="mx-auto mt-3.5 max-w-2xl text-sm leading-relaxed text-[#666666] sm:text-base">
            A Transparent EV Investment Model Built Around Long-Term Rental Opportunities.
          </p>
        </RevealOnScroll>

        {/* PART 1 — 4 BRUSHED CHROME OVERVIEW PANELS */}
        <RevealOnScroll delayMs={60}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OVERVIEW_PANELS.map((panel) => {
              const isObsidian = panel.tone === "obsidian";
              const isGold = panel.tone === "gold";
              return (
                <div
                  key={panel.index}
                  className={`group relative rounded-[1.75rem] p-[1.5px] transition-all duration-300 hover:-translate-y-1 ${
                    isGold
                      ? "bg-[linear-gradient(135deg,#FFFFFF_0%,#FCAA30_35%,#F8FAFC_65%,#C69A43_100%)] shadow-[0_18px_46px_rgba(198,154,67,0.12)]"
                      : isObsidian
                        ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.7)_0%,rgba(148,163,184,0.3)_40%,rgba(252,170,48,0.45)_75%,rgba(203,213,225,0.4)_100%)] shadow-[0_20px_50px_rgba(15,15,15,0.16)]"
                        : "bg-[linear-gradient(135deg,#FFFFFF_0%,#94A3B8_28%,#F8FAFC_56%,#CBD5E1_100%)] shadow-[0_14px_38px_rgba(15,15,15,0.06)] hover:shadow-[0_22px_50px_rgba(15,15,15,0.1)]"
                  }`}
                >
                  <div
                    className={`relative flex h-full flex-col justify-between overflow-hidden rounded-[calc(1.75rem-1.5px)] p-6 ${
                      isObsidian
                        ? "bg-[linear-gradient(145deg,#23262B_0%,#131518_55%,#0A0B0D_100%)] text-white"
                        : "bg-[linear-gradient(155deg,#FFFFFF_0%,#F6F7F9_52%,#ECEFF4_100%)] text-[#0F0F0F]"
                    }`}
                  >
                    {/* Top Chrome Specular Horizon */}
                    <div
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b ${
                        isObsidian ? "from-white/10" : "from-white/95"
                      } to-transparent`}
                    />

                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                          isObsidian ? "text-[#94A3B8]" : "text-[#666666]"
                        }`}
                      >
                        {panel.label}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] ${
                          isObsidian
                            ? "border-[#FCAA30]/40 bg-[#FCAA30]/15 text-[#FCAA30]"
                            : isGold
                              ? "border-[#C69A43]/35 bg-[#FAF7F0] text-[#9E7524]"
                              : "border-[#0F0F0F]/10 bg-white text-[#0F0F0F]"
                        }`}
                      >
                        {panel.index}
                      </span>
                    </div>

                    <p
                      className={`relative z-10 mt-5 font-display text-2xl font-bold tracking-[-0.025em] tabular-nums sm:text-[28px] ${
                        isObsidian
                          ? "text-white"
                          : isGold
                            ? "text-[#9E7524]"
                            : "text-[#0F0F0F]"
                      }`}
                    >
                      {panel.headline}
                    </p>

                    <div
                      className={`relative z-10 mt-4 space-y-1 border-t pt-3.5 ${
                        isObsidian ? "border-white/10" : "border-[#0F0F0F]/[0.08]"
                      }`}
                    >
                      {panel.lines.map((line) => (
                        <p
                          key={line}
                          className={`text-xs font-medium tabular-nums ${
                            isObsidian ? "text-[#CBD5E1]" : "text-[#666666]"
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
