"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics";

export function InvestorEnquiryForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    entityType: "individual",
    indicativeInterest: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/investor/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ ok: false, msg: data.error || "Unable to submit investor enquiry." });
      } else {
        trackAnalyticsEvent("invest_cta_click", { source: "investor_enquiry_form" });
        setResult({
          ok: true,
          msg: `${data.message} Reference: ${data.leadCode}`,
        });
      }
    } catch {
      setResult({ ok: false, msg: "Network error while submitting enquiry." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="aurum-card space-y-4 p-6 sm:p-8">
      <div>
        <h3 className="font-display text-xl font-bold text-[#101D35]">
          Investor Information Enquiry
        </h3>
        <p className="mt-1 text-xs text-[#747D8B]">
          Request approved documentation and an introductory discussion with Aurum Fleet Solutions Pvt Ltd.
        </p>
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
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="aurum-input"
          />
        </div>
        <div>
          <label className="aurum-label">Email Address *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="aurum-input"
          />
        </div>
        <div>
          <label className="aurum-label">Phone Number *</label>
          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="aurum-input"
          />
        </div>
        <div>
          <label className="aurum-label">City</label>
          <input
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="aurum-input"
          />
        </div>
        <div>
          <label className="aurum-label">Investor Profile Type</label>
          <select
            value={form.entityType}
            onChange={(e) => setForm({ ...form, entityType: e.target.value })}
            className="aurum-input"
          >
            <option value="individual">Individual</option>
            <option value="hni">HNI / Family Office</option>
            <option value="corporate">Corporate Entity</option>
            <option value="institutional">Institutional Partner</option>
          </select>
        </div>
        <div>
          <label className="aurum-label">Area of Interest (Optional)</label>
          <input
            value={form.indicativeInterest}
            onChange={(e) => setForm({ ...form, indicativeInterest: e.target.value })}
            placeholder="e.g. City fleet deployment structure"
            className="aurum-input"
          />
        </div>
      </div>

      <div>
        <label className="aurum-label">Enquiry Message *</label>
        <textarea
          required
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Tell us what documentation or structure information you would like to review..."
          className="aurum-input"
        />
      </div>

      <button type="submit" disabled={submitting} className="aurum-btn-primary w-full">
        <Send className="h-4 w-4" />
        {submitting ? "Submitting..." : "Submit Investor Enquiry"}
      </button>
    </form>
  );
}
