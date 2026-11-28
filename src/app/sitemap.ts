import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/app-url";
import { query } from "@/lib/db";
import { STATIC_BLOG_SLUGS } from "@/lib/seo";

export const revalidate = 3600;

const PUBLIC_STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/rentals", changeFrequency: "weekly", priority: 0.9 },
  { path: "/riders", changeFrequency: "weekly", priority: 0.9 },
  { path: "/business", changeFrequency: "weekly", priority: 0.85 },
  { path: "/fleet", changeFrequency: "weekly", priority: 0.85 },
  { path: "/locations", changeFrequency: "monthly", priority: 0.85 },
  { path: "/invest", changeFrequency: "monthly", priority: 0.8 },
  { path: "/how-it-works", changeFrequency: "monthly", priority: 0.8 },
  { path: "/faq", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.75 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.75 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.4 },
  { path: "/rental-policy", changeFrequency: "yearly", priority: 0.5 },
  { path: "/cancellation-policy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/investor-disclosures", changeFrequency: "yearly", priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getAppUrl();
  const staticEntries: MetadataRoute.Sitemap = PUBLIC_STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route.path || "/"}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogSlugMap = new Map<string, Date>();
  for (const slug of STATIC_BLOG_SLUGS) {
    blogSlugMap.set(slug, new Date());
  }

  try {
    const res = await Promise.race([
      query<{ slug: string; published_at: string | null }>(
        "SELECT slug, published_at FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC NULLS LAST"
      ),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
    ]);
    if (res) {
      for (const row of res.rows) {
        if (row.slug) {
          blogSlugMap.set(row.slug, row.published_at ? new Date(row.published_at) : new Date());
        }
      }
    }
  } catch {
    // Fallback cleanly to STATIC_BLOG_SLUGS when database is not initialized
  }

  const blogEntries: MetadataRoute.Sitemap = Array.from(blogSlugMap.entries()).map(
    ([slug, lastModified]) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  return [...staticEntries, ...blogEntries];
}
