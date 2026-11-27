import { withTransaction } from "@/lib/db";
import { investorEnquirySchema } from "@/lib/validation";
import { jsonOk, jsonError } from "@/lib/api-helpers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = investorEnquirySchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Validation failed", 400, parsed.error.flatten());
    }

    const d = parsed.data;
    const result = await withTransaction(async (tx) => {
      const leadCode = `INV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
      const leadRes = await tx.query<{ id: string }>(
        `INSERT INTO leads (
          lead_code, full_name, phone, email, city, lead_category, source, requirement, status
        ) VALUES ($1, $2, $3, $4, $5, 'investor', 'website', $6, 'new')
        RETURNING id`,
        [
          leadCode,
          d.fullName,
          d.phone,
          d.email,
          d.city || null,
          `Entity: ${d.entityType}. ${d.indicativeInterest || ""} ${d.message}`.trim(),
        ]
      );

      const enqRes = await tx.query<{ id: string }>(
        `INSERT INTO investor_enquiries (
          full_name, email, phone, city, entity_type, indicative_interest, message, lead_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id`,
        [
          d.fullName,
          d.email,
          d.phone,
          d.city || null,
          d.entityType,
          d.indicativeInterest || null,
          d.message,
          leadRes.rows[0].id,
        ]
      );

      return { enquiryId: enqRes.rows[0].id, leadCode };
    });

    return jsonOk(
      {
        ...result,
        message:
          "Investor enquiry submitted. Our team will share approved program documentation directly upon verification.",
      },
      201
    );
  } catch {
    return jsonError("Failed to submit investor enquiry", 500);
  }
}
