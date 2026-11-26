"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, ChevronDown, Mail, MapPin, Phone, Clock } from "lucide-react";
import type { ContactSettings } from "@/lib/settings";
import { WhatsAppButton } from "./WhatsAppButton";

const FOOTER_GROUPS = [
  {
    title: "Rent & Ride",
    links: [
      { href: "/rentals", label: "EV Rentals" },
      { href: "/riders", label: "For Delivery Partners" },
      { href: "/fleet", label: "Our Electric Fleet" },
      { href: "/locations", label: "Service Hubs" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/#calculator", label: "Savings Calculator" },
    ],
  },
  {
    title: "Partnerships",
    links: [
      { href: "/business", label: "Business Fleet Solutions" },
      { href: "/business#proposal", label: "Request Business Proposal" },
      { href: "/invest", label: "Invest With Us" },
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

  return (
    <footer className="bg-black text-white">
      <div className="aurum-container pb-24 pt-14 md:pb-12">
        {/* Teal-Emerald Gradient Feature Banner matching Simple Energy footer CTA */}
        <div className="bg-se-footer-banner mb-14 flex flex-col items-start justify-between gap-6 rounded-3xl p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#FCAA30]">
              Driven by Trust. Powered by Tomorrow.
            </p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-[-0.03em] text-white sm:text-4xl">
              Your smarter ride starts with Aurum.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/rentals#book" className="aurum-pill-mango">
              Explore Rentals
            </Link>
            <Link
              href="/contact"
              aria-label="Contact Aurum Team"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition-transform duration-200 hover:scale-105"
            >
              <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Main Footer Grid (Desktop columns / Mobile Accordions) */}
        <div className="grid gap-10 border-b border-white/15 pb-12 md:grid-cols-12">
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
            <p className="max-w-xs text-sm leading-relaxed text-[#B6B8B9]">
              Electric two-wheeler rentals, delivery partner mobility plans, and corporate fleet
              solutions engineered for urban reliability.
            </p>
          </div>

          {/* Link Columns */}
          <div className="grid gap-4 md:col-span-8 md:grid-cols-3 md:gap-8">
            {FOOTER_GROUPS.map((group) => {
              const isOpen = openGroup === group.title;
              return (
                <div key={group.title} className="border-b border-white/10 pb-3 md:border-none md:pb-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenGroup(isOpen ? null : group.title)}
                    className="flex w-full items-center justify-between py-2 text-left text-sm font-medium text-white md:cursor-default md:py-0"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9C9EA0]">
                      {group.title}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#9C9EA0] transition-transform md:hidden ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <ul
                    className={`mt-3 space-y-2.5 text-sm text-[#DBDBDB] ${
                      isOpen ? "block" : "hidden md:block"
                    }`}
                  >
                    {group.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="transition-colors hover:text-[#FCAA30]">
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

        {/* Contact Info Strip */}
        <div className="grid gap-6 border-b border-white/15 py-8 text-xs text-[#B6B8B9] sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-2.5">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#FCAA30]" />
            <span>{contact.phone}</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#FCAA30]" />
            <span>{contact.supportEmail}</span>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FCAA30]" />
            <span>{contact.officeAddress}</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#FCAA30]" />
            <span>{contact.operatingHours}</span>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 text-xs text-[#9C9EA0] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Aurum Fleet Solutions Pvt Ltd. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white">Terms & Conditions</Link>
            <Link href="/rental-policy" className="hover:text-white">Rental Policy</Link>
            <Link href="/cancellation-policy" className="hover:text-white">Cancellation Policy</Link>
            <Link href="/refund-policy" className="hover:text-white">Refund Policy</Link>
          </div>
        </div>
      </div>
      <WhatsAppButton whatsapp={contact.whatsapp} />
    </footer>
  );
}
