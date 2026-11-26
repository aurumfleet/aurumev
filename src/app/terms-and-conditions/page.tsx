import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/LegalDocumentView";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <LegalDocumentView
      eyebrow="Legal Terms"
      title="Terms & Conditions"
      sections={[
        {
          heading: "1. Platform Use & Eligibility",
          body: "Use of the AURUM EV platform and electric vehicle rental services is governed by Indian law and subject to valid identity verification, driving eligibility (where applicable), and execution of a digital rental or corporate fleet agreement.",
        },
        {
          heading: "2. Booking Confirmation Policy",
          body: "Submitting a rental request online logs an enquiry in 'New Request' status. Bookings become confirmed only after Aurum Operations verifies hub availability, approves KYC documents, and confirms applicable payment.",
        },
        {
          heading: "3. Acceptable Vehicle Operation",
          body: "Riders and business operators must adhere to traffic regulations, safe charging guidelines, and timely return schedules as detailed in their signed rental agreement.",
        },
      ]}
    />
  );
}
