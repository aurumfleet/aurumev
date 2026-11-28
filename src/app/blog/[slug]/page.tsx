import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { queryOne } from "@/lib/db";
import { getAppUrl } from "@/lib/app-url";
import {
  buildBlogPostingJsonLd,
  buildBreadcrumbJsonLd,
  buildPageMetadata,
  safeJsonLd,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

// Static fallback content for blog posts not in DB
const STATIC_POST_CONTENT: Record<string, { title: string; body: string; category: string; published_at: string; excerpt: string }> = {
  "why-indian-delivery-fleets-are-going-electric": {
    title: "Why Last-Mile Delivery Fleets Are Transitioning to Electric Two-Wheelers",
    category: "Fleet Operations",
    published_at: "2026-01-15T00:00:00Z",
    excerpt: "Exploring how predictable operating costs and lower maintenance complexity are accelerating EV adoption.",
    body: `Urban last-mile delivery across India is undergoing a structural shift toward electric two-wheelers.

**The Core Economics**

The appeal is straightforward: lower per-kilometre energy cost compared to petrol, reduced mechanical wear, and flexible rental models allow riders and logistics operators to manage daily expenses more transparently.

A petrol two-wheeler running 80–100 km per day at ₹100/litre petrol and 40–50 km per litre mileage costs approximately ₹160–250 in fuel alone. An equivalent electric two-wheeler on a standard grid charging tariff can cost significantly less per kilometre, depending on local electricity rates and charging access.

**Maintenance Simplicity**

Electric drivetrains have fewer moving parts than internal combustion engines. This translates to fewer scheduled maintenance items: no engine oil changes, no air filter replacements, no carburetor tuning. At Aurum Fleet Solutions Pvt Ltd, our structured preventive maintenance cycles focus on battery health checks, brake inspections, tyre condition, and electrical system verification.

**Fleet Operator Perspective**

For logistics businesses deploying 20, 50, or 100 vehicles, the cumulative cost difference becomes substantial. Combined with GST-eligible rental agreements and centralized maintenance tracking, corporate electric fleet rental creates a more manageable monthly expenditure profile.

**Honest Caveats**

Charging infrastructure remains a critical variable. Fleet operators need reliable access to charging points — either at a base hub or through a network. At Aurum EV, every service hub includes hub-level charging access as part of the rental arrangement.

Range anxiety is another consideration. Modern electric two-wheelers designed for Indian urban use typically offer 70–120 km real-world range, which is sufficient for most last-mile delivery routes. However, riders should verify their expected daily distance against the vehicle's verified range figures before committing to a plan.

**The Structural Shift**

The Indian delivery ecosystem is witnessing a generational shift — not because electric vehicles are perfect, but because for specific use cases (urban, predictable routes, hub-based operations), the economics are becoming increasingly compelling.

At Aurum Fleet Solutions Pvt Ltd, we are building the operational infrastructure — structured rental agreements, preventive maintenance protocols, and transparent reporting — that makes this transition practical for delivery partners and enterprise fleets alike.`,
  },
  "comparing-petrol-vs-electric-commuting-costs": {
    title: "Understanding Total Cost of Ownership: Petrol Scooter vs Electric Two-Wheeler Rental",
    category: "Rider Economics",
    published_at: "2026-02-10T00:00:00Z",
    excerpt: "A transparent breakdown of fuel, maintenance, and rental costs when evaluating electric mobility.",
    body: `When comparing the real cost of riding a petrol scooter against renting an electric two-wheeler, the analysis needs to be honest and complete — not just focused on fuel savings.

**What to Actually Calculate**

For a petrol scooter, the true monthly cost includes:

1. **Fuel cost** — Monthly distance ÷ mileage (km/litre) × petrol price (₹/litre)
2. **Oil & filter service** — Typically every 2,000–3,000 km for most petrol scooters
3. **Tyre wear** — Factored over the life expectancy of a set of tyres
4. **Insurance EMI** — If you own the vehicle
5. **Depreciation** — The vehicle loses value every month

For an electric two-wheeler rental, the monthly cost includes:

1. **Rental plan fee** — Fixed monthly charge per the agreed rental plan
2. **Charging cost** — Units consumed × local electricity tariff (typically ₹6–9 per unit in Indian cities)
3. **Any applicable deposit or one-time fees** — Disclosed upfront

**The Maintenance Advantage**

This is where the comparison often surprises riders. A petrol scooter running 80+ km per day accumulates petrol service costs quickly. Dedicated delivery partners often spend ₹800–1,500 per month on engine-related maintenance.

With an electric two-wheeler rental from Aurum EV, scheduled preventive maintenance is built into the operational structure at the hub level. Riders are not responsible for sourcing their own mechanics or tracking service intervals.

**Use Our Calculator**

The Aurum EV Savings Calculator on our homepage allows you to enter your actual monthly distance, local petrol price, your petrol vehicle's mileage, an estimated rental plan price, and your local charging tariff. The output shows all components transparently — not just a headline savings number.

Important: The calculator uses your inputs as assumptions. Actual costs will vary by city, riding pattern, petrol price fluctuations, and specific rental plan. Always evaluate using your real figures.

**The Honest Answer**

For daily commuters riding 30–60 km and delivery partners riding 70–120 km per day, an electric two-wheeler rental can offer meaningful monthly savings — particularly when factoring in maintenance cost avoidance. For occasional riders doing under 20 km per day, the savings may be more marginal.

We encourage every prospective rider to run the numbers with their own inputs before making a decision.`,
  },
  "ev-fleet-maintenance-structured-approach": {
    title: "How Structured Preventive Maintenance Protects EV Fleet Uptime",
    category: "Operations",
    published_at: "2026-03-05T00:00:00Z",
    excerpt: "Preventive servicing, documented maintenance cycles, and hub-level operational discipline are the backbone of reliable EV fleet management.",
    body: `For any fleet operator, downtime is the most expensive cost — more expensive than fuel, more expensive than the rental plan itself. A delivery partner whose vehicle is off the road for a day loses that day's income. A corporate fleet with 10 vehicles down simultaneously creates serious operational disruption.

**The Preventive Maintenance Philosophy**

Reactive maintenance — waiting until something breaks before fixing it — is fundamentally incompatible with reliable fleet operations. Structured preventive maintenance schedules address components before they cause downtime.

For electric two-wheelers, the core preventive maintenance items are:

**Battery System**
- Battery health monitoring (State of Health, charge cycles)
- Cell voltage balance checks
- Thermal management inspection
- Connector and cable inspection

**Braking System**
- Brake pad thickness inspection
- Hydraulic fluid level and condition
- Disc/drum condition assessment

**Tyres & Suspension**
- Tyre pressure verification (critical for range efficiency)
- Tread depth assessment
- Suspension linkage inspection

**Electrical & Control**
- Motor controller diagnostics
- Lighting and indicator verification
- Charging port condition

**Hub-Level Operations at Aurum EV**

Every Aurum service hub operates a scheduled maintenance bay as part of the facility. Vehicles in our rental fleet are tracked at the hub level, with maintenance intervals documented per unit.

Riders on our rental plans benefit from hub-initiated maintenance scheduling — they receive notification when their vehicle is due for a service check, and the process is managed by the hub team rather than left to the rider to arrange.

**Documentation Discipline**

Every maintenance event on an Aurum fleet vehicle is documented: the date, nature of service, parts inspected or replaced, technician responsible, and the vehicle's post-service readiness status. This documentation is maintained as part of the vehicle's operational record.

For fleet partners and corporate clients, maintenance documentation summaries are available as part of the operational reporting structure.

**The Uptime Result**

Structured preventive maintenance does not eliminate all failures — but it dramatically reduces unplanned downtime and extends the operational life of fleet assets. For delivery partners who depend on their EV for daily income, this consistency is not a luxury; it is a necessity.`,
  },
  "corporate-ev-fleet-benefits-india": {
    title: "Five Operational Benefits of Corporate Electric Fleet Rentals for Logistics Businesses",
    category: "Business Fleet",
    published_at: "2026-04-01T00:00:00Z",
    excerpt: "Consolidated GST invoicing, predictable costs, centralized maintenance tracking, and EV transition benefits for enterprise clients.",
    body: `Logistics and enterprise businesses evaluating electric fleet adoption face a consistent set of questions: What is the actual cost? Who manages maintenance? How are agreements structured? What happens when a vehicle needs servicing?

Here are five concrete operational benefits of a structured corporate electric fleet rental arrangement.

**1. Predictable Monthly Cost Structure**

Vehicle ownership comes with volatile costs: fuel price fluctuations, unexpected repair bills, insurance renewal negotiations, depreciation. A rental arrangement converts these variable costs into a predictable monthly fee per vehicle.

For finance and procurement teams, this predictability simplifies budgeting and reduces the risk of month-to-month cost surprises. For businesses with 20–100+ vehicles, the cumulative variance reduction is significant.

**2. GST-Eligible B2B Invoicing**

Commercial rental agreements with Aurum Fleet Solutions Pvt Ltd are structured as B2B transactions with proper GST invoicing. Eligible businesses can claim input tax credit on rental expenses, effectively reducing the net cost of the fleet.

The GST structure and applicable rates depend on your business category and the specific rental arrangement — always consult with your chartered accountant for specific applicability.

**3. Centralized Maintenance Without Internal Infrastructure**

Maintaining a large petrol fleet internally requires workshop space, spare parts inventory, trained mechanics, and service tracking systems. This is a substantial operational overhead that most logistics businesses would prefer not to manage.

Under a structured EV fleet rental, preventive maintenance is handled through Aurum's hub network. The business does not need to build internal maintenance capacity — the operational responsibility sits with the fleet operator.

**4. Flexible Fleet Scaling**

Business demand is rarely constant. A corporate rental arrangement allows fleet size to scale — adding vehicles during peak seasons, reducing during slower periods — without the capital commitment of vehicle ownership.

This flexibility is particularly valuable for businesses in categories like e-commerce logistics, where delivery volumes can vary substantially across the year.

**5. ESG and Sustainability Reporting**

For businesses with sustainability commitments or reporting obligations, an electric fleet transition contributes to documented scope 1 emission reductions. As regulatory and investor attention on ESG metrics grows in India, an electric fleet becomes an asset for sustainability reporting.

**Next Steps**

Businesses interested in a customized electric fleet proposal can submit a request through Aurum EV's Business Solutions page. Our team will design a fleet size, hub coverage, and agreement structure tailored to your operational requirements.`,
  },
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
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

// Estimate reading time
function readTime(text: string) {
  const words = text.split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await queryOne<{
    title: string;
    seo_title: string | null;
    seo_description: string | null;
    excerpt: string | null;
    published_at: string | null;
  }>(
    "SELECT title, seo_title, seo_description, excerpt, published_at FROM blog_posts WHERE slug = $1 AND status = 'published'",
    [slug]
  );
  const fallback = STATIC_POST_CONTENT[slug];
  if (!post && !fallback) {
    return buildPageMetadata({
      title: "Article Not Found",
      description: "The requested AURUM EV article could not be found.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  const title = post?.seo_title ?? post?.title ?? fallback?.title ?? "Blog Post";
  const description =
    post?.seo_description ??
    post?.excerpt ??
    fallback?.excerpt ??
    "Insights on urban electric mobility, EV rentals, and fleet operations by AURUM EV.";

  return buildPageMetadata({
    title,
    description,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post?.published_at ?? fallback?.published_at ?? undefined,
  });
}

function renderInlineBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={idx} className="font-semibold text-[#0F0F0F]">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dbPost = await queryOne<{
    title: string;
    body: string;
    category: string | null;
    published_at: string | null;
    excerpt: string | null;
  }>(
    "SELECT title, body, category, published_at, excerpt FROM blog_posts WHERE slug = $1 AND status = 'published'",
    [slug]
  );

  const staticContent = STATIC_POST_CONTENT[slug];
  const post = dbPost ?? (staticContent ? staticContent : null);
  if (!post) notFound();

  const bodyText = post.body ?? "";
  const paragraphs = bodyText.split(/\n\n+/);
  const rt = readTime(bodyText);
  const appUrl = getAppUrl();
  const articleDesc =
    post.excerpt ??
    "Insights on urban electric mobility, EV rentals, and fleet operations by AURUM EV.";
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(appUrl, [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${slug}` },
  ]);
  const blogPostingJsonLd = buildBlogPostingJsonLd(appUrl, {
    slug,
    title: post.title,
    description: articleDesc,
    publishedAt: post.published_at,
    category: post.category,
  });

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(blogPostingJsonLd) }}
      />
      <Navbar />
      <main className="flex-1">
        {/* Article Header */}
        <section className="bg-[#0F0F0F] pb-14 pt-14 sm:pb-20 sm:pt-20">
          <div className="aurum-container max-w-4xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#FCAA30] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Insights
            </Link>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
              <span
                className={`rounded-full px-3 py-0.5 font-bold uppercase tracking-wider ${categoryColor(post.category ?? null)}`}
              >
                {post.category ?? "Mobility"}
              </span>
              <span className="flex items-center gap-1 text-[#828587]">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.published_at ?? null)}
              </span>
              <span className="flex items-center gap-1 text-[#828587]">
                <Clock className="h-3.5 w-3.5" />
                {rt}
              </span>
            </div>
            <h1 className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl">
              {post.title}
            </h1>
            {"excerpt" in post && post.excerpt && (
              <p className="mt-4 text-base leading-relaxed text-[#B6B8B9] sm:text-lg">
                {(post as typeof STATIC_POST_CONTENT[string]).excerpt}
              </p>
            )}
          </div>
        </section>

        {/* Article Body */}
        <article className="aurum-container max-w-3xl py-14 sm:py-20">
          <div className="prose prose-slate max-w-none space-y-6 text-[#0F0F0F]">
            {paragraphs.map((para, i) => {
              const cleaned = para.replace(/\*\*(.*?)\*\*/g, "$1");
              if (cleaned.trim() === "") return null;
              const isHeading = para.startsWith("**") && para.endsWith("**") && !para.includes("\n");
              return isHeading ? (
                <h2
                  key={i}
                  className="mt-8 font-display text-xl font-semibold text-[#0F0F0F]"
                >
                  {cleaned}
                </h2>
              ) : (
                <p key={i} className="text-base leading-[1.75] text-[#333333]">
                  {renderInlineBold(para)}
                </p>
              );
            })}
          </div>

          {/* Back + Disclaimer */}
          <div className="mt-12 border-t border-[#EBEBEB] pt-10">
            <p className="text-xs text-[#828587]">
              Published by AURUM EV — Aurum Fleet Solutions Pvt Ltd. This article is for
              informational purposes. Specific costs, savings, and operational figures vary by
              city, riding pattern, and rental plan.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/blog" className="aurum-pill-soft">
                <ArrowLeft className="h-4 w-4" />
                All Articles
              </Link>
              <Link href="/rentals" className="aurum-pill-mango">
                Explore Rentals <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
