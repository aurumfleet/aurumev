"use client";

import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  CalendarClock,
  FileCheck2,
  Gift,
  Layers,
  LineChart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { RevealOnScroll } from "./MotionPrimitives";

const ECOSYSTEM_ADVANTAGES = [
  { label: "Zero Fuel Volatility", group: "Rider", icon: Zap },
  { label: "Flexible Daily & Monthly Plans", group: "Rider", icon: CalendarClock },
  { label: "Scheduled Hub Servicing", group: "Operations", icon: Wrench },
  { label: "Transparent Rental Terms", group: "Trust", icon: FileCheck2 },
  { label: "Verified Vehicle Specs", group: "Trust", icon: ShieldCheck },
  { label: "Charging & Range Guidance", group: "Rider", icon: BatteryCharging },
  { label: "Bulk Corporate Deployments", group: "Business", icon: Layers },
  { label: "City Hub Network", group: "Operations", icon: MapPin },
  { label: "Fleet Asset Lifecycle", group: "Partner", icon: LineChart },
  { label: "Clear Expense Separation", group: "Partner", icon: Sparkles },
  { label: "Zero-Tailpipe Urban Miles", group: "Impact", icon: Zap },
  { label: "Dedicated Team Support", group: "Operations", icon: ShieldCheck },
];

export function AurumEcosystemSection() {
  return (
    <>
      {/* 1. AURUM FLEET ADVANTAGES GRID (Neev "20+ Advantages" inspired, clean Simple Energy cards) */}
      <section className="bg-white py-20 sm:py-24">
        <div className="aurum-container">
          <RevealOnScroll className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#0667F4]">
              The Aurum Mobility Ecosystem
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-[#0F0F0F] sm:text-[54px] sm:leading-[1.06]">
              Built for riders. Structured for fleets.
            </h2>
            <p className="mt-3 text-base text-[#666666] sm:text-lg">
              Every pillar of Aurum Fleet Solutions Pvt Ltd connects daily rider reliability with
              disciplined fleet management.
            </p>
          </RevealOnScroll>

          <div className="mt-12 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {ECOSYSTEM_ADVANTAGES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <RevealOnScroll key={item.label} delayMs={(idx % 4) * 50}>
                  <div className="flex h-full flex-col justify-between rounded-3xl bg-[#F4F4F4] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#EBEBEB]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#666666]">
                        {item.group}
                      </span>
                      <Icon className="h-4 w-4 text-[#0667F4]" />
                    </div>
                    <p className="mt-4 break-words font-display text-sm font-medium text-[#0F0F0F] sm:text-base">
                      {item.label}
                    </p>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. SMART EV FLEET INTELLIGENCE + REFER & WHO WE ARE SPLIT BAND */}
      <section className="bg-[#F4F4F4] py-20">
        <div className="aurum-container space-y-12">
          {/* 4 Intelligence Pillars */}
          <div className="rounded-3xl bg-[#0F0F0F] p-8 text-white shadow-elevated sm:p-12">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#FCAA30]">
                  Operational Intelligence
                </p>
                <h2 className="mt-3 font-display text-3xl font-medium tracking-[-0.03em] sm:text-5xl">
                  Structured Fleet Control & Reporting.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#B6B8B9] sm:text-base">
                  From hub availability checks and maintenance scheduling to partner financial
                  transparency, Aurum separates real operational data from guesswork.
                </p>
              </div>
              <Link href="/invest" className="aurum-pill-mango shrink-0">
                Explore Partner Details <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Hub Availability Verification",
                  desc: "Prevent overlapping allocations with verified hub-level unit tracking.",
                },
                {
                  title: "Transparent Cost Breakdown",
                  desc: "Clear separation of projected revenue, operating expenses, and net income.",
                },
                {
                  title: "Preventive Maintenance Logs",
                  desc: "Scheduled service tracking to protect rider safety and fleet uptime.",
                },
                {
                  title: "Document & Compliance Governance",
                  desc: "Verified KYC, insurance validity, and formal contractual records.",
                },
              ].map((pillar) => (
                <div key={pillar.title} className="rounded-2xl bg-[#1F1F1F] p-5">
                  <h3 className="font-display text-base font-medium text-white">{pillar.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#9C9EA0]">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Refer & Earn + Who We Are Split */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-se-card-gradient flex flex-col justify-between rounded-3xl p-8 shadow-card sm:p-10">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-semibold text-[#0F0F0F]">
                  <Gift className="h-3.5 w-3.5 text-[#13B75E]" />
                  Rider & Partner Referrals
                </span>
                <h3 className="mt-4 font-display text-3xl font-medium tracking-[-0.03em] text-[#0F0F0F]">
                  Refer Riders & Fleets to Aurum EV.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#666666]">
                  Know delivery partners or local businesses looking for dependable electric
                  two-wheelers? Connect them with our hub onboarding team.
                </p>
              </div>
              <div className="mt-7">
                <Link href="/contact" className="aurum-pill-dark">
                  Submit a Referral Enquiry <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-card sm:p-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0667F4]">
                  Who We Are
                </p>
                <h3 className="mt-3 font-display text-3xl font-medium tracking-[-0.03em] text-[#0F0F0F]">
                  Aurum Fleet Solutions Pvt Ltd
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#666666]">
                  Driven by Trust. Powered by Tomorrow. We build reliable electric two-wheeler
                  rental infrastructure and commercial fleet solutions designed around honest
                  terms, preventive upkeep, and clean urban mobility.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/about" className="aurum-pill-soft text-xs sm:text-sm">
                  About Us
                </Link>
                <Link href="/how-it-works" className="aurum-pill-soft text-xs sm:text-sm">
                  How It Works
                </Link>
                <Link href="/contact" className="aurum-pill-mango text-xs sm:text-sm">
                  Contact Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
