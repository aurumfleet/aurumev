import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Wrench, Zap, Clock, ArrowRight, FileCheck2, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "EV Rentals for Delivery Partners",
  description:
    "Reliable weekly and monthly electric two-wheeler rentals designed for last-mile delivery partners and gig workers.",
};

export default function RidersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <section className="bg-[#0F0F0F] py-16 text-white sm:py-24">
          <div className="aurum-container grid items-center gap-10 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-7">
              <span className="inline-block rounded-full bg-[#1F1F1F] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#FCAA30]">
                For Delivery Partners & Daily Riders
              </span>
              <h1 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
                Drive Electric. Keep More of What You Earn.
              </h1>
              <p className="max-w-xl text-base text-[#B6B8B9] sm:text-lg">
                Built for food, grocery, e-commerce, and hyperlocal delivery partners who need
                dependable daily range, scheduled maintenance support, and flexible weekly or
                monthly rental plans without long-term lock-ins.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/rentals?category=delivery#book" className="aurum-pill-mango">
                  Apply for Rider EV Plan <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/#calculator" className="aurum-pill-light">
                  Calculate Fuel Savings
                </Link>
              </div>
            </div>

            <div className="text-[#0F0F0F] lg:col-span-5">
              <LeadForm
                defaultCategory="delivery_partner"
                title="Rider Callback Request"
                subtitle="Share your city and delivery platform to check rider fleet availability."
              />
            </div>
          </div>
        </section>

        <section className="bg-[#F4F4F4] py-16 sm:py-20">
          <div className="aurum-container grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Zap, title: "Lower Daily Energy Cost", desc: "Predictable electric charging vs daily petrol price spikes." },
              { icon: Wrench, title: "Scheduled Servicing", desc: "Preventive maintenance and hub support included." },
              { icon: Clock, title: "Weekly & Monthly Plans", desc: "Flexible durations aligned with rider earning cycles." },
              { icon: ShieldCheck, title: "Clear Agreements", desc: "Simple onboarding and transparent rental & cancellation terms." },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="aurum-card">
                  <Icon className="h-6 w-6 text-[#0667F4]" />
                  <h2 className="mt-4 font-display text-xl font-medium text-[#0F0F0F]">{f.title}</h2>
                  <p className="mt-2 text-sm text-[#666666]">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3-Step Onboarding & KYC Document Checklist (aligned to Neev /riders flow) */}
        <section className="bg-white py-16 sm:py-24">
          <div className="aurum-container grid gap-10 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#0667F4]">
                Simple 3-Step Rider Onboarding
              </p>
              <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-[#0F0F0F] sm:text-4xl">
                From application to road in 3 steps.
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { n: "01", t: "Apply Online", d: "Submit your city, plan, and contact details." },
                  { n: "02", t: "Verify at Hub", d: "Complete KYC document check and agreement." },
                  { n: "03", t: "Start Riding", d: "Collect your inspected EV and begin shifts." },
                ].map((s) => (
                  <div key={s.n} className="rounded-3xl bg-[#F4F4F4] p-5">
                    <span className="font-display text-2xl font-semibold text-[#FCAA30]">{s.n}</span>
                    <h3 className="mt-3 font-display text-lg font-medium text-[#0F0F0F]">{s.t}</h3>
                    <p className="mt-1.5 text-xs text-[#666666]">{s.d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-[#F4F4F4] p-7 lg:col-span-5">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-[#0667F4]" />
                <h3 className="font-display text-xl font-semibold text-[#0F0F0F]">
                  Required KYC Documents
                </h3>
              </div>
              <ul className="mt-5 space-y-3 text-sm text-[#1F1F1F]">
                {[
                  "Valid 2-Wheeler Driving Licence (where applicable) & Aadhaar / PAN",
                  "Current Address Proof (Rental Agreement / Utility Bill / Voter ID)",
                  "Active Delivery Partner Profile (Zomato, Swiggy, Blinkit, Zepto, etc.) for rider plans",
                ].map((doc) => (
                  <li key={doc} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#13B75E]" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
              <Link href="/rental-policy" className="mt-5 inline-block text-xs font-semibold text-[#0F0F0F] underline">
                Read full Rental & Deposit Policy →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
