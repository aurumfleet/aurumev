import { withTransaction } from "@/lib/db";
import { bookingCreateSchema } from "@/lib/validation";
import { jsonOk, jsonError } from "@/lib/api-helpers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bookingCreateSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Booking validation failed", 400, parsed.error.flatten());
    }

    const d = parsed.data;
    if (d.endDate < d.startDate) {
      return jsonError("End date must be on or after start date.", 400);
    }

    const bookingNumber = `BK-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const created = await withTransaction(async (tx) => {
      const loc = await tx.query<{ id: string; city: string }>(
        "SELECT id, city FROM locations WHERE id = $1 AND is_active = TRUE",
        [d.locationId]
      );
      if (loc.rows.length === 0) {
        throw new Error("Selected service location is not currently active.");
      }

      const bRes = await tx.query<Record<string, unknown>>(
        `INSERT INTO bookings (
          booking_number, location_id, vehicle_model_id, rental_plan_id,
          vehicle_category, duration_type, start_date, end_date,
          customer_name, customer_email, customer_phone, terms_accepted, status, admin_notes
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7::date, $8::date, $9, $10, $11, TRUE, 'new_request', $12
        )
        RETURNING *`,
        [
          bookingNumber,
          d.locationId,
          d.vehicleModelId || null,
          d.rentalPlanId || null,
          d.vehicleCategory,
          d.durationType,
          d.startDate,
          d.endDate,
          d.customerName,
          d.customerEmail,
          d.customerPhone,
          d.notes || null,
        ]
      );

      const leadCode = `LEAD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
      await tx.query(
        `INSERT INTO leads (
          lead_code, full_name, phone, email, city, lead_category, source, requirement, status
        ) VALUES ($1, $2, $3, $4, $5, 'rental', 'website', $6, 'new')`,
        [
          leadCode,
          d.customerName,
          d.customerPhone,
          d.customerEmail,
          loc.rows[0].city,
          `Booking ${bookingNumber}: ${d.vehicleCategory} (${d.durationType}) from ${d.startDate} to ${d.endDate}`,
        ]
      );

      return bRes.rows[0];
    });

    return jsonOk(
      {
        booking: created,
        message:
          "Booking request submitted. Availability and final pricing will be confirmed by Aurum Operations.",
      },
      201
    );
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Failed to submit booking request",
      400
    );
  }
}
