import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Bike,
  FileText,
  ClipboardCheck,
  HandshakeIcon,
  MessageCircle,
  Calendar,
  Shield,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RevealOnScroll } from "@/components/MotionPrimitives";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Four simple steps to rent an electric two-wheeler with AURUM EV.",
};

const STEPS = [
  {
    num: "01",
    icon: Bike,
    title: "Choose Your City, Plan & Vehicle Category",
    body: "Select an active Aurum hub in your city, pick your vehicle category — commuter, delivery, or corporate — and choose your rental duration: daily, weekly, monthly, or long-term.",
    details: [
      "Available cities & hub locations shown live",
      "Vehicle categories: Commuter / Delivery / Corporate",
      "Rental plans: Daily · Weekly · Monthly · Corporate",
    ],
  },
  {
    num: "02",
    icon: FileText,
    title: "Submit Your Rental Request & Details",
    body: "Fill in your preferred start date, riding purpose, and contact information. All requests are logged securely and routed directly to our operations team for review.",
    details: [
      "Name, phone, purpose of rental",
      "Preferred start date & duration",
      "No payment at this stage",
    ],
  },
  {
    num: "03",
    icon: ClipboardCheck,
    title: "KYC Verification & Availability Confirmation",
    body: "Our operations team checks vehicle availability at your chosen hub and completes identity and driving licence verification before confirming the booking.",
    details: [
      "Government-issued photo ID (Aadhaar / PAN)",
      "Valid driving licence (category-dependent)",
      "Confirmation from our team within 24 hours",
    ],
  },
  {
    num: "04",
    icon: HandshakeIcon,
    title: "Agreement, Handover & Start Riding",
    body: "Finalize your rental agreement at the hub, complete the vehicle handover checklist, and start riding with ongoing scheduled maintenance support throughout your plan.",
    details: [
      "Written rental agreement provided",
      "Vehicle handover checklist documented",
      "Hub support & scheduled maintenance included",
    ],
  },
];

const QUICK_INFO = [
  { icon: MessageCircle, label: "24-Hour Response", desc: "Our team confirms all booking requests within one business day." },
  { icon: Calendar, label: "Flexible Start Dates", desc: "Choose any start date that works for your schedule and hub availability." },
  { icon: Shield, label: "Verified Documentation", desc: "All agreements are written and provided before vehicle handover." },
  { icon: Zap, label: "Instant Lead Logging", desc: "Your request is captured instantly and routed to the right specialist." },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#0F0F0F] pb-16 pt-16 sm:pt-20 sm:pb-20">
          <div className="aurum-container max-w-4xl">
            <span className="inline-block rounded-full bg-[#1F1F1F] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#FCAA30]">
              Step-by-Step Guide
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl">
              HOW AURUM EV WORKS.
            </h1>
            <p className="mt-4 max-w-xl text-base text-[#B6B8B9] sm:text-lg">
              Four clear steps from your first enquiry to your first electric ride — with no
              surprises along the way.
            </p>
          </div>
        </section>

        {/* Quick Info Strip */}
        <section className="border-b border-[#EBEBEB] bg-[#F4F4F4] py-8">
          <div className="aurum-container grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_INFO.map((q) => {
              const Icon = q.icon;
              return (
                <div key={q.label} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Icon className="h-4 w-4 text-[#0667F4]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0F0F0F]">{q.label}</p>
                    <p className="text-xs leading-relaxed text-[#666666]">{q.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Steps */}
        <section className="py-16 sm:py-20">
          <div className="aurum-container max-w-4xl space-y-6">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <RevealOnScroll key={s.num} delayMs={i * 80}>
                  <div className="flex flex-col gap-6 rounded-3xl border border-[#EBEBEB] bg-white p-7 shadow-card sm:flex-row sm:items-start sm:gap-8">
                    <div className="flex shrink-0 flex-col items-center gap-2 sm:w-24">
                      <span className="font-display text-5xl font-semibold text-[#FCAA30]">
                        {s.num}
                      </span>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F4F4F4]">
                        <Icon className="h-5 w-5 text-[#0667F4]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="font-display text-xl font-semibold text-[#0F0F0F]">
                        {s.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-[#666666]">{s.body}</p>
                      <ul className="mt-4 space-y-2">
                        {s.details.map((d) => (
                          <li key={d} className="flex items-center gap-2 text-sm text-[#0F0F0F]">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#13B75E]" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="hidden h-full items-center sm:flex">
                        <ArrowRight className="h-5 w-5 text-[#EBEBEB]" />
                      </div>
                    )}
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>

          <div className="aurum-container mt-10 flex flex-wrap gap-3">
            <Link href="/rentals#book" className="aurum-pill-mango">
              Start Booking Request
            </Link>
            <Link href="/faq" className="aurum-pill-dark">
              Read FAQs
            </Link>
            <Link href="/contact" className="aurum-pill-soft">
              Contact Our Team
            </Link>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-[#F4F4F4] py-14">
          <div className="aurum-container text-center">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-[#0F0F0F]">
              Ready to Go Electric?
            </h2>
            <p className="mt-2 text-sm text-[#666666]">
              Submit your rental request today and our team will confirm availability within 24 hours.
            </p>
            <Link href="/rentals#book" className="aurum-pill-mango mt-6 inline-flex">
              Book Now →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
