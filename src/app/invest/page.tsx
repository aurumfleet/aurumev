import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, FileText, Layers, Settings } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { InvestorEnquiryForm } from "@/components/InvestorEnquiryForm";
import { InvestorPreviewSimulator } from "@/components/InvestorPreviewSimulator";
import {
  ALL_COMPUTED_PLANS,
  INVESTMENT_MODEL_CONSTANTS,
  formatINR,
  type DefinedEvPlanUnits,
} from "@/data/investment-plans";
import { getSiteSetting, DEFAULT_INVESTMENT_CONFIG, type InvestmentConfig } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Invest With Us | EV Fleet Opportunities",
  description:
    "Explore electric two-wheeler fleet investment plans (2 to 50 EVs), per-EV pricing, 48-month rental structure, and operational transparency with Aurum Fleet Solutions Pvt Ltd.",
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
  const [sp, config] = await Promise.all([
    searchParams,
    getSiteSetting<InvestmentConfig>("investment_config", DEFAULT_INVESTMENT_CONFIG),
  ]);
  const initialUnits = parsePlanUnits(sp.units);

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F4F4]">
      <Navbar />
      <main className="flex-1">
        <section className="bg-[#0F0F0F] py-16 text-white sm:py-24">
          <div className="aurum-container max-w-4xl">
            <span className="inline-block rounded-full bg-[#1F1F1F] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#FCAA30]">
              Fleet Partnerships &amp; Investor Information
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.03] tracking-[-0.04em] sm:text-6xl">
              BE PART OF THE ELECTRIC MOBILITY FUTURE.
            </h1>
            <p className="mt-4 text-base text-[#B6B8B9] sm:text-lg">
              Transparent 48-month commercial EV fleet plans spanning 2 to 50 EVs, managed rider
              deployment, hub maintenance, and scheduled monthly payouts.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#enquiry" className="aurum-pill-mango">
                Submit Investor Enquiry
              </a>
            </div>
          </div>
        </section>

        {/* Per EV Investment Summary Strip Matching Official Chart */}
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

        <section className="pb-14">
          <div className="aurum-container grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        </section>

        {/* Full 5-Tier Reference Table + Interactive Simulator & Enquiry */}
        <section className="pb-20">
          <div className="aurum-container space-y-8">
            <div className="overflow-hidden rounded-3xl bg-white shadow-card">
              <div className="border-b border-[#EBEBEB] px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#047857]">
                  Investment Plans &amp; Illustrated Schedules
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-[#0F0F0F]">
                  2 EVs to 50 EVs Plan Breakdown
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm tabular-nums">
                  <thead>
                    <tr className="border-b border-[#EBEBEB] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#475569]">
                      <th className="px-5 py-3.5">EV Units</th>
                      <th className="px-4 py-3.5">Investment</th>
                      <th className="px-4 py-3.5">GST 5%</th>
                      <th className="px-4 py-3.5">Total Investment</th>
                      <th className="px-4 py-3.5">Per EV Rental</th>
                      <th className="px-4 py-3.5">Investor Cut / Mo</th>
                      <th className="px-4 py-3.5">Total Rental (48M)</th>
                      <th className="px-5 py-3.5 text-right">Net Surplus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F0F0]">
                    {ALL_COMPUTED_PLANS.map((plan) => (
                      <tr key={plan.evUnits} className="hover:bg-[#F8FAFC]">
                        <td className="px-5 py-3.5 font-bold text-[#0B1F3A]">{plan.evUnits}</td>
                        <td className="px-4 py-3.5 text-[#334155]">{formatINR(plan.investment)}</td>
                        <td className="px-4 py-3.5 text-[#64748B]">{formatINR(plan.gst)}</td>
                        <td className="px-4 py-3.5 font-semibold text-[#0B1F3A]">
                          {formatINR(plan.totalInvestment)}
                        </td>
                        <td className="px-4 py-3.5">{formatINR(plan.rentalPerEvMonthly)}</td>
                        <td className="px-4 py-3.5 font-semibold">{formatINR(plan.monthlyRental)}</td>
                        <td className="px-4 py-3.5 font-semibold">
                          {formatINR(plan.totalRental48Months)}
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-[#047857]">
                          {formatINR(plan.projectedRentalSurplus)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-6">
                <InvestorPreviewSimulator
                  initialUnits={initialUnits}
                  publicStatusMessage={config.disclosuresText}
                />

                <div className="aurum-card">
                  <div className="flex items-center gap-2 text-[#0F0F0F]">
                    <AlertTriangle className="h-5 w-5 text-[#FCAA30]" />
                    <h2 className="font-display text-xl font-semibold">Key Risk Factors &amp; Disclosures</h2>
                  </div>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#666666]">
                    <li>Figures shown are illustrative projections based on the investment plans and rental rates displayed.</li>
                    <li>Actual rental payouts are subject to the executed agreement, operational conditions, and applicable taxes/charges.</li>
                    <li>Projected rental surplus is calculated as total scheduled rental minus initial investment and should not be interpreted as guaranteed profit or assured returns.</li>
                    <li>All participation terms require formal legal contracts and compliance verification.</li>
                  </ul>
                  <Link
                    href="/investor-disclosures"
                    className="mt-4 inline-block text-xs font-semibold text-[#0F0F0F] underline"
                  >
                    Read full Investor Disclosures →
                  </Link>
                </div>
              </div>

              <div id="enquiry" className="lg:col-span-6">
                <InvestorEnquiryForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
