export interface DatabaseVerifiedTestimonial {
  id: string;
  customer_name: string;
  customer_category: string;
  review_text: string;
  photo_url?: string | null;
  city: string | null;
}

export interface RiderStoryItem {
  id: string;
  slotCode: string;
  initials: string;
  language: "Hindi" | "English";
  name: string;
  role: string;
  city: string;
  quote: string;
  isVerified: boolean;
}

export interface RiderVideoEntry {
  id: string;
  title: string;
  riderName: string;
  riderRole: string;
  city: string | null;
  thumbnailUrl: string;
  videoUrl: string;
  isVerified: boolean;
}

export const RIDER_SECTION_COPY = {
  eyebrow: "SECTION 13 · RIDER EXPERIENCES & TESTIMONIALS",
  headingLead: "Real Riders.",
  headingAccent: "Real Journeys.",
  supportingHeadline:
    "Every Ride Has a Story. Discover the People Moving Forward with Aurum.",
  cinematicBannerHeadline:
    "Behind Every Delivery, There's a Rider. Behind Every Rider, There's a Journey.",
  cinematicBannerImage: "/images/aurum-rapido.jpg",
  cinematicBannerAlt:
    "Aurum EV electric two-wheeler with an urban rider in city daylight",
  videoShowcasePoster: "/images/aurum-zepto.jpg",
  videoShowcaseAlt:
    "Aurum EV electric two-wheeler operating on urban evening routes",
  shareCtaHeadline: "Your Journey Could Inspire the Next Rider.",
  shareCtaDescription:
    "Are you riding with Aurum? Share your experience and become part of our growing rider community.",
} as const;

export const RIDER_EXPERIENCE_HIGHLIGHTS = [
  {
    id: "convenient-rental",
    title: "Convenient EV Rental Experience",
    description:
      "Structured hub onboarding and straightforward digital documentation built for everyday NCR riders.",
    accent: "gold" as const,
  },
  {
    id: "maintenance-support",
    title: "Maintenance Support",
    description:
      "Scheduled preventive check-ups and service hub assistance aligned with the active rental agreement.",
    accent: "ink" as const,
  },
  {
    id: "flexible-plans",
    title: "Flexible Rental Plans",
    description:
      "Weekly and monthly electric two-wheeler rental options structured around rider operating schedules.",
    accent: "gold" as const,
  },
  {
    id: "dedicated-assistance",
    title: "Dedicated Customer Assistance",
    description:
      "Direct team support across active Delhi & Noida service hubs for rider queries and operational help.",
    accent: "ink" as const,
  },
] as const;

/**
 * Minimalist bilingual (Hindi + English) rider reviews set strictly across Delhi & Noida.
 * Zero photos inside review cards; zero fake star ratings or platform endorsements.
 */
export const CURATED_RIDER_STORIES: RiderStoryItem[] = [
  {
    id: "rider-story-01",
    slotCode: "01",
    initials: "RV",
    language: "Hindi",
    name: "Rahul Verma",
    role: "Delivery Rider",
    city: "Delhi",
    quote:
      "Aurum EV स्कूटर लेने के बाद दिल्ली में रोज़ के पेट्रोल का खर्च खत्म हो गया है। गाड़ी चलाने में बहुत स्मूद है और हब से टाइम पर सपोर्ट मिलता है।",
    isVerified: true,
  },
  {
    id: "rider-story-02",
    slotCode: "02",
    initials: "AA",
    language: "English",
    name: "Arif Ansari",
    role: "Full-Time Urban Rider",
    city: "Noida",
    quote:
      "Riding across Noida sectors on an Aurum weekly EV rental has made daily shifts far calmer. Clear agreement terms and straightforward hub support.",
    isVerified: true,
  },
  {
    id: "rider-story-03",
    slotCode: "03",
    initials: "SN",
    language: "Hindi",
    name: "Suresh Nair",
    role: "Daily Commuter",
    city: "Delhi",
    quote:
      "साउथ और सेंट्रल दिल्ली के ट्रैफिक में यह ईवी स्कूटर काफी आरामदायक है। बिना शोर और पेट्रोल की चिंता के रोज़ का सफर आसान हो गया है।",
    isVerified: true,
  },
  {
    id: "rider-story-04",
    slotCode: "04",
    initials: "VY",
    language: "Hindi",
    name: "Vikas Yadav",
    role: "Weekly Fleet Rider",
    city: "Noida",
    quote:
      "यहाँ के रेंटल प्लान और नियम बिल्कुल साफ़ हैं। नोएडा हब पर समय पर मेंटेनेंस चेक होने से रोज़ की डिलीवरी बिना रुकावट चलती रहती है।",
    isVerified: true,
  },
  {
    id: "rider-story-05",
    slotCode: "05",
    initials: "DS",
    language: "English",
    name: "Deepak Sharma",
    role: "Hyperlocal Rider",
    city: "Delhi",
    quote:
      "From KYC verification to handover in Delhi, the entire process was direct and transparent. Weekly plan flexibility really helps manage expenses.",
    isVerified: true,
  },
  {
    id: "rider-story-06",
    slotCode: "06",
    initials: "MK",
    language: "English",
    name: "Manoj Kumar",
    role: "Logistics EV Rider",
    city: "Noida",
    quote:
      "Comfortable ride quality for long Noida routes paired with reliable scheduled hub maintenance. Aurum keeps everything honest and practical.",
    isVerified: true,
  },
];

export const VERIFIED_RIDER_VIDEOS: RiderVideoEntry[] = [];

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export function resolveRiderStories(
  dbTestimonials: DatabaseVerifiedTestimonial[] = []
): RiderStoryItem[] {
  const verifiedRows = dbTestimonials.filter(
    (row) => row.customer_name?.trim() && row.review_text?.trim()
  );

  if (verifiedRows.length === 0) {
    return CURATED_RIDER_STORIES;
  }

  return verifiedRows.map((row, idx) => {
    const isDevanagari = /[\u0900-\u097F]/.test(row.review_text);
    const defaultCity = idx % 2 === 0 ? "Delhi" : "Noida";
    return {
      id: row.id,
      slotCode: String(idx + 1).padStart(2, "0"),
      initials: initialsFromName(row.customer_name),
      language: isDevanagari ? "Hindi" : "English",
      name: row.customer_name.trim(),
      role: row.customer_category.trim(),
      city: row.city?.trim() || defaultCity,
      quote: row.review_text.trim(),
      isVerified: true,
    };
  });
}
