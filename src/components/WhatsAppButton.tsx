"use client";

import { useEffect, useState } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";

const DEFAULT_WHATSAPP_NUMBER = "917779990277";
const WHATSAPP_MESSAGE =
  "Hi AURUM EV team! I'm interested in electric two-wheeler rentals and would like more details.";

function formatWhatsAppDigits(input?: string): string {
  const raw =
    input?.trim() ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ||
    DEFAULT_WHATSAPP_NUMBER;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits.length >= 10 ? digits : DEFAULT_WHATSAPP_NUMBER;
}

export function WhatsAppButton({ whatsapp }: { whatsapp?: string }) {
  const [visible, setVisible] = useState(false);
  const waDigits = formatWhatsAppDigits(whatsapp);
  const href = `https://wa.me/${waDigits}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 right-4 z-40 md:bottom-7 md:right-7">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with AURUM EV on WhatsApp (+91 7779990277)"
        title="WhatsApp AURUM EV (+91 77799 90277)"
        onClick={() => trackAnalyticsEvent("whatsapp_click", { number: waDigits })}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-[#FCAA30]/55 bg-[#0F0F0F]/92 p-1.5 shadow-[0_14px_38px_rgba(0,0,0,0.34),0_0_22px_rgba(252,170,48,0.2)] backdrop-blur-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:border-[#FCAA30] hover:shadow-[0_20px_46px_rgba(0,0,0,0.44),0_0_30px_rgba(252,170,48,0.34)] active:scale-95"
      >
        {/* Subtle rotating champagne halo on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-[#FCAA30]/20 via-transparent to-white/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Emerald WhatsApp Medallion Core */}
        <span className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] via-[#1FC25D] to-[#128C7E] ring-1 ring-white/25 shadow-[0_6px_18px_rgba(37,211,102,0.42)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
        </span>

        {/* Live Availability Dot */}
        <span className="absolute right-0.5 top-0.5 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#0F0F0F] bg-[#16CE69]" />
        </span>
      </a>
    </div>
  );
}
