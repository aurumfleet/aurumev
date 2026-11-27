import { jsonOk } from "@/lib/api-helpers";
import { authorizeBusinessAccess } from "@/lib/object-auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const authz = await authorizeBusinessAccess(request, id);
  if (authz.response) return authz.response;

  return jsonOk({ business: authz.resource });
}
