import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/LegalDocumentView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "EV Rental Policy",
  description:
    "KYC documentation, vehicle handover checklist, preventive hub maintenance, and allocation rules for AURUM EV rentals.",
  path: "/rental-policy",
});

export default function RentalPolicyPage() {
  return (
    <LegalDocumentView
      eyebrow="Operations Policy"
      title="EV Rental Policy"
      sections={[
        {
          heading: "1. KYC & Documentation",
          body: "Every rider must submit valid identity documents and driving licence (for applicable vehicle classes) before vehicle handover.",
        },
        {
          heading: "2. Handover, Maintenance & Support",
          body: "Vehicles undergo a recorded handover checklist. Routine preventive servicing is coordinated through Aurum hubs and tracked via support tickets.",
        },
        {
          heading: "3. Overlap & Allocation Governance",
          body: "Each vehicle unit is allocated exclusively for verified non-overlapping rental dates.",
        },
      ]}
    />
  );
}
