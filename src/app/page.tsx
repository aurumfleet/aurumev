import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroShowcase } from "@/components/HeroShowcase";
import { AboutAurumSection } from "@/components/AboutAurumSection";
import { PartnersHolographicSection } from "@/components/PartnersHolographicSection";
import { WhyChooseAurumSection } from "@/components/WhyChooseAurumSection";
import { RiderStoriesSection } from "@/components/RiderStoriesSection";
import { FaqAccordion, type FaqItem } from "@/components/FaqAccordion";
import { query } from "@/lib/db";
import { getSiteSettingsBundle } from "@/lib/settings";
import { getAppUrl } from "@/lib/app-url";
import {
  buildFaqJsonLd,
  buildLocalBusinessJsonLd,
  buildPageMetadata,
  safeJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Electric Scooter Rentals & EV Fleet Solutions",
  absoluteTitle: "AURUM EV | Electric Scooter Rentals & EV Fleet Solutions in Delhi & Noida",
  description:
    "Rent electric two-wheelers in Delhi & Noida for delivery partners, commuters, and businesses, or explore managed EV fleet investment plans with Aurum Fleet Solutions Pvt Ltd.",
  path: "/",
  keywords: [
    "AURUM EV",
    "electric scooter rental Delhi",
    "electric scooter rental Noida",
    "delivery partner EV rental",
    "EV fleet investment India",
  ],
});

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [faqsRes, testimonialsRes, settings] = await Promise.all([
    query<FaqItem>("SELECT id, category, question, answer FROM faqs WHERE is_published = TRUE ORDER BY sort_order ASC LIMIT 6"),
    query<{ id: string; customer_name: string; customer_category: string; review_text: string; photo_url: string | null; city: string | null }>(
      "SELECT id, customer_name, customer_category, review_text, photo_url, city FROM testimonials WHERE approval_status = 'approved' AND is_verified = TRUE ORDER BY created_at DESC LIMIT 6"
    ),
    getSiteSettingsBundle(),
  ]);

  const verifiedStats = settings.sustainabilityStats.filter((s) => s.verified);
  const appUrl = getAppUrl();
  const faqJsonLd = faqsRes.rows.length > 0 ? buildFaqJsonLd(faqsRes.rows) : null;
  const localBusinessJsonLd = buildLocalBusinessJsonLd(appUrl);

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F0F0F]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(localBusinessJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
        />
      )}
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SHOWCASE CAROUSEL */}
        <HeroShowcase />

        {/* 2. KEY INVESTMENT & OPERATIONS HIGHLIGHT BAR */}
        <div className="border-b border-[#EBEBEB] bg-white py-4">
          <div className="aurum-container flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C2F7C8] px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#13B75E]">
              <Sparkles className="h-3 w-3" />
              Fleet Plan
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-display font-semibold tracking-tight text-[#0F0F0F]">
              <span>₹70,000 per EV</span>
              <span aria-hidden="true" className="text-[#FCAA30]">|</span>
              <span>4-Year Investment Plan</span>
              <span aria-hidden="true" className="text-[#FCAA30]">|</span>
              <span>Managed Fleet Operations</span>
            </div>
            <Link
              href="/invest"
              className="text-xs font-semibold text-[#0667F4] underline-offset-4 hover:underline"
            >
              Explore Investment Plans →
            </Link>
          </div>
        </div>

        {/* SECTION 02 – PARTNERS WHO BELIEVED IN US */}
        <PartnersHolographicSection />

        {/* SECTION 03 – ABOUT AURUM FLEET SOLUTIONS */}
        <AboutAurumSection />

        {/* SECTION 04 – WHY CHOOSE AURUM */}
        <WhyChooseAurumSection />

        {/* 6. SUSTAINABILITY & VERIFIED TESTIMONIALS */}
        <section className="border-t border-[#EBEBEB] bg-[#F4F4F4] py-16">
          <div className="aurum-container text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#13B75E]">
              Impact & Sustainability
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-[#0F0F0F]">
              Clean Urban Mobility, Verified Every Step
            </h2>

            {verifiedStats.length > 0 ? (
              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                {verifiedStats.map((stat) => (
                  <div key={stat.id} className="aurum-card">
                    <p className="font-display text-3xl font-semibold text-[#0F0F0F]">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#0667F4]">
                      {stat.unit}
                    </p>
                    <p className="mt-2 text-sm text-[#666666]">{stat.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mx-auto mt-3 max-w-2xl text-sm text-[#666666]">
                Aurum Fleet Solutions Pvt Ltd publishes operational and environmental statistics only
                after audited hub verification. Zero-tailpipe electric two-wheelers help reduce
                urban emissions across active hubs.
              </p>
            )}

            {testimonialsRes.rows.length > 0 && (
              <div className="mt-12 grid gap-6 text-left md:grid-cols-3">
                {testimonialsRes.rows.map((t) => (
                  <blockquote key={t.id} className="aurum-card flex flex-col justify-between">
                    <p className="text-sm leading-relaxed text-[#1F1F1F]">“{t.review_text}”</p>
                    <footer className="mt-4 border-t border-[#EBEBEB] pt-3">
                      <p className="font-display text-sm font-semibold text-[#0F0F0F]">
                        {t.customer_name}
                      </p>
                      <p className="text-xs text-[#666666]">
                        {t.customer_category}
                        {t.city ? ` · ${t.city}` : ""}
                      </p>
                    </footer>
                  </blockquote>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 13 – RIDER EXPERIENCES & TESTIMONIALS */}
        <RiderStoriesSection verifiedTestimonials={testimonialsRes.rows} />

        {/* 12. FAQ ACCORDION */}
        <section className="bg-white py-20">
          <div className="aurum-container max-w-4xl">
            <div className="mb-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9E7524]">
                Aurum Fleet Solutions | Rider Help Centre
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-[#0F0F0F] sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>
            <FaqAccordion faqs={faqsRes.rows} />
            <div className="mt-6 text-center">
              <Link href="/faq" className="text-sm font-semibold text-[#0F0F0F] hover:text-[#9E7524]">
                View all 15 FAQs →
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 13. PURE BLACK FOOTER WITH TEAL CTA BANNER */}
      <Footer />

      {/* Mobile Floating Liquid Glass Bottom Quick-Action Bar */}
      <div className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 gap-2.5 rounded-full border border-white/85 bg-white/[0.78] p-2 shadow-[0_14px_38px_rgba(15,15,15,0.14),inset_0_1px_1px_rgba(255,255,255,1)] ring-1 ring-black/[0.06] backdrop-blur-2xl backdrop-saturate-[180%] md:hidden">
        <Link href="/contact" className="aurum-pill-dark py-2.5 text-xs">
          Contact Team
        </Link>
        <Link href="/invest" className="aurum-pill-mango py-2.5 text-xs">
          Invest Now
        </Link>
      </div>
    </div>
  );
}
