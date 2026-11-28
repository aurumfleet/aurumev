import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaqAccordion, type FaqItem } from "@/components/FaqAccordion";
import { query } from "@/lib/db";
import { getAppUrl } from "@/lib/app-url";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildPageMetadata,
  safeJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Frequently Asked Questions | Rider Help Centre",
  description:
    "Aurum Fleet Solutions Rider Help Centre: answers about EV rentals, delivery work, Delhi & Noida hubs, payment plans, charging, and maintenance.",
  path: "/faq",
  keywords: [
    "AURUM EV FAQ",
    "EV scooter rental questions Delhi Noida",
    "delivery partner EV help",
  ],
});

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const res = await query<FaqItem>(
    "SELECT id, category, question, answer FROM faqs WHERE is_published = TRUE ORDER BY sort_order ASC, created_at ASC"
  );
  const appUrl = getAppUrl();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(appUrl, [
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
  ]);
  const faqJsonLd = res.rows.length > 0 ? buildFaqJsonLd(res.rows) : null;

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F4F4]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
        />
      )}
      <Navbar />
      <main className="flex-1 py-16 sm:py-20">
        <div className="aurum-container max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9E7524]">
            Aurum Fleet Solutions | Rider Help Centre
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-[#0F0F0F] sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-sm text-[#666666]">
            Clear answers for riders and delivery partners across Delhi &amp; Noida. Need help
            booking? Reach out on our Contact page or WhatsApp.
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
