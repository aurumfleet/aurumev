import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, FileText, Layers, Settings } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { InvestorEnquiryForm } from "@/components/InvestorEnquiryForm";
import { InvestorPreviewSimulator } from "@/components/InvestorPreviewSimulator";
import { getSiteSetting, DEFAULT_INVESTMENT_CONFIG, type InvestmentConfig } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Invest With Us | EV Fleet Opportunities",
  description:
    "Explore electric two-wheeler fleet deployment structure, operating approach, risk factors, and reporting transparency with Aurum Fleet Solutions Pvt Ltd.",
};

export const dynamic = "force-dynamic";

export default async function InvestPage() {
  const config = await getSiteSetting<InvestmentConfig>(
    "investment_config",
    DEFAULT_INVESTMENT_CONFIG
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F4F4]">
      <Navbar />
      <main className="flex-1">
        <section className="bg-[#0F0F0F] py-16 text-white sm:py-24">
          <div className="aurum-container max-w-4xl">
            <span className="inline-block rounded-full bg-[#1F1F1F] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#FCAA30]">
              Fleet Partnerships & Investor Information
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.03] tracking-[-0.04em] sm:text-6xl">
              BE PART OF THE ELECTRIC MOBILITY FUTURE.
            </h1>
            <p className="mt-4 text-base text-[#B6B8B9] sm:text-lg">
              Learn how Aurum Fleet Solutions Pvt Ltd structures managed EV deployment, rider
              operations, asset maintenance, insurance, and verified periodic reporting.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#enquiry" className="aurum-pill-mango">
                Submit Investor Enquiry
              </a>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="aurum-container">
            <div className="rounded-3xl bg-white p-7 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0667F4]">
                Official Program Status
              </p>
              <p className="mt-2 font-display text-xl font-medium text-[#0F0F0F]">
                {config.financialModelApproved
                  ? "Approved Investment Structure Documentation Available Upon Inquiry"
                  : config.publicStatusMessage}
              </p>
              <p className="mt-2 text-xs text-[#666666]">{config.disclosuresText}</p>
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
                desc: "Clear separation between projected revenue, operating expenses, actual received income, and distributions.",
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

        <section className="pb-20">
          <div className="aurum-container grid gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-6">
              <InvestorPreviewSimulator
                financialModelApproved={config.financialModelApproved}
                demoCalculatorEnabled={config.demoCalculatorEnabled}
                publicStatusMessage={config.publicStatusMessage}
              />

              <div className="aurum-card">
                <div className="flex items-center gap-2 text-[#0F0F0F]">
                  <AlertTriangle className="h-5 w-5 text-[#FCAA30]" />
                  <h2 className="font-display text-xl font-semibold">Key Risk Factors & Disclosures</h2>
                </div>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#666666]">
                  <li>Fleet utilization depends on regional rider demand, city operations, and seasonal cycles.</li>
                  <li>Maintenance, battery health, insurance, and downtime directly affect net operating cashflows.</li>
                  <li>No fixed ROI, guaranteed monthly profit, or assured buyback is promised on this website.</li>
                  <li>All participation terms require formal legal contracts and regulatory compliance review.</li>
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
        </section>
      </main>
      <Footer />
    </div>
  );
}
