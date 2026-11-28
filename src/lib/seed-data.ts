import { rawQuery as query, rawQueryOne as queryOne } from "./db";
import { RIDER_HELP_CENTRE_FAQS } from "@/data/faqs";
import {
  DEFAULT_CONTACT_SETTINGS,
  DEFAULT_INVESTMENT_CONFIG,
  DEFAULT_PRICING_SETTINGS,
} from "./settings";

export async function syncDelhiNoidaLocations(): Promise<string | null> {
  const noidaAddress =
    "Ground Floor, B 130, Dharampal Satyapal Rd, B Block, Sector 65, Noida, Uttar Pradesh 201301";
  const delhiAddress =
    "Office Number - 201-202, Pearl Best Heights-1, Netaji Subhash Place, New Delhi";

  await query(
    `UPDATE locations
     SET city = 'Noida', state = 'Uttar Pradesh', hub_name = 'Noida Sector 65 Hub',
         address = $1, operating_hours = 'Mon - Sat, 09:00 AM - 07:00 PM IST'
     WHERE city = 'Bengaluru'`,
    [noidaAddress]
  );

  await query(
    `UPDATE locations
     SET city = 'Delhi', state = 'Delhi', hub_name = 'Netaji Subhash Place Hub',
         address = $1, operating_hours = 'Mon - Sat, 09:00 AM - 07:00 PM IST'
     WHERE city = 'Hyderabad'`,
    [delhiAddress]
  );

  const countRes = await queryOne<{ cnt: string }>("SELECT COUNT(*)::text AS cnt FROM locations");
  if (Number(countRes?.cnt ?? "0") === 0) {
    const locRes = await query<{ id: string }>(
      `INSERT INTO locations (city, state, hub_name, address, is_active, operating_hours)
       VALUES
         ('Noida', 'Uttar Pradesh', 'Noida Sector 65 Hub', $1, TRUE, 'Mon - Sat, 09:00 AM - 07:00 PM IST'),
         ('Delhi', 'Delhi', 'Netaji Subhash Place Hub', $2, TRUE, 'Mon - Sat, 09:00 AM - 07:00 PM IST')
       RETURNING id`,
      [noidaAddress, delhiAddress]
    );
    return locRes.rows[0]?.id ?? null;
  }

  const firstLoc = await queryOne<{ id: string }>("SELECT id FROM locations ORDER BY city ASC LIMIT 1");
  return firstLoc?.id ?? null;
}

export async function syncRiderFaqs(): Promise<void> {
  const faqCount = await queryOne<{ cnt: string }>("SELECT COUNT(*)::text AS cnt FROM faqs");
  const hasNewRiderFaqs = await queryOne<{ id: string }>(
    "SELECT id FROM faqs WHERE question = $1 LIMIT 1",
    [RIDER_HELP_CENTRE_FAQS[0].question]
  );
  if (Number(faqCount?.cnt ?? "0") === 0 || !hasNewRiderFaqs) {
    await query("DELETE FROM faqs");
    for (const item of RIDER_HELP_CENTRE_FAQS) {
      await query(
        `INSERT INTO faqs (category, question, answer, sort_order, is_published)
         VALUES ($1, $2, $3, $4, TRUE)`,
        [item.category, item.question, item.answer, item.sortOrder]
      );
    }
  }
}

export async function seedDatabase(): Promise<void> {
  const settingsEntries: Array<{ key: string; value: unknown; description: string }> = [
    {
      key: "contact_settings",
      value: DEFAULT_CONTACT_SETTINGS,
      description: "Centralized company contact numbers, email, address, and social links",
    },
    {
      key: "sustainability_stats",
      value: [
        {
          id: "active-cities",
          label: "Active Service Hubs",
          value: "Pending Verification",
          unit: "Cities",
          verified: false,
        },
        {
          id: "fleet-size",
          label: "Electric Fleet Deployed",
          value: "Pending Verification",
          unit: "EVs",
          verified: false,
        },
      ],
      description: "Verified sustainability metrics (unverified metrics are hidden automatically)",
    },
    {
      key: "investment_config",
      value: DEFAULT_INVESTMENT_CONFIG,
      description: "Investor program disclosures and financial model approval flag",
    },
    {
      key: "pricing_tax_settings",
      value: DEFAULT_PRICING_SETTINGS,
      description: "Commercial GST, currency, and rental deposit configuration",
    },
    {
      key: "cms_homepage",
      value: {
        heroHeadline: "MOVE SMARTER. LIVE BETTER. GO ELECTRIC.",
        heroSubtext:
          "Discover affordable, reliable and flexible electric two-wheeler rental solutions for delivery partners, individuals and businesses.",
        primaryCta: "EXPLORE EV RENTALS",
        secondaryCta: "BUSINESS & INVESTMENT",
      },
      description: "Homepage content configuration",
    },
  ];

  for (const entry of settingsEntries) {
    if (entry.key === "contact_settings") {
      await query(
        `INSERT INTO site_settings (key, value, description)
         VALUES ($1, $2::jsonb, $3)
         ON CONFLICT (key) DO UPDATE SET
           value = EXCLUDED.value,
           updated_at = NOW()
         WHERE site_settings.value->>'supportEmail' = 'support@aurumfleet.example'
            OR site_settings.value->>'phone' LIKE '%Configure%'`,
        [entry.key, JSON.stringify(entry.value), entry.description]
      );
    } else {
      await query(
        `INSERT INTO site_settings (key, value, description)
         VALUES ($1, $2::jsonb, $3)
         ON CONFLICT (key) DO NOTHING`,
        [entry.key, JSON.stringify(entry.value), entry.description]
      );
    }
  }

  // Locations (Delhi & Noida Hubs)
  const defaultLocId: string | null = await syncDelhiNoidaLocations();

  // Vehicle Models (specs_verified = FALSE until verified specs are configured)
  const modelCount = await queryOne<{ cnt: string }>("SELECT COUNT(*)::text AS cnt FROM vehicle_models");
  let firstModelId: string | null = null;
  if (Number(modelCount?.cnt ?? "0") === 0) {
    const modelRes = await query<{ id: string }>(
      `INSERT INTO vehicle_models (
        brand, model_name, category, battery_type, battery_capacity_kwh,
        claimed_range_km, top_speed_kmph, charging_time_hours, image_url,
        specs_verified, description, is_published
      ) VALUES
        ('Aurum Fleet Series', 'City Commuter EV (Specifications Pending)', 'commuter', NULL, NULL, NULL, NULL, NULL, '/images/aurum-ev-studio.png', FALSE, 'Configurable urban commuter electric two-wheeler listing. Verified battery, range, and commercial rates are published upon fleet onboarding.', TRUE),
        ('Aurum Fleet Series', 'Delivery Partner EV (Specifications Pending)', 'delivery', NULL, NULL, NULL, NULL, NULL, '/images/aurum-blinkit.jpg', FALSE, 'Configurable commercial electric two-wheeler built for last-mile delivery partners.', TRUE),
        ('Aurum Fleet Series', 'Corporate Fleet EV (Specifications Pending)', 'corporate', NULL, NULL, NULL, NULL, NULL, '/images/aurum-porter.jpg', FALSE, 'Enterprise fleet electric two-wheeler tier with centralized maintenance support and flexible SLA agreements.', TRUE)
      RETURNING id`
    );
    firstModelId = modelRes.rows[0]?.id ?? null;
  } else {
    await query(
      `UPDATE vehicle_models SET image_url = CASE category
        WHEN 'commuter' THEN '/images/aurum-ev-studio.png'
        WHEN 'delivery' THEN '/images/aurum-blinkit.jpg'
        ELSE '/images/aurum-porter.jpg'
       END
       WHERE image_url IN ('/images/hero-ev-scooter.jpg', '/images/business-ev-fleet.jpg', '/images/studio-ev-scooter.jpg')`
    );
  }

  // Sample Fleet Units
  const vehCount = await queryOne<{ cnt: string }>("SELECT COUNT(*)::text AS cnt FROM vehicles");
  if (Number(vehCount?.cnt ?? "0") === 0 && firstModelId && defaultLocId) {
    await query(
      `INSERT INTO vehicles (
        vehicle_code, model_id, vehicle_name, vehicle_brand, vehicle_model, category,
        image_url, location_id, status, specs_verified, notes
      ) VALUES
        ('AUR-DEV-001', $1, 'Sample Fleet Unit 001', 'Aurum Fleet Series', 'City Commuter EV', 'commuter', '/images/aurum-ev-studio.png', $2, 'available', FALSE, 'Sample fleet listing'),
        ('AUR-DEV-002', $1, 'Sample Fleet Unit 002', 'Aurum Fleet Series', 'Delivery Partner EV', 'delivery', '/images/aurum-blinkit.jpg', $2, 'available', FALSE, 'Sample fleet listing')`,
      [firstModelId, defaultLocId]
    );
  } else {
    await query(
      `UPDATE vehicles SET image_url = CASE category
        WHEN 'commuter' THEN '/images/aurum-ev-studio.png'
        ELSE '/images/aurum-blinkit.jpg'
       END
       WHERE image_url IN ('/images/hero-ev-scooter.jpg', '/images/business-ev-fleet.jpg', '/images/studio-ev-scooter.jpg')`
    );
  }

  // Rental Plans
  const planCount = await queryOne<{ cnt: string }>("SELECT COUNT(*)::text AS cnt FROM rental_plans");
  if (Number(planCount?.cnt ?? "0") === 0) {
    await query(
      `INSERT INTO rental_plans (
        plan_name, duration_type, category, location_id, base_rate, security_deposit,
        pricing_approved, description, is_active
      ) VALUES
        ('Daily EV Flex Pass', 'daily', 'commuter', $1, NULL, NULL, FALSE, 'Short-term daily EV rental request. Exact tariff confirmed upon location and availability check.', TRUE),
        ('Weekly Rider Plan', 'weekly', 'delivery', $1, NULL, NULL, FALSE, '7-day electric two-wheeler plan ideal for gig and delivery partners.', TRUE),
        ('Monthly EV Subscription', 'monthly', 'commuter', $1, NULL, NULL, FALSE, '30-day EV rental plan with scheduled service and support included.', TRUE),
        ('Long-Term Corporate Fleet', 'long_term_corporate', 'corporate', $1, NULL, NULL, FALSE, 'Multi-month B2B electric fleet deployment with dedicated account support.', TRUE)`,
      [defaultLocId]
    );
  }

  // FAQs — sync with Rider Help Centre 15 FAQs
  await syncRiderFaqs();

  // Website Pages
  const pageCount = await queryOne<{ cnt: string }>("SELECT COUNT(*)::text AS cnt FROM website_pages");
  if (Number(pageCount?.cnt ?? "0") === 0) {
    await query(
      `INSERT INTO website_pages (slug, title, seo_title, seo_description, content, status, published_at) VALUES
        ('home', 'Home', 'AURUM EV | Driven by Trust. Powered by Tomorrow.', 'Electric two-wheeler rentals, delivery partner EV plans, corporate fleet solutions, and mobility partnerships by Aurum Fleet Solutions Pvt Ltd.', '{"heroHeadline":"MOVE SMARTER. LIVE BETTER. GO ELECTRIC.","heroSubtext":"Discover affordable, reliable and flexible electric two-wheeler rental solutions for delivery partners, individuals and businesses."}'::jsonb, 'published', NOW()),
        ('about', 'About Us', 'About Aurum Fleet Solutions Pvt Ltd | AURUM EV', 'Learn about Aurum Fleet Solutions Pvt Ltd and our mission to build trustworthy electric two-wheeler mobility across India.', '{"mission":"Making reliable electric mobility accessible to riders, delivery partners, and enterprises."}'::jsonb, 'published', NOW())`
    );
  }

  // Blog Posts
  const blogCount = await queryOne<{ cnt: string }>("SELECT COUNT(*)::text AS cnt FROM blog_posts");
  if (Number(blogCount?.cnt ?? "0") === 0) {
    await query(
      `INSERT INTO blog_posts (slug, title, excerpt, body, category, seo_title, seo_description, status, published_at) VALUES
        ('why-indian-delivery-fleets-are-going-electric', 'Why Last-Mile Delivery Fleets Are Transitioning to Electric Two-Wheelers', 'Exploring how predictable operating costs, lower maintenance complexity, and urban sustainability goals are accelerating EV adoption.', 'Urban last-mile delivery across India is undergoing a structural shift toward electric two-wheelers. Lower per-kilometre energy cost compared to petrol, reduced mechanical wear, and flexible rental models allow riders and logistics operators to manage daily expenses transparently.\n\nAt Aurum Fleet Solutions Pvt Ltd, our focus is reliability: structured preventive maintenance, clear rental agreements, and responsive operational support.', 'Fleet Operations', 'Why Last-Mile Delivery Fleets Are Going Electric | AURUM EV', 'Understand the operational and cost drivers behind electric two-wheeler adoption in Indian urban delivery.', 'published', NOW()),
        ('comparing-petrol-vs-electric-commuting-costs', 'Understanding Total Cost of Ownership: Petrol Scooter vs Electric Two-Wheeler Rental', 'A transparent breakdown of fuel, routine maintenance, and rental structure when evaluating electric mobility.', 'When comparing a petrol scooter against an electric two-wheeler rental, riders should evaluate all components honestly: monthly distance travelled, local petrol prices, vehicle fuel efficiency, routine oil and mechanical servicing, charging tariff, and the rental plan fee.\n\nUse the interactive Aurum EV Savings Calculator with your own actual city figures to estimate monthly and annual differences transparently.', 'Rider Economics', 'Petrol vs Electric Two-Wheeler Cost Breakdown | AURUM EV', 'Learn how to calculate realistic monthly savings when switching from petrol to an electric two-wheeler.', 'published', NOW())`
    );
  }
}
