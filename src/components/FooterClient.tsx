"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Clock, Mail, MapPin, Phone } from "lucide-react";
import type { ContactSettings } from "@/lib/settings";
import { WhatsAppButton } from "./WhatsAppButton";

const FOOTER_GROUPS = [
  {
    title: "Rent & Ride",
    links: [
      { href: "/rentals", label: "EV Rentals" },
      { href: "/riders", label: "For Delivery Partners" },
      { href: "/locations", label: "Service Hubs" },
      { href: "/how-it-works", label: "How It Works" },
    ],
  },
  {
    title: "Partnerships",
    links: [
      { href: "/invest", label: "Investment Plans" },
      { href: "/invest#investment-calculator", label: "Investment Calculator" },
      { href: "/business", label: "Business Fleet Solutions" },
      { href: "/investor-disclosures", label: "Investor Disclosures" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Aurum EV" },
      { href: "/blog", label: "Insights & Blog" },
      { href: "/faq", label: "FAQs" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
];

export function FooterClient({ contact }: { contact: ContactSettings }) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const chromeCardRef = useRef<HTMLDivElement>(null);

  function handleChromeMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !chromeCardRef.current) return;
    const rect = chromeCardRef.current.getBoundingClientRect();
    chromeCardRef.current.style.setProperty(
      "--fx",
      `${(((e.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`
    );
    chromeCardRef.current.style.setProperty(
      "--fy",
      `${(((e.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`
    );
    chromeCardRef.current.style.setProperty("--fglow", "1");
  }

  function handleChromeLeave() {
    chromeCardRef.current?.style.setProperty("--fglow", "0");
  }

  return (
    <footer className="relative border-t border-white/10 bg-[#060608] text-white">
      <div className="aurum-container pb-24 pt-14 md:pb-12">
        {/* Luxury Anodized Dark Chrome Feature Card */}
        <div
          ref={chromeCardRef}
          onPointerMove={handleChromeMove}
          onPointerLeave={handleChromeLeave}
          className="group relative mb-14 rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.68)_0%,rgba(148,163,184,0.26)_24%,rgba(255,255,255,0.82)_48%,rgba(252,170,48,0.45)_74%,rgba(203,213,225,0.38)_100%)] p-[1.5px] shadow-[0_28px_80px_rgba(0,0,0,0.68)]"
        >
          <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[calc(2rem-1.5px)] bg-[linear-gradient(145deg,#25282E_0%,#14161A_42%,#0A0B0E_78%,#1C1F24_100%)] p-7 sm:flex-row sm:items-center sm:p-10 lg:px-12 lg:py-11">
            {/* Top Specular Chrome Horizon Edge */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/[0.11] to-transparent"
            />

            {/* Pointer-Tracked Liquid Chrome Specular Highlight */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{
                opacity: "var(--fglow, 0)",
                background:
                  "radial-gradient(360px circle at var(--fx, 50%) var(--fy, 50%), rgba(255,255,255,0.18), rgba(252,170,48,0.10) 40%, transparent 72%)",
              }}
            />

            {/* Diagonal Chrome Light Sweep */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <div
                className="h-full w-1/3 motion-safe:animate-[partnerGoldSweep_6s_ease-in-out_infinite]"
                style={{
                  background:
                    "linear-gradient(110deg, transparent 10%, rgba(255,255,255,0.14) 48%, rgba(252,170,48,0.12) 55%, transparent 85%)",
                }}
              />
            </div>

            <div className="relative z-10 max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#FCAA30]">
                Driven by Trust. Powered by Tomorrow.
              </p>
              <h2 className="mt-2.5 font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl">
                Your smarter ride{" "}
                <span className="bg-gradient-to-r from-white via-[#E2E8F0] to-[#94A3B8] bg-clip-text text-transparent">
                  starts with Aurum.
                </span>
              </h2>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-3">
              <Link href="/invest" className="aurum-btn-premium-mango px-7 py-3.5 text-sm">
                Invest Now
              </Link>
              <Link
                href="/rentals#book"
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/[0.08] px-6 py-3.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/[0.14]"
              >
                Explore Rentals
              </Link>
              <Link
                href="/contact"
                aria-label="Contact Aurum Team"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-[linear-gradient(135deg,#FFFFFF_0%,#E2E8F0_55%,#CBD5E1_100%)] text-[#0F0F0F] shadow-[0_8px_24px_rgba(255,255,255,0.16)] transition-transform duration-200 hover:scale-105"
              >
                <ArrowUpRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Footer Grid (Desktop columns / Mobile Accordions) */}
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/aurum-emblem.png"
                alt="Aurum Fleet Solutions Emblem"
                width={42}
                height={42}
                className="h-10 w-10 object-contain"
              />
              <div>
                <p className="font-display text-xl font-semibold tracking-[-0.02em] text-white">
                  AURUM EV
                </p>
                <p className="text-xs text-[#9C9EA0]">Aurum Fleet Solutions Pvt Ltd</p>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-[#A1A1AA]">
              Electric two-wheeler rentals, delivery partner mobility plans, and corporate fleet
              solutions engineered for urban reliability.
            </p>
          </div>

          {/* Link Columns */}
          <div className="grid gap-4 md:col-span-8 md:grid-cols-3 md:gap-8">
            {FOOTER_GROUPS.map((group) => {
              const isOpen = openGroup === group.title;
              return (
                <div
                  key={group.title}
                  className="border-b border-white/10 pb-3 md:border-none md:pb-0"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenGroup(isOpen ? null : group.title)}
                    className="flex w-full items-center justify-between py-2 text-left text-sm font-medium text-white md:cursor-default md:py-0"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94A3B8]">
                      {group.title}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#94A3B8] transition-transform md:hidden ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <ul
                    className={`mt-3.5 space-y-2.5 text-sm text-[#D4D4D8] ${
                      isOpen ? "block" : "hidden md:block"
                    }`}
                  >
                    {group.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="transition-colors hover:text-[#FCAA30]"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Info Strip (Minimal Dark Chrome Cards) */}
        <div className="grid gap-3 border-b border-white/10 py-8 text-xs text-[#D4D4D8] sm:grid-cols-2 lg:grid-cols-4">
          <a
            href={`tel:${contact.phone.replace(/\s+/g, "")}`}
            className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 transition-colors hover:border-[#FCAA30]/40 hover:bg-white/[0.05]"
          >
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#FCAA30]" />
            <span>{contact.phone}</span>
          </a>

          <a
            href={`mailto:${contact.supportEmail}`}
            className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 transition-colors hover:border-[#FCAA30]/40 hover:bg-white/[0.05]"
          >
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#FCAA30]" />
            <span>{contact.supportEmail}</span>
          </a>

          <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FCAA30]" />
            <span className="leading-relaxed">{contact.officeAddress}</span>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#FCAA30]" />
            <span>{contact.operatingHours}</span>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 text-xs text-[#94A3B8] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Aurum Fleet Solutions Pvt Ltd. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="transition-colors hover:text-white">
              Terms &amp; Conditions
            </Link>
            <Link href="/rental-policy" className="transition-colors hover:text-white">
              Rental Policy
            </Link>
            <Link href="/cancellation-policy" className="transition-colors hover:text-white">
              Cancellation Policy
            </Link>
            <Link href="/refund-policy" className="transition-colors hover:text-white">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
      <WhatsAppButton whatsapp={contact.whatsapp} />
    </footer>
  );
}
