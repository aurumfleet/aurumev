import { getSiteSetting, DEFAULT_CONTACT_SETTINGS, type ContactSettings } from "@/lib/settings";
import { FooterClient } from "./FooterClient";

export async function Footer() {
  const contact = await getSiteSetting<ContactSettings>(
    "contact_settings",
    DEFAULT_CONTACT_SETTINGS
  );

  return <FooterClient contact={contact} />;
}
