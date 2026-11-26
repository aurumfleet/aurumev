"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const TABS = [
  {
    key: "riders",
    label: "Rider Plans",
    tag: "COMMUTER & DELIVERY",
    title: "Engineered for Everyday Riders & Delivery Partners",
    desc: "Switch from petrol to predictable daily, weekly, and monthly electric two-wheeler plans with scheduled hub servicing and transparent documentation.",
    points: [
      "Zero daily fuel expense volatility",
      "Scheduled preventive hub servicing included",
      "Fast 4-step KYC & hub handover",
    ],
    ctaLabel: "Explore Rider Plans",
    ctaHref: "/riders",
    image: "/images/aurum-rapido.jpg",
  },
  {
    key: "business",
    label: "Business Fleets",
    tag: "CORPORATE & LOGISTICS",
    title: "Centralized Bulk EV Fleet Solutions",
    desc: "Equip hyperlocal logistics, quick-commerce, and enterprise field teams with reliable electric scooters, flexible agreements, and dedicated account coordination.",
    points: [
      "GST-compliant consolidated invoicing",
      "Dedicated SLA & hub maintenance bay",
      "Flexible scaling across active service hubs",
    ],
    ctaLabel: "Request Business Proposal",
    ctaHref: "/business#proposal",
    image: "/images/aurum-porter.jpg",
  },
  {
    key: "invest",
    label: "Investment Model",
    tag: "FLEET PARTNERSHIPS",
    title: "Transparent Fleet Participation & Reporting",
    desc: "Explore structured EV fleet deployment and operational asset management backed by formal legal documentation and verified performance reporting.",
    points: [
      "Asset-level lifecycle & insurance tracking",
      "Transparent separation of operating expenses",
      "Formal contractual documentation prior to onboarding",
    ],
    ctaLabel: "Explore Investment Info",
    ctaHref: "/invest",
    image: "/images/aurum-zepto.jpg",
  },
];

export function OperationsShowcaseTabs() {
  const [active, setActive] = useState(0);
  const current = TABS[active];

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="aurum-container">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#FCAA30]">
              Operating Architecture
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] text-[#0F0F0F] sm:text-[54px] sm:leading-[1.04]">
              Built for Mobility.
            </h2>
            <p className="mt-2 text-base text-[#666666] sm:text-xl">
              Every journey powered by disciplined hub operations.
            </p>
          </div>

          {/* Segmented Pill Switcher at Top */}
          <div className="grid w-full max-w-md grid-cols-3 gap-1.5 rounded-full border border-black/[0.06] bg-[#F4F4F4] p-1.5">
            {TABS.map((tab, idx) => {
              const isSelected = idx === active;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActive(idx)}
                  className={`rounded-full px-3 py-2.5 text-xs font-semibold transition-all duration-300 sm:text-sm ${
                    isSelected
                      ? "bg-[#0F0F0F] text-white shadow-sm"
                      : "text-[#666666] hover:text-[#0F0F0F]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modern Split Bento Stage */}
        <div className="mt-10 grid overflow-hidden rounded-[32px] border border-black/[0.06] bg-[#F7F8FA] shadow-card lg:grid-cols-12">
          {/* Left Crisp Aurum EV Visual */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#141414] lg:col-span-6 lg:aspect-auto lg:min-h-[430px]">
            {TABS.map((tab, idx) => (
              <Image
                key={tab.key}
                src={tab.image}
                alt={tab.title}
                fill
                className={`object-cover transition-all duration-700 ${
                  idx === active ? "scale-100 opacity-100" : "scale-105 opacity-0"
                }`}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <span className="absolute left-5 top-5 rounded-full border border-white/25 bg-black/55 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FCAA30] backdrop-blur-md">
              {current.tag}
            </span>
          </div>

          {/* Right Editorial Info Panel */}
          <div className="flex flex-col justify-between p-7 sm:p-10 lg:col-span-6 lg:p-12">
            <div>
              <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[#0F0F0F] sm:text-3xl sm:leading-[1.15]">
                {current.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#666666] sm:text-base">
                {current.desc}
              </p>

              <ul className="mt-6 space-y-2.5">
                {current.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2.5 text-sm font-medium text-[#1F1F1F]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#13B75E]" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <Link href={current.ctaHref} className="aurum-pill-mango px-7 py-3.5">
                {current.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
