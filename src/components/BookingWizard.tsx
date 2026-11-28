"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, MapPin, MessageCircle, Send } from "lucide-react";
import type { PublicLocation, PublicRentalPlan, PublicVehicleModel } from "./FleetShowcase";
import { trackAnalyticsEvent } from "@/lib/analytics";

const WHATSAPP_LEAD_NUMBER = "917779990277";

interface BookingWizardProps {
  locations: PublicLocation[];
  models?: PublicVehicleModel[];
  plans?: PublicRentalPlan[];
  initialCategory?: string;
  initialModelId?: string;
  initialLocationId?: string;
}

export function BookingWizard({
  locations,
  initialLocationId = "",
}: BookingWizardProps) {
  const initialCity =
    locations.find((l) => l.id === initialLocationId)?.city ||
    locations[0]?.city ||
    "Delhi";

  const [city, setCity] = useState<string>(initialCity);
  const [plan, setPlan] = useState<"Weekly" | "Monthly">("Weekly");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [platform, setPlatform] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{
    leadCode: string;
    waUrl: string;
  } | null>(null);

  const cityChoices =
    locations.length > 0
      ? Array.from(new Set(locations.map((l) => l.city)))
      : ["Delhi", "Noida"];

  function buildWhatsAppUrl(leadCode?: string): string {
    const lines = [
      "Hi AURUM EV Team, I want to rent an EV scooter:",
      leadCode ? `Ref: ${leadCode}` : null,
      fullName ? `Name: ${fullName}` : null,
      phone ? `Mobile: ${phone}` : null,
      `City: ${city}`,
      `Plan: ${plan}`,
      platform ? `Work / App: ${platform}` : null,
    ].filter(Boolean);
    return `https://wa.me/${WHATSAPP_LEAD_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const requirement = `${plan} EV Rental in ${city}${platform.trim() ? ` (${platform.trim()})` : ""}`;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          city,
          leadCategory: "delivery_partner",
          source: "website",
          requirement,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Please check your name and mobile number.");
      } else {
        trackAnalyticsEvent("booking_request_submit", {
          city,
          plan,
        });
        const waUrl = buildWhatsAppUrl(data.leadCode);
        setSubmitted({ leadCode: data.leadCode, waUrl });
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      setError("Network error. Please try again or contact WhatsApp directly.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-[2rem] bg-[linear-gradient(135deg,#FFFFFF_0%,#94A3B8_25%,#FFFFFF_55%,#FCAA30_85%,#CBD5E1_100%)] p-[1.5px] shadow-[0_20px_55px_rgba(15,15,15,0.08)]">
        <div className="rounded-[calc(2rem-1.5px)] bg-white p-7 sm:p-9">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#13B75E]/15 text-[#13B75E]">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#13B75E]">
                Enquiry Received
              </p>
              <h3 className="font-display text-2xl font-semibold text-[#0F0F0F]">
                Reference: {submitted.leadCode}
              </h3>
              <p className="text-sm text-[#52525B]">
                Thank you! Tap below if WhatsApp did not open automatically to send your details to{" "}
                <strong className="text-[#0F0F0F]">+91 77799 90277</strong>.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href={submitted.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#13B75E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0fa352]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Send on WhatsApp (7779990277)
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(null);
                    setFullName("");
                    setPhone("");
                    setPlatform("");
                  }}
                  className="rounded-full border border-[#0F0F0F]/15 bg-[#F8F9FA] px-5 py-3 text-sm font-semibold text-[#0F0F0F] transition hover:bg-[#EBEBEB]"
                >
                  New Enquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] bg-[linear-gradient(135deg,#FFFFFF_0%,#CBD5E1_24%,#FFFFFF_52%,#FCAA30_78%,#94A3B8_100%)] p-[1.5px] shadow-[0_20px_60px_rgba(15,15,15,0.08)]">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-[calc(2rem-1.5px)] bg-white p-6 sm:p-8"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9E7524]">
            Quick Rider Form · Delhi &amp; Noida
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-[#0F0F0F]">
            Apply for EV Rental
          </h2>
          <p className="mt-1 text-sm text-[#666666]">
            Bas 4 details fill karein — team aapse WhatsApp par connect karegi.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-[#D94B4B]/10 p-3.5 text-sm text-[#D94B4B]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* City Hub + Plan */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="aurum-label flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#9E7524]" />
              Select City *
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {cityChoices.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCity(c)}
                  className={`rounded-2xl border py-3 text-sm font-semibold transition ${
                    city === c
                      ? "border-[#0F0F0F] bg-[#0F0F0F] text-[#FCAA30] shadow-sm"
                      : "border-[#0F0F0F]/12 bg-[#F8F9FA] text-[#0F0F0F] hover:border-[#0F0F0F]/30"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="aurum-label">Rental Plan *</label>
            <div className="grid grid-cols-2 gap-2.5">
              {(["Weekly", "Monthly"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlan(p)}
                  className={`rounded-2xl border py-3 text-sm font-semibold transition ${
                    plan === p
                      ? "border-[#FCAA30] bg-[#FAF7F0] text-[#0F0F0F] shadow-sm"
                      : "border-[#0F0F0F]/12 bg-[#F8F9FA] text-[#0F0F0F] hover:border-[#0F0F0F]/30"
                  }`}
                >
                  {p} Plan
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Name & Mobile */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="aurum-label">Full Name *</label>
            <input
              required
              minLength={2}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Apna naam likhein"
              className="aurum-input"
            />
          </div>
          <div>
            <label className="aurum-label">Mobile / WhatsApp Number *</label>
            <input
              required
              minLength={8}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98XXXXXXXX"
              className="aurum-input"
            />
          </div>
        </div>

        {/* Optional Platform / Purpose */}
        <div>
          <label className="aurum-label">Delivery App / Use (Optional)</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="aurum-input"
          >
            <option value="">Select (Blinkit, Zepto, Swiggy, Zomato, Personal...)</option>
            <option value="Blinkit">Blinkit</option>
            <option value="Zepto">Zepto</option>
            <option value="Swiggy">Swiggy</option>
            <option value="Zomato">Zomato</option>
            <option value="Rapido">Rapido</option>
            <option value="Porter">Porter</option>
            <option value="BigBasket">BigBasket</option>
            <option value="JioMart">JioMart</option>
            <option value="Flipkart Minutes">Flipkart Minutes</option>
            <option value="Personal / Commute">Personal / Daily Commute</option>
          </select>
        </div>

        <div className="flex flex-col gap-3 pt-1 sm:flex-row">
          <button
            type="submit"
            disabled={submitting}
            className="aurum-btn-primary flex-1 justify-center py-3.5"
          >
            <Send className="h-4 w-4 text-[#FCAA30]" />
            {submitting ? "Sending..." : "Submit & Open WhatsApp"}
          </button>

          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#13B75E] bg-[#13B75E]/10 px-6 py-3.5 text-sm font-semibold text-[#0E8F49] transition hover:bg-[#13B75E] hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp: 7779990277
          </a>
        </div>
      </form>
    </div>
  );
}
