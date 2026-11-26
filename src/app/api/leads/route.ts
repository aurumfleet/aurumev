import { query } from "@/lib/db";
import { leadCreateSchema } from "@/lib/validation";
import { jsonOk, jsonError } from "@/lib/api-helpers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = leadCreateSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Validation failed", 400, parsed.error.flatten());
    }

    const data = parsed.data;
    const leadCode = `LEAD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const res = await query<{ id: string; lead_code: string }>(
      `INSERT INTO leads (
        lead_code, full_name, phone, email, city, lead_category, source, campaign_name, requirement, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'new')
      RETURNING id, lead_code`,
      [
        leadCode,
        data.fullName,
        data.phone,
        data.email || null,
        data.city || null,
        data.leadCategory,
        data.source,
        data.campaignName || null,
        data.requirement,
      ]
    );

    const lead = res.rows[0];
    await query(
      `INSERT INTO lead_activities (lead_id, activity_type, summary)
       VALUES ($1, 'created', $2)`,
      [lead.id, `New ${data.leadCategory} enquiry received via ${data.source}.`]
    );

    return jsonOk(
      {
        leadId: lead.id,
        leadCode: lead.lead_code,
        message: "Thank you. Your enquiry has been received by the Aurum EV team.",
      },
      201
    );
  } catch (err) {
    return jsonError("Failed to submit enquiry", 500, {
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
