import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/LegalDocumentView";

export const metadata: Metadata = { title: "Refund Policy" };

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
