import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, FileText, Layers, Settings } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { InvestorEnquiryForm } from "@/components/InvestorEnquiryForm";
import { InvestmentCalculatorGlass } from "@/components/InvestmentCalculatorGlass";
import { FleetTiersSchedule } from "@/components/FleetTiersSchedule";
import {
  INVESTMENT_MODEL_CONSTANTS,
  formatINR,
  type DefinedEvPlanUnits,
} from "@/data/investment-plans";

export const metadata: Metadata = {
  title: "Investment | EV Fleet Opportunities & Calculator",
  description:
    "Explore electric two-wheeler fleet investment plans (2 to 50 EVs), interactive 48-month rental calculator, per-EV pricing, and operational transparency with Aurum Fleet Solutions Pvt Ltd.",
};

export const dynamic = "force-dynamic";

function parsePlanUnits(raw?: string): DefinedEvPlanUnits {
  const num = Number(raw);
  if (num === 2 || num === 5 || num === 10 || num === 25 || num === 50) {
    return num;
  }
  return 2;
}

export default async function InvestPage({
  searchParams,
}: {
  searchParams: Promise<{ units?: string }>;
}) {
  const sp = await searchParams;
  const initialUnits = parsePlanUnits(sp.units);

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F4F4]">
      <Navbar />
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-[#0F0F0F] py-16 text-white sm:py-24">
          <div className="aurum-container max-w-4xl">
            <span className="inline-block rounded-full bg-[#1F1F1F] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#FCAA30]">
              Fleet Partnerships &amp; Investment Opportunities
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.03] tracking-[-0.04em] sm:text-6xl">
              BE PART OF THE ELECTRIC MOBILITY FUTURE.
            </h1>
            <p className="mt-4 text-base text-[#B6B8B9] sm:text-lg">
              Transparent 48-month commercial EV fleet plans spanning 2 to 50 EVs, managed rider
              deployment, hub maintenance, and scheduled monthly payouts.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#investment-calculator" className="aurum-pill-mango">
                Try Live Calculator
              </a>
              <a
                href="#enquiry"
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/[0.08] px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/[0.16]"
              >
                Submit Investor Enquiry
              </a>
            </div>
          </div>
        </section>

        {/* Per EV Investment Summary Strip */}
        <section className="py-10">
          <div className="aurum-container">
            <div className="grid gap-4 rounded-3xl bg-white p-6 shadow-card sm:grid-cols-2 lg:grid-cols-4 sm:p-7">
              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">
                  Investment (Per EV)
                </p>
                <p className="mt-1.5 font-display text-2xl font-bold text-[#0B1F3A] tabular-nums">
                  {formatINR(INVESTMENT_MODEL_CONSTANTS.investmentPerEv)}
                </p>
                <p className="mt-1 text-xs text-[#475569] tabular-nums">
                  + GST (5%): {formatINR(INVESTMENT_MODEL_CONSTANTS.gstPerEv)}
                </p>
              </div>
              <div className="rounded-2xl bg-[#ECFDF5] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#047857]">
                  Total Investment (Per EV)
                </p>
                <p className="mt-1.5 font-display text-2xl font-bold text-[#047857] tabular-nums">
                  {formatINR(INVESTMENT_MODEL_CONSTANTS.totalInvestmentPerEv)}
                </p>
                <p className="mt-1 text-xs text-[#047857]">Inclusive of 5% GST</p>
              </div>
              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">
                  Rental Tenure
                </p>
                <p className="mt-1.5 font-display text-2xl font-bold text-[#0B1F3A]">
                  {INVESTMENT_MODEL_CONSTANTS.agreementMonths} Months
                </p>
                <p className="mt-1 text-xs text-[#475569]">Structured 4-year lease agreement</p>
              </div>
              <div className="rounded-2xl bg-[#FAF7F0] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9E7524]">
                  Monthly Rental / EV
                </p>
                <p className="mt-1.5 font-display text-2xl font-bold text-[#0B1F3A] tabular-nums">
                  ₹4,300 – ₹5,500
                </p>
                <p className="mt-1 text-xs text-[#64748B]">Scalable across 2 to 50 EVs</p>
              </div>
            </div>
          </div>
        </section>

        {/* Full-Width Minimalist Apple Liquid Glass Live Investment Calculator */}
        <section className="pb-14">
          <div className="aurum-container">
            <InvestmentCalculatorGlass initialUnits={initialUnits} ctaMode="enquiry" />
          </div>
        </section>

        {/* Complete 5-Tier Brushed-Chrome Schedule & Operational Pillars */}
        <section className="pb-14">
          <div className="aurum-container space-y-10">
            <FleetTiersSchedule />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Layers,
                  title: "Managed Fleet Asset Model",
                  desc: "Aurum coordinates vehicle procurement, rider allocation, and corporate fleet deployment across active hubs.",
                },
                {
                  icon: Settings,
                  title: "Vehicle & Maintenance Management",
                  desc: "Every asset has lifecycle documentation, insurance tracking, scheduled maintenance records, and allocation logs.",
                },
                {
                  icon: FileText,
                  title: "Transparent Reporting Process",
                  desc: "Clear itemization of EV capital, 5% GST, scheduled monthly payouts, 48-month total rental, and net surplus.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="aurum-card">
                    <Icon className="h-6 w-6 text-[#0667F4]" />
                    <h2 className="mt-4 font-display text-xl font-medium text-[#0F0F0F]">{item.title}</h2>
                    <p className="mt-2 text-sm text-[#666666]">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Risk Factors & Investor Enquiry Form */}
        <section className="pb-20">
          <div className="aurum-container grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="aurum-card h-full">
                <div className="flex items-center gap-2 text-[#0F0F0F]">
                  <AlertTriangle className="h-5 w-5 text-[#FCAA30]" />
                  <h2 className="font-display text-xl font-semibold">Key Risk Factors &amp; Disclosures</h2>
                </div>
                <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm text-[#666666]">
                  <li>Figures shown are illustrative projections based on the investment plans and rental rates displayed.</li>
                  <li>Actual rental payouts are subject to the executed agreement, operational conditions, and applicable taxes/charges.</li>
                  <li>Projected rental surplus is calculated as total scheduled rental minus initial investment and should not be interpreted as guaranteed profit or assured returns.</li>
                  <li>All participation terms require formal legal contracts and compliance verification.</li>
                </ul>
                <Link
                  href="/investor-disclosures"
                  className="mt-5 inline-block text-xs font-semibold text-[#0F0F0F] underline"
                >
                  Read full Investor Disclosures →
                </Link>
              </div>
            </div>

            <div id="enquiry" className="lg:col-span-7 scroll-mt-24">
              <InvestorEnquiryForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
