import { z } from "zod";
import { requireStaff } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { getSiteSettingsBundle, updateSiteSetting } from "@/lib/settings";

const ALLOWED_SETTING_KEYS = [
  "contact_settings",
  "sustainability_stats",
  "investment_config",
  "pricing_tax_settings",
] as const;

const updateSettingSchema = z.object({
  key: z.enum(ALLOWED_SETTING_KEYS),
  value: z.unknown(),
  description: z.string().trim().min(1).max(200).default("Updated via admin API"),
});

export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if (auth.response) return auth.response;

  const settings = await getSiteSettingsBundle();
  return jsonOk({ settings });
}

export async function PUT(request: Request) {
  const auth = await requireStaff(request);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const parsed = updateSettingSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Invalid setting payload", 400, parsed.error.flatten());
    }

    await updateSiteSetting(
      parsed.data.key,
      parsed.data.value,
      parsed.data.description,
      auth.session
    );

    return jsonOk({ updated: true, key: parsed.data.key });
  } catch {
    return jsonError("Failed to update site setting", 500);
  }
}
