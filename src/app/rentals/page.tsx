import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookingWizard } from "@/components/BookingWizard";
import { query } from "@/lib/db";
import type { PublicLocation, PublicRentalPlan, PublicVehicleModel } from "@/components/FleetShowcase";

export const metadata: Metadata = {
  title: "EV Rentals & Booking Request",
  description:
    "Request a daily, weekly, monthly, or corporate electric two-wheeler rental with AURUM EV across active service hubs.",
};

export const dynamic = "force-dynamic";

export default async function RentalsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; model?: string; city?: string }>;
}) {
  const sp = await searchParams;
  const [locationsRes, modelsRes, plansRes] = await Promise.all([
    query<PublicLocation>("SELECT id, city, state, hub_name FROM locations WHERE is_active = TRUE ORDER BY city ASC"),
    query<PublicVehicleModel>("SELECT * FROM vehicle_models WHERE is_published = TRUE ORDER BY created_at ASC"),
    query<PublicRentalPlan>("SELECT * FROM rental_plans WHERE is_active = TRUE ORDER BY duration_type ASC"),
  ]);

  const matchedLocation = sp.city
    ? locationsRes.rows.find(
        (loc) => loc.city.toLowerCase() === sp.city?.trim().toLowerCase()
      )
    : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F4F4]">
      <Navbar />
      <main className="flex-1 py-14 sm:py-20">
        <div className="aurum-container space-y-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#0667F4]">
              EV Rental Booking Workflow
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-[#0F0F0F] sm:text-5xl">
              Rent an Electric Two-Wheeler.
            </h1>
            <p className="mt-3 text-base text-[#666666] sm:text-lg">
              Choose your preferred city hub, vehicle category, and rental duration. All booking
              requests are reviewed for fleet availability and verification before confirmation.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            <div id="book" className="lg:col-span-8">
              <BookingWizard
                locations={locationsRes.rows}
                models={modelsRes.rows}
                plans={plansRes.rows}
                initialCategory={sp.category || "commuter"}
                initialModelId={sp.model || ""}
                initialLocationId={matchedLocation?.id || ""}
              />
            </div>

            <aside className="space-y-6 lg:col-span-4">
              <div className="aurum-card">
                <h2 className="font-display text-lg font-semibold text-[#0F0F0F]">
                  Available Rental Plans
                </h2>
                <div className="mt-4 space-y-3">
                  {plansRes.rows.map((p) => (
                    <div key={p.id} className="rounded-2xl bg-[#F4F4F4] p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-[#0F0F0F]">{p.plan_name}</span>
                        <span className="rounded-full bg-[#0F0F0F] px-2.5 py-0.5 text-[10px] font-semibold uppercase text-[#FCAA30]">
                          {p.duration_type.replace("_", " ")}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-[#666666]">
                        {p.pricing_approved && p.base_rate
                          ? `Approved Tariff: INR ${Number(p.base_rate).toLocaleString("en-IN")}`
                          : "Commercial tariff confirmed upon hub & vehicle allocation."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-[#0F0F0F] p-7 text-white">
                <h3 className="font-display text-lg font-semibold text-[#FCAA30]">
                  Transparent Verification
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#B6B8B9]">
                  Every rental request is checked against real-time fleet availability before
                  confirmation and vehicle handover.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
