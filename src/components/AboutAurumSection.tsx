import Image from "next/image";
import { RevealOnScroll } from "./MotionPrimitives";

const COMPANY_FACTS = [
  {
    code: "01",
    label: "COMPANY NAME",
    value: "Aurum Fleet Solutions Private Limited",
  },
  {
    code: "02",
    label: "INCORPORATION DATE",
    value: "21 May 2026",
  },
  {
    code: "03",
    label: "BUSINESS FOCUS",
    value: "Motor Vehicle Renting & Leasing",
  },
];

const STATEMENTS = [
  {
    title: "OUR MISSION",
    body: "To make electric mobility accessible through reliable EV rental solutions and efficient fleet operations.",
  },
  {
    title: "OUR VISION",
    body: "To contribute to India's electric mobility transition by building a scalable and sustainable fleet ecosystem.",
  },
];

export function AboutAurumSection() {
  return (
    <section
      id="about-aurum"
      className="border-b border-[#EBEBEB] bg-white py-20 text-[#0F0F0F] sm:py-28"
    >
      <div className="aurum-container">
        {/* Main Two-Column Composition */}
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* LEFT SIDE – Visual */}
          <RevealOnScroll className="lg:col-span-6">
            <div className="relative aspect-[16/11] w-full overflow-hidden rounded-3xl border border-black/[0.06] bg-[#F4F4F4] shadow-[0_24px_64px_rgba(15,15,15,0.08)]">
              <Image
                src="/images/aurum-about-fleet.jpg"
                alt="Organized fleet of white electric two-wheelers at an Aurum Fleet Solutions deployment hub in India"
                fill
                className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </RevealOnScroll>

          {/* RIGHT SIDE – Company Introduction */}
          <RevealOnScroll delayMs={100} className="lg:col-span-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#C69A43]">
              ABOUT AURUM
            </p>

            <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#0F0F0F] sm:text-5xl">
              Driving the Future of Electric Mobility.
            </h2>

            {/* Subtle Metallic Gold Divider */}
            <div className="my-7 h-px w-16 bg-gradient-to-r from-[#C69A43] to-[#C69A43]/15" />

            <div className="space-y-4 text-base leading-[1.75] text-[#4A4F57] sm:text-[17px]">
              <p>
                Aurum Fleet Solutions Private Limited is an Indian mobility company focused on
                renting and leasing motor vehicles. We are building an accessible and efficient
                electric mobility ecosystem by connecting EV assets, fleet operations and
                India&apos;s growing delivery economy.
              </p>
              <p>
                Our approach combines vehicle deployment, managed fleet operations and structured
                investment opportunities to support the evolving needs of India&apos;s delivery and
                mobility sector.
              </p>
            </div>
          </RevealOnScroll>
        </div>

        {/* Three Company Information Blocks */}
        <div className="mt-16 border-t border-black/[0.08] pt-12">
          <div className="grid gap-6 sm:grid-cols-3 lg:gap-10">
            {COMPANY_FACTS.map((fact, idx) => (
              <RevealOnScroll key={fact.code} delayMs={idx * 70}>
                <div className="rounded-2xl border border-black/[0.06] bg-[#FAFAFB] px-6 py-6 transition-colors duration-300 hover:border-[#C69A43]/45">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C69A43]">
                    {fact.code} — {fact.label}
                  </p>
                  <p className="mt-2.5 font-display text-lg font-medium tracking-[-0.015em] text-[#0F0F0F] sm:text-xl">
                    {fact.value}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* Mission & Vision Horizontal Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {STATEMENTS.map((item, idx) => (
            <RevealOnScroll key={item.title} delayMs={idx * 90}>
              <div className="relative h-full overflow-hidden rounded-3xl border border-black/[0.07] bg-white p-8 shadow-[0_10px_34px_rgba(15,15,15,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C69A43]/50 hover:shadow-[0_18px_44px_rgba(15,15,15,0.07)] sm:p-10">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#C69A43] via-[#E9CC86] to-transparent"
                />
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#C69A43]">
                  {item.title}
                </p>
                <p className="mt-4 font-display text-xl font-medium leading-[1.4] tracking-[-0.02em] text-[#0F0F0F] sm:text-2xl">
                  “{item.body}”
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
