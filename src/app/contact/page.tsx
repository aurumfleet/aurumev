import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";
import { getSiteSetting, DEFAULT_CONTACT_SETTINGS, type ContactSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Reach Aurum Fleet Solutions Pvt Ltd for EV rentals, business fleet partnerships, or support.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const contact = await getSiteSetting<ContactSettings>(
    "contact_settings",
    DEFAULT_CONTACT_SETTINGS
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F4F4]">
      <Navbar />
      <main className="flex-1 py-16 sm:py-20">
        <div className="aurum-container grid gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#0667F4]">
                Get in Touch
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-[#0F0F0F] sm:text-5xl">
                Contact AURUM EV.
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[#666666]">
                Reach Aurum Fleet Solutions Pvt Ltd directly for rental bookings, delivery partner
                plans, business fleets, or general inquiries.
              </p>
            </div>

            <div className="aurum-card space-y-5">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#0667F4]" />
                <div>
                  <p className="text-xs font-semibold uppercase text-[#666666]">Phone &amp; WhatsApp</p>
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                    className="font-medium text-[#0F0F0F] transition-colors hover:text-[#0667F4]"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#0667F4]" />
                <div>
                  <p className="text-xs font-semibold uppercase text-[#666666]">Support Email</p>
                  <a
                    href={`mailto:${contact.supportEmail}`}
                    className="font-medium text-[#0F0F0F] transition-colors hover:text-[#0667F4]"
                  >
                    {contact.supportEmail}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#0667F4]" />
                <div>
                  <p className="text-xs font-semibold uppercase text-[#666666]">Registered Office</p>
                  <p className="font-medium leading-relaxed text-[#0F0F0F]">{contact.officeAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#0667F4]" />
                <div>
                  <p className="text-xs font-semibold uppercase text-[#666666]">Operating Hours</p>
                  <p className="font-medium text-[#0F0F0F]">{contact.operatingHours}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <LeadForm
              title="Send a Message to Our Team"
              subtitle="Your enquiry is logged and routed directly to the appropriate Aurum operations or partnership specialist."
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
