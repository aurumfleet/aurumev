"use client";

import { useState } from "react";
import { Bike, Building2, TrendingUp, Zap } from "lucide-react";
import { LeadForm } from "./LeadForm";

const REASONS = [
  {
    category: "rental" as const,
    label: "Commuter EV Plans",
    desc: "Daily, weekly, or monthly commuter EV rentals.",
    icon: Bike,
  },
  {
    category: "delivery_partner" as const,
    label: "Join as Delivery Rider",
    desc: "High-uptime plans for Zomato, Swiggy, Blinkit & Zepto riders.",
    icon: Zap,
  },
  {
    category: "corporate" as const,
    label: "Business Fleet Enquiry",
    desc: "Bulk electric two-wheeler deployment for enterprises.",
    icon: Building2,
  },
  {
    category: "investor" as const,
    label: "Invest Now",
    desc: "Explore structured EV fleet investment plans (2 to 50 EVs).",
    icon: TrendingUp,
  },
];

export function LetsConnectSection() {
  const [selectedCategory, setSelectedCategory] = useState<
    "rental" | "delivery_partner" | "corporate" | "investor"
  >("delivery_partner");

  return (
    <section id="connect" className="bg-white py-20">
      <div className="aurum-container grid gap-10 lg:grid-cols-12 lg:items-start">
        <div className="space-y-6 lg:col-span-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#0667F4]">
              Let&apos;s Connect
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-[#0F0F0F] sm:text-5xl">
              How can Aurum EV help you today?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#666666] sm:text-base">
              Choose your enquiry track below and submit your details directly to our operations
              and partnership team.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {REASONS.map((r) => {
              const Icon = r.icon;
              const active = selectedCategory === r.category;
              return (
                <button
                  key={r.category}
                  type="button"
                  onClick={() => setSelectedCategory(r.category)}
                  className={`flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? "border-[#0F0F0F] bg-[#0F0F0F] text-white shadow-card"
                      : "border-[#EBEBEB] bg-[#F4F4F4] text-[#0F0F0F] hover:bg-[#EBEBEB]"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      active ? "bg-[#FCAA30] text-black" : "bg-white text-[#0667F4]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-display text-sm font-semibold">{r.label}</p>
                    <p className={`mt-0.5 text-xs ${active ? "text-[#B6B8B9]" : "text-[#666666]"}`}>
                      {r.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7">
          <LeadForm
            key={selectedCategory}
            defaultCategory={selectedCategory}
            title={`Enquire: ${REASONS.find((r) => r.category === selectedCategory)?.label}`}
            subtitle="All enquiries are saved directly to our database and reviewed by the Aurum team."
          />
        </div>
      </div>
    </section>
  );
}
