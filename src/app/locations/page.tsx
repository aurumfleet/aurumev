import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  ArrowRight,
  Navigation,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { query } from "@/lib/db";
import { getSiteSetting, DEFAULT_CONTACT_SETTINGS, type ContactSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Service Hub Locations | AURUM EV",
  description:
    "Find your nearest AURUM EV service hub for electric two-wheeler rentals, maintenance support, and fleet operations across active cities.",
};

export const dynamic = "force-dynamic";

interface Location {
  id: string;
  city: string;
  state: string;
  hub_name: string;
  address: string | null;
  operating_hours: string | null;
  is_active: boolean;
}

const HUB_FEATURES = [
  "Vehicle handover & collection",
  "Scheduled maintenance bay",
  "Rider onboarding & KYC",
  "Emergency breakdown support",
  "Document processing",
  "Spare parts availability",
];

export default async function LocationsPage() {
  const [locationsRes, contact] = await Promise.all([
    query<Location>(
      "SELECT id, city, state, hub_name, address, operating_hours, is_active FROM locations WHERE is_active = TRUE ORDER BY city ASC"
    ),
    getSiteSetting<ContactSettings>("contact_settings", DEFAULT_CONTACT_SETTINGS),
  ]);

  const locations = locationsRes.rows;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#0F0F0F] pb-16 pt-16 sm:pt-20 sm:pb-20">
          <div className="aurum-container">
            <span className="inline-block rounded-full bg-[#1F1F1F] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#FCAA30]">
              Service Network
            </span>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl">
              AURUM EV SERVICE HUBS.
            </h1>
            <p className="mt-4 max-w-xl text-base text-[#B6B8B9] sm:text-lg">
              Every Aurum hub is a full-service electric mobility point — from vehicle handover and
              KYC to scheduled maintenance and rider support.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/rentals#book" className="aurum-pill-mango">
                Book at Your Hub
              </Link>
              <Link href="/contact" className="aurum-pill-light">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* What Every Hub Offers */}
        <section className="border-b border-[#EBEBEB] bg-[#F4F4F4] py-10">
          <div className="aurum-container">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#666666]">
              Every Aurum Hub Includes
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {HUB_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-[#0F0F0F]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#13B75E]" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location Cards */}
        <section className="py-16 sm:py-20">
          <div className="aurum-container">
            <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#0667F4]">
                  Active Service Hubs
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-[#0F0F0F] sm:text-4xl">
                  Where We Operate.
                </h2>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0667F4] hover:underline underline-offset-4"
              >
                Request a new city <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {locations.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#EBEBEB] py-20 text-center">
                <MapPin className="h-10 w-10 text-[#EBEBEB]" />
                <h3 className="mt-4 font-display text-xl font-medium text-[#0F0F0F]">
                  Service hubs launching soon
                </h3>
                <p className="mt-2 max-w-xs text-sm text-[#666666]">
                  We are building our initial service network. Check back soon or contact us for
                  launch city updates.
                </p>
                <Link href="/contact" className="aurum-pill-mango mt-6">
                  Get Notified
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {locations.map((loc) => (
                  <div
                    key={loc.id}
                    className="flex flex-col rounded-3xl bg-[#F4F4F4] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C2F7C8] px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#13B75E]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#13B75E]" />
                          Active Hub
                        </span>
                        <h3 className="mt-3 font-display text-2xl font-semibold text-[#0F0F0F]">
                          {loc.city}
                        </h3>
                        <p className="text-sm text-[#666666]">{loc.state}</p>
                      </div>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <Navigation className="h-5 w-5 text-[#0667F4]" />
                      </div>
                    </div>

                    <div className="mt-5 space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FCAA30]" />
                        <span className="text-[#0F0F0F]">
                          {loc.hub_name}
                          {loc.address ? ` · ${loc.address}` : ""}
                        </span>
                      </div>
                      {loc.operating_hours && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 shrink-0 text-[#FCAA30]" />
                          <span className="text-[#666666]">{loc.operating_hours}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0 text-[#FCAA30]" />
                        <span className="text-[#666666]">{contact.phone}</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Link
                        href={`/rentals?city=${encodeURIComponent(loc.city)}`}
                        className="aurum-pill-soft w-full justify-between px-5 py-3 text-xs font-semibold hover:bg-[#0F0F0F] hover:text-white"
                      >
                        Book at {loc.city} Hub
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Expansion CTA */}
        <section className="bg-[#0F0F0F] py-16 sm:py-20">
          <div className="aurum-container text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#FCAA30]">
              Growing Network
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
              Your City Coming Soon.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-[#B6B8B9] sm:text-base">
              We are actively expanding our electric mobility service network. Submit an interest
              request and we will notify you when your city goes live.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="aurum-pill-mango">
                Request Your City
              </Link>
              <Link href="/business" className="aurum-pill-light">
                Business Fleet Solutions
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
