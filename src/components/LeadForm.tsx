"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics";

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
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

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
        setResult({
          ok: true,
          msg: `${data.message} Reference: ${data.leadCode}`,
        });
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
          <span>{result.msg}</span>
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
            placeholder="e.g. Bengaluru"
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
