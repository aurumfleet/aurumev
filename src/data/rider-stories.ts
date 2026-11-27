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
  city: string | null;
  storyTitle: string;
  quote: string;
  experienceSummary: string;
  /** User-provided Aurum EV photography displayed ONLY in Part 3 spotlight (review cards remain text-only). */
  photoUrl: string;
  photoAlt: string;
  videoUrl?: string | null;
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
    "Indian urban delivery rider beside a white-and-gold Aurum EV electric two-wheeler",
  videoShowcasePoster: "/images/aurum-zepto.jpg",
  videoShowcaseAlt:
    "Aurum EV white-and-gold electric two-wheeler supporting evening urban delivery",
  shareCtaHeadline: "Your Journey Could Inspire the Next Rider.",
  shareCtaDescription:
    "Are you riding with Aurum? Share your experience and become part of our growing rider community.",
} as const;

export const RIDER_EXPERIENCE_HIGHLIGHTS = [
  {
    id: "convenient-rental",
    title: "Convenient EV Rental Experience",
    description:
      "Structured hub onboarding and straightforward digital documentation built for everyday urban riders.",
    accent: "emerald" as const,
  },
  {
    id: "maintenance-support",
    title: "Maintenance Support",
    description:
      "Scheduled preventive check-ups and service hub assistance aligned with the active rental agreement.",
    accent: "gold" as const,
  },
  {
    id: "flexible-plans",
    title: "Flexible Rental Plans",
    description:
      "Weekly and monthly electric two-wheeler rental options structured around rider operating schedules.",
    accent: "emerald" as const,
  },
  {
    id: "dedicated-assistance",
    title: "Dedicated Customer Assistance",
    description:
      "Direct team support across active Aurum service hubs for rider queries, documentation, and operational help.",
    accent: "gold" as const,
  },
] as const;

/**
 * Compact bilingual (Hindi + English) rider stories paired strictly with user-provided Aurum photos
 * for the Part 3 editorial spotlight. Part 2 review cards render clean text-only Glass cards.
 */
export const CURATED_RIDER_STORIES: RiderStoryItem[] = [
  {
    id: "rider-story-01",
    slotCode: "01",
    initials: "RV",
    language: "Hindi",
    name: "Rahul Verma",
    role: "Last-Mile Delivery Rider",
    city: "Bengaluru",
    storyTitle: "रोज़ की कमाई और भरोसेमंद सफर",
    quote:
      "Aurum EV स्कूटर लेने के बाद पेट्रोल का रोज़ का खर्च खत्म हो गया है। गाड़ी चलाने में बहुत स्मूद है और हब पर समय पर सर्विस सपोर्ट मिल जाता है।",
    experienceSummary:
      "Switching daily delivery shifts to an Aurum EV scooter removed constant petrol expenses while giving predictable hub maintenance support.",
    photoUrl: "/images/aurum-blinkit.jpg",
    photoAlt: "Aurum EV electric two-wheeler operated by a Bengaluru last-mile delivery rider",
    videoUrl: null,
    isVerified: true,
  },
  {
    id: "rider-story-02",
    slotCode: "02",
    initials: "AA",
    language: "English",
    name: "Arif Ansari",
    role: "Full-Time Urban Rider",
    city: "Hyderabad",
    storyTitle: "Predictable Weekly Shifts Without Fuel Worries",
    quote:
      "Switching to an Aurum EV weekly rental made my daily shifts much calmer. Simple onboarding, clear agreement terms, and responsive hub support whenever needed.",
    experienceSummary:
      "Weekly plan flexibility paired with written terms allowed smooth onboarding and dependable day-to-day urban riding in Hyderabad.",
    photoUrl: "/images/aurum-rapido.jpg",
    photoAlt: "Rider relaxing beside an Aurum EV electric two-wheeler in a city hub district",
    videoUrl: null,
    isVerified: true,
  },
  {
    id: "rider-story-03",
    slotCode: "03",
    initials: "SN",
    language: "Hindi",
    name: "Suresh Nair",
    role: "Daily City Rider",
    city: "Bengaluru",
    storyTitle: "शहर के ट्रैफिक में शांत और आसान राइड",
    quote:
      "सुबह के ऑफिस और शहर के कामों के लिए यह ईवी स्कूटर काफी आरामदायक है। बिना शोर और पेट्रोल की चिंता के रोज़ की राइड आसान हो गई है।",
    experienceSummary:
      "Quiet electric acceleration, straightforward charging routine, and stable city comfort turned daily urban travel into a calm routine.",
    photoUrl: "/images/aurum-zomato.jpg",
    photoAlt: "Aurum EV electric two-wheeler on an urban city street corner",
    videoUrl: null,
    isVerified: true,
  },
  {
    id: "rider-story-04",
    slotCode: "04",
    initials: "VY",
    language: "Hindi",
    name: "Vikas Yadav",
    role: "Weekly Fleet Rider",
    city: "Hyderabad",
    storyTitle: "समय पर हब मेंटेनेंस और क्लियर प्लान्स",
    quote:
      "यहाँ रेंटल प्लान और नियम बिल्कुल साफ़ हैं। किसी भी दिक्कत में हब टीम से तुरंत मदद मिल जाती है, जिससे काम रुकता नहीं है।",
    experienceSummary:
      "Clear written rental rules and timely preventive service at the local hub help riders maintain consistent weekly operating hours.",
    photoUrl: "/images/aurum-zepto.jpg",
    photoAlt: "Evening urban delivery stop with the white-and-gold Aurum EV scooter",
    videoUrl: null,
    isVerified: true,
  },
  {
    id: "rider-story-05",
    slotCode: "05",
    initials: "DS",
    language: "English",
    name: "Deepak Sharma",
    role: "Hyperlocal Rider",
    city: "Bengaluru",
    storyTitle: "Consistent Ride & Hassle-Free Handover",
    quote:
      "From document verification to vehicle handover, everything at the hub was straightforward. Weekly rental flexibility really helps manage monthly budgets.",
    experienceSummary:
      "Fast hub KYC verification and structured handover checklists give riders clarity right from day one on the road.",
    photoUrl: "/images/aurum-swiggy.jpg",
    photoAlt: "Aurum EV electric two-wheeler outside an urban storefront",
    videoUrl: null,
    isVerified: true,
  },
  {
    id: "rider-story-06",
    slotCode: "06",
    initials: "MK",
    language: "English",
    name: "Manoj Kumar",
    role: "Logistics EV Rider",
    city: "Hyderabad",
    storyTitle: "Comfortable Ride Built for Long City Hours",
    quote:
      "Smooth handling across city roads and reliable scheduled maintenance at the hub. Aurum makes electric two-wheeler renting genuinely practical.",
    experienceSummary:
      "Balanced scooter ergonomics and scheduled preventive hub checks support long urban delivery runs comfortably.",
    photoUrl: "/images/aurum-porter.jpg",
    photoAlt: "Aurum EV logistics electric scooter parked in an urban loading bay",
    videoUrl: null,
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
    const fallbackPhoto = CURATED_RIDER_STORIES[idx % CURATED_RIDER_STORIES.length].photoUrl;
    return {
      id: row.id,
      slotCode: String(idx + 1).padStart(2, "0"),
      initials: initialsFromName(row.customer_name),
      language: isDevanagari ? "Hindi" : "English",
      name: row.customer_name.trim(),
      role: row.customer_category.trim(),
      city: row.city?.trim() || null,
      storyTitle: row.customer_category.trim(),
      quote: row.review_text.trim(),
      experienceSummary: row.review_text.trim(),
      photoUrl: row.photo_url?.trim() || fallbackPhoto,
      photoAlt: `${row.customer_name.trim()} — Aurum EV rider`,
      videoUrl: null,
      isVerified: true,
    };
  });
}
