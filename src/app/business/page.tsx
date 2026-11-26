import type { Metadata } from "next";
import Image from "next/image";
import { Building2, CheckCircle2, FileSpreadsheet, Users, Shield } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BusinessProposalForm } from "@/components/BusinessProposalForm";

export const metadata: Metadata = {
  title: "Business & Corporate EV Fleet Solutions",
  description:
    "Bulk electric two-wheeler rentals, centralized corporate fleet management, and flexible commercial agreements by Aurum Fleet Solutions Pvt Ltd.",
};

export default function BusinessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F4F4F4]">
      <Navbar />
      <main className="flex-1">
        <section className="bg-[#0F0F0F] py-16 text-white sm:py-24">
          <div className="aurum-container grid items-center gap-10 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-6">
              <span className="inline-block rounded-full bg-[#1F1F1F] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#FCAA30]">
                B2B & Enterprise Mobility
              </span>
              <h1 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl">
                Centralized Electric Fleets for Modern Businesses
              </h1>
              <p className="text-base text-[#B6B8B9] sm:text-lg">
                Deploy reliable electric two-wheelers across your delivery and field teams with
                transparent GST invoicing, scheduled maintenance, and dedicated account support.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#proposal" className="aurum-pill-mango">
                  Request Business Proposal
                </a>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/10">
                <Image
                  src="/images/business-ev-fleet.jpg"
                  alt="Corporate EV fleet line-up"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="aurum-container grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Building2, title: "Bulk EV Deployment", desc: "Scale fleet allocation cleanly across city hubs." },
              { icon: Users, title: "Dedicated Account Support", desc: "Single point of coordination for operations teams." },
              { icon: FileSpreadsheet, title: "Consolidated GST Invoices", desc: "Clear monthly corporate billing and statements." },
              { icon: Shield, title: "SLA Maintenance Support", desc: "Preventive servicing and priority turnaround." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="aurum-card">
                  <Icon className="h-6 w-6 text-[#0667F4]" />
                  <h2 className="mt-4 font-display text-xl font-medium text-[#0F0F0F]">{item.title}</h2>
                  <p className="mt-1.5 text-sm text-[#666666]">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="proposal" className="pb-20">
          <div className="aurum-container grid gap-10 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-5">
              <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-[#0F0F0F]">
                Enterprise Onboarding Process
              </h2>
              <ul className="space-y-3 text-sm text-[#1F1F1F]">
                {[
                  "Submit company details, GST (if applicable), city, and fleet volume.",
                  "Receive a customized commercial proposal and SLA review.",
                  "Complete corporate verification and master fleet agreement.",
                  "Deploy allocated EVs with scheduled hub maintenance and dedicated support.",
                ].map((step) => (
                  <li key={step} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#13B75E]" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7">
              <BusinessProposalForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
