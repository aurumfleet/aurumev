import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FleetShowcase, type PublicLocation, type PublicRentalPlan, type PublicVehicleModel } from "@/components/FleetShowcase";
import { query } from "@/lib/db";

export const metadata: Metadata = {
  title: "Our Electric Fleet",
  description:
    "Browse electric two-wheeler models, availability status, and city hubs operated by Aurum EV.",
};

export const dynamic = "force-dynamic";

export default async function FleetPage() {
  const [locationsRes, modelsRes, plansRes, vehiclesCountRes] = await Promise.all([
    query<PublicLocation>("SELECT id, city, state, hub_name FROM locations WHERE is_active = TRUE ORDER BY city ASC"),
    query<PublicVehicleModel>("SELECT * FROM vehicle_models WHERE is_published = TRUE ORDER BY created_at ASC"),
    query<PublicRentalPlan>("SELECT * FROM rental_plans WHERE is_active = TRUE"),
    query<{ model_id: string; cnt: string }>(
      "SELECT model_id, COUNT(*)::text AS cnt FROM vehicles WHERE status = 'available' AND model_id IS NOT NULL GROUP BY model_id"
    ),
  ]);

  const availableCountByModel: Record<string, number> = {};
  for (const row of vehiclesCountRes.rows) {
    availableCountByModel[row.model_id] = Number(row.cnt);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1 py-14 sm:py-20">
        <div className="aurum-container">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#0667F4]">
              Aurum Fleet Catalogue
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-[#0F0F0F] sm:text-5xl">
              Our Electric Two-Wheeler Fleet.
            </h1>
            <p className="mt-3 text-base text-[#666666] sm:text-lg">
              Filter by category, duration, location, and real-time hub availability. Specifications
              and rental tariffs are displayed only after engineering and commercial verification.
            </p>
          </div>
          <FleetShowcase
            models={modelsRes.rows}
            locations={locationsRes.rows}
            plans={plansRes.rows}
            availableCountByModel={availableCountByModel}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
