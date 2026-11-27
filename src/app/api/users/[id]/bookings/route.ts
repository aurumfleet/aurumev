import { query } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { requireSelfOrStaff } from "@/lib/auth";
import { isValidUuid } from "@/lib/object-auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!isValidUuid(id)) {
    return jsonError("Invalid user ID", 400);
  }

  const auth = await requireSelfOrStaff(request, id);
  if (auth.response) return auth.response;

  const res = await query(
    `SELECT id, booking_number, customer_id, location_id, vehicle_category, duration_type,
            start_date::text, end_date::text, status
     FROM bookings
     WHERE customer_id = $1
     ORDER BY created_at DESC`,
    [id]
  );

  return jsonOk({ bookings: res.rows });
}
