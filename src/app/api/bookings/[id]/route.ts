import { query } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { authorizeBookingAccess } from "@/lib/object-auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const authz = await authorizeBookingAccess(request, id);
  if (authz.response) return authz.response;

  return jsonOk({ booking: authz.resource });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const authz = await authorizeBookingAccess(request, id);
  if (authz.response) return authz.response;

  if (authz.resource.status !== "new_request") {
    return jsonError(
      "Only pending booking requests can be cancelled via this endpoint",
      409
    );
  }

  await query("UPDATE bookings SET status = 'cancelled' WHERE id = $1", [
    authz.resource.id,
  ]);
  return jsonOk({ cancelled: true, id: authz.resource.id });
}
