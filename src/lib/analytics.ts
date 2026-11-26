export type AnalyticsEventName =
  | "page_view"
  | "rent_cta_click"
  | "invest_cta_click"
  | "business_enquiry_submit"
  | "rental_enquiry_submit"
  | "phone_click"
  | "whatsapp_click"
  | "calculator_complete"
  | "booking_request_submit"
  | "sign_up"
  | "payment_success";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

// Strictly prohibits PII (no emails, phones, names, or KYC identifiers)
const ALLOWED_EVENT_PARAM_KEYS = new Set([
  "category",
  "city",
  "duration_type",
  "page_path",
  "source",
  "vehicle_category",
  "estimated_monthly_savings",
]);

export function trackAnalyticsEvent(
  eventName: AnalyticsEventName,
  params: Record<string, string | number | boolean> = {}
): void {
  if (typeof window === "undefined") return;

  const safeParams: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (ALLOWED_EVENT_PARAM_KEYS.has(k)) {
      safeParams[k] = v;
    }
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...safeParams,
    });
  }
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, safeParams);
  }
}
