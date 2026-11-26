import { withTransaction } from "@/lib/db";
import { businessRegistrationSchema } from "@/lib/validation";
import { jsonOk, jsonError } from "@/lib/api-helpers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = businessRegistrationSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Validation failed", 400, parsed.error.flatten());
    }

    const d = parsed.data;

    const result = await withTransaction(async (tx) => {
      const bizRes = await tx.query<{ id: string }>(
        `INSERT INTO business_accounts (
          company_name, business_category, contact_person, email, mobile,
          gst_number, city, required_vehicles, expected_duration, requirements,
          verification_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending')
        RETURNING id`,
        [
          d.companyName,
          d.businessCategory,
          d.contactPerson,
          d.email,
          d.mobile,
          d.gstNumber || null,
          d.city,
          d.requiredVehicles,
          d.expectedDuration,
          d.requirements,
        ]
      );
      const businessId = bizRes.rows[0].id;

      const leadCode = `BIZ-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
      const leadRes = await tx.query<{ id: string }>(
        `INSERT INTO leads (
          lead_code, full_name, phone, email, city, lead_category, source, requirement, status
        ) VALUES ($1, $2, $3, $4, $5, 'corporate', 'business_partnerships', $6, 'new')
        RETURNING id`,
        [
          leadCode,
          `${d.contactPerson} (${d.companyName})`,
          d.mobile,
          d.email,
          d.city,
          `${d.requiredVehicles} EVs for ${d.expectedDuration}. ${d.requirements}`,
        ]
      );

      return { businessId, leadId: leadRes.rows[0].id, leadCode };
    });

    return jsonOk(
      {
        ...result,
        message: "Corporate fleet proposal request submitted successfully.",
      },
      201
    );
  } catch (err) {
    return jsonError("Failed to register business enquiry", 500, {
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
