import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroShowcase } from "@/components/HeroShowcase";
import { AboutAurumSection } from "@/components/AboutAurumSection";
import { PartnersHolographicSection } from "@/components/PartnersHolographicSection";
import { WhyChooseAurumSection } from "@/components/WhyChooseAurumSection";
import { HowItWorksInvestmentSection } from "@/components/HowItWorksInvestmentSection";
import { FleetLineupCarousel } from "@/components/FleetLineupCarousel";
import { OperationsShowcaseTabs } from "@/components/OperationsShowcaseTabs";
import { AurumEcosystemSection } from "@/components/AurumEcosystemSection";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { LetsConnectSection } from "@/components/LetsConnectSection";
import { FaqAccordion, type FaqItem } from "@/components/FaqAccordion";
import { RevealOnScroll } from "@/components/MotionPrimitives";
import type { PublicLocation, PublicRentalPlan, PublicVehicleModel } from "@/components/FleetShowcase";
import { query } from "@/lib/db";
import { getSiteSettingsBundle } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [locationsRes, modelsRes, plansRes, vehiclesCountRes, faqsRes, testimonialsRes, settings] =
    await Promise.all([
      query<PublicLocation>("SELECT id, city, state, hub_name FROM locations WHERE is_active = TRUE ORDER BY city ASC"),
      query<PublicVehicleModel>("SELECT * FROM vehicle_models WHERE is_published = TRUE ORDER BY created_at ASC"),
      query<PublicRentalPlan>("SELECT * FROM rental_plans WHERE is_active = TRUE"),
      query<{ model_id: string; cnt: string }>(
        "SELECT model_id, COUNT(*)::text AS cnt FROM vehicles WHERE status = 'available' AND model_id IS NOT NULL GROUP BY model_id"
      ),
      query<FaqItem>("SELECT id, category, question, answer FROM faqs WHERE is_published = TRUE ORDER BY sort_order ASC LIMIT 6"),
      query<{ id: string; customer_name: string; customer_category: string; review_text: string; city: string | null }>(
        "SELECT id, customer_name, customer_category, review_text, city FROM testimonials WHERE approval_status = 'approved' AND is_verified = TRUE ORDER BY created_at DESC LIMIT 6"
      ),
      getSiteSettingsBundle(),
    ]);

  const availableCountByModel: Record<string, number> = {};
  for (const row of vehiclesCountRes.rows) {
    availableCountByModel[row.model_id] = Number(row.cnt);
  }

  const verifiedStats = settings.sustainabilityStats.filter((s) => s.verified);

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F0F0F]">
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

        {/* SECTION 05 – HOW IT WORKS */}
        <HowItWorksInvestmentSection />

        {/* 5. INTERACTIVE ROLE TABS (Riders | Business Fleets | Investment Model) */}
        <OperationsShowcaseTabs />

        {/* 6. VEHICLE LINEUP CAROUSEL */}
        <FleetLineupCarousel
          models={modelsRes.rows}
          plans={plansRes.rows}
          availableCountByModel={availableCountByModel}
        />

        {/* 7. AURUM ECOSYSTEM ADVANTAGES + SMART FLEET INTELLIGENCE + REFER & WHO WE ARE */}
        <AurumEcosystemSection />

        {/* 8. MATH OF SWITCHING TO EV CALCULATOR (With Interactive Distance Slider) */}
        <SavingsCalculator />

        {/* 9. ACTIVE AURUM HUBS */}
        <section className="bg-se-stores-gradient overflow-hidden pt-20 sm:pt-24">
          <div className="aurum-container grid items-end gap-12 lg:grid-cols-12">
            <RevealOnScroll className="pb-16 lg:col-span-6 lg:pb-24">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0667F4] shadow-sm">
                <MapPin className="h-6 w-6" />
              </div>
              <h2 className="mt-6 font-display text-4xl font-semibold tracking-[-0.04em] text-[#0F0F0F] sm:text-[58px] sm:leading-[1.03]">
                Active Aurum Hubs.
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-[#666666] sm:text-lg">
                Operating across verified urban mobility hubs with dedicated vehicle inspection,
                scheduled servicing, and seamless handover.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {locationsRes.rows.map((loc) => (
                  <div
                    key={loc.id}
                    className="rounded-2xl bg-white/90 px-4 py-3 text-sm shadow-sm backdrop-blur-sm"
                  >
                    <p className="font-semibold text-[#0F0F0F]">{loc.city}</p>
                    <p className="text-xs text-[#666666]">{loc.hub_name}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/rentals#book" className="aurum-pill-dark">
                  Check Hub Availability
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </RevealOnScroll>

            <RevealOnScroll direction="right" className="lg:col-span-6">
              <div className="relative aspect-[16/11] w-full overflow-hidden rounded-t-3xl border border-white/70 bg-white p-2 shadow-elevated">
                <div className="relative h-full w-full overflow-hidden rounded-t-2xl">
                  <Image
                    src="/images/aurum-zepto.jpg"
                    alt="Aurum EV operations and urban fleet support"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* 10. LET'S CONNECT (Interactive Reason Selector + Live Lead Form) */}
        <LetsConnectSection />

        {/* 11. SUSTAINABILITY & VERIFIED TESTIMONIALS */}
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

        {/* 12. FAQ ACCORDION */}
        <section className="bg-white py-20">
          <div className="aurum-container max-w-4xl">
            <div className="mb-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#666666]">
                Questions & Answers
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-[#0F0F0F] sm:text-4xl">
                Clear Answers Before You Ride
              </h2>
            </div>
            <FaqAccordion faqs={faqsRes.rows} />
            <div className="mt-6 text-center">
              <Link href="/faq" className="text-sm font-semibold text-[#0F0F0F] hover:text-[#0667F4]">
                View all FAQs →
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
