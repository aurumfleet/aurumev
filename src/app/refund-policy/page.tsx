import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/LegalDocumentView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Refund Policy",
  description:
    "Security deposit reconciliation, pre-handover cancellation refunds, and settlement timelines at Aurum Fleet Solutions Pvt Ltd.",
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <LegalDocumentView
      eyebrow="Billing & Settlements"
      title="Refund Policy"
      sections={[
        {
          heading: "1. Security Deposit Refunds",
          body: "Security deposits (where applicable) are reconciled upon vehicle return, completion of the return inspection checklist, and settlement of any outstanding rental dues or verified damage charges.",
        },
        {
          heading: "2. Booking Cancellations",
          body: "Cancellations made prior to vehicle handover and activation are reviewed per the applicable plan rules. Confirmed gateway refunds are processed back to the original payment source and tracked in the Aurum Payments ledger.",
        },
      ]}
    />
  );
}
