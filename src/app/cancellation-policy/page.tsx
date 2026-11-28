import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/LegalDocumentView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Cancellation Policy",
  description:
    "Pre-handover booking cancellations, plan flexibility, and vehicle return inspection rules at AURUM EV.",
  path: "/cancellation-policy",
});

export default function CancellationPolicyPage() {
  return (
    <LegalDocumentView
      eyebrow="Rental Terms & Flexibility"
      title="Cancellation & Return Policy"
      sections={[
        {
          heading: "1. Flexible Plan Structure",
          body: "AURUM EV rental plans are designed around daily, weekly, monthly, and corporate durations without unnecessary long-term lock-ins for standard rider plans.",
        },
        {
          heading: "2. Pre-Handover Cancellations",
          body: "Booking requests may be cancelled prior to vehicle handover by contacting our operations team. Any verified advance or refundable deposit is reconciled per the approved rental agreement.",
        },
        {
          heading: "3. Vehicle Return & Inspection",
          body: "Upon completion of your rental period, vehicles undergo a physical and battery inspection at the designated Aurum hub before final deposit settlement.",
        },
      ]}
    />
  );
}
