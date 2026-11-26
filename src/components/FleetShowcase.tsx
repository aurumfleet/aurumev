"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { BatteryCharging, Gauge, MapPin, Filter, X, ArrowRight, ShieldCheck } from "lucide-react";

export interface PublicVehicleModel {
  id: string;
  brand: string;
  model_name: string;
  category: string;
  battery_type: string | null;
  battery_capacity_kwh: number | string | null;
  claimed_range_km: number | null;
  top_speed_kmph: number | null;
  charging_time_hours: number | string | null;
  image_url: string | null;
  specs_verified: boolean;
  description: string | null;
}

export interface PublicLocation {
  id: string;
  city: string;
  state: string;
  hub_name: string;
}

export interface PublicRentalPlan {
  id: string;
  plan_name: string;
  duration_type: string;
  category: string;
  location_id: string | null;
  base_rate: number | string | null;
  pricing_approved: boolean;
}

interface FleetShowcaseProps {
  models: PublicVehicleModel[];
  locations: PublicLocation[];
  plans: PublicRentalPlan[];
  availableCountByModel?: Record<string, number>;
}

export function FleetShowcase({
  models,
  locations,
  plans,
  availableCountByModel = {},
}: FleetShowcaseProps) {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [selectedModel, setSelectedModel] = useState<PublicVehicleModel | null>(null);

  const filtered = useMemo(() => {
    return models.filter((m) => {
      if (categoryFilter !== "all" && m.category !== categoryFilter) return false;
      const availCount = availableCountByModel[m.id] ?? 0;
      if (availabilityFilter === "available" && availCount <= 0) return false;
      if (durationFilter !== "all") {
        const hasPlan = plans.some(
          (p) => p.duration_type === durationFilter && (p.category === m.category || p.category === "all")
        );
        if (!hasPlan) return false;
      }
      if (locationFilter !== "all") {
        const hasLocPlan = plans.some((p) => !p.location_id || p.location_id === locationFilter);
        if (!hasLocPlan) return false;
      }
      return true;
    });
  }, [models, categoryFilter, durationFilter, locationFilter, availabilityFilter, availableCountByModel, plans]);

  const approvedPlanFor = (cat: string) =>
    plans.find((p) => p.category === cat && p.pricing_approved && p.base_rate != null);

  return (
    <div>
      {/* Sleek Filter Bar */}
      <div className="mb-10 grid gap-4 rounded-3xl bg-[#F4F4F4] p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#666666]">
            <Filter className="h-3.5 w-3.5 text-[#0F0F0F]" />
            Vehicle Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-2xl border border-[#0F0F0F]/10 bg-white px-4 py-2.5 text-sm text-[#0F0F0F] focus:outline-none focus:ring-2 focus:ring-[#FCAA30]"
          >
            <option value="all">All Categories</option>
            <option value="commuter">Commuter</option>
            <option value="delivery">Delivery Partner</option>
            <option value="corporate">Corporate Fleet</option>
            <option value="high_speed">High Speed</option>
            <option value="cargo">Cargo EV</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#666666]">
            Rental Duration
          </label>
          <select
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
            className="w-full rounded-2xl border border-[#0F0F0F]/10 bg-white px-4 py-2.5 text-sm text-[#0F0F0F] focus:outline-none focus:ring-2 focus:ring-[#FCAA30]"
          >
            <option value="all">All Durations</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="long_term_corporate">Long-Term Corporate</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#666666]">
            <MapPin className="h-3.5 w-3.5 text-[#0667F4]" />
            Location
          </label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full rounded-2xl border border-[#0F0F0F]/10 bg-white px-4 py-2.5 text-sm text-[#0F0F0F] focus:outline-none focus:ring-2 focus:ring-[#FCAA30]"
          >
            <option value="all">All Service Cities</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.city} — {loc.hub_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#666666]">
            Availability
          </label>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="w-full rounded-2xl border border-[#0F0F0F]/10 bg-white px-4 py-2.5 text-sm text-[#0F0F0F] focus:outline-none focus:ring-2 focus:ring-[#FCAA30]"
          >
            <option value="all">All Listings</option>
            <option value="available">Units Ready Now</option>
          </select>
        </div>
      </div>

      {/* Vehicle Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-[#F4F4F4] p-12 text-center">
          <p className="font-display text-lg font-medium text-[#0F0F0F]">
            No fleet models match the selected filters.
          </p>
          <p className="mt-2 text-sm text-[#666666]">
            Reset filters or submit an enquiry for custom city or fleet availability.
          </p>
          <button
            type="button"
            onClick={() => {
              setCategoryFilter("all");
              setDurationFilter("all");
              setLocationFilter("all");
              setAvailabilityFilter("all");
            }}
            className="aurum-pill-dark mt-5"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((model) => {
            const availUnits = availableCountByModel[model.id] ?? 0;
            const approvedPlan = approvedPlanFor(model.category);
            const imgSrc =
              model.category === "commuter"
                ? "/images/studio-ev-scooter.jpg"
                : model.image_url || "/images/studio-ev-scooter.jpg";

            return (
              <article
                key={model.id}
                className="bg-se-card-gradient group flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 hover:shadow-elevated"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0F0F0F]">
                      {model.category.replace("_", " ")}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                        availUnits > 0
                          ? "bg-[#C2F7C8] text-[#13B75E]"
                          : "bg-white/90 text-[#666666]"
                      }`}
                    >
                      {availUnits > 0 ? `${availUnits} Ready` : "On Request"}
                    </span>
                  </div>

                  <div className="relative my-5 aspect-[16/10] w-full overflow-hidden rounded-2xl">
                    <Image
                      src={imgSrc}
                      alt={`${model.brand} ${model.model_name}`}
                      fill
                      className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                        imgSrc.includes("studio") ? "mix-blend-multiply" : ""
                      }`}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[#666666]">
                    {model.brand}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-medium tracking-[-0.02em] text-[#0F0F0F]">
                    {model.model_name}
                  </h3>

                  {model.specs_verified ? (
                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-white/80 p-3 text-xs">
                      <div className="flex items-center gap-2">
                        <BatteryCharging className="h-4 w-4 text-[#0667F4]" />
                        <span>
                          {model.battery_capacity_kwh
                            ? `${model.battery_capacity_kwh} kWh`
                            : "Verified Battery"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-[#0667F4]" />
                        <span>
                          {model.claimed_range_km
                            ? `${model.claimed_range_km} km Range`
                            : "Verified Range"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl bg-white/75 p-3 text-xs text-[#666666]">
                      <span className="font-semibold text-[#0F0F0F]">
                        Vehicle details coming soon
                      </span>{" "}
                      — verified battery and range specs are published once onboarded.
                    </div>
                  )}

                  <p className="mt-3 line-clamp-2 text-sm text-[#666666]">
                    {model.description || "Electric two-wheeler solution managed by Aurum Fleet Solutions."}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#0F0F0F]/10 pt-4">
                  <div className="mb-4 flex items-baseline justify-between">
                    <span className="text-xs font-medium text-[#666666]">Rental Tariff</span>
                    {approvedPlan ? (
                      <span className="font-display text-base font-semibold text-[#0F0F0F]">
                        INR {Number(approvedPlan.base_rate).toLocaleString("en-IN")} /{" "}
                        {approvedPlan.duration_type}
                      </span>
                    ) : (
                      <span className="rounded-full border border-[#828587]/60 px-3 py-1 text-xs font-medium text-[#0F0F0F]">
                        Quoted on Request
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedModel(model)}
                      className="aurum-pill-light py-2.5 text-xs"
                    >
                      View Details
                    </button>
                    <Link
                      href={`/rentals?category=${model.category}&model=${model.id}#book`}
                      className="aurum-pill-dark py-2.5 text-xs"
                    >
                      Enquire Now
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selectedModel && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-elevated sm:p-8">
            <button
              type="button"
              onClick={() => setSelectedModel(null)}
              aria-label="Close vehicle details"
              className="absolute right-4 top-4 rounded-full bg-[#F4F4F4] p-2 text-[#0F0F0F] hover:bg-[#EBEBEB]"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="text-xs font-semibold uppercase tracking-widest text-[#666666]">
              {selectedModel.brand}
            </p>
            <h3 className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em] text-[#0F0F0F]">
              {selectedModel.model_name}
            </h3>

            {selectedModel.specs_verified ? (
              <dl className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-[#F4F4F4] p-4 text-sm">
                <div>
                  <dt className="text-xs text-[#666666]">Battery Type</dt>
                  <dd className="font-semibold text-[#0F0F0F]">{selectedModel.battery_type || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#666666]">Battery Capacity</dt>
                  <dd className="font-semibold text-[#0F0F0F]">
                    {selectedModel.battery_capacity_kwh ? `${selectedModel.battery_capacity_kwh} kWh` : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#666666]">Verified Range</dt>
                  <dd className="font-semibold text-[#0F0F0F]">
                    {selectedModel.claimed_range_km ? `${selectedModel.claimed_range_km} km` : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#666666]">Top Speed</dt>
                  <dd className="font-semibold text-[#0F0F0F]">
                    {selectedModel.top_speed_kmph ? `${selectedModel.top_speed_kmph} km/h` : "—"}
                  </dd>
                </div>
              </dl>
            ) : (
              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#F4F4F4] p-4 text-sm text-[#1F1F1F]">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0667F4]" />
                <div>
                  <p className="font-semibold text-[#0F0F0F]">Vehicle details coming soon</p>
                  <p className="mt-1 text-xs text-[#666666]">
                    Aurum EV publishes exact battery capacity, homologated range, and rental tariffs
                    only after model verification by our fleet engineering team.
                  </p>
                </div>
              </div>
            )}

            <p className="mt-4 text-sm leading-relaxed text-[#666666]">
              {selectedModel.description}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedModel(null)}
                className="aurum-pill-soft"
              >
                Close
              </button>
              <Link
                href={`/rentals?category=${selectedModel.category}&model=${selectedModel.id}#book`}
                className="aurum-pill-mango"
              >
                Request Rental
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
