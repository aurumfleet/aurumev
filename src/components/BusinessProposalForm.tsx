"use client";

import { useState } from "react";
import { Building2, CheckCircle2, AlertCircle } from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics";

export function BusinessProposalForm() {
  const [form, setForm] = useState({
    companyName: "",
    businessCategory: "Last-Mile Delivery",
    contactPerson: "",
    email: "",
    mobile: "",
    gstNumber: "",
    city: "",
    requiredVehicles: 10,
    expectedDuration: "12 Months",
    requirements: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [resState, setResState] = useState<{ ok: boolean; msg: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResState(null);
    try {
      const res = await fetch("/api/business/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setResState({ ok: false, msg: data.error || "Unable to submit business proposal request." });
      } else {
        trackAnalyticsEvent("business_enquiry_submit", { city: form.city });
        setResState({
          ok: true,
          msg: `${data.message} Proposal Lead Reference: ${data.leadCode}`,
        });
      }
    } catch {
      setResState({ ok: false, msg: "Network error while submitting request." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="aurum-card space-y-4 p-6 sm:p-8">
      <div className="flex items-center gap-2.5 border-b border-[#101D35]/10 pb-4">
        <Building2 className="h-5 w-5 text-[#C69A43]" />
        <div>
          <h3 className="font-display text-xl font-bold text-[#101D35]">
            Request a Business Fleet Proposal
          </h3>
          <p className="text-xs text-[#747D8B]">
            Register your company fleet requirement for bulk deployment pricing & SLA terms.
          </p>
        </div>
      </div>

      {resState && (
        <div
          className={`flex items-start gap-2.5 rounded-lg p-3.5 text-sm ${
            resState.ok ? "bg-[#15865B]/10 text-[#15865B]" : "bg-[#D94B4B]/10 text-[#D94B4B]"
          }`}
        >
          {resState.ok ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{resState.msg}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="aurum-label">Company Name *</label>
          <input
            required
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            className="aurum-input"
          />
        </div>
        <div>
          <label className="aurum-label">Business Category *</label>
          <select
            value={form.businessCategory}
            onChange={(e) => setForm({ ...form, businessCategory: e.target.value })}
            className="aurum-input"
          >
            <option>Last-Mile Delivery</option>
            <option>Quick Commerce / Grocery</option>
            <option>E-Commerce Logistics</option>
            <option>Corporate Campus / Field Team</option>
            <option>Hospitality / Tourism</option>
            <option>Other Enterprise</option>
          </select>
        </div>
        <div>
          <label className="aurum-label">Contact Person *</label>
          <input
            required
            value={form.contactPerson}
            onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
            className="aurum-input"
          />
        </div>
        <div>
          <label className="aurum-label">Work Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="aurum-input"
          />
        </div>
        <div>
          <label className="aurum-label">Mobile Number *</label>
          <input
            required
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            className="aurum-input"
          />
        </div>
        <div>
          <label className="aurum-label">GST Number (Optional)</label>
          <input
            value={form.gstNumber}
            onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
            className="aurum-input"
          />
        </div>
        <div>
          <label className="aurum-label">City *</label>
          <input
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="aurum-input"
          />
        </div>
        <div>
          <label className="aurum-label">Required Number of Vehicles *</label>
          <input
            type="number"
            min={1}
            required
            value={form.requiredVehicles}
            onChange={(e) => setForm({ ...form, requiredVehicles: Number(e.target.value) || 1 })}
            className="aurum-input"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="aurum-label">Expected Contract Duration *</label>
          <select
            value={form.expectedDuration}
            onChange={(e) => setForm({ ...form, expectedDuration: e.target.value })}
            className="aurum-input"
          >
            <option>3 Months</option>
            <option>6 Months</option>
            <option>12 Months</option>
            <option>24+ Months Enterprise</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="aurum-label">Business Fleet Requirements *</label>
          <textarea
            rows={3}
            required
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            placeholder="Describe hub locations, rider shift schedules, branding, or SLA preferences..."
            className="aurum-input"
          />
        </div>
      </div>

      <button type="submit" disabled={submitting} className="aurum-btn-primary w-full">
        {submitting ? "Submitting Proposal Request..." : "Submit Business Proposal Request"}
      </button>
    </form>
  );
}
