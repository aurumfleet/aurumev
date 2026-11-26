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
  const isHome = pathname === "/";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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

  const overDarkHero = isHome && !scrolled;
  const isMoreActive = MORE_LINKS.some((l) => pathname === l.href);

  const handleCapsulePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !pillRef.current) return;
    const rect = pillRef.current.getBoundingClientRect();
    pillRef.current.style.setProperty("--hx", `${(e.clientX - rect.left).toFixed(1)}px`);
    pillRef.current.style.setProperty("--hy", `${(e.clientY - rect.top).toFixed(1)}px`);
    pillRef.current.style.setProperty("--h-active", "1");
  };

  const handleCapsulePointerLeave = () => {
    if (!pillRef.current) return;
    pillRef.current.style.setProperty("--h-active", "0");
  };

  return (
    <>
      <header
        className={`pointer-events-none z-50 w-full transition-all duration-500 ${
          isHome
            ? "fixed inset-x-0 top-3 px-3 sm:top-4 sm:px-6"
            : "sticky top-3 px-3 pt-3 sm:top-4 sm:px-6 sm:pt-4"
        }`}
      >
        <div
          ref={pillRef}
          onPointerMove={handleCapsulePointerMove}
          onPointerLeave={handleCapsulePointerLeave}
          style={
            {
              "--hx": "50%",
              "--hy": "50%",
              "--h-active": "0",
            } as React.CSSProperties
          }
          className={`pointer-events-auto relative mx-auto flex h-[60px] items-center justify-between gap-3 rounded-full px-3.5 backdrop-blur-2xl backdrop-saturate-[190%] transition-[max-width,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-[68px] sm:px-5 ${
            scrolled ? "max-w-[1260px]" : "max-w-[1380px]"
          } ${
            overDarkHero
              ? "border border-white/25 bg-[#101216]/35 shadow-[0_20px_54px_rgba(0,0,0,0.38),inset_0_1px_1px_rgba(255,255,255,0.45),inset_0_-1px_1px_rgba(255,255,255,0.10)]"
              : "border border-white/85 bg-white/[0.72] ring-1 ring-black/[0.06] shadow-[0_16px_44px_rgba(15,15,15,0.11),0_4px_14px_rgba(198,154,67,0.08),inset_0_1px_1.5px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(15,15,15,0.04)]"
          }`}
        >
          {/* Upper Specular Liquid-Glass Curved Bevel */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-8 top-0 h-px rounded-full bg-gradient-to-r from-transparent ${
              overDarkHero ? "via-white/65" : "via-white"
            } to-transparent`}
          />

          {/* Interactive Cursor-Tracking Liquid Optical Caustic Reflection */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-full transition-opacity duration-300"
            style={{ opacity: "var(--h-active)" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: overDarkHero
                  ? "radial-gradient(280px circle at var(--hx) var(--hy), rgba(255,255,255,0.22), rgba(252,170,48,0.12) 45%, transparent 74%)"
                  : "radial-gradient(280px circle at var(--hx) var(--hy), rgba(255,255,255,0.85), rgba(252,170,48,0.14) 45%, transparent 74%)",
              }}
            />
          </div>

          {/* Brand Emblem + Wordmark */}
          <Link
            href="/"
            className="relative z-10 flex shrink-0 items-center gap-2.5 rounded-full pr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCAA30]"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 lg:h-10 lg:w-10 ${
                overDarkHero
                  ? "border border-white/40 bg-white/95 p-0.5 shadow-[0_4px_16px_rgba(0,0,0,0.28)]"
                  : "bg-transparent"
              }`}
            >
              <Image
                src="/images/aurum-emblem.png"
                alt="Aurum Fleet Solutions AF Emblem"
                width={40}
                height={40}
                className="h-full w-full object-contain"
                priority
              />
            </span>
            <div className="whitespace-nowrap leading-tight">
              <span
                className={`block font-display text-[16px] font-semibold tracking-[-0.03em] transition-colors duration-300 sm:text-[17px] ${
                  overDarkHero ? "text-white" : "text-[#0F0F0F]"
                }`}
              >
                AURUM{" "}
                <span className={overDarkHero ? "font-normal text-[#F5CF7E]" : "font-normal text-[#666666]"}>
                  EV
                </span>
              </span>
              <span
                className={`hidden text-[9px] font-medium uppercase tracking-[0.22em] transition-colors duration-300 sm:block ${
                  overDarkHero ? "text-white/65" : "text-[#828587]"
                }`}
              >
                Aurum Fleet Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Liquid Glass Nav Track */}
          <nav
            aria-label="Main navigation"
            className={`relative z-10 hidden items-center gap-0.5 rounded-full border p-1 backdrop-blur-xl transition-colors duration-300 lg:flex ${
              overDarkHero
                ? "border-white/20 bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]"
                : "border-black/[0.06] bg-white/[0.55] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
            }`}
          >
            {PRIMARY_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] tracking-[-0.01em] transition-all duration-200 xl:px-3.5 ${
                    active
                      ? overDarkHero
                        ? "border border-white/35 bg-white/[0.22] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_4px_14px_rgba(0,0,0,0.18)]"
                        : "border border-black/[0.05] bg-white font-semibold text-[#0F0F0F] shadow-[0_4px_14px_rgba(15,15,15,0.08),inset_0_1px_0_rgba(255,255,255,1)]"
                      : overDarkHero
                        ? "font-medium text-white/80 hover:bg-white/[0.12] hover:text-white"
                        : "font-medium text-[#55575A] hover:bg-white/70 hover:text-[#0F0F0F]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Company Liquid Glass Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen((v) => !v)}
                className={`inline-flex whitespace-nowrap items-center gap-1 rounded-full px-3 py-1.5 text-[13px] tracking-[-0.01em] transition-all duration-200 xl:px-3.5 ${
                  moreOpen || isMoreActive
                    ? overDarkHero
                      ? "border border-white/35 bg-white/[0.22] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
                      : "border border-black/[0.05] bg-white font-semibold text-[#0F0F0F] shadow-[0_4px_14px_rgba(15,15,15,0.08)]"
                    : overDarkHero
                      ? "font-medium text-white/80 hover:bg-white/[0.12] hover:text-white"
                      : "font-medium text-[#55575A] hover:bg-white/70 hover:text-[#0F0F0F]"
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
                <div className="absolute right-0 top-[calc(100%+16px)] w-72 rounded-3xl border border-white/75 bg-white/[0.86] p-2.5 text-[#0F0F0F] shadow-[0_24px_60px_rgba(15,15,15,0.2),inset_0_1px_1px_rgba(255,255,255,0.95)] ring-1 ring-black/[0.06] backdrop-blur-2xl backdrop-saturate-[190%]">
                  {MORE_LINKS.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-center justify-between rounded-2xl px-3.5 py-2.5 transition-colors ${
                          active ? "bg-black/[0.05]" : "hover:bg-black/[0.04]"
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

          {/* Desktop Right Glass Actions */}
          <div className="relative z-10 hidden shrink-0 items-center gap-2 lg:flex">
            <Link
              href="/contact"
              className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium transition-all duration-200 ${
                overDarkHero
                  ? "text-white/90 hover:bg-white/[0.14] hover:text-white"
                  : "text-[#0F0F0F] hover:bg-black/[0.05]"
              }`}
            >
              Contact
            </Link>
            <Link
              href="/invest"
              onClick={() => trackAnalyticsEvent("invest_cta_click", { source: "header" })}
              className="relative inline-flex items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-r from-[#FCAA30] via-[#FFC563] to-[#FCAA30] px-5 py-2.5 text-[13px] font-semibold tracking-[-0.01em] text-[#0F0F0F] shadow-[0_8px_24px_rgba(252,170,48,0.38),inset_0_1px_1px_rgba(255,255,255,0.75)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(252,170,48,0.5)] active:scale-[0.98]"
            >
              Invest Now
            </Link>
          </div>

          {/* Mobile Quick CTA + Liquid Glass Hamburger */}
          <div className="relative z-10 flex items-center gap-2 lg:hidden">
            <Link
              href="/invest"
              onClick={() => trackAnalyticsEvent("invest_cta_click", { source: "header_mobile" })}
              className="whitespace-nowrap rounded-full bg-gradient-to-r from-[#FCAA30] via-[#FFC563] to-[#FCAA30] px-3.5 py-1.5 text-xs font-semibold text-[#0F0F0F] shadow-[0_4px_14px_rgba(252,170,48,0.35),inset_0_1px_0_rgba(255,255,255,0.7)]"
            >
              Invest Now
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className={`flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full border backdrop-blur-xl transition ${
                overDarkHero
                  ? "border-white/30 bg-white/[0.14] hover:bg-white/[0.24]"
                  : "border-black/[0.08] bg-white/80 hover:bg-white"
              }`}
            >
              <span
                className={`h-[1.5px] w-4 rounded-full ${
                  overDarkHero ? "bg-white" : "bg-[#0F0F0F]"
                }`}
              />
              <span
                className={`h-[1.5px] w-4 rounded-full ${
                  overDarkHero ? "bg-white" : "bg-[#0F0F0F]"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Liquid Glass Mobile Drawer */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex h-[100dvh] w-screen flex-col bg-white/85 backdrop-blur-2xl backdrop-saturate-[180%] lg:hidden"
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
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.06] bg-white/80 text-[#0F0F0F] shadow-sm backdrop-blur-md"
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

          <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-black/[0.06] bg-white/75 px-5 py-4 backdrop-blur-xl">
            <Link
              href="/rentals#book"
              onClick={() => setMobileOpen(false)}
              className="aurum-pill-dark py-3.5 text-center text-sm"
            >
              Rent an EV
            </Link>
            <Link
              href="/invest"
              onClick={() => setMobileOpen(false)}
              className="aurum-pill-mango py-3.5 text-center text-sm"
            >
              Invest Now
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
