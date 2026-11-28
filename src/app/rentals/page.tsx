import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  FileCheck2,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookingWizard } from "@/components/BookingWizard";
import { FaqAccordion, type FaqItem } from "@/components/FaqAccordion";
import { query } from "@/lib/db";
import type { PublicLocation, PublicRentalPlan, PublicVehicleModel } from "@/components/FleetShowcase";

export const metadata: Metadata = {
  title: "EV Rentals for Riders | Delhi & Noida | AURUM EV",
  description:
    "Rent an electric two-wheeler in Delhi & Noida for delivery work or daily commuting. Flexible weekly & monthly rider plans with scheduled hub servicing and instant WhatsApp support.",
};

export const dynamic = "force-dynamic";

export default async function RentalsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; model?: string; city?: string }>;
}) {
  const sp = await searchParams;
  const [locationsRes, modelsRes, plansRes, faqsRes] = await Promise.all([
    query<PublicLocation>(
      "SELECT id, city, state, hub_name, address, operating_hours FROM locations WHERE is_active = TRUE ORDER BY city ASC"
    ),
    query<PublicVehicleModel>(
      "SELECT * FROM vehicle_models WHERE is_published = TRUE ORDER BY created_at ASC"
    ),
    query<PublicRentalPlan>(
      "SELECT * FROM rental_plans WHERE is_active = TRUE ORDER BY duration_type ASC"
    ),
    query<FaqItem>(
      "SELECT id, category, question, answer FROM faqs WHERE is_published = TRUE ORDER BY sort_order ASC, created_at ASC"
    ),
  ]);

  const matchedLocation = sp.city
    ? locationsRes.rows.find(
        (loc) => loc.city.toLowerCase() === sp.city?.trim().toLowerCase()
      )
    : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FB]">
      <Navbar />
      <main className="flex-1">
        {/* Obsidian & Gold Hero Header (Aligned to Neev /riders + Delhi/Noida) */}
        <section className="relative overflow-hidden bg-[#0A0A0D] py-16 text-white sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_75%_15%,rgba(252,170,48,0.14),transparent_70%)]"
          />
          <div className="aurum-container relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#FCAA30] backdrop-blur-xl">
                Delhi &amp; Noida EV Rentals · Rider Onboarding
              </span>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                Drive Electric.{" "}
                <span className="bg-gradient-to-r from-white via-[#FBE3B4] to-[#FCAA30] bg-clip-text text-transparent">
                  Keep More of What You Earn.
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#CBD5E1] sm:text-lg">
                Start riding without buying a scooter. Flexible weekly and monthly electric
                two-wheeler rentals for delivery partners and daily commuters across Delhi &amp;
                Noida — with scheduled maintenance support and quick hub handover.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/917779990277?text=Hi%20AURUM%20EV%2C%20I%20want%20to%20rent%20an%20EV%20scooter%20in%20Delhi%20%2F%20Noida."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#13B75E] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0fa352]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp: +91 77799 90277
              </a>
              <a
                href="tel:+917779990277"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-[#FCAA30] hover:text-[#FCAA30]"
              >
                <Phone className="h-4 w-4 text-[#FCAA30]" />
                Call Support
              </a>
            </div>
          </div>
        </section>

        {/* Core Rider Benefits Strip */}
        <section className="border-b border-[#EBEBEB] bg-white py-10">
          <div className="aurum-container grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Zap,
                title: "No Upfront Purchase",
                desc: "Ride an electric scooter on rent without heavy purchase costs or loan EMIs.",
              },
              {
                icon: Clock,
                title: "Weekly & Monthly Plans",
                desc: "Flexible payment plans structured around rider and delivery schedules.",
              },
              {
                icon: Wrench,
                title: "Scheduled Maintenance",
                desc: "Hub servicing and preventive upkeep as defined in your rental agreement.",
              },
              {
                icon: ShieldCheck,
                title: "Delhi & Noida Hubs",
                desc: "Convenient pickup, KYC verification, and team support in NCR.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#0F0F0F]/[0.08] bg-[#F8F9FB] p-5"
                >
                  <Icon className="h-5 w-5 text-[#9E7524]" />
                  <h2 className="mt-3 font-display text-base font-semibold text-[#0F0F0F]">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-[#666666]">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Main Booking Wizard + Hub Addresses & KYC Sidebar */}
        <section id="book" className="py-14 sm:py-16">
          <div className="aurum-container grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <BookingWizard
                locations={locationsRes.rows}
                models={modelsRes.rows}
                plans={plansRes.rows}
                initialCategory={sp.category || "delivery"}
                initialModelId={sp.model || ""}
                initialLocationId={matchedLocation?.id || ""}
              />
            </div>

            <aside className="space-y-6 lg:col-span-4">
              {/* Delhi & Noida Hub Cards */}
              <div className="rounded-3xl border border-[#CBD5E1]/70 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#9E7524]" />
                  <h2 className="font-display text-lg font-semibold text-[#0F0F0F]">
                    Active NCR Hubs
                  </h2>
                </div>
                <div className="mt-4 space-y-3">
                  {locationsRes.rows.map((loc) => (
                    <div
                      key={loc.id}
                      className="rounded-2xl border border-[#0F0F0F]/[0.07] bg-[#F8F9FB] p-4"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9E7524]">
                        {loc.city} · {loc.hub_name}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                        {loc.address}
                      </p>
                      <p className="mt-1.5 text-[11px] font-medium text-[#0F0F0F]">
                        {loc.operating_hours || "Mon - Sat, 09:00 AM - 07:00 PM IST"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* KYC Document Checklist (Aligned to Neev /riders) */}
              <div className="rounded-3xl border border-[#CBD5E1]/70 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-[#9E7524]" />
                  <h2 className="font-display text-lg font-semibold text-[#0F0F0F]">
                    Required KYC Documents
                  </h2>
                </div>
                <ul className="mt-4 space-y-2.5 text-xs leading-relaxed text-[#334155]">
                  {[
                    "Aadhaar Card & PAN Card (Government photo ID)",
                    "Driving Licence (applicable as per EV category & motor rules)",
                    "Current Delhi / Noida Address Proof",
                    "Delivery Partner App ID (for Zomato, Swiggy, Blinkit, Zepto, etc.)",
                  ].map((doc) => (
                    <li key={doc} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#13B75E]" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/rental-policy"
                  className="mt-4 inline-block text-xs font-semibold text-[#0F0F0F] underline"
                >
                  Read Rental &amp; Security Deposit Policy →
                </Link>
              </div>

              {/* Available Plans Summary */}
              <div className="rounded-3xl bg-[#0F0F0F] p-6 text-white">
                <h2 className="font-display text-lg font-semibold text-[#FCAA30]">
                  How Handover Works (3 Steps)
                </h2>
                <ol className="mt-4 space-y-3 text-xs leading-relaxed text-[#CBD5E1]">
                  <li>
                    <strong className="text-white">01. Submit &amp; WhatsApp:</strong> Choose your
                    Delhi or Noida hub and send your details directly to +91 77799 90277.
                  </li>
                  <li>
                    <strong className="text-white">02. Hub KYC &amp; Plan Confirmation:</strong>{" "}
                    Verify documents, confirm deposit/tariff terms, and sign the agreement.
                  </li>
                  <li>
                    <strong className="text-white">03. Ride &amp; Earn:</strong> Collect your EV
                    with charger instructions and ongoing hub assistance.
                  </li>
                </ol>
              </div>
            </aside>
          </div>
        </section>

        {/* Rider Help Centre FAQs directly on /rentals */}
        <section className="border-t border-[#EBEBEB] bg-white py-16 sm:py-20">
          <div className="aurum-container max-w-4xl">
            <div className="mb-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9E7524]">
                Aurum Fleet Solutions | Rider Help Centre
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-[#0F0F0F] sm:text-4xl">
                Rider &amp; Rental FAQs
              </h2>
              <p className="mt-2 text-sm text-[#666666]">
                Everything you need to know about renting an electric scooter in Delhi &amp; Noida.
              </p>
            </div>
            <FaqAccordion faqs={faqsRes.rows} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
