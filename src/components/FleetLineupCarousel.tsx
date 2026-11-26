"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { PublicVehicleModel, PublicRentalPlan } from "./FleetShowcase";

export function FleetLineupCarousel({
  models,
  plans,
  availableCountByModel,
}: {
  models: PublicVehicleModel[];
  plans: PublicRentalPlan[];
  availableCountByModel: Record<string, number>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(dir: -1 | 1) {
    if (!trackRef.current) return;
    const step = Math.min(520, trackRef.current.clientWidth * 0.85);
    trackRef.current.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <section className="py-20 sm:py-28">
      <div className="aurum-container">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#666666]">
              Electric Two-Wheeler Lineup
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] text-[#0F0F0F] sm:text-[56px] sm:leading-[1.05]">
              Choose your electric <span className="text-[#828587]">ride.</span>
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous fleet model"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0F0F0F] transition hover:bg-[#EBEBEB]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next fleet model"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0F0F0F] transition hover:bg-[#EBEBEB]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll-Snap Track */}
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 sm:px-8 lg:px-10"
      >
        {models.map((m) => {
          const avail = availableCountByModel[m.id] ?? 0;
          const approvedPlan = plans.find(
            (p) => p.category === m.category && p.pricing_approved && p.base_rate != null
          );
          const cleanImage =
            m.category === "commuter" ? "/images/studio-ev-scooter.jpg" : m.image_url || "/images/studio-ev-scooter.jpg";

          return (
            <article
              key={m.id}
              className="bg-se-card-gradient group flex w-[calc(100vw-40px)] shrink-0 snap-center flex-col justify-between rounded-3xl p-7 transition-transform duration-300 sm:w-[460px] lg:w-[500px] lg:p-9"
            >
              <div className="text-center">
                <div className="flex justify-center">
                  <span
                    className={`rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                      avail > 0
                        ? "bg-[#C2F7C8] text-[#13B75E]"
                        : "bg-white text-[#0F0F0F]"
                    }`}
                  >
                    {avail > 0 ? `${avail} Ready` : m.category.replace("_", " ")}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-3xl font-medium tracking-[-0.03em] text-[#0F0F0F] sm:text-4xl">
                  {m.model_name.replace(" (Specifications Pending)", "")}
                </h3>
                <p className="mt-1.5 text-sm text-[#666666]">{m.brand}</p>

                <div className="mt-4 inline-block rounded-[40px] border border-[#828587]/60 px-3.5 py-1.5 text-xs font-medium text-[#1F1F1F]">
                  {approvedPlan
                    ? `INR ${Number(approvedPlan.base_rate).toLocaleString("en-IN")} / ${approvedPlan.duration_type}`
                    : "Tariff Quoted on Request"}
                </div>
              </div>

              <div className="relative my-6 aspect-[16/10] w-full overflow-hidden rounded-2xl">
                <Image
                  src={cleanImage}
                  alt={`${m.brand} ${m.model_name}`}
                  fill
                  className={`object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
                    cleanImage.includes("studio") ? "mix-blend-multiply" : ""
                  }`}
                  sizes="(max-width: 640px) 90vw, 480px"
                />
              </div>

              <div>
                <div className="grid grid-cols-3 gap-2 border-t border-[#0F0F0F]/10 pt-5 text-center">
                  <div>
                    <p className="text-[11px] font-medium text-[#666666]">Battery</p>
                    <p className="mt-1 font-display text-lg font-medium text-[#0F0F0F]">
                      {m.specs_verified && m.battery_capacity_kwh
                        ? `${m.battery_capacity_kwh} kWh`
                        : "Soon"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[#666666]">Verified Range</p>
                    <p className="mt-1 font-display text-lg font-medium text-[#0F0F0F]">
                      {m.specs_verified && m.claimed_range_km ? `${m.claimed_range_km} km` : "Soon"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[#666666]">Plans</p>
                    <p className="mt-1 font-display text-lg font-medium text-[#0F0F0F]">
                      Flex
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Link href="/fleet" className="aurum-pill-light py-3 text-xs sm:text-sm">
                    View Specs
                  </Link>
                  <Link
                    href={`/rentals?category=${m.category}&model=${m.id}#book`}
                    className="aurum-pill-dark py-3 text-xs sm:text-sm"
                  >
                    Book EV
                  </Link>
                </div>
              </div>
            </article>
          );
        })}

        {/* Final Compare & Explore Card matching Simple Energy carousel end */}
        <Link
          href="/fleet"
          className="flex w-[calc(100vw-40px)] shrink-0 snap-center flex-col items-center justify-center rounded-3xl bg-[#F4F4F4] p-10 text-center transition hover:bg-[#EBEBEB] sm:w-[380px]"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0F0F0F] text-white">
            <ArrowRight className="h-6 w-6" />
          </span>
          <h3 className="mt-5 font-display text-2xl font-medium tracking-[-0.03em] text-[#0F0F0F]">
            Explore full fleet catalogue
          </h3>
          <p className="mt-2 text-sm text-[#666666]">
            Filter by city hub, duration, and vehicle category.
          </p>
        </Link>
      </div>
    </section>
  );
}
