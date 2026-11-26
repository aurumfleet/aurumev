import { query } from "@/lib/db";
import { jsonOk, jsonError } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await query("SELECT 1 AS ok");
    return jsonOk({
      status: "ok",
      service: "AURUM EV",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return jsonError("Database health check failed", 500, {
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
