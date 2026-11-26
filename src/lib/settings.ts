import { query, queryOne } from "./db";

export interface ContactSettings {
  phone: string;
  whatsapp: string;
  supportEmail: string;
  officeAddress: string;
  operatingHours: string;
  socialLinks: {
    linkedin: string;
    instagram: string;
    facebook: string;
    x: string;
  };
}

export interface SustainabilityStatItem {
  id: string;
  label: string;
  value: string;
  unit: string;
  verified: boolean;
}

export interface InvestmentConfig {
  financialModelApproved: boolean;
  publicStatusMessage: string;
  demoCalculatorEnabled: boolean;
  disclosuresText: string;
}

export interface TaxPricingSettings {
  gstRatePercent: number;
  defaultCurrency: string;
  depositPolicyNote: string;
  pricingApproved: boolean;
}

export interface SiteSettingsBundle {
  contact: ContactSettings;
  sustainabilityStats: SustainabilityStatItem[];
  investment: InvestmentConfig;
  pricing: TaxPricingSettings;
}

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  phone: "Configure in Admin Settings",
  whatsapp: "",
  supportEmail: "support@aurumfleet.example",
  officeAddress: "Aurum Fleet Solutions Pvt Ltd — Configure Registered Office in Admin Settings",
  operatingHours: "Mon – Sat, 09:00 AM – 07:00 PM IST",
  socialLinks: {
    linkedin: "",
    instagram: "",
    facebook: "",
    x: "",
  },
};

export const DEFAULT_INVESTMENT_CONFIG: InvestmentConfig = {
  financialModelApproved: false,
  publicStatusMessage:
    "Investment model details are currently being finalized. Contact our team for information.",
  demoCalculatorEnabled: false,
  disclosuresText:
    "Any investment or fleet participation opportunity offered by Aurum Fleet Solutions Pvt Ltd is subject to formal legal documentation, contractual terms, and applicable regulatory compliance. No returns or payouts are guaranteed.",
};

export const DEFAULT_PRICING_SETTINGS: TaxPricingSettings = {
  gstRatePercent: 18,
  defaultCurrency: "INR",
  depositPolicyNote:
    "Rental rates, security deposits, and applicable GST are confirmed per booking after commercial and location verification.",
  pricingApproved: false,
};

export async function getSiteSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await queryOne<{ value: T }>(
      "SELECT value FROM site_settings WHERE key = $1",
      [key]
    );
    return row ? (row.value as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function getSiteSettingsBundle(): Promise<SiteSettingsBundle> {
  const [contact, sustainabilityStats, investment, pricing] = await Promise.all([
    getSiteSetting<ContactSettings>("contact_settings", DEFAULT_CONTACT_SETTINGS),
    getSiteSetting<SustainabilityStatItem[]>("sustainability_stats", []),
    getSiteSetting<InvestmentConfig>("investment_config", DEFAULT_INVESTMENT_CONFIG),
    getSiteSetting<TaxPricingSettings>("pricing_tax_settings", DEFAULT_PRICING_SETTINGS),
  ]);

  return {
    contact,
    // Automatically filter/hide unverified statistics on public views
    sustainabilityStats,
    investment,
    pricing,
  };
}

export async function updateSiteSetting(
  key: string,
  value: unknown,
  description: string,
  updatedBy: string | null
): Promise<void> {
  await query(
    `INSERT INTO site_settings (key, value, description, updated_by)
     VALUES ($1, $2::jsonb, $3, $4)
     ON CONFLICT (key) DO UPDATE SET
       value = EXCLUDED.value,
       description = COALESCE(EXCLUDED.description, site_settings.description),
       updated_by = EXCLUDED.updated_by,
       updated_at = NOW()`,
    [key, JSON.stringify(value), description, updatedBy]
  );
}
