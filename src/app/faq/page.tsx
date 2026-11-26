import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaqAccordion, type FaqItem } from "@/components/FaqAccordion";
import { query } from "@/lib/db";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about AURUM EV rentals, delivery plans, KYC, corporate fleets, and investor enquiries.",
};

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const res = await query<FaqItem>(
    "SELECT id, category, question, answer FROM faqs WHERE is_published = TRUE ORDER BY sort_order ASC, created_at ASC"
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F4F4]">
      <Navbar />
      <main className="flex-1 py-16 sm:py-20">
        <div className="aurum-container max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#0667F4]">Help Center</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-[#0F0F0F] sm:text-5xl">
            Frequently Asked Questions.
          </h1>
          <p className="mt-3 text-sm text-[#666666]">
            Clear answers about AURUM EV rentals, delivery plans, and business fleets. Can’t find
            your answer? Visit our Contact page.
          </p>
          <div className="mt-10">
            <FaqAccordion faqs={res.rows} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
