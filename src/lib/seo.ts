import type { Metadata } from "next";
import { AURUM_NCR_HUBS } from "@/data/hubs";

export const SITE_BRAND_NAME = "AURUM EV";
export const SITE_LEGAL_NAME = "Aurum Fleet Solutions Pvt Ltd";
export const DEFAULT_OG_IMAGE = "/images/aurum-og-preview.jpg";

export const STATIC_BLOG_SLUGS = [
  "why-indian-delivery-fleets-are-going-electric",
  "comparing-petrol-vs-electric-commuting-costs",
  "ev-fleet-maintenance-structured-approach",
  "corporate-ev-fleet-benefits-india",
] as const;

export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

interface BuildPageMetadataOptions {
  title: string;
  absoluteTitle?: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  absoluteTitle,
  description,
  path,
  type = "website",
  publishedTime,
  keywords,
  noIndex = false,
}: BuildPageMetadataOptions): Metadata {
  const canonical = path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  const cleanTitle = title.replace(/\s*\|\s*AURUM EV\s*$/i, "").trim();
  const socialTitle = absoluteTitle ?? `${cleanTitle} | ${SITE_BRAND_NAME}`;

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : cleanTitle,
    description,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    alternates: {
      canonical,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type,
      locale: "en_IN",
      siteName: SITE_BRAND_NAME,
      title: socialTitle,
      description,
      url: canonical,
      ...(publishedTime ? { publishedTime } : {}),
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: socialTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export function buildOrganizationJsonLd(appUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${appUrl}/#organization`,
    name: SITE_BRAND_NAME,
    legalName: SITE_LEGAL_NAME,
    url: appUrl,
    logo: `${appUrl}/images/aurum-emblem.png`,
    slogan: "Driven by Trust. Powered by Tomorrow.",
    email: "info@aurumfleets.com",
    telephone: "+91-77799-90277",
    areaServed: [
      { "@type": "City", name: "New Delhi" },
      { "@type": "City", name: "Noida" },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-77799-90277",
        contactType: "customer service",
        email: "info@aurumfleets.com",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
  };
}

export function buildWebSiteJsonLd(appUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${appUrl}/#website`,
    name: SITE_BRAND_NAME,
    alternateName: SITE_LEGAL_NAME,
    url: appUrl,
    inLanguage: "en-IN",
    publisher: {
      "@id": `${appUrl}/#organization`,
    },
  };
}

export function buildBreadcrumbJsonLd(
  appUrl: string,
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.path === "/" ? appUrl : `${appUrl}${item.path}`,
    })),
  };
}

export function buildFaqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((faq) => faq.question.trim() && faq.answer.trim())
      .map((faq) => ({
        "@type": "Question",
        name: faq.question.trim(),
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer.trim(),
        },
      })),
  };
}

export function buildLocalBusinessJsonLd(appUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": AURUM_NCR_HUBS.map((hub) => ({
      "@type": "LocalBusiness",
      name: `${SITE_BRAND_NAME} — ${hub.city} (${hub.hub})`,
      url: `${appUrl}/locations`,
      image: `${appUrl}${DEFAULT_OG_IMAGE}`,
      telephone: "+91-77799-90277",
      email: "info@aurumfleets.com",
      parentOrganization: {
        "@id": `${appUrl}/#organization`,
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: hub.address,
        addressLocality: hub.city,
        addressRegion: hub.city === "Delhi" ? "DL" : "UP",
        addressCountry: "IN",
      },
      areaServed: hub.city,
    })),
  };
}

export function buildBlogPostingJsonLd(
  appUrl: string,
  post: {
    slug: string;
    title: string;
    description: string;
    publishedAt?: string | null;
    category?: string | null;
  }
) {
  const url = `${appUrl}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: post.title,
    description: post.description,
    image: [`${appUrl}${DEFAULT_OG_IMAGE}`],
    ...(post.publishedAt ? { datePublished: post.publishedAt, dateModified: post.publishedAt } : {}),
    ...(post.category ? { articleSection: post.category } : {}),
    author: {
      "@type": "Organization",
      name: SITE_LEGAL_NAME,
      url: appUrl,
    },
    publisher: {
      "@id": `${appUrl}/#organization`,
    },
  };
}
