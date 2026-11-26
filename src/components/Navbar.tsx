"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight, X, ArrowUpRight } from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics";

const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/rentals", label: "EV Rentals" },
  { href: "/riders", label: "For Riders" },
  { href: "/business", label: "Business" },
  { href: "/invest", label: "Invest" },
  { href: "/fleet", label: "Our Fleet" },
];

const MORE_LINKS = [
  { href: "/locations", label: "Service Hubs", desc: "Active cities & hub facilities" },
  { href: "/about", label: "About Us", desc: "Aurum Fleet Solutions Pvt Ltd" },
  { href: "/how-it-works", label: "How It Works", desc: "4-step rental onboarding" },
  { href: "/faq", label: "FAQs", desc: "Answers on rentals & plans" },
  { href: "/blog", label: "Insights & Blog", desc: "EV mobility & fleet economics" },
  { href: "/contact", label: "Contact Us", desc: "Speak with our operations team" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isMoreActive = MORE_LINKS.some((l) => pathname === l.href);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-black/[0.08] bg-white/75 shadow-[0_10px_35px_rgba(15,15,15,0.08)] backdrop-blur-2xl backdrop-saturate-150"
            : "border-b border-black/[0.05] bg-white/80 backdrop-blur-xl backdrop-saturate-150"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-8 lg:h-[76px] lg:px-10">
          {/* Brand Emblem + Wordmark */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCAA30]"
          >
            <Image
              src="/images/aurum-emblem.png"
              alt="Aurum Fleet Solutions AF Emblem"
              width={40}
              height={40}
              className="h-9 w-9 shrink-0 object-contain lg:h-10 lg:w-10"
              priority
            />
            <div className="whitespace-nowrap leading-tight">
              <span className="block font-display text-[17px] font-semibold tracking-[-0.03em] text-[#0F0F0F]">
                AURUM <span className="font-normal text-[#666666]">EV</span>
              </span>
              <span className="hidden text-[9.5px] font-medium uppercase tracking-[0.22em] text-[#828587] sm:block">
                Aurum Fleet Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Frosted Glass Pill Menu Bar */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 rounded-full border border-black/[0.06] bg-[#F4F4F4]/75 p-1.5 backdrop-blur-md lg:flex"
          >
            {PRIMARY_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] tracking-[-0.01em] transition-all duration-200 xl:px-4 ${
                    active
                      ? "bg-white font-semibold text-[#0F0F0F] shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
                      : "font-medium text-[#666666] hover:bg-white/60 hover:text-[#0F0F0F]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* More Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen((v) => !v)}
                className={`inline-flex whitespace-nowrap items-center gap-1 rounded-full px-3.5 py-2 text-[13px] tracking-[-0.01em] transition-all duration-200 xl:px-4 ${
                  moreOpen || isMoreActive
                    ? "bg-white font-semibold text-[#0F0F0F] shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
                    : "font-medium text-[#666666] hover:bg-white/60 hover:text-[#0F0F0F]"
                }`}
              >
                <span>Company</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    moreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {moreOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] w-72 rounded-3xl border border-black/[0.08] bg-white/90 p-2.5 shadow-elevated backdrop-blur-2xl backdrop-saturate-150">
                  {MORE_LINKS.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-center justify-between rounded-2xl px-3.5 py-2.5 transition-colors ${
                          active ? "bg-[#F4F4F4]" : "hover:bg-[#F4F4F4]/80"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#0F0F0F]">{item.label}</p>
                          <p className="text-[11px] text-[#666666]">{item.desc}</p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-[#828587]" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right CTAs (No duplicates) */}
          <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
            <Link
              href="/contact"
              className="whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium text-[#0F0F0F] transition hover:bg-[#F4F4F4]"
            >
              Contact
            </Link>
            <Link
              href="/rentals#book"
              onClick={() => trackAnalyticsEvent("rent_cta_click", { source: "header" })}
              className="aurum-pill-mango whitespace-nowrap px-5 py-2.5 text-[13px] shadow-[0_6px_20px_rgba(252,170,48,0.32)] hover:-translate-y-0.5"
            >
              Book an EV
            </Link>
          </div>

          {/* Mobile Quick Book + Frosted 2-Line Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/rentals#book"
              className="whitespace-nowrap rounded-full bg-[#FCAA30] px-3.5 py-1.5 text-xs font-semibold text-black shadow-sm"
            >
              Book EV
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-black/[0.08] bg-[#F4F4F4]/80 backdrop-blur-md transition hover:bg-[#EBEBEB]"
            >
              <span className="h-[1.5px] w-4 rounded-full bg-[#0F0F0F]" />
              <span className="h-[1.5px] w-4 rounded-full bg-[#0F0F0F]" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Frosted Glass Mobile Drawer */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex h-[100dvh] w-screen flex-col bg-white/95 backdrop-blur-2xl backdrop-saturate-150 lg:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-black/[0.06] px-5">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5"
            >
              <Image
                src="/images/aurum-emblem.png"
                alt="Aurum Emblem"
                width={34}
                height={34}
                className="h-8 w-8 object-contain"
              />
              <span className="font-display text-lg font-semibold tracking-[-0.03em] text-[#0F0F0F]">
                AURUM EV
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0F0F0F]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#828587]">
              Mobility
            </p>
            <ul className="divide-y divide-[#F0F0F0]">
              {PRIMARY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between py-3.5 font-display text-2xl font-medium tracking-[-0.03em] ${
                      pathname === link.href ? "text-[#0667F4]" : "text-[#0F0F0F]"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-5 w-5 text-[#828587]" />
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mb-2 mt-7 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#828587]">
              Company & Resources
            </p>
            <ul className="divide-y divide-[#F0F0F0]">
              {MORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-3 font-display text-lg font-medium text-[#1F1F1F]"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-4 w-4 text-[#828587]" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-black/[0.06] bg-[#F4F4F4]/90 px-5 py-4 backdrop-blur-md">
            <Link
              href="/invest"
              onClick={() => setMobileOpen(false)}
              className="aurum-pill-dark py-3.5 text-center text-sm"
            >
              Invest With Us
            </Link>
            <Link
              href="/rentals#book"
              onClick={() => setMobileOpen(false)}
              className="aurum-pill-mango py-3.5 text-center text-sm"
            >
              Book an EV
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
