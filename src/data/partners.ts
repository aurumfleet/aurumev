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
  /** Optional native backdrop hex for solid-tile logo assets so edges blend seamlessly */
  tileBackdrop?: string;
  /** How the logo image should fit inside its chrome tile */
  fit?: "cover" | "contain";
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
    tileBackdrop: "#F8DF38",
    fit: "cover",
  },
  {
    id: "rapido",
    name: "Rapido",
    sector: "Last-Mile Mobility",
    logoUrl: "/images/partners/rapido.png",
    alt: "Rapido official logo",
    tileBackdrop: "#F9C935",
    fit: "contain",
  },
  {
    id: "porter",
    name: "Porter",
    sector: "Intra-City Freight",
    logoUrl: "/images/partners/porter.jpg",
    alt: "Porter official logo",
    tileBackdrop: "#0052FF",
    fit: "cover",
  },
  {
    id: "jiomart",
    name: "JioMart",
    sector: "Express Grocery",
    logoUrl: "/images/partners/jiomart.jpg",
    alt: "JioMart official logo",
    tileBackdrop: "#FFFFFF",
    fit: "contain",
  },
  {
    id: "flipkart-minutes",
    name: "Flipkart Minutes",
    sector: "Instant Commerce",
    logoUrl: "/images/partners/flipkart-minutes.jpg",
    alt: "Flipkart Minutes official logo",
    tileBackdrop: "#BA183C",
    fit: "cover",
  },
  {
    id: "bigbasket",
    name: "bigbasket",
    sector: "Daily Essentials",
    logoUrl: "/images/partners/bigbasket.jpg",
    alt: "bigbasket official logo",
    tileBackdrop: "#FFFFFF",
    fit: "cover",
  },
  {
    id: "swiggy",
    name: "Swiggy",
    sector: "On-Demand Delivery",
    logoUrl: "/images/partners/swiggy.webp",
    alt: "Swiggy official logo",
    tileBackdrop: "#FFFFFF",
    fit: "contain",
  },
  {
    id: "zomato",
    name: "Zomato",
    sector: "Food Logistics",
    logoUrl: "/images/partners/zomato.png",
    alt: "Zomato official logo",
    tileBackdrop: "#FFFFFF",
    fit: "contain",
  },
  {
    id: "zepto",
    name: "Zepto",
    sector: "Express Grocery",
    logoUrl: "/images/partners/zepto.jpg",
    alt: "Zepto official logo",
    tileBackdrop: "#3B006A",
    fit: "cover",
  },
] as const;
