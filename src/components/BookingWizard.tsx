"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Calendar, MapPin, ShieldCheck } from "lucide-react";
import type { PublicLocation, PublicRentalPlan, PublicVehicleModel } from "./FleetShowcase";
import { trackAnalyticsEvent } from "@/lib/analytics";

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
  initialCategory = "commuter",
  initialModelId = "",
  initialLocationId = "",
}: BookingWizardProps) {
  const today = new Date().toISOString().slice(0, 10);
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const [locationId, setLocationId] = useState(initialLocationId || locations[0]?.id || "");
  const [vehicleCategory, setVehicleCategory] = useState(initialCategory);
  const [vehicleModelId, setVehicleModelId] = useState(initialModelId);
  const [durationType, setDurationType] = useState<"daily" | "weekly" | "monthly" | "long_term_corporate">("monthly");
  const [rentalPlanId, setRentalPlanId] = useState("");
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
  } | null>(null);

  const matchingPlans = plans.filter((p) => p.duration_type === durationType);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
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
          notes,
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
        setSubmittedBooking(data.booking);
      }
    } catch {
      setError("Network error while submitting booking request.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedBooking) {
    return (
      <div className="aurum-card border-[#15865B]/40 bg-[#15865B]/5 p-8">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="h-8 w-8 shrink-0 text-[#15865B]" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#15865B]">
              Booking Request Logged
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold text-[#101D35]">
              Reference: {submittedBooking.booking_number}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#747D8B]">
              Thank you for your rental enquiry. Our Aurum EV operations team will verify vehicle
              availability and reach out with your confirmation and documentation details.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setSubmittedBooking(null)}
                className="aurum-btn-primary"
              >
                Submit Another Request
              </button>
              <Link href="/contact" className="aurum-btn-outline">
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="aurum-card space-y-6 p-6 sm:p-8">
      <div className="border-b border-[#101D35]/10 pb-4">
        <h3 className="font-display text-2xl font-bold text-[#101D35]">
          Request an EV Rental Booking
        </h3>
        <p className="mt-1 text-sm text-[#747D8B]">
          Complete your location, plan, and dates below. Availability and final pricing are verified
          by our operations team prior to handover.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-lg bg-[#D94B4B]/10 p-3.5 text-sm text-[#D94B4B]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="aurum-label flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#C69A43]" />
            1. City / Service Hub *
          </label>
          <select
            required
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="aurum-input"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.city} — {loc.hub_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="aurum-label">2. Vehicle Category *</label>
          <select
            value={vehicleCategory}
            onChange={(e) => setVehicleCategory(e.target.value)}
            className="aurum-input"
          >
            <option value="commuter">Individual Commuter EV</option>
            <option value="delivery">Delivery Partner EV</option>
            <option value="corporate">Corporate Fleet EV</option>
            <option value="high_speed">High-Speed EV</option>
            <option value="cargo">Cargo EV</option>
          </select>
        </div>

        <div>
          <label className="aurum-label">Preferred Fleet Model (Optional)</label>
          <select
            value={vehicleModelId}
            onChange={(e) => setVehicleModelId(e.target.value)}
            className="aurum-input"
          >
            <option value="">Any Available Model in Category</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.brand} — {m.model_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="aurum-label">3. Rental Duration *</label>
          <select
            value={durationType}
            onChange={(e) => setDurationType(e.target.value as typeof durationType)}
            className="aurum-input"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="long_term_corporate">Long-Term Corporate</option>
          </select>
        </div>

        {matchingPlans.length > 0 && (
          <div className="sm:col-span-2">
            <label className="aurum-label">Select Rental Plan</label>
            <select
              value={rentalPlanId}
              onChange={(e) => setRentalPlanId(e.target.value)}
              className="aurum-input"
            >
              <option value="">Standard Plan (Tariff confirmed by Operations)</option>
              {matchingPlans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.plan_name}{" "}
                  {p.pricing_approved && p.base_rate
                    ? `(INR ${p.base_rate})`
                    : "(Quote upon verification)"}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="aurum-label flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#C69A43]" />
            4. Start Date *
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
            <Calendar className="h-3.5 w-3.5 text-[#C69A43]" />
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

      <div className="border-t border-[#101D35]/10 pt-5">
        <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-[#101D35]">
          5. Applicant Contact Details
        </h4>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="aurum-label">Full Name *</label>
            <input
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Applicant full name"
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
          <div>
            <label className="aurum-label">Mobile Number *</label>
            <input
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+91 98XXXXXXXX"
              className="aurum-input"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="aurum-label">Additional Notes (Optional)</label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Delivery partner platform, shift timings, or corporate fleet notes..."
          className="aurum-input"
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-[#20252E]">
        <input
          type="checkbox"
          required
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-[#101D35]/30 accent-[#101D35]"
        />
        <span>
          I agree to the{" "}
          <Link href="/rental-policy" className="font-semibold text-[#101D35] underline">
            Aurum EV Rental Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms-and-conditions" className="font-semibold text-[#101D35] underline">
            Terms & Conditions
          </Link>
          , and acknowledge that booking confirmation depends on vehicle availability & verification.
        </span>
      </label>

      <button type="submit" disabled={submitting} className="aurum-btn-primary w-full py-3.5">
        <ShieldCheck className="h-4 w-4 text-[#E9CC86]" />
        {submitting ? "Submitting Rental Request..." : "Submit Rental Request"}
      </button>
    </form>
  );
}
