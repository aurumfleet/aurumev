import { z } from "zod";

export const bookingCreateSchema = z.object({
  locationId: z.string().uuid("Select a valid service city/hub"),
  vehicleModelId: z.string().uuid().optional().nullable(),
  rentalPlanId: z.string().uuid().optional().nullable(),
  vehicleCategory: z.enum(["commuter", "delivery", "high_speed", "cargo", "corporate"]),
  durationType: z.enum(["daily", "weekly", "monthly", "long_term_corporate"]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Valid start date required"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Valid end date required"),
  customerName: z.string().trim().min(2, "Full name is required"),
  customerEmail: z.string().trim().email("Valid email is required").toLowerCase(),
  customerPhone: z.string().trim().min(8, "Valid phone number is required").max(20),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the rental terms to submit a request" }),
  }),
  notes: z.string().trim().max(1000).optional(),
});

export const leadCreateSchema = z.object({
  fullName: z.string().trim().min(2, "Name is required").max(120),
  phone: z.string().trim().min(8, "Valid phone is required").max(20),
  email: z.string().trim().email("Valid email is required").optional().or(z.literal("")),
  city: z.string().trim().max(80).optional(),
  leadCategory: z.enum(["rental", "delivery_partner", "individual", "corporate", "investor"]),
  source: z
    .enum([
      "website",
      "instagram",
      "facebook",
      "google_ads",
      "whatsapp",
      "referral",
      "manual_entry",
      "business_partnerships",
    ])
    .default("website"),
  campaignName: z.string().trim().max(120).optional(),
  requirement: z.string().trim().min(3, "Please describe your requirement").max(2000),
});

export const businessRegistrationSchema = z.object({
  companyName: z.string().trim().min(2, "Company name is required").max(160),
  businessCategory: z.string().trim().min(2, "Business category is required").max(100),
  contactPerson: z.string().trim().min(2, "Contact person is required").max(120),
  email: z.string().trim().email("Valid email is required").toLowerCase(),
  mobile: z.string().trim().min(8, "Valid mobile is required").max(20),
  gstNumber: z.string().trim().max(30).optional(),
  city: z.string().trim().min(2, "City is required").max(80),
  requiredVehicles: z.coerce.number().int().min(1, "Enter at least 1 vehicle").max(50000),
  expectedDuration: z.string().trim().min(2, "Expected duration is required").max(80),
  requirements: z.string().trim().min(5, "Please describe fleet requirements").max(2000),
});

export const investorEnquirySchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  email: z.string().trim().email("Valid email is required").toLowerCase(),
  phone: z.string().trim().min(8, "Valid phone is required").max(20),
  city: z.string().trim().max(80).optional(),
  entityType: z.enum(["individual", "hni", "institutional", "corporate"]).default("individual"),
  indicativeInterest: z.string().trim().max(200).optional(),
  message: z.string().trim().min(5, "Please enter your enquiry message").max(2000),
});
