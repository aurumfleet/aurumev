import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/LegalDocumentView";

export const metadata: Metadata = { title: "Investor Disclosures" };

export default function InvestorDisclosuresPage() {
  return (
    <LegalDocumentView
      eyebrow="Governance & Disclosures"
      title="Investor Disclosures & Risk Factors"
      sections={[
        {
          heading: "1. No Public Offer or Guaranteed Return",
          body: "Information presented on the AURUM EV website is strictly informational and does not constitute a public securities offering, solicitation, or guarantee of financial returns, fixed monthly income, or asset buyback.",
        },
        {
          heading: "2. Distinction of Financial Metrics",
          body: "Any financial reporting shared with approved partners distinguishes clearly between projected revenue, operating expenses, projected net income, actual received income, and distributions.",
        },
        {
          heading: "3. Formal Agreements Required",
          body: "All fleet partnership terms require formal legal documentation, due diligence, and applicable regulatory compliance review before execution.",
        },
      ]}
    />
  );
}
