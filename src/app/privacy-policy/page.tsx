import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/LegalDocumentView";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentView
      eyebrow="Legal & Data Protection"
      title="Privacy Policy"
      sections={[
        {
          heading: "1. Data Controller",
          body: "Aurum Fleet Solutions Pvt Ltd ('AURUM EV') collects and processes personal, business, and KYC verification information strictly for electric vehicle rental fulfillment, compliance, billing, and customer support.",
        },
        {
          heading: "2. Private KYC Document Handling",
          body: "Identity and driving licence documents uploaded by riders and businesses are stored in private, access-controlled storage and are never exposed via public URLs. Access is restricted to the document owner and authorized Aurum staff.",
        },
        {
          heading: "3. Payment Security & Analytics",
          body: "AURUM EV does not store payment card credentials. Payment transactions are processed through verified payment gateway adapters. Analytics tracking is configured without transmitting personally identifiable information.",
        },
      ]}
    />
  );
}
