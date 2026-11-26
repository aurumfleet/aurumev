export interface EcosystemPartner {
  /** Unique stable identifier */
  id: string;
  /** Official brand display name */
  name: string;
  /** Neutral ecosystem sector label */
  sector: string;
  /** Path or URL to the official authentic brand logo asset */
  logoUrl: string;
  /** Accessible alternative text */
  alt: string;
  /** Optional native backdrop hex for solid-tile logo assets so edges blend seamlessly without cropping */
  tileBackdrop?: string;
  /** Inner image sizing hint to balance optical visual weight across square and wide logos */
  sizeHint?: "wide" | "square" | "wordmark";
}

/**
 * Replaceable ecosystem partner configuration.
 * Update or connect this array to a CMS without touching component presentation logic.
 */
export const ECOSYSTEM_PARTNERS: readonly EcosystemPartner[] = [
  {
    id: "blinkit",
    name: "Blinkit",
    sector: "Quick Commerce",
    logoUrl: "/images/partners/blinkit.png",
    alt: "Blinkit official logo",
    tileBackdrop: "#F8CB46",
    sizeHint: "wide",
  },
  {
    id: "zepto",
    name: "Zepto",
    sector: "Express Grocery",
    logoUrl: "/images/partners/zepto.jpg",
    alt: "Zepto official logo",
    tileBackdrop: "#3B006A",
    sizeHint: "wide",
  },
  {
    id: "swiggy",
    name: "Swiggy",
    sector: "On-Demand Delivery",
    logoUrl: "/images/partners/swiggy.webp",
    alt: "Swiggy official logo",
    sizeHint: "wordmark",
  },
  {
    id: "swiggy-instamart",
    name: "Swiggy Instamart",
    sector: "Instant Commerce",
    logoUrl: "/images/partners/swiggy-instamart.png",
    alt: "Swiggy Instamart official logo",
    sizeHint: "wordmark",
  },
  {
    id: "zomato",
    name: "Zomato",
    sector: "Food Logistics",
    logoUrl: "/images/partners/zomato.png",
    alt: "Zomato official logo",
    sizeHint: "wordmark",
  },
  {
    id: "rapido",
    name: "Rapido",
    sector: "Last-Mile Mobility",
    logoUrl: "/images/partners/rapido.png",
    alt: "Rapido official logo",
    tileBackdrop: "#F9C935",
    sizeHint: "square",
  },
  {
    id: "porter",
    name: "Porter",
    sector: "Intra-City Freight",
    logoUrl: "/images/partners/porter.png",
    alt: "Porter official logo",
    sizeHint: "square",
  },
] as const;
