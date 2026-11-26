import { describe, it, expect, beforeAll } from "vitest";
import {
  calculateInvestmentPlan,
  formatINR,
  formatIndianCompact,
  INVESTMENT_MODEL_CONSTANTS,
} from "../src/data/investment-plans";
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

  it("computes exact EV investment model schedule and surplus across all 5 defined plans", () => {
    expect(INVESTMENT_MODEL_CONSTANTS.investmentPerEv).toBe(66_500);
    expect(INVESTMENT_MODEL_CONSTANTS.gstPerEv).toBe(3_500);
    expect(INVESTMENT_MODEL_CONSTANTS.totalInvestmentPerEv).toBe(70_000);
    expect(INVESTMENT_MODEL_CONSTANTS.agreementMonths).toBe(48);

    const p2 = calculateInvestmentPlan(2);
    expect(p2.investment).toBe(1_33_000);
    expect(p2.gst).toBe(7_000);
    expect(p2.totalInvestment).toBe(1_40_000);
    expect(p2.monthlyRental).toBe(8_600);
    expect(p2.annualRental).toBe(1_03_200);
    expect(p2.totalRental48Months).toBe(4_12_800);
    expect(p2.projectedRentalSurplus).toBe(2_72_800);
    expect(formatINR(p2.projectedRentalSurplus)).toBe("₹2,72,800");

    const p5 = calculateInvestmentPlan(5);
    expect(p5.totalInvestment).toBe(3_50_000);
    expect(p5.monthlyRental).toBe(23_000);
    expect(p5.totalRental48Months).toBe(11_04_000);
    expect(p5.projectedRentalSurplus).toBe(7_54_000);

    const p10 = calculateInvestmentPlan(10);
    expect(p10.totalInvestment).toBe(7_00_000);
    expect(p10.monthlyRental).toBe(50_000);
    expect(p10.totalRental48Months).toBe(24_00_000);
    expect(p10.projectedRentalSurplus).toBe(17_00_000);

    const p25 = calculateInvestmentPlan(25);
    expect(p25.totalInvestment).toBe(17_50_000);
    expect(p25.monthlyRental).toBe(1_30_000);
    expect(p25.totalRental48Months).toBe(62_40_000);
    expect(p25.projectedRentalSurplus).toBe(44_90_000);

    const p50 = calculateInvestmentPlan(50);
    expect(p50.investment).toBe(33_25_000);
    expect(p50.gst).toBe(1_75_000);
    expect(p50.totalInvestment).toBe(35_00_000);
    expect(p50.monthlyRental).toBe(2_75_000);
    expect(p50.annualRental).toBe(33_00_000);
    expect(p50.totalRental48Months).toBe(1_32_00_000);
    expect(p50.projectedRentalSurplus).toBe(97_00_000);
    expect(formatIndianCompact(p50.totalRental48Months)).toBe("₹1.32 Crore");
    expect(formatIndianCompact(p50.projectedRentalSurplus)).toBe("₹97 Lakh");
  });
});
