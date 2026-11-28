"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, MapPin, MessageCircle, Send } from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { AURUM_NCR_HUBS } from "@/data/hubs";

const WHATSAPP_LEAD_NUMBER = "917779990277";

interface LeadFormProps {
  defaultCategory?: "rental" | "delivery_partner" | "individual" | "corporate" | "investor";
  title?: string;
  subtitle?: string;
  source?: "website" | "business_partnerships";
  riderHubMode?: boolean;
  headingAs?: "h2" | "h3";
}

export function LeadForm({
  defaultCategory = "rental",
  title = "Send an Enquiry",
  subtitle = "Share your requirement and our team will respond with verified availability and options.",
  source = "website",
  riderHubMode = false,
  headingAs = "h3",
}: LeadFormProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState(riderHubMode ? "Delhi" : "Delhi");
  const [leadCategory, setLeadCategory] = useState(defaultCategory);
  const [requirement, setRequirement] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string; waUrl?: string } | null>(null);

  const activeHub = AURUM_NCR_HUBS.find((h) => h.city === city) ?? AURUM_NCR_HUBS[0];

  function buildWhatsAppUrl(leadCode?: string): string {
    const lines = [
      "Hi AURUM EV Team, I submitted an enquiry:",
      leadCode ? `Reference: ${leadCode}` : null,
      fullName ? `Name: ${fullName}` : null,
      phone ? `Mobile: ${phone}` : null,
      `City Hub: ${activeHub.city} (${activeHub.hub})`,
      `Category: ${leadCategory}`,
      requirement ? `Details: ${requirement}` : null,
    ].filter(Boolean);
    return `https://wa.me/${WHATSAPP_LEAD_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const effectiveRequirement =
      requirement.trim() || `${leadCategory} enquiry for ${activeHub.city} (${activeHub.hub})`;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email: riderHubMode ? "" : email,
          city,
          leadCategory,
          source,
          requirement: effectiveRequirement,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ ok: false, msg: data.error || "Unable to submit enquiry." });
      } else {
        trackAnalyticsEvent(
          leadCategory === "corporate" ? "business_enquiry_submit" : "rental_enquiry_submit",
          { category: leadCategory, city: city || "unspecified" }
        );
        const waUrl = buildWhatsAppUrl(data.leadCode);
        setResult({
          ok: true,
          msg: `${data.message} Reference: ${data.leadCode}`,
          waUrl,
        });
        window.open(waUrl, "_blank", "noopener,noreferrer");
        setFullName("");
        setPhone("");
        setEmail("");
        setRequirement("");
      }
    } catch {
      setResult({ ok: false, msg: "Network error while submitting enquiry." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="aurum-card space-y-4">
      <div>
        {headingAs === "h2" ? (
          <h2 className="font-display text-xl font-bold text-[#0F0F0F]">{title}</h2>
        ) : (
          <h3 className="font-display text-xl font-bold text-[#0F0F0F]">{title}</h3>
        )}
        <p className="mt-1 text-sm text-[#666666]">{subtitle}</p>
      </div>

      {result && (
        <div
          className={`flex items-start gap-2.5 rounded-xl p-3.5 text-sm ${
            result.ok ? "bg-[#15865B]/10 text-[#15865B]" : "bg-[#D94B4B]/10 text-[#D94B4B]"
          }`}
        >
          {result.ok ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <div className="space-y-2">
            <span>{result.msg}</span>
            {result.waUrl && (
              <div>
                <a
                  href={result.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#13B75E] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0fa352]"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Send Lead on WhatsApp (7779990277)
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delhi / Noida Location Hub Selector */}
      <div>
        <label className="aurum-label flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#9E7524]" />
          Select Hub Location *
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {AURUM_NCR_HUBS.map((hub) => {
            const active = city === hub.city;
            return (
              <button
                key={hub.city}
                type="button"
                onClick={() => setCity(hub.city)}
                className={`rounded-2xl border px-3.5 py-2.5 text-left transition ${
                  active
                    ? "border-[#0F0F0F] bg-[#0F0F0F] text-white shadow-sm"
                    : "border-[#0F0F0F]/12 bg-[#F8F9FA] text-[#0F0F0F] hover:border-[#0F0F0F]/30"
                }`}
              >
                <span
                  className={`block text-sm font-semibold ${
                    active ? "text-[#FCAA30]" : "text-[#0F0F0F]"
                  }`}
                >
                  {hub.city}
                </span>
                <span
                  className={`block truncate text-[11px] ${
                    active ? "text-[#CBD5E1]" : "text-[#666666]"
                  }`}
                >
                  {hub.hub}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-[11px] leading-snug text-[#666666]">
          <strong className="text-[#0F0F0F]">{activeHub.hub}:</strong> {activeHub.address}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="aurum-label">Full Name *</label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className="aurum-input"
          />
        </div>
        <div>
          <label className="aurum-label">Mobile / WhatsApp No. *</label>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98XXXXXXXX"
            className="aurum-input"
          />
        </div>
      </div>

      {!riderHubMode && (
        <>
          <div>
            <label className="aurum-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="aurum-input"
            />
          </div>

          <div>
            <label className="aurum-label">Enquiry Category</label>
            <select
              value={leadCategory}
              onChange={(e) => setLeadCategory(e.target.value as typeof leadCategory)}
              className="aurum-input"
            >
              <option value="rental">EV Rental</option>
              <option value="delivery_partner">Delivery Partner Plan</option>
              <option value="individual">Individual Commuter</option>
              <option value="corporate">Corporate / Business Fleet</option>
              <option value="investor">Investor Information</option>
            </select>
          </div>
        </>
      )}

      <div>
        <label className="aurum-label">
          {riderHubMode ? "Plan & Delivery App (Optional)" : "Requirement Details *"}
        </label>
        <textarea
          required={!riderHubMode}
          rows={riderHubMode ? 2 : 3}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder={
            riderHubMode
              ? "e.g. Weekly / Monthly plan, Blinkit / Zepto / Swiggy / Zomato..."
              : "Tell us your preferred rental duration, vehicle count, or questions..."
          }
          className="aurum-input"
        />
      </div>

      <button type="submit" disabled={submitting} className="aurum-btn-primary w-full justify-center">
        <Send className="h-4 w-4 text-[#FCAA30]" />
        {submitting
          ? "Submitting..."
          : riderHubMode
            ? "Request Callback & Open WhatsApp"
            : "Submit Enquiry"}
      </button>
    </form>
  );
}
