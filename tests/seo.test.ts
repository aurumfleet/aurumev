import fs from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { query, resetDbForTests } from "../src/lib/db";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import {
  STATIC_BLOG_SLUGS,
  buildBlogPostingJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildLocalBusinessJsonLd,
  buildOrganizationJsonLd,
  buildPageMetadata,
  buildWebSiteJsonLd,
  safeJsonLd,
} from "../src/lib/seo";

beforeAll(async () => {
  process.env.VITEST = "true";
  process.env.DATABASE_URL = "pglite://memory";
  await resetDbForTests();
  await query("SELECT 1");
});

describe("AURUM EV SEO Foundations", () => {
  it("configures robots.txt rules and sitemap reference", () => {
    const res = robots();
    expect(res.sitemap).toMatch(/\/sitemap\.xml$/);
    const rules = Array.isArray(res.rules) ? res.rules : [res.rules];
    expect(rules[0]?.allow).toBe("/");
    expect(rules[0]?.disallow).toEqual(
      expect.arrayContaining(["/api", "/admin", "/dashboard", "/portal"])
    );
  });

  it("generates deduplicated sitemap URLs covering static routes and blog articles", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.some((u) => u.endsWith("/rentals"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/locations"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/privacy-policy"))).toBe(true);

    for (const slug of STATIC_BLOG_SLUGS) {
      expect(urls.some((u) => u.endsWith(`/blog/${slug}`))).toBe(true);
    }

    const dbBlogs = await query<{ slug: string }>(
      "SELECT slug FROM blog_posts WHERE status = 'published'"
    );
    for (const row of dbBlogs.rows) {
      expect(urls.some((u) => u.endsWith(`/blog/${row.slug}`))).toBe(true);
    }
  });

  it("builds metadata with canonicals, OG, Twitter, and robots flags", () => {
    const homeMeta = buildPageMetadata({
      title: "Home",
      absoluteTitle: "AURUM EV | Electric Scooter Rentals",
      description: "Rent EVs in Delhi and Noida.",
      path: "/",
    });
    expect(homeMeta.alternates?.canonical).toBe("/");
    expect(homeMeta.openGraph?.url).toBe("/");
    expect(homeMeta.twitter).toBeDefined();
    expect(homeMeta.robots).toMatchObject({ index: true, follow: true });

    const notFoundMeta = buildPageMetadata({
      title: "Not Found",
      description: "Missing article.",
      path: "/blog/missing",
      noIndex: true,
    });
    expect(notFoundMeta.robots).toEqual({ index: false, follow: false });

    const dedupedTitleMeta = buildPageMetadata({
      title: "Why Fleets Switch | AURUM EV",
      description: "Fleet transition overview.",
      path: "/blog/test-slug",
    });
    expect(dedupedTitleMeta.title).toBe("Why Fleets Switch");
  });

  it("produces XSS-safe structured JSON-LD blocks without fake ratings", () => {
    const appUrl = "https://www.aurumfleets.com";
    const org = buildOrganizationJsonLd(appUrl);
    const website = buildWebSiteJsonLd(appUrl);
    const local = buildLocalBusinessJsonLd(appUrl);
    const breadcrumbs = buildBreadcrumbJsonLd(appUrl, [
      { name: "Home", path: "/" },
      { name: "Rentals", path: "/rentals" },
    ]);
    const faqs = buildFaqJsonLd([
      { question: "Can I rent without <script>?", answer: "Yes, in Delhi & Noida." },
    ]);
    const post = buildBlogPostingJsonLd(appUrl, {
      slug: "why-indian-delivery-fleets-are-going-electric",
      title: "Why Fleets Go Electric",
      description: "Fleet transition overview",
      publishedAt: "2026-01-15T00:00:00Z",
    });

    expect(org["@type"]).toBe("Organization");
    expect(website["@type"]).toBe("WebSite");
    expect(local["@graph"].length).toBe(2);
    expect(breadcrumbs.itemListElement).toHaveLength(2);
    expect(post["@type"]).toBe("BlogPosting");

    const serializedFaq = safeJsonLd(faqs);
    expect(serializedFaq).not.toContain("<script>");
    expect(serializedFaq).toContain("\\u003cscript>");
  });

  it("keeps a single H1 in HeroShowcase and metadata on all public pages", () => {
    const heroSource = fs.readFileSync(
      path.join(process.cwd(), "src/components/HeroShowcase.tsx"),
      "utf8"
    );
    const h1Matches = heroSource.match(/<h1\b/g) ?? [];
    expect(h1Matches).toHaveLength(1);

    const appDir = path.join(process.cwd(), "src/app");
    const pageFiles: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name === "page.tsx") pageFiles.push(full);
      }
    };
    walk(appDir);

    expect(pageFiles.length).toBe(19);
    for (const file of pageFiles) {
      const content = fs.readFileSync(file, "utf8");
      expect(content).toMatch(/export (const metadata|async function generateMetadata)/);
      expect(content).toContain("buildPageMetadata");
    }

    const middlewareSource = fs.readFileSync(
      path.join(process.cwd(), "src/middleware.ts"),
      "utf8"
    );
    expect(middlewareSource).toContain('"/terms-and-conditions"');
  });
});
