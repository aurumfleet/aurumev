"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { PublicLocation, PublicRentalPlan, PublicVehicleModel } from "./FleetShowcase";
import { trackAnalyticsEvent } from "@/lib/analytics";

const WHATSAPP_LEAD_NUMBER = "917779990277";

const DELIVERY_PLATFORMS = [
  "Blinkit",
  "Zepto",
  "Swiggy",
  "Zomato",
  "Rapido",
  "Porter",
  "BigBasket",
  "JioMart",
  "Flipkart Minutes",
  "Personal / Other",
] as const;

const RIDER_CATEGORIES = [
  { value: "delivery", label: "Delivery Partner EV", sub: "Blinkit, Zepto, Swiggy, Zomato & more" },
  { value: "commuter", label: "Daily Commuter EV", sub: "Personal office & city travel" },
  { value: "corporate", label: "Corporate / B2B Fleet", sub: "Multi-rider business deployment" },
] as const;

const DURATION_OPTIONS = [
  { value: "weekly" as const, label: "Weekly Plan", tag: "Rider Popular" },
  { value: "monthly" as const, label: "Monthly Plan", tag: "Best Value" },
  { value: "daily" as const, label: "Daily Plan", tag: "Short Trial" },
  { value: "long_term_corporate" as const, label: "Long-Term Fleet", tag: "B2B" },
];

interface BookingWizardProps {
  locations: PublicLocation[];
  models: PublicVehicleModel[];
  plans: PublicRentalPlan[];
  initialCategory?: string;
  initialModelId?: string;
  initialLocationId?: string;
}

export function BookingWizard({
  locations,
  models,
  plans,
  initialCategory = "delivery",
  initialModelId = "",
  initialLocationId = "",
}: BookingWizardProps) {
  const today = new Date().toISOString().slice(0, 10);
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const [locationId, setLocationId] = useState(initialLocationId || locations[0]?.id || "");
  const [vehicleCategory, setVehicleCategory] = useState(initialCategory);
  const [vehicleModelId, setVehicleModelId] = useState(initialModelId);
  const [durationType, setDurationType] = useState<
    "daily" | "weekly" | "monthly" | "long_term_corporate"
  >("weekly");
  const [rentalPlanId, setRentalPlanId] = useState("");
  const [deliveryPlatform, setDeliveryPlatform] = useState<string>("Blinkit");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(nextWeek);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<{
    booking_number: string;
    status: string;
    waUrl: string;
  } | null>(null);

  const selectedLocation = locations.find((l) => l.id === locationId) ?? locations[0];
  const matchingPlans = plans.filter((p) => p.duration_type === durationType);

  function buildWhatsAppUrl(bookingNumber?: string): string {
    const cityLabel = selectedLocation
      ? `${selectedLocation.city} (${selectedLocation.hub_name})`
      : "Delhi / Noida";
    const lines = [
      "*AURUM EV — Rider Rental Request*",
      bookingNumber ? `Ref: ${bookingNumber}` : "Source: Website Instant WhatsApp Lead",
      `City Hub: ${cityLabel}`,
      `Category: ${vehicleCategory === "delivery" ? "Delivery Partner EV" : vehicleCategory}`,
      vehicleCategory === "delivery" ? `Platform: ${deliveryPlatform}` : null,
      `Duration: ${durationType.replace("_", " ")}`,
      `Start Date: ${startDate}`,
      `End Date: ${endDate}`,
      customerName ? `Rider Name: ${customerName}` : null,
      customerPhone ? `Mobile: ${customerPhone}` : null,
      customerEmail ? `Email: ${customerEmail}` : null,
      notes ? `Notes: ${notes}` : null,
    ].filter(Boolean);
    return `https://wa.me/${WHATSAPP_LEAD_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const combinedNotes = [
      vehicleCategory === "delivery" ? `Platform: ${deliveryPlatform}` : null,
      notes.trim() || null,
    ]
      .filter(Boolean)
      .join(" | ");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId,
          vehicleModelId: vehicleModelId || null,
          rentalPlanId: rentalPlanId || null,
          vehicleCategory,
          durationType,
          startDate,
          endDate,
          customerName,
          customerEmail,
          customerPhone,
          termsAccepted,
          notes: combinedNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit booking request.");
      } else {
        trackAnalyticsEvent("booking_request_submit", {
          vehicle_category: vehicleCategory,
          duration_type: durationType,
        });
        const waUrl = buildWhatsAppUrl(data.booking.booking_number);
        setSubmittedBooking({
          booking_number: data.booking.booking_number,
          status: data.booking.status,
          waUrl,
        });
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      setError("Network error while submitting booking request.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedBooking) {
    return (
      <div className="rounded-[2rem] bg-[linear-gradient(135deg,#FFFFFF_0%,#94A3B8_25%,#FFFFFF_55%,#FCAA30_85%,#CBD5E1_100%)] p-[1.5px] shadow-[0_24px_65px_rgba(15,15,15,0.08)]">
        <div className="rounded-[calc(2rem-1.5px)] bg-white p-8 sm:p-10">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#13B75E]/15 text-[#13B75E]">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#13B75E]">
                Rider Request Submitted
              </p>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-[#0F0F0F] sm:text-3xl">
                Reference: {submittedBooking.booking_number}
              </h3>
              <p className="text-sm leading-relaxed text-[#52525B]">
                Your request for{" "}
                <strong className="text-[#0F0F0F]">
                  {selectedLocation?.city ?? "Delhi / Noida"}
                </strong>{" "}
                has been saved. Click below to send this booking directly on WhatsApp (
                <strong className="text-[#0F0F0F]">+91 77799 90277</strong>) for fast hub
                confirmation and KYC handover.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={submittedBooking.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#13B75E] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#0fa352]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Send Details on WhatsApp (7779990277)
                </a>
                <button
                  type="button"
                  onClick={() => setSubmittedBooking(null)}
                  className="rounded-full border border-[#0F0F0F]/15 bg-[#F8F9FA] px-5 py-3 text-sm font-semibold text-[#0F0F0F] transition hover:bg-[#EBEBEB]"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] bg-[linear-gradient(135deg,#FFFFFF_0%,#CBD5E1_24%,#FFFFFF_52%,#FCAA30_78%,#94A3B8_100%)] p-[1.5px] shadow-[0_24px_70px_rgba(15,15,15,0.08)]">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-[calc(2rem-1.5px)] bg-white p-6 sm:p-8"
      >
        {/* Header */}
        <div className="flex flex-col justify-between gap-3 border-b border-[#0F0F0F]/10 pb-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9E7524]">
              Delhi &amp; Noida Rider Onboarding
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-[#0F0F0F]">
              Book Your EV Rental
            </h2>
          </div>
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-full border border-[#13B75E]/35 bg-[#13B75E]/10 px-4 py-2 text-xs font-semibold text-[#0E8F49] transition hover:bg-[#13B75E] hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp: 7779990277
          </a>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-[#D94B4B]/10 p-4 text-sm text-[#D94B4B]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Choose Hub (Delhi / Noida) */}
        <div>
          <label className="aurum-label flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#9E7524]" />
            1. Select Service Hub (Delhi / Noida) *
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            {locations.map((loc) => {
              const selected = loc.id === locationId;
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setLocationId(loc.id)}
                  className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                    selected
                      ? "border-[#FCAA30] bg-[#FAF7F0] shadow-[0_10px_25px_rgba(252,170,48,0.14)]"
                      : "border-[#0F0F0F]/10 bg-[#F8F9FA] hover:border-[#0F0F0F]/25"
                  }`}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="font-display text-base font-semibold text-[#0F0F0F]">
                      {loc.city}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        selected
                          ? "bg-[#0F0F0F] text-[#FCAA30]"
                          : "bg-white text-[#666666]"
                      }`}
                    >
                      {loc.hub_name}
                    </span>
                  </div>
                  {loc.address && (
                    <span className="mt-1.5 text-xs leading-relaxed text-[#666666]">
                      {loc.address}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Rider Purpose / Category */}
        <div>
          <label className="aurum-label flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-[#9E7524]" />
            2. Rider Category *
          </label>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {RIDER_CATEGORIES.map((cat) => {
              const active = vehicleCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setVehicleCategory(cat.value)}
                  className={`rounded-2xl border p-3.5 text-left transition-all ${
                    active
                      ? "border-[#0F0F0F] bg-[#0F0F0F] text-white shadow-md"
                      : "border-[#0F0F0F]/10 bg-[#F8F9FA] text-[#0F0F0F] hover:border-[#0F0F0F]/30"
                  }`}
                >
                  <p className="text-sm font-semibold">{cat.label}</p>
                  <p
                    className={`mt-1 text-[11px] ${
                      active ? "text-[#CBD5E1]" : "text-[#666666]"
                    }`}
                  >
                    {cat.sub}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2B: Delivery Platform (if delivery selected) */}
        {vehicleCategory === "delivery" && (
          <div>
            <label className="aurum-label">Delivery Platform You Ride With</label>
            <div className="flex flex-wrap gap-2">
              {DELIVERY_PLATFORMS.map((platform) => {
                const active = deliveryPlatform === platform;
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => setDeliveryPlatform(platform)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                      active
                        ? "border-[#FCAA30] bg-[#FCAA30] text-[#0F0F0F] shadow-sm"
                        : "border-[#0F0F0F]/12 bg-[#F8F9FA] text-[#475569] hover:border-[#0F0F0F]/30"
                    }`}
                  >
                    {platform}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Duration Pills */}
        <div>
          <label className="aurum-label">3. Rental Duration *</label>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {DURATION_OPTIONS.map((opt) => {
              const active = durationType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDurationType(opt.value)}
                  className={`rounded-2xl border p-3 text-left transition ${
                    active
                      ? "border-[#FCAA30] bg-[#FAF7F0] shadow-sm"
                      : "border-[#0F0F0F]/10 bg-[#F8F9FA] hover:border-[#0F0F0F]/25"
                  }`}
                >
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#9E7524]">
                    {opt.tag}
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold text-[#0F0F0F]">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Plan & Vehicle Model + Dates */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="aurum-label">Preferred Fleet Model (Optional)</label>
            <select
              value={vehicleModelId}
              onChange={(e) => setVehicleModelId(e.target.value)}
              className="aurum-input"
            >
              <option value="">Any Available Model at Hub</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.brand} — {m.model_name}
                </option>
              ))}
            </select>
          </div>

          {matchingPlans.length > 0 && (
            <div>
              <label className="aurum-label">Select Plan (Optional)</label>
              <select
                value={rentalPlanId}
                onChange={(e) => setRentalPlanId(e.target.value)}
                className="aurum-input"
              >
                <option value="">Standard Plan (Confirmed by Operations)</option>
                {matchingPlans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.plan_name}{" "}
                    {p.pricing_approved && p.base_rate
                      ? `(INR ${p.base_rate})`
                      : "(Confirm on call)"}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="aurum-label flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#9E7524]" />
              Start Date *
            </label>
            <input
              type="date"
              required
              min={today}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="aurum-input"
            />
          </div>

          <div>
            <label className="aurum-label flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#9E7524]" />
              End Date *
            </label>
            <input
              type="date"
              required
              min={startDate}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="aurum-input"
            />
          </div>
        </div>

        {/* Step 4: Rider Contact Details */}
        <div className="border-t border-[#0F0F0F]/10 pt-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#9E7524]">
            4. Rider Contact Details (For Hub &amp; WhatsApp Confirmation)
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="aurum-label">Full Name *</label>
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your full name"
                className="aurum-input"
              />
            </div>
            <div>
              <label className="aurum-label">Mobile / WhatsApp No. *</label>
              <input
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98XXXXXXXX"
                className="aurum-input"
              />
            </div>
            <div>
              <label className="aurum-label">Email Address *</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="name@example.com"
                className="aurum-input"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="aurum-label">Shift / Hub Notes (Optional)</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Preferred pickup sector in Delhi or Noida, shift timing, or questions..."
            className="aurum-input"
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-[#334155]">
          <input
            type="checkbox"
            required
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[#0F0F0F]/30 accent-[#0F0F0F]"
          />
          <span>
            I agree to the{" "}
            <Link href="/rental-policy" className="font-semibold text-[#0F0F0F] underline">
              Aurum EV Rental Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms-and-conditions" className="font-semibold text-[#0F0F0F] underline">
              Terms &amp; Conditions
            </Link>
            , and confirm availability will be verified by Aurum Operations before handover.
          </span>
        </label>

        {/* Submit & WhatsApp Dual Action */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={submitting}
            className="aurum-btn-primary flex-1 justify-center py-3.5"
          >
            <ShieldCheck className="h-4 w-4 text-[#FCAA30]" />
            {submitting
              ? "Submitting Request..."
              : "Submit & Send Lead on WhatsApp"}
          </button>

          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#13B75E] bg-[#13B75E]/10 px-6 py-3.5 text-sm font-semibold text-[#0E8F49] transition hover:bg-[#13B75E] hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
            Direct WhatsApp (7779990277)
          </a>
        </div>
      </form>
    </div>
  );
}
