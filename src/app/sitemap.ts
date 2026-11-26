import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const publicRoutes = [
    "",
    "/rentals",
    "/riders",
    "/business",
    "/invest",
    "/fleet",
    "/locations",
    "/how-it-works",
    "/about",
    "/contact",
    "/faq",
    "/blog",
    "/privacy-policy",
    "/terms-and-conditions",
    "/refund-policy",
    "/rental-policy",
    "/cancellation-policy",
    "/investor-disclosures",
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/blog" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
