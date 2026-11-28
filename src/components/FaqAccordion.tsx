"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  if (faqs.length === 0) {
    return (
      <p className="text-center text-sm text-[#666666]">
        FAQs are currently being updated. Contact our team for immediate answers.
      </p>
    );
  }

  return (
    <div className="divide-y divide-[#EBEBEB] rounded-3xl border border-[#EBEBEB] bg-white px-6 sm:px-8">
      {faqs.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="py-2">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors"
            >
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9E7524]">
                  {item.category}
                </span>
                <span className="mt-1 block font-display text-base font-medium text-[#0F0F0F] sm:text-lg">
                  {item.question}
                </span>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F4F4]">
                <ChevronDown
                  className={`h-4 w-4 text-[#0F0F0F] transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden text-sm leading-relaxed text-[#666666]">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
