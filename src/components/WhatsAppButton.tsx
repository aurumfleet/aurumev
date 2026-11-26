"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MessageSquareText } from "lucide-react";

const WHATSAPP_MESSAGE =
  "Hi! I'm interested in AURUM EV electric two-wheeler rentals. Can you help me?";

export function WhatsAppButton({ whatsapp }: { whatsapp?: string }) {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const rawNumber =
    whatsapp?.trim() || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || "";
  const cleanDigits = rawNumber.replace(/\D/g, "");
  const hasValidWhatsApp = cleanDigits.length >= 10;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1200);
    const tooltipShow = setTimeout(() => setShowTooltip(true), 2500);
    const tooltipHide = setTimeout(() => setShowTooltip(false), 7500);
    return () => {
      clearTimeout(timer);
      clearTimeout(tooltipShow);
      clearTimeout(tooltipHide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-2 md:bottom-8 md:right-6">
      {showTooltip && (
        <div className="relative max-w-[200px] rounded-2xl border border-black/5 bg-white px-4 py-2.5 text-xs font-medium text-[#0F0F0F] shadow-elevated">
          {hasValidWhatsApp ? "Chat with us on WhatsApp" : "Need help? Enquire online"}
          <div className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45 bg-white" />
        </div>
      )}

      {hasValidWhatsApp ? (
        <a
          href={`https://wa.me/${cleanDigits}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with AURUM EV on WhatsApp"
          className="group relative flex h-12 w-12 items-center justify-center rounded-full shadow-elevated transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_30px_rgba(37,211,102,0.4)] sm:h-14 sm:w-14"
          style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
          onClick={() => setShowTooltip(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="h-6 w-6 sm:h-7 sm:w-7"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
        </a>
      ) : (
        <Link
          href="/contact"
          aria-label="Contact AURUM EV Support"
          onClick={() => setShowTooltip(false)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F0F0F] text-[#FCAA30] shadow-elevated ring-1 ring-white/15 transition-all duration-300 hover:scale-110 hover:bg-[#FCAA30] hover:text-[#0F0F0F] sm:h-14 sm:w-14"
        >
          <MessageSquareText className="h-5 w-5" />
        </Link>
      )}
    </div>
  );
}
