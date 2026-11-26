"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const TABS = [
  {
    key: "riders",
    label: "Rider Plans",
    title: "Engineered for Everyday Riders & Delivery Partners",
    desc: "Switch from petrol to predictable daily, weekly, and monthly electric two-wheeler plans with scheduled hub servicing and transparent documentation.",
    ctaLabel: "Explore Rider Plans",
    ctaHref: "/riders",
    image: "/images/hero-ev-scooter.jpg",
  },
  {
    key: "business",
    label: "Business Fleets",
    title: "Centralized Bulk EV Fleet Solutions",
    desc: "Equip hyperlocal logistics, quick-commerce, and enterprise field teams with reliable electric scooters, flexible agreements, and dedicated account coordination.",
    ctaLabel: "Request Business Proposal",
    ctaHref: "/business#proposal",
    image: "/images/business-ev-fleet.jpg",
  },
  {
    key: "invest",
    label: "Investment Model",
    title: "Transparent Fleet Participation & Reporting",
    desc: "Explore structured EV fleet deployment and operational asset management backed by formal legal documentation and verified performance reporting.",
    ctaLabel: "Explore Investment Info",
    ctaHref: "/invest",
    image: "/images/studio-ev-scooter.jpg",
  },
];

export function OperationsShowcaseTabs() {
  const [active, setActive] = useState(0);
  const current = TABS[active];

  return (
    <section className="py-16 sm:py-24">
      <div className="aurum-container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold tracking-[-0.04em] text-[#0F0F0F] sm:text-[58px] sm:leading-[1.05]">
            Built for Mobility.
          </h2>
          <p className="mt-3 text-lg text-[#666666] sm:text-2xl">
            Every journey powered by disciplined operations.
          </p>
        </div>

        {/* Overlapping Photography + Soft #F4F4F4 Info Panel */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="relative z-10 mx-auto aspect-[16/9] w-full overflow-hidden rounded-[28px] bg-[#0F0F0F] shadow-elevated sm:rounded-[36px]">
            {TABS.map((tab, idx) => (
              <Image
                key={tab.key}
                src={tab.image}
                alt={tab.title}
                fill
                className={`object-cover transition-all duration-700 ${
                  idx === active ? "scale-100 opacity-100" : "scale-105 opacity-0"
                }`}
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          <div className="-mt-16 rounded-b-[28px] bg-[#F4F4F4] px-6 pb-10 pt-24 text-center sm:-mt-24 sm:rounded-b-[36px] sm:px-12 sm:pt-32">
            <h3 className="font-display text-2xl font-medium tracking-[-0.02em] text-[#0F0F0F] sm:text-[34px] sm:leading-[1.12]">
              {current.title}
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#666666] sm:text-base">
              {current.desc}
            </p>
            <div className="mt-6">
              <Link href={current.ctaHref} className="aurum-pill-mango px-7 py-3.5">
                {current.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Segmented Pill Switcher */}
          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-2 rounded-[32px] bg-[#F4F4F4] p-2">
            {TABS.map((tab, idx) => {
              const isSelected = idx === active;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActive(idx)}
                  className={`rounded-[26px] px-3 py-3.5 text-xs font-semibold transition-all duration-300 sm:text-sm ${
                    isSelected
                      ? "bg-white text-[#0F0F0F] shadow-card"
                      : "text-[#666666] hover:text-[#0F0F0F]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
