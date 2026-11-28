"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, MessageCircle, Send } from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics";

const WHATSAPP_LEAD_NUMBER = "917779990277";

interface LeadFormProps {
  defaultCategory?: "rental" | "delivery_partner" | "individual" | "corporate" | "investor";
  title?: string;
  subtitle?: string;
  source?: "website" | "business_partnerships";
}

export function LeadForm({
  defaultCategory = "rental",
  title = "Send an Enquiry",
  subtitle = "Share your requirement and our team will respond with verified availability and options.",
  source = "website",
}: LeadFormProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [leadCategory, setLeadCategory] = useState(defaultCategory);
  const [requirement, setRequirement] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string; waUrl?: string } | null>(null);

  function buildWhatsAppUrl(leadCode?: string): string {
    const lines = [
      "Hi AURUM EV Team, I submitted an enquiry:",
      leadCode ? `Reference: ${leadCode}` : null,
      fullName ? `Name: ${fullName}` : null,
      phone ? `Mobile: ${phone}` : null,
      city ? `City: ${city}` : null,
      `Category: ${leadCategory}`,
      requirement ? `Requirement: ${requirement}` : null,
    ].filter(Boolean);
    return `https://wa.me/${WHATSAPP_LEAD_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          city,
          leadCategory,
          source,
          requirement,
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
        setCity("");
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
        <h3 className="font-display text-xl font-bold text-[#101D35]">{title}</h3>
        <p className="mt-1 text-sm text-[#747D8B]">{subtitle}</p>
      </div>

      {result && (
        <div
          className={`flex items-start gap-2.5 rounded-lg p-3.5 text-sm ${
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
          <label className="aurum-label">Mobile Number *</label>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98XXXXXXXX"
            className="aurum-input"
          />
        </div>
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
          <label className="aurum-label">City</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Delhi or Noida"
            className="aurum-input"
          />
        </div>
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

      <div>
        <label className="aurum-label">Requirement Details *</label>
        <textarea
          required
          rows={3}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder="Tell us your preferred rental duration, vehicle count, or questions..."
          className="aurum-input"
        />
      </div>

      <button type="submit" disabled={submitting} className="aurum-btn-primary w-full">
        <Send className="h-4 w-4" />
        {submitting ? "Submitting..." : "Submit Enquiry"}
      </button>
    </form>
  );
}
