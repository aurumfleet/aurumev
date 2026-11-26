import { describe, it, expect, beforeAll } from "vitest";
import { query, queryOne, resetDbForTests } from "../src/lib/db";
import { getSiteSettingsBundle } from "../src/lib/settings";
import {
  bookingCreateSchema,
  leadCreateSchema,
  businessRegistrationSchema,
  investorEnquirySchema,
} from "../src/lib/validation";

beforeAll(async () => {
  process.env.VITEST = "true";
  process.env.DATABASE_URL = "pglite://memory";
  await resetDbForTests();
  await query("SELECT 1");
});

describe("AURUM EV Public Website, Database & Enquiry Suite", () => {
  it("applies PostgreSQL schema and seeds public locations, models, plans, FAQs, and blogs", async () => {
    const [locs, models, plans, faqs, blogs] = await Promise.all([
      query("SELECT id FROM locations WHERE is_active = TRUE"),
      query("SELECT id FROM vehicle_models WHERE is_published = TRUE"),
      query("SELECT id FROM rental_plans WHERE is_active = TRUE"),
      query("SELECT id FROM faqs WHERE is_published = TRUE"),
      query("SELECT id FROM blog_posts WHERE status = 'published'"),
    ]);

    expect(locs.rows.length).toBeGreaterThanOrEqual(2);
    expect(models.rows.length).toBeGreaterThanOrEqual(3);
    expect(plans.rows.length).toBeGreaterThanOrEqual(4);
    expect(faqs.rows.length).toBeGreaterThanOrEqual(5);
    expect(blogs.rows.length).toBeGreaterThanOrEqual(2);
  });

  it("validates public booking, lead, business proposal, and investor enquiry schemas", () => {
    const locId = "11111111-1111-1111-1111-111111111111";
    expect(
      bookingCreateSchema.safeParse({
        locationId: locId,
        vehicleCategory: "delivery",
        durationType: "monthly",
        startDate: "2026-12-01",
        endDate: "2026-12-30",
        customerName: "Test Rider",
        customerEmail: "rider@example.com",
        customerPhone: "+919876543210",
        termsAccepted: true,
      }).success
    ).toBe(true);

    expect(
      leadCreateSchema.safeParse({
        fullName: "Test Lead",
        phone: "+919876543210",
        leadCategory: "rental",
        requirement: "Monthly commuter scooter",
      }).success
    ).toBe(true);

    expect(
      businessRegistrationSchema.safeParse({
        companyName: "Urban Logistics Pvt Ltd",
        businessCategory: "Last-Mile Delivery",
        contactPerson: "Ops Lead",
        email: "ops@urban.example",
        mobile: "+919876543211",
        city: "Bengaluru",
        requiredVehicles: 15,
        expectedDuration: "12 Months",
        requirements: "15 delivery scooters for Bengaluru hub",
      }).success
    ).toBe(true);

    expect(
      investorEnquirySchema.safeParse({
        fullName: "Test Investor",
        email: "inv@example.com",
        phone: "+919876543212",
        message: "Requesting official fleet partnership information",
      }).success
    ).toBe(true);
  });

  it("stores booking requests in new_request status and logs corresponding lead", async () => {
    const loc = await queryOne<{ id: string }>("SELECT id FROM locations LIMIT 1");
    expect(loc).toBeTruthy();

    const inserted = await query<{ id: string; status: string }>(
      `INSERT INTO bookings (
        booking_number, location_id, vehicle_category, duration_type,
        start_date, end_date, customer_name, customer_email, customer_phone, terms_accepted, status
      ) VALUES (
        'BK-PUB-001', $1, 'commuter', 'monthly',
        '2026-12-01', '2026-12-31', 'Public Rider', 'pub@example.com', '+919999999990', TRUE, 'new_request'
      ) RETURNING id, status`,
      [loc!.id]
    );

    expect(inserted.rows[0].status).toBe("new_request");
  });

  it("keeps unverified sustainability stats hidden and investment model flag guarded", async () => {
    const settings = await getSiteSettingsBundle();
    expect(settings.investment.financialModelApproved).toBe(false);
    expect(settings.investment.publicStatusMessage).toContain("currently being finalized");
    expect(settings.sustainabilityStats.filter((s) => s.verified)).toHaveLength(0);
  });
});
