import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Leaf,
  Cpu,
  Users,
  ArrowRight,
  Zap,
  Building2,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Heart,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RevealOnScroll } from "@/components/MotionPrimitives";

export const metadata: Metadata = {
  title: "About Us | Aurum Fleet Solutions Pvt Ltd",
  description:
    "Discover the mission, leadership principles, and operational discipline behind AURUM EV by Aurum Fleet Solutions Pvt Ltd.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    color: "#0667F4",
    bg: "#EBF2FF",
    title: "Operational Integrity",
    desc: "Transparent agreements, verified vehicle specifications, and straightforward pricing across every rental plan.",
  },
  {
    icon: Cpu,
    color: "#FCAA30",
    bg: "#FFF7E6",
    title: "Structured Operations",
    desc: "Disciplined fleet booking workflows, preventive servicing schedules, and hub-level operational accountability.",
  },
  {
    icon: Users,
    color: "#13B75E",
    bg: "#EAFAF1",
    title: "Rider-First Support",
    desc: "Simple onboarding documentation, hub-level assistance, and responsive operations team across all active service hubs.",
  },
  {
    icon: Leaf,
    color: "#13B75E",
    bg: "#EAFAF1",
    title: "Zero-Tailpipe Impact",
    desc: "Supporting measurable reductions in urban fuel combustion through structured electric last-mile logistics.",
  },
];

const PILLARS = [
  {
    num: "01",
    title: "Reliability at Scale",
    desc: "Every fleet unit goes through preventive maintenance cycles tracked at the hub level. We prioritize uptime above expansion speed.",
  },
  {
    num: "02",
    title: "Transparency First",
    desc: "No hidden charges, no surprise deductions. Every rider and partner receives a written, verifiable agreement before handover.",
  },
  {
    num: "03",
    title: "Partnership over Transaction",
    desc: "Whether a daily commuter, delivery partner, or enterprise client — we design long-term operational frameworks, not one-off rentals.",
  },
  {
    num: "04",
    title: "Asset Discipline",
    desc: "Every vehicle in our fleet has documentation: procurement, insurance, maintenance, and allocation — trackable and verifiable.",
  },
];

const SEGMENTS = [
  {
    icon: Zap,
    label: "Individual Commuters",
    desc: "Daily and weekly riders who want zero-fuel urban mobility without the burden of vehicle ownership.",
    href: "/rentals",
    cta: "Rent an EV",
    color: "#0667F4",
  },
  {
    icon: MapPin,
    label: "Delivery Partners",
    desc: "Gig economy and last-mile delivery riders on monthly high-uptime EV plans with scheduled servicing built in.",
    href: "/riders",
    cta: "Delivery Plans",
    color: "#13B75E",
  },
  {
    icon: Building2,
    label: "Enterprise Clients",
    desc: "Corporate and logistics businesses deploying bulk electric fleets under SLA-backed rental agreements.",
    href: "/business",
    cta: "Business Fleet",
    color: "#FCAA30",
  },
  {
    icon: TrendingUp,
    label: "Fleet Partners",
    desc: "Structured EV fleet deployment partners who want transparent asset management and periodic operational reporting.",
    href: "/invest",
    cta: "Partner With Us",
    color: "#0F0F0F",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#0F0F0F] pb-16 pt-16 sm:pt-20 sm:pb-24">
          <div className="aurum-container">
            <span className="inline-block rounded-full bg-[#1F1F1F] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#FCAA30]">
              About Aurum Fleet Solutions Pvt Ltd
            </span>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl">
              DRIVEN BY TRUST.
              <br />
              <span className="text-[#828587]">POWERED BY TOMORROW.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#B6B8B9] sm:text-lg">
              AURUM EV is the electric mobility brand of Aurum Fleet Solutions Pvt Ltd. We design
              dependable electric two-wheeler rental programs and structured fleet operations for
              daily commuters, gig and delivery partners, corporate enterprises, and ecosystem
              partners across India.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/rentals" className="aurum-pill-mango">
                Explore Rentals
              </Link>
              <Link href="/contact" className="aurum-pill-light">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="bg-[#F4F4F4] py-16 sm:py-20">
          <div className="aurum-container">
            <RevealOnScroll>
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#0667F4]">
                    Our Mission
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] text-[#0F0F0F] sm:text-4xl">
                    Making Electric Mobility Accessible & Dependable.
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-[#666666]">
                    We believe that the shift to electric urban mobility should be built on
                    reliability, transparency, and fair economics — not just on technology hype.
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-[#666666]">
                    Every decision at Aurum Fleet Solutions is guided by one principle: build
                    systems that work consistently for the rider, the delivery partner, and the
                    enterprise client — even when they are not watching.
                  </p>
                </div>
                <div className="space-y-4">
                  {PILLARS.map((p) => (
                    <div key={p.num} className="flex gap-5 rounded-2xl bg-white p-5 shadow-card">
                      <span className="font-display text-2xl font-semibold text-[#FCAA30]">
                        {p.num}
                      </span>
                      <div>
                        <h3 className="font-display text-base font-semibold text-[#0F0F0F]">
                          {p.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-[#666666]">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 sm:py-20">
          <div className="aurum-container">
            <RevealOnScroll>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#0667F4]">
                What We Stand For
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] text-[#0F0F0F] sm:text-4xl">
                Our Operating Values.
              </h2>
            </RevealOnScroll>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v, i) => {
                const Icon = v.icon;
                return (
                  <RevealOnScroll key={v.title} delayMs={i * 70}>
                    <div className="flex h-full flex-col rounded-3xl bg-[#F4F4F4] p-7">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl"
                        style={{ background: v.bg }}
                      >
                        <Icon className="h-6 w-6" style={{ color: v.color }} />
                      </div>
                      <h3 className="mt-5 font-display text-lg font-semibold text-[#0F0F0F]">
                        {v.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#666666]">{v.desc}</p>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="bg-[#F4F4F4] py-16 sm:py-20">
          <div className="aurum-container">
            <RevealOnScroll>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#0667F4]">
                Who We Serve
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] text-[#0F0F0F] sm:text-4xl">
                Built for Every Electric Mobility Need.
              </h2>
            </RevealOnScroll>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {SEGMENTS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <RevealOnScroll key={s.label} delayMs={i * 70}>
                    <Link
                      href={s.href}
                      className="group flex h-full flex-col rounded-3xl bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
                    >
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-2xl transition-colors"
                        style={{ background: `${s.color}18` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: s.color }} />
                      </div>
                      <h3 className="mt-5 font-display text-lg font-semibold text-[#0F0F0F]">
                        {s.label}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#666666]">{s.desc}</p>
                      <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-[#0667F4] group-hover:gap-3 transition-all">
                        {s.cta} <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </Link>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* Legal & Contact CTA */}
        <section className="bg-[#0F0F0F] py-16 sm:py-20">
          <div className="aurum-container grid gap-10 lg:grid-cols-2 lg:gap-16">
            <RevealOnScroll>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#FCAA30]">
                  Legal Entity
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                  Aurum Fleet Solutions Pvt Ltd.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#B6B8B9]">
                  AURUM EV is a registered trademark of Aurum Fleet Solutions Pvt Ltd. All rental
                  agreements, fleet operations, and business partnerships are executed under the
                  legal entity Aurum Fleet Solutions Pvt Ltd.
                </p>
                <div className="mt-6 space-y-3 text-sm text-[#B6B8B9]">
                  {[
                    { icon: CheckCircle2, text: "Registered Private Limited Company" },
                    { icon: CheckCircle2, text: "GST Registered Entity" },
                    { icon: CheckCircle2, text: "Written Rental Agreements for All Customers" },
                    { icon: CheckCircle2, text: "Insurance Documentation on Fleet Vehicles" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.text} className="flex items-center gap-2">
                        <Icon className="h-4 w-4 shrink-0 text-[#13B75E]" />
                        {item.text}
                      </div>
                    );
                  })}
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="rounded-3xl bg-[#1A1A1A] p-8">
                <Heart className="h-6 w-6 text-[#FCAA30]" />
                <h3 className="mt-4 font-display text-2xl font-semibold text-white">
                  Connect With Our Team.
                </h3>
                <p className="mt-2 text-sm text-[#B6B8B9]">
                  Whether you are an individual rider, a fleet operator, a corporate procurement
                  team, or a prospective partner — our team is ready to assist.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/rentals" className="aurum-pill-mango">
                    Explore Rentals
                  </Link>
                  <Link href="/contact" className="aurum-pill-light">
                    Contact Us
                  </Link>
                </div>
                <div className="mt-6 flex flex-wrap gap-4 text-xs text-[#666666]">
                  <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                  <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
                  <Link href="/investor-disclosures" className="hover:text-white transition-colors">Investor Disclosures</Link>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
