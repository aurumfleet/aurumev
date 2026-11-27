import { query } from "@/lib/db";
import { jsonOk, jsonError } from "@/lib/api-helpers";
import { getSiteSettingsBundle } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [locations, vehicleModels, rentalPlans, faqs, testimonials, blogPosts, settings, homePage] =
      await Promise.all([
        query("SELECT id, city, state, hub_name, address, operating_hours FROM locations WHERE is_active = TRUE ORDER BY city ASC"),
        query("SELECT id, brand, model_name, category, battery_type, battery_capacity_kwh, claimed_range_km, top_speed_kmph, charging_time_hours, image_url, specs_verified, description FROM vehicle_models WHERE is_published = TRUE ORDER BY created_at ASC"),
        query("SELECT id, plan_name, duration_type, category, location_id, base_rate, security_deposit, pricing_approved, included_km, description FROM rental_plans WHERE is_active = TRUE ORDER BY duration_type ASC"),
        query("SELECT id, category, question, answer, sort_order FROM faqs WHERE is_published = TRUE ORDER BY sort_order ASC, created_at ASC"),
        query("SELECT id, customer_name, customer_category, review_text, photo_url, city FROM testimonials WHERE approval_status = 'approved' AND is_verified = TRUE ORDER BY created_at DESC"),
        query("SELECT id, slug, title, excerpt, cover_image_url, category, published_at FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC NULLS LAST"),
        getSiteSettingsBundle(),
        query("SELECT content, seo_title, seo_description FROM website_pages WHERE slug = 'home' AND status = 'published' LIMIT 1"),
      ]);

    return jsonOk({
      locations: locations.rows,
      vehicleModels: vehicleModels.rows,
      rentalPlans: rentalPlans.rows,
      faqs: faqs.rows,
      testimonials: testimonials.rows,
      blogPosts: blogPosts.rows,
      settings: {
        contact: settings.contact,
        // Automatically hide unverified sustainability statistics
        sustainabilityStats: settings.sustainabilityStats.filter((s) => s.verified),
        investment: settings.investment,
        pricing: settings.pricing,
      },
      homepage: homePage.rows[0] ?? null,
    });
  } catch {
    return jsonError("Failed to load public catalog", 500);
  }
}
