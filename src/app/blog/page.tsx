import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowRight, Rss } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { query } from "@/lib/db";
import { RevealOnScroll } from "@/components/MotionPrimitives";

export const metadata: Metadata = {
  title: "Insights & Electric Mobility Blog",
  description:
    "Articles on urban electric mobility, delivery fleet economics, and sustainable two-wheeler operations by AURUM EV.",
};

export const dynamic = "force-dynamic";

// Fallback editorial posts if DB has none
const STATIC_POSTS = [
  {
    id: "s1",
    slug: "why-indian-delivery-fleets-are-going-electric",
    title: "Why Last-Mile Delivery Fleets Are Transitioning to Electric Two-Wheelers",
    excerpt:
      "Exploring how predictable operating costs, lower maintenance complexity, and urban sustainability goals are accelerating EV adoption across Indian cities.",
    category: "Fleet Operations",
    published_at: "2026-01-15T00:00:00Z",
    readTime: "5 min read",
  },
  {
    id: "s2",
    slug: "comparing-petrol-vs-electric-commuting-costs",
    title: "Understanding Total Cost of Ownership: Petrol Scooter vs Electric Two-Wheeler Rental",
    excerpt:
      "A transparent breakdown of fuel, routine maintenance, and rental structure when evaluating electric mobility for daily commuting.",
    category: "Rider Economics",
    published_at: "2026-02-10T00:00:00Z",
    readTime: "6 min read",
  },
  {
    id: "s3",
    slug: "ev-fleet-maintenance-structured-approach",
    title: "How Structured Preventive Maintenance Protects EV Fleet Uptime",
    excerpt:
      "Preventive servicing, documented maintenance cycles, and hub-level operational discipline are the backbone of reliable EV fleet management.",
    category: "Operations",
    published_at: "2026-03-05T00:00:00Z",
    readTime: "4 min read",
  },
  {
    id: "s4",
    slug: "corporate-ev-fleet-benefits-india",
    title: "Five Operational Benefits of Corporate Electric Fleet Rentals for Logistics Businesses",
    excerpt:
      "Consolidated GST invoicing, predictable costs, centralized maintenance tracking, and EV transition benefits for enterprise clients.",
    category: "Business Fleet",
    published_at: "2026-04-01T00:00:00Z",
    readTime: "5 min read",
  },
];

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function categoryColor(cat: string | null) {
  const map: Record<string, string> = {
    "Fleet Operations": "text-[#0667F4] bg-[#EBF2FF]",
    "Rider Economics": "text-[#13B75E] bg-[#EAFAF1]",
    Operations: "text-[#FCAA30] bg-[#FFF7E6]",
    "Business Fleet": "text-[#0F0F0F] bg-[#F4F4F4]",
  };
  return map[cat ?? ""] ?? "text-[#666666] bg-[#F4F4F4]";
}

export default async function BlogPage() {
  const res = await query<{
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    category: string | null;
    published_at: string | null;
  }>(
    "SELECT id, slug, title, excerpt, category, published_at FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC NULLS LAST"
  );

  const dbPosts = res.rows;
  const posts = dbPosts.length > 0 ? dbPosts : STATIC_POSTS;

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#0F0F0F] pb-16 pt-16 sm:pt-20 sm:pb-20">
          <div className="aurum-container">
            <div className="flex items-center gap-2">
              <Rss className="h-4 w-4 text-[#FCAA30]" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#FCAA30]">
                Aurum EV Insights
              </span>
            </div>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl">
              ELECTRIC MOBILITY JOURNAL.
            </h1>
            <p className="mt-4 max-w-xl text-base text-[#B6B8B9]">
              Articles on fleet operations, rider economics, delivery partner transitions, and
              sustainable urban mobility from the Aurum EV team.
            </p>
          </div>
        </section>

        {/* Featured Post */}
        {featured && (
          <section className="bg-[#F4F4F4] py-12">
            <div className="aurum-container">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#666666]">
                Featured Article
              </p>
              <Link
                href={`/blog/${featured.slug}`}
                className="group flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated sm:flex-row sm:items-start"
              >
                <div className="flex-1">
                  <span
                    className={`inline-block rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider ${categoryColor(featured.category)}`}
                  >
                    {featured.category ?? "Mobility"}
                  </span>
                  <h2 className="mt-3 font-display text-2xl font-semibold text-[#0F0F0F] transition-colors group-hover:text-[#0667F4] sm:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#666666]">{featured.excerpt}</p>
                  <div className="mt-5 flex items-center gap-4 text-xs text-[#828587]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(featured.published_at ?? null)}
                    </span>
                    {"readTime" in featured && (
                      <span>{(featured as typeof STATIC_POSTS[0]).readTime}</span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center justify-center rounded-2xl bg-[#0667F4]/10 p-6 sm:w-48">
                  <ArrowRight className="h-8 w-8 text-[#0667F4] transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Article Grid */}
        <section className="py-14 sm:py-16">
          <div className="aurum-container">
            {rest.length > 0 && (
              <>
                <p className="mb-8 text-xs font-semibold uppercase tracking-[0.28em] text-[#666666]">
                  More Articles
                </p>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, i) => (
                    <RevealOnScroll key={post.id} delayMs={i * 70}>
                      <article className="group flex h-full flex-col rounded-3xl border border-[#EBEBEB] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
                        <div className="flex-1">
                          <span
                            className={`inline-block rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider ${categoryColor(post.category)}`}
                          >
                            {post.category ?? "Mobility"}
                          </span>
                          <h3 className="mt-3 font-display text-lg font-semibold text-[#0F0F0F] transition-colors group-hover:text-[#0667F4]">
                            {post.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-[#666666] line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>
                        <div className="mt-5 flex items-center justify-between border-t border-[#EBEBEB] pt-4 text-xs">
                          <span className="flex items-center gap-1 text-[#828587]">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(post.published_at ?? null)}
                          </span>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="font-semibold text-[#0F0F0F] transition-colors hover:text-[#0667F4]"
                          >
                            Read →
                          </Link>
                        </div>
                      </article>
                    </RevealOnScroll>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0F0F0F] py-14">
          <div className="aurum-container text-center">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-white">
              Ready to Switch to Electric?
            </h2>
            <p className="mt-2 text-sm text-[#B6B8B9]">
              Explore our rental plans or calculate your monthly savings before you decide.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/rentals" className="aurum-pill-mango">
                Explore Rentals
              </Link>
              <Link href="/#calculator" className="aurum-pill-light">
                Savings Calculator
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
