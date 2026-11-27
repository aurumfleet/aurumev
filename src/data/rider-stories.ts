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
  name: string;
  role: string;
  city: string | null;
  storyTitle: string;
  quote: string;
  experienceSummary: string;
  photoUrl: string;
  photoAlt: string;
  /** Optional video URL — strictly populated only when a genuine customer video exists. */
  videoUrl?: string | null;
  videoTitle?: string | null;
  /** True only when backed by an approved & verified rider submission. */
  isVerified: boolean;
  /** True when showing an editable website-editor template awaiting real rider feedback. */
  isPlaceholder: boolean;
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

/**
 * Editable Website Content Configuration — SECTION 13 ("Rider Experiences & Testimonials").
 *
 * AUTHENTICITY POLICY:
 * 1. Add genuine, customer-approved rider testimonials and verified photographs here
 *    or approve them in the database `testimonials` table (`approval_status = 'approved'` AND `is_verified = TRUE`).
 * 2. When no verified rider testimonials exist yet, `EDITABLE_PLACEHOLDER_STORIES` provides clearly labelled
 *    editorial slots so zero fictional reviews, fake rider names, star ratings, or delivery-platform
 *    endorsements are ever presented as real customer feedback.
 */
export const RIDER_SECTION_COPY = {
  eyebrow: "SECTION 13 · RIDER EXPERIENCES & TESTIMONIALS",
  headingLead: "Real Riders.",
  headingAccent: "Real Journeys.",
  supportingHeadline:
    "Every Ride Has a Story. Discover the People Moving Forward with Aurum.",
  cinematicBannerHeadline:
    "Behind Every Delivery, There's a Rider. Behind Every Rider, There's a Journey.",
  cinematicBannerImage: "/images/rider-stories/cinematic-urban-banner.jpg",
  cinematicBannerAlt:
    "Indian urban electric scooter rider standing beside a white-and-gold Aurum EV two-wheeler along a city boulevard",
  videoShowcasePoster: "/images/rider-stories/rider-action-dusk.jpg",
  videoShowcaseAlt:
    "White-and-gold electric two-wheeler parked outside an urban mobility hub at dusk",
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
 * Editable placeholder slots displayed ONLY while verified customer stories are being collected.
 * Never publish fictional reviews or invented rider personas as genuine testimonials.
 */
export const EDITABLE_PLACEHOLDER_STORIES: RiderStoryItem[] = [
  {
    id: "editable-slot-01",
    slotCode: "SLOT 01",
    name: "Editable Rider Slot · 01",
    role: "Last-Mile Delivery Rider (Template Slot)",
    city: null,
    storyTitle: "Daily Shifts Built Around Predictability",
    quote:
      "Editable placeholder slot — ready for a genuine, customer-verified quote from an active Aurum EV delivery rider once collected and approved.",
    experienceSummary:
      "This editorial showcase slot is reserved in the Aurum website editor for an authentic rider perspective covering daily electric range, hub charging routine, and shift consistency.",
    photoUrl: "/images/rider-stories/rider-portrait-editorial.jpg",
    photoAlt:
      "Editorial portrait of an Indian urban electric two-wheeler rider beside a white-and-gold scooter",
    videoUrl: null,
    videoTitle: null,
    isVerified: false,
    isPlaceholder: true,
  },
  {
    id: "editable-slot-02",
    slotCode: "SLOT 02",
    name: "Editable Rider Slot · 02",
    role: "Daily Urban Commuter (Template Slot)",
    city: null,
    storyTitle: "Quiet Morning Commutes Across the City",
    quote:
      "Editable placeholder slot — add a verified daily commuter review and customer photograph here without altering layout or typography.",
    experienceSummary:
      "Prepared for verified feedback from individual urban commuters transitioning from petrol scooters to structured Aurum electric two-wheeler rentals.",
    photoUrl: "/images/rider-stories/cinematic-urban-banner.jpg",
    photoAlt:
      "Urban electric scooter parked along a green city avenue during golden hour",
    videoUrl: null,
    videoTitle: null,
    isVerified: false,
    isPlaceholder: true,
  },
  {
    id: "editable-slot-03",
    slotCode: "SLOT 03",
    name: "Editable Rider Slot · 03",
    role: "Weekly Rental Partner (Template Slot)",
    city: null,
    storyTitle: "Hub Support When Schedules Matter Most",
    quote:
      "Editable placeholder slot — awaiting a genuine verified review covering hub handover experience and scheduled maintenance support.",
    experienceSummary:
      "Designed for first-hand stories from riders utilizing weekly or monthly Aurum rental plans who want to share how preventive maintenance keeps them moving.",
    photoUrl: "/images/rider-stories/rider-action-dusk.jpg",
    photoAlt:
      "Aurum white-and-gold electric two-wheeler positioned outside an urban service hub plaza at dusk",
    videoUrl: null,
    videoTitle: null,
    isVerified: false,
    isPlaceholder: true,
  },
  {
    id: "editable-slot-04",
    slotCode: "SLOT 04",
    name: "Editable Rider Slot · 04",
    role: "Aurum Community Feature (Template Slot)",
    city: null,
    storyTitle: "Share Your Authentic Ride Story",
    quote:
      "Riding with Aurum today? Submit your genuine feedback and photograph through the Share Your Experience form to feature here.",
    experienceSummary:
      "Aurum Fleet Solutions Pvt Ltd publishes real rider stories strictly after consent and verification, keeping every testimonial authentic and transparent.",
    photoUrl: "/images/aurum-ev-studio.png",
    photoAlt: "Studio view of the white-and-gold Aurum EV electric two-wheeler",
    videoUrl: null,
    videoTitle: null,
    isVerified: false,
    isPlaceholder: true,
  },
];

/**
 * Verified customer video archive. Leave empty unless genuine rider-approved video assets exist;
 * the UI automatically renders the tasteful "Rider Stories Coming Soon" showcase when empty.
 */
export const VERIFIED_RIDER_VIDEOS: RiderVideoEntry[] = [];

/**
 * Merges database-verified testimonials cleanly ahead of any fallback editable slots.
 * If 1 or more genuine verified database testimonials exist, ONLY verified stories are published.
 */
export function resolveRiderStories(
  dbTestimonials: DatabaseVerifiedTestimonial[] = []
): RiderStoryItem[] {
  const verifiedRows = dbTestimonials.filter(
    (row) => row.customer_name?.trim() && row.review_text?.trim()
  );

  if (verifiedRows.length === 0) {
    return EDITABLE_PLACEHOLDER_STORIES;
  }

  return verifiedRows.map((row, idx) => ({
    id: row.id,
    slotCode: `STORY ${String(idx + 1).padStart(2, "0")}`,
    name: row.customer_name.trim(),
    role: row.customer_category.trim(),
    city: row.city?.trim() || null,
    storyTitle: `Riding Forward as ${row.customer_category.trim()}`,
    quote: row.review_text.trim(),
    experienceSummary: row.review_text.trim(),
    photoUrl: row.photo_url?.trim() || "/images/rider-stories/rider-portrait-editorial.jpg",
    photoAlt: `${row.customer_name.trim()} — Aurum EV verified rider story`,
    videoUrl: null,
    videoTitle: null,
    isVerified: true,
    isPlaceholder: false,
  }));
}
